const mongoose = require("mongoose");

const accountSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    plaidAccountId: { type: String, unique: true, sparse: true },
    plaidAccessToken: { type: String, select: false },
    bankName: { type: String, required: true },
    accountName: { type: String, default: "" },
    accountType: { 
      type: String, 
      enum: ["checking", "savings", "credit", "investment", "loan", "cd", "money market", "paypal", "prepaid", "other"], 
      default: "other" 
    },
    balance: { type: Number, default: 0 },
    currency: { type: String, default: "USD" },
    mask: { type: String, default: "" },
    isActive: { type: Boolean, default: true },
    lastSynced: { type: Date, default: null },
  },
  { timestamps: true }
);

accountSchema.index({ userId: 1 });

module.exports = mongoose.model("Account", accountSchema);
