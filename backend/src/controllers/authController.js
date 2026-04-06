const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// REGISTER
exports.register = async (req, res) => {
  try {
    const { username, password } = req.body;

    const exist = await User.findOne({ username });
    if (exist) {
      return res.status(400).json({ msg: "User đã tồn tại" });
    }

    const hash = await bcrypt.hash(password, 10);

    await User.create({
      username,
      password: hash
    });

    res.json({ msg: "Đăng ký thành công" });

  } catch (err) {
    res.status(500).json({ msg: "Lỗi server" });
  }
};

// LOGIN
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ msg: "Sai tài khoản" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Sai mật khẩu" });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ token });

  } catch (err) {
    res.status(500).json({ msg: "Lỗi server" });
  }
};