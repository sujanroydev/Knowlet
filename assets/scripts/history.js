class HistoryManager {
    constructor() {
        this.user = JSON.parse(localStorage.getItem("knowletUser"));
        this.historyList = document.getElementById('history-list');
    }

    async render() {
        if (!this.user) {
            this.historyList.innerHTML = '<li class="empty-message">You are not Logged In, Try to login or Signup and start exploring the unit pages!</li>';
            return;
        }

        try {
            const res = await fetch('https://knowlet.in/.netlify/functions/get-history', {
                method: 'POST',
                header: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    user_id: this.user.id
                })
            });
    
            const { data, error } = await res.json();

            if (error) {
                this.historyList.innerHTML = '<li class="empty-message">Failed to fetch history, try to refresh the page!</li>';
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

            this.historyList.innerHTML = ''; // Clear loading message
    
            if (history.length === 0) {
                this.historyList.innerHTML = '<li class="empty-message">Your visit history is empty. Start exploring the unit pages!</li>';
                return;
            }
    
            let tempUrl, tempTa;
            history.forEach(item => {
                const time = Utils.timeAgo(new Date(item.timestamp).getTime());
                if (!(tempUrl === item.url && tempTa === time)) {
                    const listItem = document.createElement('li');
                    const title = item.title || Utils.generateTitleFromURL(item.url)
                    listItem.innerHTML = `
    <a href="${item.url}" title="Go to ${title}">${title}</a>
    <span class="timestamp">${time}</span>
                    `;
                    this.historyList.appendChild(listItem);
                }
                tempUrl = item.url;
                tempTa = time;
            });
        } catch(err) {
            console.error(err);
            this.historyList.innerHTML = '<li class="empty-message">Failed to fetch data</li>';
        }
    }
};

new HistoryManager().render();
