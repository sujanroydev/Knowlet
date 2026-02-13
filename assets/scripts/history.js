(function () {
    const user = JSON.parse(localStorage.getItem("knowletUser"));
    const historyList = document.getElementById('history-list');

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

	async function renderHistory() {
		if (!user) {
			historyList.innerHTML = '<li class="empty-message">You are not Logged In, Try to login or Signup and start exploring the unit pages!</li>';
			return;
		}

		const res = await fetch('https://knowlet.in/.netlify/functions/get-history', {
			method: 'POST',
			header: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				user_id: user.id
			})
		});

		const { data, error } = await res.json();
		if (error) {
			historyList.innerHTML = '<li class="empty-message">Failed to fetch history, try to refresh the page!</li>';
			return;
		}

		let history = [];
		data.forEach((item) => {
			JSON.parse(item.visit_time).forEach((ts) => {
				if (ts) {
					history.push({
						url: item.page_id,
						title: item.page_title,
						timestamp: ts
					})
				}
			});
		});

		history.sort((a, b) => b.timestamp.localeCompare(a.timestamp));

		console.log(history)
		
		historyList.innerHTML = ''; // Clear loading message

        if (history.length === 0) {
            historyList.innerHTML = '<li class="empty-message">Your visit history is empty. Start exploring the unit pages!</li>';
            return;
        }

        let tempUrl, tempTa;
        history.forEach(item => {
			const time = timeAgo(new Date(item.timestamp).getTime());
			if (!(tempUrl === item.url && tempTa === time)) {
				const listItem = document.createElement('li');
				const title = item.title || generateTitleFromURL(item.url)
				listItem.innerHTML = `
	<a href="${item.url}" title="Go to ${title}">${title}</a>
	<span class="timestamp">${time}</span>
				`;
				historyList.appendChild(listItem);
			}
            tempUrl = item.url;
            tempTa = time;
        });
	}
	
    renderHistory();
})();