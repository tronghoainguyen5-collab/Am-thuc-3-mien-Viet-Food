const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");

// =======================
// REGISTER
// =======================
router.post("/register", async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ message: "Thiếu dữ liệu" });
        }

        const exist = await User.findOne({ email });
        if (exist) {
            return res.status(400).json({ message: "Email đã tồn tại" });
        }

        const hash = await bcrypt.hash(password, 10);

        const user = await User.create({
            username,
            email,
            password: hash
        });

        res.json({
            message: "Đăng ký thành công",
            user
        });

    } catch (err) {
        res.status(500).json({ message: "Server lỗi" });
    }
});


// =======================
// LOGIN
// =======================
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Thiếu dữ liệu" });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: "Email không tồn tại" });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: "Sai mật khẩu" });
        }

        res.json({
            message: "Login thành công",
            user
        });

    } catch (err) {
        res.status(500).json({ message: "Server lỗi" });
    }
});

module.exports = router;