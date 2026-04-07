const express = require("express");
const router = express.Router();
const Type = require("../models/Type");

router.get("/", async (req, res) => {
    const data = await Type.find();
    res.json(data);
});

module.exports = router;