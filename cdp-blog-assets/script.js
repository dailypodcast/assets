// --- Bắt đầu file script.js ---

// ==========================================================
// Phần 1: Script điều khiển YouTube Player
// ==========================================================
var player;
function onYouTubeIframeAPIReady() {
    player = new YT.Player('ytplayer', {
        events: {}
    });
}

function jumpToTime(seconds) {
    if (player && typeof player.seekTo === 'function') {
        player.seekTo(seconds, true);
        player.playVideo();
    }
}

// ==========================================================
// Phần 2: Script chức năng chính của trang
// ==========================================================

// Lưu trữ mã HTML dưới dạng chuỗi (template literals `...` cho phép xuống dòng)
const socialHTML = `
<div class="social">
    <div class="coffe">
        <svg width="50px" height="50px" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
            <path d="M9.197 0l-1.619 3.735h-2.407v3.359h0.921l0.943 5.975h-1.473l1.948 10.973 1.249-0.015 1.256 7.973h11.891l0.083-0.531 1.172-7.443 1.188 0.015 1.943-10.973h-1.407l0.937-5.975h1.011v-3.359h-2.557l-1.625-3.735z" fill="#f5c518" />
            <path d="M9.901 1.073h12.057l1.025 2.375h-14.115zM6.235 4.803h19.525v1.228h-19.525zM6.839 14.136h18.183l-1.568 8.823-7.536-0.079-7.511 0.079z" fill="#000000" />
        </svg>
        <div class="tooltip" style="color: gold;">Buy Me a Coffee</div>
    </div>
    <div class="spotify-channel">
        <svg width="50px" height="50px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 496 512">
            <path fill="#1ed760" d="M248 8C111.1 8 0 119.1 0 256s111.1 248 248 248 248-111.1 248-248S384.9 8 248 8Z" />
            <path d="M406.6 231.1c-5.2 0-8.4-1.3-12.9-3.9-71.2-42.5-198.5-52.7-280.9-29.7-3.6 1-8.1 2.6-12.9 2.6-13.2 0-23.3-10.3-23.3-23.6 0-13.6 8.4-21.3 17.4-23.9 35.2-10.3 74.6-15.2 117.5-15.2 73 0 149.5 15.2 205.4 47.8 7.8 4.5 12.9 10.7 12.9 22.6 0 13.6-11 23.3-23.2 23.3zm-31 76.2c-5.2 0-8.7-2.3-12.3-4.2-62.5-37-155.7-51.9-238.6-29.4-4.8 1.3-7.4 2.6-11.9 2.6-10.7 0-19.4-8.7-19.4-19.4s5.2-17.8 15.5-20.7c27.8-7.8 56.2-13.6 97.8-13.6 64.9 0 127.6 16.1 177 45.5 8.1 4.8 11.3 11 11.3 19.7-.1 10.8-8.5 19.5-19.4 19.5zm-26.9 65.6c-4.2 0-6.8-1.3-10.7-3.6-62.4-37.6-135-39.2-206.7-24.5-3.9 1-9 2.6-11.9 2.6-9.7 0-15.8-7.7-15.8-15.8 0-10.3 6.1-15.2 13.6-16.8 81.9-18.1 165.6-16.5 237 26.2 6.1 3.9 9.7 7.4 9.7 16.5s-7.1 15.4-15.2 15.4z" />
        </svg>
        <div class="tooltip" style="color: #04cb22;">Spotify </div>
    </div>
    <div class="youtube">
        <svg xmlns="http://www.w3.org/2000/svg" class="external-icon" viewBox="0 0 28.57 20" focusable="false" style="pointer-events: none; display: block; width: 80%; height: 100%;">
            <svg viewBox="0 0 28.57 20" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">
                <g>
                    <path d="M27.9727 3.12324C27.6435 1.89323 26.6768 0.926623 25.4468 0.597366C23.2197 2.24288e-07 14.285 0 14.285 0C14.285 0 5.35042 2.24288e-07 3.12323 0.597366C1.89323 0.926623 0.926623 1.89323 0.597366 3.12324C2.24288e-07 5.35042 0 10 0 10C0 10 2.24288e-07 14.6496 0.597366 16.8768C0.926623 18.1068 1.89323 19.0734 3.12323 19.4026C5.35042 20 14.285 20 14.285 20C14.285 20 23.2197 20 25.4468 19.4026C26.6768 19.0734 27.6435 18.1068 27.9727 16.8768C28.5701 14.6496 28.5701 10 28.5701 10C28.5701 10 28.5677 5.35042 27.9727 3.12324Z" fill="#FF0000"></path>
                    <path d="M11.4253 14.2854L18.8477 10.0004L11.4253 5.71533V14.2854Z" fill="white"></path>
                </g>
            </svg>
        </svg>
        <div class="tooltip" style="color: red;">Youtube</div>
    </div>
</div>
`;

const copyrightHTML = `
<div class="copyright">🔒 COPYRIGHT NOTICE
    All content in this podcast is copyrighted by Chinese Daily Podcast. Any form of copying, reproduction,
    redistribution, modification, or quotation without written permission is strictly prohibited.
</div>
`;

// Hàm để khởi tạo các thành phần giao diện
function initializeUI() {
    // Chèn HTML vào cuối thẻ body
    document.body.insertAdjacentHTML('beforeend', socialHTML);
    document.body.insertAdjacentHTML('beforeend', copyrightHTML);

    // Hiển thị lời chào
    const now = new Date();
    const hour = now.getHours();
    let greeting = "";

    if (hour >= 5 && hour < 12) {
        greeting = "Good morning!";
    } else if (hour >= 12 && hour < 17) {
        greeting = "Good afternoon!";
    } else if (hour >= 17 && hour < 21) {
        greeting = "Good evening!";
    } else {
        greeting = "Good night!";
    }
    // Đảm bảo thẻ có id="greeting" tồn tại trước khi gán giá trị
    const greetingElement = document.getElementById("greeting");
    if (greetingElement) {
        greetingElement.innerText = greeting;
    }

    // Thiết lập sự kiện và hiệu ứng cho các nút social
    const circles = document.querySelectorAll('.social div');
    let index = 0;

    function showTooltipSequentially() {
        if (circles.length === 0) return;
        const current = circles[index];
        current.classList.add('show-tooltip');
        setTimeout(() => {
            current.classList.remove('show-tooltip');
            index = (index + 1) % circles.length;
        }, 3000);
    }

    showTooltipSequentially();
    setInterval(showTooltipSequentially, 10000);

    document.querySelector('.youtube').addEventListener('click', function () {
        window.open('https://www.youtube.com/@ChineseDailyPodcast', '_blank');
    });

    document.querySelector('.coffe').addEventListener('click', function () {
        window.open('https://buymeacoffee.com/chinesedailypodcast', '_blank');
    });

    document.querySelector('.spotify-channel').addEventListener('click', function () {
        window.open('https://open.spotify.com/show/0hzr17Qx90pgV0PcfXOyrd', '_blank');
    });
}

// Chạy hàm khởi tạo giao diện khi toàn bộ nội dung trang đã sẵn sàng
document.addEventListener('DOMContentLoaded', initializeUI);


// --- Kết thúc file script.js ---