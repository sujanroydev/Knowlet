const SUPABASE_URL = "https://ampwczxrfpbqlkuawrdf.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFtcHdjenhyZnBicWxrdWF3cmRmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI3OTk4MzYsImV4cCI6MjA3ODM3NTgzNn0.hFib9Y5x02b5VWjKuNi1XkUYvycmrp0DQhnwNkOGJEU";

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const show = document.getElementById("show-user-id");

let lastUserId = "firstname@1234"

input = document.getElementsByClassName("user-input");
loginBtn = document.getElementById("login-btn");
signupBtn = document.getElementById("signup-btn");

loginBtn.addEventListener("click", () => {
    //alert('login');
    
    userId = input[0].value;
    email = input[1].value;
    
    login(userId, email);
});

signupBtn.addEventListener("click", () => {
    alert('signup');
    
    name = input[2].value;
    email = input[3].value;
    
    
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
            .eq("id", userId);
            //.eq("email", email)
        
        if (error) console.log(error);
        
        if (!data[0]) {
            alert("No account found with your userId and email");
        } else {
            const user = JSON.stringify(data[0]);
            localStorage.setItem("knowletUser", user);
        }
        
        console.log(data);
        
    } catch(e) {
        console.log(e);
    }
}

async function signup(name, email) {
    try {
        const { error } = await supabase
            .from("user")
            .insert({
                id: lastUserId,
                name: name,
                email: email
            });
        
        if (error) console.log(error);
        
        alert("Done")
    } catch(e) {
        console.log(e);
    }
}