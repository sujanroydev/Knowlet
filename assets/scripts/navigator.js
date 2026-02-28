const params = new URLSearchParams(window.location.search);
let root = params.get("root") || "notes";

const currentTitle = ["Semesters", "Subjects", "Papers", "Units"]

let data = null;
let prevClicks = [root];

fetch(`assets/${root}.json`)
    .then(res => res.json())
    .then(d => {
        data = d;
        try {
            initiateSetup();
        } catch(error) {
            console.error(error);
        }
    })
    .catch(err => {console.error("Failed to load notes.json:", err);})

document.getElementById("back-btn").addEventListener("click", goBack);
document.getElementById("notes-btn").addEventListener("click", () => { loadJson("notes") });
document.getElementById("pyq-btn").addEventListener("click", () => { loadJson("pyq") });

window.addEventListener("popstate", (event) => {
    if (!event.state || !event.state.prevClicks) return;

    prevClicks = [...event.state.prevClicks];
    createPage();
});

function loadJson(name) {
    root = name;
    prevClicks = [root];

    history.replaceState(
        { prevClicks: [root] },
        "",
        `/navigator?root=${root}`
    );

    fetch(`assets/${root}.json`)
        .then(res => res.json())
        .then(d => {
            data = d;
            try {
                initiateSetup();
            } catch(error) {
                console.error(error);
            }
        });
}


function initiateSetup() {
    syncStateFromURL();
    setupHistoryStack();
    history.replaceState(
        getState(),
        "",
        buildURL()
    );

    createPage();
}

function syncStateFromURL() {
    const params = new URLSearchParams(window.location.search);
    const keys = ["sem", "sub", "ppr", "unit"];

    prevClicks = [root];

    for (let i = 0; i < keys.length; i++) {
        const value = params.get(keys[i]);
        if (value) {
            prevClicks.push(value);
        }
    }
}

function setupHistoryStack() {
    const keys = ["root", "sem", "sub", "ppr", "unit"];
    const params = new URLSearchParams(window.location.search);

    let baseClicks = [];
    history.replaceState({ prevClicks: baseClicks }, "", `/navigator?root=${root}`);

    for (let i = 0; i < keys.length; i++) {
        const value = params.get(keys[i]);
        if (value) {
            baseClicks = [...baseClicks, value];

            const tempParams = new URLSearchParams();
            for (let j = 0; j <= i; j++) {
                tempParams.set(keys[j], baseClicks[j]);
            }

            if (value !== prevClicks[prevClicks.length - 1]) {
                history.pushState(
                    { prevClicks: [...baseClicks] },
                    "",
                    "/navigator?" + tempParams.toString()
                );
            }
        }
    }

    prevClicks = baseClicks.length ? [...baseClicks] : [root];
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

    const contents = generateItems();
    if (!contents) return;

    const depth = prevClicks.length;
    const title = (depth === 4)
            ? prevClicks[depth - 1].replace("_", " ").toUpperCase()
            : prevClicks[depth - 1].replace("_", " ").replace(/\b\w/g, char => char.toUpperCase());

    const subTitle = currentTitle[depth - 1];
    const path = prevClicks.filter(Boolean).map(click => `<button onclick="navigateBackTo('${click}')">${click.replace("null/", "")}</button>`).join("/");

    renderContent(title, subTitle, path, contents);
}

function renderContent(title, subTitle, path, contents) {
    document.getElementById("title").textContent = title;
    document.getElementById("sub-title").textContent = subTitle;
    document.getElementById("path").innerHTML = path;
    document.getElementById("contents").innerHTML = contents;
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
    const keys = ["root", "sem", "sub", "ppr", "unit"];
    const params = new URLSearchParams();

    for (let i = 0; i < prevClicks.length; i++) {
        if (prevClicks[i]) {
            params.set(keys[i], prevClicks[i]);
        }
    }

    return "/navigator?" + params.toString();
}

function navigateBackTo(level) {

    const index = prevClicks.indexOf(level);

    if (index !== -1) prevClicks.length = index + 1;

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
