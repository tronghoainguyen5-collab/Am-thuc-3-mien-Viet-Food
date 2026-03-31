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

    let role = "user"; 
    if (email.toLowerCase().includes("admin")) {
        role = "admin";
    }

    const newUser = {
        id: Date.now(),
        username: username,
        email: email,
        password: pass,
        role: role,
        avatar: "public/image/avatar.png" // Khởi tạo ảnh mặc định
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

    // Tìm user khớp email và password
    let user = users.find(u => u.email === email && u.password === password);

    if (user) {
        // Lưu toàn bộ object user vào currentUser để dùng ở các trang khác
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

// --- 3. KIỂM TRA TRẠNG THÁI VÀ HIỂN THỊ HEADER (Dùng cho mọi trang) ---
document.addEventListener("DOMContentLoaded", () => {
    const user = JSON.parse(localStorage.getItem("currentUser"));

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
        if (!toast) return;
        toast.innerText = msg;
        toast.classList.add("show");
        setTimeout(() => toast.classList.remove("show"), 2500);
    }

    // Bảo vệ trang Admin
    if (window.location.pathname.includes("admin") && (!user || user.role !== "admin")) {
        alert("Bạn không có quyền truy cập!");
        window.location.href = "index.html";
        return;
    }

    // TRƯỜNG HỢP: CHƯA ĐĂNG NHẬP
    if (!user) {
        if (btnLogin) {
            usernameSpan.innerText = "Đăng Nhập";
            btnLogin.onclick = () => window.location.href = "dang-nhap.html";
        }
        if (btnRegister) btnRegister.style.display = "inline-block";
        if (dropdown) dropdown.style.display = "none";
        return;
    }

    // TRƯỜNG HỢP: ĐÃ ĐĂNG NHẬP
    if (user) {
        // 1. Hiển thị thông tin từ currentUser lên Header
        if (usernameSpan) usernameSpan.innerText = user.username;
        if (avatarImg) avatarImg.src = user.avatar || "public/image/avatar.png";
        if (btnRegister) btnRegister.style.display = "none";

        // 2. Xử lý Dropdown
        if (btnLogin) {
            // Xóa sự kiện chuyển trang để thay bằng hiện dropdown
            btnLogin.onclick = null; 
            btnLogin.addEventListener("click", (e) => {
                e.stopPropagation();
                if (dropdown) dropdown.classList.toggle("show");
            });
        }

        // 3. Đóng dropdown khi click ngoài
        document.addEventListener("click", () => {
            if (dropdown) dropdown.classList.remove("show");
        });

        // 4. Link đến Profile
        if (profileLink) {
            profileLink.onclick = () => window.location.href = "profile.html";
        }

        // 5. Nâng quyền Admin (Giữ nguyên logic của bạn)
        if (upgradeAdmin) {
            if (user.role === "admin") upgradeAdmin.style.display = "none";
            upgradeAdmin.addEventListener("click", () => {
                let users = JSON.parse(localStorage.getItem("users")) || [];
                let currentIdx = users.findIndex(u => u.id === user.id);
                if (currentIdx !== -1) {
                    users[currentIdx].role = "admin";
                    localStorage.setItem("users", JSON.stringify(users));
                    
                    user.role = "admin";
                    localStorage.setItem("currentUser", JSON.stringify(user));
                    
                    showToast("Bạn đã được nâng quyền Admin!");
                    setTimeout(() => window.location.href = "admin.html", 1000);
                }
            });
        }

        // 6. Logout
        if (logoutLink) {
            logoutLink.addEventListener("click", () => {
                localStorage.removeItem("currentUser");
                showToast("Đã đăng xuất!");
                setTimeout(() => window.location.href = "index.html", 800);
            });
        }
    }
});