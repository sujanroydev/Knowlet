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
    nav.appendChild(createLink(prevUrl, `« Unit ${currentNum - 1}`));
  }

  // Next link (if not Unit 5)
  if (currentNum < 5) {
    const nextUrl = `${base}${currentNum + 1}${extension}`;
    console.log(nextUrl);
    nav.appendChild(createLink(nextUrl, `Unit ${currentNum + 1} »`));
  }

  // Add to bottom of page
  document.body.appendChild(nav);
})();

// --- Start of History and Favourites Feature ---

(function () {
    const currentUrl = window.location.href.split('?')[0]; // Remove query parameters for cleaner history
    const pageTitle = document.title;
    
    // =================================================================
    // 1. Page History Tracker
    // =================================================================
    
    const HISTORY_KEY = 'unit_page_history';
    
    /**
     * Updates the history in localStorage, limiting the list size.
     */
     
    function updateHistory() {
        // Load existing history or initialize a new array
        let history = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
        
        // The new entry to add
        const newEntry = { url: currentUrl, title: pageTitle, timestamp: new Date().toISOString() };
        
        // Filter out the current page if it's already in the history
        history = history.filter(item => item.url !== newEntry.url); // <-- CORRECTED LINE
        
        // Add the current page to the top of the list
        history.unshift(newEntry);

        
        // Limit the history to, say, the last 15 pages
        const maxHistorySize = 15;
        if (history.length > maxHistorySize) {
            history.length = maxHistorySize;
        }
        
        // Save the updated history back to localStorage
        localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
        
        console.log(`History updated. Current history size: ${history.length}`);
    }

    // Run the history update function immediately upon page load
    updateHistory();


    // =================================================================
    // 2. Favourites Button and Logic
    // =================================================================

    const FAVOURITES_KEY = 'unit_page_favourites';
    const favButton = document.createElement("button");
    const container = document.querySelector('.container');
    
    /**
     * Checks if the current page is in the favourites list.
     * @returns {Array} The current favourites list.
     */
    function getFavourites() {
        return JSON.parse(localStorage.getItem(FAVOURITES_KEY) || '[]');
    }

    /**
     * Updates the button text and style based on the favourite status.
     * @param {Array} favs - The current list of favourites.
     */
    function renderFavouriteButton(favs) {
        const isFavourite = favs.some(item => item.url === currentUrl);
        
        favButton.textContent = isFavourite ? "★ Remove from Favourites" : "☆ Add to Favourites";
        favButton.style.backgroundColor = isFavourite ? "#d9534f" : "#5cb85c";
        favButton.style.color = "white";
        favButton.style.border = "none";
        favButton.style.padding = "10px 20px";
        favButton.style.borderRadius = "5px";
        favButton.style.cursor = "pointer";
        favButton.style.margin = "10px auto";
        favButton.style.display = "block";
        favButton.style.fontSize = "1em";
        favButton.onmouseover = () => favButton.style.opacity = 0.8;
        favButton.onmouseout = () => favButton.style.opacity = 1;
    }

    /**
     * Handles the click event for the favourite button.
     */
    function toggleFavourite() {
        let favs = getFavourites();
        const entry = { url: currentUrl, title: pageTitle };

        const index = favs.findIndex(item => item.url === entry.url);

        if (index > -1) {
            // Found: remove it
            favs.splice(index, 1);
            //alert(`Removed "${pageTitle}" from favourites!`);
        } else {
            // Not found: add it
            favs.push(entry);
            //alert(`Added "${pageTitle}" to favourites!`);
        }

        // Save and re-render
        localStorage.setItem(FAVOURITES_KEY, JSON.stringify(favs));
        renderFavouriteButton(favs);
    }

    // Attach the handler and append the button to the page
    favButton.addEventListener('click', toggleFavourite);

    // Append the button to the container right below the main heading for prominence
    if (container) {
        container.insertBefore(favButton, container.querySelector('h1').nextSibling);
    } else {
        // Fallback for pages without a .container class
        document.body.insertBefore(favButton, document.body.firstChild);
    }
    
    // Initial render call
    renderFavouriteButton(getFavourites());

})();

// --- End of History and Favourites Feature ---
