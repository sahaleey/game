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

// POST new score (or update if the new score is higher)
router.post("/", async (req, res) => {
  try {
    const { name, score } = req.body;

    // Find if a player with this name already exists.
    const existingPlayer = await Score.findOne({ name });

    if (!existingPlayer) {
      // If the player is new, create a new score entry for them.
      const newScore = new Score({
        name: name,
        score: score,
        date: new Date(),
      });
      await newScore.save();
      // Send a 201 "Created" status with the new score data.
      return res.status(201).json(newScore);
    } else {
      // If the player already exists, only update their score if the new one is higher.
      if (score > existingPlayer.score) {
        existingPlayer.score = score;
        existingPlayer.date = new Date();
        await existingPlayer.save();
      }
      // Return the player's latest data.
      return res.status(200).json(existingPlayer);
    }
  } catch (err) {
    console.error("Error saving score:", err);
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
