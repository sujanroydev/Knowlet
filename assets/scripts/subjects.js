// --- 1. Back Button ---
const backBtn = document.createElement("button");
backBtn.id = "back-btn";
backBtn.textContent = "←";
backBtn.title = "Go Back";

backBtn.onclick = () => {
  const currentUrl = window.location.href;
  const match = currentUrl.match(/\/semester_(\d+)\/[a-z_]+/i);
  const backUrl = currentUrl.replace(/\/semester_\d+\/[a-z_]+/i, `/semester_${match[1]}`);
  window.location.href = backUrl;
};

document.body.appendChild(backBtn);