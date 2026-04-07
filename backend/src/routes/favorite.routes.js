const express = require("express");
const router = express.Router();
const Favorite = require("../models/Favorite");

// =======================
// GET FAVORITES BY USER
// =======================
router.get("/:userId", async (req, res) => {
  try {
    const data = await Favorite.find({ userId: req.params.userId });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Lỗi server" });
  }
});

// =======================
// ADD FAVORITE
// =======================
router.post("/", async (req, res) => {
  try {
    const { userId, recipeId, name, image } = req.body;

    // check tồn tại
    const exist = await Favorite.findOne({ userId, recipeId });
    if (exist) {
      return res.status(400).json({ message: "Đã tồn tại" });
    }

    const newFav = await Favorite.create({
      userId,
      recipeId,
      name,
      image
    });

    res.json(newFav);

  } catch (err) {
    res.status(500).json({ message: "Lỗi server" });
  }
});

// =======================
// DELETE FAVORITE
// =======================
router.delete("/:userId/:recipeId", async (req, res) => {
  try {
    await Favorite.findOneAndDelete({
      userId: req.params.userId,
      recipeId: req.params.recipeId
    });

    res.json({ message: "Đã xóa" });

  } catch (err) {
    res.status(500).json({ message: "Lỗi server" });
  }
});

module.exports = router;