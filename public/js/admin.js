// Lấy các element
localStorage.removeItem("db.json"); // Dòng code tạm thời
const recipeList = document.getElementById("recipeList");
const recipeForm = document.getElementById("recipeForm");
const modal = document.getElementById("recipeModal");
const imageInput = document.getElementById("recipeImage");
const imagePreview = document.getElementById("imagePreview");
const imagePreviewContainer = document.getElementById("imagePreviewContainer");

// Khởi tạo dữ liệu
let db = getDB(); 

document.addEventListener("DOMContentLoaded", () => {
    if (recipeList && recipeForm) {
        renderCategories(); 
        renderRecipes();    
        setupImagePreview();
    }
});

// --- 1. HIỂN THỊ DANH MỤC TRONG MODAL ---
function renderCategories() {
    const selectRegion = document.getElementById("recipeRegion");
    if (selectRegion && db.categories) {
        selectRegion.innerHTML = db.categories.map(cat => 
            `<option value="${cat.id}">${cat.name}</option>`
        ).join('');
    }
}

// --- 2. HIỂN THỊ DANH SÁCH MÓN ĂN ---
function renderRecipes() {
    if (!recipeList) return;

    // Sắp xếp ID giảm dần để món mới luôn nằm trên cùng
    const sortedRecipes = [...db.recipes].sort((a, b) => b.id - a.id);

    if (sortedRecipes.length === 0) {
        recipeList.innerHTML = `<tr><td colspan="5" style="text-align:center; padding: 40px; color: #94a3b8;">Chưa có dữ liệu công thức.</td></tr>`;
        return;
    }

    recipeList.innerHTML = sortedRecipes.map((item) => {
        const category = db.categories.find(cat => cat.id == item.categoryId);
        const categoryName = category ? category.name : "N/A";

        return `
        <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);">
            <td style="padding: 15px; text-align:center;">
                <img src="${item.image}" alt="${item.name}" style="width:80px; height:55px; object-fit:cover; border-radius:8px; border: 1px solid #334155;" onerror="this.src='https://placehold.co/80x55?text=No+Image'">
            </td>
            <td style="padding: 15px;"><span style="font-weight:600; color:#e2e8f0;">${item.name}</span></td>
            <td style="padding: 15px;">
                <span style="background: rgba(79, 172, 254, 0.1); color: #4facfe; padding: 6px 14px; border-radius: 20px; font-size:12px; border: 1px solid rgba(79, 172, 254, 0.2); white-space: nowrap;">
                    ${categoryName}
                </span>
            </td>
            <td style="padding: 15px; text-align:center; color:#94a3b8;">${item.views || 0} lượt</td>
            <td style="padding: 15px; text-align:center;">
                <button onclick="openModal(true, ${item.id})" style="background:none; border:1px solid #4facfe; color:#4facfe; padding:6px 16px; border-radius:8px; cursor:pointer; margin-right:5px; transition: 0.3s;">Sửa</button>
                <button onclick="deleteRecipe(${item.id})" style="background:none; border:1px solid #f87171; color:#f87171; padding:6px 16px; border-radius:8px; cursor:pointer; transition: 0.3s;">Xóa</button>
            </td>
        </tr>`;
    }).join('');
}

// --- 3. XỬ LÝ ẢNH ---
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

function fileToBase64(file) {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
    });
}

// --- 4. MODAL CONTROL ---
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

// --- 5. LƯU DỮ LIỆU ---
recipeForm.onsubmit = async (e) => {
    e.preventDefault();
    const id = document.getElementById("recipeId").value;
    const name = document.getElementById("recipeName").value.trim();
    const catId = parseInt(document.getElementById("recipeRegion").value);
    const file = imageInput.files[0];

    let imageData = imagePreview.src;
    if (file) imageData = await fileToBase64(file);

    if (id) {
        const index = db.recipes.findIndex(r => r.id == id);
        db.recipes[index] = { ...db.recipes[index], name, categoryId: catId, image: imageData };
    } else {
        db.recipes.push({
            id: Date.now(),
            name,
            categoryId: catId,
            image: imageData,
            views: 0
        });
    }

    saveDB(db);
    closeModal();
    renderRecipes();
};

// --- 6. XÓA ---
function deleteRecipe(id) {
    if (confirm("Xác nhận xóa món ăn này?")) {
        db.recipes = db.recipes.filter(r => r.id != id);
        saveDB(db);
        renderRecipes();
    }
}

window.onclick = (e) => { if (e.target == modal) closeModal(); };