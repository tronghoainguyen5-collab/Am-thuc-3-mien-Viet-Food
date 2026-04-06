/**
 * VietStove Dashboard Controller
 * Modernized with ES6+, Modular Pattern & Premium Chart Theme
 */

document.addEventListener("DOMContentLoaded", () => {
    const db = getDB();
    
    // Khởi tạo các module
    DashboardUI.initAdminHeader(db.users);
    DashboardUI.initCounterStats(db.recipes, db.users);
    DashboardCharts.renderRegionChart(db.categories, db.recipes);
    DashboardCharts.renderTopRecipesChart(db.recipes);
});

// --- Module xử lý Giao diện ---
const DashboardUI = {
    initAdminHeader(users) {
        const admin = users.find(u => u.role === "Admin");
        if (!admin) return;

        const elements = {
            name: document.getElementById("adminName"),
            avatar: document.getElementById("adminAvatar")
        };

        if (elements.name) elements.name.textContent = admin.fullname;
        if (elements.avatar) {
            elements.avatar.src = admin.avatar;
            elements.avatar.style.borderColor = "var(--primary)"; // Sync với CSS mới
        }
    },

    initCounterStats(recipes, users) {
        const stats = {
            totalRecipes: recipes.length,
            totalUsers: users.length,
            totalViews: recipes.reduce((sum, r) => sum + (parseInt(r.views) || 0), 0)
        };

        // Render với hiệu ứng số nhảy (optional) hoặc định dạng chuẩn
        this._updateText("totalRecipes", stats.totalRecipes);
        this._updateText("totalUsers", stats.totalUsers);
        this._updateText("totalViews", stats.totalViews.toLocaleString('vi-VN'));
    },

    _updateText(id, value) {
        const el = document.getElementById(id);
        if (el) el.textContent = value;
    }
};

// --- Module xử lý Biểu đồ (Modern Chart.js Config) ---
const DashboardCharts = {
    // Cấu hình màu sắc Theme Dark Orange
    theme: {
        primary: '#ff6d1b',
        secondary: '#ff9d42',
        accent: '#fbbf24',
        text: '#a1a1aa',
        grid: 'rgba(255, 255, 255, 0.05)',
        colors: ['#ff6d1b', '#ff9d42', '#fbbf24', '#f59e0b', '#d97706']
    },

    renderRegionChart(categories, recipes) {
        const ctx = document.getElementById('regionChart');
        if (!ctx) return;

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
                    borderColor: '#141416', // Trùng màu nền card để tạo khoảng cách
                    hoverOffset: 15
                }]
            },
            options: {
                cutout: '75%', // Làm vòng tròn mỏng hơn cho sang trọng
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: { color: this.theme.text, usePointStyle: true, padding: 20 }
                    }
                }
            }
        });
    },

    renderTopRecipesChart(recipes) {
        const ctx = document.getElementById('topRecipesChart');
        if (!ctx) return;

        const top5 = [...recipes]
            .sort((a, b) => (b.views || 0) - (a.views || 0))
            .slice(0, 5);

        // Tạo Gradient cho cột
        const gradient = ctx.getContext('2d').createLinearGradient(0, 0, 0, 400);
        gradient.addColorStop(0, '#ff6d1b');
        gradient.addColorStop(1, 'rgba(255, 109, 27, 0.1)');

        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: top5.map(r => r.name.length > 15 ? r.name.substring(0, 15) + '...' : r.name),
                datasets: [{
                    label: 'Lượt xem',
                    data: top5.map(r => r.views || 0),
                    backgroundColor: gradient,
                    borderRadius: 8,
                    barThickness: 25
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: { color: this.theme.grid },
                        ticks: { color: this.theme.text }
                    },
                    x: {
                        grid: { display: false },
                        ticks: { color: this.theme.text }
                    }
                },
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: '#1c1c1e',
                        titleColor: '#fff',
                        bodyColor: '#ff6d1b',
                        padding: 12,
                        cornerRadius: 10,
                        displayColors: false
                    }
                }
            }
        });
    }
};