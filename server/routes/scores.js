// routes/scores.js

const express = require("express");
const router = express.Router();
const Score = require("../model/Score");

// GET the top 10 scores for the leaderboard
router.get("/", async (req, res) => {
  try {
    // ✨ IMPROVEMENT: Added .limit(10) to only fetch the top 10 players
    const scores = await Score.find().sort({ score: -1 }).limit(10);
    res.json(scores);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch scores" });
  }
});

// POST a new score (or update if higher) and increment play count
router.post("/", async (req, res) => {
  try {
    const { name, score } = req.body;

    const existingPlayer = await Score.findOne({ name });

    if (!existingPlayer) {
      // If the player is new, create them with 1 play.
      const newScore = new Score({
        name: name,
        score: score,
        plays: 1, // ✨ IMPROVEMENT: Start play count at 1
        date: new Date(),
      });
      await newScore.save();
      return res.status(201).json(newScore);
    } else {
      // If the player exists, always increment their play count.
      existingPlayer.plays += 1; // ✨ IMPROVEMENT: Increment plays

      // Only update their score if the new one is higher.
      if (score > existingPlayer.score) {
        existingPlayer.score = score;
        existingPlayer.date = new Date();
      }

      await existingPlayer.save();
      return res.status(200).json(existingPlayer);
    }
  } catch (err) {
    console.error("Error saving score:", err);
    res.status(500).json({ error: "Failed to save score" });
  }
});

module.exports = router;
