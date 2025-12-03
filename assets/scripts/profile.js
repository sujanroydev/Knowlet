const loginSignupBtn = document.getElementById("login-signup-btn");
const logoutBtn = document.getElementById("logout-btn");
const comProfileBtn = document.getElementById("com-profile-btn");

const userName = document.getElementById("username");
const email = document.getElementById("email");

function sync() {
    
    const user = JSON.parse(localStorage.getItem("knowletUser"));
    console.log(user);
    
    if (user) {
        userName.textContent = user.name;
        email.textContent = '' + user.email;
        
        loginSignupBtn.style.display = "none";
        logoutBtn.style.display = "block";
        comProfileBtn.style.display = "block";
    } else {
        userName.textContent = "your Name";
        email.textContent = "yourname@example.com";
        
        loginSignupBtn.style.display = "block";
        logoutBtn.style.display = "none";
        comProfileBtn.style.display = "none";
    }
        
}

logoutBtn.addEventListener("click", () => {
    localStorage.clear();
    
    sync()
});

sync()