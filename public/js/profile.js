function toggleContact() {
    const contactDiv = document.getElementById('contact-info');
    
    // Toggle class để ẩn/hiện thông tin liên hệ
    if (contactDiv.classList.contains('hidden')) {
        contactDiv.classList.remove('hidden');
        contactDiv.style.animation = 'fadeIn 0.5s ease forwards';
    } else {
        contactDiv.classList.add('hidden');
    }
}

// Hiệu ứng Fade In đơn giản cho phần liên hệ
const style = document.createElement('style');
style.innerHTML = `
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
    }
`;
document.head.appendChild(style);

// Bạn có thể thêm các xử lý khác như đổi theme hoặc lấy dữ liệu từ API tại đây