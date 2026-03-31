const dropdownBtn = document.querySelector('.dropdown-parent > a');
const dropdownMenu = document.querySelector('.dropdown-menu');
const parent = document.querySelector('.dropdown-parent');

const titleEl = document.getElementById('category-title');
const productList = document.getElementById('product-list');

// Lấy type từ URL
const params = new URLSearchParams(window.location.search);
const type = params.get('type');

// Load dữ liệu
async function loadData() {
    try {
        const res = await fetch('./data/db.json');
        const data = await res.json();

        console.log(data); // debug

        // Lấy tên type
        const typeObj = data.types.find(t => t.type === type);

        // Set title
        titleEl.innerText = typeObj ? typeObj.name : 'Không tìm thấy danh mục';

        // Lấy recipes thay vì products
        const recipes = data.recipes || [];

        // Lọc theo type
        const filteredRecipes = recipes.filter(r => r.type === type);

        renderRecipes(filteredRecipes);

    } catch (err) {
        console.error(err);
    }
}

// Render recipes
function renderRecipes(recipes) {
    productList.innerHTML = '';

    if (recipes.length === 0) {
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

loadData();

// Toggle dropdown (fix null)
if (dropdownBtn) {
    dropdownBtn.addEventListener('click', function(e) {
        e.preventDefault();
        dropdownMenu.classList.toggle('show');
        parent.classList.toggle('active');
    });
}

// Click ngoài để đóng
document.addEventListener('click', function(e) {
    if (!e.target.closest('.dropdown-parent')) {
        dropdownMenu.classList.remove('show');
        parent.classList.remove('active');
    }
});