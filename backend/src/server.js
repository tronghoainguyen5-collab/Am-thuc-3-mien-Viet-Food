require("dotenv").config();
const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");

const app = express();

// connect DB
connectDB();

// middleware
app.use(cors());
app.use(express.json());

// routes
app.use("/api/auth", require("./routes/auth"));

// test API
app.get("/", (req, res) => {
  res.send("API chạy OK");
});

app.listen(process.env.PORT, () => {
  console.log("🚀 Server chạy port " + process.env.PORT);
});