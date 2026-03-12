const Transaction = require("../models/Transaction");

const getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user._id }).sort({ date: -1 });
    return res.status(200).json(transactions);
  } catch (err) {
    return res.status(500).json({ message: err.message || "Failed to fetch transactions" });
  }
};

const createTransaction = async (req, res) => {
  try {
    const { amount, category, merchant, date, type, account } = req.body;

    if (amount === undefined || amount === null) {
      return res.status(400).json({ message: "Amount is required" });
    }

    const transaction = await Transaction.create({
      user: req.user._id,
      account: account || undefined,
      amount,
      category,
      merchant,
      date,
      type,
    });

    return res.status(201).json(transaction);
  } catch (err) {
    return res.status(500).json({ message: err.message || "Failed to create transaction" });
  }
};

const updateTransaction = async (req, res) => {
  try {
    const updated = await Transaction.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    return res.status(200).json(updated);
  } catch (err) {
    return res.status(500).json({ message: err.message || "Failed to update transaction" });
  }
};

const deleteTransaction = async (req, res) => {
  try {
    const deleted = await Transaction.findOneAndDelete({ _id: req.params.id, user: req.user._id });

    if (!deleted) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    return res.status(200).json({ message: "Transaction deleted" });
  } catch (err) {
    return res.status(500).json({ message: err.message || "Failed to delete transaction" });
  }
};

module.exports = { getTransactions, createTransaction, updateTransaction, deleteTransaction };
