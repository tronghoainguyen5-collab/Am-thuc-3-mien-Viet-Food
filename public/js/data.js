const defaultData = {
    "users": [
        { "id": 1, "fullname": "Đào Nguyễn Quốc Việt", "email": "daonguyenquocviet9190@gmail.com", "role": "Admin", "avatar": "public/image/viet.jpg" },
        { "id": 2, "fullname": "Ngô Trường Giang", "email": "ngo779998@gmail.com", "role": "Admin", "avatar": "public/image/giang.jpg" },
    ],
    "categories": [
        { "id": 1, "name": "Miền Bắc" },
        { "id": 2, "name": "Miền Trung" },
        { "id": 3, "name": "Miền Nam" }
    ],
    "recipes": [
    { "id": 1, "name": "Phở Bò Hà Nội", "image": "public/image/image1/id1.png", "categoryId": 1, "views": 8 },
    { "id": 2, "name": "Bún Chả Hà Nội", "image": "public/image/image1/id2.png", "categoryId": 1, "views": 5 },
    { "id": 3, "name": "Bún Đậu Mắm Tôm", "image": "public/image/image1/id3.png", "categoryId": 1, "views": 7 },
    { "id": 4, "name": "Bánh Cuốn Thanh Trì", "image": "public/image/image1/id4.png", "categoryId": 1, "views": 2 },
    { "id": 5, "name": "Chả Cá Lã Vọng", "image": "public/image/image1/id5.png", "categoryId": 1, "views": 3 },
    { "id": 6, "name": "Bún Thang Hà Nội", "image": "public/image/image1/id6.png", "categoryId": 1, "views": 1 },
    { "id": 7, "name": "Bún Riêu Cua", "image": "public/image/image1/id7.png", "categoryId": 1, "views": 2 },
    { "id": 8, "name": "Bún Mọc Dọc Mùng", "image": "public/image/image1/id8.png", "categoryId": 1, "views": 1 },
    { "id": 9, "name": "Bún Cá Rô Đồng", "image": "public/image/image1/id9.png", "categoryId": 1, "views": 1 },
    { "id": 10, "name": "Cá Kho Làng Vũ Đại", "image": "public/image/image1/id10.png", "categoryId": 1, "views": 1 },
    { "id": 11, "name": "Chả Mực Hạ Long", "image": "public/image/image1/id11.png", "categoryId": 1, "views": 1 },
    { "id": 12, "name": "Xôi Xéo Hà Nội", "image": "public/image/image1/id12.png", "categoryId": 1, "views": 1 },
    { "id": 13, "name": "Phở Gà Hà Nội", "image": "public/image/image1/id13.png", "categoryId": 1, "views": 0 },
    { "id": 14, "name": "Bánh Đa Cua Hải Phòng", "image": "public/image/image1/id14.png", "categoryId": 1, "views": 1 },
    { "id": 15, "name": "Thắng Cố Hà Giang", "image": "public/image/image1/id15.png", "categoryId": 1, "views": 0 },
    { "id": 16, "name": "Thịt Trâu Gác Bếp", "image": "public/image/image1/id16.png", "categoryId": 1, "views": 1 },
    { "id": 17, "name": "Bún Ốc Hà Nội", "image": "public/image/image1/id17.png", "categoryId": 1, "views": 0 },
    { "id": 18, "name": "Nem Chua Rán", "image": "public/image/image1/id18.png", "categoryId": 1, "views": 0 },

    // --- MIỀN TRUNG (categoryId: 2) - Tổng ~30 views ---
    { "id": 19, "name": "Bún Bò Huế", "image": "public/image/image1/id19.png", "categoryId": 2, "views": 10 },
    { "id": 20, "name": "Mì Quảng Đà Nẵng", "image": "public/image/image1/id20.png", "categoryId": 2, "views": 6 },
    { "id": 21, "name": "Cao Lầu Hội An", "image": "public/image/image1/id21.png", "categoryId": 2, "views": 4 },
    { "id": 22, "name": "Cơm Gà Tam Kỳ", "image": "public/image/image1/id22.png", "categoryId": 2, "views": 2 },
    { "id": 23, "name": "Bánh Xèo Miền Trung", "image": "public/image/image1/id23.png", "categoryId": 2, "views": 1 },
    { "id": 24, "name": "Bánh Bèo Chén", "image": "public/image/image1/id24.png", "categoryId": 2, "views": 1 },
    { "id": 25, "name": "Chả Ram Tôm Đất", "image": "public/image/image1/id25.png", "categoryId": 2, "views": 3 },
    { "id": 26, "name": "Bánh Ram Ít Huế", "image": "public/image/image1/id26.png", "categoryId": 2, "views": 0 },
    { "id": 27, "name": "Bánh Ướt Thịt Nướng", "image": "public/image/image1/id27.png", "categoryId": 2, "views": 1 },
    { "id": 28, "name": "Cơm Hến Huế", "image": "public/image/image1/id28.png", "categoryId": 2, "views": 1 },
    { "id": 29, "name": "Bánh Khoái Huế", "image": "public/image/image1/id29.png", "categoryId": 2, "views": 0 },
    { "id": 30, "name": "Bánh Bột Lọc", "image": "public/image/image1/id30.png", "categoryId": 2, "views": 1 },
    { "id": 31, "name": "Bánh Nậm", "image": "public/image/image1/id31.png", "categoryId": 2, "views": 0 },
    { "id": 32, "name": "Bánh Ít Lá Gai", "image": "public/image/image1/id32.png", "categoryId": 2, "views": 0 },
    { "id": 33, "name": "Gỏi Cá Nam Ô", "image": "public/image/image1/id33.png", "categoryId": 2, "views": 0 },
    { "id": 34, "name": "Mì Quảng Gà", "image": "public/image/image1/id34.png", "categoryId": 2, "views": 0 },
    { "id": 35, "name": "Cháo Lươn Nghệ An", "image": "public/image/image1/id35.png", "categoryId": 2, "views": 0 },
    { "id": 36, "name": "Bánh Căn Miền Trung", "image": "public/image/image1/id36.png", "categoryId": 2, "views": 0 },

    // --- MIỀN NAM (categoryId: 3) - Tổng ~35 views ---
    { "id": 37, "name": "Cơm Tấm Sài Gòn", "image": "public/image/image1/id37.png", "categoryId": 3, "views": 12 },
    { "id": 38, "name": "Hủ Tiếu Nam Vang", "image": "public/image/image1/id38.png", "categoryId": 3, "views": 5 },
    { "id": 39, "name": "Lẩu Mắm Miền Tây", "image": "public/image/image1/id39.png", "categoryId": 3, "views": 4 },
    { "id": 40, "name": "Bánh Mì Sài Gòn", "image": "public/image/image1/id40.png", "categoryId": 3, "views": 8 },
    { "id": 41, "name": "Gỏi Cuốn Tôm Thịt", "image": "public/image/image1/id41.png", "categoryId": 3, "views": 3 },
    { "id": 42, "name": "Bánh Canh Cua", "image": "public/image/image1/id42.png", "categoryId": 3, "views": 2 },
    { "id": 43, "name": "Bún Mắm Miền Tây", "image": "public/image/image1/id43.png", "categoryId": 3, "views": 1 },
    { "id": 44, "name": "Cá Kho Tộ", "image": "public/image/image1/id44.png", "categoryId": 3, "views": 0 },
    { "id": 45, "name": "Bò Kho Sài Gòn", "image": "public/image/image1/id45.png", "categoryId": 3, "views": 0 },
    { "id": 46, "name": "Canh Chua Cá Lóc", "image": "public/image/image1/id46.png", "categoryId": 3, "views": 0 },
    { "id": 47, "name": "Chuối Nếp Nướng", "image": "public/image/image1/id47.png", "categoryId": 3, "views": 0 },
    { "id": 48, "name": "Gà Kho Sả Nghệ", "image": "public/image/image1/id48.png", "categoryId": 3, "views": 0 },
    { "id": 49, "name": "Phở Khô Gia Lai", "image": "public/image/image1/id49.png", "categoryId": 3, "views": 0 },
    { "id": 50, "name": "Bánh Tét Miền Tây", "image": "public/image/image1/id50.png", "categoryId": 3, "views": 0 }
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