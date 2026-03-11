const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  getActiveSession,
  startSession,
  pauseSession,
  resumeSession,
  stopSession,
  getTodayFocus,
  getWeeklyActivity,
} = require("../controllers/focusController");

router.get("/active", protect, getActiveSession);
router.post("/start", protect, startSession);
router.post("/pause", protect, pauseSession);
router.post("/resume", protect, resumeSession);
router.post("/stop", protect, stopSession);
router.get("/today", protect, getTodayFocus);
router.get("/weekly", protect, getWeeklyActivity);

module.exports = router;
