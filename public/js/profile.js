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

