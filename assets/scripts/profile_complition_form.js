const imgInput = document.getElementById("input-image");
const input = document.getElementsByClassName("user-input");
const inputEdu = document.getElementById("sltEdu")
const btnSubmit = document.getElementById("submit-btn");
const profilePic = document.getElementById("profile-pic");
const editBtn = document.getElementById("edit");
const saveBtn = document.getElementById("save");
const cancleBtn = document.getElementById("cancel");
const imgPreview = document.getElementById("img-preview");
const editPopup = document.getElementById("edit-popup");
const loginPopup = document.getElementById("login-popup");
const loader = document.getElementById("loader");

const rdtLgnBtn = document.getElementById("redirect-to-login-btn");

let userId;

if (!localStorage.getItem("knowletUser")) {
    loginPopup.style.display = "flex";
} else {
    userId = JSON.parse(localStorage.getItem("knowletUser")).id;
}

profilePic.addEventListener("click", () => {
    editPopup.style.display = "flex";
    imgPreview.src = profilePic.src;
});

editBtn.addEventListener("click", () => {
    imgInput.click()
});

imgInput.addEventListener("change", () => {
    const file = imgInput.files[0];
    if (!file) return;

    imgPreview.src = URL.createObjectURL(file);
    imgPreview.style.display = "";
});

saveBtn.addEventListener("click", () => {
    uploadAvatar();
});

cancleBtn.addEventListener("click", () => {
    editPopup.style.display = "none";
});

rdtLgnBtn.addEventListener("click", () => {
    // alert()
    loginPopup.style.display = "none";
    window.location.href = "/login_signup";
});

btnSubmit.addEventListener("click", () => {
    
    const name = input[0].value;
    const email = input[1].value;
    const age = input[2].value ? Number(input[2].value) : 0;
    const fvSubject = input[3].value;
    const stream = input[4].value;

    const standered = inputEdu.value;
    const picture = profilePic.src;
    
    if (!name) {
        alert("Must enter Name");
        return;
    }
    
    if (!email) {
        alert("Must enter Email");
        return;
    }
    
    const user = {
        id: userId,
        name: name,
        email: email,
        age: age,
        fv_subject: fvSubject,
        stream: stream,
        standered: standered,
        picture: picture,
        password: JSON.parse(localStorage.getItem("knowletUser")).password
    }

    localStorage.setItem("knowletUser", JSON.stringify(user))

    //reset
    for (i = 0; i < input.length; i++) {
        input[i].value = null;
    }
    inputEdu.value = "";
    sync()
});

function load() {
    const user = JSON.parse(localStorage.getItem("knowletUser"));
    
    document.getElementById("user-id").textContent = "Your User ID: " + userId;
    
    input[0].value = user.name;
    input[1].value = user.email;
    input[2].value = user.age ? user.age : null;
    input[3].value = user.fv_subject ? user.fv_subject : null;
    input[4].value = user.stream ? user.stream : null;
    inputEdu.value = user.standered ? user.standered : "";
    profilePic.src = user.picture || "assets/images/demo_pp.jpg";
}

async function sync() {
    
    const user = JSON.parse(localStorage.getItem("knowletUser"));
    
    try {
        //new code
    	loader.style.display = "flex";
    	
    	const res = await fetch('https://knowlet.in/.netlify/functions/update-data', {
    		method: 'POST',
    		headers: {'Content-Type': 'application/json'},
    		body: JSON.stringify(user)
    	});
    	
    	loader.style.display = "none";
    	
    	if (!res.ok) {
    		console.error(`Error code: ${res.status}`);
    	}
    	
    	const result = await res.json();
    	
    	if (!result.success) {
    		console.error(`Database error: ${result.error}`);
    		alert(result.error);
    	} else {
    		alert('Successfully Submitted.');
    		window.location.href = 'profile.html';
    	}
    	
    } catch(e) {
        console.log(e)
    }
}

async function uploadAvatar() {
    const originalFile = imgInput.files[0];

    if (!originalFile) {
        alert("Select an image first");
        return;
    }
    
    if (!originalFile.type.startsWith("image/jpeg")) {
        alert("Only jpg allowed");
        return;
    }
    
    if (originalFile.size > 5 * 1024 * 1024) {
        alert("Image too large");
        return;
    }
    
    loader.style.display = "flex";
    
    const compressedFile = await compressWithCanvas(
        originalFile,
        0.7,   // quality
        512    // max width/height
    );
    
    const fileExt = "jpg" // compressedFile.name.split('.').pop();
    const fileName = `${userId.replaceAll("@", "").toLowerCase()}.${fileExt}`;
    const filePath = `users/${fileName}`;

	const formData = new FormData();
	formData.append("image", compressedFile); // <input type="file">
	formData.append("filePath", filePath);

	const res = await fetch("https://knowlet.in/.netlify/functions/upload-image", {
	    method: "POST",
	    body: formData
	});

	if (!res.ok) {
		loader.style.display = "none";
		console.error(`Error code ${res.status}`);
		return;
	}

	const result = await res.json();

	if (!result.success) {
		console.log(result.error);
		alert(error.message);
		return;
	};

	loader.style.display = "none";
	editPopup.style.display = "none";
	profilePic.src = result.publicUrl + "?t=" + Date.now();
}

function compressWithCanvas(file, quality = 0.7, maxSize = 512) {
    return new Promise((resolve) => {
        const img = new Image();
        const reader = new FileReader();

        reader.onload = e => {
            img.src = e.target.result;
        };

        img.onload = () => {
            const canvas = document.createElement("canvas");
            const scale = Math.min(maxSize / img.width, maxSize / img.height, 1);

            canvas.width = img.width * scale;
            canvas.height = img.height * scale;

            canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);

            canvas.toBlob(blob => {
                resolve(new File([blob], file.name, { type: "image/jpeg" }));
            }, "image/jpeg", quality);
        };

        reader.readAsDataURL(file);
    });
}

load()