// File: js/data.js

const defaultData = {
    "users": [
        { "id": 1092, "fullname": "Bach Cong Tuan Anh", "email": "anh.bach@fpt.edu.vn", "role": "Admin", "avatar": "https://i.pravatar.cc/150?u=tuananh" },
        { "id": 1093, "fullname": "Nguyen Thu", "email": "thunguyen@gmail.com", "role": "Member", "avatar": "https://i.pravatar.cc/150?u=thu" }
    ],
    "categories": [
        { "id": 1, "name": "Miền Bắc" },
        { "id": 2, "name": "Miền Trung" },
        { "id": 3, "name": "Miền Nam" }
    ],
    "recipes": [
    // --- MIỀN BẮC (categoryId: 1) - Tổng ~35 views ---
    { "id": 1, "name": "Phở Bò Hà Nội", "image": "public/image/image1/id1.png", "categoryId": 1, "views": 8 },
    { "id": 2, "name": "Bún Chả Hà Nội", "image": "https://unicef.org.vn/wp-content/uploads/2023/10/bun-cha-ha-noi.jpeg", "categoryId": 1, "views": 5 },
    { "id": 3, "name": "Bún Đậu Mắm Tôm", "image": "https://unicef.org.vn/wp-content/uploads/2023/10/bun-dau-mam-tom.jpeg", "categoryId": 1, "views": 7 },
    { "id": 4, "name": "Bánh Cuốn Thanh Trì", "image": "https://i1-giadinh.vnecdn.net/2021/11/17/Banh-cuon-Thanh-Tri-7-vnexpress-1763-8270-3622-1763372439.jpg", "categoryId": 1, "views": 2 },
    { "id": 5, "name": "Chả Cá Lã Vọng", "image": "https://statics.vinpearl.com/cha-ca-la-vong-2_1628753903.jpg", "categoryId": 1, "views": 3 },
    { "id": 6, "name": "Bún Thang Hà Nội", "image": "https://statics.vinpearl.com/bun-thang-ha-noi-2_1628754160.jpg", "categoryId": 1, "views": 1 },
    { "id": 7, "name": "Bún Riêu Cua", "image": "https://statics.vinpearl.com/bun-rieu-cua-ha-noi-2_1628754402.jpg", "categoryId": 1, "views": 2 },
    { "id": 8, "name": "Bún Mọc Dọc Mùng", "image": "https://placehold.co/600x400?text=Bun+Moc", "categoryId": 1, "views": 1 },
    { "id": 9, "name": "Bún Cá Rô Đồng", "image": "https://placehold.co/600x400?text=Bun+Ca+Ro", "categoryId": 1, "views": 1 },
    { "id": 10, "name": "Cá Kho Làng Vũ Đại", "image": "https://placehold.co/600x400?text=Ca+Kho+Vu+Dai", "categoryId": 1, "views": 1 },
    { "id": 11, "name": "Chả Mực Hạ Long", "image": "https://placehold.co/600x400?text=Cha+Muc", "categoryId": 1, "views": 1 },
    { "id": 12, "name": "Xôi Xéo Hà Nội", "image": "https://placehold.co/600x400?text=Xoi+Xeo", "categoryId": 1, "views": 1 },
    { "id": 13, "name": "Phở Gà Hà Nội", "image": "https://placehold.co/600x400?text=Pho+Ga", "categoryId": 1, "views": 0 },
    { "id": 14, "name": "Bánh Đa Cua Hải Phòng", "image": "https://placehold.co/600x400?text=Banh+Da+Cua", "categoryId": 1, "views": 1 },
    { "id": 15, "name": "Thắng Cố Hà Giang", "image": "https://placehold.co/600x400?text=Thang+Co", "categoryId": 1, "views": 0 },
    { "id": 16, "name": "Thịt Trâu Gác Bếp", "image": "https://placehold.co/600x400?text=Thit+Trau", "categoryId": 1, "views": 1 },
    { "id": 17, "name": "Bún Ốc Hà Nội", "image": "https://placehold.co/600x400?text=Bun+Oc", "categoryId": 1, "views": 0 },
    { "id": 18, "name": "Nem Chua Rán", "image": "https://placehold.co/600x400?text=Nem+Chua+Ran", "categoryId": 1, "views": 0 },

    // --- MIỀN TRUNG (categoryId: 2) - Tổng ~30 views ---
    { "id": 19, "name": "Bún Bò Huế", "image": "https://vcdn1-dulich.vnecdn.net/2021/05/20/bun-bo-hue-2165-1621503110.jpg", "categoryId": 2, "views": 10 },
    { "id": 20, "name": "Mì Quảng Đà Nẵng", "image": "https://statics.vinpearl.com/mi-quang-da-nang-2_1628754605.jpg", "categoryId": 2, "views": 6 },
    { "id": 21, "name": "Cao Lầu Hội An", "image": "https://statics.vinpearl.com/cao-lau-hoi-an-2_1628754605.jpg", "categoryId": 2, "views": 4 },
    { "id": 22, "name": "Cơm Gà Tam Kỳ", "image": "https://statics.vinpearl.com/com-ga-tam-ky-2_1628754921.jpg", "categoryId": 2, "views": 2 },
    { "id": 23, "name": "Bánh Xèo Miền Trung", "image": "https://statics.vinpearl.com/banh-xeo-mien-trung-2_1628755203.jpg", "categoryId": 2, "views": 1 },
    { "id": 24, "name": "Bánh Bèo Chén", "image": "https://statics.vinpearl.com/banh-beo-hue-2_1628755451.jpg", "categoryId": 2, "views": 1 },
    { "id": 25, "name": "Chả Ram Tôm Đất", "image": "https://statics.vinpearl.com/cha-ram-tom-dat-2_1628755702.jpg", "categoryId": 2, "views": 3 },
    { "id": 26, "name": "Bánh Ram Ít Huế", "image": "https://placehold.co/600x400?text=Banh+Ram+It", "categoryId": 2, "views": 0 },
    { "id": 27, "name": "Bánh Ướt Thịt Nướng", "image": "https://placehold.co/600x400?text=Banh+Uot", "categoryId": 2, "views": 1 },
    { "id": 28, "name": "Cơm Hến Huế", "image": "https://placehold.co/600x400?text=Com+Hen", "categoryId": 2, "views": 1 },
    { "id": 29, "name": "Bánh Khoái Huế", "image": "https://placehold.co/600x400?text=Banh+Khoai", "categoryId": 2, "views": 0 },
    { "id": 30, "name": "Bánh Bột Lọc", "image": "https://placehold.co/600x400?text=Banh+Bot+Loc", "categoryId": 2, "views": 1 },
    { "id": 31, "name": "Bánh Nậm", "image": "https://placehold.co/600x400?text=Banh+Nam", "categoryId": 2, "views": 0 },
    { "id": 32, "name": "Bánh Ít Lá Gai", "image": "https://placehold.co/600x400?text=Banh+It", "categoryId": 2, "views": 0 },
    { "id": 33, "name": "Gỏi Cá Nam Ô", "image": "https://placehold.co/600x400?text=Goi+Ca+Nam+O", "categoryId": 2, "views": 0 },
    { "id": 34, "name": "Mì Quảng Gà", "image": "https://placehold.co/600x400?text=Mi+Quang+Ga", "categoryId": 2, "views": 0 },
    { "id": 35, "name": "Cháo Lươn Nghệ An", "image": "https://placehold.co/600x400?text=Chao+Luon", "categoryId": 2, "views": 0 },
    { "id": 36, "name": "Bánh Căn Miền Trung", "image": "https://placehold.co/600x400?text=Banh+Can", "categoryId": 2, "views": 0 },

    // --- MIỀN NAM (categoryId: 3) - Tổng ~35 views ---
    { "id": 37, "name": "Cơm Tấm Sài Gòn", "image": "https://unicef.org.vn/wp-content/uploads/2023/10/com-tam-sai-gon.jpeg", "categoryId": 3, "views": 12 },
    { "id": 38, "name": "Hủ Tiếu Nam Vang", "image": "https://i1-giadinh.vnecdn.net/2021/11/17/Hu-tieu-Nam-Vang-7-vnexpress-1763-7460-7049-1763372481.jpg", "categoryId": 3, "views": 5 },
    { "id": 39, "name": "Lẩu Mắm Miền Tây", "image": "https://statics.vinpearl.com/lau-mam-mien-tay-1_1629255653.jpg", "categoryId": 3, "views": 4 },
    { "id": 40, "name": "Bánh Mì Sài Gòn", "image": "https://unicef.org.vn/wp-content/uploads/2023/10/banh-mi-sai-gon.jpeg", "categoryId": 3, "views": 8 },
    { "id": 41, "name": "Gỏi Cuốn Tôm Thịt", "image": "https://statics.vinpearl.com/goi-cuon-2_1628756903.jpg", "categoryId": 3, "views": 3 },
    { "id": 42, "name": "Bánh Canh Cua", "image": "https://daotaobepvau.com/wp-content/uploads/2021/01/banh-canh-cua.jpg", "categoryId": 3, "views": 2 },
    { "id": 43, "name": "Bún Mắm Miền Tây", "image": "https://placehold.co/600x400?text=Bun+Mam", "categoryId": 3, "views": 1 },
    { "id": 44, "name": "Cá Kho Tộ", "image": "https://placehold.co/600x400?text=Ca+Kho+To", "categoryId": 3, "views": 0 },
    { "id": 45, "name": "Bò Kho Sài Gòn", "image": "https://placehold.co/600x400?text=Bo+Kho", "categoryId": 3, "views": 0 },
    { "id": 46, "name": "Canh Chua Cá Lóc", "image": "https://placehold.co/600x400?text=Canh+Chua", "categoryId": 3, "views": 0 },
    { "id": 47, "name": "Chuối Nếp Nướng", "image": "https://placehold.co/600x400?text=Chuoi+Nep", "categoryId": 3, "views": 0 },
    { "id": 48, "name": "Gà Kho Sả Nghệ", "image": "https://placehold.co/600x400?text=Ga+Kho", "categoryId": 3, "views": 0 },
    { "id": 49, "name": "Phở Khô Gia Lai", "image": "https://placehold.co/600x400?text=Pho+Kho", "categoryId": 3, "views": 0 },
    { "id": 50, "name": "Bánh Tét Miền Tây", "image": "https://placehold.co/600x400?text=Banh+Tet", "categoryId": 3, "views": 0 }
]
};

// Hàm lấy dữ liệu an toàn
function getDB() {
    const data = localStorage.getItem("db.json");
    if (!data) {
        localStorage.setItem("db.json", JSON.stringify(defaultData));
        return defaultData;
    }
    return JSON.parse(data);
}

// Hàm lưu dữ liệu
function saveDB(data) {
    localStorage.setItem("db.json", JSON.stringify(data));
}