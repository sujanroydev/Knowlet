/*
 * Revised JavaScript logic to use a class name for focus,
 * ensuring only one item is active at a time.
 */

const navItems = document.querySelectorAll(".nav-item"); // Use querySelectorAll for better selection
const currentPagePath = window.location.href;
const profileBtn = document.getElementById("profile-btn");

// Extract the base filename (e.g., "index", "favourites_page", "profile")
// It handles cases like 'http://example.com/index.html' or 'http://example.com/profile'
const pathSegments = currentPagePath.split('/');
let currentPage = pathSegments[pathSegments.length - 1]; // Get the last part of the URL
currentPage = currentPage.split('.')[0] || 'index'; // Remove extension, default to 'index' if empty
profileBtn.src = JSON.parse(localStorage.getItem("knowletUser")).picture || "assets/images/demo_pp.png";

// Map the filename to the correct index, or just use a loop for a more robust solution
navItems.forEach((item, index) => {
    // Check if the item's href contains the currentPage identifier
    if (item.getAttribute('href').includes(currentPage)) {
        focusNav(item);
    }
});


/**
 * Applies the 'active-nav-item' class to the given navigation item.
 * It also removes the class from all other nav items to ensure exclusivity.
 * @param {HTMLElement} item - The navigation item element to focus.
 */
function focusNav (item) {
    // 1. Remove the active class from all items first
    navItems.forEach(nav => {
        nav.classList.remove('active-nav-item');
    });

    // 2. Add the active class to the currently focused item
    item.classList.add('active-nav-item');
}

