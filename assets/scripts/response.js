const SUPABASE_URL = "https://ampwczxrfpbqlkuawrdf.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFtcHdjenhyZnBicWxrdWF3cmRmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI3OTk4MzYsImV4cCI6MjA3ODM3NTgzNn0.hFib9Y5x02b5VWjKuNi1XkUYvycmrp0DQhnwNkOGJEU";

const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const setPasswordForm = document.getElementById("setPasswordForm");
const input = document.getElementsByClassName("user-input");
const container = document.getElementById("container");
const loader = document.getElementById("loading");

const params = new URLSearchParams(window.location.search);
let isNewUser = true;

let user;
if (params.get("user")) {
	user = JSON.parse(params.get("user"));
}

setPasswordForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    let name = input[0].value;
    let email = input[1].value;
    let password = input[2].value;
    
    if (password !== input[3].value) {
    	alert("Unmatched Password");
    	return;
    }
    
    if (!name || !email || !password) {
        alert("All fields are required");
        return;
    }
    
    if (isNewUser) {
		let userId = name.split(' ')[0] + "@" + parseInt(Math.random() * 9000 + 1000);
		
		user = {
		    id: userId,
		    name: name,
		    email: email,
		    picture: user.picture,
		    password: password
		}
		
		try {
			
		    const { error } = await supabaseClient
		        .from("user")
		        .insert(user);
		        
		    if (error) {
		        console.log(error);
		        alert(error.message);
		        return;
		    }
		    
		    localStorage.setItem("knowletUser", JSON.stringify(user));
		    document.getElementById("loading").style.display = "none";
		    alert("Successfully Signed Up\n" + "Note your user ID: " + userId);
		    redirect();
		
		} catch(e) {
		    console.log(e);
		}
    } else {
    	try {
    		
		    const { error } = await supabaseClient
		        .from("user")
		        .update({password: password})
		        .eq("email", email);
		        
		    if (error) {
		        console.log(error);
		        alert(error.message);
		        return;
		    }
		    
		    localStorage.setItem("knowletUser", JSON.stringify(user));
		    document.getElementById("loading").style.display = "none";
		    alert("Password Updated");
		    redirect();
		
		} catch(e) {
		    console.log(e);
		}
    }

});

if (!user) {
    
    loader.style.display = "none";
    const appContainer = document.getElementById("msg-error"); 

    appContainer.innerHTML = `
        <div class="error-container">
            <div class="error-card">
                <div class="icon">👤</div>
                <h2>User not Found</h2>
                <p>Please log in to access your dashboard.</p>
                <button id="btn-login" class="primary-btn">Go to Login Page</button>
            </div>
        </div>
    `;

    document.getElementById("btn-login").addEventListener("click", () => {
        window.location.href = "/login_signup";
    });
}


if (user) {
    sync(user.name, user.email, user.picture)
}

async function sync(name, email, picture) {
    
    try {
        const { data, error } = await supabaseClient
            .from("user")
            .select("*")
            .eq("email", email);
        
        if (error) {
            console.log(error);
            alert(error);
            return;
        }
        console.log(data)
        if (!data[0]) {  
        	
            input[0].value = user.name;
            input[1].value = user.email;
            loader.style.display = "none";
            container.style.display = "flex";
            isNewUser = true;
        }
        
        if (data[0] && data[0].password) {
            localStorage.setItem("knowletUser", JSON.stringify(data[0]));
            document.getElementById("loading").style.display = "none";
            alert("You Alredy Have An Account, Successfully Logged In");
            redirect();
            return;
        } else {         
        	
            input[0].value = data[0].name;
            input[1].value = data[0].email;
            loader.style.display = "none";
            container.style.display = "flex";
            isNewUser = false;
        }
        
    } catch(e) {
        console.log(e);
    }
}

function redirect() {
    const history = JSON.parse(localStorage.getItem("unit_page_history") || '[]');
    
    if (history.length === 0) {
        window.location.href = "/../profile";
        return;
    } else {
        if (diffFromNow(history[0].timestamp) < 60) {
            window.location.href = history[0].url;
        } else {
            window.location.href = "/../profile";
        }
    }
}

function diffFromNow(time) {
    const target = new Date(time);
    const now = new Date();
    
    const diffMs = Math.abs(target - now);
    return Math.floor(diffMs / 1000); 
}