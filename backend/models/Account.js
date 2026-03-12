const mongoose = require("mongoose");

const accountSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    institution: { type: String },
    type: { type: String },
    subtype: { type: String },
    balance: { type: Number, default: 0 },
    mask: { type: String },
    plaidAccountId: { type: String },
    plaidAccessToken: { type: String, select: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Account", accountSchema);
