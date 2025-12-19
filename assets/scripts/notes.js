// --- 1. Back Button ---
const backBtn = document.createElement("button");
backBtn.id = "back-btn";
backBtn.textContent = "←";
backBtn.title = "Go Back";

backBtn.onclick = () => {
  const currentUrl = window.location.href;
  const match = currentUrl.match(/\/[a-z]+\/[a-z]{3}_\d+/i);
  const backUrl = currentUrl.replace(/\/[a-z]{3}_\d+/i, '');
  window.location.href = '/';
};

document.body.appendChild(backBtn);