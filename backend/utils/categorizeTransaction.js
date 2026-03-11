const categorizeTransaction = (merchant = "", amount = 0) => {
  const name = merchant.toLowerCase();

  if (name.includes("uber") || name.includes("lyft") || name.includes("taxi")) {
    return "Transport";
  }

  if (name.includes("walmart") || name.includes("target") || name.includes("costco")) {
    return "Groceries";
  }

  if (name.includes("netflix") || name.includes("spotify") || name.includes("prime")) {
    return "Entertainment";
  }

  if (amount > 0) {
    return "Income";
  }

  return "Other";
};

module.exports = categorizeTransaction;
