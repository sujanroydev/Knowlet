(function () {
    const user = JSON.parse(localStorage.getItem("knowletUser"));
    const favouritesList = document.getElementById('favourites-list');

    async function renderFavourites() {

        if (!user) {
            favouritesList.innerHTML = '<li class="empty-message">You are not Logged In, Try to login or Signup and start exploring the unit pages!</li>';
            return;
        }

        try {
            const res = await fetch('https://knowlet.in/.netlify/functions/get-interactions?action=favs', {
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
                favouritesList.innerHTML = '<li class="empty-message">Failed to fetch data, try to refresh the page!</li>';
                return;
            }

            favs.sort((a, b) => {
                const dateA = a.interactions_time.faved_at ?? "";
                const dateB = b.interactions_time.faved_at ?? "";
                return dateB.localeCompare(dateA);
            });

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
        } catch(err) {
            console.error(err);
            favouritesList.innerHTML = '<li class="empty-message">Failed to fetch data</li>';
        }
    }

    renderFavourites();
})();