/**
 * SCRIPT DỌN DẸP THẺ <script> CŨ TRÊN BLOGGER (Bản dùng UrlFetchApp)
 * =======================================================
 * HƯỚNG DẪN CẤP QUYỀN BLOGGER API TỪ GOOGLE CLOUD:
 * Do Google mới nâng cấp bảo mật, bạn cần làm thêm 3 bước để chạy script:
 * 
 * BƯỚC 1: TẠO DỰ ÁN CLOUD
 * 1. Vào https://console.cloud.google.com/projectcreate
 * 2. Điền tên dự án (VD: Blogger Cleaner) -> Bấm "Create". Đợi vài giây rồi "Select Project".
 * 3. Vào link này để bật API: https://console.cloud.google.com/apis/library/blogger.googleapis.com
 * 4. Bấm "Enable" (Bật).
 * 
 * BƯỚC 2: LẤY MÃ SỐ DỰ ÁN
 * 1. Vẫn ở trang Google Cloud, bấm menu 3 gạch (góc trái) -> "IAM & Admin" -> "Settings".
 * 2. Copy dãy số ở mục "Project number" (Mã số dự án).
 * 
 * BƯỚC 3: GẮN VÀO APPS SCRIPT
 * 1. Ở trang Code Apps Script này, bấm Cài đặt dự án (bánh răng ⚙️ bên trái).
 * 2. Tích vào ô "Hiển thị tệp kê khai "appsscript.json"".
 * 3. Cuộn xuống phần "Google Cloud Platform (GCP) Project", bấm "Change project".
 * 4. Dán dãy số Project number vào -> Bấm "Set project".
 * 5. Quay lại Trình chỉnh sửa (< >). Mở file appsscript.json, thêm 2 dòng này vào "oauthScopes":
 *    "https://www.googleapis.com/auth/script.external_request",
 *    "https://www.googleapis.com/auth/blogger"
 * 6. Lưu file (Ctrl+S). Mở lại file Code.gs này và ấn Run!
 */

const BLOG_ID = '5300627282106002196'; // id blog của kênh tiếng trung

// CỜ CHẠY THỬ
const DRY_RUN = true;

function cleanOldScriptTags() {
  Logger.log(`Bắt đầu quét blog: ${BLOG_ID}`);
  Logger.log(`Chế độ DRY_RUN (Chạy thử): ${DRY_RUN ? 'BẬT (Chỉ quét, không lưu)' : 'TẮT (Sẽ xóa và lưu)'}\n`);

  let pageToken = '';
  let totalProcessed = 0;
  let totalFixed = 0;

  // Biểu thức chính quy (Regex) để tìm các thẻ script cứng
  const regexYouTube = /<script[^>]*src=['"][^'"]*iframe_api['"][^>]*>(?:<\/script>|\/>)\s*/gi;
  const regexCustomJS = /<script[^>]*src=['"][^'"]*script\.js['"][^>]*>(?:<\/script>|\/>)\s*/gi;

  // Lấy Token xác thực để gọi API
  const token = ScriptApp.getOAuthToken();

  do {
    // URL lấy danh sách bài viết
    let url = `https://www.googleapis.com/blogger/v3/blogs/${BLOG_ID}/posts?maxResults=50&fetchBodies=true`;
    if (pageToken) {
      url += `&pageToken=${pageToken}`;
    }

    let response;
    try {
      response = UrlFetchApp.fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`
        },
        muteHttpExceptions: true
      });
    } catch (e) {
      Logger.log(`[LỖI MẠNG] Không thể kết nối. Chi tiết: ${e.message}`);
      return;
    }

    if (response.getResponseCode() !== 200) {
      Logger.log(`[LỖI API] Có lỗi xảy ra: ${response.getContentText()}`);
      return;
    }

    const data = JSON.parse(response.getContentText());
    const posts = data.items;

    if (posts && posts.length > 0) {
      for (let i = 0; i < posts.length; i++) {
        const post = posts[i];
        let content = post.content;

        if (!content) continue;

        const hasYouTubeScript = regexYouTube.test(content);
        const hasCustomScript = regexCustomJS.test(content);

        if (hasYouTubeScript || hasCustomScript) {
          totalFixed++;

          if (DRY_RUN) {
            Logger.log(`[CẦN XÓA] Bài viết: "${post.title}"`);
            if (hasYouTubeScript) Logger.log(`  -> Phát hiện thẻ YouTube iframe_api`);
            if (hasCustomScript) Logger.log(`  -> Phát hiện thẻ custom script.js`);
          } else {
            Logger.log(`[ĐANG XÓA & LƯU] Bài viết: "${post.title}"`);

            let newContent = content;
            newContent = newContent.replace(regexYouTube, '');
            newContent = newContent.replace(regexCustomJS, '');

            const updateUrl = `https://www.googleapis.com/blogger/v3/blogs/${BLOG_ID}/posts/${post.id}`;
            const updatePayload = {
              title: post.title,
              content: newContent
            };

            try {
              const patchResponse = UrlFetchApp.fetch(updateUrl, {
                method: 'patch',
                contentType: 'application/json',
                headers: {
                  Authorization: `Bearer ${token}`
                },
                payload: JSON.stringify(updatePayload),
                muteHttpExceptions: true
              });

              if (patchResponse.getResponseCode() !== 200) {
                Logger.log(`  -> [LỖI LƯU BÀI] ${patchResponse.getContentText()}`);
              }
            } catch (e) {
              Logger.log(`  -> [LỖI API LƯU] ${e.message}`);
            }
          }
        }
        totalProcessed++;
      }
    }

    pageToken = data.nextPageToken;

  } while (pageToken);

  Logger.log(`\n=== TỔNG KẾT QUÁ TRÌNH ===`);
  Logger.log(`- Đã quét qua tổng cộng: ${totalProcessed} bài viết.`);
  Logger.log(`- Số bài viết phát hiện bị dính thẻ script cũ: ${totalFixed} bài viết.`);

  if (DRY_RUN) {
    Logger.log(`\n=> KẾT LUẬN: Đang ở chế độ DRY_RUN nên chưa có bài viết nào bị chỉnh sửa.`);
    Logger.log(`=> HÀNH ĐỘNG TIẾP THEO: Nếu danh sách đúng, hãy sửa DRY_RUN = false ở dòng 20 và bấm Run lại để thực sự xóa!`);
  } else {
    Logger.log(`\n=> KẾT LUẬN: Đã tự động XÓA THÀNH CÔNG các thẻ script cũ trên toàn bộ ${totalFixed} bài viết!`);
  }
}
