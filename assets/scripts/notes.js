// --- 1. Back Button ---
const backBtn = document.createElement("button");
backBtn.id = "back-btn";
backBtn.textContent = "←";
backBtn.title = "Go Back";

backBtn.onclick = () => {
  const currentUrl = window.location.href;
  const match = currentUrl.match(/\/notes/i);
  const backUrl = currentUrl.replace(/\/notes/i, `/index`);
  window.location.href = backUrl;
};

document.body.appendChild(backBtn);