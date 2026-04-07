// // --- 1. ĐĂNG KÝ ---
// function register(e) {
//   e.preventDefault();

//   let username = document.getElementById("user").value.trim();
//   let email = document.getElementById("email").value.trim();
//   let pass = document.getElementById("pass").value.trim();
//   let confirm = document.getElementById("confirm").value.trim();

//   if (pass !== confirm) {
//     alert("Mật khẩu không khớp!");
//     return;
//   }

//   let users = JSON.parse(localStorage.getItem("users")) || [];

//   if (users.find(u => u.email === email)) {
//     alert("Email đã tồn tại!");
//     return;
//   }

//   let role = "user"; // mặc định user
//   if (email.toLowerCase().includes("admin")) {
//     role = "admin";
//   }

//   const newUser = {
//     id: Date.now(),
//     username,
//     email,
//     password: pass,
//     role
//   };

//   users.push(newUser);
//   localStorage.setItem("users", JSON.stringify(users));

//   alert(`Đăng ký thành công tài khoản ${role.toUpperCase()}!`);
//   window.location.href = "dang-nhap.html";
// }

// // --- 2. ĐĂNG NHẬP ---
// function login(e) {
//   e.preventDefault();

//   let email = document.getElementById("username").value.trim();
//   let password = document.getElementById("password").value.trim();

//   let users = JSON.parse(localStorage.getItem("users")) || [];

//   let user = users.find(u => u.email === email && u.password === password);

//   if (user) {
//     localStorage.setItem("currentUser", JSON.stringify(user));
//     alert(`Chào mừng ${user.username} quay trở lại!`);

//     if (user.role === "admin") {
//       window.location.href = "admin.html";
//     } else {
//       window.location.href = "index.html";
//     }
//   } else {
//     alert("Sai email hoặc mật khẩu");
//   }
// }

// // --- 3. KIỂM TRA TRẠNG THÁI VÀ DROPDOWN ---
// document.addEventListener("DOMContentLoaded", () => {
//   let user = JSON.parse(localStorage.getItem("currentUser"));

//   // Bảo vệ trang Admin
//   if (window.location.pathname.includes("admin") && (!user || user.role !== "admin")) {
//     alert("Bạn không có quyền truy cập!");
//     window.location.href = "index.html";
//     return;
//   }

//   const btnLogin = document.querySelector(".btn-login");
//   const btnRegister = document.querySelector(".btn-register");
//   const dropdown = document.querySelector(".dropdown");
//   const profileLink = document.querySelector(".profile-link");
//   const upgradeAdmin = document.querySelector(".upgrade-admin");
//   const logoutLink = document.querySelector(".logout-link");
//   const usernameSpan = document.querySelector(".username");
//   const avatarImg = document.querySelector(".avatar");
//   const toast = document.getElementById("toast");

//   function showToast(msg) {
//     toast.innerText = msg;
//     toast.classList.add("show");
//     setTimeout(() => toast.classList.remove("show"), 2500);
//   }

//   if (user) {
//     usernameSpan.innerText = user.username;
//     avatarImg.src = "avatar.png"; // thay avatar nếu cần
//     if (btnRegister) btnRegister.style.display = "none";
//     if (user.role !== "admin") upgradeAdmin.style.display = "flex";

//     // Toggle dropdown
//     btnLogin.addEventListener("click", e => {
//       e.stopPropagation();
//       dropdown.classList.toggle("show");
//     });

//     document.addEventListener("click", () => dropdown.classList.remove("show"));

//     profileLink.addEventListener("click", () => {
//       dropdown.classList.remove("show");
//       showToast(`Đây là trang profile của ${user.username}`);
//     });

//     upgradeAdmin.addEventListener("click", () => {
//       let users = JSON.parse(localStorage.getItem("users")) || [];
//       let current = users.find(u => u.id === user.id);
//       if (current) {
//         current.role = "admin";
//         localStorage.setItem("users", JSON.stringify(users));
//         user.role = "admin";
//         localStorage.setItem("currentUser", JSON.stringify(user));
//         showToast("Bạn đã được nâng quyền Admin!");
//         setTimeout(() => window.location.href = "admin.html", 500);
//       }
//     });

//     logoutLink.addEventListener("click", () => {
//       localStorage.removeItem("currentUser");
//       showToast("Đã đăng xuất!");
//       setTimeout(() => window.location.href = "index.html", 500);
//     });
//   }
// });
// --- auth.js ---

// --- 1. ĐĂNG KÝ ---
// --- 1. ĐĂNG KÝ ---
// =======================
// 🔐 AUTH FINAL VERSION
// =======================

// =======================
// 🔐 VALIDATE EMAIL
// =======================
function validateEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!regex.test(email)) return false;

  const validDomains = ["gmail.com", "yahoo.com", "outlook.com", "hotmail.com"];
  const domain = email.split("@")[1];

  return validDomains.includes(domain?.toLowerCase());
}

// =======================
// 🎨 UI ERROR
// =======================
function setError(id, message) {
  const input = document.getElementById(id);
  const error = document.getElementById("error-" + id);

  if (!input || !error) return;

  input.classList.add("error-input");
  input.classList.remove("valid-input");
  error.innerText = message;
}

function setSuccess(id) {
  const input = document.getElementById(id);
  const error = document.getElementById("error-" + id);

  if (!input || !error) return;

  input.classList.remove("error-input");
  input.classList.add("valid-input");
  error.innerText = "";
}

// =======================
// 🧠 VALIDATE FIELD
// =======================
function validateField(type, value, extra = null) {
  switch (type) {
    case "user":
      return !value ? "Không được để trống" : "";

    case "email":
      return !validateEmail(value) ? "Email không hợp lệ" : "";

    case "pass":
      return value.length < 6 ? "Tối thiểu 6 ký tự" : "";

    case "confirm":
      return value !== extra ? "Mật khẩu không khớp" : "";

    case "login-email":
      return !validateEmail(value) ? "Email không hợp lệ" : "";

    case "login-pass":
      return !value ? "Vui lòng nhập mật khẩu" : "";

    default:
      return "";
  }
}

// =======================
// 📝 REGISTER
// =======================
async function register(e) {
  e.preventDefault();

  const username = document.getElementById("user")?.value.trim();
  const email = document.getElementById("email")?.value.trim();
  const pass = document.getElementById("pass")?.value.trim();
  const confirm = document.getElementById("confirm")?.value.trim();

  let isValid = true;

  const userErr = validateField("user", username);
  const emailErr = validateField("email", email);
  const passErr = validateField("pass", pass);
  const confirmErr = validateField("confirm", confirm, pass);

  if (userErr) { setError("user", userErr); isValid = false; }
  else setSuccess("user");

  if (emailErr) { setError("email", emailErr); isValid = false; }
  else setSuccess("email");

  if (passErr) { setError("pass", passErr); isValid = false; }
  else setSuccess("pass");

  if (confirmErr) { setError("confirm", confirmErr); isValid = false; }
  else setSuccess("confirm");

  if (!isValid) return;

  try {
    const res = await fetch("https://am-thuc-3-mien-viet-food.onrender.com/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username,
        email,
        password: pass
      })
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Lỗi đăng ký");
      return;
    }

    alert("Đăng ký thành công!");
    window.location.href = "dang-nhap.html";

  } catch (err) {
    console.error(err);
  }
}

// =======================
// 🔑 LOGIN
// =======================
async function login(e) {
  e.preventDefault();

  const email = document.getElementById("username")?.value.trim();
  const password = document.getElementById("password")?.value.trim();

  const res = await fetch("https://am-thuc-3-mien-viet-food.onrender.com/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      email: email,       // 🔥 PHẢI LÀ email
      password: password  // 🔥 PHẢI LÀ password
    })
  });

  const data = await res.json();
  console.log("LOGIN RESPONSE:", data);

  if (!res.ok) {
    alert(data.message);
    return;
  }

  localStorage.setItem("currentUser", JSON.stringify(data.user));
  window.location.href = "index.html";
}

// =======================
// 🌐 DOM READY
// =======================
document.addEventListener("DOMContentLoaded", () => {

  // ===== BLUR VALIDATE (CHUẨN WEB) =====
  function bindBlur(id, type, extraId = null) {
    const input = document.getElementById(id);
    if (!input) return;

    input.addEventListener("blur", () => {
      const value = input.value.trim();
      const extra = extraId ? document.getElementById(extraId)?.value : null;

      const err = validateField(type, value, extra);

      if (err) setError(id, err);
      else setSuccess(id);
    });
  }

  bindBlur("user", "user");
  bindBlur("email", "email");
  bindBlur("pass", "pass");
  bindBlur("confirm", "confirm", "pass");

  bindBlur("username", "login-email");
  bindBlur("password", "login-pass");

  // =======================
  // 👤 NAVBAR LOGIC
  // =======================
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  const btnLogin = document.querySelector(".btn-login");
  const btnRegister = document.querySelector(".btn-register");
  const btnSaved = document.querySelector(".btn-saved");
  const dropdown = document.querySelector(".dropdown");
  const logoutLink = document.querySelector(".logout-link");
  const usernameSpan = document.querySelector(".username");
  const avatarImg = document.querySelector(".avatar");

  // ❌ CHƯA LOGIN
  if (!currentUser) {
    if (btnSaved) btnSaved.style.display = "none";
    if (avatarImg) avatarImg.style.display = "none";

    if (btnLogin) {
      btnLogin.onclick = () => window.location.href = "dang-nhap.html";
    }

    return;
  }

  // ✅ ĐÃ LOGIN
  if (btnSaved) btnSaved.style.display = "inline-block";
  if (btnRegister) btnRegister.style.display = "none";

  if (usernameSpan) usernameSpan.innerText = currentUser.username;

  if (avatarImg) {
    avatarImg.style.display = "inline-block";
    avatarImg.src = currentUser.avatar || "public/image/avatar.png";
  }

  // dropdown
  if (btnLogin && dropdown) {
    btnLogin.addEventListener("click", (e) => {
      e.stopPropagation();
      dropdown.classList.toggle("show");
    });

    document.addEventListener("click", () => {
      dropdown.classList.remove("show");
    });
  }

  const profileLink = document.querySelector(".profile-link");
  // logout
  // ===== PROFILE =====
if (profileLink) {
  profileLink.addEventListener("click", () => {
    window.location.href = "profile.html";
  });
}

// ===== LOGOUT =====
if (logoutLink) {
  logoutLink.onclick = () => {
    localStorage.removeItem("currentUser");
    window.location.href = "index.html";
  };
}
});