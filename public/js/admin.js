/**
 * Quản lý công thức - VietStove
 */
const recipeList = document.getElementById("recipeList");
const recipeForm = document.getElementById("recipeForm");
const modal = document.getElementById("recipeModal");
const imageInput = document.getElementById("recipeImage");
const imagePreview = document.getElementById("imagePreview");
const imagePreviewContainer = document.getElementById("imagePreviewContainer");

// Khởi tạo biến db toàn cục
let db = getDB(); 

document.addEventListener("DOMContentLoaded", () => {
    if (recipeList && recipeForm) {
        renderCategories(); 
        renderRecipes();    
        setupImagePreview();
    }
});

function renderCategories() {
    const selectRegion = document.getElementById("recipeRegion");
    if (selectRegion && db.categories) {
        selectRegion.innerHTML = db.categories.map(cat => 
            `<option value="${cat.id}">${cat.name}</option>`
        ).join('');
    }
}

function renderRecipes() {
    if (!recipeList) return;
    const sortedRecipes = [...db.recipes].sort((a, b) => b.id - a.id);

    if (sortedRecipes.length === 0) {
        recipeList.innerHTML = `<tr><td colspan="5" style="text-align:center; padding: 40px; color: #94a3b8;">Chưa có dữ liệu.</td></tr>`;
        return;
    }

    recipeList.innerHTML = sortedRecipes.map((item) => {
        const category = db.categories.find(cat => cat.id == item.categoryId);
        return `
        <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);">
            <td style="padding: 15px; text-align:center;">
                <img src="${item.image}" style="width:80px; height:55px; object-fit:cover; border-radius:8px;" onerror="this.src='https://placehold.co/80x55?text=No+Img'">
            </td>
            <td style="padding: 15px;"><span style="font-weight:600; color:#e2e8f0;">${item.name}</span></td>
            <td style="padding: 15px;"><span class="badge">${category ? category.name : "N/A"}</span></td>
            <td style="padding: 15px; text-align:center; color:#94a3b8;">${item.views || 0} lượt</td>
            <td style="padding: 15px; text-align:center;">
                <button onclick="openModal(true, ${item.id})" class="btn-edit">Sửa</button>
                <button onclick="deleteRecipe(${item.id})" class="btn-delete">Xóa</button>
            </td>
        </tr>`;
    }).join('');
}

function setupImagePreview() {
    if (!imageInput) return;
    imageInput.addEventListener('change', function() {
        const file = this.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                imagePreview.src = e.target.result;
                imagePreviewContainer.style.display = 'block';
            };
            reader.readAsDataURL(file);
        }
    });
}

function openModal(isEdit = false, id = null) {
    if (!modal) return;
    recipeForm.reset();
    imagePreviewContainer.style.display = 'none';
    
    if (isEdit && id) {
        const recipe = db.recipes.find(r => r.id == id);
        if (recipe) {
            document.getElementById("modalTitle").innerText = "Chỉnh sửa công thức";
            document.getElementById("recipeId").value = recipe.id;
            document.getElementById("recipeName").value = recipe.name;
            document.getElementById("recipeRegion").value = recipe.categoryId;
            imagePreview.src = recipe.image;
            imagePreviewContainer.style.display = 'block';
        }
    } else {
        document.getElementById("modalTitle").innerText = "Thêm công thức mới";
        document.getElementById("recipeId").value = "";
    }
    modal.style.display = "flex";
}

function closeModal() { modal.style.display = "none"; }

recipeForm.onsubmit = async (e) => {
    e.preventDefault();
    const id = document.getElementById("recipeId").value;
    const name = document.getElementById("recipeName").value.trim();
    const catId = parseInt(document.getElementById("recipeRegion").value);
    
    let imageData = imagePreview.src;

    if (id) {
        const index = db.recipes.findIndex(r => r.id == id);
        db.recipes[index] = { ...db.recipes[index], name, categoryId: catId, image: imageData };
    } else {
        db.recipes.unshift({
            id: Date.now(),
            name,
            categoryId: catId,
            image: imageData,
            views: 0
        });
    }

    saveDB(db); // Quan trọng: Lưu vào localStorage
    closeModal();
    renderRecipes();
};

function deleteRecipe(id) {
    if (confirm("Xác nhận xóa món ăn này?")) {
        db.recipes = db.recipes.filter(r => r.id != id);
        saveDB(db);
        renderRecipes();
    }
}