const semestersDiv = document.getElementById("semesters");
const popup = document.getElementById("popup");
const popupTitle = document.getElementById("popup-title");
const popupBody = document.getElementById("popup-body");
const popupContent = document.getElementById("popup-content");
const imgPopup = document.getElementById("img-popup");
const popupImage = document.getElementById("popup-image");
const imgTitle = document.getElementById("img-title");
let notes = {d: "dff"};
let loader = document.getElementById("loader");


// Load products/notes
function LoadNotes() {
  db.ref("notes").once("value")
    .then(snapshot => {
    	loader.style.display = "none";
      const data = snapshot.val();
      notes = data;
      //console.log(data); // All your notes data
      
      // --- Load semesters ---
      data.semesters.forEach((sem, si) => {
        const div = document.createElement("div");
        div.className = "card";
        div.textContent = sem.name;
        div.onclick = () => {
          showPopup(sem.name, sem.subjects.map((sub, sj) => ({
            name: sub.name,
            onClick: () => {
              showPopup(sub.name, Object.keys(sub.papers).map(paperType => ({
                name: paperType,
                onClick: () => {
                  showPopup(paperType, sub.papers[paperType].map(unit => ({
                    name: unit.unit
                  })));
                  
                  const unit = sub.papers[paperType];
                  popupBody.innerHTML = ``;
                  unit.forEach(unit => {
                    const noteCard = document.createElement("div");
                    noteCard.className = "note-card";
                    noteCard.innerHTML = `
                      <h3>${unit.unit}</h3>
                      <button class="btn" onClick="viewImg('${unit.unit}', '${unit.file}')">View</button>
                      <a href="${unit.file}" download class="btn btn-download">Download</a>
                    `;
                    popupBody.appendChild(noteCard);
                  })
                  
                }
              })));
            }
          })));
        };
        semestersDiv.appendChild(div);
      });
    })
    .catch(error => {
      loader.style.display = "none";
      content.innerHTML = "<p style='color:red;'>❌ Failed to load Notes</p>";
      console.error("Error loading notes:", error);
    });
}
  
LoadNotes();

// --- Stack to keep history ---
let popupStack = [];

function renderPopup(title, content) {
  popupTitle.textContent = title;
  popupBody.innerHTML = "";

  content.forEach(item => {
    const div = document.createElement("div");
    div.className = "card";
    div.textContent = item.name || item;
    div.onclick = item.onClick;
    
    popupBody.appendChild(div);
  });

  popup.classList.remove("hidden");
}

function goBack() {
  popupStack.pop(); // remove current
  if (popupStack.length === 0) {
    popup.classList.add("hidden");
    // reset history state so back button works properly
    history.replaceState({ popupOpen: false }, null, location.href);
  } else {
    const prev = popupStack[popupStack.length - 1];
    renderPopup(prev.title, prev.content);
  }
}

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    if (imgPopup.style.display === "flex") {
      imgPopup.style.display = "none";
      history.replaceState({ popupOpen: false }, null, location.href);
    } else if (!popup.classList.contains("hidden")) {
      goBack();
    }
  }
});

window.addEventListener("popstate", (event) => {
  if (event.state && event.state.popupOpen) {
    if (imgPopup.style.display === "flex") {
      imgPopup.style.display = "none";
      history.replaceState({ popupOpen: false }, null, location.href);
    } else if (!popup.classList.contains("hidden")) {
      goBack();
    }
  } else {
    // no popup state → ensure everything is closed
    popup.classList.add("hidden");
    imgPopup.style.display = "none";
    popupStack = [];
  }
});

window.onclick = (e) => {
  if (e.target === popup) {
    popupStack = [];
    popup.classList.add("hidden");
    history.replaceState({ popupOpen: false }, null, location.href);
  }
};

// Push state when opening popup or image popup
function pushState() {
  history.pushState({ popupOpen: true }, null, location.href);
}

// Push state when popup is opened
function showPopup(title, content) {
  // Save current popup state to stack
  popupStack.push({ title, content });
  renderPopup(title, content);
  pushState();
}

// Push state when image popup is opened
function viewImg(unit, file) {
  imgPopup.style.display = "flex";
  popupImage.src = file;
  popupImage.alt = unit;
  imgTitle.textContent = unit;
  pushState();
}

// On initial load, push a state to prevent exiting immediately
window.addEventListener("load", () => {
  history.replaceState({ popupOpen: false }, null, location.href);
});

const searchInput = document.getElementById("searchInput");
const searchResults = document.getElementById("searchResults");

function searchNotes(query) {
  const results = [];
  console.log(results);
  notes.semesters[0].subjects.forEach(subject => {
    const subjectName = subject.name.toLowerCase();

    Object.keys(subject.papers).forEach(paperCode => {
      const paperList = subject.papers[paperCode];

      paperList.forEach(item => {
        const unitName = item.unit.toLowerCase();

        if (
          subjectName.includes(query) ||
          paperCode.toLowerCase().includes(query) ||
          unitName.includes(query)
        ) {
          results.push({
            subject: subject.name,
            paper: paperCode,
            unit: item.unit,
            file: item.file
          });
        }
      });
    });
  });

  return results;
}

function displaySearchResults(results) {
  searchResults.innerHTML = "";

  if (results.length === 0) {
    searchResults.innerHTML = `<p style="text-align:center; color:#aaa;">No results found</p>`;
    return;
  }

  results.forEach(r => {
    const div = document.createElement("div");
    div.className = "note-card";
    div.innerHTML = `
      <h3>${r.subject} - ${r.paper}</h3>
      <p>${r.unit}</p>
      <button class="btn" onClick="viewImg('${r.unit}', '${r.file}')">View</button>
      <a href="${r.file}" download class="btn btn-download">Download</a>
    `;
    searchResults.appendChild(div);
  });
}

// Live search
searchInput.addEventListener("keyup", () => {
  const query = searchInput.value.toLowerCase().trim();
  if (query === "") {
    searchResults.innerHTML = ``; // clear if empty
    return;
  }
  const matches = searchNotes(query);
  displaySearchResults(matches);
});