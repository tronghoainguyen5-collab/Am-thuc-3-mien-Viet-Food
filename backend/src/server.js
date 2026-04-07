// require("dotenv").config();
// const express = require("express");
// const cors = require("cors");

// const connectDB = require("./config/db");

// const app = express();

// // connect DB
// connectDB();

// // middleware
// app.use(cors());
// app.use(express.json());

// // routes
// app.use("/api/auth", require("./routes/auth"));

// // test API
// app.get("/", (req, res) => {
//   res.send("API chạy OK");
// });

// app.listen(process.env.PORT, () => {
//   console.log("🚀 Server chạy port " + process.env.PORT);
// });
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// middleware
app.use(cors());
app.use(express.json());

// routes
const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);

// test route
app.get("/", (req, res) => {
  res.send("API VietFood running...");
});

// connect MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ Connected MongoDB");

    app.listen(process.env.PORT || 5000, () => {
      console.log("🚀 Server running...");
    });
  })
  .catch(err => console.log("❌ DB Error:", err));