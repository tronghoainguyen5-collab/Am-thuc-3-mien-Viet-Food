document.addEventListener('DOMContentLoaded', () => {

    const params = new URLSearchParams(window.location.search);
    const region = params.get('region');
    const type = params.get('type');     // loại món

    const map = { bac: 1, trung: 2, nam: 3 };
    const categoryId = map[region];

    let allRecipes = [];
    let sliderData = [];
    let expanded = false;

    const LIMIT = 8;

   fetch("./data/db.json")
    .then(res => res.json())
    .then(data => {
        let recipes = data.recipes;

        if (categoryId) {
            recipes = recipes.filter(r => r.categoryId == categoryId);
        }

        if (type) {
            recipes = recipes.filter(r => 
                r.type?.toLowerCase().trim() === type.toLowerCase().trim()
            );
        }

        if (!recipes.length) return;

        // ✅ FIX QUAN TRỌNG
        allRecipes = recipes;

        sliderData = allRecipes.slice(0, 10);

        if (document.getElementById('img-current')) {
            initSlider(sliderData);
        }

        renderInitial();
        updateTitle(region);
    });

    // =======================
    // 🚀 RENDER BAN ĐẦU
    // =======================
   function renderInitial() {
    const container = document.querySelector('.recipe-grid');
    if (!container) return; // 🔥 FIX

    container.innerHTML = "";

    const data = allRecipes.slice(0, LIMIT);
    appendList(data);

    renderToggleButton();
}

    // =======================
    // ➕ APPEND (KHÔNG RESET)
    // =======================
    function appendList(recipes) {
        const container = document.querySelector('.recipe-grid');
        if (!container) return; // 🔥 FIX

        recipes.forEach(r => {
            const saved = isSaved(r.id);

            const div = document.createElement("div");
            div.className = "recipe-card";
            div.style = `
                opacity:0;
                transform:translateY(20px);
                transition:all 0.25s ease;
            `;

            div.innerHTML = `
                <div class="thumb" style="position:relative;height:200px;">
                    <img src="${r.image}" style="width:100%;height:100%;object-fit:cover;">
                    <button onclick='addToFavorite(${JSON.stringify(r)}, this)' 
                        class="save-icon ${saved ? 'active' : ''}"
                        style="color:${saved ? '#e74c3c' : '#000'};position:absolute;top:8px;right:8px;">
                        <i class="fa-solid fa-bookmark"></i>
                    </button>
                </div>

                <div style="padding:16px">
                    <h3>${r.name}</h3>
                    <p>${r.description}</p>

                    <a href="chi-tiet.html?id=${r.id}">
                        <button>Xem chi tiết</button>
                    </a>
                </div>
            `;

            container.appendChild(div);

            // animate
            requestAnimationFrame(() => {
                div.style.opacity = "1";
                div.style.transform = "translateY(0)";
            });

            // hover
            const img = div.querySelector('img');
            div.addEventListener('mouseenter', () => {
                div.style.transform = "translateY(-6px)";
                div.style.boxShadow = "0 12px 30px rgba(0,0,0,0.15)";
                img.style.transform = "scale(1.05)";
            });

            div.addEventListener('mouseleave', () => {
                div.style.transform = "translateY(0)";
                div.style.boxShadow = "0 6px 20px rgba(0,0,0,0.08)";
                img.style.transform = "scale(1)";
            });
        });
    }

    // =======================
    // 🔘 BUTTON TOGGLE
    // =======================
    function renderToggleButton() {
        let btn = document.getElementById("toggle-btn");
        let container = document.querySelector(".container");
    if (!container) return; // 🔥 FIX

        if (!btn) {
            btn = document.createElement("button");
            btn.id = "toggle-btn";

            btn.style = `
                margin:20px auto;
                display:block;
                padding:10px 22px;
                cursor:pointer;
                border-radius:30px;
                border:none;
                background:linear-gradient(135deg,#ff7e5f,#e67e22);
                color:#fff;
                font-weight:600;
                transition:0.25s;
            `;

            document.querySelector(".container").appendChild(btn);
        }

        updateBtnText(btn);

        btn.onclick = () => {
            const container = document.querySelector('.recipe-grid');

            if (!expanded) {
                // 👉 load thêm (append)
                appendList(allRecipes.slice(LIMIT));
            } else {
                // 👉 thu gọn (xóa bớt)
                const items = container.querySelectorAll('.recipe-card');

                items.forEach((item, index) => {
                    if (index >= LIMIT) {
                        item.remove();
                    }
                });
            }

            expanded = !expanded;
            updateBtnText(btn);
        };
    }

    function updateBtnText(btn) {
        btn.innerHTML = expanded
            ? '<i class="fa-solid fa-chevron-up"></i> Thu gọn'
            : '<i class="fa-solid fa-chevron-down"></i> Xem thêm';
    }

    // =======================
    // 🎞 SLIDER (GIỮ NGUYÊN)
    // =======================
    function initSlider(recipes) {
    const imgCurrent = document.getElementById('img-current');
    const imgNext = document.getElementById('img-next');

    const title = document.getElementById('hero-title');
    const desc = document.getElementById('hero-desc');
    const time = document.getElementById('hero-time');
    const content = document.querySelector('.hero-content');

    const dotsContainer = document.getElementById('hero-dots');
    const thumbsContainer = document.getElementById('thumbs');
    const btnUp = document.getElementById('btn-up');
    const btnDown = document.getElementById('btn-down');
    if (!dotsContainer || !thumbsContainer) return;

    let index = 0;
    let currentId = null;
    let isAnimating = false;
    let autoSlide;

    // dots
    dotsContainer.innerHTML = recipes.map((_, i) =>
        `<span class="dot ${i===0?'active':''}" data-i="${i}"></span>`
    ).join('');

    // thumbs
    thumbsContainer.innerHTML = recipes.map((r,i) =>
        `<img src="${r.image}" class="${i===0?'active':''}" data-i="${i}">`
    ).join('');

    const dots = document.querySelectorAll('.dot');
    const thumbs = thumbsContainer.querySelectorAll('img');

    function changeSlide(i) {
        if (isAnimating || i === index) return;
        isAnimating = true;

        const next = recipes[i];

        // 👉 TEXT fade out (sync với ảnh)
        content.classList.remove("fade-in");
        content.classList.add("fade-out");

        // 👉 set ảnh next
        imgNext.src = next.image;
        imgNext.className = "img-layer slide-start-right";

        requestAnimationFrame(() => {
            imgCurrent.classList.add("slide-out-left");
            imgNext.classList.add("active", "slide-in-right");
        });

        // 👉 dùng transitionend → KHÔNG bị lệch timing
        imgNext.addEventListener("transitionend", function handler() {
            imgNext.removeEventListener("transitionend", handler);

            // swap ảnh
            imgCurrent.src = next.image;
            imgCurrent.className = "img-layer active";
            imgNext.className = "img-layer";

            // 👉 update text (đúng lúc animation kết thúc)
            title.innerText = next.name;
            desc.innerText = next.description;
            time.innerHTML = `<i class="far fa-clock"></i> ${next.time}`;

            // 👉 TEXT fade in (đồng bộ)
            content.classList.remove("fade-out");
            content.classList.add("fade-in");

            currentId = next.id;

            // UI
            dots.forEach(d => d.classList.remove('active'));
            dots[i].classList.add('active');

            thumbs.forEach(t => t.classList.remove('active'));
            thumbs[i].classList.add('active');

            index = i;
            isAnimating = false;
        });
    }

    // init
    imgCurrent.src = recipes[0].image;
    imgCurrent.classList.add("active");

    title.innerText = recipes[0].name;
    desc.innerText = recipes[0].description;
    time.innerHTML = `<i class="far fa-clock"></i> ${recipes[0].time}`;

    currentId = recipes[0].id;

    // click
    thumbs.forEach(t => t.onclick = () => changeSlide(+t.dataset.i));
    dots.forEach(d => d.onclick = () => changeSlide(+d.dataset.i));

    btnUp.onclick = () => changeSlide(index-1 < 0 ? recipes.length-1 : index-1);
    btnDown.onclick = () => changeSlide((index+1) % recipes.length);

    // auto slide
    function startAuto() {
        autoSlide = setInterval(() => {
            changeSlide((index + 1) % recipes.length);
        }, 4000);
    }

    function stopAuto() {
        clearInterval(autoSlide);
    }

    const hero = document.querySelector('.hero-main-image');
    hero.addEventListener('mouseenter', stopAuto);
    hero.addEventListener('mouseleave', startAuto);

    startAuto();

    // nút xem cách nấu
    const cookBtn = document.getElementById("btn-cook");
if (cookBtn) {
    cookBtn.addEventListener("click", (e) => {
        e.preventDefault();
        if (currentId) {
            window.location.href = `chi-tiet.html?id=${currentId}`;
        }
    });
}
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


// =======================
// 🔝 SCROLL TO TOP
// =======================
const scrollBtn = document.createElement("button");
scrollBtn.innerHTML = '<i class="fa-solid fa-arrow-up"></i>';

scrollBtn.style = `
    position:fixed;
    bottom:30px;
    right:30px;
    width:45px;
    height:45px;
    border-radius:50%;
    border:none;
    background:#e67e22;
    color:#fff;
    font-size:18px;
    cursor:pointer;
    display:none;
    align-items:center;
    justify-content:center;
    box-shadow:0 6px 20px rgba(0,0,0,0.25);
    z-index:999;
`;

document.body.appendChild(scrollBtn);

window.addEventListener("scroll", () => {
    scrollBtn.style.display = window.scrollY > 300 ? "flex" : "none";
});

scrollBtn.onclick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
};
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



// document.addEventListener('DOMContentLoaded', () => {
//     // 1. Lấy các phần tử HTML
//     const userLoggedIn = document.getElementById('user-logged-in');
//     const userGuest = document.getElementById('user-guest');
//     const headerAvatar = document.getElementById('header-avatar');
//     const headerUsername = document.getElementById('header-username');
//     const dropdownBtn = document.getElementById('profile-dropdown-btn');
//     const dropdownMenu = document.getElementById('profile-dropdown');

//     // 2. Kiểm tra trạng thái đăng nhập từ localStorage
//     // Chúng ta giả định khi đăng nhập thành công sẽ lưu user vào key 'currentUser'
//     const currentUser = localStorage.getItem('currentUser');

//     if (currentUser) {
//         // Nếu có người dùng đăng nhập
//         const userData = JSON.parse(localStorage.getItem(`user_${currentUser}`));
        
//         if (userData) {
//             // Hiển thị thông tin lên Header
//             headerUsername.innerText = userData.fullname || userData.username;
//             headerAvatar.src = userData.avatar || './public/image/avatar.png';

//             // Hiện vùng User, ẩn vùng Guest
//             userLoggedIn.style.display = 'flex';
//             userGuest.style.display = 'none';
//         }
//     } else {
//         // Nếu chưa đăng nhập
//         userLoggedIn.style.display = 'none';
//         userGuest.style.display = 'flex';
//     }

//     // 3. Xử lý đóng/mở Dropdown khi click vào Avatar
//     if (dropdownBtn) {
//         dropdownBtn.addEventListener('click', (e) => {
//             e.stopPropagation();
//             dropdownMenu.classList.toggle('show');
//         });
//     }

//     // Click ra ngoài để đóng dropdown
//     window.addEventListener('click', () => {
//         if (dropdownMenu && dropdownMenu.classList.contains('show')) {
//             dropdownMenu.classList.remove('show');
//         }
//     });
// });

// // Hàm đăng xuất dùng chung
// function logoutUser() {
//     if (confirm("Bạn có chắc muốn đăng xuất không?")) {
//         localStorage.removeItem('currentUser');
//         window.location.href = 'index.html';
//     }
// }