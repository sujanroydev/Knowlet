(function () {
    const user = JSON.parse(localStorage.getItem("knowletUser"));
    const favouritesList = document.getElementById('favourites-list');

	// helper functions

	function getSemester(semNum) {
	    const num = parseInt(semNum)
	
	    if (num == 1) return "1st Semester"
	    else if (num == 2) return "2nd Semester"
	    else if (num == 3) return "3rd Semester"
	    else if (num == 4) return "4th Semester"
	    else if (num == 5) return "5th Semester"
	    else if (num == 6) return "6th Semester"
	    else if (num == 7) return "7th Semester"
	    else if (num == 8) return "8th Semester"
	    else return "Unknown"
	}

	function capitalize(word) {
	    return word.charAt(0).toUpperCase() + word.slice(1)
	}

	function generateTitleFromURL(url) {
	
	    let parts = url.replace(".html", "").split("/").slice(3)
	
	    let sem = parts[1].split("_").join(" ")
	    sem = capitalize(sem)
	
	    let sub = parts[2].split("_").map(capitalize).join(" ")
	
	    let paper = parts[3].split("_").join(" ").toUpperCase()
	
	    let unit = parts[4].split("_").join(" ")
	    unit = capitalize(unit)
	
	    let semester = getSemester(parts[1].split("_")[1])
	
	    return `${sub} ${paper} ${unit} | ${semester} Notes`
	}

	function timeAgo(unixMs) {
		const now = Date.now()
		const diffMs = now - unixMs
	
		const seconds = Math.floor(diffMs / 1000)
		const minutes = Math.floor(seconds / 60)
		const hours = Math.floor(minutes / 60)
		const days = Math.floor(hours / 24)
	
		if (seconds < 60) return `${seconds} seconds ago`
		if (minutes < 60) return `${minutes} minutes ago`
		if (hours < 24) return `${hours} hours ago`
		return `${days} days ago`
	}

    async function renderFavourites() {

		if (!user) {
			favouritesList.innerHTML = '<li class="empty-message">You are not Logged In, Try to login or Signup and start exploring the unit pages!</li>';
			return;
		}

		const res = await fetch('http://localhost:8888/.netlify/functions/get-favs', {
			method: 'POST',
			header: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				user_id: user.id
			})
		});

		const { data: favs, error } = await res.json();

		if (error) {
			favouritesList.innerHTML = '<li class="empty-message">Failed to fetch history, try to refresh the page!</li>';
			return;
		}

		console.log(favs)
		console.log(JSON.parse(localStorage.getItem("unit_page_favourites") || '[]'))
		
        favouritesList.innerHTML = ''; // Clear loading message

        if (favs.length === 0) {
            favouritesList.innerHTML = '<li class="empty-message">You have no pages marked as favourite yet. Go to a unit page and click "Add to Favourites"!</li>';
            return;
        }

        favs.forEach(item => {
        	const title = item.page_title ? item.page_title : generateTitleFromURL(item.page_id);
            const listItem = document.createElement('li');
            listItem.innerHTML = `
                <a href="${item.page_id}" title="Go to ${title}">${title}</a>
            `;
            favouritesList.appendChild(listItem);
        });
    }

    renderFavourites();
})();