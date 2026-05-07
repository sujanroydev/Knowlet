let ADMIN_PASSWORD = "";

function checkPassword() {
  ADMIN_PASSWORD = document.getElementById("password").value + "";
  document.getElementById("login").style.display = "none";
  document.getElementById("dashboard").classList.remove("hidden");
}

function preview() {
  const title = document.getElementById("title").value;
  const body = document.getElementById("body").value;
  const image = document.getElementById("image").value;

  document.getElementById("previewBox").innerHTML = `
        <strong>${title}</strong><br>
        ${body}<br>
        ${image ? `<img src="${image}">` : ""}
    `;
}

function saveDraft() {
  const draft = {
    title: document.getElementById("title").value,
    body: document.getElementById("body").value,
  };

  let drafts = JSON.parse(localStorage.getItem("drafts") || "[]");
  drafts.push(draft);

  localStorage.setItem("drafts", JSON.stringify(drafts));
  loadDrafts();
}

function loadDrafts() {
  const drafts = JSON.parse(localStorage.getItem("drafts") || "[]");

  document.getElementById("drafts").innerHTML = drafts
    .map((d) => `<li>${d.title}</li>`)
    .join("");
}

async function sendNow(to) {
  const payload = {
    title: document.getElementById("title").value,
    body: document.getElementById("body").value,
    // icon: "/assets/icons/knowlet/android-chrome-192x192.png",
    // badge: "/assets/icons/owlet/favicon-32x32.png",
    image: document.getElementById("image").value,
    // tag: "profile",
    url: document.getElementById("url").value,
    ADMIN_PASSWORD,
  };

  const url =
    to === "sujan"
      ? "https://knowlet.in/.netlify/functions/send-notification-copy"
      : "https://knowlet.in/.netlify/functions/send-notification";

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    console.error(`failed to fetch, status code: ${res.status}`);
    alert("failed to send");
    return;
  }

  let history = JSON.parse(localStorage.getItem("history") || "[]");
  history.push(payload);

  localStorage.setItem("history", JSON.stringify(history));

  let sent = Number(localStorage.getItem("sent") || 0);
  localStorage.setItem("sent", sent + 1);

  loadHistory();
  loadStats();

  alert("Notification Sent!");
}

function loadHistory() {
  const history = JSON.parse(localStorage.getItem("history") || "[]");

  document.getElementById("history").innerHTML = history
    .map((h) => `<li>${h.title}</li>`)
    .join("");
}

function loadStats() {
  document.getElementById("sentCount").innerText =
    localStorage.getItem("sent") || 0;

  document.getElementById("clickCount").innerText =
    localStorage.getItem("clicks") || 0;
}

function schedule() {
  const time = new Date(
    document.getElementById("scheduleTime").value,
  ).getTime();
  const now = Date.now();

  const delay = time - now;

  if (delay > 0) {
    setTimeout(sendNow, delay);
    alert("Scheduled!");
  }
}

loadDrafts();
loadHistory();
loadStats();
