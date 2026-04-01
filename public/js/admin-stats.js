document.addEventListener("DOMContentLoaded", () => {
    // Luôn lấy dữ liệu mới nhất từ LocalStorage qua hàm getDB đã viết ở data.js
    const db = getDB(); 
    
    // 1. Đồng bộ thông tin Admin lên Header
    const admin = db.users.find(u => u.role === "Admin");
    const nameEl = document.getElementById("adminName");
    const avatarEl = document.getElementById("adminAvatar");
    if (admin) {
        if (nameEl) nameEl.innerText = admin.fullname;
        if (avatarEl) avatarEl.src = admin.avatar;
    }

    // 2. Cập nhật các con số thống kê thực tế
    const totalRecipes = db.recipes.length;
    const totalUsers = db.users.length;
    
    // Tính tổng lượt xem: cộng dồn tất cả thuộc tính 'views' của từng món ăn
    const totalViews = db.recipes.reduce((sum, item) => {
        const viewCount = parseInt(item.views) || 0;
        return sum + viewCount;
    }, 0);

    // Đẩy dữ liệu ra giao diện HTML
    if(document.getElementById("totalRecipes")) 
        document.getElementById("totalRecipes").innerText = totalRecipes;
    
    if(document.getElementById("totalUsers")) 
        document.getElementById("totalUsers").innerText = totalUsers;
    
    if(document.getElementById("totalViews")) 
        document.getElementById("totalViews").innerText = totalViews.toLocaleString('vi-VN');

    // 3. Vẽ biểu đồ phân bố vùng miền (Dữ liệu thật)
    const regionLabels = db.categories.map(cat => cat.name);
    const regionCounts = db.categories.map(cat => {
        return db.recipes.filter(r => r.categoryId == cat.id).length;
    });

    const ctxRegion = document.getElementById('regionChart');
    if (ctxRegion) {
        new Chart(ctxRegion, {
            type: 'doughnut',
            data: {
                labels: regionLabels,
                datasets: [{
                    data: regionCounts,
                    backgroundColor: ['#4facfe', '#00f2fe', '#f87171'],
                    hoverOffset: 4,
                    borderWidth: 0
                }]
            },
            options: {
                plugins: {
                    legend: { position: 'bottom', labels: { color: '#94a3b8', font: { size: 12 } } }
                }
            }
        });
    }

    // 4. Vẽ biểu đồ Top 5 món ăn (Dựa trên lượt xem thật)
    // Sắp xếp giảm dần theo views và lấy 5 món đầu tiên
    const top5Recipes = [...db.recipes]
        .sort((a, b) => (b.views || 0) - (a.views || 0))
        .slice(0, 5);

    const ctxTop = document.getElementById('topRecipesChart');
    if (ctxTop) {
        new Chart(ctxTop, {
            type: 'bar',
            data: {
                labels: top5Recipes.map(r => r.name),
                datasets: [{
                    label: 'Lượt xem',
                    data: top5Recipes.map(r => r.views || 0),
                    backgroundColor: 'rgba(79, 172, 254, 0.8)',
                    borderRadius: 5
                }]
            },
            options: {
                scales: {
                    y: { 
                        beginAtZero: true, 
                        grid: { color: 'rgba(255,255,255,0.05)' },
                        ticks: { color: '#94a3b8' }
                    },
                    x: { 
                        grid: { display: false },
                        ticks: { color: '#94a3b8' }
                    }
                },
                plugins: { legend: { display: false } }
            }
        });
    }
});