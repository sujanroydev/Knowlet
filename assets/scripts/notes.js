const main = document.getElementById("main");

const currentTitle = ["Semesters", "Subjects", "Papers", "Units"]

let data = null;
let prevClicks = ["notes"];

fetch("assets/notes.json")
    .then(res => res.json())
    .then(d => {
        data = d;
        try {
            syncStateFromURL();
            setupHistoryStack();
            history.replaceState(
                getState(),
                "",
                buildURL()
            );
    
            createPage();
        } catch(error) {
            console.error(error);
        }
    })
    .catch(err => {console.error("Failed to load notes.json:", err);})

window.addEventListener("popstate", function (event) {
    if (!event.state) {
        return;
    }

    prevClicks.pop();
    createPage();
});

function syncStateFromURL() {
    const params = new URLSearchParams(window.location.search);
    const keys = ["sem", "sub", "ppr", "unit"];

    prevClicks = ["notes"];

    for (let i = 0; i < keys.length; i++) {
        const value = params.get(keys[i]);
        if (value) {
            prevClicks.push(value);
        }
    }
}

function setupHistoryStack() {

    const keys = ["sem", "sub", "ppr", "unit"];
    const params = new URLSearchParams(window.location.search);

    let baseClicks = ["notes"];
    history.replaceState({ prevClicks: baseClicks }, "", "/notes");

    for (let i = 0; i < keys.length; i++) {
        const value = params.get(keys[i]);
        if (value) {
            baseClicks = [...baseClicks, value];

            const tempParams = new URLSearchParams();
            for (let j = 0; j <= i; j++) {
                tempParams.set(keys[j], baseClicks[j + 1]);
            }

            history.pushState(
                { prevClicks: [...baseClicks] },
                "",
                "/notes?" + tempParams.toString()
            );
        }
    }

    prevClicks = [...baseClicks];
}

function generateItems() {
    const notesArr = data;

    let target = prevClicks.filter(Boolean).join("/") + "/";
    let items = "";
    let temp = "";

    for (let i in notesArr) {
        const item = notesArr[i];
        const parts = item.path.split("/");
        if (item.path.includes(target)) {

            let current = parts[prevClicks.length];

            if (current !== temp) {

                temp = current;

                let tagName = (prevClicks.length === 3)
                        ? current.replace("_", " ").toUpperCase()
                        : current.replace("_", " ").replace(/\b\w/g, char => char.toUpperCase());

                items += `<div class="subject-card" onclick="navigateTo('${current}')"><h4>${tagName}</h4></div>
                    `;
            }
        }
    }
    if (items) {
        return items;
    } else {
        window.location.href = prevClicks.join("/");
    }
}

function createPage() {

    const items = generateItems();
    if (!items) return;

    const depth = prevClicks.length;
    const h1 = (depth === 4)
            ? prevClicks[depth - 1].replace("_", " ").toUpperCase()
            : prevClicks[depth - 1].replace("_", " ").replace(/\b\w/g, char => char.toUpperCase());

    const h2 = currentTitle[depth - 1];
    const path = prevClicks.filter(Boolean).map(click => `<button onclick="navigateBackTo('${click}')">${click.replace("null/", "")}</button>`).join("/");

    main.innerHTML = getMainHtml(h1, h2, path, items);
}

function getMainHtml(h1, h2, path, items) {
    return `
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
    prevClicks.push(level);

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
            prevClicks = prevClicks.slice(0, i);
            break;
        }
    }

    history.pushState(
        getState(),
        "",
        buildURL()
    );

    createPage();
}

function getState() {
    return {
        prevClicks: [...prevClicks]
    };
}

function goBack() {
    if (prevClicks.length === 1) {
        window.location.href = "/";
        return;
    }

    history.back();
}
