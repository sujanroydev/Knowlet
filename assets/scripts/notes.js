const main = document.getElementById("main");

let h1= "";
let h2 = "";
let p = "";
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
        createPage(); // Call a function to use the data
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
	
	h1 = "Notes and Study Meterial";
	p = "Select a unit to view notes and study materials";
	h2 = currentTitle[indmain];
	
	main.innerHTML = `
<header class="header">
	<button id="back-btn" title="Go Back" onclick="goBack()">←</button>
    <h1>${h1}</h1>
	
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

function goBack() {
	if (indmain === 0) {
		window.location.href = '/';
		return;
	}
	prevClicks[indmain] = null;
	indmain -= 1;
	createPage(prevClicks[indmain])
}