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
        const data = await Recipe.findOne({ id: Number(req.params.id) }); // 🔥 FIX
        res.json(data);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});