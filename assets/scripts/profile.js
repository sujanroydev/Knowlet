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
    fetchActivity();

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

async function fetchActivity() {
    try {
        const [res1, res2] = await Promise.all([
            fetch('https://knowlet.in/.netlify/functions/get-comments', {
                method: 'POST',
                header: {'Content-Type': 'application/json'},
                body: JSON.stringify({ userId: user.id })
            }),
            fetch('https://knowlet.in/.netlify/functions/get-interactions', {
                method: 'POST',
                header: {'Content-Type': 'application/json'},
                body: JSON.stringify({ user_id: user.id })
            })
        ]);
        
        if (!res1.ok || !res2.ok) {
            console.error(`Fetch failed: res1: ${res1.status}, res2: ${res2.status}`);
            return;
        }
        
        const [{ data: comments }, { data: interactions }] = await Promise.all([
            res1.json(),
            res2.json()
        ]);
        
        renderRecentActivity(comments, interactions);
        renderStats(comments, interactions);
    } catch(err) {
        console.error(err);
        recentActivityView.innerHTML = `<p class="empty-message">Failed to fetch recent activity</p>`;
    }
}

function renderRecentActivity(comments = [], interactions = []) {
    comments = comments.map(c => {
        return {
            state: 'Commented',
            url: c.page_id,
            timeMs: new Date(c.created_at).getTime()
        };
    });

    let likes = [];
    let ratings = [];
    let favs = [];

    interactions.forEach((i) => {
        if (i.is_liked) {
            likes.push({
                state: 'Liked',
                url: i.page_id,
                timeMs: new Date(i.interactions_time.liked_at).getTime()
            })
        }
        if (i.ratings_score) {
            ratings.push({
                state: 'Rated',
                url: i.page_id,
                timeMs: new Date(i.interactions_time.rated_at).getTime()
            })
        }
        if (i.is_faved) {
            favs.push({
                state: 'Faved',
                url: i.page_id,
                timeMs: new Date(i.interactions_time.faved_at).getTime()
            })
        }
    });

    const recentActivities = [...comments, ...likes, ...ratings, ...favs].sort((a, b) => b.timeMs - a.timeMs);
    
    let recentActivityItems = '';

    recentActivities.forEach((item) => {
        recentActivityItems += item.state ? `
                <li>
                    ${item.state || 'Visited'} : <span class="example-title">${item.title || generateTitleFromURL(item.url)}</span> - ${item.timeMs ? timeAgo(item.timeMs) : 'Unknown'}<br>
                    <span class="example-heading">${item.heading ? item.heading : ''}</span> <a href="${item.url}">View</a>
                </li>
            ` : '' ;
    });

    recentActivityView.innerHTML = recentActivityItems || `<p class="empty-message">No recent activity, visit notes, like, rate or comment </p>`;
}

function renderStats(comments = [], interactions = []) {

    const totalComments = comments.length;
    const totalLikes = interactions.filter(i => i.is_liked).length;
    const totalRatings = interactions.filter(i => i.ratings_score).length;
    const totalFavs = interactions.filter(i => i.is_faved).length;

    const totalInteractions = totalComments + totalLikes + totalRatings + totalFavs;

    // Update UI
    document.getElementById("stat-comments").textContent = totalComments;
    document.getElementById("stat-likes").textContent = totalLikes;
    document.getElementById("stat-ratings").textContent = totalRatings;
    document.getElementById("stat-favs").textContent = totalFavs;

    // 🔥 STREAK
    const timestamps = [];

    comments.forEach(c => timestamps.push(new Date(c.created_at).getTime()));

    interactions.forEach(i => {
        if (i.is_liked) timestamps.push(new Date(i.interactions_time.liked_at).getTime());
        if (i.ratings_score) timestamps.push(new Date(i.interactions_time.rated_at).getTime());
        if (i.is_faved) timestamps.push(new Date(i.interactions_time.faved_at).getTime());
    });

    const streak = calculateStreak(timestamps);
    document.getElementById("streak-text").textContent =
        streak > 0 ? `🔥 ${streak} Day Streak` : "Start your learning streak today!";

    // 🏆 LEVEL
    const { level, nextTarget } = getLevel(totalInteractions);

    document.getElementById("level-text").textContent = `Level: ${level}`;

    if (nextTarget) {
        document.getElementById("next-level-text").textContent =
            `${nextTarget - totalInteractions} interactions to next level`;
    } else {
        document.getElementById("next-level-text").textContent =
            "You reached the highest level!";
    }

    // 📊 PROFILE COMPLETION
    let score = 0;

    if (user.name) score += 25;
    if (user.picture && !user.picture.includes("demo_pp")) score += 25;
    if (user.bio) score += 25;
    if (totalInteractions > 0) score += 25;

    document.getElementById("completion-fill").style.width = score + "%";
    document.getElementById("completion-text").textContent =
        `Profile Completion: ${score}%`;
}

function calculateStreak(timestamps) {

    if (!timestamps.length) return 0;

    const days = [...new Set(
        timestamps.map(t => new Date(t).toDateString())
    )].sort((a, b) => new Date(b) - new Date(a));

    let streak = 0;
    let today = new Date().toDateString();

    for (let i = 0; i < days.length; i++) {
        if (days[i] === today) {
            streak++;
            today = new Date(Date.now() - 86400000 * (i + 1)).toDateString();
        } else {
            break;
        }
    }

    return streak;
}

function getLevel(total) {

    if (total < 10) return { level: "Beginner Explorer", nextTarget: 10 };
    if (total < 40) return { level: "Active Learner", nextTarget: 40 };
    if (total < 100) return { level: "Knowledge Contributor", nextTarget: 100 };

    return { level: "Master Explorer", nextTarget: null };
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

    return `${sub} ${paper} ${unit} | ${semester} ${parts[0]}`
}

function timeAgo(unixMs) {
    const now = Date.now()
    const diffMs = now - unixMs

    const seconds = Math.floor(diffMs / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)

    if (seconds < 60) return `${seconds}s ago`;
    if (minutes < 60) return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
    if (hours < 24) return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
    return `${days} ${days === 1 ? 'day' : 'days'} ago`;
}

sync();