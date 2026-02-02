randerNavBar();

const navItems = document.querySelectorAll(".nav-item"); // Use querySelectorAll for better selection
const currentPagePath = window.location.href;
const profileBtn = document.getElementById("profile-btn");

const pathSegments = currentPagePath.split('/');
let currentPage = pathSegments[pathSegments.length - 1]; // Get the last part of the URL
currentPage = currentPage.split('.')[0] || 'index'; // Remove extension, default to 'index' if empty

const knowletUser = localStorage.getItem("knowletUser")

if (knowletUser) {
    profileBtn.src = JSON.parse(knowletUser).picture || "assets/images/demo_pp.jpg";
} else {
    profileBtn.src = "assets/images/demo_pp.jpg"
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

function randerNavBar() {
	document.getElementById('bottom-nav').innerHTML = `
        <a href="index" class="nav-item">
            <span class="icon">🏠</span>
            <span class="text">Home</span>
        </a>
        <a href="favourite" class="nav-item">
            <span class="icon">🌟</span>
            <span class="text">Favourite</span>
        </a>
        <a href="history" class="nav-item">
            <span class="icon">📜</span>
            <span class="text">History</span>
        </a>
        <a href="profile" class="nav-item">
            <span class="icon"><img id="profile-btn" src="/assets/images/demo_pp.jpg"></span>
            <span class="text">Profile</span>
        </a>
    `
}