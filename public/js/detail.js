const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get("id");

fetch("./data/d.json")
    .then(res => res.json())
    .then(data => {
        const product = data.find(item => item.id == id);

        document.getElementById("title").innerText = product.name;
        document.getElementById("description").innerText = product.description;
        document.getElementById("main-img").src = product.image;

        // nguyên liệu
        let ingHTML = "";
        product.ingredients.forEach(i => {
            ingHTML += `<li>${i}</li>`;
        });
        document.getElementById("ingredients").innerHTML = ingHTML;

        // bước làm
        let stepHTML = "";
        product.steps.forEach(s => {
            stepHTML += `<li>${s}</li>`;
        });
        document.getElementById("steps").innerHTML = stepHTML;
    });
// dùng lại hàm favorite
function addFavorite() {
  let user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    alert("Bạn cần đăng nhập!");
    window.location.href = "dang-nhap.html";
    return;
  }

  let fav = JSON.parse(localStorage.getItem("favorite")) || [];

  if (!fav.includes(window.currentId)) {
    fav.push(window.currentId);
    localStorage.setItem("favorite", JSON.stringify(fav));
    alert("Đã lưu!");
  }
}
function checkFavorite(id) {
    let user = JSON.parse(localStorage.getItem("user"));
    if (!user) return;

    let key = `favorite_${user.username}`;
    let fav = JSON.parse(localStorage.getItem(key)) || [];

    const btn = document.getElementById("saveBtn");

    if (fav.includes(id)) {
        btn.classList.add("active");
        btn.innerHTML = '<i class="fa-solid fa-bookmark"></i> Đã lưu';
    }
}

// gọi sau khi load xong
checkFavorite(productId);