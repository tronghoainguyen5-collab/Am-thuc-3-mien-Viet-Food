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

    console.log("BODY:", req.body); // 🔥 debug

    const exist = await Favorite.findOne({ userId, recipeId });

    // ❌ đã tồn tại → xóa (toggle)
    if (exist) {
      await Favorite.deleteOne({ userId, recipeId });
      return res.json({ message: "Đã xóa khỏi yêu thích" });
    }

    // ✅ thêm mới
    const fav = await Favorite.create({
      userId,
      recipeId,
      name,
      image
    });

    res.json(fav);

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Lỗi server" });
  }
});

// =======================
// DELETE FAVORITE
// =======================
router.delete("/:userId/:recipeId", async (req, res) => {
  try {
    await Favorite.deleteOne({
      userId: req.params.userId,
      recipeId: req.params.recipeId
    });

    res.json({ message: "Đã xóa" });

  } catch (err) {
    res.status(500).json({ message: "Lỗi server" });
  }
});

module.exports = router;