const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    accountId: { type: mongoose.Schema.Types.ObjectId, ref: "Account", required: true },
    plaidTransactionId: { type: String, unique: true, sparse: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: "USD" },
    description: { type: String, default: "" },
    merchant: { type: String, default: "" },
    category: { type: String, required: true, default: "Other" },
    type: { type: String, enum: ["income", "expense"], required: true },
    date: { type: Date, required: true },
    pending: { type: Boolean, default: false },
    isManual: { type: Boolean, default: false },
  },
  { timestamps: true }
);

transactionSchema.index({ userId: 1, date: -1 });
transactionSchema.index({ plaidTransactionId: 1 });

module.exports = mongoose.model("Transaction", transactionSchema);
