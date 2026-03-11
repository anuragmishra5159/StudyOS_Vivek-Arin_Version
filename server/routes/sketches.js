const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  getSketches,
  getSketch,
  createSketch,
  updateSketch,
  deleteSketch,
} = require("../controllers/sketchController");

router.use(protect);

router.route("/").get(getSketches).post(createSketch);
router.route("/:id").get(getSketch).put(updateSketch).delete(deleteSketch);

module.exports = router;
