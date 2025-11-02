// --- Back Button (Semester → Home) ---
const backBtn = document.createElement("button");
backBtn.id = "back-btn";
backBtn.textContent = "←";
backBtn.title = "Go Back";

backBtn.onclick = () => {
  const currentUrl = window.location.href;
  const match = currentUrl.match(/\/semesters\/semester_(\d+)/i);
  const backUrl = currentUrl.replace(/\/semesters\/semester_\d+/i, "/index");
  window.location.href = backUrl;
};

document.body.appendChild(backBtn);