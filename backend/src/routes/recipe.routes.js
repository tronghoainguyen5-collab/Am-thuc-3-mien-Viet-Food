const express = require("express");
const router = express.Router(); // 🔥 BẮT BUỘC PHẢI CÓ
const Recipe = require("../models/Recipe");

// GET ALL
router.get("/", async (req, res) => {
    try {
        const data = await Recipe.find();
        res.json(data);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET BY ID
router.get("/:id", async (req, res) => {
    try {
        const data = await Recipe.findOne({ id: Number(req.params.id) });
        res.json(data);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router; // 🔥 cũng bắt buộc luôn