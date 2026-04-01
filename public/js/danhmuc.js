// =======================
// 🔽 DROPDOWN NAVBAR
// =======================
const dropdownBtn = document.querySelector('.dropdown-parent > a');
const dropdownMenu = document.querySelector('.dropdown-parent .dropdown-menu');
const parent = document.querySelector('.dropdown-parent');

// =======================
// 📦 ELEMENT
// =======================
const titleEl = document.getElementById('category-title');
const productList = document.getElementById('product-list');

// =======================
// 🔍 PARAM
// =======================
const params = new URLSearchParams(window.location.search);
const type = params.get('type');

// =======================
// 🚀 LOAD DATA
// =======================
async function loadData() {
    try {
        const res = await fetch('./data/db.json');
        const data = await res.json();

        const recipes = data.recipes || [];

        const filteredRecipes = recipes.filter(r => {
    if (!r.type || !type) return false;

    return r.type.toLowerCase().trim() === type.toLowerCase().trim();
});

        renderRecipes(filteredRecipes);

    } catch (err) {
        console.error("Lỗi load data:", err);
    }
}

// =======================
// 🎨 RENDER
// =======================
function renderRecipes(recipes) {
    if (!productList) return;

    productList.innerHTML = '';

    if (!recipes || recipes.length === 0) {
        productList.innerHTML = '<p>Không có món nào</p>';
        return;
    }

    recipes.forEach(r => {
        const div = document.createElement('div');
        div.classList.add('product-card');

        div.innerHTML = `
            <img src="${r.image}" alt="${r.name}">
            <h3>${r.name}</h3>
        `;

        productList.appendChild(div);
    });
}

// =======================
// ▶️ RUN
// =======================
loadData();

// =======================
// 🔽 DROPDOWN MENU
// =======================

// 👉 CLICK MENU
if (dropdownBtn && dropdownMenu && parent) {
    dropdownBtn.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation(); // 🔥 QUAN TRỌNG

        dropdownMenu.classList.toggle('show');
        parent.classList.toggle('active');
    });
}

// 👉 CLICK NGOÀI
document.addEventListener('click', function (e) {
    if (!dropdownMenu || !parent) return;

    if (!e.target.closest('.dropdown-parent')) {
        dropdownMenu.classList.remove('show');
        parent.classList.remove('active');
    }
});