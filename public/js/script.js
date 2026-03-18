document.addEventListener('DOMContentLoaded', () => {
    const allData = {
        "bac": [
            { title: "Phở Bò Hà Nội", time: "8 giờ", serves: "4 người", desc: "Nước dùng trong, ngọt thanh từ xương ống ninh kỹ cùng quế hồi thơm lừng.", img: "https://static.vinwonders.com/production/pho-bo-ha-noi-4.jpg" },
            { title: "Bún Chả Hà Nội", time: "45 phút", serves: "2-3 người", desc: "Thịt nướng than hoa ăn kèm nước chấm đu đủ xanh chua ngọt.", img: "https://www.seriouseats.com/thmb/atsVhLwxdCWyX-QDuhOLhR0Kx4s=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/20231204-SEA-VyTran-BunChaHanoi-18-e37d96a89a0f43d097e02311686290f2.jpg" },
            { title: "Chả Cá Lã Vọng", time: "60 phút", serves: "3-4 người", desc: "Cá lăng nướng vàng, ăn kèm bún, mắm tôm và rau thì là.", img: "https://www.cet.edu.vn/wp-content/uploads/2018/08/cha-ca-la-vong.jpg" },
            { title: "Bún Thang", time: "90 phút", serves: "4-5 người", desc: "Sự cầu kỳ từ trứng tráng mỏng, giò lụa và tôm khô.", img: "https://mia.vn/media/uploads/blog-du-lich/bun-thang-ha-noi-1-1760498574.jpg" }
        ],
        "trung": [
            { title: "Bún Bò Huế", time: "120 phút", serves: "4-6 người", desc: "Hương vị đậm đà mắm ruốc, sả thơm nồng và vị cay đặc trưng Cố Đô.", img: "https://i.ytimg.com/vi/CSI9ildGX9s/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLCxhRIyoYY7k9ZuxY0YOC9jNFLapg" },
            { title: "Mì Quảng", time: "45 phút", serves: "3 người", desc: "Sợi mì dai, nước dùng sệt, ăn kèm bánh tráng nướng giòn rụm.", img: "https://cooponline.vn/tin-tuc/wp-content/uploads/2025/10/mi-quang-mon-dac-san-dam-da-thom-lung-xu-quang.png" },
            { title: "Cơm Hến", time: "60 phút", serves: "2 người", desc: "Món ăn dân dã với nước hến ngọt thanh, rau sống và tóp mỡ giòn.", img: "https://daotaobeptruong.vn/wp-content/uploads/2021/02/com-hen-hua.jpg" },
            { title: "Bánh Đập", time: "30 phút", serves: "2 người", desc: "Sự kết hợp giữa bánh tráng nướng và bánh ướt chấm mắm nêm.", img: "https://imagevietnam.vnanet.vn//MediaUpload/Org/2024/12/05/art059155-16-8-21.jpg" }
        ],
        "nam": [
            { title: "Lẩu Mắm Miền Tây", time: "60 phút", serves: "4-5 người", desc: "Hương vị mắm cá linh, cá sặc ăn kèm vô vàn loại rau đồng nội.", img: "https://daotaobeptruong.vn/wp-content/uploads/2021/03/cach-nau-lau-mam-don-gian.jpg" },
            { title: "Cơm Tấm Sài Gòn", time: "30 phút", serves: "1 người", desc: "Sườn nướng mật ong vàng óng, ăn kèm bì chả và nước mắm kẹo.", img: "https://static.vinwonders.com/production/com-tam-sai-gon-banner.jpg" },
            { title: "Bánh Xèo", time: "45 phút", serves: "3 người", desc: "Bánh giòn rụm, thơm mùi cốt dừa và nghệ, nhân tôm thịt đầy đặn.", img: "https://i.ytimg.com/vi/hxI-i5jAeB8/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLBojnmiQAk3Xll7SREnHLzCPhVJ7w" },
            { title: "Vịt Nấu Chao", time: "70 phút", serves: "4 người", desc: "Thịt vịt mềm thấm vị chao béo ngậy, ăn cùng khoai môn dẻo.", img: "https://static-images.vnncdn.net/vps_images_publish/000001/000003/2026/1/19/cach-lam-vit-nau-chao-don-gian-tai-nha-khong-lo-bi-hoi-1926.jpg?width=0&s=749A_jlfZOaqF9tmDBCtuw" }
        ]
    };

    const region = document.body.getAttribute('data-region');
    const recipeData = allData[region];
    if (!recipeData) return;

    const mainImg = document.getElementById('main-img');
    const title = document.getElementById('hero-title');
    const desc = document.getElementById('hero-desc');
    const time = document.getElementById('hero-time');
    const serves = document.getElementById('hero-serves');
    const thumbs = document.querySelectorAll('.side-thumbs img');
    const dots = document.querySelectorAll('.dot');

    function update(i) {
        thumbs.forEach(t => t.classList.remove('active'));
        dots.forEach(d => d.classList.remove('active'));
        thumbs[i].classList.add('active');
        dots[i].classList.add('active');

        mainImg.style.opacity = 0;
        setTimeout(() => {
            title.innerText = recipeData[i].title;
            desc.innerText = recipeData[i].desc;
            time.innerHTML = `<i class="far fa-clock"></i> ${recipeData[i].time}`;
            serves.innerHTML = `<i class="fas fa-users"></i> ${recipeData[i].serves}`;
            mainImg.src = recipeData[i].img;
            mainImg.style.opacity = 1;
        }, 250);
    }

    thumbs.forEach((t, i) => t.onclick = () => update(i));
    dots.forEach((d, i) => d.onclick = () => update(i));
});