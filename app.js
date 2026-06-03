// ==============================
// ISR TABLE (SAT simplificada)
// ==============================
const tablaISR = [
  { limInf: 0.01, limSup: 746.04, cuota: 0, tasa: 0.0192 },
  { limInf: 746.05, limSup: 6332.05, cuota: 14.32, tasa: 0.064 },
  { limInf: 6332.06, limSup: 11128.01, cuota: 371.83, tasa: 0.1088 },
  { limInf: 11128.02, limSup: 12935.82, cuota: 893.63, tasa: 0.16 },
  { limInf: 12935.83, limSup: 15487.71, cuota: 1182.88, tasa: 0.1792 },
  { limInf: 15487.72, limSup: 31236.49, cuota: 1640.18, tasa: 0.2136 },
  { limInf: 31236.5, limSup: 49233, cuota: 5004.12, tasa: 0.2352 },
  { limInf: 49233.01, limSup: Infinity, cuota: 9236.89, tasa: 0.30 }
];

// ==============================
// BUSCAR RANGO
// ==============================
function obtenerRango(sueldo) {
  return tablaISR.find(r =>
    sueldo >= r.limInf && sueldo <= r.limSup
  );
}

// ==============================
// CALCULAR ISR
// ==============================
function calcularISR() {
  let sueldo = parseFloat(document.getElementById("sueldo").value);
  let periodo = document.getElementById("periodo").value;

  if (isNaN(sueldo) || sueldo <= 0) return;

  // Convertir a mensual base
  let sueldoMensual = sueldo;

  if (periodo === "quincenal") sueldoMensual = sueldo * 2;
  if (periodo === "semanal") sueldoMensual = sueldo * 4;

  const rango = obtenerRango(sueldoMensual);
  if (!rango) return;

  const excedente = sueldoMensual - rango.limInf;
  const isrMensual = rango.cuota + (excedente * rango.tasa);

  // Regresar al periodo original
  let divisor = 1;
  if (periodo === "quincenal") divisor = 2;
  if (periodo === "semanal") divisor = 4;

  const isr = isrMensual / divisor;
  const neto = sueldo - isr;

  const tasaEfectiva = (isr / sueldo) * 100;
  const ingresoAnual = sueldoMensual * 12;
  const isrAnual = isrMensual * 12;

  // ==============================
  // DOM UPDATE (tu HTML)
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
        legend: {
          labels: {
            color: "white"
          }
        }
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
    document.getElementById(id).textContent =
      id === "tasa" ? "0%" : "$0.00";
  });

  if (window.graficaISR) window.graficaISR.destroy();
}

// ==============================
// DARK MODE (tu botón 🌙)
// ==============================
document.getElementById("themeBtn").addEventListener("click", () => {
  document.body.classList.toggle("dark");

  const btn = document.getElementById("themeBtn");
  btn.textContent = document.body.classList.contains("dark")
    ? "☀️"
    : "🌙";
});
