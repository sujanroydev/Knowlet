(function () {
    const FAVOURITES_KEY = 'unit_page_favourites';
    const favouritesList = document.getElementById('favourites-list');

    function renderFavourites() {
        const favs = JSON.parse(localStorage.getItem(FAVOURITES_KEY) || '[]');
        favouritesList.innerHTML = ''; // Clear loading message

        if (favs.length === 0) {
            favouritesList.innerHTML = '<li class="empty-message">You have no pages marked as favourite yet. Go to a unit page and click "Add to Favourites"!</li>';
            return;
        }

        favs.forEach(item => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `
                <a href="${item.url}" title="Go to ${item.title}">${item.title}</a>
            `;
            favouritesList.appendChild(listItem);
        });
    }

    renderFavourites();
})();