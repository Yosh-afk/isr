// ==============================
// TABLA ISR REAL SAT (MENSUAL)
// ==============================
const tablaISR = [
  { limInf: 0.01, limSup: 416.70, cuota: 0, tasa: 0.0192 },
  { limInf: 416.71, limSup: 3537.15, cuota: 7.95, tasa: 0.064 },
  { limInf: 3537.16, limSup: 6216.15, cuota: 207.75, tasa: 0.1088 },
  { limInf: 6216.16, limSup: 7225.95, cuota: 499.20, tasa: 0.16 },
  { limInf: 7225.96, limSup: 8651.40, cuota: 660.75, tasa: 0.1792 },
  { limInf: 8651.41, limSup: 17448.75, cuota: 916.20, tasa: 0.2136 },
  { limInf: 17448.76, limSup: 27501.60, cuota: 2795.25, tasa: 0.2352 },
  { limInf: 27501.61, limSup: 52505.25, cuota: 5159.70, tasa: 0.30 },
  { limInf: 52505.26, limSup: 70006.95, cuota: 12660.75, tasa: 0.32 },
  { limInf: 70006.96, limSup: 210020.70, cuota: 18261.30, tasa: 0.34 },
  { limInf: 210020.71, limSup: Infinity, cuota: 65866.05, tasa: 0.35 }
];

// ==============================
function obtenerRango(sueldo) {
  return tablaISR.find(r =>
    sueldo >= r.limInf && sueldo <= r.limSup
  );
}

// ==============================
function calcularISR() {

  let sueldo = parseFloat(document.getElementById("sueldo").value);
  let periodo = document.getElementById("periodo").value;

  if (isNaN(sueldo) || sueldo <= 0) return;

  // convertir a mensual
  let mensual = sueldo;

  if (periodo === "quincenal") mensual = sueldo * 2;
  if (periodo === "semanal") mensual = sueldo * 4;

  const rango = obtenerRango(mensual);
  if (!rango) return;

  const excedente = mensual - rango.limInf;
  const isrMensual = rango.cuota + (excedente * rango.tasa);

  let divisor = 1;
  if (periodo === "quincenal") divisor = 2;
  if (periodo === "semanal") divisor = 4;

  const isr = isrMensual / divisor;
  const neto = sueldo - isr;

  const tasa = (isr / sueldo) * 100;

  const anual = mensual * 12;
  const isrAnual = isrMensual * 12;

  // UI
  document.getElementById("bruto").textContent = `$${sueldo.toFixed(2)}`;
  document.getElementById("isr").textContent = `$${isr.toFixed(2)}`;
  document.getElementById("neto").textContent = `$${neto.toFixed(2)}`;

  document.getElementById("detalleISR").textContent = `$${isr.toFixed(2)}`;
  document.getElementById("tasa").textContent = `${tasa.toFixed(2)}%`;
  document.getElementById("anual").textContent = `$${anual.toFixed(2)}`;
  document.getElementById("isrAnual").textContent = `$${isrAnual.toFixed(2)}`;

  // gráfica
  const ctx = document.getElementById("grafica");

  if (window.chart) window.chart.destroy();

  window.chart = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: ["Neto", "ISR"],
      datasets: [{
        data: [neto, isr],
        backgroundColor: ["#22c55e", "#ef4444"]
      }]
    }
  });
}

// ==============================
function limpiarFormulario() {
  document.getElementById("sueldo").value = "";

  ["bruto","isr","neto","detalleISR","tasa","anual","isrAnual"]
  .forEach(id => {
    document.getElementById(id).textContent =
      id === "tasa" ? "0%" : "$0.00";
  });

  if (window.chart) window.chart.destroy();
}

// ==============================
// DARK MODE
// ==============================
document.getElementById("themeBtn").addEventListener("click", () => {
  document.body.classList.toggle("dark");
});
