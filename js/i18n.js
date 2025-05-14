// i18n.js

// Get preferred language from local storage, default to 'vi'
let currentLanguage = localStorage.getItem('language') || 'vi';
// Store the loaded translations
const translations = {}; // Use an object to store loaded language data

// Function to load language file
async function loadLanguage(lang) {
    try {
        // Construct the path to the language file
        // Assuming JSON files are in the same directory as this script.
        // If they are in a 'lang' subdirectory, change this path to `lang/${lang}.json`
        const response = await fetch(`lang/${lang}.json`);

        // Check if the response was not successful (e.g., file not found)
        if (!response.ok) {
            // Throw an error with a more informative message
            throw new Error(`Không thể tải tệp ngôn ngữ: ${lang}.json - ${response.status} ${response.statusText}`);
        }

        // Parse the JSON data
        const data = await response.json();
        translations[lang] = data; // Store the loaded data
        translatePage(data); // Apply translations to the page
        currentLanguage = lang; // Update current language only on successful load
        localStorage.setItem('language', lang); // Save preferred language only on successful load

    } catch (error) {
        console.error("Lỗi khi tải tệp ngôn ngữ:", error);
        // If loading the requested language failed, inform the user.
        // We intentionally do NOT automatically fallback to 'vi' here to prevent
        // potential infinite loops if 'vi.json' itself is also missing or corrupted.
        if (lang !== 'vi') {
            console.warn(`Không thể tải ngôn ngữ "${lang}". Nội dung trang có thể không được dịch hoặc hiển thị ngôn ngữ trước đó.`);
        } else {
             console.warn(`Không thể tải ngôn ngữ mặc định "vi". Nội dung trang có thể không được dịch.`);
        }
         // Note: If loading fails, currentLanguage and localStorage are NOT updated,
         // preserving the last successful language or the initial default.
    }
}

// Function to apply translations to elements with data-i18n attributes
function translatePage(translations) {
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(element => {
        const key = element.getAttribute('data-i18n');

        // Check if translation exists for the key and is not explicitly undefined
        if (translations && translations[key] !== undefined) {
            const translation = translations[key];

            // Check if the element contains child nodes that are HTML elements
            // This helps identify parent elements of lists or complex structures (like <h2> with nested <ul>)
            const hasElementChild = Array.from(element.childNodes).some(node => node.nodeType === Node.ELEMENT_NODE);

            if (hasElementChild) {
                // If the element has child elements, iterate through its child nodes
                // and update only the text nodes that are not just whitespace.
                // This prevents overwriting nested HTML structure (like <ul> within <li>)
                Array.from(element.childNodes).forEach(node => {
                    // Check if it's a Text Node and contains non-whitespace characters
                    if (node.nodeType === Node.TEXT_NODE && node.textContent.trim().length > 0) {
                        let originalText = node.nodeValue;
                        let newText = translation;

                        // Optional: Attempt to preserve trailing colons if they were in the original text
                        // This is a specific formatting handling based on the provided HTML structure.
                        const trimmedOriginal = originalText.trim();
                        const endsWithColon = trimmedOriginal.endsWith(':');
                        const endsWithFullwidthColon = trimmedOriginal.endsWith('：');

                        if ((endsWithColon || endsWithFullwidthColon) && !newText.trim().endsWith(':') && !newText.trim().endsWith('：')) {
                             newText += endsWithColon ? ':' : '：';
                             // Preserve trailing whitespace after the colon if it existed
                             if (originalText.endsWith(' ')) {
                                 newText += ' ';
                             }
                        }

                        // Update the text node's value
                        node.nodeValue = newText;
                    }
                     // Note: This logic assumes the text to be translated is directly
                     // within the parent element as a text node, not nested deeply.
                     // For more complex structures, a different approach or simpler HTML
                     // might be more robust.
                });

            } else {
                // If the element does not contain child elements (it's a leaf node
                // or only contains text/HTML entities), use innerHTML.
                // This allows rendering HTML entities like &copy; correctly.
                element.innerHTML = translation;
            }
        } else {
            // Optional: Log a warning for translation keys not found
            console.warn(`Thiếu bản dịch cho khóa: "${key}" trong tệp ngôn ngữ "${currentLanguage}".`);
        }
    });
}

// Function called by language selection buttons
function changeLanguage(lang) {
    // loadLanguage handles fetching the file, applying translations,
    // and updating currentLanguage and localStorage on success.
    loadLanguage(lang);
}

// Load the preferred language when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    loadLanguage(currentLanguage);
});