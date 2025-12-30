
const searchInput = document.getElementById("searchInput");
const resultsContainer = document.getElementById("results");
const resultCount = document.getElementById("resultCount");
let notes = [];

// Load notes.json
fetch("assets/notes.json")
    .then(res => res.json())
    .then(data => {
        notes = data;
    })
    .catch(err => console.error("Failed to load notes.json:", err));

// Simple fuzzy match
function fuzzyMatch(text, queryWords) {
    let pos = 0;
    for (const word of queryWords) {
        pos = text.indexOf(word, pos);
        if (pos === -1) return false;
        pos += word.length;
    }
    return true;
}

searchInput.addEventListener("input", () => {
    const query = searchInput.value.toLowerCase().trim();
    resultsContainer.innerHTML = "";
    resultCount.textContent = "";

    if (!query) return;

    const queryWords = query.split(/\s+/);

    const scored = notes
        .map(note => {
            const text = (`${note.title} ${note.h1}`).toLowerCase();
            let score = 0;
            for (const word of queryWords) {
                if (text.startsWith(word)) score += 5;
                else if (note.title.toLowerCase().startsWith(word)) score += 4;
                else if (text.includes(word)) score += 1;
            }
            return { note, score };
        })
        .filter(item => item.score > 0 && fuzzyMatch((item.note.title + " " + item.note.h1).toLowerCase(), queryWords))
        .sort((a, b) => b.score - a.score);

    resultCount.textContent = `${scored.length} result${scored.length === 1 ? "" : "s"} found`;

    if (scored.length === 0) {
        resultsContainer.innerHTML = "<p>No results found.</p>";
        return;
    }

    scored.forEach(({ note }) => {
        const item = document.createElement("div");
        item.className = "note-item";
        item.innerHTML = `
            <a href="${note.path}" target="_blank">${note.title}</a>
            <small>${note.h1}</small>
        `;
        resultsContainer.appendChild(item);
    });
});
