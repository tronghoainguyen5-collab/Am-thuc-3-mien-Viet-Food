function addFavorite(id) {
    let user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
        alert("Phải đăng nhập!");
        window.location.href = "dang-nhap.html";
        return;
    }

    // 👉 mỗi user 1 danh sách riêng
    let key = `favorite_${user.username}`;

    let fav = JSON.parse(localStorage.getItem(key)) || [];

    const btn = document.getElementById("saveBtn");

    if (!fav.includes(id)) {
        fav.push(id);
        localStorage.setItem(key, JSON.stringify(fav));

        // update UI
        btn.classList.add("active");
        btn.innerHTML = '<i class="fa-solid fa-bookmark"></i> Đã lưu';

    } else {
        // remove luôn (toggle cho xịn)
        fav = fav.filter(item => item != id);
        localStorage.setItem(key, JSON.stringify(fav));

        btn.classList.remove("active");
        btn.innerHTML = '<i class="fa-solid fa-bookmark"></i> Lưu công thức';
    }
}