console.log("🔥 THIS EXACT SERVER FILE IS RUNNING 🔥");

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

// ✅ FIRST create app
const app = express();

// ✅ THEN import routes
const authRoutes = require("./routes/authRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");
const productionRoutes = require("./routes/productionRoutes");

// ✅ Middleware
app.use(cors());
app.use(express.json());

// ✅ Route mounting
app.use("/api/auth", authRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/production", productionRoutes);

// ✅ Test route
app.get("/", (req, res) => {
  res.send("Server working");
});

// ✅ Proper port handling
const PORT = process.env.PORT || 9191;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on ${PORT}`);
});