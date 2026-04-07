const mongoose = require("mongoose");

const typeSchema = new mongoose.Schema({
    id: Number,
    type: String,
    name: String,
    slug: String
});

module.exports = mongoose.model("Type", typeSchema);