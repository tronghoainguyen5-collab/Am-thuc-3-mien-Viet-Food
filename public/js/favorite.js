// =======================
// LẤY USER
// =======================
function getCurrentUser() {
  return JSON.parse(localStorage.getItem("currentUser"));
}

// =======================
// LẤY FAVORITES
// =======================
function getFavorites() {
  return JSON.parse(localStorage.getItem("favorites")) || {};
}

// =======================
// LƯU FAVORITES
// =======================
function saveFavorites(favorites) {
  localStorage.setItem("favorites", JSON.stringify(favorites));
}

// =======================
// THÊM MÓN
// =======================
function addToFavorite(recipe, btn) {
  let user = getCurrentUser();

  if (!user) {
    alert("Vui lòng đăng nhập!");
    return;
  }

  let favorites = getFavorites();

  if (!favorites[user.id]) {
    favorites[user.id] = [];
  }

  let exist = favorites[user.id].find(item => item.name === recipe.name);

  // ❌ ĐÃ TỒN TẠI
  if (exist) {
    showToast("⚠️ Món này đã lưu rồi!");

    if (btn) {
      btn.classList.add("shake");
      setTimeout(() => btn.classList.remove("shake"), 400);
    }

    return;
  }

  // ✅ THÊM
  favorites[user.id].push(recipe);
  saveFavorites(favorites);

  // 🎉 animation
  if (btn) {
    btn.classList.add("active");

    let heart = document.createElement("span");
    heart.className = "heart-fly";
    heart.innerHTML = "❤️";

    btn.appendChild(heart);
    setTimeout(() => heart.remove(), 800);
  }

  showToast("✅ Đã lưu món!");
  updateSavedCount();
}

// =======================
// XÓA MÓN
// =======================
function removeFavorite(id) {
  let user = getCurrentUser();
  if (!user) return;

  let favorites = getFavorites();

  favorites[user.id] = (favorites[user.id] || []).filter(item => item.id !== id);

  saveFavorites(favorites);

  renderFavorites();
  updateSavedCount();

  showToast("🗑️ Đã xóa món!");
}

// =======================
// HIỂN THỊ DANH SÁCH
// =======================
function renderFavorites() {
  let user = getCurrentUser();

  if (!user) {
    alert("Vui lòng đăng nhập!");
    window.location.href = "dang-nhap.html";
    return;
  }

  let favorites = getFavorites();
  let list = favorites[user.id] || [];

  let container = document.getElementById("favorite-list");
  if (!container) return;

  if (list.length === 0) {
    container.innerHTML = "<p style='text-align:center'>Chưa có món nào 😢</p>";
    return;
  }

  container.innerHTML = list.map(item => `
    <div class="favorite-card">

      <div class="favorite-thumb">
        <img src="${item.image}" alt="${item.name}">
        
        <button class="favorite-icon active" onclick="confirmRemove(${item.id})">
          <i class="fa-solid fa-bookmark"></i>
        </button>
      </div>

      <div class="favorite-body">
        <h3>${item.name}</h3>

        <div class="favorite-actions">
          <a href="chi-tiet.html?id=${item.id}" class="btn-view">
            Xem chi tiết
          </a>

          <button class="btn-remove" onclick="confirmRemove(${item.id})">
            <i class="fa-solid fa-trash"></i> Xóa
          </button>
        </div>
      </div>

    </div>
  `).join("");
}

// =======================
// HIỂN THỊ SỐ LƯỢNG
// =======================
function updateSavedCount() {
  let user = getCurrentUser();
  let savedBtn = document.querySelector(".btn-saved");

  if (!user || !savedBtn) return;

  let favorites = getFavorites();
  let count = favorites[user.id]?.length || 0;

  savedBtn.innerHTML = `
    <i class="fa-solid fa-bookmark"></i> Món đã lưu (${count})
  `;
}

// =======================
// CHECK ĐÃ LƯU
// =======================
function checkSaved(recipeName) {
  let user = getCurrentUser();
  let btn = document.getElementById("btn-save");

  if (!user || !btn) return;

  let favorites = getFavorites();
  let list = favorites[user.id] || [];

  let exist = list.find(item => item.name === recipeName);

  if (exist) {
    btn.innerHTML = "✅ Đã lưu";
    btn.classList.add("active");
  }
}

// =======================
// GẮN NÚT SAVE (mien.html)
// =======================
function setupSaveButton() {
  let btnSave = document.getElementById("btn-save");
  if (!btnSave) return;

  btnSave.onclick = (e) => {
    e.preventDefault();

    let name = document.getElementById("hero-title")?.innerText;
    let image = document.getElementById("main-img")?.src;

    if (!name) return;

    let recipe = {
      id: Date.now(),
      name: name,
      image: image
    };

    addToFavorite(recipe, btnSave);
  };

  let currentName = document.getElementById("hero-title")?.innerText;
  if (currentName) checkSaved(currentName);
}

// =======================
// 🔥 TOAST UI
// =======================
function showToast(msg) {
  let toast = document.createElement("div");
  toast.className = "toast";
  toast.innerText = msg;

  document.body.appendChild(toast);

  setTimeout(() => toast.classList.add("show"), 10);
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 200);
  }, 2000);
}
function confirmRemove(id) {
  deleteId = id;
  document.getElementById("confirm-modal").classList.add("show");
}
function closeConfirm() {
  deleteId = null;
  document.getElementById("confirm-modal").classList.remove("show");
}
// =======================
// INIT
// =======================
// document.addEventListener("DOMContentLoaded", () => {
//   setupSaveButton();
//   updateSavedCount();

//   if (document.getElementById("favorite-list")) {
//     renderFavorites();
//   }
// });
document.addEventListener("DOMContentLoaded", () => {
  setupSaveButton();
  updateSavedCount();

  if (document.getElementById("favorite-list")) {
    renderFavorites();
  }

  // 🔥 confirm delete
  let confirmBtn = document.getElementById("confirm-delete-btn");
  if (confirmBtn) {
    confirmBtn.onclick = () => {
      if (deleteId !== null) {
        removeFavorite(deleteId);
        closeConfirm();
      }
    };
  }
});