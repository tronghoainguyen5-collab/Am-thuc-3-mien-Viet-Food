document.addEventListener("DOMContentLoaded", () => {

    // 🔍 LẤY ID TỪ URL
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");

    // 📦 FETCH DATA
    fetch("./data/db.json")
        .then(res => res.json())
        .then(data => {

            const recipes = data.recipes;

            // ⚠️ IMPORTANT: id từ URL là string → convert
            const food = recipes.find(r => r.id == id);

            if (!food) {
                document.querySelector(".detail-info").innerHTML = "<h2>Không tìm thấy món ăn</h2>";
                return;
            }

            // 🎯 GÁN DATA
            document.getElementById("main-img").src = food.image;
            document.getElementById("title").innerText = food.name;
            document.getElementById("description").innerText = food.description;

            // META
            document.querySelector(".detail-meta").innerHTML = `
                <span>⏱ ${food.time}</span>
                <span>🍽 ${food.serving || "2-4 người"}</span>
            `;

            // 🥗 NGUYÊN LIỆU
            const ing = document.getElementById("ingredients");
            ing.innerHTML = "";

            if (food.ingredients) {
                food.ingredients.forEach(i => {
                    const li = document.createElement("li");
                    li.innerText = i;
                    ing.appendChild(li);
                });
            }

            // 👨‍🍳 CÁC BƯỚC
            const steps = document.getElementById("steps");
            steps.innerHTML = "";

            if (food.steps) {
                food.steps.forEach(s => {
                    const li = document.createElement("li");
                    li.innerText = s;
                    steps.appendChild(li);
                });
            }

            // ❤️ LƯU MÓN
            const saveBtn = document.getElementById("saveBtn");
            saveBtn.addEventListener("click", () => {
                let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

                if (!favorites.includes(food.id)) {
                    favorites.push(food.id);
                    localStorage.setItem("favorites", JSON.stringify(favorites));
                    alert("Đã lưu món!");
                } else {
                    alert("Món đã lưu rồi!");
                }
            });

        })
        .catch(err => {
            console.error("Lỗi load data:", err);
        });

});