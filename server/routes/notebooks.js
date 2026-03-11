const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  getNotebooks,
  getNotebook,
  getByChapter,
  createNotebook,
  updateNotebook,
  deleteNotebook,
  bulkDeleteNotebooks,
  deleteAllNotebooks,
  getSharedNotebook,
  updateSharedNotebook,
  toggleShare,
} = require("../controllers/notebookController");

router.get("/", protect, getNotebooks);
router.post("/bulk-delete", protect, bulkDeleteNotebooks);
router.delete("/all", protect, deleteAllNotebooks);
router.get("/chapter", protect, getByChapter);
router.get("/shared/:id", getSharedNotebook);
router.put("/shared/:id", updateSharedNotebook);
router.get("/:id", protect, getNotebook);
router.post("/", protect, createNotebook);
router.put("/:id/share", protect, toggleShare);
router.put("/:id", protect, updateNotebook);
router.delete("/:id", protect, deleteNotebook);

module.exports = router;
