function register() {
  let user = document.getElementById("user").value;
  let pass = document.getElementById("pass").value;

  let users = JSON.parse(localStorage.getItem("users")) || [];

  users.push({
    id: Date.now(),
    username: user,
    password: pass
  });

  localStorage.setItem("users", JSON.stringify(users));

  alert("Đăng ký thành công!");
}

function login(e) {
    e.preventDefault();

    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;

    fetch("data/db.json")
        .then(res => res.json())
        .then(data => {
            let user = data.users.find(u =>
                u.username === username && u.password === password
            );

            if (user) {
                localStorage.setItem("user", JSON.stringify(user));
                alert("Đăng nhập thành công");
                window.location.href = "index.html";
            } else {
                alert("Sai tài khoản");
            }
        });
}