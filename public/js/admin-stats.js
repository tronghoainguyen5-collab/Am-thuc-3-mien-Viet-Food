/**
 * VietStove Dashboard Controller
 * Tối ưu: Tự động cập nhật theo dữ liệu mới nhất từ LocalStorage
 */

document.addEventListener("DOMContentLoaded", () => {
    // Luôn lấy dữ liệu mới nhất khi vào trang
    const db = getDB(); 
    
    if (db) {
        DashboardUI.initAdminHeader(db.users || []);
        DashboardUI.initCounterStats(db.recipes || [], db.users || []);
        DashboardCharts.renderRegionChart(db.categories || [], db.recipes || []);
        DashboardCharts.renderTopRecipesChart(db.recipes || []);
    }
});

const DashboardUI = {
    initAdminHeader(users) {
        // Tìm admin đầu tiên hoặc lấy từ session/localStorage nếu có hệ thống login
        const admin = users.find(u => u.role === "Admin") || users[0];
        if (!admin) return;

        const elements = {
            name: document.getElementById("adminName"),
            avatar: document.getElementById("adminAvatar")
        };

        if (elements.name) elements.name.textContent = admin.fullname;
        if (elements.avatar) {
            elements.avatar.src = admin.avatar || 'https://ui-avatars.com/api/?name=Admin';
            elements.avatar.style.borderColor = "#ff6d1b";
        }
    },

    initCounterStats(recipes, users) {
        const stats = {
            totalRecipes: recipes.length,
            totalUsers: users.length,
            totalViews: recipes.reduce((sum, r) => sum + (parseInt(r.views) || 0), 0)
        };

        this._updateText("totalRecipes", stats.totalRecipes);
        this._updateText("totalUsers", stats.totalUsers);
        this._updateText("totalViews", stats.totalViews.toLocaleString('vi-VN'));
    },

    _updateText(id, value) {
        const el = document.getElementById(id);
        if (el) el.textContent = value;
    }
};

const DashboardCharts = {
    theme: {
        primary: '#ff6d1b',
        colors: ['#ff6d1b', '#ff9d42', '#fbbf24', '#f59e0b', '#d97706'],
        text: '#a1a1aa'
    },

    renderRegionChart(categories, recipes) {
        const ctx = document.getElementById('regionChart');
        if (!ctx || categories.length === 0) return;

        const data = {
            labels: categories.map(cat => cat.name),
            counts: categories.map(cat => recipes.filter(r => r.categoryId == cat.id).length)
        };

        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: data.labels,
                datasets: [{
                    data: data.counts,
                    backgroundColor: this.theme.colors,
                    borderWidth: 2,
                    borderColor: '#141416'
                }]
            },
            options: {
                cutout: '75%',
                plugins: {
                    legend: { position: 'bottom', labels: { color: this.theme.text, usePointStyle: true } }
                }
            }
        });
    },

    renderTopRecipesChart(recipes) {
        const ctx = document.getElementById('topRecipesChart');
        if (!ctx || recipes.length === 0) return;

        const top5 = [...recipes]
            .sort((a, b) => (b.views || 0) - (a.views || 0))
            .slice(0, 5);

        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: top5.map(r => r.name.substring(0, 15)),
                datasets: [{
                    label: 'Lượt xem',
                    data: top5.map(r => r.views || 0),
                    backgroundColor: '#ff6d1b',
                    borderRadius: 8
                }]
            },
            options: {
                scales: {
                    y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: this.theme.text } },
                    x: { grid: { display: false }, ticks: { color: this.theme.text } }
                },
                plugins: { legend: { display: false } }
            }
        });
    }
};