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
// Phần 2: Hỗ trợ in ấn (Tạo nút In chuyên biệt - Giải pháp 3)
// ==========================================================
function injectPrintButtons() {
    // Tìm các khối chi tiết cần tạo nút In
    const transcriptContents = document.querySelectorAll('.transcript-content');
    
    transcriptContents.forEach((content) => {
        // Tìm thẻ <summary> ngay phía trên nó để chèn nút
        const summary = content.previousElementSibling;
        if (summary && summary.tagName.toLowerCase() === 'summary') {
            if (!summary.querySelector('.jdp-print-btn')) {
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
                
                summary.appendChild(btn);
            }
        }
    });
}

function printFullPage() {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
        alert("Vui lòng cho phép mở Popup trên trình duyệt để in!");
        return;
    }

    // 1. Không hardcode CSS. Lấy y nguyên toàn bộ CSS của trang hiện tại.
    let styles = '';
    document.querySelectorAll('link[rel="stylesheet"], style').forEach(el => {
        styles += el.outerHTML;
    });

    // 2. Không hardcode HTML. Lấy y nguyên toàn bộ nội dung thẻ body.
    const bodyContent = document.body.innerHTML;

    printWindow.document.write(`
        <!DOCTYPE html>
        <html>
            <head>
                <title>Bản in bài học</title>
                ${styles}
            </head>
            <body>
                ${bodyContent}
            </body>
        </html>
    `);
    printWindow.document.close();

    // 3. Tự động expand hết thông tin trong các thẻ details ra
    printWindow.document.querySelectorAll('details').forEach(detail => {
        detail.setAttribute('open', 'true');
    });

    // Đợi CSS/DOM load xong rồi gọi lệnh in
    setTimeout(() => {
        printWindow.focus();
        printWindow.print();
        printWindow.close();
    }, 500);
}

document.addEventListener('DOMContentLoaded', injectPrintButtons);
