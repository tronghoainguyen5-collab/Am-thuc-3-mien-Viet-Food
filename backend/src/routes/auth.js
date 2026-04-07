const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");

// REGISTER
router.post("/register", async (req, res) => {
    const { username, email, password } = req.body;

    const exist = await User.findOne({ email });
    if (exist) return res.status(400).json({ message: "Email đã tồn tại" });

    const hash = await bcrypt.hash(password, 10);

    const user = await User.create({
        username,
        email,
        password: hash
    });

    res.json(user);
});

// LOGIN
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        console.log("BODY:", req.body); // 🔥 debug

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Email không tồn tại" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Sai mật khẩu" });
        }

        res.json({ user });

    } catch (err) {
        res.status(500).json({ message: "Server lỗi" });
    }
});

module.exports = router;