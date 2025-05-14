/**
 * Opens a specific tab and hides others.
 * @param {Event} evt - The event object from the tab click.
 * @param {string} tabName - The ID of the tab content to display.
 */
function openTab(evt, tabName) {
    // Declare variables
    var i, tabcontent, tablinks;

    // Get all elements with class="tab-pane" and hide them by default
    // Also remove 'active' class from tab content
    tabcontent = document.getElementsByClassName("tab-pane");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
        tabcontent[i].classList.remove("active");
    }

    // Get all elements with class="tab-link" and remove the class "active"
    tablinks = document.getElementsByClassName("tab-link");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].classList.remove("active");
    }

    // Show the current tab content, and add an "active" class to the button that opened the tab
    const currentTabContent = document.getElementById(tabName);
    if (currentTabContent) {
        currentTabContent.style.display = "block";
        currentTabContent.classList.add("active");
    }
    
    if (evt && evt.currentTarget) {
        evt.currentTarget.classList.add("active");
    }

    // Optional: If your i18n.js needs to re-apply translations on tab switch,
    // you might need to call your translation function here.
    // This depends heavily on how `i18n.js` and `loadLanguage` are implemented.
    // For example:
    // if (typeof window.loadLanguage === 'function' && typeof window.currentLanguage !== 'undefined') {
    //    window.loadLanguage(window.currentLanguage);
    // }
}

// Event listener for when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Automatically open the first tab or the tab marked as 'active' in HTML.
    const defaultActiveTabButton = document.querySelector(".tabs-nav button.active");
    
    if (defaultActiveTabButton) {
        // If a tab button is already marked active, simulate a click to ensure its content is shown
        // and all states are correctly set by the openTab function.
        defaultActiveTabButton.click(); 
    } else {
        // If no tab is marked active by default in HTML, activate the first tab button found.
        const firstTabButton = document.querySelector(".tabs-nav button.tab-link");
        if (firstTabButton) {
            firstTabButton.click(); // This will call openTab and set it up.
        }
    }
    
    // Initialize language settings.
    // This assumes `loadLanguage` function is globally available (e.g., from i18n.js)
    // and `currentLanguage` might be globally defined or managed by `loadLanguage`.
    if (typeof loadLanguage === 'function') {
        // Load Vietnamese by default, or use a stored preference if available.
        // Example: const userPreferredLanguage = localStorage.getItem('language') || 'vi';
        // loadLanguage(userPreferredLanguage);
        loadLanguage('vi'); 
    } else {
        console.warn('loadLanguage function is not defined. Language initialization skipped.');
    }

    // Placeholder for other initializations if needed
    // console.log("DOM fully loaded and parsed. Main script initialized.");
});

// Note: The changeLanguage function is expected to be in i18n.js or another global script.
// If it's not, and it's only used by the buttons, it might also be placed here,
// but typically language switching logic is part of the i18n setup.
// function changeLanguage(lang) {
//     console.log("Language change requested to:", lang);
//     if (typeof loadLanguage === 'function') {
//         loadLanguage(lang);
//         // Optionally, store the selected language:
//         // localStorage.setItem('language', lang);
//     } else {
//         console.error('loadLanguage function is not available for changeLanguage.');
//     }
// }
