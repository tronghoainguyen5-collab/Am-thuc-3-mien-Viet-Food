// Lấy các element cần thiết
const userList = document.getElementById("userList");
const userForm = document.getElementById("userForm");
const userModal = document.getElementById("userModal");

// Lấy dữ liệu từ data.js
let db = getDB();

document.addEventListener("DOMContentLoaded", () => {
    if (userList) {
        renderUsers();
    }
});

// --- 1. HIỂN THỊ DANH SÁCH NGƯỜI DÙNG ---
function renderUsers() {
    if (!userList || !db || !db.users) return;

    // Sắp xếp ID mới nhất lên đầu
    const sortedUsers = [...db.users].sort((a, b) => b.id - a.id);

    if (sortedUsers.length === 0) {
        userList.innerHTML = `<tr><td colspan="5" style="text-align:center; padding: 40px; color: #94a3b8;">Chưa có người dùng nào.</td></tr>`;
        return;
    }

    userList.innerHTML = sortedUsers.map((user) => {
        return `
        <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);">
            <td style="padding: 15px; color: #94a3b8;">#${user.id}</td>
            <td style="padding: 15px;">
                <div style="display: flex; align-items: center; gap: 12px;">
                    <img src="${user.avatar || 'https://ui-avatars.com/api/?name=' + user.fullname}" 
                         alt="Avatar" style="width:35px; height:35px; border-radius:50%; border: 2px solid #4facfe;">
                    <span style="font-weight:600; color:#e2e8f0;">${user.fullname}</span>
                </div>
            </td>
            <td style="padding: 15px; color:#94a3b8;">${user.email}</td>
            <td style="padding: 15px;">
                <span style="background: ${user.role === 'Admin' ? 'rgba(79, 172, 254, 0.1)' : 'rgba(148, 163, 184, 0.1)'}; 
                             color: ${user.role === 'Admin' ? '#4facfe' : '#94a3b8'}; 
                             padding: 5px 12px; border-radius: 6px; font-size:12px; font-weight: 500;">
                    ${user.role}
                </span>
            </td>
            <td style="padding: 15px; text-align:center;">
                <button class="btn-edit" onclick="openUserModal(true, ${user.id})" 
                        style="background:none; border:1px solid #4facfe; color:#4facfe; padding:4px 12px; border-radius:4px; cursor:pointer; margin-right:5px;">Sửa</button>
                <button class="btn-delete" onclick="deleteUser(${user.id})" 
                        style="background:none; border:1px solid #f87171; color:#f87171; padding:4px 12px; border-radius:4px; cursor:pointer;">Xóa</button>
            </td>
        </tr>`;
    }).join('');
}

// --- 2. ĐIỀU KHIỂN MODAL ---
function openUserModal(isEdit = false, id = null) {
    if (!userModal || !userForm) return;
    
    userModal.style.display = "flex";
    userForm.reset();
    const title = document.getElementById("userModalTitle");

    if (isEdit && id) {
        const user = db.users.find(u => u.id == id);
        if (user) {
            title.innerText = "Chỉnh sửa người dùng";
            document.getElementById("userId").value = user.id;
            document.getElementById("userName").value = user.fullname;
            document.getElementById("userEmail").value = user.email;
            document.getElementById("userRole").value = user.role;
        }
    } else {
        title.innerText = "Thêm người dùng mới";
        document.getElementById("userId").value = "";
    }
}

function closeUserModal() {
    if (userModal) userModal.style.display = "none";
}

// --- 3. XỬ LÝ LƯU (THÊM / SỬA) ---
if (userForm) {
    userForm.onsubmit = (e) => {
        e.preventDefault();
        
        const id = document.getElementById("userId").value;
        const fullname = document.getElementById("userName").value.trim();
        const email = document.getElementById("userEmail").value.trim();
        const role = document.getElementById("userRole").value;

        if (id) {
            // Sửa
            const index = db.users.findIndex(u => u.id == id);
            if (index !== -1) {
                db.users[index] = { ...db.users[index], fullname, email, role };
            }
        } else {
            // Thêm mới
            const newUser = {
                id: Date.now() % 10000, // Tạo ID ngắn gọn
                fullname,
                email,
                role,
                avatar: `https://i.pravatar.cc/150?u=${Date.now()}`
            };
            db.users.push(newUser);
        }

        saveDB(db);
        closeUserModal();
        renderUsers();
        alert("Cập nhật thành công!");
    };
}

// --- 4. XÓA NGƯỜI DÙNG ---
function deleteUser(id) {
    if (confirm("Bạn có chắc chắn muốn xóa người dùng này?")) {
        db.users = db.users.filter(u => u.id != id);
        saveDB(db);
        renderUsers();
    }
}

// Đóng modal khi click ra ngoài
window.onclick = (e) => { if (e.target == userModal) closeUserModal(); };