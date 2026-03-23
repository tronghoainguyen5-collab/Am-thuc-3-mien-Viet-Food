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

  // check trùng email
  let exist = users.find(u => u.email === email);
  if (exist) {
    alert("Email đã tồn tại!");
    return;
  }

  users.push({
    id: Date.now(),
    username: username,
    email: email,
    password: pass
  });

  localStorage.setItem("users", JSON.stringify(users));

  alert("Đăng ký thành công!");
  window.location.href = "dang-nhap.html";
}
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
    alert("Đăng nhập thành công");
    window.location.href = "index.html";
  } else {
    alert("Sai email hoặc mật khẩu");
  }
}
document.addEventListener("DOMContentLoaded", () => {
  let user = JSON.parse(localStorage.getItem("currentUser"));

  let btnLogin = document.querySelector(".btn-login");
  let btnRegister = document.querySelector(".btn-register");
  let savedBtn = document.querySelector(".btn-saved");

  if (user) {
    // đổi nút login
    if (btnLogin) {
      btnLogin.innerText = `👋 ${user.username}`;
      btnLogin.href = "#";
    }

    // ẩn đăng ký
    if (btnRegister) {
      btnRegister.style.display = "none";
    }

    // logout
    let logoutBtn = document.createElement("button");
    logoutBtn.innerText = "Đăng xuất";
    logoutBtn.classList.add("btn-logout");

    logoutBtn.onclick = () => {
      localStorage.removeItem("currentUser");
      alert("Đã đăng xuất!");
      window.location.href = "index.html";
    };

    document.querySelector(".auth-buttons").appendChild(logoutBtn);

    // 🔥 HIỂN THỊ SỐ MÓN ĐÃ LƯU
    let favorites = JSON.parse(localStorage.getItem("favorites")) || {};
    let count = favorites[user.id] ? favorites[user.id].length : 0;

    if (savedBtn) {
      savedBtn.innerHTML = `
        <i class="fa-solid fa-bookmark"></i> Món đã lưu (${count})
      `;
    }
  }
});
