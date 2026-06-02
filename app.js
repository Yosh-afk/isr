const MXN = new Intl.NumberFormat("es-MX", {
  style: "currency",
  currency: "MXN",
});

// TARIFAS ISR 2026 (SAT - ANEXO 8 RMF 2026)
const TABLES = {
  monthly: {
    days: 30.4,
    rows: [
      { lower: 0.01, upper: 844.59, fixed: 0.00, rate: 1.92 },
      { lower: 844.60, upper: 7168.51, fixed: 16.22, rate: 6.40 },
      { lower: 7168.52, upper: 12598.02, fixed: 420.95, rate: 10.88 },
      { lower: 12598.03, upper: 14644.64, fixed: 1011.68, rate: 16.00 },
      { lower: 14644.65, upper: 17533.64, fixed: 1339.14, rate: 17.92 },
      { lower: 17533.65, upper: 35362.83, fixed: 1856.84, rate: 21.36 },
      { lower: 35362.84, upper: 55736.68, fixed: 5665.16, rate: 23.52 },
      { lower: 55736.69, upper: 106410.50, fixed: 10457.09, rate: 30.00 },
      { lower: 106410.51, upper: 141880.66, fixed: 25659.23, rate: 32.00 },
      { lower: 141880.67, upper: 425641.99, fixed: 37009.69, rate: 34.00 },
      { lower: 425642.00, upper: Infinity, fixed: 133488.54, rate: 35.00 },
    ],
  },

  biweekly: {
    days: 15,
    rows: [
      { lower: 0.01, upper: 416.70, fixed: 0.00, rate: 1.92 },
      { lower: 416.71, upper: 3537.15, fixed: 7.95, rate: 6.40 },
      { lower: 3537.16, upper: 6216.15, fixed: 207.75, rate: 10.88 },
      { lower: 6216.16, upper: 7225.95, fixed: 499.20, rate: 16.00 },
      { lower: 7225.96, upper: 8651.40, fixed: 660.75, rate: 17.92 },
      { lower: 8651.41, upper: 17448.75, fixed: 916.20, rate: 21.36 },
      { lower: 17448.76, upper: 27501.60, fixed: 2795.25, rate: 23.52 },
      { lower: 27501.61, upper: 52505.25, fixed: 5159.70, rate: 30.00 },
      { lower: 52505.26, upper: 70006.95, fixed: 12660.75, rate: 32.00 },
      { lower: 70006.96, upper: 210020.70, fixed: 18261.30, rate: 34.00 },
      { lower: 210020.71, upper: Infinity, fixed: 65866.05, rate: 35.00 },
    ],
  },
};

// UMA 2026
const UMA_DAILY_2026 = 117.31;
const UMA_MONTHLY_2026 = 3566.22;
const UMA_ANNUAL_2026 = 42794.64;

// SUBSIDIO AL EMPLEO 2026
const SUBSIDY_MONTHLY_LIMIT = 11492.66;
const MAX_MONTHLY_SUBSIDY = 535.65;

const form = document.querySelector("#isr-form");
const salaryInput = document.querySelector("#salary");
const subsidyInput = document.querySelector("#apply-subsidy");

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

function findTaxRow(amount, rows) {
  if (amount <= 0) {
    return rows[0];
  }

  return rows.find(
    (row) => amount >= row.lower && amount <= row.upper
  ) ?? rows.at(-1);
}

function calculateSubsidy(amount, period, applySubsidy) {
  if (!applySubsidy) {
    return 0;
  }

  const monthlyEquivalent =
    period === "monthly"
      ? amount
      : amount * 2;

  if (monthlyEquivalent > SUBSIDY_MONTHLY_LIMIT) {
    return 0;
  }

  if (period === "monthly") {
    return MAX_MONTHLY_SUBSIDY;
  }

  return Number(
    (
      (MAX_MONTHLY_SUBSIDY / 30.4) *
      TABLES[period].days
    ).toFixed(2)
  );
}

function calculateISR(amount, period, applySubsidy = true) {
  const table = TABLES[period];

  const row = findTaxRow(amount, table.rows);

  const excess = Math.max(
    amount - row.lower,
    0
  );

  const marginalTax =
    excess * (row.rate / 100);

  const taxBeforeSubsidy =
    row.fixed + marginalTax;

  const subsidy = Math.min(
    calculateSubsidy(
      amount,
      period,
      applySubsidy
    ),
    taxBeforeSubsidy
  );

  const tax = Math.max(
    taxBeforeSubsidy - subsidy,
    0
  );

  const net = amount - tax;

  return {
    row,
    excess,
    subsidy,
    tax,
    taxBeforeSubsidy,
    net,
  };
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
    MXN.format(
      result.taxBeforeSubsidy
    );
}

form.addEventListener("input", render);
subsidyInput.addEventListener(
  "change",
  render
);

render();
