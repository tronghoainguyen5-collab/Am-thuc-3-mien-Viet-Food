function register(e) {
  e.preventDefault();

  let user = document.getElementById("user").trim().value;
  let pass = document.getElementById("pass").trim().value;
  let confirm = document.getElementById("confirm").trim().value;

  if (pass !== confirm) {
    alert("Mật khẩu không khớp!");
    return;
  }

  let users = JSON.parse(localStorage.getItem("users")) || [];

  // check trùng
  let exist = users.find(u => u.username === user);
  if (exist) {
    alert("Tài khoản đã tồn tại!");
    return;
  }

  users.push({
    id: Date.now(),
    username: user,
    password: pass
  });

  localStorage.setItem("users", JSON.stringify(users));

  alert("Đăng ký thành công!");
  window.location.href = "dang-nhap.html";
}
function login(e) {
  e.preventDefault();

  let username = document.getElementById("username").value;
  let password = document.getElementById("password").value;

  let users = JSON.parse(localStorage.getItem("users")) || [];

  let user = users.find(u =>
    u.username === username && u.password === password
  );

  if (user) {
    localStorage.setItem("currentUser", JSON.stringify(user));
    alert("Đăng nhập thành công");
    window.location.href = "index.html";
  } else {
    alert("Sai tài khoản hoặc mật khẩu");
  }
}
document.addEventListener("DOMContentLoaded", () => {
  let user = JSON.parse(localStorage.getItem("currentUser"));

  let authBox = document.querySelector(".auth-buttons");

  if (user && authBox) {
    authBox.innerHTML = `
      <span class="user-name">👋 ${user.username}</span>
      <button id="logoutBtn" class="btn-logout">Đăng xuất</button>
    `;

    document.getElementById("logoutBtn").onclick = () => {
      localStorage.removeItem("currentUser");
      alert("Đã đăng xuất!");
      window.location.href = "index.html";
    };
  }
});
