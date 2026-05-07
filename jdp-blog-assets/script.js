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
// Phần 2: Hỗ trợ in ấn (Print Support)
// ==========================================================
// Biến lưu trữ trạng thái của các thẻ details trước khi gọi lệnh in
let detailsStates = [];

// Bắt sự kiện trước khi trình duyệt hiển thị hộp thoại in
window.addEventListener('beforeprint', () => {
    const detailsElements = document.querySelectorAll('details');
    
    // Lưu lại trạng thái đóng/mở hiện tại của từng thẻ
    detailsStates = Array.from(detailsElements).map(details => details.open);
    
    // Tự động mở tất cả các thẻ details để in được toàn bộ nội dung (transcript)
    detailsElements.forEach(details => {
        details.open = true;
    });
});

// Bắt sự kiện sau khi người dùng đóng hộp thoại in (in xong hoặc hủy in)
window.addEventListener('afterprint', () => {
    const detailsElements = document.querySelectorAll('details');
    
    // Khôi phục lại trạng thái đóng/mở ban đầu cho các thẻ details
    detailsElements.forEach((details, index) => {
        details.open = detailsStates[index];
    });
});
