// public/js/profile.js

document.addEventListener('DOMContentLoaded', () => {
    const uploadInput = document.getElementById('upload-photo');
    const avatarImg = document.getElementById('avatar-preview');
    const nameDisplay = document.getElementById('display-name');

    // 1. Lấy thông tin người dùng đang đăng nhập (Object từ auth.js)
    let currentUser = JSON.parse(localStorage.getItem('currentUser'));

    // Nếu chưa đăng nhập mà vào trang này, đẩy về trang login
    if (!currentUser) {
        alert("Vui lòng đăng nhập để xem hồ sơ!");
        window.location.href = "dang-nhap.html";
        return;
    }

    // 2. Hiển thị dữ liệu hiện có của user lên giao diện Profile
    if (currentUser.avatar) avatarImg.src = currentUser.avatar;
    if (currentUser.username) nameDisplay.innerText = currentUser.username;

    // 3. Xử lý khi người dùng thay đổi ảnh
    if (uploadInput) {
        uploadInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                // Kiểm tra định dạng ảnh
                if (!file.type.startsWith('image/')) {
                    alert("Vui lòng chọn file hình ảnh!");
                    return;
                }

                const reader = new FileReader();
                reader.onload = function(event) {
                    const result = event.target.result;
                    
                    // A. Hiển thị lên giao diện Profile ngay lập tức
                    avatarImg.src = result;
                    
                    // B. CẬP NHẬT DỮ LIỆU (Đồng bộ hệ thống)
                    updateUserData('avatar', result);
                };
                reader.readAsDataURL(file);
            }
        });
    }
});

// Hàm hỗ trợ cập nhật dữ liệu vào cả currentUser và mảng users tổng
function updateUserData(key, value) {
    // 1. Lấy currentUser và mảng users
    let currentUser = JSON.parse(localStorage.getItem('currentUser'));
    let users = JSON.parse(localStorage.getItem('users')) || [];

    if (!currentUser) return;

    // 2. Cập nhật vào Object currentUser
    currentUser[key] = value;
    localStorage.setItem('currentUser', JSON.stringify(currentUser));

    // 3. Cập nhật vào mảng users tổng (để lần sau đăng nhập vẫn còn)
    let userIndex = users.findIndex(u => u.id === currentUser.id);
    if (userIndex !== -1) {
        users[userIndex][key] = value;
        localStorage.setItem('users', JSON.stringify(users));
    }
    
    // Thông báo cho người dùng (tùy chọn)
    console.log(`Đã cập nhật ${key} thành công!`);
}

// Hàm chỉnh sửa tên (Giữ nguyên logic prompt của bạn nhưng thêm đồng bộ)
function editProfile() {
    const nameNode = document.getElementById('display-name');
    const oldName = nameNode.innerText;
    
    const newName = prompt("Nhập tên mới của bạn:", oldName);
    
    if (newName && newName.trim() !== "") {
        // Hiển thị lên giao diện Profile
        nameNode.innerText = newName;
        
        // Cập nhật vào hệ thống
        updateUserData('username', newName);
        
        // Tùy chọn: Load lại trang để Header cập nhật ngay lập tức
        // window.location.reload();
    }
}

// ================= LỊCH SỬ ĐÃ XEM =================

// Load lịch sử
let showAllHistory = false; // trạng thái

function loadHistory() {
    const historyList = document.getElementById("history-list");
    if (!historyList) return;

    let history = JSON.parse(localStorage.getItem("viewHistory")) || [];

    historyList.innerHTML = "";

    if (history.length === 0) {
        historyList.innerHTML = `<p class="history-empty">Chưa có món nào</p>`;
        return;
    }

    const reversed = [...history].reverse();

    // 🔥 CHỈ HIỂN THỊ 6 MÓN
    const visibleItems = showAllHistory ? reversed : reversed.slice(0, 6);

    visibleItems.forEach(item => {
        const card = document.createElement("div");
        card.className = "history-card";

        card.innerHTML = `
            <div class="history-img" style="background-image:url('${item.img}')"></div>
            
            <div class="history-info">
                <h4>${item.name}</h4>
                <p>⏱ ${item.time}</p>
            </div>

            <span class="delete-item" data-id="${item.id}">
                <i class="fas fa-times"></i>
            </span>
        `;

        card.onclick = () => {
            window.location.href = `chi-tiet.html?id=${item.id}`;
        };

        card.querySelector(".delete-item").onclick = (e) => {
            e.stopPropagation();
            deleteHistoryItem(item.id);
        };

        historyList.appendChild(card);
    });

    // 🔥 NÚT XEM THÊM
    if (history.length > 6) {
        const btn = document.createElement("button");
        btn.className = "btn-history";
        btn.innerHTML = showAllHistory ? "Thu gọn" : "Xem thêm";

        btn.onclick = () => {
            showAllHistory = !showAllHistory;
            loadHistory();
        };

        historyList.appendChild(btn);
    }

    // 🔥 NÚT XÓA TẤT CẢ
    const clearBtn = document.createElement("button");
    clearBtn.className = "btn-history";
    clearBtn.innerHTML = "🗑 Xóa tất cả";

    clearBtn.onclick = () => {
        if (confirm("Xóa toàn bộ lịch sử?")) {
            localStorage.removeItem("viewHistory");
            loadHistory();
        }
    };

    historyList.appendChild(clearBtn);
}

// Gọi khi load trang (KHÔNG đụng code cũ)
document.addEventListener("DOMContentLoaded", loadHistory);


// Hàm lưu lịch sử (gọi ở trang món ăn)
// ================= TOGGLE LỊCH SỬ =================
function toggleHistory() {
    const box = document.getElementById("history-box");

    if (box.style.display === "none") {
        box.style.display = "block";
        loadHistory(); // load khi mở
    } else {
        box.style.display = "none";
    }
}
// ================= LƯU LỊCH SỬ =================
function saveToHistory(recipe) {
    let history = JSON.parse(localStorage.getItem("viewHistory")) || [];

    // tránh trùng
    history = history.filter(item => item.name !== recipe.name);

    history.push(recipe);

    // giới hạn 10 món
    if (history.length > 10) {
        history.shift();
    }

    localStorage.setItem("viewHistory", JSON.stringify(history));
}
function deleteHistoryItem(id) {
    let history = JSON.parse(localStorage.getItem("viewHistory")) || [];

    history = history.filter(item => item.id !== id);

    localStorage.setItem("viewHistory", JSON.stringify(history));

    loadHistory(); // render lại
}