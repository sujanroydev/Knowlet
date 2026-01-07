const main = document.getElementById("main");

const semesters = [ "Semester 1", "Semester 2", "Semester 3", "Semester 4", "Semester 6" ];
const subjects = [ "Mathematics", "Physics", "Botany", "Economics", "Ecology" ];
const paper = [ "dsc", "dsm", "sec", "idc" ];

let notes = [];

// Load notes.json
fetch("assets/notes-helper.json").then(console.log);
    // .then(res => res.json())
    // .then(data => {
    //     notes = data;
    // })
    // .catch(err => console.error("Failed to load notes.json:", err));

console.log(notes);

function createPage() {
	const h1 = "Notes and Study Meterial";
	const p = "Select a unit to view notes and study materials";
	const h2 = "Semesters";
	
	let items = "";
	
	for (let i in semesters) {
		console.log(semesters[i]);
		items += `<div class="subject-card" onclick="fn('${semesters[i]}')"><h4>${semesters[i]}</h4></div>
			`;
	}
	console.log(items)

	main.innerHTML = `
<header class="header">
	<button id="back-btn" title="Go Back" onclick="goBack()">←</button>
    <h1>${h1}</h1>
	<p>${p}</p>
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
	alert(n);
}

function goBack() {
	window.location.href = '/';
}

// createPage();