const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  getHistory,
  addCalculation,
  clearHistory,
  deleteCalculation,
} = require("../controllers/calculatorController");

router.get("/", protect, getHistory);
router.post("/", protect, addCalculation);
router.delete("/", protect, clearHistory);
router.delete("/:id", protect, deleteCalculation);

module.exports = router;
