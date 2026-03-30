// --- 1. ĐĂNG KÝ ---
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

  let role = "user"; // mặc định user
  if (email.toLowerCase().includes("admin")) {
    role = "admin";
  }

  const newUser = {
    id: Date.now(),
    username,
    email,
    password: pass,
    role
  };

  users.push(newUser);
  localStorage.setItem("users", JSON.stringify(users));

  alert(`Đăng ký thành công tài khoản ${role.toUpperCase()}!`);
  window.location.href = "dang-nhap.html";
}

// --- 2. ĐĂNG NHẬP ---
function login(e) {
  e.preventDefault();

  let email = document.getElementById("username").value.trim();
  let password = document.getElementById("password").value.trim();

  let users = JSON.parse(localStorage.getItem("users")) || [];

  let user = users.find(u => u.email === email && u.password === password);

  if (user) {
    localStorage.setItem("currentUser", JSON.stringify(user));
    alert(`Chào mừng ${user.username} quay trở lại!`);

    if (user.role === "admin") {
      window.location.href = "admin.html";
    } else {
      window.location.href = "index.html";
    }
  } else {
    alert("Sai email hoặc mật khẩu");
  }
}

// --- 3. KIỂM TRA TRẠNG THÁI VÀ DROPDOWN ---
document.addEventListener("DOMContentLoaded", () => {
  let user = JSON.parse(localStorage.getItem("currentUser"));

  // Bảo vệ trang Admin
  if (window.location.pathname.includes("admin") && (!user || user.role !== "admin")) {
    alert("Bạn không có quyền truy cập!");
    window.location.href = "index.html";
    return;
  }

  const btnLogin = document.querySelector(".btn-login");
  const btnRegister = document.querySelector(".btn-register");
  const dropdown = document.querySelector(".dropdown");
  const profileLink = document.querySelector(".profile-link");
  const upgradeAdmin = document.querySelector(".upgrade-admin");
  const logoutLink = document.querySelector(".logout-link");
  const usernameSpan = document.querySelector(".username");
  const avatarImg = document.querySelector(".avatar");
  const toast = document.getElementById("toast");

  function showToast(msg) {
    toast.innerText = msg;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 2500);
  }

  if (user) {
    usernameSpan.innerText = user.username;
    avatarImg.src = "avatar.png"; // thay avatar nếu cần
    if (btnRegister) btnRegister.style.display = "none";
    if (user.role !== "admin") upgradeAdmin.style.display = "flex";

    // Toggle dropdown
    btnLogin.addEventListener("click", e => {
      e.stopPropagation();
      dropdown.classList.toggle("show");
    });

    document.addEventListener("click", () => dropdown.classList.remove("show"));

    profileLink.addEventListener("click", () => {
      dropdown.classList.remove("show");
      showToast(`Đây là trang profile của ${user.username}`);
    });

    upgradeAdmin.addEventListener("click", () => {
      let users = JSON.parse(localStorage.getItem("users")) || [];
      let current = users.find(u => u.id === user.id);
      if (current) {
        current.role = "admin";
        localStorage.setItem("users", JSON.stringify(users));
        user.role = "admin";
        localStorage.setItem("currentUser", JSON.stringify(user));
        showToast("Bạn đã được nâng quyền Admin!");
        setTimeout(() => window.location.href = "admin.html", 500);
      }
    });

    logoutLink.addEventListener("click", () => {
      localStorage.removeItem("currentUser");
      showToast("Đã đăng xuất!");
      setTimeout(() => window.location.href = "index.html", 500);
    });
  }
});