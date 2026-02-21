const main = document.getElementById("main");

let items = "";
let temp = "";

let tempNotes = [[null], [null], [null], [null], [null]];
let prevClicks = ["notes"];
let indmain = 0;

const currentTitle = ["Semesters", "Subjects", "Papers", "Units"]

fetch("assets/notes.json")
    .then(res => res.json())
    .then(data => {
        tempNotes[0] = data;
        history.replaceState(
            getState(),
            "",
            buildURL()
        );

        createPage();
    })
    .catch(err => {console.error("Failed to load notes.json:", err);})

window.addEventListener("popstate", function (event) {
    if (!event.state) return;

    indmain = event.state.indmain;
    prevClicks = event.state.prevClicks;

    createPage();
});

function createPage(n = "notes") {
    items = "";
    temp = "";
    tempNotes[indmain + 1] = [];

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
                items += `<div class="subject-card" onclick="navigateTo('${current}')"><h4>${tagName}</h4></div>
                    `;
            }
        }
    }
    
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
        if (prevClicks[i]) {
            path += `<button onclick="navigateBackTo('${prevClicks[i]}')">${prevClicks[i].replace("null/", "")}</button>` + "/";
        }
    }
    
    main.innerHTML = `
        <header class="header">
            <button id="back-btn" title="Go Back" onclick="goBack()">←</button>
            <h1>${h1}</h1>
            <p>${path}</p>
        </header>
        
        <main class="main">
            <section class="subjects-section">
                <h2>${h2}</h2>
                <div class="subjects-grid">
                    ${items}
                </div>
            </section>
        </main>
        
        <footer class="footer">
            <p>© 2025 Knowlet | All rights reserved</p>
        </footer>
        `;
    }

function navigateTo(level) {
    indmain += 1;
    prevClicks[indmain] = level;

    history.pushState(
        getState(),
        "",
        buildURL()
    );

    createPage();
}

function buildURL() {
    const keys = ["sem", "sub", "ppr", "unit"];
    const params = new URLSearchParams();

    for (let i = 1; i < prevClicks.length; i++) {
        if (prevClicks[i]) {
            params.set(keys[i - 1], prevClicks[i]);
        }
    }

    return "/notes?" + params.toString();
}

function navigateBackTo(level) {

    for (let i in prevClicks) {
        if (level === prevClicks[i]) {
            indmain = i - 1;
        }
    }

    prevClicks = prevClicks.slice(0, indmain + 1);

    history.pushState(
        getState(),
        "",
        buildURL()
    );

    createPage();
}

function getState() {
    return {
        indmain,
        prevClicks: [...prevClicks]
    };
}

function goBack() {
    if (indmain === 0) {
        window.location.href = "/";
        return;
    }

    history.back();
}
