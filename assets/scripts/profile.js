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
const recommendationView = document.getElementById("recommendation-view");

const stat = document.getElementsByClassName("stat");

let isExist = false;
let user;

profilePic.addEventListener("click", () => {
    if (isExist) {
        window.location.href='profile_complition_form.html'
    } else {
        window.location.href='login_signup.html'
    }
});

logoutBtn.addEventListener("click", () => {
    if (confirm("Logout?")) {
	    localStorage.removeItem("knowletUser");
	    document.getElementById("profile-btn").src = "assets/images/demo_pp.jpg";
	    sync();
    }
});

async function sync() {
    
    user = localStorage.getItem("knowletUser")
    
    if (user) {
        user = JSON.parse(user);
    } else {
        userName.textContent = "Your Name";
        email.textContent = "yourname@example.com";
        userId.textContent = "User ID"
        profilePic.src = "assets/images/demo_pp.jpg"
        
        isExist = false;
        loginBtn.style.display = "inline-block";
        SignupBtn.style.display = "inline-block";
        logoutBtn.style.display = "none";
        // comProfileBtn.style.display = "none";
        return;
    }
	try {
	    loader.style.display = "flex";
	    const oldData = user;
	    
	    const res = await fetch(
	        'https://knowlet.in/.netlify/functions/get-data',
	        {
	            method: 'POST',
	            headers: {'Content-Type': 'application/json'},
	            body: JSON.stringify({ email: user.email, password: user.password })
	        }
	    );
	    
	    loader.style.display = "none";
	    
	    if (!res.ok) {
	        throw new Error(`HTTP error! status: ${res.status}`);
	    }
	
	    const result = await res.json();
	
	    if (!result.success) {
	        throw new Error(result.error || "Unknown error occurred");
	    }
	    
	    const data = result.data;
	    const error = result.error;
	    
	    if (!data && !error) {
	        alert("Your account has been deleted");
	    }
	    
	    if (error || !data) {
	        user = oldData;
	    } else {
	        user = data[0];
	    }
	    
	    if (user) {
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
	} catch(e) {
		console.log(error);
		alert(error.message);
	}
}

async function fetchCommentsLikesAndRatings() {
	try {
		const res1 = await fetch('http://localhost:8888/.netlify/functions/get-comments', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ userId: user.id })
		});
		
		if (!res1.ok) {
			console.error('error code ' + res1.status);
			return
		} 
		
		const { data: data1, error: error1 } = await res1.json();
		
		let commentsCount = 0;
		let totalCommentsLikes = 0;
		
		data1.forEach((comments) => {
			commentsCount += 1;
			totalCommentsLikes += comments.likes;
		});
		
		stat[0].textContent = totalCommentsLikes;
		stat[1].textContent = commentsCount;
		
		const res2 = await fetch('http://localhost:8888/.netlify/functions/get-likes-ratings', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ userId: user.id })
		});
		
		if (!res2.ok) {
			console.error('error code ' + res2.status);
			return;
		} 
		
		const { data: data2, error: error2 } = await res2.json();
		
		recentActivity(data1, data2);
		
	} catch(err) {
		console.error(err);
		alert(err.message);
		recentActivity();
	}
}

function recentActivity(comments = [], likesAndRatings = []) {
	const favs = JSON.parse(localStorage.getItem('unit_page_favourites')).map(obj => {
		return {
			state: 'Started',
			url: obj.url,
			title: obj.title,
			heading: obj.heading,
			timeMs: new Date(obj.timestamp).getTime()  || 0
		};
	});

	const histories = JSON.parse(localStorage.getItem('unit_page_history')).reverse().map(obj => {
		return {
			state: 'Read',
			url: obj.url,
			title: obj.title,
			heading: obj.heading,
			timeMs: new Date(obj.timestamp).getTime()  || 0
		};
	});
	
	comments = comments.map(obj => {
		return {
			state: 'Commented',
			url: obj.page_id,
			timeMs: new Date(obj.created_at).getTime()
		};
	})
	
	likesAndRatings = likesAndRatings.map(obj => {
		return {
			state: obj.page_likes ? 'Liked' : obj.page_ratings ? 'Rated' : 'Removed',
			url: obj.page_id,
			timeMs: new Date(obj.created_at).getTime()
		};
	})

	const recentActivities = [...favs, ...histories, ...comments, ...likesAndRatings].sort((a, b) => b.timeMs - a.timeMs);
	
	let recentActivityItems = '';

	recentActivities.forEach((item) => {

		recentActivityItems += `
                <li>
                    ${item.state || 'Visited'} : <span class="example-title">${item.title || generateTitleFromURL(item.url)}</span> - ${item.timeMs ? timeAgo(item.timeMs) : 'Unknown'}<br>
                    <span class="example-heading">${item.heading ? item.heading : ''}</span> <a href="${item.url}">View</a>
                </li>
			`;
	});

	recentActivityView.innerHTML = recentActivityItems;
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

sync()
fetchCommentsLikesAndRatings()