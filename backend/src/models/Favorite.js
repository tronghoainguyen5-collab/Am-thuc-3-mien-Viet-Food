const mongoose = require("mongoose");

const favoriteSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  recipeId: Number,
  name: String,
  image: String
}, { timestamps: true });

module.exports = mongoose.model("Favorite", favoriteSchema);