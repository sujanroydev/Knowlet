const navItems = document.querySelectorAll(".nav-item"); // Use querySelectorAll for better selection
const currentPagePath = window.location.href;
const profileBtn = document.getElementById("profile-btn");

const pathSegments = currentPagePath.split('/');
let currentPage = pathSegments[pathSegments.length - 1]; // Get the last part of the URL
currentPage = currentPage.split('.')[0] || 'index'; // Remove extension, default to 'index' if empty
const user = localStorage.getItem("knowletUser")
if (user) {
    profileBtn.src = JSON.parse(user).picture || "assets/images/demo_pp.png";
} else {
    profileBtn.src = "assets/images/demo_pp.png"
}
navItems.forEach((item, index) => {
    if (item.getAttribute('href').includes(currentPage)) {
        focusNav(item);
    }
});

function focusNav (item) {
    navItems.forEach(nav => {
        nav.classList.remove('active-nav-item');
    });

    item.classList.add('active-nav-item');
}