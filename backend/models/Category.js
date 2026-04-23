const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        type: { type: String, enum: ["income", "expense"], required: true },
        icon: { type: String, default: "📁" },
        color: { type: String, default: "#3B82F6" },
        isPredefined: { type: Boolean, default: false },
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    },
    { timestamps: true }
);

categorySchema.index({ name: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model("Category", categorySchema);
