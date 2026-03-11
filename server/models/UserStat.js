const mongoose = require("mongoose");

const UserStatSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  studyHours: { type: Number, default: 0 },
  tasksDone: { type: Number, default: 0 },
  currentStreak: { type: Number, default: 0 },
  focusScore: { type: Number, default: 0 },
  lastActive: { type: Date, default: Date.now },
});

module.exports = mongoose.model("UserStat", UserStatSchema);
