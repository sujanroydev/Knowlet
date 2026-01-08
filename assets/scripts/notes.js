const main = document.getElementById("main");

let items = "";
let temp = "";

let notes = [];
let tempNotes = [[null], [null], [null], [null], [null]];
let prevClicks = ["notes"];
let indmain = 0;

const currentTitle = ["Semesters", "Subjects", "Papers", "Units"]

fetch("assets/notes.json")
    .then(res => res.json())
    .then(data => {
        notes = data;
        tempNotes[indmain] = notes;
        console.log(notes); // This works because it's inside the callback
        try {
        	createPage(); // Call a function to use the data
        } catch(e) {
        	console.error(e);
        }
    })
    .catch(err => {console.error("Failed to load notes.json:", err);})

function createPage(n = "notes") {
	items = "";
	let x = 0;
	for (let i in tempNotes[indmain]) {
		let parts = tempNotes[indmain][i].path.split("/");
		
		if (prevClicks[indmain] === parts[indmain]) {
			if (indmain === 4) {
				window.location.href = tempNotes[indmain][i].path;
				return;
			}
			tempNotes[indmain + 1][x] = tempNotes[indmain][i];
			x += 1;
			let current = parts[indmain + 1];
			if (current !== temp) {
				temp = current;
				let tagName;
				if (indmain === 2) {
					tagName = current.replace("_", " ").replace("_", " ").toUpperCase();
				} else {
					tagName = current.replace("_", " ").replace(/\b\w/g, char => char.toUpperCase());
				}
				items += `<div class="subject-card" onclick="fn('${current}')"><h4>${tagName}</h4></div>
	 			`;
			}
		}
	}
	
	console.log(tempNotes)
	
	let h1;
	
	if (indmain === 3) {
		h1 = prevClicks[indmain].replace("_", " ").replace("_", " ").toUpperCase();
	} else {
		h1 = prevClicks[indmain].replace("_", " ").replace(/\b\w/g, char => char.toUpperCase());
	}
	
	const p = "Select a unit to view notes and study materials";
	const h2 = currentTitle[indmain];
	let path = "";
	
	for (let i in prevClicks) {
		path += `<button>${prevClicks[i]}</button>` + "/";
	}
	
	path = path.replace("null/", "");
	
	main.innerHTML = `
		<header class="header">
			<button id="back-btn" title="Go Back" onclick="goBack()">←</button>
		    <h1>${h1}</h1>
		    <p>${path}</p>
		</header>
		
		<main class="main">
		    <section class="subjects-section">
		        <h2>${h2}</h2>
		        <div class="subjects-grid">${items}</div>
		    </section>
		</main>
		
		<footer class="footer">
			<p>© 2025 Knowlet | All rights reserved</p>
		</footer>
		`;
	}

function fn(n) {
	// alert(n);
	indmain += 1;
	prevClicks[indmain] = n;
	createPage(n)
}

function sw(n) {
	const temp1 = false;
	for (let i in indmain) {
		if ( n === indmain[i] || temp1) {
			temp1 = true;
			prevClicks[indmain] = null;
			indmain -= 1;
		}
	}
	
	createPage(prevClicks[indmain]);
}

function goBack() {
	if (indmain === 0) {
		window.location.href = '/';
		return;
	}
	prevClicks[indmain] = null;
	indmain -= 1;
	createPage(prevClicks[indmain]);
}