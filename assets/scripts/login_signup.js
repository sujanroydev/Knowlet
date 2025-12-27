const SUPABASE_URL = "https://ampwczxrfpbqlkuawrdf.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFtcHdjenhyZnBicWxrdWF3cmRmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI3OTk4MzYsImV4cCI6MjA3ODM3NTgzNn0.hFib9Y5x02b5VWjKuNi1XkUYvycmrp0DQhnwNkOGJEU";

const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const input = document.getElementsByClassName("user-input");
const loginBtn = document.getElementById("login-btn");
const signupBtn = document.getElementById("signup-btn");
const googleSignupBtn = document.getElementById("google-signup-btn");
const googleLoginBtn = document.getElementById("google-login-btn");
const loginBox = document.getElementById('loginBox');
const signupBox = document.getElementById('signupBox');

const params = new URLSearchParams(window.location.search);

const popup = params.get("popup");

if (popup === "login") {
    showLogin();
} else if (popup === "signup") {
    showSignup();
}

loginBtn.addEventListener("click", () => {
    let userId = input[0].value;
    let email = input[1].value;
    let phone = input[2].value;
    
    if (!userId) {
        alert("Must enter User ID");
        return;
    }
    
    if (!email) {
        alert("Must enter Email");
        return;
    }
    
    login(userId, email);
});

signupBtn.addEventListener("click", () => {
    let name = input[3].value;
    let email = input[4].value;
    let phone = input[5].value;
    
    if (!name) {
        alert("Must enter Name");
        return;
    }
    
    if (!email) {
        alert("Must enter Email");
        return;
    }
    
    signup(name, email);
});

googleSignupBtn.addEventListener("click", async () => {
    const { error } = await supabaseClient.auth.signInWithOAuth({
        provider: "google",
        options: {
            redirectTo: window.location.origin + "/auth/callback.html"
        }
    });
    
    if (error) {
        alert("Signup error:", error.message);
    }
});

googleLoginBtn.addEventListener("click", async () => {
    const { error } = await supabaseClient.auth.signInWithOAuth({
        provider: "google",
        options: {
            redirectTo: window.location.origin + "/auth/login-callback.html"
        }
    });
    
    if (error) {
        alert("Login error:", error.message);
    }
});

function showSignup() {
    loginBox.style.display = 'none';
    signupBox.style.display = 'block';
}

function showLogin() {
    loginBox.style.display = 'block';
    signupBox.style.display = 'none';
}

async function login(userId, email) {
    try {
        // new
        const res = await fetch(
            'https://knowlet.in/.netlify/functions/get-data',
            {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ id: userId, email: email })
            }
        );
        
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }

        const result = await res.json();

        if (!result.success) {
            throw new Error(result.error || "Unknown error occurred");
        }
        const data = result.data;
        
        console.log("Data received:", data);
        
        if (!data[0]) {
            alert("No account found with your User Id and Email");
        } else {
            const user = JSON.stringify(data[0]);
            localStorage.setItem("knowletUser", user);
            alert("Successfully Loged In");
            redirect();

            //window.location.href = "profile";
        }
        
    } catch(e) {
        console.log(e);
    }
}

async function signup(name, email) {
    
    let userId = name.split(' ')[0] + "@" + parseInt(Math.random() * 9000 + 1000);
    
    let user = {
        id: userId,
        name: name,
        email: email
    }
    try {
        // new
        const res = await fetch(
            'https://knowlet.in/.netlify/functions/set-data',
            {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(user)
            }
        );
        
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }

        const result = await res.json();

        if (!result.success) {
            throw new Error(result.error || "Unknown error occurred");
        }

        localStorage.setItem("knowletUser", JSON.stringify(user));
        alert("Successfully Signed Up\n" + "Note your user ID: " + userId);
        redirect();
        
    } catch(e) {
        console.log(e);
    }
}

function redirect() {
    const history = JSON.parse(localStorage.getItem("unit_page_history") || '[]');
    
    if (history.length === 0) {
        window.location.href = "profile";
        return;
    } else {
        if (diffFromNow(history[0].timestamp) < 60) {
            window.location.href = history[0].url;
        } else {
            window.location.href = "profile";
        }
    }
}

function diffFromNow(time) {
    const target = new Date(time);
    const now = new Date();

    const diffMs = Math.abs(target - now);
    return Math.floor(diffMs / 1000); 
}

