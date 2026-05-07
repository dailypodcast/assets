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


const copyrightHTML = `
<div class="copyright">🔒 COPYRIGHT NOTICE
    All content in this podcast is copyrighted by Chinese Daily Podcast. Any form of copying, reproduction,
    redistribution, modification, or quotation without written permission is strictly prohibited.
</div>
`;

// Hàm để khởi tạo các thành phần giao diện
function initializeUI() {
    // Chèn HTML vào cuối thẻ body
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

}

// Chạy hàm khởi tạo giao diện khi toàn bộ nội dung trang đã sẵn sàng
document.addEventListener('DOMContentLoaded', initializeUI);


// ==========================================================
// Phần 3: Hỗ trợ in ấn (Tạo nút In chuyên biệt - Giải pháp 3)
// ==========================================================
function injectPrintButtons() {
    // Tìm thẻ section.transcript
    const transcriptSections = document.querySelectorAll('.transcript');

    transcriptSections.forEach((section) => {
        // Tìm thẻ <h2> bên trong section để chèn nút
        const header = section.querySelector('h2');
        if (header && !header.querySelector('.jdp-print-btn')) {
            const btn = document.createElement('button');
            btn.className = 'jdp-print-btn no-print';
            btn.innerHTML = '🖨️ Print Transcript';

            // Style nổi bật cho nút
            btn.style.marginLeft = '15px';
            btn.style.padding = '8px 16px';
            btn.style.cursor = 'pointer';
            btn.style.border = 'none';
            btn.style.borderRadius = '6px';
            btn.style.backgroundColor = '#ff9800'; // Màu cam nổi bật
            btn.style.color = '#ffffff';
            btn.style.fontWeight = 'bold';
            btn.style.boxShadow = '0 2px 4px rgba(0,0,0,0.15)';
            btn.style.transition = 'all 0.2s ease';

            // Hiệu ứng di chuột (hover)
            btn.onmouseover = () => {
                btn.style.backgroundColor = '#e68a00';
                btn.style.transform = 'translateY(-1px)';
                btn.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
            };
            btn.onmouseout = () => {
                btn.style.backgroundColor = '#ff9800';
                btn.style.transform = 'translateY(0)';
                btn.style.boxShadow = '0 2px 4px rgba(0,0,0,0.15)';
            };

            btn.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                printFullPage();
            };

            header.appendChild(btn);
        }
    });
}

function printFullPage() {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
        alert("Please allow popups in your browser to print!");
        return;
    }

    // 1. Lấy toàn bộ CSS của trang web hiện tại để giữ nguyên font chữ, màu sắc
    let styles = '';
    document.querySelectorAll('link[rel="stylesheet"], style').forEach(el => {
        styles += el.outerHTML;
    });

    // Ưu tiên lấy vùng post-body trên Blogger để tránh lỗi CSS dàn trang, nếu không có thì lấy toàn bộ body
    const postContainer = document.querySelector('.post-body') || document.body;
    const bodyContent = postContainer.innerHTML;

    printWindow.document.write(`
        <!DOCTYPE html>
        <html>
            <head>
                <title>Transcript Printout</title>
                ${styles}
                <style>
                    /* Reset cấu trúc layout của Blogger khi in để không bị cắt trang */
                    body, html { 
                        height: auto !important; 
                        overflow: visible !important; 
                        display: block !important; 
                    }
                    * {
                        float: none !important;
                        position: static !important;
                    }
                    
                    /* Ẩn các thành phần không cần thiết khi in */
                    .no-print, .video-container, #audio, .a2a_floating_style, .jdp-print-btn, .toc, #donate, #engage, #explain {
                        display: none !important;
                    }
                    
                    /* Mở rộng không gian in */
                    body {
                        padding: 20px !important;
                    }
                </style>
            </head>
            <body>
                ${bodyContent}
            </body>
        </html>
    `);
    printWindow.document.close();

    setTimeout(() => {
        printWindow.focus();
        printWindow.print();
        printWindow.close();
    }, 500);
}

// ==========================================================
// Phần 4: Tự động in đậm tên người nói trong đoạn hội thoại
// ==========================================================
function formatSpeakers() {
    // Tìm tất cả các đoạn văn trong phần transcript
    const paragraphs = document.querySelectorAll('.transcript-content p');
    
    paragraphs.forEach(p => {
        let html = p.innerHTML;
        // Regex: (khoảng trắng đầu dòng nếu có) + (1-30 ký tự không chứa ngoặc < > hoặc dấu hai chấm) + (dấu : hoặc ：)
        const regex = /^(\s*)([^:<：>]{1,30})([:：])/;
        if (regex.test(html)) {
            // Bao bọc phần tên và dấu hai chấm bằng thẻ <strong>
            p.innerHTML = html.replace(regex, '$1<strong>$2$3</strong>');
        }
    });
}

// Khởi chạy khi DOM đã load xong
document.addEventListener('DOMContentLoaded', () => {
    injectPrintButtons();
    formatSpeakers();
});

// --- Kết thúc file script.js ---