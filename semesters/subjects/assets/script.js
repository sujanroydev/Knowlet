// --- 1. Back Button ---
const backBtn = document.createElement("button");
backBtn.id = "back-btn";
backBtn.textContent = "←";
backBtn.title = "Go Back";

backBtn.onclick = () => {
  const currentUrl = window.location.href;
  const match = currentUrl.match(/\/semesters\/subjects\/semester_(\d+)_([a-z_]+)/i);
  if (match) {
    const semester = match[1];
    const subject = match[2];
    const backUrl = currentUrl.replace(
      /\/subjects\/semester_\d+_[a-z_]+/i,
      `/semester_${semester}`
    );

    window.location.href = backUrl;
  } else {
    alert("Back navigation not available for this page.");
  }
};

document.body.appendChild(backBtn);