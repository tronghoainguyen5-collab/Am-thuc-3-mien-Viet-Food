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
import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import connectDB from "./config/db.js";

import authRoutes from "./routes/auth.js";
import recipeRoutes from "./routes/recipes.js";
import categoryRoutes from "./routes/categories.js";
import typeRoutes from "./routes/types.js";

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/recipes", recipeRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/types", typeRoutes);

app.listen(process.env.PORT, () => {
  console.log("🚀 Server running...");
});