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

// Hàm khởi tạo giao diện sẽ được gọi ở cuối file


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
        // Bỏ qua các thẻ style/link liên quan đến AdSense
        if (el.outerHTML.includes('adsbygoogle') || el.outerHTML.includes('googlesyndication')) continue;
        styles += el.outerHTML;
    });

    // 2. Clone nội dung để lọc quảng cáo mà không ảnh hưởng trang gốc
    const postContainer = document.querySelector('.post-body') || document.body;
    const clonedContent = postContainer.cloneNode(true);

    // 3. Xóa tất cả các phần tử quảng cáo Google AdSense khỏi bản clone
    const adSelectors = [
        'ins.adsbygoogle',           // Khối quảng cáo chính của AdSense
        '[id^="google_ads"]',        // Các container quảng cáo Google
        '[id^="aswift_"]',           // Iframe quảng cáo Google
        '.adsbygoogle',              // Class quảng cáo AdSense
        'iframe[src*="googlesyndication"]',  // Iframe từ Google syndication
        'iframe[src*="doubleclick"]',        // Iframe từ DoubleClick
        'script[src*="adsbygoogle"]',        // Script AdSense
        'script[src*="googlesyndication"]',  // Script Google syndication
        '.ads',                      // Class ads chung
        '#ads',                      // ID ads chung
        '[data-ad-slot]',            // Phần tử có thuộc tính ad-slot
        '[data-ad-client]',          // Phần tử có thuộc tính ad-client
    ];

    adSelectors.forEach(selector => {
        clonedContent.querySelectorAll(selector).forEach(el => el.remove());
    });

    const bodyContent = clonedContent.innerHTML;

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
                    .no-print, .video-container, #audio, .a2a_floating_style, .jdp-print-btn, .toc, #donate, #engage, #explain, #quiz {
                        display: none !important;
                    }

                    /* Ẩn quảng cáo Google AdSense (CSS fallback đề phòng) */
                    ins.adsbygoogle, .adsbygoogle, [id^="google_ads"], [id^="aswift_"],
                    iframe[src*="googlesyndication"], iframe[src*="doubleclick"],
                    [data-ad-slot], [data-ad-client], .ads, #ads {
                        display: none !important;
                        height: 0 !important;
                        max-height: 0 !important;
                        overflow: hidden !important;
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

// ==========================================================
// Phần 5: Nút Mục lục nổi (Floating TOC)
// ==========================================================
function createFloatingTOC() {
    const originalToc = document.querySelector('ul.toc');
    if (!originalToc) return;

    const container = document.createElement('div');
    container.className = 'floating-toc-container no-print';
    
    const btn = document.createElement('button');
    btn.className = 'floating-toc-btn';
    btn.innerHTML = '📑';
    btn.title = 'Table of Contents';
    
    const panel = document.createElement('div');
    panel.className = 'floating-toc-panel';
    
    const panelTitle = document.createElement('h3');
    panelTitle.innerText = '📌 目録 / TOC';
    panel.appendChild(panelTitle);
    
    const clonedToc = originalToc.cloneNode(true);
    panel.appendChild(clonedToc);
    
    container.appendChild(btn);
    container.appendChild(panel);
    document.body.appendChild(container);
    
    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        panel.classList.toggle('active');
    });
    
    document.addEventListener('click', (e) => {
        if (!container.contains(e.target)) {
            panel.classList.remove('active');
        }
    });
    
    clonedToc.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            panel.classList.remove('active');
        });
    });
}

// ==========================================================
// Phần 6: Auto-migrate bài post cũ
// ==========================================================
function migrateOldTranscripts() {
    const detailsElements = document.querySelectorAll('details');
    detailsElements.forEach(detail => {
        const content = detail.querySelector('.transcript-content');
        if (content) {
            const section = document.createElement('section');
            section.className = 'transcript';
            
            const summary = detail.querySelector('summary');
            if (summary) {
                const h2 = summary.querySelector('h2');
                if (h2) {
                    // Xóa dòng chữ (Click to expand/collapse) nếu có
                    h2.innerHTML = h2.innerHTML.replace(/\(Click to expand\/collapse\)/gi, '').trim();
                    section.appendChild(h2);
                }
            }
            
            section.appendChild(content);
            detail.parentNode.replaceChild(section, detail);
        }
    });
}

// Khởi chạy khi DOM đã load xong (Bảo vệ chống chạy 2 lần nếu bài cũ có chèn sẵn link script)
if (!window.dailyPodcastDOMInitialized) {
    window.dailyPodcastDOMInitialized = true;
    document.addEventListener('DOMContentLoaded', () => {
        if (typeof initializeUI === 'function') initializeUI();
        migrateOldTranscripts();
        injectPrintButtons();
        formatSpeakers();
        createFloatingTOC();
    });
}

// --- Kết thúc file script.js ---