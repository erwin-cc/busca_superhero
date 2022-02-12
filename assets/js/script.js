$(function () {
    //Eliminar mensaje de error cuando se va a escribir.
    $("#heroId").focus(() => {
        $("#msgeError").css({ "visibility": "hidden", "top": "75%", "opacity": "0" })
    })

    $("#formBuscaId").submit((event) => {
        event.preventDefault()
        $("#info").css("opacity", "0")
        let heroe = $("#heroId").val();
        //Validación del dato ingresado
        let patronNum = /^\d+$/g
        if (!(patronNum.test(heroe) && heroe >= 1 && heroe <= 731)) {
            $("#msgeError").css({ "visibility": "visible", "top": "125%", "opacity": "1" })
            //LLamado a superheroapi una si el dato ingresado es admitido
        } else {
            $.ajax({
                type: "GET",
                url: "https://www.superheroapi.com/api.php/4905856019427443/" + heroe,
                success: (data) => {
                    $("#info").css("opacity", "1")
                    let nombre = data.name;
                    let nombreCompleto = data.biography["full-name"];
                    let apodosArray = data.biography.aliases;
                    let apodos = apodosArray.join(", ")
                    let editorial = data.biography.publisher;
                    let primeraAparicion = data.biography["first-appearance"];
                    let conexiones1 = data.connections["group-affiliation"];
                    let conexiones2 = data.connections.relatives;
                    let ocupacion = data.work.occupation;
                    let altura = data.appearance.height[1];
                    let peso = data.appearance.weight[1];
                    let imagen = data.image.url;
                    $("#tarjeta").html(`
                    <div class="card mb-3 mx-auto" style="max-width: 540px;">
                        <div class="row g-0">
                            <div class="col-12 col-xl-4 p-2 ps-xl-2 py-xl-2 pe-xl-0 text-center portrait">
                                <img src="${imagen}" id="heroImg" class="img-fluid rounded" alt="Imagen Héroe">
                            </div>
                            <div class="col-12 col-xl-8">
                                <div class="card-body">
                                    <p class="card-text">
                                        <ul>
                                            <li><h5><b>Nombre:</b> ${nombre}.</h5></li>
                                            <li><h6><b>Nombre completo:</b> ${nombreCompleto}.</h5></li>
                                            <li><h6><b>Apodos:</b> ${apodos}.</h5></li><hr>
                                            <li><b>Publicado por:</b> ${editorial}.</li><hr>
                                            <li><b>Altura:</b> ${altura}&emsp;&emsp;&emsp;<b>Peso:</b> ${peso}.</li><hr>
                                            <li><b>Primera aparición:</b> ${primeraAparicion}.</li><hr>
                                            <li><b>Conexiones:</b><br>
                                                <b>Principales:</b> ${conexiones1}.<br>
                                                <b>Otras:</b> ${conexiones2}.
                                            </li><hr>
                                            <li><b>Ocupación:</b> ${ocupacion}.</li>
                                        </ul>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    `);
                    
                    //Revisar que los datos de stat del heroe no sean nulos
                    $("#grafico").css("display", "inherit")
                    let powerstatsArray = Object.entries(data.powerstats);
                    for (const item of powerstatsArray) {
                        if (item[1]=="null"){
                            $("#grafico").css("display", "none")
                            break
                        }              
                    }
                    //Cálculo valores para gráfico
                    let totalStats = powerstatsArray.reduce((acumulador, actual) => {
                        return acumulador + parseInt(actual[1])
                    }, 0)
                    let estadisticas = powerstatsArray.map((item) => {
                        let valor = (item[1] / totalStats) * 100;
                        return { y: valor.toFixed(2), label: item[0] }
                    })
                    //Gráfico
                    var chart = new CanvasJS.Chart("chartContainer", {
                        animationEnabled: true,
                        title: {
                            text: "Estadísticas de combate para " + nombre
                        },
                        data: [{
                            type: "pie",
                            startAngle: 240,
                            yValueFormatString: "##0.00\"%\"",
                            indexLabel: "{label} {y}",
                            dataPoints: estadisticas,
                        }]
                    });
                    chart.render();

                    //Retardar datos hasta que se cargue la imagen y centrar en ellos
                    $("#heroImg").on("load", () => {
                        $('html, body').animate({
                            scrollTop: $("#info").offset().top
                        }, 200);         
                    });

                },
                error: (data) => {
                    alert("Ha ocurrido un error con su solicitud");
                },
            })
        }
    })

});
