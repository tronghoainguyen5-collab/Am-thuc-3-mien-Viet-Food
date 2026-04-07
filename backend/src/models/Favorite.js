const mongoose = require("mongoose");

const favoriteSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true // 🔥 mỗi user chỉ có 1 document
  },
  recipes: [
    {
      id: Number,
      name: String,
      image: String
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model("Favorite", favoriteSchema);