(function () {
    const user = JSON.parse(localStorage.getItem("knowletUser"));
    const historyList = document.getElementById('history-list');

    async function renderHistory() {
        if (!user) {
            historyList.innerHTML = '<li class="empty-message">You are not Logged In, Try to login or Signup and start exploring the unit pages!</li>';
            return;
        }

        try {
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

            history.sort((a, b) => {
                const dateA = a.timestamp ?? "";
                const dateB = b.timestamp ?? "";
                return dateB.localeCompare(dateA);
            });

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
        } catch(err) {
            console.error(err);
            historyList.innerHTML = '<li class="empty-message">Failed to fetch data</li>';
        }
    }
    
    renderHistory();
})();