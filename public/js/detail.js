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
            // const saveBtn = document.getElementById("btn-save");

            // if (saveBtn) {
            //     let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

            //     if (favorites.includes(food.id)) {
            //         saveBtn.innerHTML = "Đã lưu ❤️";
            //     }

            //     saveBtn.onclick = () => {
            //         let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

            //         if (!favorites.includes(food.id)) {
            //             favorites.push(food.id);
            //             localStorage.setItem("favorites", JSON.stringify(favorites));

            //             saveBtn.innerHTML = "Đã lưu ❤️";
            //         }
            //     };
            // }
            setupSaveButtonDetail(food);

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
    try {
        return JSON.parse(localStorage.getItem("currentUser"));
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
// ===== LOGIN MODAL FIX =====
// ===== MODAL LOGIN =====
window.showLoginModal = function () {
    const modal = document.getElementById("login-required-modal");
    if (modal) modal.classList.add("show");
};

window.closeLoginModal = function () {
    const modal = document.getElementById("login-required-modal");
    if (modal) modal.classList.remove("show");
};

// click ra ngoài để đóng
document.addEventListener("click", (e) => {
    const modal = document.getElementById("login-required-modal");
    if (!modal) return;

    if (e.target === modal) {
        closeLoginModal();
    }
});

// ESC để đóng
document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
        closeLoginModal();
    }
});

function flyReaction(el, emoji) {
    const rect = el.getBoundingClientRect();

    const fly = document.createElement("div");
    fly.innerText = emoji;
    fly.style.position = "fixed";
    fly.style.left = rect.left + "px";
    fly.style.top = rect.top + "px";
    fly.style.fontSize = "22px";
    fly.style.zIndex = 9999;
    fly.style.pointerEvents = "none";

    document.body.appendChild(fly);

    fly.animate([
        { transform: "translateY(0) scale(1)", opacity: 1 },
        { transform: "translateY(-60px) scale(1.6)", opacity: 0 }
    ], {
        duration: 600,
        easing: "ease-out"
    });

    setTimeout(() => fly.remove(), 600);
}
// ===== REVIEW SYSTEM =====
function initReviewSystem_VS_PRO() {

    const recipeId = new URLSearchParams(window.location.search).get("id");

    const input = document.getElementById("comment-input");
    const btn = document.getElementById("btn-comment");
    const list = document.getElementById("comment-list");

    const stars = document.querySelectorAll("#star-rating i");
    const ratingText = document.getElementById("rating-text");
    const avgRating = document.getElementById("avg-rating");

    let currentRate = 0;
    let showAll = false;

    // ===== DATA =====
    function getData() {
        return JSON.parse(localStorage.getItem("cmt_" + recipeId)) || [];
    }

    function saveData(data) {
        localStorage.setItem("cmt_" + recipeId, JSON.stringify(data));
    }

    // ===== REALTIME =====
    window.addEventListener("storage", (e) => {
        if (e.key === "cmt_" + recipeId) render();
    });

    // ===== ⭐ STAR =====
    stars.forEach((star, index) => {

        star.onmousemove = () => {
            stars.forEach(s => s.classList.remove("hover"));
            for (let i = 0; i <= index; i++) stars[i].classList.add("hover");
        };

        star.onmouseleave = () => {
            stars.forEach(s => s.classList.remove("hover"));
        };

        star.onclick = () => {
            if (!isLoggedIn()) return showLoginModal();

            currentRate = index + 1;

            stars.forEach(s => s.classList.remove("active"));
            for (let i = 0; i < currentRate; i++) stars[i].classList.add("active");

            ratingText.innerText = currentRate + " / 5 ⭐";
        };
    });

    // ===== RATING SUMMARY =====
    function calcRating() {
        const data = getData();
        if (!data.length) return avgRating.innerHTML = "";

        const total = data.length;
        const avg = (data.reduce((s, c) => s + (c.rate || 0), 0) / total).toFixed(1);

        const count = [0,0,0,0,0];
        data.forEach(c => count[c.rate - 1]++);

        avgRating.innerHTML = `
            <div class="rating-summary">
                <div class="avg-score">${avg} ⭐</div>
                ${[5,4,3,2,1].map(i => {
                    const percent = total ? (count[i-1]/total)*100 : 0;
                    return `
                    <div class="bar-row">
                        <span>${i}</span>
                        <div class="bar">
                            <div class="fill" style="width:${percent}%"></div>
                        </div>
                    </div>
                    `;
                }).join("")}
            </div>
        `;
    }

    // ===== RENDER =====
    function render() {

        const data = getData();
        const user = getCurrentUser();
        const visible = showAll ? data : data.slice(0, 3);

        list.innerHTML = visible.map((c, i) => {

            const replies = c.replies || [];
            const showReplies = c.showAllReply ? replies : replies.slice(0, 2);

            const myReact = user ? c.reacted?.[user.username] : null;
            const reactCount = Object.keys(c.reacted || {}).length;

            return `
            <div class="comment-item">

                <img src="${c.avatar || './public/image/avatar.jpg'}" class="comment-avatar">

                <div class="comment-content">

                    <div class="comment-top">
                        <strong>${c.username}</strong>
                        <span>${timeAgo(c.time)}</span>
                    </div>

                    <p id="text-${i}">${c.text}</p>

                    <div class="comment-actions">

                        <div class="react-wrapper"
                        onmouseenter="showReact(${i})"
                        onmouseleave="hideReact(${i})"
                        onclick="toggleLike(${i})">

                        <span class="react-btn ${myReact ? 'active' : ''}">
                        ${myReact ? myReact : "👍"} ${reactCount > 0 ? reactCount : ""}
                    </span>

                        <div class="reaction-dropdown"
                            id="react-${i}"
                            onmouseenter="showReact(${i})"
                            onmouseleave="hideReact(${i})">

                            ${["👍","❤️","😆","😮","😢"].map(r => `
                                <span onclick="reactCmt(${i}, '${r}')">${r}</span>
                            `).join("")}

                        </div>
                    </div>

                        <span onclick="toggleReply(${i})">💬</span>

                        ${user && user.username === c.username ? `
                            <span onclick="editCmt(${i})">✏️</span>
                            <span onclick="deleteCmt(${i})">🗑</span>
                        ` : ""}
                    </div>

                    <div class="reply-box" id="reply-${i}">
                        <input placeholder="Viết phản hồi..." onkeypress="addReply(event, ${i})">
                    </div>

                    <div class="reply-list">
                        ${showReplies.map(r => `
                            <div class="reply-item"><b>${r.username}</b>: ${r.text}</div>
                        `).join("")}

                        ${!c.showAllReply && replies.length > 2 ? `
                            <div class="view-more" onclick="showMoreReply(${i})">
                                Xem thêm ${replies.length - 2}
                            </div>
                        ` : ""}

                        ${c.showAllReply ? `
                            <div class="view-more" onclick="hideReply(${i})">Thu gọn</div>
                        ` : ""}
                    </div>

                </div>
            </div>
            `;
        }).join("");

        if (data.length > 3 && !showAll) {
            list.innerHTML += `<div class="view-more" onclick="showAllCmt()">Xem thêm bình luận</div>`;
        }

        if (showAll) {
            list.innerHTML += `<div class="view-more" onclick="hideAllCmt()">Thu gọn</div>`;
        }

        calcRating();
    }

    // ===== ADD COMMENT =====
    function addComment() {
    if (!isLoggedIn()) return showLoginModal();

    const text = input.value.trim();
    if (!text) return;

    const user = getCurrentUser();
    const data = getData();

    data.unshift({
        username: user.username,
        avatar: user.avatar,
        text,
        rate: currentRate || 5,
        reacted: {},
        time: Date.now(),
        replies: []
    });

    saveData(data);
    input.value = "";
    currentRate = 0;

    render();

    // highlight comment mới
    setTimeout(() => {
        const first = document.querySelector(".comment-item");
        if (first) first.classList.add("highlight");
    }, 50);
}

    btn.onclick = addComment;

    
    // ===== REACTION =====
  // ===== REACTION =====
window.reactCmt = (i, type) => {
    const user = getCurrentUser();
    if (!user) return showLoginModal();

    const data = getData();
    if (!data[i].reacted) data[i].reacted = {};

    const current = data[i].reacted[user.username];

    const btn = document.querySelectorAll(".react-btn")[i];

    // ❌ UNLIKE
    if (current === type) {
        delete data[i].reacted[user.username];
    } 
    // 🔄 CHANGE
    else {
        data[i].reacted[user.username] = type;

        // 🎉 bay emoji
        if (btn) flyReaction(btn, type);
    }

    saveData(data);
    render();
};

   let reactTimeout = {};

window.showReact = (i) => {
    clearTimeout(reactTimeout[i]);
    reactTimeout[i] = setTimeout(() => {
        document.getElementById("react-" + i)?.classList.add("show");
    }, 200);
};

window.hideReact = (i) => {
    clearTimeout(reactTimeout[i]);
    reactTimeout[i] = setTimeout(() => {
        const el = document.getElementById("react-" + i);
        if (el && !el.matches(":hover")) {
            el.classList.remove("show");
        }
    }, 250);
};

    // ===== EDIT =====
    window.editCmt = (i) => {
    const el = document.getElementById("text-" + i);
    el.contentEditable = true;
    el.classList.add("editing");
    el.focus();

    const save = () => {
        const data = getData();
        data[i].text = el.innerText.trim();
        saveData(data);

        el.contentEditable = false;
        el.classList.remove("editing");
    };

    el.onblur = save;

    el.onkeypress = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            el.blur();
        }
    };
};

    // ===== DELETE =====
    window.deleteCmt = (i) => {
    const user = getCurrentUser();
    const data = getData();

    if (!user || user.username !== data[i].username) return alert("Không phải của bạn");
    if (!confirm("Xóa?")) return;

    const item = document.querySelectorAll(".comment-item")[i];
    if (item) {
        item.classList.add("fade-out");

        setTimeout(() => {
            data.splice(i, 1);
            saveData(data);
            render();
        }, 300);
    }
};

    // ===== REPLY =====
    window.toggleReply = (i) => {
    const box = document.getElementById("reply-" + i);

    if (box.style.display === "block") {
        box.style.height = box.scrollHeight + "px";

        setTimeout(() => {
            box.style.height = "0px";
        }, 10);

        setTimeout(() => {
            box.style.display = "none";
        }, 300);

    } else {
        box.style.display = "block";
        box.style.height = "0px";

        setTimeout(() => {
            box.style.height = box.scrollHeight + "px";
        }, 10);
    }
};

    window.addReply = (e, i) => {
        if (e.key !== "Enter") return;

        const user = getCurrentUser();
        if (!user) return showLoginModal();

        const val = e.target.value.trim();
        if (!val) return;

        const data = getData();
        data[i].replies.push({ username: user.username, text: val });

        saveData(data);
        render();
    };

    // ===== LIMIT =====
    window.showAllCmt = () => { showAll = true; render(); };
    window.hideAllCmt = () => { showAll = false; render(); };

    window.showMoreReply = (i) => {
        const data = getData();
        data[i].showAllReply = true;
        saveData(data);
        render();
    };

    window.hideReply = (i) => {
        const data = getData();
        data[i].showAllReply = false;
        saveData(data);
        render();
    };

    render();
}

document.addEventListener("DOMContentLoaded", initReviewSystem_VS_PRO);

function setupSaveButtonDetail(food) {
    const btnSave = document.getElementById("btn-save");
    if (!btnSave) return;

    // check đã lưu chưa
    if (isSaved(food.id)) {
        btnSave.classList.add("active");
        btnSave.innerHTML = "✅ Đã lưu";
    }

    btnSave.onclick = (e) => {
    e.preventDefault();

    const recipe = {
        id: food.id,
        name: food.name,
        image: food.image
    };

    // 👉 toggle lưu
    addToFavorite(recipe, btnSave);

    // 👉 UPDATE UI NGAY (KHÔNG CẦN RELOAD)
    setTimeout(() => {
        if (isSaved(food.id)) {
            btnSave.classList.add("active");
            btnSave.innerHTML = "✅ Đã lưu";
        } else {
            btnSave.classList.remove("active");
            btnSave.innerHTML = `<i class="fa-solid fa-bookmark"></i> Lưu công thức`;
        }
    }, 50);
};
}