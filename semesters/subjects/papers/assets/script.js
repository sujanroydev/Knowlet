// --- 1. Back Button ---
const backBtn = document.createElement("button");
backBtn.id = "back-btn";
backBtn.textContent = "← ";
backBtn.title = "Go Back";

backBtn.onclick = () => {
  const currentUrl = window.location.href;
  // Match pattern like: /papers/phy_dsc_151.html
  const match = currentUrl.match(/\/papers\/([a-z_]+)_([a-z]+)_(\d+)\.html/i);
  
  if (match) {
    const subject = match[1]; // e.g., 'phy'
    const code = parseInt(match[3]); // e.g., 151

    let semester;
    if (code > 100 && code < 150) semester = 1;
    else if (code > 150 && code < 200) semester = 2;
    else if (code > 200 && code < 250) semester = 3;
    else if (code > 250 && code < 300) semester = 4;
    else if (code > 300 && code < 350) semester = 5;
    else if (code > 350 && code < 400) semester = 6;
    else if (code > 400 && code < 450) semester = 7;
    else if (code > 450 && code < 500) semester = 8;

    const backUrl = currentUrl.replace(
      /\/papers\/[a-z_0-9]+\.html/i,
      `/semester_${semester}_${subject}.html`
    );
    //console.log(backUrl);
    window.location.href = backUrl;
  } else {
    alert("Back navigation not available for this page.");
  }
};

document.body.appendChild(backBtn);