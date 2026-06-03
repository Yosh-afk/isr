const MXN = new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN"
});

let chart = null;

// =========================
// MODO OSCURO
// =========================

const themeBtn = document.getElementById("themeBtn");

if (themeBtn) {

    themeBtn.addEventListener("click", () => {

        document.body.classList.toggle("dark");

        themeBtn.textContent =
            document.body.classList.contains("dark")
            ? "☀️"
            : "🌙";

    });

}

// =========================
// CALCULAR ISR
// =========================

function calcularISR() {

    const sueldo =
        parseFloat(document.getElementById("sueldo").value);

    const periodo =
        document.getElementById("periodo").value;

    if (isNaN(sueldo) || sueldo <= 0) {
        alert("Ingresa un sueldo válido");
        return;
    }

    let sueldoMensual = sueldo;

    if (periodo === "quincenal") {
        sueldoMensual = sueldo * 2;
    }

    if (periodo === "semanal") {
        sueldoMensual = sueldo * 4.333;
    }

    let limiteInferior;
    let cuotaFija;
    let porcentaje;

    if (sueldoMensual <= 746.04) {
        limiteInferior = 0.01;
        cuotaFija = 0;
        porcentaje = 1.92;
    }
    else if (sueldoMensual <= 6332.05) {
        limiteInferior = 746.05;
        cuotaFija = 14.32;
        porcentaje = 6.40;
    }
    else if (sueldoMensual <= 11128.01) {
        limiteInferior = 6332.06;
        cuotaFija = 371.83;
        porcentaje = 10.88;
    }
    else if (sueldoMensual <= 12935.82) {
        limiteInferior = 11128.02;
        cuotaFija = 893.63;
        porcentaje = 16;
    }
    else if (sueldoMensual <= 15487.71) {
        limiteInferior = 12935.83;
        cuotaFija = 1182.88;
        porcentaje = 17.92;
    }
    else if (sueldoMensual <= 31236.49) {
        limiteInferior = 15487.72;
        cuotaFija = 1640.18;
        porcentaje = 21.36;
    }
    else if (sueldoMensual <= 49233.00) {
        limiteInferior = 31236.50;
        cuotaFija = 5004.12;
        porcentaje = 23.52;
    }
    else if (sueldoMensual <= 93993.90) {
        limiteInferior = 49233.01;
        cuotaFija = 9236.89;
        porcentaje = 30;
    }
    else {
        limiteInferior = 93993.91;
        cuotaFija = 22665.17;
        porcentaje = 32;
    }

    // =========================
    // FÓRMULA ISR CORREGIDA
    // ISR = Cuota Fija + ((Sueldo - Límite Inferior) × Tasa)
    // =========================

    const isrMensual =
        cuotaFija +
        ((sueldoMensual - limiteInferior) * (porcentaje / 100));

    let isr = isrMensual;

    if (periodo === "quincenal") {
        isr = isrMensual / 2;
    }

    if (periodo === "semanal") {
        isr = isrMensual / 4.333;
    }

    const neto = sueldo - isr;

    const tasa =
        ((isr / sueldo) * 100).toFixed(2);

    const ingresoAnual =
        sueldoMensual * 12;

    const isrAnual =
        isrMensual * 12;

    // RESULTADOS

    document.getElementById("bruto").textContent =
        MXN.format(sueldo);

    document.getElementById("isr").textContent =
        MXN.format(isr);

    document.getElementById("neto").textContent =
        MXN.format(neto);

    document.getElementById("detalleISR").textContent =
        MXN.format(isr);

    document.getElementById("tasa").textContent =
        tasa + "%";

    document.getElementById("anual").textContent =
        MXN.format(ingresoAnual);

    document.getElementById("isrAnual").textContent =
        MXN.format(isrAnual);

    crearGrafica(isr, neto);
}

// =========================
// GRÁFICA
// =========================

function crearGrafica(isr, neto) {

    if (typeof Chart === "undefined") return;

    const canvas = document.getElementById("grafica");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    if (chart) chart.destroy();

    chart = new Chart(ctx, {
        type: "doughnut",
        data: {
            labels: ["ISR", "Neto"],
            datasets: [{
                data: [isr, neto],
                backgroundColor: ["#ef4444", "#22c55e"]
            }]
        },
        options: {
            responsive: true
        }
    });
}

// =========================
// LIMPIAR
// =========================

function limpiarFormulario() {

    document.getElementById("sueldo").value = "";

    document.getElementById("bruto").textContent = "$0.00";
    document.getElementById("isr").textContent = "$0.00";
    document.getElementById("neto").textContent = "$0.00";

    document.getElementById("detalleISR").textContent = "$0.00";
    document.getElementById("tasa").textContent = "0%";
    document.getElementById("anual").textContent = "$0.00";
    document.getElementById("isrAnual").textContent = "$0.00";

    if (chart) {
        chart.destroy();
        chart = null;
    }
}

// =========================
// PDF
// =========================

const pdfBtn =
    document.getElementById("pdfBtn");

if (pdfBtn) {

    pdfBtn.addEventListener("click", () => {

        if (typeof window.jspdf === "undefined") {
            alert("jsPDF no se cargó correctamente.");
            return;
        }

        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF();

        pdf.setFontSize(18);
        pdf.text("Calculadora ISR México", 20, 20);

        pdf.setFontSize(12);
        pdf.text("Bruto: " + document.getElementById("bruto").textContent, 20, 40);
        pdf.text("ISR: " + document.getElementById("isr").textContent, 20, 50);
        pdf.text("Neto: " + document.getElementById("neto").textContent, 20, 60);

        pdf.save("ISR_Mexico.pdf");
    });
}
