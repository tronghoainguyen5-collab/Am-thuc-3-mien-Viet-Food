const express = require("express");
const router = express.Router();
const Favorite = require("../models/Favorite");

// GET
router.get("/:userId", async (req, res) => {
  try {
    const fav = await Favorite.findOne({ userId: req.params.userId });
    res.json(fav || { recipes: [] });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server" });
  }
});

// ADD / TOGGLE
router.post("/", async (req, res) => {
  const { userId, recipe } = req.body;

  let fav = await Favorite.findOne({ userId });

  if (!fav) {
    fav = await Favorite.create({
      userId,
      recipes: [recipe]
    });
  } else {
    const exist = fav.recipes.find(r => r.id === recipe.id);

    if (exist) {
      fav.recipes = fav.recipes.filter(r => r.id !== recipe.id);
    } else {
      fav.recipes.push(recipe);
    }

    await fav.save();
  }

  res.json(fav);
});

// DELETE
router.delete("/:userId/:recipeId", async (req, res) => {
  try {
    const { userId, recipeId } = req.params;

    let fav = await Favorite.findOne({ userId });

    if (!fav) return res.status(404).json({ message: "Không có data" });

    fav.recipes = fav.recipes.filter(
      r => r.id !== Number(recipeId)
    );

    await fav.save();

    res.json({ message: "Đã xóa", data: fav });

  } catch (err) {
    res.status(500).json({ message: "Lỗi server" });
  }
});

module.exports = router;