// app.js - Punto de entrada del backend LuminaPay

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const config = require("./config");

// Rutas
const userRoutes = require("./routes/userRoutes");
const agentRoutes = require("./routes/agentRoutes");
const walletRoutes = require("./routes/walletRoutes");
const transactionRoutes = require("./routes/transactionRoutes");

const app = express();

// Middlewares
app.use(cors());
app.use(bodyParser.json());

// Rutas principales
app.use("/api/users", userRoutes);
app.use("/api/agents", agentRoutes);
app.use("/api/wallets", walletRoutes);
app.use("/api/transactions", transactionRoutes);

// Health check
app.get("/", (req, res) => {
  res.send("🚀 LuminaPay backend is running");
});

// Levantar servidor
app.listen(config.PORT, () => {
  console.log(`✅ Server running on http://localhost:${config.PORT}`);
});
