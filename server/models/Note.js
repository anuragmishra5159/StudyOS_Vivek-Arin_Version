const mongoose = require("mongoose");

const NoteSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  category: {
    type: String,
    enum: ["Work", "Study", "Personal"],
    default: "Personal",
  },
  label: { type: String },
  title: { type: String },
  type: {
    type: String,
    enum: ["checklist", "bullets", "text", "quote"],
    default: "text",
  },
  body: { type: String },
  author: { type: String },
  items: { type: mongoose.Schema.Types.Mixed }, // Array of { text, done } for checklist or strings for bullets
  pinned: { type: Boolean, default: false },
  color: { type: String, default: "emerald" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Note", NoteSchema);
