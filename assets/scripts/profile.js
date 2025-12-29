const SUPABASE_URL = "https://ampwczxrfpbqlkuawrdf.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFtcHdjenhyZnBicWxrdWF3cmRmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI3OTk4MzYsImV4cCI6MjA3ODM3NTgzNn0.hFib9Y5x02b5VWjKuNi1XkUYvycmrp0DQhnwNkOGJEU";

const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const loginBtn = document.getElementById("login-btn");
const SignupBtn = document.getElementById("signup-btn");
const logoutBtn = document.getElementById("logout-btn");
// const comProfileBtn = document.getElementById("com-profile-btn");

const userName = document.getElementById("username");
const email = document.getElementById("email");
const userId = document.getElementById("userid");
const profilePic = document.getElementById("profile-pic");

let isExist = false;

profilePic.addEventListener("click", () => {
    if (isExist) {
        window.location.href='profile_complition_form.html'
    } else {
        window.location.href='login_signup.html'
    }
});

logoutBtn.addEventListener("click", () => {
    alert("Logout");
    localStorage.removeItem("knowletUser");
    sync()
});

function sync() {
    
    const user = JSON.parse(localStorage.getItem("knowletUser"));
    // console.log(user);
    
    if (user) {
        userName.textContent = user.name;
        email.textContent = '' + user.email;
        userId.textContent = user.id;
        profilePic.src = user.picture || "assets/images/demo_pp.png";
        
        isExist = true;
        loginBtn.style.display = "none";
        SignupBtn.style.display = "none";
        logoutBtn.style.display = "block";
        //comProfileBtn.style.display = "block";
    } else {
        userName.textContent = "Your Name";
        email.textContent = "yourname@example.com";
        userId.textContent = "User ID"
        profilePic.src = "assets/images/demo_pp.png"
        
        isExist = false;
        loginBtn.style.display = "inline-block";
        SignupBtn.style.display = "inline-block";
        logoutBtn.style.display = "none";
        // comProfileBtn.style.display = "none";
    }
        
}

async function featchUser(userID, email) {
    const { data, error } = await supabaseClient
        .from("user")
        .select("*")
        .eq("id", userID)
        .eq("email", email);
    
    if (error) {
        alert(error.message);
        return;
    }
    
    if (!data) {
        alert("Your account has been deleted");
        return;
    }
    
    console.log(data);
    localStorage.setItem("knowletUser", JSON.stringify(data));
    sync();
    
}

sync()