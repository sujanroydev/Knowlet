const SUPABASE_URL = "https://ampwczxrfpbqlkuawrdf.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFtcHdjenhyZnBicWxrdWF3cmRmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI3OTk4MzYsImV4cCI6MjA3ODM3NTgzNn0.hFib9Y5x02b5VWjKuNi1XkUYvycmrp0DQhnwNkOGJEU";

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const input = document.getElementsByClassName("user-input");
const inputEdu = document.getElementById("sltEdu")
const btnSubmit = document.getElementById("submit-btn");

const userId = JSON.parse(localStorage.getItem("knowletUser")).id;
const userName = JSON.parse(localStorage.getItem("knowletUser")).name;

input[0].value = userName;
document.getElementById("user-id").textContent = "Your User ID: " + userId;

btnSubmit.addEventListener("click", () => {
    
    const name = input[0].value;
    const email = input[1].value;
    const age = input[2].value ? Number(input[3].value) : 0;
    const fvSubject = input[3].value;
    const stream = input[4].value;
    const standered = inputEdu.value;
    
    const user = {
        id: userId,
        name: name ? name : userName,
        email: email,
        age: age,
        fv_subject: fvSubject,
        stream: stream,
        standered: standered
    }

    localStorage.setItem("knowletUser", JSON.stringify(user))
    console.log(user)
    
    //reset
    for (i = 0; i < input.length; i++) {
        input[i].value = null;
    }
    inputEdu.value = "";
    //window.close;
    sync()
});

async function sync() {
    
    const user = JSON.parse(localStorage.getItem("knowletUser"));
    console.log(user);
    try {
        const { error } = await supabase
            .from("user")
            .update(user)
            .eq("id", userId);
            
        if (error) {
            console.log(error);   
        }
    
    } catch(e) {
        console.log(e)
    }
}