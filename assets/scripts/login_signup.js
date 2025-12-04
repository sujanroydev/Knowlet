const SUPABASE_URL = "https://ampwczxrfpbqlkuawrdf.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFtcHdjenhyZnBicWxrdWF3cmRmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI3OTk4MzYsImV4cCI6MjA3ODM3NTgzNn0.hFib9Y5x02b5VWjKuNi1XkUYvycmrp0DQhnwNkOGJEU";

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const show = document.getElementById("show-user-id");

let lastUserId = "firstname@1234"

input = document.getElementsByClassName("user-input");
loginBtn = document.getElementById("login-btn");
signupBtn = document.getElementById("signup-btn");

loginBtn.addEventListener("click", () => {
    userId = input[0].value;
    email = input[1].value;
    
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
    name = input[2].value;
    email = input[3].value;
    
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

function showSignup() {
    document.getElementById('loginBox').style.display = 'none';
    document.getElementById('signupBox').style.display = 'block';
}

function showLogin() {
    document.getElementById('signupBox').style.display = 'none';
    document.getElementById('loginBox').style.display = 'block';
}

function showUserId() {
    name = input[2].value;
    lastUserId = name.split(' ')[0] + "@" + parseInt(Math.random() * 9000 + 1000);
    show.textContent = "Your User ID: " + lastUserId;
}

async function login(name, email) {
    try {
        const { data, error } = await supabase
            .from("user")
            .select("*")
            .eq("id", userId)
            .eq("email", email);
        
        if (error) {
            console.log(error);
            alert(error);
        } else {
            if (!data[0]) {
                alert("No account found with your User Id and Email");
            } else {
                const user = JSON.stringify(data[0]);
                localStorage.setItem("knowletUser", user);
                alert("Successfully Loged In");
                redirect();

                //window.location.href = "profile.html";
            }
        }
        
    } catch(e) {
        console.log(e);
    }
}

async function signup(name, email) {
    user = {
        id: lastUserId,
        name: name,
        email: email
    }
    try {
        const { error } = await supabase
            .from("user")
            .insert(user);
        
        if (error) {
            console.log(error);
            alert(error);
        } else {
            localStorage.setItem("knowletUser", JSON.stringify(user));
            alert("Successfully Signed Up\n" + "User ID: " + lastUserId);
            redirect();
            
            //window.location.href = "profile.html";
        }
    } catch(e) {
        console.log(e);
    }
}

function redirect() {
    const history = JSON.parse(localStorage.getItem("unit_page_history") || '[]');
    
    if (history.length === 0) {
        window.location.href = "profile.html";
        return;
    } else {
        if (diffFromNow(history[0].timestamp) < 60) {
            window.location.href = history[0].url;
        } else {
            window.location.href = "profile.html";
        }
    }
}

function diffFromNow(time) {
    const target = new Date(time);
    const now = new Date();

    const diffMs = Math.abs(target - now);
    return Math.floor(diffMs / 1000); 
}

