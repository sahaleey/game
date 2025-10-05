// models/Score.js
const mongoose = require("mongoose");

const ScoreSchema = new mongoose.Schema({
  name: { type: String, required: true },
  score: { type: Number, required: true },
  plays: { type: Number, default: 0 }, // New field
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Score", ScoreSchema);
