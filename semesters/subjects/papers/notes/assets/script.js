// unit-nav.js
// Auto-generates Previous/Next links for Knowlet unit pages by reading current URL

(function () {
  const currentUrl = window.location.href;
  console.log(currentUrl);
  // Match the last part that looks like "_unit_X" (X = 1–5 or more)
  const match = currentUrl.match(/(.*_unit_)(\d+)(\.html)?$/);
  
  if (!match) return; // no match → not a unit page
  
  const base = match[1];          // everything before the unit number
  const currentNum = parseInt(match[2]); // current unit number
  const extension = match[3] || ".html"; // keep .html if missing

  // Function to create nav link
  const createLink = (url, text) => {
    const a = document.createElement("a");
    a.href = url;
    a.textContent = text;
    a.style.display = "inline-block";
    a.style.margin = "0 15px";
    a.style.padding = "8px 16px";
    a.style.background = "#f1f1f1";
    a.style.color = "#333";
    a.style.textDecoration = "none";
    a.style.borderRadius = "6px";
    a.onmouseover = () => (a.style.background = "#ddd");
    a.onmouseout = () => (a.style.background = "#f1f1f1");
    return a;
  };

  // Create nav container
  const nav = document.createElement("nav");
  nav.style.textAlign = "center";
  nav.style.margin = "2em 0";

  // Previous link (if not Unit 1)
  if (currentNum > 1) {
    const prevUrl = `${base}${currentNum - 1}${extension}`;
    console.log(prevUrl);
    nav.appendChild(createLink(prevUrl, "« Previous Unit"));
  }

  // Next link (if not Unit 5)
  if (currentNum < 5) {
    const nextUrl = `${base}${currentNum + 1}${extension}`;
    console.log(nextUrl);
    nav.appendChild(createLink(nextUrl, "Next Unit »"));
  }

  // Add to bottom of page
  document.body.appendChild(nav);
})();