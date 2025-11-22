const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const { errorHandler } = require("./middleware/error.middleware");
const healthRoutes = require("./routes/health.routes");

const app = express();

// Global middlewares
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Routes
app.use("/api/health", healthRoutes);

// Error handler (must be last)..
app.use(errorHandler);

module.exports = app;
