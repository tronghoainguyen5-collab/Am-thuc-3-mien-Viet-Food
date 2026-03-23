const gridContainer = document.getElementById('favorite-list');
const modal = document.getElementById('recipe-modal');
const modalBody = document.getElementById('modal-body');

function renderFavorites() {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    gridContainer.innerHTML = '';

    favorites.forEach(item => {
        // Tìm dữ liệu đầy đủ từ kho allRecipes dựa trên ID
        const fullData = allRecipes.find(r => r.id === item.id) || item;

        const card = document.createElement('div');
        card.className = 'recipe-card';
        card.innerHTML = `
            <div class="thumb" onclick="openRecipe('${fullData.id}')">
                <img src="${fullData.img}" alt="${fullData.name}">
                <button class="save-icon" onclick="event.stopPropagation(); removeFavorite('${fullData.id}')">
                    <i class="fa-solid fa-bookmark" style="color: #e74c3c;"></i>
                </button>
            </div>
            <div class="info" onclick="openRecipe('${fullData.id}')">
                <h3>${fullData.name}</h3>
                <p><i class="fa-regular fa-clock"></i> ${fullData.time || '30 phút'}</p>
            </div>
        `;
        gridContainer.appendChild(card);
    });
}

// Hàm mở công thức chi tiết
function openRecipe(id) {
    const recipe = allRecipes.find(r => r.id === id);
    if (!recipe) return;

    modalBody.innerHTML = `
        <img src="${recipe.img}" class="modal-img">
        <h2 style="margin-top:20px">${recipe.name}</h2>
        <div style="margin: 15px 0;">
            <span class="tag">⏱ ${recipe.time}</span>
            <span class="tag">📊 ${recipe.level}</span>
        </div>
        <hr>
        <h3>Nguyên liệu:</h3>
        <ul>${recipe.ingredients.map(ing => `<li>${ing}</li>`).join('')}</ul>
        <h3>Cách làm:</h3>
        <ol>${recipe.steps.map(step => `<li style="margin-bottom:10px">${step}</li>`).join('')}</ol>
    `;
    modal.style.display = "block";
}

function closeModal() {
    modal.style.display = "none";
}

// Đóng modal khi bấm ra ngoài vùng trắng
window.onclick = function(event) {
    if (event.target == modal) closeModal();
}

document.addEventListener('DOMContentLoaded', renderFavorites);