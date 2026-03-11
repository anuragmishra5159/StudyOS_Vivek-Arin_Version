const Calculation = require("../models/Calculation");

// GET /api/calculator  — fetch history (newest first, max 50)
exports.getHistory = async (req, res) => {
  try {
    const items = await Calculation.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(50);
    res.json(items);
  } catch (err) {
    console.error("getHistory error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// POST /api/calculator  — save a calculation
exports.addCalculation = async (req, res) => {
  try {
    const { title, expression, result } = req.body;
    if (!expression || !result) {
      return res
        .status(400)
        .json({ message: "expression and result required" });
    }
    const calc = await Calculation.create({
      user: req.user._id,
      title: title || "CALCULATION",
      expression,
      result,
    });
    res.status(201).json(calc);
  } catch (err) {
    console.error("addCalculation error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// DELETE /api/calculator  — clear all history for user
exports.clearHistory = async (req, res) => {
  try {
    await Calculation.deleteMany({ user: req.user._id });
    res.json({ message: "History cleared" });
  } catch (err) {
    console.error("clearHistory error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// DELETE /api/calculator/:id  — delete single entry
exports.deleteCalculation = async (req, res) => {
  try {
    await Calculation.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });
    res.json({ message: "Deleted" });
  } catch (err) {
    console.error("deleteCalculation error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
