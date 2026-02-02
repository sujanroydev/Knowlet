const loginBtn = document.getElementById("login-btn");
const SignupBtn = document.getElementById("signup-btn");
const logoutBtn = document.getElementById("logout-btn");
// const comProfileBtn = document.getElementById("com-profile-btn");

const userName = document.getElementById("username");
const email = document.getElementById("email");
const userId = document.getElementById("userid");
const profilePic = document.getElementById("profile-pic");
const loader = document.getElementById("loader");

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
		console.log('fun called')
		const res = await fetch('https://knowlet.in/.netlify/functions/get-likes-ratings', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ userId: user.id })
		});
		
		if (!res.ok) {
			console.error('error code ' + res.status);
			return
		} 
		
		console.log('data fetched');
		const result = await res.json();
		console.log(result);
		const { data, error } = await res.json();
		console.log('json parsed');
		console.log(data)
		console.error(error)
		
	} catch(err) {
		console.error(err);
		alert(err.message);
	}
}

sync()