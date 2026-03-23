document.addEventListener('DOMContentLoaded', () => {

    const params = new URLSearchParams(window.location.search);
    const region = params.get('region');

    const map = {
        bac: 1,
        trung: 2,
        nam: 3
    };

    const categoryId = map[region];

    fetch("./data/db.json")
        .then(res => res.json())
        .then(data => {

            let recipes = data.recipes;

            if (categoryId) {
                recipes = recipes.filter(r => r.categoryId == categoryId);
            }

            if (recipes.length === 0) return;

            renderList(recipes);
            initSlider(recipes);
            updateTitle(region);
        });

    // ===== RENDER LIST =====
    function renderList(recipes) {
        const container = document.querySelector('.recipe-grid');
        if (!container) return;

        container.innerHTML = "";

        recipes.forEach(r => {
            container.innerHTML += `
                <div class="recipe-card">
                    <img src="${r.image}">
                    <h3>${r.name}</h3>
                    <p>${r.description}</p>

                    <a href="chi-tiet.html?id=${r.id}">
                        <button>Xem chi tiết</button>
                    </a>
                </div>
            `;
        });
    }

    // ===== SLIDER XỊN =====
    function initSlider(recipes) {

    const mainImg = document.getElementById('main-img');
    const title = document.getElementById('hero-title');
    const desc = document.getElementById('hero-desc');
    const time = document.getElementById('hero-time');

    const dotsContainer = document.getElementById('hero-dots');
    const thumbsContainer = document.getElementById('thumbs');

    const btnUp = document.getElementById('btn-up');
    const btnDown = document.getElementById('btn-down');

    if (!mainImg) return;

    let index = 0;
    let isAnimating = false;

    // preload ảnh
    recipes.forEach(r => {
        const img = new Image();
        img.src = r.image;
    });

    // ===== RENDER DOTS =====
    dotsContainer.innerHTML = recipes.map((_, i) =>
        `<span class="dot ${i === 0 ? 'active' : ''}" data-i="${i}"></span>`
    ).join('');

    const dots = document.querySelectorAll('.dot');

    // ===== RENDER THUMB =====
    thumbsContainer.innerHTML = recipes.map((r, i) =>
        `<img src="${r.image}" class="${i === 0 ? 'active' : ''}" data-i="${i}">`
    ).join('');

    const thumbs = thumbsContainer.querySelectorAll('img');

    function render(i) {
        if (isAnimating) return;
        isAnimating = true;

        const r = recipes[i];

        mainImg.style.opacity = 0;
        mainImg.style.transform = "scale(0.95)";

        setTimeout(() => {
            title.innerText = r.name;
            desc.innerText = r.description;
            time.innerHTML = `<i class="far fa-clock"></i> ${r.time}`;
            mainImg.src = r.image;

            // update dots
            dots.forEach(d => d.classList.remove('active'));
            dots[i].classList.add('active');

            // update thumbs
            thumbs.forEach(t => t.classList.remove('active'));
            thumbs[i].classList.add('active');

            mainImg.style.opacity = 1;
            mainImg.style.transform = "scale(1)";

            index = i;
            isAnimating = false;
        }, 400);
    }

    render(index);

    // click thumbnail
    thumbs.forEach(t => {
        t.addEventListener("click", () => {
            render(+t.dataset.i);
        });
    });

    // click dot
    dots.forEach(d => {
        d.addEventListener("click", () => {
            render(+d.dataset.i);
        });
    });

    // nút lên
    btnUp.addEventListener("click", () => {
        let i = index - 1;
        if (i < 0) i = recipes.length - 1;
        render(i);
    });

    // nút xuống
    btnDown.addEventListener("click", () => {
        let i = (index + 1) % recipes.length;
        render(i);
    });

    // click ảnh → chi tiết
    mainImg.addEventListener("click", () => {
        window.location.href = `chi-tiet.html?id=${recipes[index].id}`;
    });

    // auto slide
    setInterval(() => {
        let i = (index + 1) % recipes.length;
        render(i);
    }, 4000);
}

    // ===== TITLE =====
    function updateTitle(region) {
        const el = document.querySelector(".section-title");
        if (!el) return;

        const map = {
            bac: "Tinh Hoa Đặc Sản Miền Bắc",
            trung: "Tinh Hoa Đặc Sản Miền Trung",
            nam: "Tinh Hoa Đặc Sản Miền Nam"
        };

        el.innerText = map[region] || "Tất Cả Món Ăn";
    }

});