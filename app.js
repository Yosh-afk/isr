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
