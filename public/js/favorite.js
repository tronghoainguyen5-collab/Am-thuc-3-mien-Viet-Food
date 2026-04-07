// =======================
// 🌐 API
// =======================
const API_FAV = "https://am-thuc-3-mien-viet-food.onrender.com/api/favorites";

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
// FAVORITES (LOCAL - fallback)
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
  let list = favorites[user._id] || []; // 🔥 FIX

  return list.some(item => item.id === recipeId);
}

// =======================
// TOGGLE SAVE (API + LOCAL)
// =======================
async function addToFavorite(recipe, btn) {
  let user = getCurrentUser();

  if (!user) {
    showPopup("⚠️ Vui lòng đăng nhập!");
    return;
  }

  let favorites = getFavorites();
  if (!favorites[user._id]) {
    favorites[user._id] = [];
  }

  let index = favorites[user._id].findIndex(item => item.id === recipe.id);

  // ❌ ĐÃ TỒN TẠI → XÓA
  if (index !== -1) {
    await removeFavorite(recipe.id);
    return;
  }

  // ================= API =================
  try {
    await fetch(API_FAV, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        userId: user._id,
        recipeId: recipe.id,
        name: recipe.name,
        image: recipe.image
      })
    });

  } catch (err) {
    console.log("API lỗi → fallback local");
  }

  // ================= LOCAL =================
  favorites[user._id].push(recipe);
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
// XÓA (API + LOCAL)
// =======================
async function removeFavorite(id) {
  let user = getCurrentUser();
  if (!user) return;

  // ================= API =================
  try {
    await fetch(`${API_FAV}/${user._id}/${id}`, {
      method: "DELETE"
    });
  } catch (err) {
    console.log("API lỗi → fallback local");
  }

  // ================= LOCAL =================
  let favorites = getFavorites();

  favorites[user._id] = (favorites[user._id] || []).filter(item => item.id !== id);

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
// RENDER FAVORITES (🔥 LOAD DB)
// =======================
async function renderFavorites() {
  let user = getCurrentUser();

  if (!user) {
    showPopup("⚠️ Vui lòng đăng nhập!");
    window.location.href = "dang-nhap.html";
    return;
  }

  let list = [];

  // ================= LOAD API =================
  try {
    const res = await fetch(`${API_FAV}/${user._id}`);
    list = await res.json();
  } catch (err) {
    console.log("API lỗi → dùng local");
    let favorites = getFavorites();
    list = favorites[user._id] || [];
  }

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
        
        <button class="favorite-icon active" onclick="confirmRemove(${item.recipeId || item.id})">
          <i class="fa-solid fa-bookmark"></i>
        </button>
      </div>

      <div class="favorite-body">
        <h3>${item.name}</h3>

        <div class="favorite-actions">
          <a href="chi-tiet.html?id=${item.recipeId || item.id}" class="btn-view">
            Xem chi tiết
          </a>

          <button class="btn-remove" onclick="confirmRemove(${item.recipeId || item.id})">
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
  let count = favorites[user._id]?.length || 0;

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
// SETUP BUTTON DETAIL (🔥 FIX API)
// =======================
function setupSaveButton() {
  let btnSave = document.getElementById("btn-save");
  if (!btnSave) return;

  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  if (!id) return;

  fetch(`https://am-thuc-3-mien-viet-food.onrender.com/api/recipes/${id}`)
    .then(res => res.json())
    .then(recipe => {

      if (!recipe) return;

      if (isSaved(recipe.id)) {
        btnSave.classList.add("active");
        btnSave.innerHTML = "✅ Đã lưu";
      }

      btnSave.onclick = (e) => {
        e.preventDefault();

        addToFavorite({
          id: recipe.id,
          name: recipe.name,
          image: recipe.image
        }, btnSave);
      };

    });
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

function showPopup(message) {
  const popup = document.getElementById("popup");
  const msg = document.getElementById("popup-message");

  if (!popup || !msg) return;

  msg.innerText = message;
  popup.classList.add("show");

  clearTimeout(popup.timer);

  popup.timer = setTimeout(() => {
    popup.classList.remove("show");
  }, 2000);
}

function closePopup() {
  const popup = document.getElementById("popup");
  if (popup) popup.classList.remove("show");
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