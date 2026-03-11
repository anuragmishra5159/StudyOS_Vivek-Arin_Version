const mongoose = require("mongoose");

const CalculationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, default: "CALCULATION" },
  expression: { type: String, required: true },
  result: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Calculation", CalculationSchema);
