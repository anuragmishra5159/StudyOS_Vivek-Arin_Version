const mongoose = require("mongoose");

const SketchSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, default: "Untitled Sketch" },
  thumbnail: { type: String, default: "" }, // small base64 preview
  dataUrl: { type: String, default: "" }, // full canvas base64
  width: { type: Number, default: 1920 },
  height: { type: Number, default: 1080 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Sketch", SketchSchema);
