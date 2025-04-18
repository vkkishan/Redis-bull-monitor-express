const express = require("express");
const cors = require("cors");
const queueRoutes = require("./routes/queue.routes");
const serverAdapter = require("./config/redisBull.config");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/queues", queueRoutes);

// Redis bull dashboard
app.use("/admin/queues", serverAdapter.getRouter());

module.exports = app;
