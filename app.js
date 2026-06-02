const MXN = new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN"
});

let chart = null;

const themeBtn = document.getElementById("themeBtn");

themeBtn.addEventListener("click", () => {

    document.body.classList.toggle("dark");

    if(document.body.classList.contains("dark")){
        themeBtn.innerHTML = "☀️";
    }else{
        themeBtn.innerHTML = "🌙";
    }

});

function calcularISR(){

    const sueldo =
        parseFloat(document.getElementById("sueldo").value);

    const periodo =
        document.getElementById("periodo").value;

    if(!sueldo || sueldo <= 0){

        alert("Ingresa un sueldo válido");

        return;
    }

    let sueldoMensual = sueldo;

    if(periodo === "quincenal"){
        sueldoMensual = sueldo * 2;
    }

    if(periodo === "semanal"){
        sueldoMensual = sueldo * 4.333;
    }

    let limiteInferior = 0;
    let cuotaFija = 0;
    let porcentaje = 0;

    if(sueldoMensual <= 746.04){
        limiteInferior = 0.01;
        cuotaFija = 0;
        porcentaje = 1.92;
    }
    else if(sueldoMensual <= 6332.05){
        limiteInferior = 746.05;
        cuotaFija = 14.32;
        porcentaje = 6.40;
    }
    else if(sueldoMensual <= 11128.01){
        limiteInferior = 6332.06;
        cuotaFija = 371.83;
        porcentaje = 10.88;
    }
    else if(sueldoMensual <= 12935.82){
        limiteInferior = 11128.02;
        cuotaFija = 893.63;
        porcentaje = 16.00;
    }
    else if(sueldoMensual <= 15487.71){
        limiteInferior = 12935.83;
        cuotaFija = 1182.88;
        porcentaje = 17.92;
    }
    else if(sueldoMensual <= 31236.49){
        limiteInferior = 15487.72;
        cuotaFija = 1640.18;
        porcentaje = 21.36;
    }
    else if(sueldoMensual <= 49233.00){
        limiteInferior = 31236.50;
        cuotaFija = 5004.12;
        porcentaje = 23.52;
    }
    else if(sueldoMensual <= 93993.90){
        limiteInferior = 49233.01;
        cuotaFija = 9236.89;
        porcentaje = 30.00;
    }
    else{
        limiteInferior = 93993.91;
        cuotaFija = 22665.17;
        porcentaje = 32.00;
    }

    const excedente =
        sueldoMensual - limiteInferior;

    const isrMensual =
        cuotaFija + (excedente * porcentaje / 100);

    let isrPeriodo = isrMensual;

    if(periodo === "quincenal"){
        isrPeriodo = isrMensual / 2;
    }

    if(periodo === "semanal"){
        isrPeriodo = isrMensual / 4.333;
    }

    const neto =
        sueldo - isrPeriodo;

    const tasa =
        (isrPeriodo / sueldo) * 100;

    const ingresoAnual =
        sueldoMensual * 12;

    const isrAnual =
        isrMensual * 12;

    actualizarPantalla(
        sueldo,
        isrPeriodo,
        neto,
        tasa,
        ingresoAnual,
        isrAnual
    );

    crearGrafica(
        isrPeriodo,
        neto
    );

}

function actualizarPantalla(
    sueldo,
    isr,
    neto,
    tasa,
    ingresoAnual,
    isrAnual
){

    document.getElementById("bruto").textContent =
        MXN.format(sueldo);

    document.getElementById("isr").textContent =
        MXN.format(isr);

    document.getElementById("neto").textContent =
        MXN.format(neto);

    document.getElementById("detalleISR").textContent =
        MXN.format(isr);

    document.getElementById("tasa").textContent =
        tasa.toFixed(2) + "%";

    document.getElementById("anual").textContent =
        MXN.format(ingresoAnual);

    document.getElementById("isrAnual").textContent =
        MXN.format(isrAnual);

}

function crearGrafica(
    isr,
    neto
){

    const ctx =
        document
        .getElementById("grafica")
        .getContext("2d");

    if(chart){
        chart.destroy();
    }

    chart = new Chart(ctx, {

        type:"doughnut",

        data:{
            labels:[
                "ISR",
                "Neto"
            ],

            datasets:[{

                data:[
                    isr,
                    neto
                ],

                backgroundColor:[
                    "#ef4444",
                    "#22c55e"
                ],

                borderWidth:0

            }]
        },

        options:{

            responsive:true,

            plugins:{

                legend:{

                    position:"bottom",

                    labels:{
                        color:"#ffffff"
                    }

                }

            }

        }

    });

}

function limpiarFormulario(){

    document.getElementById("sueldo").value = "";

    document.getElementById("bruto").textContent = "$0.00";
    document.getElementById("isr").textContent = "$0.00";
    document.getElementById("neto").textContent = "$0.00";

    document.getElementById("detalleISR").textContent = "$0.00";
    document.getElementById("tasa").textContent = "0%";
    document.getElementById("anual").textContent = "$0.00";
    document.getElementById("isrAnual").textContent = "$0.00";

    if(chart){
        chart.destroy();
        chart = null;
    }

}

document
.getElementById("pdfBtn")
.addEventListener("click", () => {

    const { jsPDF } = window.jspdf;

    const pdf = new jsPDF();

    pdf.setFontSize(18);
    pdf.text(
        "Calculadora ISR México",
        20,
        20
    );

    pdf.setFontSize(12);

    pdf.text(
        "Sueldo Bruto: " +
        document.getElementById("bruto").textContent,
        20,
        40
    );

    pdf.text(
        "ISR: " +
        document.getElementById("isr").textContent,
        20,
        50
    );

    pdf.text(
        "Neto: " +
        document.getElementById("neto").textContent,
        20,
        60
    );

    pdf.text(
        "Ingreso Anual: " +
        document.getElementById("anual").textContent,
        20,
        70
    );

    pdf.text(
        "ISR Anual: " +
        document.getElementById("isrAnual").textContent,
        20,
        80
    );

    pdf.save(
        "ISR_Mexico.pdf"
    );

});
