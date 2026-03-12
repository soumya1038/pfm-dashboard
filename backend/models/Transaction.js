const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    account: { type: mongoose.Schema.Types.ObjectId, ref: "Account" },
    amount: { type: Number, required: true },
    currency: { type: String, default: "USD" },
    category: { type: String, default: "Uncategorized" },
    merchant: { type: String },
    date: { type: Date, default: Date.now },
    type: { type: String, enum: ["income", "expense"], default: "expense" },
    plaidTransactionId: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Transaction", transactionSchema);
