
// ==============================
// TARIFAS OFICIALES SAT 2026
// ==============================
const tarifas2026 = {
  mensual: [
    { limInf: 0.01, limSup: 844.59, cuota: 0.00, tasa: 0.0192 },
    { limInf: 844.60, limSup: 7168.51, cuota: 16.22, tasa: 0.0640 },
    { limInf: 7168.52, limSup: 12598.02, cuota: 420.95, tasa: 0.1088 },
    { limInf: 12598.03, limSup: 14644.64, cuota: 1011.68, tasa: 0.1600 },
    { limInf: 14644.65, limSup: 17533.63, cuota: 1339.14, tasa: 0.1792 },
    { limInf: 17533.64, limSup: 35362.83, cuota: 1856.84, tasa: 0.2136 },
    { limInf: 35362.84, limSup: 55736.68, cuota: 5665.16, tasa: 0.2352 },
    { limInf: 55736.69, limSup: 106410.50, cuota: 10457.09, tasa: 0.3000 },
    { limInf: 106410.51, limSup: 141880.66, cuota: 25659.23, tasa: 0.3200 },
    { limInf: 141880.67, limSup: 425641.99, cuota: 37009.69, tasa: 0.3400 },
    { limInf: 425642.00, limSup: Infinity, cuota: 133488.54, tasa: 0.3500 }
  ],
  quincenal: [
    { limInf: 0.01, limSup: 416.55, cuota: 0.00, tasa: 0.0192 },
    { limInf: 416.56, limSup: 3535.05, cuota: 7.98, tasa: 0.0640 },
    { limInf: 3535.06, limSup: 6212.70, cuota: 207.56, tasa: 0.1088 },
    { limInf: 6212.71, limSup: 7222.05, cuota: 499.05, tasa: 0.1600 },
    { limInf: 7222.06, limSup: 8646.75, cuota: 660.45, tasa: 0.1792 },
    { limInf: 8646.76, limSup: 17439.15, cuota: 915.75, tasa: 0.2136 },
    { limInf: 17439.16, limSup: 27486.60, cuota: 2793.60, tasa: 0.2352 },
    { limInf: 27486.61, limSup: 52480.50, cuota: 5156.85, tasa: 0.3000 },
    { limInf: 52480.51, limSup: 69972.60, cuota: 12654.90, tasa: 0.3200 },
    { limInf: 69972.61, limSup: 209917.95, cuota: 18225.30, tasa: 0.3400 },
    { limInf: 209917.96, limSup: Infinity, cuota: 65833.35, tasa: 0.3500 }
  ],
  semanal: [
    { limInf: 0.01, limSup: 194.39, cuota: 0.00, tasa: 0.0192 },
    { limInf: 194.40, limSup: 1649.69, cuota: 3.72, tasa: 0.0640 },
    { limInf: 1649.70, limSup: 2899.26, cuota: 96.88, tasa: 0.1088 },
    { limInf: 2899.27, limSup: 3370.29, cuota: 232.89, tasa: 0.1600 },
    { limInf: 3370.30, limSup: 4035.15, cuota: 308.21, tasa: 0.1792 },
    { limInf: 4035.16, limSup: 8138.27, cuota: 427.35, tasa: 0.2136 },
    { limInf: 8138.28, limSup: 12827.08, cuota: 1303.68, tasa: 0.2352 },
    { limInf: 12827.09, limSup: 24490.90, cuota: 2406.53, tasa: 0.3000 },
    { limInf: 24490.91, limSup: 32653.88, cuota: 5905.62, tasa: 0.3200 },
    { limInf: 32653.89, limSup: 97961.71, cuota: 8517.74, tasa: 0.3400 },
    { limInf: 97961.72, limSup: Infinity, cuota: 30722.23, tasa: 0.3500 }
  ]
};

// ==============================
// BUSCAR RANGO
// ==============================
function obtenerRango(sueldo, periodo) {
  const tabla = tarifas2026[periodo];
  return tabla.find(r => sueldo >= r.limInf && sueldo <= r.limSup);
}

// ==============================
// CALCULAR ISR
// ==============================
function calcularISR() {
  let sueldo = parseFloat(document.getElementById("sueldo").value);
  let periodo = document.getElementById("periodo").value;

  if (isNaN(sueldo) || sueldo <= 0) return;

  // Buscar rango exacto según su periodicidad oficial
  const rango = obtenerRango(sueldo, periodo);
  if (!rango) return;

  // Procedimiento analítico del SAT
  const excedente = sueldo - rango.limInf;
  const isr = rango.cuota + (excedente * rango.tasa);
  const neto = sueldo - isr;

  const tasaEfectiva = (isr / sueldo) * 100;

  // Proyecciones anuales estandarizadas
  let factorAnual = 12;
  if (periodo === "quincenal") factorAnual = 24;
  if (periodo === "semanal") factorAnual = 52;

  const ingresoAnual = sueldo * factorAnual;
  const isrAnual = isr * factorAnual;

  // ==============================
  // DOM UPDATE
  // ==============================
  document.getElementById("bruto").textContent = `$${sueldo.toFixed(2)}`;
  document.getElementById("isr").textContent = `$${isr.toFixed(2)}`;
  document.getElementById("neto").textContent = `$${neto.toFixed(2)}`;

  document.getElementById("detalleISR").textContent = `$${isr.toFixed(2)}`;
  document.getElementById("tasa").textContent = `${tasaEfectiva.toFixed(2)}%`;
  document.getElementById("anual").textContent = `$${ingresoAnual.toFixed(2)}`;
  document.getElementById("isrAnual").textContent = `$${isrAnual.toFixed(2)}`;

  // ==============================
  // GRAFICA
  // ==============================
  const ctx = document.getElementById("grafica");
  if (window.graficaISR) window.graficaISR.destroy();

  window.graficaISR = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: ["Neto", "ISR"],
      datasets: [{
        data: [neto, isr],
        backgroundColor: ["#22c55e", "#ef4444"],
        borderWidth: 0
      }]
    },
    options: {
      plugins: {
        legend: { labels: { color: "white" } }
      }
    }
  });
}

// ==============================
// LIMPIAR
// ==============================
function limpiarFormulario() {
  document.getElementById("sueldo").value = "";
  const ids = ["bruto","isr","neto","detalleISR","tasa","anual","isrAnual"];
  ids.forEach(id => {
    document.getElementById(id).textContent = id === "tasa" ? "0%" : "$0.00";
  });
  if (window.graficaISR) window.graficaISR.destroy();
}

// ==============================
// DARK MODE
// ==============================
document.getElementById("themeBtn").addEventListener("click", () => {
  document.body.classList.toggle("dark");
  const btn = document.getElementById("themeBtn");
  btn.textContent = document.body.classList.contains("dark") ? "☀️" : "🌙";
});

// ==============================
// GENERAR PDF
// ==============================
document.getElementById("pdfBtn").addEventListener("click", () => {
  const sueldo = document.getElementById("sueldo").value;
  if (!sueldo) {
    alert("Por favor, realiza un cálculo primero.");
    return;
  }

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  const periodo = document.getElementById("periodo").value.toUpperCase();
  const bruto = document.getElementById("bruto").textContent;
  const isr = document.getElementById("isr").textContent;
  const neto = document.getElementById("neto").textContent;
  const tasa = document.getElementById("tasa").textContent;
  const anual = document.getElementById("anual").textContent;
  const isrAnual = document.getElementById("isrAnual").textContent;

  doc.setFont("Helvetica", "bold");
  doc.setFontSize(20);
  doc.text("Calculadora ISR México Pro", 20, 25);
 
  doc.setFontSize(12);
  doc.setFont("Helvetica", "normal");
  doc.text("Reporte Oficial de Retenciones Fiscales 2026", 20, 33);
  doc.line(20, 37, 190, 37);

  doc.setFont("Helvetica", "bold");
  doc.text(`Resultados (${periodo}):`, 20, 50);
  doc.setFont("Helvetica", "normal");
  doc.text(`Sueldo Bruto: ${bruto}`, 25, 60);
  doc.text(`ISR Retenido: ${isr}`, 25, 68);
  doc.text(`Sueldo Neto: ${neto}`, 25, 76);

  doc.line(20, 85, 190, 85);
  doc.setFont("Helvetica", "bold");
  doc.text("Proyección Anualizada:", 20, 95);
  doc.setFont("Helvetica", "normal");
  doc.text(`Tasa Efectiva: ${tasa}`, 25, 105);
  doc.text(`Ingreso Anual Bruto: ${anual}`, 25, 113);
  doc.text(`ISR Anual Bruto: ${isrAnual}`, 25, 121);

  doc.setFontSize(9);
  doc.setFont("Helvetica", "italic");
  doc.text("Valores calculados según las tarifas publicadas por el SAT para el ejercicio fiscal 2026.", 20, 140);

  doc.save(`Reporte_ISR_2026_${periodo}.pdf`);
});
