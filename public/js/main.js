document.addEventListener('DOMContentLoaded', () => {

    const params = new URLSearchParams(window.location.search);
    const region = params.get('region');

    const map = { bac: 1, trung: 2, nam: 3 };
    const categoryId = map[region];

    fetch("./data/db.json")
        .then(res => res.json())
        .then(data => {
            let recipes = data.recipes;
            if (categoryId) recipes = recipes.filter(r => r.categoryId == categoryId);
            if (!recipes.length) return;

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
            const saved = isSaved(r.id);
            container.innerHTML += `
<article class="recipe-card" style="
    background: #fff;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 6px 20px rgba(0,0,0,0.08);
    border: 1px solid #f1f1f1;
    display: flex;
    flex-direction: column;
    height: 100%;
    transition: transform 0.4s ease, box-shadow 0.4s ease;
    cursor: pointer;
">
    <div class="thumb" style="position: relative; width: 100%; height: 200px; overflow: hidden;">
        <img src="${r.image}" style="
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform 0.5s ease;
        ">
        <button 
            onclick='addToFavorite(${JSON.stringify(r)}, this)' 
            class="save-icon ${saved ? 'active' : ''}"
            style="color: ${saved ? '#e74c3c' : '#000'}; position: absolute; top: 8px; right: 8px; background: rgba(255,255,255,0.8); border: none; border-radius: 50%; padding: 6px; cursor: pointer;">
            <i class="fa-solid fa-bookmark"></i>
        </button>
    </div>
    <div style="padding: 18px; flex-grow: 1; display: flex; flex-direction: column;">
        <h3 style="
            margin: 0 0 10px 0; 
            font-size: 1.2rem; 
            color: #2c3e50; 
            font-weight: 700;
            line-height: 1.3;
        ">
            ${r.name}
        </h3>
        <p style="
            font-size: 0.95rem; 
            color: #7f8c8d; 
            margin: 0 0 20px 0; 
            line-height: 1.6;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
            flex-grow: 1;
        ">
            ${r.description}
        </p>
        <a href="chi-tiet.html?id=${r.id}" style="text-decoration: none;">
            <button style="
                width: fit-content;
                padding: 5px 10px;
                background: #fff;
                color: #333;
                border: 1px solid #d1d1d1;
                border-radius: 4px;
                font-size: 0.8rem;
                cursor: pointer;
                transition: all 0.25s ease;
                text-transform: none;
            " onmouseover="this.style.borderColor='#e67e22'; this.style.color='#e67e22'" 
               onmouseout="this.style.borderColor='#d1d1d1'; this.style.color='#333'">
                Xem chi tiết
            </button>
        </a>
    </div>
</article>
`;
        });

        // Hover animation cho ảnh và card
        document.querySelectorAll('.recipe-card').forEach(card => {
            const img = card.querySelector('img');
            card.addEventListener('mouseenter', () => {
                card.style.transform = "translateY(-8px)";
                card.style.boxShadow = "0 15px 35px rgba(0,0,0,0.15)";
                img.style.transform = "scale(1.07)";
            });
            card.addEventListener('mouseleave', () => {
                card.style.transform = "translateY(0)";
                card.style.boxShadow = "0 6px 20px rgba(0,0,0,0.08)";
                img.style.transform = "scale(1)";
            });
        });
    }

    // ===== SLIDER =====
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

        let index = 0, isAnimating = false, autoSlide;

        // preload images
        recipes.forEach(r => new Image().src = r.image);

        // render dots
        dotsContainer.innerHTML = recipes.map((_, i) =>
            `<span class="dot ${i===0?'active':''}" data-i="${i}"></span>`
        ).join('');
        const dots = document.querySelectorAll('.dot');

        // render thumbs
        thumbsContainer.innerHTML = recipes.map((r,i) =>
            `<img src="${r.image}" class="${i===0?'active':''}" data-i="${i}">`
        ).join('');
        const thumbs = thumbsContainer.querySelectorAll('img');

        function render(i) {
            if (isAnimating) return;
            isAnimating = true;

            const r = recipes[i];
            mainImg.style.transition = "transform 0.5s ease, opacity 0.5s ease";
            mainImg.style.opacity = 0;
            mainImg.style.transform = "scale(0.95)";

            setTimeout(() => {
                title.innerText = r.name;
                desc.innerText = r.description;
                time.innerHTML = `<i class="far fa-clock"></i> ${r.time}`;
                mainImg.src = r.image;

                dots.forEach(d => d.classList.remove('active'));
                dots[i].classList.add('active');

                thumbs.forEach(t => t.classList.remove('active'));
                thumbs[i].classList.add('active');

                mainImg.style.opacity = 1;
                mainImg.style.transform = "scale(1)";

                index = i;
                isAnimating = false;
            }, 200);
        }

        render(index);

        // click thumbnail
        thumbs.forEach(t => t.addEventListener("click", () => render(+t.dataset.i)));

        // click dot
        dots.forEach(d => d.addEventListener("click", () => render(+d.dataset.i)));

        // nút up/down
        btnUp.addEventListener("click", () => render(index-1<0?recipes.length-1:index-1));
        btnDown.addEventListener("click", () => render((index+1)%recipes.length));

        // click main image → chi tiết
        mainImg.addEventListener("click", () => window.location.href=`chi-tiet.html?id=${recipes[index].id}`);

        // ===== Auto slide với hover pause =====
        function startAutoSlide() {
            stopAutoSlide();
            autoSlide = setInterval(() => render((index+1)%recipes.length), 4000);
        }
        function stopAutoSlide() { clearInterval(autoSlide); }

        [mainImg, thumbsContainer, ...document.querySelectorAll('.recipe-card')].forEach(el => {
            el.addEventListener('mouseenter', stopAutoSlide);
            el.addEventListener('mouseleave', startAutoSlide);
        });

        startAutoSlide();
    }

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
// function saveRecipe(button) {
//     // 1. Tìm thẻ cha chứa thông tin món ăn
//     const card = button.closest('.recipe-card');
    
//     // 2. Thu thập dữ liệu từ các thuộc tính data-
//     const recipe = {
//         id: card.getAttribute('data-id'),
//         name: card.getAttribute('data-name'),
//         img: card.getAttribute('data-img')
//     };

//     // 3. Lấy danh sách cũ từ máy người dùng
//     let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

//     // 4. Kiểm tra xem món này đã lưu chưa
//     const isExisted = favorites.some(item => item.id === recipe.id);

//     if (!isExisted) {
//         favorites.push(recipe);
//         localStorage.setItem('favorites', JSON.stringify(favorites));
        
//         // Hiệu ứng đổi màu nút để người dùng biết đã lưu thành công
//         button.querySelector('i').style.color = "#ff4757"; 
//         alert("Đã thêm '" + recipe.name + "' vào danh sách yêu thích!");
//     } else {
//         alert("Món này bạn đã lưu rồi nhé!");
//     }
// }
function toggleMenu() {
  document.querySelector(".nav-links").classList.toggle("active");
}