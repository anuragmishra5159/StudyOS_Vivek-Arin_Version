const express = require("express");
const router = express.Router();
const {
  getSubjects,
  createSubject,
  updateSubject,
  deleteSubject,
} = require("../controllers/subjectController");
const { protect } = require("../middleware/authMiddleware");

router.get("/", protect, getSubjects);
router.post("/", protect, createSubject);
router.put("/:id", protect, updateSubject);
router.delete("/:id", protect, deleteSubject);

module.exports = router;
