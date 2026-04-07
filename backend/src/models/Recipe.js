const mongoose = require("mongoose");

const recipeSchema = new mongoose.Schema({
    id: Number,
    name: String,
    image: String,
    description: String,
    categoryId: Number,
    type: String,
    userId: Number,
    ingredients: Array,
    steps: Array,
    time: String
}, { timestamps: true });

module.exports = mongoose.model("Recipe", recipeSchema);