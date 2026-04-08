document.addEventListener("DOMContentLoaded", () => {

    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    if (!id) return;

    // =========================
    // 🔥 FETCH LOCAL DB.JSON
    // =========================
    fetch("./data/db.json")
        .then(res => res.json())
        .then(data => {

            // hỗ trợ nhiều kiểu db.json
            const recipes = data.recipes || data;

            const food = recipes.find(r => r.id == id);

            const detailInfo = document.querySelector(".detail-info");

            if (!food) {
                if (detailInfo) detailInfo.innerHTML = "<h2>Không tìm thấy món ăn</h2>";
                return;
            }

            // ===== RENDER DATA =====
            const img = document.getElementById("main-img");
            const title = document.getElementById("title");
            const desc = document.getElementById("description");

            if (img) img.src = food.image;
            if (title) title.innerText = food.name;
            if (desc) desc.innerText = food.description;

            const meta = document.querySelector(".detail-meta");
            if (meta) {
                meta.innerHTML = `
                    <span>⏱ ${food.time}</span>
                    <span>🍽 ${food.serving || "2-4 người"}</span>
                `;
            }

            const ing = document.getElementById("ingredients");
            if (ing) {
                ing.innerHTML = (food.ingredients || []).map(i => `<li>${i}</li>`).join("");
            }

            const steps = document.getElementById("steps");
            if (steps) {
                steps.innerHTML = (food.steps || []).map(s => `<li>${s}</li>`).join("");
            }

            // ===== SAVE =====
            const saveBtn = document.getElementById("btn-save");

            if (saveBtn) {
                let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

                if (favorites.includes(food.id)) {
                    saveBtn.innerHTML = "Đã lưu ❤️";
                }

                saveBtn.onclick = () => {
                    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

                    if (!favorites.includes(food.id)) {
                        favorites.push(food.id);
                        localStorage.setItem("favorites", JSON.stringify(favorites));

                        saveBtn.innerHTML = "Đã lưu ❤️";
                    }
                };
            }

            // ===== COOK =====
            const cookBtn = document.getElementById("btn-cook");
            if (cookBtn) {
                cookBtn.onclick = () => {
                    window.location.href = `nau-an.html?id=${food.id}`;
                };
            }

        })
        .catch(err => {
            console.error("❌ Lỗi fetch detail:", err);
        });

});


// =======================
// 👤 USER
// =======================

function getCurrentUser() {
    const username = localStorage.getItem("currentUser");

    if (!username || username === "null" || username === "undefined") {
        return null;
    }

    try {
        return JSON.parse(localStorage.getItem("user_" + username));
    } catch {
        return null;
    }
}

function isLoggedIn() {
    return !!getCurrentUser();
}


// =======================
// ⏱ TIME FORMAT
// =======================

function timeAgo(ts) {
    const diff = Math.floor((Date.now() - ts) / 1000);

    if (diff < 60) return "Vừa xong";
    if (diff < 3600) return Math.floor(diff / 60) + " phút trước";
    if (diff < 86400) return Math.floor(diff / 3600) + " giờ trước";
    if (diff < 604800) return Math.floor(diff / 86400) + " ngày trước";

    return new Date(ts).toLocaleDateString("vi-VN");
}


// =======================
// 💬 REVIEW SYSTEM
// =======================

function initReviewSystem_VS_PRO() {

    const recipeId = new URLSearchParams(window.location.search).get("id");

    const input = document.getElementById("comment-input");
    const btn = document.getElementById("btn-comment");
    const list = document.getElementById("comment-list");

    const stars = document.querySelectorAll("#star-rating i");
    const ratingText = document.getElementById("rating-text");

    let currentRate = 5;

    function showLoginModal() {
        document.getElementById("login-required-modal").classList.add("show");
    }

    window.closeLoginModal = () => {
        document.getElementById("login-required-modal").classList.remove("show");
    };

    function getData() {
        return JSON.parse(localStorage.getItem("cmt_" + recipeId)) || [];
    }

    function saveData(data) {
        localStorage.setItem("cmt_" + recipeId, JSON.stringify(data));
    }

    // ===== STAR =====
    stars.forEach((star, index) => {
        star.onclick = () => {
            if (!isLoggedIn()) return showLoginModal();

            currentRate = index + 1;

            stars.forEach(s => s.classList.remove("active"));
            for (let i = 0; i < currentRate; i++) {
                stars[i].classList.add("active");
            }

            ratingText.innerText = currentRate + " / 5 ⭐";
        };
    });

    // ===== RENDER =====
    function render() {
        const data = getData();

        list.innerHTML = data.map((c, i) => `
            <div class="comment-item">

                <img src="${c.avatar || './public/image/avatar.png'}" class="comment-avatar">

                <div class="comment-content">
                    <div class="comment-top">
                        <div>
                            <strong>${c.username}</strong>
                            <div class="time">${timeAgo(c.time)}</div>
                        </div>
                        <span>${c.rate}⭐</span>
                    </div>

                    <p>${c.text}</p>

                    <div class="comment-actions">
                        <span onclick="likeCmt(${i})">👍 ${c.likes}</span>
                        <span onclick="toggleReply(${i})">💬 Trả lời</span>
                        <span onclick="deleteCmt(${i})">🗑</span>
                    </div>

                    <div class="reply-box" id="reply-${i}">
                        <input placeholder="Nhập reply..." onkeypress="addReply(event, ${i})">
                    </div>

                    <div class="reply-list">
                        ${(c.replies || []).map(r => `
                            <div class="reply-item">
                                ↳ <b>${r.username}</b>: ${r.text}
                            </div>
                        `).join("")}
                    </div>

                </div>
            </div>
        `).join("");
    }

    // ===== ADD COMMENT =====
    btn.onclick = () => {
        if (!isLoggedIn()) return showLoginModal();

        const text = input.value.trim();
        if (!text) return;

        const user = getCurrentUser();

        const data = getData();

        data.unshift({
            username: user.username,
            avatar: user.avatar,
            text,
            rate: currentRate,
            likes: 0,
            time: Date.now(),
            replies: []
        });

        saveData(data);
        input.value = "";
        render();
    };

    // ===== GLOBAL =====
    window.likeCmt = (i) => {
        const data = getData();
        data[i].likes++;
        saveData(data);
        render();
    };

    window.deleteCmt = (i) => {
        if (!confirm("Xóa bình luận?")) return;
        const data = getData();
        data.splice(i, 1);
        saveData(data);
        render();
    };

    window.toggleReply = (i) => {
        if (!isLoggedIn()) return showLoginModal();

        const box = document.getElementById("reply-" + i);
        box.style.display = box.style.display === "block" ? "none" : "block";
    };

    window.addReply = (e, i) => {
        if (!isLoggedIn()) return showLoginModal();
        if (e.key !== "Enter") return;

        const val = e.target.value.trim();
        if (!val) return;

        const user = getCurrentUser();
        const data = getData();

        data[i].replies.push({
            username: user.username,
            text: val
        });

        saveData(data);
        render();
    };

    render();
}

document.addEventListener("DOMContentLoaded", initReviewSystem_VS_PRO);