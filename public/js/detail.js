// document.addEventListener("DOMContentLoaded", () => {

//     // 🔍 LẤY ID TỪ URL
//     const params = new URLSearchParams(window.location.search);
//     const id = params.get("id");

//     // 📦 FETCH DATA
//     fetch("./data/db.json")
//         .then(res => res.json())
//         .then(data => {

//             const recipes = data.recipes;

//             // ⚠️ IMPORTANT: id từ URL là string → convert
//             const food = recipes.find(r => r.id == id);

//             if (!food) {
//                 document.querySelector(".detail-info").innerHTML = "<h2>Không tìm thấy món ăn</h2>";
//                 return;
//             }

//             // 🎯 GÁN DATA
//             document.getElementById("main-img").src = food.image;
//             document.getElementById("title").innerText = food.name;
//             document.getElementById("description").innerText = food.description;

//             // META
//             document.querySelector(".detail-meta").innerHTML = `
//                 <span>⏱ ${food.time}</span>
//                 <span>🍽 ${food.serving || "2-4 người"}</span>
//             `;

//             // 🥗 NGUYÊN LIỆU
//             const ing = document.getElementById("ingredients");
//             ing.innerHTML = "";

//             if (food.ingredients) {
//                 food.ingredients.forEach(i => {
//                     const li = document.createElement("li");
//                     li.innerText = i;
//                     ing.appendChild(li);
//                 });
//             }

//             // 👨‍🍳 CÁC BƯỚC
//             const steps = document.getElementById("steps");
//             steps.innerHTML = "";

//             if (food.steps) {
//                 food.steps.forEach(s => {
//                     const li = document.createElement("li");
//                     li.innerText = s;
//                     steps.appendChild(li);
//                 });
//             }

//             // ❤️ LƯU MÓN
//             const saveBtn = document.getElementById("saveBtn");
//             saveBtn.addEventListener("click", () => {
//                 let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

//                 if (!favorites.includes(food.id)) {
//                     favorites.push(food.id);
//                     localStorage.setItem("favorites", JSON.stringify(favorites));
//                     alert("Đã lưu món!");
//                 } else {
//                     alert("Món đã lưu rồi!");
//                 }
//             });

//         })
//         .catch(err => {
//             console.error("Lỗi load data:", err);
//         });

// });
// document.addEventListener("DOMContentLoaded", () => {
//   const cookBtn = document.getElementById("btn-cook");

//   if (cookBtn) {
//     cookBtn.onclick = () => {
//       const params = new URLSearchParams(window.location.search);
//       const id = params.get("id");

//       window.location.href = `nau-an.html?id=${id}`;
//     };
//   }
// });
document.addEventListener("DOMContentLoaded", () => {

    // 🔍 LẤY ID TỪ URL
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");

    // ❌ Nếu không có id → dừng luôn
    if (!id) return;

    // 📦 FETCH DATA
    fetch("./data/db.json")
        .then(res => res.json())
        .then(data => {

            const recipes = data.recipes;

            // 🎯 TÌM MÓN
            const food = recipes.find(r => r.id == id);

            const detailInfo = document.querySelector(".detail-info");

            // ❌ KHÔNG TÌM THẤY
            if (!food) {
                if (detailInfo) {
                    detailInfo.innerHTML = "<h2>Không tìm thấy món ăn</h2>";
                }
                return;
            }

            // =======================
            // 🔥 LƯU LỊCH SỬ XEM (THÊM MỚI)
            // =======================
            saveToHistory({
                id: food.id,
                name: food.name,
                img: food.image,
                category: food.category || "Món ăn",
                time: food.time
            });

            // =======================
            // 🎯 GÁN DATA
            // =======================
            const mainImg = document.getElementById("main-img");
            if (mainImg) mainImg.src = food.image;

            const title = document.getElementById("title");
            if (title) title.innerText = food.name;

            const desc = document.getElementById("description");
            if (desc) desc.innerText = food.description;

            const meta = document.querySelector(".detail-meta");
            if (meta) {
                meta.innerHTML = `
                    <span>⏱ ${food.time}</span>
                    <span>🍽 ${food.serving || "2-4 người"}</span>
                `;
            }

            // =======================
            // 🥗 NGUYÊN LIỆU
            // =======================
            const ing = document.getElementById("ingredients");

            if (ing) {
                ing.innerHTML = "";

                if (food.ingredients) {
                    food.ingredients.forEach(i => {
                        const li = document.createElement("li");
                        li.innerText = i;
                        ing.appendChild(li);
                    });
                }
            }

            // =======================
            // 👨‍🍳 CÁC BƯỚC
            // =======================
            const steps = document.getElementById("steps");

            if (steps) {
                steps.innerHTML = "";

                if (food.steps) {
                    food.steps.forEach(s => {
                        const li = document.createElement("li");
                        li.innerText = s;
                        steps.appendChild(li);
                    });
                }
            }

            // =======================
            // ❤️ LƯU MÓN
            // =======================
            const saveBtn = document.getElementById("saveBtn");

            if (saveBtn) {
                let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

                if (favorites.includes(food.id)) {
                    saveBtn.innerText = "Đã lưu ❤️";
                }

                saveBtn.addEventListener("click", () => {
                    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

                    if (!favorites.includes(food.id)) {
                        favorites.push(food.id);
                        localStorage.setItem("favorites", JSON.stringify(favorites));

                        saveBtn.innerText = "Đã lưu ❤️";
                        alert("Đã lưu món!");
                    } else {
                        alert("Món đã lưu rồi!");
                    }
                });
            }

            // =======================
            // 🍳 NÚT NẤU ĂN
            // =======================
            const cookBtn = document.getElementById("btn-cook");

            if (cookBtn) {
                cookBtn.onclick = () => {
                    window.location.href = `nau-an.html?id=${food.id}`;
                };
            }

        })
        .catch(err => {
            console.error("Lỗi load data:", err);
        });

});


// ===============================
// 🔥 HÀM LƯU LỊCH SỬ
// ===============================
function saveToHistory(recipe) {
    let history = JSON.parse(localStorage.getItem("viewHistory")) || [];

    // ❌ tránh trùng
    history = history.filter(item => item.id !== recipe.id);

    // ✅ thêm mới
    history.push(recipe);

    // 📉 giới hạn 10 món
    if (history.length > 10) {
        history.shift();
    }

    localStorage.setItem("viewHistory", JSON.stringify(history));
}