document.addEventListener('DOMContentLoaded', () => {

    // ===== LẤY REGION TỪ URL =====
    const params = new URLSearchParams(window.location.search);
    const region = params.get('region');

    const map = {
        bac: 1,
        trung: 2,
        nam: 3
    };

    const categoryId = map[region];

    // ===== FETCH DATA =====
    fetch("data/db.json")
        .then(res => res.json())
        .then(data => {

            let recipes = data.recipes;

            // nếu có miền → lọc
            if (categoryId) {
                recipes = recipes.filter(r => r.categoryId == categoryId);
            }

            if (recipes.length === 0) return;

            initSlider(recipes);
            renderList(recipes);
            updateTitle(region);
        });

    // ===== SLIDER =====
    function initSlider(recipes) {

        const mainImg = document.getElementById('main-img');
        const title = document.getElementById('hero-title');
        const desc = document.getElementById('hero-desc');
        const time = document.getElementById('hero-time');
        const serves = document.getElementById('hero-serves');

        let index = 0;

        function render(i) {
            let r = recipes[i];

            title.innerText = r.name;
            desc.innerText = r.description;
            time.innerHTML = `<i class="far fa-clock"></i> ${r.time}`;
            serves.innerHTML = `<i class="fas fa-users"></i> 2-4 người`;
            mainImg.src = r.image;
        }

        render(index);

        // auto slide
        setInterval(() => {
            index = (index + 1) % recipes.length;
            render(index);
        }, 3000);
    }

    // ===== RENDER LIST =====
   function renderList(recipes) {
    const container = document.querySelector('.recipe-grid');

    if (!container) {
        console.error("Không tìm thấy .recipe-grid");
        return;
    }

    container.innerHTML = "";

    recipes.forEach(r => {
        container.innerHTML += `
        <article class="recipe-card">
            <div class="thumb">
                <img src="${r.image}">
                <button class="save-icon" onclick="addFavorite(${r.id})">
                    <i class="fa-solid fa-bookmark"></i>
                </button>
            </div>

            <h3>${r.name}</h3>

            <a href="chi-tiet.html?id=${r.id}">
                <button class="btn">Xem chi tiết</button>
            </a>
        </article>
        `;
    });
}

    // ===== TITLE =====
    function updateTitle(region) {
        const titleMap = {
            bac: "Tinh Hoa Đặc Sản Miền Bắc",
            trung: "Tinh Hoa Đặc Sản Miền Trung",
            nam: "Tinh Hoa Đặc Sản Miền Nam"
        };

        const el = document.querySelector(".section-title");
        if (el) {
            el.innerText = titleMap[region] || "Tất Cả Món Ăn";
        }
    }

});