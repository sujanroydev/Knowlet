const loginBtn = document.getElementById("login-btn");
const SignupBtn = document.getElementById("signup-btn");
const logoutBtn = document.getElementById("logout-btn");
// const comProfileBtn = document.getElementById("com-profile-btn");

const userName = document.getElementById("username");
const email = document.getElementById("email");
const userId = document.getElementById("userid");
const profilePic = document.getElementById("profile-pic");
const loader = document.getElementById("loader");
const recentActivityView = document.getElementById("recent-activity-view");

const stat = document.getElementsByClassName("stat");

let isExist = false;
let user = localStorage.getItem("knowletUser");

profilePic.addEventListener("click", () => {
    if (isExist) {
        window.location.href = '/profile_complition_form';
    } else {
        window.location.href = '/login_signup';
    }
});

logoutBtn.addEventListener("click", () => {
    if (confirm("Logout?")) {
        logout();
    }
});

function logout() {
    localStorage.removeItem("knowletUser");

    user = null;
    isExist = false;
    stat[0].textContent = 0;
    stat[1].textContent = 0;

    try {
        document.getElementById("profile-btn").src = "assets/images/demo_pp.jpg";
    } catch(err) {
        console.error(err);
    }

    recentActivityView.innerHTML = `<p class="empty-message">You are Logged Out, Try to login again</p>`;

    userName.textContent = "Your Name";
    email.textContent = "yourname@example.com";
    userId.textContent = "User ID";
    profilePic.src = "assets/images/demo_pp.jpg";

    loginBtn.style.display = "inline-block";
    SignupBtn.style.display = "inline-block";
    logoutBtn.style.display = "none";
}

async function sync() {
    if (!user) {
        recentActivityView.innerHTML = `<p class="empty-message">You are not Logged In, Try to login or Signup and start exploring the unit pages!</p>`;
        return;
    }

    user = JSON.parse(user);
    fetchCommentsLikesAndRatings();

    try {
        loader.style.display = "flex";
        
        const res = await fetch(
            'https://knowlet.in/.netlify/functions/get-data',
            {
                method: 'POST',
                header: {'Content-Type': 'application/json'},
                body: JSON.stringify({ email: user.email, password: user.password })
            }
        );
        
        loader.style.display = "none";
        
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }
    
        const { data, error } = await res.json();
    
        if (!data && !error) {
            alert("Your account has been deleted");
        }
        
        if (!error && data) {
            user = data[0];
        }
        
        renderUserInfo();
    } catch(e) {
        console.error(e);
        renderUserInfo();
        loader.style.display = "none";
    }
}

function renderUserInfo() {
    if (!user) return;
    localStorage.setItem("knowletUser", JSON.stringify(user));

    userName.textContent = user.name;
    email.textContent = '' + user.email;
    userId.textContent = user.id;
    profilePic.src = user.picture || "assets/images/demo_pp.jpg";

    isExist = true;
    loginBtn.style.display = "none";
    SignupBtn.style.display = "none";
    logoutBtn.style.display = "block";
}

async function fetchCommentsLikesAndRatings() {
    try {
        const [res1, res2] = await Promise.all([
            fetch('https://knowlet.in/.netlify/functions/get-comments', {
                method: 'POST',
                header: {'Content-Type': 'application/json'},
                body: JSON.stringify({ userId: user.id })
            }),
            fetch('https://knowlet.in/.netlify/functions/get-likes-ratings', {
                method: 'POST',
                header: {'Content-Type': 'application/json'},
                body: JSON.stringify({ userId: user.id })
            })
        ]);
        
        if (!res1.ok || !res2.ok) {
            console.error(`Fetch failed: res1: ${res1.status}, res2: ${res2.status}`);
            return;
        }
        
        const [{ data: data1 }, { data: data2 }] = await Promise.all([
            res1.json(),
            res2.json()
        ]);
        
        renderRecentActivity(data1, data2);
        
        let commentsCount = 0;
        let totalCommentsLikes = 0;
        
        data1.forEach((comments) => {
            commentsCount += 1;
            totalCommentsLikes += comments.likes;
        });
        
        stat[0].textContent = totalCommentsLikes;
        stat[1].textContent = commentsCount;
        
    } catch(err) {
        console.error(err);
        recentActivityView.innerHTML = `<p class="empty-message">Failed to fetch recent activity</p>`;
    }
}

function renderRecentActivity(comments = [], likesAndRatings = []) {
    comments = comments.map(obj => {
        return {
            state: 'Commented',
            url: obj.page_id,
            timeMs: new Date(obj.created_at).getTime()
        };
    })
    
    likesAndRatings = likesAndRatings.map(obj => {
        return {
            state: obj.page_likes ? 'Liked' : obj.page_ratings ? 'Rated' : 'Faved',
            url: obj.page_id,
            timeMs: new Date(obj.created_at).getTime()
        };
    })

    const recentActivities = [...comments, ...likesAndRatings].sort((a, b) => b.timeMs - a.timeMs);
    
    let recentActivityItems = '';

    recentActivities.forEach((item) => {
        recentActivityItems += `
                <li>
                    ${item.state || 'Visited'} : <span class="example-title">${item.title || generateTitleFromURL(item.url)}</span> - ${item.timeMs ? timeAgo(item.timeMs) : 'Unknown'}<br>
                    <span class="example-heading">${item.heading ? item.heading : ''}</span> <a href="${item.url}">View</a>
                </li>
            `;
    });

    recentActivityView.innerHTML = recentActivityItems || `<p class="empty-message">No recent activity, visit notes, like, rate or comment </p>`;
}

// helper functions

function getSemester(courseNumber) {
    const num = parseInt(courseNumber)

    if (num >= 100 && num < 150) return "1st Semester"
    else if (num >= 150 && num < 200) return "2nd Semester"
    else if (num >= 200 && num < 250) return "3rd Semester"
    else if (num >= 250 && num < 300) return "4th Semester"
    else if (num >= 300 && num < 350) return "5th Semester"
    else if (num >= 350 && num < 400) return "6th Semester"
    else if (num >= 400 && num < 550) return "7th Semester"
    else if (num >= 550 && num < 600) return "8th Semester"
    else return "Any Semester"
}

function capitalize(word) {
    return word.charAt(0).toUpperCase() + word.slice(1)
}

function generateTitleFromURL(url) {

    if (!url) return `Unknown`;
    let parts = url.replace(".html", "").split("/").slice(3)

    let sem = parts[1].split("_").join(" ")
    sem = capitalize(sem)

    let sub = parts[2].split("_").map(capitalize).join(" ")

    let paper = parts[3].split("_").join(" ").toUpperCase()

    let unit = parts[4].split("_").join(" ")
    unit = capitalize(unit)

    let courseNumber = parts[3].split("_")[1]

    let semester = getSemester(courseNumber)

    return `${sub} ${paper} ${unit} | ${semester} Notes`
}

function timeAgo(unixMs) {
    const now = Date.now()
    const diffMs = now - unixMs

    const seconds = Math.floor(diffMs / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)

    if (seconds < 60) return `${seconds} seconds ago`
    if (minutes < 60) return `${minutes} minutes ago`
    if (hours < 24) return `${hours} hours ago`
    return `${days} days ago`
}

sync();