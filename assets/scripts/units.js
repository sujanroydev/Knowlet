// Create UI on load
renderNavBar();
renderFeedbackSection();

let selectedRating = 0;        // user's chosen star (1..5)
let hoverRating = 0;             // hover preview

const pageId = (window.location.href + '').replace('.html', '')

let btnLike = document.getElementById("btnLike");
const topBar = document.getElementsByClassName("unit-top-bar")[0];
const ratingsBox = document.getElementById("ratings-box");
const commentsBox = document.getElementById("comments-box");
const btnToggleRatings = document.getElementById("btn-toggle-ratings");
const btnToggleComments = document.getElementById("btn-toggle-comments");
const btnPostComment = document.getElementById("btn-post-comment");
const btnSubmitRating = document.getElementById("btn-submit-rating");
const btnClearRating = document.getElementById("clear-rating");

let user = JSON.parse(localStorage.getItem("knowletUser"));

let pageLiked = false;
let pageRated = false;
let commentsHidden = true;
let ratingsHidden = true;
let recentComments = {};

let totalLikes = 0;

const STAR_SVG = `
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M12 .587l3.668 7.431L23.5 9.75l-5.75 5.6L19.336 24 12 20.013 4.664 24l1.585-8.65L.5 9.75l7.832-1.732L12 .587z"/>
    </svg>`;

let likesAndRatings, comments;
let myLikesAndRatings, myCommenst;

btnSubmitRating.addEventListener("click", submitRating);

btnClearRating.addEventListener("click", () => {
	selectedRating=0;
	hoverRating=0;
	updateStarVis();
});

function isLogged() {
    if (!user) {
        setTimeout(() => {
            window.location.href = "../../../../login_signup.html";
        }, 60000);
    } 
}

function toggleComments() {
    if (commentsHidden) {
        commentsBox.style.display = 'block';
        btnToggleComments.textContent = "Hide Comments";
        commentsHidden = false;
    } else {
        commentsBox.style.display = 'none'
        btnToggleComments.textContent = "Show Comments";
        commentsHidden = true;
    }
}

function toggleRatings() {
    if (ratingsHidden) {
        ratingsBox.style.display = 'block';
        btnToggleRatings.textContent = "Hide Ratings";
        ratingsHidden = false;
    } else {
        ratingsBox.style.display = 'none'
        btnToggleRatings.textContent = "Show Ratings";
        ratingsHidden = true;
    }
}

// Average star visual (fractional filling)

function renderAverageStars(avg) {
    const count = 5;
    const wrapper = document.getElementById("avg-stars");
    // create back and front groups of 5 stars
    const back = document.createElement("div");
    back.className = "back";
    const front = document.createElement("div");
    front.className = "front";

    for (let i=0;i<count;i++){
        const s1 = document.createElement("div");
        s1.innerHTML = STAR_SVG;
        back.appendChild(s1);
        const s2 = document.createElement("div");
        s2.innerHTML = STAR_SVG;
        front.appendChild(s2);
    }

    wrapper.innerHTML = "";
    wrapper.appendChild(back);
    wrapper.appendChild(front);

    // set width of front to match avg fraction (0..100%)
    const pct = Math.max(0, Math.min(1, avg / 5));
    wrapper.querySelector(".front").style.width = (pct * 100) + "%";
    wrapper.setAttribute("aria-label", `Average rating ${avg.toFixed(2)} out of 5`);
}

function renderInteractiveStars() {
    const container = document.getElementById("star-input");
    container.innerHTML = "";
    for (let i = 1; i <= 5; i++) {
        const span = document.createElement("span");
        span.className = "star empty";
        span.setAttribute("role", "radio");
        span.setAttribute("aria-checked", "false");
        span.setAttribute("data-value", i);
        span.innerHTML = STAR_SVG;
        // events
        span.addEventListener("mouseenter", () => {
            hoverRating = i;
            updateStarVis();
        });
        span.addEventListener("mouseleave", () => {
            hoverRating = 0;
            updateStarVis();
        });
        span.addEventListener("click", () => {
            selectedRating = i;
            updateStarVis();
        });
        span.addEventListener("keydown", (e) => {
            if (e.key === "Enter" || e.key === " ") {
                selectedRating = i;
                updateStarVis();
            }
        });
        container.appendChild(span);
    }
    updateStarVis();
}

function updateStarVis() {
    const stars = document.querySelectorAll("#star-input .star");
    stars.forEach((el, idx) => {
        const v = idx + 1;
        el.classList.remove("filled", "half", "empty");
        if (hoverRating > 0) {
            if (v <= hoverRating) el.classList.add("filled");
            else el.classList.add("empty");
        } else {
            if (v <= selectedRating) el.classList.add("filled");
            else el.classList.add("empty");
        }
        el.setAttribute("aria-checked", (v === selectedRating).toString());
    });

    // Enable/disable submit button based on selection
    document.getElementById("btn-submit-rating").disabled = selectedRating === 0;
}

// Is Liked Or Rated

function isLikedOrRated() {
    r = myLikesAndRatings;
    
    if (r) {
        if (r.page_likes) {
            pageLiked = true;
            btnLike.textContent = "👍 " + totalLikes;
        } else {
            pageLiked = false;
            btnLike.textContent = "👍🏼 " + totalLikes
        }
        if (r.page_ratings) {
            btnSubmitRating.textContent = "Submitted";
            
            pageRated = true;
            selectedRating = r.page_ratings;
            hoverRating = r.page_ratings;
            
            updateStarVis();
        } else {
            btnSubmitRating.textContent = "Submit";
            
            pageRated = false;
            selectedRating = r.page_ratings;
            hoverRating = r.page_ratings;
        }
    }
}

async function loadLikesAndRatings(){
    try {
        const res = await fetch('https://knowlet.in/.netlify/functions/get-likes-ratings', {
        	method: 'POST',
        	header: { 'content-type': 'application/json' },
        	body: JSON.stringify({ pageId: pageId })
        });
        
        if (!res.ok) throw new Error(`Error status: ${res.status}`);
        
        const { data, error } = await res.json();

        const box = document.getElementById("ratings-box");
        const userBox = document.getElementById("user-ratings-box");
        box.innerHTML = "";
        userBox.innerHTML = "";

        if (error) {
            box.innerHTML = `<div class="muted">Error loading ratings</div>`;
            console.error(error);
            return;
        }

        if (!data.length) {
            box.innerHTML = `<div class="muted">No ratings yet</div>`;
            return;
        }

        let count = 0;
        let sum = 0;
        totalLikes = 0;
        
		likesAndRatings = data;  // store likes and ratings for feature use

        data.forEach(r => {
            totalLikes += r.page_likes ? 1 : 0;
			if (r.user.id === (user ? user.id : null)) {
				myLikesAndRatings = r;
			}
			
            if (!r.page_ratings) return;
            count += 1;
            sum += r.page_ratings;
		    
            const div = document.createElement("div");
            div.className = "rating-item";
            div.innerHTML = `
			    <div class="rating-row">
			        <!-- User info -->
			        <div class="user-info">
			            <img 
			                src="${r.user.picture || '/assets/images/demo_pp.png'}" 
			                alt="${escapeHtml(r.user.name)}" 
			                class="avatar"
			            />
			            <div>
			                <div class="user-name">${escapeHtml(r.user.name)}</div>
			                <div class="meta">${new Date(r.created_at).toLocaleString()}</div>
			            </div>
			        </div>
			
			        <!-- Rating + message -->
			        <div class="rating-content">
			            <strong class="rating-score">${r.page_ratings} / 5</strong>
			            <div class="rating-message">
			                ${escapeHtml(r.ratings_message || "")}
			            </div>
			        </div>
			    </div>
            `;
            
            const avg = count ? (sum / count) : 0;
            
            // update average UI
            document.getElementById("avg-number").textContent = count ? avg.toFixed(2) + " / 5" : "—";
            document.getElementById("total-count").textContent = `${count} rating${count !== 1 ? "s" : ""}`;
            renderAverageStars(avg);
            
            // show list
            if (!count) {
                box.innerHTML = `<div class="muted">No ratings yet</div>`;
                return;
            }
            if (r.user.id === (user ? user.id : null)) {
				userBox.appendChild(div);
			} else {
				box.appendChild(div);
			}
        });
        
		btnLike.remove()
		const btnLikeHtml = `<button id="btnLike" class="btn ghost" onclick="likePage(${totalLikes})">👍🏼 ${totalLikes}</button>`
		topBar.insertAdjacentHTML('beforeend', btnLikeHtml)
		btnLike = document.getElementById("btnLike");
		isLikedOrRated()
    } catch (e) {
        console.error(e);
    }
}

async function submitRating() {
	if (!ensureAuthenticated()) return;
    if (!selectedRating || selectedRating < 1 || selectedRating > 5) {
        alert("Choose 1–5 stars first.");
        return;
    }
    
    const msg = document.getElementById("rating-message").value.trim();
    try {
        r = myLikesAndRatings
        if (r) {
            const res = await fetch('https://knowlet.in/.netlify/functions/update-likes-ratings', {
			    method: 'POST',
			    header: { 'content-type': 'application/json' },
			    body: JSON.stringify({
			    	pageId,
			    	userId: user.id,
			    	action: 'rate',
			    	pageRatingsScore: selectedRating,
			    	pageReview: msg
			    })
			});

			const { error } = await res.json();

            if (error) {
                console.error(error);
                alert("Error submitting rating");
                return;
            }
            btnSubmitRating.textContent = "Updated";
        } else {
            const res = await fetch('https://knowlet.in/.netlify/functions/set-likes-ratings', {
			    method: 'POST',
			    header: { 'content-type': 'application/json' },
			    body: JSON.stringify({
			    	pageId,
			    	userId: user.id,
			    	action: 'rate',
			    	pageRatingsScore: selectedRating,
			    	pageReview: msg
			    })
			});
			const { error } = await res.json();
            if (error) {
                console.error(error);
                alert("Error submitting rating");
                return;
            }
            btnSubmitRating.textContent = "Submitted";
        }
        updateStarVis();
        document.getElementById("rating-message").value = "";
        await loadLikesAndRatings();
    } catch (e) {
        console.error(e);
    }
}

async function likePage(oldLikes){
	if (!ensureAuthenticated()) return;
    try {
        if (myLikesAndRatings) {
        	if (myLikesAndRatings.page_likes) {
	        	btnLike.textContent = "👍🏼 " + (totalLikes - 1);
        	} else {
        		btnLike.textContent = "👍 " + (totalLikes + 1);
        	}
            const res = await fetch('https://knowlet.in/.netlify/functions/update-likes-ratings', {
			    method: 'POST',
			    header: { 'content-type': 'application/json' },
			    body: JSON.stringify({
			    	pageId,
			    	userId: user.id,
			    	action: 'like',
			    	pageLiked: !pageLiked
			    })
			});

			const { error } = await res.json();

            if (error) {
                console.error(error);
                alert("Error updating likes");
            }
        } else {
        	btnLike.textContent = "👍 " + (totalLikes + 1);
            const res = await fetch('https://knowlet.in/.netlify/functions/set-likes-ratings', {
			    method: 'POST',
			    header: { 'content-type': 'application/json' },
			    body: JSON.stringify({
			    	pageId,
			    	userId: user.id,
			    	action: 'like'
			    })
			});
			const { error } = await res.json();
            if (error) {
                console.error(error);
                alert("Error submitting Like");
                return;
            }
        }
        await loadLikesAndRatings();
    } catch(e){
        console.error(e)
        alert(e)
    }
}

// Comments functions

async function loadComments() {
    try {
    	// new api copy
        const res = await fetch('https://knowlet.in/.netlify/functions/get-comments', {
        	method: 'POST',
        	header: { 'content-type': 'application/json' },
        	body: JSON.stringify({ pageId: pageId })
        });
        
        if (!res.ok) throw new Error(`Error status: ${res.status}`);
        
        const { data, error } = await res.json();

        const box = document.getElementById("comments-box");
        const userBox = document.getElementById("user-comments-box");
        box.innerHTML = "";
        userBox.innerHTML = "";

        if (error) {
            box.innerHTML = `<div class="muted">Error loading comments</div>`;
            console.error(error);
            return;
        }

        if (!data.length) {
            box.innerHTML = `<div class="muted">No comments yet</div>`;
            return;
        }
        
		comments = data; // store comments for feature use

        data.forEach(c => {
        	let totalCLikes = "";
        	if (true) {
	        	if (recentComments[c.id] === "Liked") {
	        		totalCLikes = `👍 ${c.likes || 0}`;
	        	} else {
	        		totalCLikes = `👍🏼 ${c.likes || 0}`;
	        	}
        	}
            const d = document.createElement("div");
            d.className = "comment-item";
            d.innerHTML = `
			    <div class="comment-row">
			        <!-- User info -->
			        <div class="user-info">
			            <img
			                src="${c.user.picture || '/assets/images/demo_pp.png'}"
			                alt="${escapeHtml(c.user.name)}"
			                class="avatar"
			            />
			            <div>
			                <div class="user-name">${escapeHtml(c.user.name)}</div>
			                <div class="meta">${new Date(c.created_at).toLocaleString()}</div>
			            </div>
			        </div>
			
			        <!-- Comment content -->
			        <div class="comment-content">
			            <div class="comment-text">
			                ${escapeHtml(c.comment_text)}
			            </div>
			
			            <div class="comment-actions">
			                <button
			                    class="btn ghost"
			                    onclick="likeComment(${c.id}, ${c.likes})">
			                    ${totalCLikes}
			                </button>
			            </div>
			        </div>
			    </div>
            `;
            if (c.user.id === (user ? user.id : null)) {
				userBox.appendChild(d);
			} else {
				box.appendChild(d);
			}
        });

    } catch(e){
        console.error(e);
    }
}

async function submitComment(){
	if (!ensureAuthenticated()) return;
    const text = document.getElementById("comment-input").value;
    if (!text.trim()) return;
    try {
		const res = await fetch('https://knowlet.in/.netlify/functions/set-comments', {
		    method: 'POST',
		    header: { 'content-type': 'application/json' },
		    body: JSON.stringify({
		    	pageId,
		    	userId: user.id,
		    	action: 'comment',
		    	commentMessage: text
		    })
		});
		const { error } = await res.json();
        if (error) {
            console.error(error);
            alert("Error posting comment");
            return;
        }
        //alert("Posted");
        btnPostComment.textContent = "Posted"
        document.getElementById("comment-input").value = "";
        await loadComments();
    } catch(e){ console.error(e) }
}

async function likeComment(id, oldLikes){
	if (!ensureAuthenticated()) return;
	let newLikes;
	if (recentComments[id] === "Liked" && Number(oldLikes) >= 1) {
		newLikes = (Number(oldLikes)||0)-1;
		recentComments[id] = "Unliked";
	}
	else {
		newLikes = (Number(oldLikes)||0)+1;
		recentComments[id] = "Liked";
	}

    try {
    	const res = await fetch('https://knowlet.in/.netlify/functions/update-comments', {
		    method: 'POST',
		    header: { 'content-type': 'application/json' },
		    body: JSON.stringify({
		    	commentId: id,
		    	action: 'like',
		    	commentLike: newLikes
		    })
		});

		const { error } = await res.json();

        await loadComments();
    } catch(e){ console.error(e) }
}

// Small helpers

function escapeHtml(text) {
    if (!text) return "";
    return text
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

function ensureAuthenticated() {
    if (!user) {
        const message = "You have to Login or Signup to download the notes or interact with them.\n\nClick OK to Login or Signup.\n\nOtherwise, you will be redirected automatically.";
        if (confirm(message)) {
            window.location.href = "../../../../login_signup.html";
        }
        return false;
    }
    return true;
}

// Wire up UI and init
// build nav bar
function renderNavBar() {
    const currentUrl = window.location.href;
    const currentRootUrl = window.location.origin;
    const match = currentUrl.match(/(\/unit_)(\d+)/i);
    const container = document.querySelector(".container");

	const parts = currentUrl.replace(currentRootUrl, "").replace(".html", "").split("?")[0].split("/");
    
    const parms = `sem=${parts[2]}&sub=${parts[3]}&ppr=${parts[4]}` //`&unit=${parts[5]}`
	const backUrl = `${currentRootUrl}/${parts[1]}?${parms}`

    const topBar = document.createElement("div");
    topBar.className = "unit-top-bar";

    // --- 1. Back Button
    const backBtn = document.createElement("button");
    backBtn.id = "back-btn";
    backBtn.title = "Go Back";
    backBtn.onclick = () => {
        window.location.href = backUrl;
    };
    topBar.appendChild(backBtn);
    
    // --- 2. Previous / Next Unit Buttons (Always Visible, Disabled When Unavailable)
    const prev = document.createElement("a");
    prev.className = "unit-prev";
    const next = document.createElement("a");
    next.className = "unit-next";

    if (match) {
        const base = match[1];
        const currentNum = parseInt(match[2]);
        
        // Previous
        if (currentNum > 1) {
            prev.href = currentUrl.replace(/\/unit_\d+/i, `${base}${currentNum - 1}`);
            prev.title = `Previous Unit (${currentNum - 1})`;
        } else {
            prev.classList.add("disabled");
            prev.title = "No Previous Unit";
        }

        // Next
        if (currentNum < 5) {
            next.href = currentUrl.replace(/\/unit_\d+/i, `${base}${currentNum + 1}`);
            next.title = `Next Unit (${currentNum + 1})`;
        } else {
            next.classList.add("disabled");
            next.title = "No Next Unit";
        }
    }

    topBar.appendChild(prev);
    topBar.appendChild(next);

    // --- 3. Favourite Button
    const FAV_KEY = "unit_page_favourites";
    const favBtn = document.createElement("button");
    favBtn.id = "fav-btn";
    favBtn.title = "Add to Favourites";

    function getFavourites() {
        return JSON.parse(localStorage.getItem(FAV_KEY) || "[]");
    }

    function isFavourite(url) {
        return getFavourites().some(item => item.url === url);
    }

    function toggleFavourite() {
        let favs = getFavourites();
        const index = favs.findIndex(item => item.url === currentUrl);

        if (index >= 0) {
            favs.splice(index, 1);
        } else {
            favs.push({ url: currentUrl, title: document.title });
        }

        localStorage.setItem(FAV_KEY, JSON.stringify(favs));
        renderFavouriteState();
    }

    function renderFavouriteState() {
        const favActive = isFavourite(currentUrl);
        favBtn.classList.toggle("favourited", favActive);
        favBtn.title = favActive ? "Remove from Favourites" : "Add to Favourites";
    }

    favBtn.onclick = toggleFavourite;
    renderFavouriteState();
    topBar.appendChild(favBtn);
    
    // trace history
    const HISTORY_KEY = 'unit_page_history';
    const pageTitle = document.title;

    function updateHistory() {
        let history = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
        
        const newEntry = { url: currentUrl, title: pageTitle, timestamp: new Date().toISOString() };

        history = history.filter(item => item.url !== newEntry.url); // <-- CORRECTED LINE
        history.unshift(newEntry);
                
        const maxHistorySize = 15;
        
        if (history.length > maxHistorySize) {
                history.length = maxHistorySize;
        }

        localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    }

    updateHistory();

    // --- 4. Keep Screen On Button
    const screenBtn = document.createElement("button");
    screenBtn.id = "keep-screen-on-btn";
    screenBtn.title = "Keep Screen On";
    topBar.appendChild(screenBtn);
    
    // --- 5. Download button
    btnDownload = `<button onclick="printDiv('container')" style="margin: 0; font-size: 1.9rem">⬇️</button>`;
    topBar.insertAdjacentHTML('beforeend', btnDownload);
    
    // --- 6. Like Button 
    const btnLike = `<button id="btnLike" class="btn ghost" onclick="likePage(0)">👍🏼 0</button>`
    topBar.insertAdjacentHTML('beforeend', btnLike);
    
    // --- Functions 

    let wakeLock = null;

    async function toggleWakeLock() {
        if (!("wakeLock" in navigator)) {
            alert("Wake Lock API not supported.");
            return;
        }

        if (!wakeLock) {
            try {
                wakeLock = await navigator.wakeLock.request("screen");
                screenBtn.classList.add("active");
                screenBtn.title = "Allow Screen Sleep";

                wakeLock.addEventListener("release", () => {
                    screenBtn.classList.remove("active");
                    screenBtn.title = "Keep Screen On";
                    wakeLock = null;
                });
            } catch (err) {
                console.error(err);
            }
        } else {
            await wakeLock.release();
            wakeLock = null;
            screenBtn.classList.remove("active");
            screenBtn.title = "Keep Screen On";
        }
    }

    screenBtn.onclick = toggleWakeLock;

    document.body.insertBefore(topBar, document.body.firstChild);

    let hideTimeout;

    function showTopBar() {
        topBar.classList.add("visible");
        clearTimeout(hideTimeout);
        hideTimeout = setTimeout(() => {
            topBar.classList.remove("visible");
        }, 3000); // Hide after 3s of inactivity
    }

    showTopBar();

    ["mousemove", "scroll", "touchstart", "keydown"].forEach(event => {
        document.addEventListener(event, showTopBar, { passive: true });
    });
}

// build ui
function renderFeedbackSection() {
    const app = document.getElementById("app");
    app.innerHTML = `
        <div class="supcontainer">
            <div class="supcard">
                <h1 style='font-size:20px; margin:0 0 8px;'>Comments & Ratings</h1>
                <h2 id='h3' style='font-size:16px; margin:0 0 14px; color:69707a;'>Star Rating, Average, and Clean UI</h2>
        
                <!-- Hidden page id (change value if embedding) -->
                <input type="hidden" id="page-id" value="simple_test_page">
        
                <!-- Rating row -->
                <div style="margin:14px 0;" class="supcard">
                    <div class="row" style="justify-content:space-between;">
                        
                        <div class="rating-widget" style="margin-top:8px; flex-direction:column; align-items:flex-start;">
                            <div style="display:flex; gap:6px; align-items:center;">
                                <div id="star-input" class="stars" aria-label="Rate 1 to 5 stars" role="radiogroup">
                                    <!-- stars added by JS -->
                                </div>
                                <button id="btn-submit-rating" class="btn">Submit</button>
                                <button id="clear-rating" class="btn ghost">Clear</button>
                            </div>
                        
                            <textarea id="rating-message" placeholder="Write a message (optional)..." style="margin-top:10px; width:95%; min-height:60px; padding:10px; border-radius:8px; border:1px solid var(--border); font-size:14px;"></textarea>
                        </div>
                        
                        <div style="text-align:right;">
                            <div class="muted">Average rating</div>
                            <div style="margin-top:8px;" class="rating-summary">
                                <div id="avg-stars" class="avg-stars" aria-hidden="true"></div>
                                <div>
                                    <div style="font-weight:700; font-size:16px;" id="avg-number">—</div>
                                    <div class="muted" id="total-count">0 ratings</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
        
                <!-- Add comment -->
                <div class="supcard comment-area">
                    <div class="muted">Post a comment</div>
                    <textarea id="comment-input" placeholder="Write a comment..."></textarea>
                    <div style="margin-top:10px; display:flex; gap:10px; justify-content:flex-end">
                        <button id="btn-post-comment" class="btn" onclick="submitComment()">Post</button>
                    </div>
                </div>
        
                <!-- Ratings list -->
                <div class="supcard">
                    <h2 id='h3' style="margin-bottom:8px; font-size:16px; margin:0 0 14px; color:69707a;">Ratings</h2>
                    <div id="user-ratings-box"></div>
                    <button id="btn-toggle-ratings" class="btn" onclick="toggleRatings()" style="margin-bottom: 5px">Show Ratings</button>
                    <div id="ratings-box" style="display:none"></div>
                </div>
        
                <!-- Comments list -->
                <div class="supcard">
                    <h2 id='h3' style="margin-bottom:8px; font-size:16px; margin:0 0 14px; color:69707a;">Comments</h2>
                    <div id="user-comments-box"></div>
                    <button id="btn-toggle-comments" class="btn" onclick="toggleComments()" style="margin-bottom: 5px">Show Comments</button>
                    <div id="comments-box" style="display:none"></div>
                </div>
            </div>
        </div>        
    `;

    
}

// add water mark
function printDiv(divClass) {
    const noteContainer = document.getElementsByClassName(divClass)[0];
    if (!noteContainer) return;

    const printedOn = new Date().toLocaleDateString();

    const printContent = `
        <style>
            /* The Watermark Container */
            .watermark {
                position: fixed;
                top: 50%;         /* Move to vertical center */
                left: 50%;        /* Move to horizontal center */
                transform: translate(-50%, -50%); /* Offset by its own size to center perfectly */
                opacity: 0.05;     /* Keep it very light so text remains readable */
                z-index: 1000;    /* Push it far behind the content */
                width: 80%;       /* Make it big */
                display: flex;
                justify-content: center;
                align-items: center;
            }

            .watermark h5 {
                font-size: 150px;
            }

            /* Ensure the text content stays on top and is visible */
            .content-area {
                position: relative;
                z-index: 1;
            }

            @media screen {
                .watermark { display: none; }
            }
        </style>

        <div class="content-area">
            ${noteContainer.innerHTML}
        </div>

        <div class="watermark">
            <h5>Knowlet</h5>
        </div>

        <hr style="margin-top: 50px;">
        <p style="font-size: 12px; text-align: center; position: relative; z-index: 2;">
            Visit: <a href="https://knowlet.in">https://knowlet.in</a> (Knowlet)
            <br>
            Email: <a href="mailto:knowlet.study@gmail.com">knowlet.study@gmail.com</a>
            <br>
            Printed on: ${printedOn}
        </p>
    `;

    document.body.innerHTML = printContent;
    
    window.print();
}

// Load User Info 
isLogged();

// Render interactive stars and load data
renderInteractiveStars();

// initial loads
loadLikesAndRatings();
loadComments();