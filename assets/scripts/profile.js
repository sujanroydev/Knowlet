const LoginSignupBtn = document.getElementById("login-signup-btn");

const userName = document.getElementById("username");
const email = document.getElementById("email");


function sync() {
    
    const user = JSON.parse(localStorage.getItem("knowletUser"));
    console.log(user);
    
    userName.textContent = user.name;
    email.textContent = '' + user.email;
    
    
}

sync()