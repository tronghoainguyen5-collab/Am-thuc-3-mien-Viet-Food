const API_URL = "http://localhost:3000/recipes";
const CAT_URL = "http://localhost:3000/categories";

const modal = document.getElementById("recipeModal");
const recipeForm = document.getElementById("recipeForm");
const recipeList = document.getElementById("recipeList");

let categories = []; // Lưu danh mục để dùng chung

// Khởi tạo khi load trang
document.addEventListener("DOMContentLoaded", async () => {
    await fetchCategories(); 
    await fetchRecipes();   
});

// --- 1. LẤY DANH MỤC VÙNG MIỀN ---
async function fetchCategories() {
    try {
        const response = await fetch(CAT_URL);
        categories = await response.json();
        
        // Đổ dữ liệu vào select box trong form
        const selectRegion = document.getElementById("recipeRegion");
        if (selectRegion) {
            selectRegion.innerHTML = categories.map(cat => 
                `<option value="${cat.id}">${cat.name}</option>`
            ).join('');
        }
    } catch (error) {
        console.error("Lỗi lấy danh mục:", error);
    }
}

// --- 2. LẤY DANH SÁCH MÓN ĂN ---
async function fetchRecipes() {
    try {
        console.log("Đang gọi API..."); // Kiểm tra xem nó có chạy đến đây không
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error("Server không phản hồi!");
        const recipes = await response.json();
        console.log("Dữ liệu nhận được:", recipes); // Check xem có nhận được dữ liệu không
        renderRecipes(recipes);
    } catch (error) {
        console.error("LỖI CHI TIẾT:", error);
        recipeList.innerHTML = `<tr><td colspan="5" style="color:red;">Lỗi: ${error.message}</td></tr>`;
    }
}

// --- 3. HIỂN THỊ DỮ LIỆU LÊN BẢNG ---
function renderRecipes(recipes) {
    if (!recipeList) return;
    
    recipeList.innerHTML = recipes.map((item) => {
        // Tìm tên vùng miền tương ứng với categoryId
        const category = categories.find(cat => cat.id == item.categoryId);
        const categoryName = category ? category.name : "N/A";

        return `
        <tr>
            <td><img src="${item.image}" alt="${item.name}" style="width:60px; height:45px; object-fit:cover; border-radius:6px; border: 1px solid #334155;"></td>
            <td><strong>${item.name}</strong></td>
            <td><span class="badge" style="background: rgba(79, 172, 254, 0.1); color: #4facfe; padding: 4px 8px; border-radius: 6px;">${categoryName}</span></td>
            <td>${item.time || '---'}</td>
            <td>
                <button class="btn btn-edit" onclick="openModal(true, ${item.id})" style="cursor:pointer; margin-right:5px;">Sửa</button>
                <button class="btn btn-delete" onclick="deleteRecipe(${item.id})" style="cursor:pointer; color:#f87171;">Xóa</button>
            </td>
        </tr>
    `}).join('');
}

// --- 4. ĐIỀU KHIỂN MODAL ---
async function openModal(isEdit = false, id = null) {
    modal.style.display = "flex";
    recipeForm.reset(); // Xóa trắng form trước khi làm việc

    if (isEdit && id) {
        try {
            const response = await fetch(`${API_URL}/${id}`);
            const recipe = await response.json();
            
            document.getElementById("modalTitle").innerText = "Chỉnh sửa công thức";
            document.getElementById("recipeId").value = recipe.id;
            document.getElementById("recipeName").value = recipe.name;
            document.getElementById("recipeRegion").value = recipe.categoryId;
        } catch (error) {
            alert("Không thể lấy thông tin món ăn!");
        }
    } else {
        document.getElementById("modalTitle").innerText = "Thêm công thức mới";
        document.getElementById("recipeId").value = "";
    }
}

function closeModal() {
    modal.style.display = "none";
}

// --- 5. XỬ LÝ LƯU DỮ LIỆU (POST / PUT) ---
recipeForm.onsubmit = async (e) => {
    e.preventDefault();
    
    const id = document.getElementById("recipeId").value;
    const name = document.getElementById("recipeName").value.trim();
    const catId = document.getElementById("recipeRegion").value;

    // Tạo đối tượng dữ liệu để gửi lên db.json
    const recipeData = {
        name: name,
        categoryId: parseInt(catId),
        // Giữ lại ảnh cũ hoặc dùng ảnh placeholder nếu là món mới
        image: "https://via.placeholder.com/300x200?text=VietFood", 
        time: "45 phút",
        views: 0
    };

    try {
        const method = id ? "PUT" : "POST";
        const url = id ? `${API_URL}/${id}` : API_URL;

        const response = await fetch(url, {
            method: method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(recipeData)
        });

        if (response.ok) {
            closeModal();
            fetchRecipes(); // Cập nhật lại danh sách ngay lập tức
        }
    } catch (error) {
        alert("Có lỗi xảy ra khi lưu!");
    }
};

// --- 6. XÓA MÓN ĂN ---
async function deleteRecipe(id) {
    if (confirm("Anh có chắc muốn xóa món ăn này khỏi hệ thống?")) {
        try {
            await fetch(`${API_URL}/${id}`, { method: "DELETE" });
            fetchRecipes();
        } catch (error) {
            alert("Xóa thất bại!");
        }
    }
}

// Đóng modal khi click ra ngoài vùng trắng
window.onclick = (e) => { if (e.target == modal) closeModal(); };