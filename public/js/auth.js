// --- 1. CHỨC NĂNG ĐĂNG KÝ ---
function register(e) {
  e.preventDefault();

  let username = document.getElementById("user").value.trim();
  let email = document.getElementById("email").value.trim();
  let pass = document.getElementById("pass").value.trim();
  let confirm = document.getElementById("confirm").value.trim();

  if (pass !== confirm) {
    alert("Mật khẩu không khớp!");
    return;
  }

  let users = JSON.parse(localStorage.getItem("users")) || [];

  if (users.find(u => u.email === email)) {
    alert("Email đã tồn tại!");
    return;
  }

  // 🔥 LOGIC PHÂN QUYỀN KHI ĐĂNG KÝ:
  // Nếu email Anh nhập có chứa chữ "admin", code sẽ cấp quyền admin.
  // Ví dụ: anhadmin@gmail.com hoặc admin.tuannanh@fpt.edu.vn
  let role = "user"; 
  if (email.toLowerCase().includes("admin")) {
      role = "admin";
  }

  const newUser = {
    id: Date.now(),
    username: username,
    email: email,
    password: pass,
    role: role 
  };

  console.log("Đã đăng ký tài khoản với quyền:", role);

  users.push(newUser);
  localStorage.setItem("users", JSON.stringify(users));

  alert(`Đăng ký thành công tài khoản ${role.toUpperCase()}!`);
  window.location.href = "dang-nhap.html";
}

// --- 2. CHỨC NĂNG ĐĂNG NHẬP ---
function login(e) {
  e.preventDefault();

  let email = document.getElementById("username").value.trim();
  let password = document.getElementById("password").value.trim();

  let users = JSON.parse(localStorage.getItem("users")) || [];

  let user = users.find(u =>
    u.email === email && u.password === password
  );

  if (user) {
    localStorage.setItem("currentUser", JSON.stringify(user));
    alert(`Chào mừng ${user.username} quay trở lại!`);

    // 🔥 ĐIỀU HƯỚNG CHÍNH XÁC
    if (user.role === "admin") {
        window.location.href = "admin-stats.html"; 
    } else {
        window.location.href = "index.html"; 
    }
  } else {
    alert("Sai email hoặc mật khẩu");
  }
}

// --- 3. KIỂM TRA TRẠNG THÁI ---
document.addEventListener("DOMContentLoaded", () => {
  let user = JSON.parse(localStorage.getItem("currentUser"));

  // Bảo vệ trang Admin
  if (window.location.pathname.includes("admin") && (!user || user.role !== "admin")) {
      alert("Bạn không có quyền truy cập!");
      window.location.href = "index.html";
      return;
  }

  let btnLogin = document.querySelector(".btn-login");
  let btnRegister = document.querySelector(".btn-register");
  let savedBtn = document.querySelector(".btn-saved");
  let authButtons = document.querySelector(".auth-buttons");

  if (user) {
    if (btnLogin) {
      btnLogin.innerText = `👋 ${user.username}`;
      // Nếu là admin, click vào tên sẽ quay lại bảng điều khiển
      btnLogin.href = (user.role === "admin") ? "admin-stats.html" : "#";
    }

    if (btnRegister) {
      btnRegister.style.display = "none";
    }

    if (authButtons && !document.querySelector(".btn-logout")) {
      let logoutBtn = document.createElement("button");
      logoutBtn.innerText = "Đăng xuất";
      logoutBtn.classList.add("btn-logout");

      logoutBtn.onclick = () => {
        localStorage.removeItem("currentUser");
        alert("Đã đăng xuất!");
        window.location.href = "index.html";
      };
      authButtons.appendChild(logoutBtn);
    }

    let favorites = JSON.parse(localStorage.getItem("favorites")) || {};
    let count = favorites[user.id] ? favorites[user.id].length : 0;

    if (savedBtn) {
      savedBtn.innerHTML = `<i class="fa-solid fa-bookmark"></i> Món đã lưu (${count})`;
    }
  }
});