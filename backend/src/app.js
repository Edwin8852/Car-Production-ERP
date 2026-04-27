const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const errorMiddleware = require("./shared/errorMiddleware");

const app = express();

/// ✅ Middlewares (ORDER IS CORRECT)
app.use(cors());
app.use(express.json()); // MUST be before routes
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

/// 🔥 Debug middleware (TEMP but very useful)
app.use((req, res, next) => {
  console.log("➡️ METHOD:", req.method);
  console.log("➡️ URL:", req.url);
  console.log("➡️ BODY:", req.body);
  next();
});

/// Routes
app.use("/api", require("./routes"));
app.use("/api/delivery", require("./modules/delivery/delivery.routes"));

/// Test route
app.get("/", (req, res) => {
  res.send("Car ERP Backend Running 🚗");
});

/// Error handling middleware (must be last)
app.use(errorMiddleware);

module.exports = app;