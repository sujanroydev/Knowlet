(function () {
    const HISTORY_KEY = 'unit_page_history';
    const historyList = document.getElementById('history-list');

    // Helper function to format the timestamp
    function formatTime(timestamp) {
        if (!timestamp) return '';
        const date = new Date(timestamp);
        return date.toLocaleString();
    }

    function renderHistory() {
        const history = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
        historyList.innerHTML = ''; // Clear loading message

        if (history.length === 0) {
            historyList.innerHTML = '<li class="empty-message">Your visit history is empty. Start exploring the unit pages!</li>';
            return;
        }

        history.forEach(item => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `
    <a href="${item.url}" title="Go to ${item.title}">${item.title}</a>
    <span class="timestamp">Visited: ${formatTime(item.timestamp)}</span>
            `;
            historyList.appendChild(listItem);
        });
    }

    renderHistory();
})();