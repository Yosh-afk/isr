function calcularISR(ingreso){

    let limiteInferior = 0;
    let cuotaFija = 0;
    let porcentaje = 1.92;

    if(ingreso <= 746.04){
        limiteInferior = 0.01;
        cuotaFija = 0;
        porcentaje = 1.92;
    }
    else if(ingreso <= 6332.05){
        limiteInferior = 746.05;
        cuotaFija = 14.32;
        porcentaje = 6.40;
    }
    else if(ingreso <= 11128.01){
        limiteInferior = 6332.06;
        cuotaFija = 371.83;
        porcentaje = 10.88;
    }
    else{
        limiteInferior = 11128.02;
        cuotaFija = 893.63;
        porcentaje = 16.00;
    }

    let excedente = ingreso - limiteInferior;

    return cuotaFija + (excedente * porcentaje / 100);
}

function calcularNomina(){

    let sueldo =
        parseFloat(document.getElementById("sueldo").value) || 0;

    let comisiones =
        parseFloat(document.getElementById("comisiones").value) || 0;

    let septimo =
        parseFloat(document.getElementById("septimo").value) || 0;

    let subtotal =
        sueldo + comisiones + septimo;

    let isr = calcularISR(subtotal);

    let imss = subtotal * 0.025;

    let neto =
        subtotal - isr - imss;

    document.getElementById("rSueldo").innerHTML =
        "$" + sueldo.toFixed(2);

    document.getElementById("rComisiones").innerHTML =
        "$" + comisiones.toFixed(2);

    document.getElementById("rSeptimo").innerHTML =
        "$" + septimo.toFixed(2);

    document.getElementById("rISR").innerHTML =
        "$" + isr.toFixed(2);

    document.getElementById("rIMSS").innerHTML =
        "$" + imss.toFixed(2);

    document.getElementById("rNeto").innerHTML =
        "$" + neto.toFixed(2);
}
