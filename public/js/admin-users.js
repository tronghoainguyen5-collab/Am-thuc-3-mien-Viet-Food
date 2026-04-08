/**
 * VietStove Admin - User Management Controller (FULL & FINAL FIX)
 * Khắc phục triệt để lỗi: Null 'src', Không lưu được, Mất dữ liệu.
 */

// 1. Hàm lấy dữ liệu an toàn từ nhiều nguồn
function getCurrentDB() {
    if (typeof getDB === 'function') return getDB();
    const local = localStorage.getItem("vietstove_db");
    if (local) return JSON.parse(local);
    if (typeof defaultData !== 'undefined') return JSON.parse(JSON.stringify(defaultData));
    return { users: [] };
}

let db = getCurrentDB();

document.addEventListener("DOMContentLoaded", () => {
    const userList = document.getElementById("userList");
    const userForm = document.getElementById("userForm");

    // Khởi tạo phần chọn ảnh và hiển thị dữ liệu
    injectImageUpload(userForm);
    
    if (userList) renderUsers();
    if (userForm) setupFormSubmit(userForm);
});

// --- 2. HÀM CHÈN Ô CHỌN ẢNH (Bảo vệ chống lỗi Null 'src') ---
function injectImageUpload(form) {
    if (!form || document.getElementById('userAvatar')) return;
    
    // Tìm vị trí chèn: trước nút Hủy/Lưu hoặc cuối Form
    const actionGroup = form.querySelector('.modal-actions') || form.querySelector('button[type="submit"]')?.parentNode;
    
    const imageGroup = document.createElement('div');
    imageGroup.className = 'input-group';
    imageGroup.style.marginBottom = "22px";
    imageGroup.innerHTML = `
        <label style="display: block; margin-bottom: 10px; color: var(--text-muted); font-size: 12px; font-weight: 700; text-transform: uppercase;">Ảnh đại diện</label>
        <div style="display: flex; align-items: center; gap: 15px; background: rgba(255, 255, 255, 0.03); padding: 15px; border-radius: 16px; border: 1px solid var(--border);">
            <img id="imgPreview" src="https://ui-avatars.com/api/?name=U&background=4facfe&color=fff" 
                 style="width: 55px; height: 55px; border-radius: 12px; object-fit: cover; border: 1px solid rgba(255,255,255,0.1);">
            <input type="file" id="userAvatar" accept="image/*" style="font-size: 11px; color: #a1a1aa; cursor: pointer;">
        </div>
    `;
    
    if (actionGroup) {
        actionGroup.parentNode.insertBefore(imageGroup, actionGroup);
    } else {
        form.appendChild(imageGroup);
    }

    // Xử lý đổi ảnh thời gian thực
    const avatarInput = document.getElementById('userAvatar');
    if (avatarInput) {
        avatarInput.onchange = function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (ev) => {
                    const preview = document.getElementById('imgPreview');
                    if (preview) preview.src = ev.target.result;
                };
                reader.readAsDataURL(file);
            }
        };
    }
}

// --- 3. HIỂN THỊ DANH SÁCH NGƯỜI DÙNG ---
function renderUsers() {
    const userList = document.getElementById("userList");
    if (!userList) return;

    db = getCurrentDB();
    const users = db.users || [];
    
    if (users.length === 0) {
        userList.innerHTML = `<tr><td colspan="5" style="text-align:center; padding: 40px; color: #a1a1aa;">Chưa có dữ liệu người dùng.</td></tr>`;
        return;
    }

    userList.innerHTML = users.map(user => {
        const avatar = user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.fullname)}&background=4facfe&color=fff`;
        const roleClass = (user.role === 'Admin' || user.role === 'Quản trị') ? 'role-admin' : 'role-user';
        
        return `
        <tr style="border-bottom: 1px solid rgba(255,255,255,0.02);">
            <td style="padding: 18px 15px; color: #64748b;">#${user.id}</td>
            <td style="padding: 18px 15px;">
                <div style="display: flex; align-items: center; gap: 12px;">
                    <img src="${avatar}" style="width:38px; height:38px; border-radius:10px; object-fit:cover;">
                    <span style="font-weight:600; color:#fff;">${user.fullname}</span>
                </div>
            </td>
            <td style="padding: 18px 15px; color: #a1a1aa;">${user.email}</td>
            <td style="padding: 18px 15px;"><span class="role-badge ${roleClass}">${user.role}</span></td>
            <td style="padding: 18px 15px; text-align:center;">
                <button onclick="openUserModal(true, ${user.id})" style="background:none; border:none; color:#4facfe; cursor:pointer; font-weight:700; margin-right:12px;">Sửa</button>
                <button onclick="deleteUser(${user.id})" style="background:none; border:none; color:#ff4d4d; cursor:pointer; font-weight:700;">Xóa</button>
            </td>
        </tr>`;
    }).join('');
}

// --- 4. ĐIỀU KHIỂN MODAL (Fix lỗi Null khi mở) ---
function openUserModal(isEdit = false, id = null) {
    const modal = document.getElementById("userModal");
    if (!modal) return;

    const form = document.getElementById("userForm");
    if (form) form.reset();
    
    modal.style.display = "flex";

    // Reset ảnh về mặc định
    const preview = document.getElementById("imgPreview");
    if (preview) preview.src = "https://ui-avatars.com/api/?name=U&background=4facfe&color=fff";

    if (isEdit && id) {
        const user = db.users.find(u => u.id == id);
        if (user) {
            document.getElementById("userModalTitle").innerText = "Chỉnh sửa người dùng";
            document.getElementById("userId").value = user.id;
            document.getElementById("userName").value = user.fullname;
            document.getElementById("userEmail").value = user.email;
            document.getElementById("userRole").value = user.role;
            if (user.avatar && preview) preview.src = user.avatar;
        }
    } else {
        document.getElementById("userModalTitle").innerText = "Thêm người dùng mới";
        document.getElementById("userId").value = "";
    }
}

function closeUserModal() {
    const m = document.getElementById("userModal");
    if (m) m.style.display = "none";
}

// --- 5. LƯU DỮ LIỆU (Fix lỗi không bấm được nút Lưu) ---
function setupFormSubmit(form) {
    form.onsubmit = function(e) {
        e.preventDefault();
        
        try {
            const id = document.getElementById("userId").value;
            const fullname = document.getElementById("userName").value.trim();
            const email = document.getElementById("userEmail").value.trim();
            const role = document.getElementById("userRole").value;
            const preview = document.getElementById("imgPreview");
            const avatar = preview ? preview.src : "";

            if (!fullname || !email) return alert("Vui lòng nhập đầy đủ thông tin!");

            db = getCurrentDB();
            if (!db.users) db.users = [];

            if (id) {
                const idx = db.users.findIndex(u => u.id == id);
                if (idx !== -1) db.users[idx] = { ...db.users[idx], fullname, email, role, avatar };
            } else {
                db.users.push({
                    id: Math.floor(Math.random() * 9000) + 1000,
                    fullname, email, role,
                    avatar: avatar.includes('ui-avatars') ? "" : avatar
                });
            }

            // Lưu an toàn
            if (typeof saveDB === 'function') saveDB(db);
            else localStorage.setItem("vietstove_db", JSON.stringify(db));

            closeUserModal();
            renderUsers();
            alert("Đã lưu thông tin người dùng!");

        } catch (err) {
            console.error("Lỗi thực thi:", err);
            alert("Có lỗi xảy ra khi lưu dữ liệu!");
        }
    };
}

// --- 6. XÓA NGƯỜI DÙNG ---
function deleteUser(id) {
    if (confirm("Bạn có chắc chắn muốn xóa người dùng này?")) {
        db = getCurrentDB();
        db.users = db.users.filter(u => u.id != id);
        if (typeof saveDB === 'function') saveDB(db);
        else localStorage.setItem("vietstove_db", JSON.stringify(db));
        renderUsers();
    }
}

// Click ra ngoài để đóng modal
window.onclick = (e) => {
    const modal = document.getElementById("userModal");
    if (e.target == modal) closeUserModal();
};