const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const scoresRouter = require("./routes/scores");

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose
  .connect(
    "mongodb+srv://ajua46244_db_user:BMU8YRWM3ZDgGxND@cluster0.sfqjkuw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Routes
app.use("/api/scores", scoresRouter);

app.get("/", (req, res) => {
  res.send("Server is running 🐦");
});

app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);
