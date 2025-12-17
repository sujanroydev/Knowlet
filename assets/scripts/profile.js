const loginBtn = document.getElementById("login-btn");
const SignupBtn = document.getElementById("signup-btn");
const logoutBtn = document.getElementById("logout-btn");
const comProfileBtn = document.getElementById("com-profile-btn");

const userName = document.getElementById("username");
const email = document.getElementById("email");
const userId = document.getElementById("userid");
const profilePic = document.getElementById("profile-pic");

let isExist = false;

function sync() {
    
    const user = JSON.parse(localStorage.getItem("knowletUser"));
    console.log(user);
    
    if (user) {
        userName.textContent = user.name;
        email.textContent = '' + user.email;
        userId.textContent = user.id;
        profilePic.src = user.picture || "assets/demo_pp.png";
        
        isExist = true;
        loginBtn.style.display = "none";
        SignupBtn.style.display = "none";
        logoutBtn.style.display = "block";
        comProfileBtn.style.display = "block";
    } else {
        userName.textContent = "Your Name";
        email.textContent = "yourname@example.com";
        userId.textContent = "User ID"
        profilePic.src = "assets/demo_pp.png"
        
        isExist = false;
        loginBtn.style.display = "inline-block";
        SignupBtn.style.display = "inline-block";
        logoutBtn.style.display = "none";
        comProfileBtn.style.display = "none";
    }
        
}

function fullProfile() {
    if (isExist) {
        window.location.href='profile_complition_form.html'
    } else {
        window.location.href='login_signup.html'
    }
}

logoutBtn.addEventListener("click", () => {
    alert("Logout");
    localStorage.removeItem("knowletUser");
    sync()
});

sync()