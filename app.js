const formatoMXN = new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN"
});

function calcularISR(ingreso, periodo){

    let ingresoMensual = ingreso;

    if(periodo === "semanal"){
        ingresoMensual = ingreso * 4.333;
    }

    if(periodo === "quincenal"){
        ingresoMensual = ingreso * 2;
    }

    let isr = 0;

    if(ingresoMensual <= 746.04){
        isr = ingresoMensual * 0.0192;
    }
    else if(ingresoMensual <= 6332.05){
        isr = 14.32 + ((ingresoMensual - 746.05) * 0.064);
    }
    else if(ingresoMensual <= 11128.01){
        isr = 371.83 + ((ingresoMensual - 6332.06) * 0.1088);
    }
    else if(ingresoMensual <= 12935.82){
        isr = 893.63 + ((ingresoMensual - 11128.02) * 0.16);
    }
    else if(ingresoMensual <= 15487.71){
        isr = 1182.88 + ((ingresoMensual - 12935.83) * 0.1792);
    }
    else if(ingresoMensual <= 31236.49){
        isr = 1640.18 + ((ingresoMensual - 15487.72) * 0.2136);
    }
    else if(ingresoMensual <= 49233){
        isr = 5004.12 + ((ingresoMensual - 31236.50) * 0.2352);
    }
    else if(ingresoMensual <= 93993.90){
        isr = 9236.89 + ((ingresoMensual - 49233.01) * 0.30);
    }
    else{
        isr = 22665.17 + ((ingresoMensual - 93993.91) * 0.32);
    }

    if(periodo === "semanal"){
        return isr / 4.333;
    }

    if(periodo === "quincenal"){
        return isr / 2;
    }

    return isr;
}

function calcularNomina(){

    const sueldo =
        parseFloat(document.getElementById("sueldo").value);

    const periodo =
        document.getElementById("periodo").value;

    if(!sueldo || sueldo <= 0){
        alert("Ingresa un sueldo válido");
        return;
    }

    const isr = calcularISR(sueldo, periodo);

    const imss = sueldo * 0.025;

    const impuestos = isr + imss;

    const neto = sueldo - impuestos;

    document.getElementById("bruto").textContent =
        formatoMXN.format(sueldo);

    document.getElementById("isr").textContent =
        formatoMXN.format(isr);

    document.getElementById("imss").textContent =
        formatoMXN.format(imss);

    document.getElementById("impuestos").textContent =
        formatoMXN.format(impuestos);

    document.getElementById("neto").textContent =
        formatoMXN.format(neto);
}
