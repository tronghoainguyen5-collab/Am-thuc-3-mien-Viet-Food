// =======================
// GLOBAL
// =======================
let deleteId = null;

// =======================
// USER
// =======================
function getCurrentUser() {
  return JSON.parse(localStorage.getItem("currentUser"));
}

// =======================
// FAVORITES
// =======================
function getFavorites() {
  return JSON.parse(localStorage.getItem("favorites")) || {};
}

function saveFavorites(favorites) {
  localStorage.setItem("favorites", JSON.stringify(favorites));
}

// =======================
// CHECK ĐÃ LƯU (THEO ID)
// =======================
function isSaved(recipeId) {
  let user = getCurrentUser();
  if (!user) return false;

  let favorites = getFavorites();
  let list = favorites[user.id] || [];

  return list.some(item => item.id === recipeId);
}

// =======================
// TOGGLE SAVE (XỊN)
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

  let index = favorites[user.id].findIndex(item => item.id === recipe.id);

  // ❌ ĐÃ TỒN TẠI → BỎ LƯU
  if (index !== -1) {
    favorites[user.id].splice(index, 1);
    saveFavorites(favorites);

    if (btn) {
      btn.classList.remove("active");
      btn.style.color = "#000";
    }

    showToast("❌ Đã bỏ lưu");
    updateSavedCount();
    return;
  }

  // ✅ THÊM
  favorites[user.id].push(recipe);
  saveFavorites(favorites);

  if (btn) {
    btn.classList.add("active");
    btn.style.color = "#e74c3c";

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
// XÓA (TRANG YÊU THÍCH)
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
// CONFIRM POPUP
// =======================
function confirmRemove(id) {
  deleteId = id;
  document.getElementById("confirm-modal")?.classList.add("show");
}

function closeConfirm() {
  deleteId = null;
  document.getElementById("confirm-modal")?.classList.remove("show");
}

// =======================
// RENDER FAVORITES
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
// COUNT
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
// CHECK BUTTON (DETAIL)
// =======================
function checkSaved(recipeId) {
  let btn = document.getElementById("btn-save");
  if (!btn) return;

  if (isSaved(recipeId)) {
    btn.classList.add("active");
    btn.innerHTML = "✅ Đã lưu";
  }
}

// =======================
// SETUP BUTTON DETAIL
// =======================
function setupSaveButton() {
  let btnSave = document.getElementById("btn-save");
  if (!btnSave) return;

  // 🔥 lấy id từ slider (hero)
  let currentId = null;

  // 👉 lấy id khi slider render
  function updateCurrentRecipe() {
    const title = document.getElementById("hero-title")?.innerText;

    // 🔥 tìm trong data (hack nhẹ nhưng hiệu quả)
    fetch("./data/db.json")
      .then(res => res.json())
      .then(data => {
        let found = data.recipes.find(r => r.name === title);
        if (found) {
          currentId = found.id;

          // 👉 check saved
          if (isSaved(currentId)) {
            btnSave.classList.add("active");
            btnSave.innerHTML = "✅ Đã lưu";
          } else {
            btnSave.classList.remove("active");
            btnSave.innerHTML = `<i class="fa-solid fa-bookmark"></i> Lưu công thức`;
          }
        }
      });
  }

  // 🔥 click save
  btnSave.onclick = (e) => {
    e.preventDefault();

    let name = document.getElementById("hero-title")?.innerText;
    let image = document.getElementById("main-img")?.src;

    if (!currentId) return;

    let recipe = {
      id: currentId,
      name,
      image
    };

    addToFavorite(recipe, btnSave);

    // update lại text
    setTimeout(updateCurrentRecipe, 100);
  };

  // 🔥 theo dõi slider thay đổi
  setInterval(updateCurrentRecipe, 500);
}

// =======================
// TOAST
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

// =======================
// INIT
// =======================
document.addEventListener("DOMContentLoaded", () => {
  setupSaveButton();
  updateSavedCount();

  if (document.getElementById("favorite-list")) {
    renderFavorites();
  }

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