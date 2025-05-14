let currentLanguage = localStorage.getItem('language') || 'vi'; // Ngôn ngữ mặc định

async function loadLanguage(lang) {
    try {
        const response = await fetch(`lang/${lang}.json`);
        // Kiểm tra nếu phản hồi không thành công (ví dụ: file không tồn tại)
        if (!response.ok) {
            throw new Error(`Không thể tải tệp ngôn ngữ: ${response.statusText}`);
        }
        const data = await response.json();
        translatePage(data);
        currentLanguage = lang; // Cập nhật ngôn ngữ hiện tại chỉ khi tải thành công
        localStorage.setItem('language', lang); // Lưu ngôn ngữ hiện tại chỉ khi tải thành công
    } catch (error) {
        console.error("Lỗi khi tải tệp ngôn ngữ:", error);
        // Tùy chọn: tải lại ngôn ngữ mặc định nếu ngôn ngữ yêu cầu bị lỗi
        if (lang !== 'vi') { // Tránh lặp vô hạn nếu vi.json cũng lỗi
             console.warn(`Không thể tải ngôn ngữ "${lang}", quay về tiếng Việt.`);
             // Không gọi loadLanguage('vi') ở đây để tránh vòng lặp nếu vi.json lỗi
             // Thay vào đó, có thể hiển thị thông báo lỗi cho người dùng.
        }
    }
}

function translatePage(translations) {
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (translations && translations[key] !== undefined) { // Kiểm tra rõ ràng undefined
            const translation = translations[key];

            // Kiểm tra xem thẻ có chứa thẻ con dạng Element (như <ul>, <li>, <span>...) hay không
            const hasElementChild = Array.from(element.childNodes).some(node => node.nodeType === Node.ELEMENT_NODE);

            if (hasElementChild) {
                // Nếu có thẻ con dạng Element, chỉ cập nhật các text node trực tiếp bên trong thẻ
                // (Đây là trường hợp cho các thẻ cha của danh sách lồng nhau)
                // Chúng ta cố gắng chỉ cập nhật phần text mà không ảnh hưởng đến các thẻ con
                Array.from(element.childNodes).forEach(node => {
                     // Kiểm tra là Text Node và không phải chỉ chứa toàn khoảng trắng
                    if (node.nodeType === Node.TEXT_NODE && node.textContent.trim().length > 0) {
                         // Cập nhật giá trị của Text Node với bản dịch
                         // Có thể cần thêm logic để giữ lại các ký tự như dấu hai chấm nếu bản dịch không có
                         // Ví dụ đơn giản:
                         let originalText = node.nodeValue;
                         let newText = translation;

                         // Nếu text gốc kết thúc bằng dấu hai chấm và bản dịch không có, thêm lại dấu hai chấm
                         if (originalText.trim().endsWith(':') && !newText.trim().endsWith(':') && !newText.trim().endsWith('：')) {
                              newText += ':';
                         } else if (originalText.trim().endsWith('：') && !newText.trim().endsWith(':') && !newText.trim().endsWith('：')) {
                              newText += '：';
                         }
                         // Có thể cần thêm logic để giữ lại khoảng trắng sau dấu hai chấm nếu cần
                         if (originalText.trim().endsWith(':') || originalText.trim().endsWith('：')) {
                             if (originalText.endsWith(' ')) newText += ' ';
                         }


                         node.nodeValue = newText;

                     }
                });

            } else {
                // Nếu không có thẻ con dạng Element (các thẻ lá hoặc chỉ chứa text/HTML entities),
                // sử dụng innerHTML để cho phép render các thực thể HTML như &copy;.
                element.innerHTML = translation;
            }
        } else {
             // Tùy chọn: Log ra các key không tìm thấy trong tệp ngôn ngữ
             console.warn(`Thiếu bản dịch cho khóa: ${key} trong tệp ${currentLanguage}.json`);
        }
    });
}

function changeLanguage(lang) {
    // Việc cập nhật currentLanguage và localStorage sẽ được thực hiện trong loadLanguage nếu tải thành công
    loadLanguage(lang);
}

// Tải ngôn ngữ mặc định khi trang tải xong
document.addEventListener('DOMContentLoaded', () => {
    loadLanguage(currentLanguage);
});