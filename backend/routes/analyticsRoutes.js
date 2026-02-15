console.log("ANALYTICS ROUTES LOADED");

const express = require("express");
const router = express.Router();
const { getShortageAnalysis } = require("../services/analyticsService");
const authenticateToken = require("../middleware/authMiddleware");

// Protected shortage route
router.get("/shortage", authenticateToken, async (req, res) => {
  try {
    const data = await getShortageAnalysis();
    res.json(data);
  } catch (error) {
    console.error("Shortage Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
router.get("/ping", (req, res) => {
  res.send("ANALYTICS PING WORKING");
});

module.exports = router;