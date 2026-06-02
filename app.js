const MXN = new Intl.NumberFormat("es-MX", {
  style: "currency",
  currency: "MXN",
});
const output = {
  tax: document.querySelector("#tax-result"),
  net: document.querySelector("#net-result"),
  subsidy: document.querySelector("#subsidy-result"),
  lower: document.querySelector("#lower-limit"),
  excess: document.querySelector("#excess"),
  fixed: document.querySelector("#fixed-fee"),
  rate: document.querySelector("#rate"),
  beforeSubsidy: document.querySelector("#tax-before-subsidy"),
};
const payroll = {
  date: document.querySelector("#payroll-date"),
  period: document.querySelector("#payroll-period"),
  gross: document.querySelector("#payroll-gross"),
  tax: document.querySelector("#payroll-tax"),
  subsidy: document.querySelector("#payroll-subsidy"),
  net: document.querySelector("#payroll-net"),

  income: document.querySelector("#summary-income"),
  deductions: document.querySelector("#summary-deductions"),
  summaryNet: document.querySelector("#summary-net"),
};

const generatePayrollBtn =
  document.querySelector("#generate-payroll");

const printPayrollBtn =
  document.querySelector("#print-payroll");
function updatePayroll(result, salary, period) {

  const periodNames = {
    monthly: "Mensual",
    biweekly: "Quincenal",
  };

  payroll.date.textContent =
    new Date().toLocaleDateString("es-MX");

  payroll.period.textContent =
    periodNames[period] ?? period;

  payroll.gross.textContent =
    MXN.format(salary);

  payroll.tax.textContent =
    MXN.format(result.tax);

  payroll.subsidy.textContent =
    MXN.format(result.subsidy);

  payroll.net.textContent =
    MXN.format(result.net);

  payroll.income.textContent =
    MXN.format(salary);

  payroll.deductions.textContent =
    MXN.format(result.tax);

  payroll.summaryNet.textContent =
    MXN.format(result.net);
}
function render() {

  const salary =
    Number(salaryInput.value) || 0;

  const period =
    new FormData(form).get("period");

  const result = calculateISR(
    salary,
    period,
    subsidyInput.checked
  );

  output.tax.textContent =
    MXN.format(result.tax);

  output.net.textContent =
    MXN.format(result.net);

  output.subsidy.textContent =
    MXN.format(result.subsidy);

  output.lower.textContent =
    MXN.format(result.row.lower);

  output.excess.textContent =
    MXN.format(result.excess);

  output.fixed.textContent =
    MXN.format(result.row.fixed);

  output.rate.textContent =
    `${result.row.rate.toFixed(2)}%`;

  output.beforeSubsidy.textContent =
    MXN.format(result.taxBeforeSubsidy);

  updatePayroll(
    result,
    salary,
    period
  );
}
generatePayrollBtn?.addEventListener(
  "click",
  render
);

printPayrollBtn?.addEventListener(
  "click",
  () => window.print()
);

form.addEventListener(
  "input",
  render
);

subsidyInput.addEventListener(
  "change",
  render
);

render();
