const express = require("express");
const router = express.Router();
const Score = require("../model/Score");

// GET all scores
router.get("/", async (req, res) => {
  try {
    const scores = await Score.find().sort({ score: -1 });
    res.json(scores);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch scores" });
  }
});

// POST new score (update if higher)
router.post("/", async (req, res) => {
  try {
    const { name, score } = req.body;
    let player = await Score.findOne({ name });

    if (!player) {
      // First play
      player = new Score({ name, score, plays: 1, date: new Date() });
    } else if (player.plays < 3) {
      // Only count if less than 3 plays
      player.score = score; // always take last score
      player.plays += 1;
      player.date = new Date();
    } else {
      // Already played 3 times
      player.score = score; // update score to last play
      player.date = new Date();
    }

    await player.save();
    res.json(player);
  } catch (err) {
    res.status(500).json({ error: "Failed to save score" });
  }
});

// DELETE all scores
router.delete("/", async (req, res) => {
  try {
    await Score.deleteMany();
    res.json({ message: "Leaderboard cleared" });
  } catch (err) {
    res.status(500).json({ error: "Failed to clear leaderboard" });
  }
});

module.exports = router;
