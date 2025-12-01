function buildUI() {
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
                <button id="submit-rating-btn" class="btn">Submit</button>
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
            <button class="btn" onclick="submitComment()">Post Comment</button>
          </div>
        </div>
    
        <!-- Ratings list -->
        <div class="supcard">
          <h2 id='h3' style="margin-bottom:8px; font-size:16px; margin:0 0 14px; color:69707a;">Ratings</h2>
          <div id="ratings-box"></div>
        </div>
    
        <!-- Comments list -->
        <div class="supcard">
          <h2 id='h3' style="margin-bottom:8px; font-size:16px; margin:0 0 14px; color:69707a;">Comments</h2>
          <div id="comments-box"></div>
        </div>
      </div>
    </div>    
  `;

  
}

// Create UI on load
buildUI();

const SUPABASE_URL = "https://ampwczxrfpbqlkuawrdf.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFtcHdjenhyZnBicWxrdWF3cmRmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI3OTk4MzYsImV4cCI6MjA3ODM3NTgzNn0.hFib9Y5x02b5VWjKuNi1XkUYvycmrp0DQhnwNkOGJEU";

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

let selectedRating = 0;    // user's chosen star (1..5)
let hoverRating = 0;       // hover preview

const pageId = (window.location.href + '').replace('.html', '')
//const pageId = "https://knowlet.netlify.app/notes/semester_1/biotechnology/dsc_101/unit_1"

let btnLike = document.getElementById("btnLike");
const topBar = document.getElementsByClassName("unit-top-bar")[0];
  
let user = JSON.parse(localStorage.getItem("knowletUser"));

let isLiked = false;
let isRated = false;

const STAR_SVG = `
  <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <path d="M12 .587l3.668 7.431L23.5 9.75l-5.75 5.6L19.336 24 12 20.013 4.664 24l1.585-8.65L.5 9.75l7.832-1.732L12 .587z"/>
  </svg>`;

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
  document.getElementById("submit-rating-btn").disabled = selectedRating === 0;
}

//Average star visual (fractional filling)

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

//User Functions 

function userAccount() {
  if (!user) {
    const name = prompt('What is your name?');
    const id = name.split(' ')[0] + "@" + parseInt(Math.random() * 9000 + 1000);
    
    user = {
      id: id,
      name: name
    };
    
    localStorage.setItem("knowletUser", JSON.stringify(user));
  } 
}

async function loadUserInfo() {
  try {
    const { data, error } = await supabase
      .from("user")
      .select("*")
      .eq("id", user.id)

    if (error) {
      alert("Error loading your data")
      console.error(error);
      return;
    }
    if (data[0]) {
      r = data[0];
      /*alert(`
        Name: ${r.name}
        ID: ${r.id}
        Email: ${r.email}
        Age: ${r.age}
        Create At: ${r.created_at}
        Class: ${r.class}
        Fv Sub: ${r.fv_subject}
      `)*/
    } else {
      await submitUserInfo();
    }
  } catch (e) {
    console.error(e);
  }
}

async function submitUserInfo() {
  try {
    const { error } = await supabase.from("user").insert({
      id: user.id,
      name: user.name//,
      //email: user.email,
      //age: 19,
      //class: user.vlass,
      //fv_subject: user.fv_subject
    });
    if (error) {
      console.error(error);
      alert("Error submitting rating");
      return;
    }
  } catch (e) {
    console.error(e);
  }
}

//Is Liked Or Rated

async function isLikedOrRated() {
  try {
    const { data,  error } = await supabase
        .from("ratings")
        .select("*")
        .eq("page_id", pageId)
        .eq("user_id", user.id);
    
    r = data[0];
    //alert(r)
    if (r) {
      if (r.page_likes !== 0) {
        isLiked = true;
      } else {
        isLiked = false;
      }
      if (r.page_ratings !== 0) {
        isRated = true;
      } else {
        isRated = false;
      }
    } 
  } catch(e) {
    console.log(e);
  }
}

//Rating Functions 

async function loadRatings(){
  try {
    const { data, error } = await supabase
      .from("ratings")
      .select("id, page_ratings, page_likes, ratings_message, created_at")
      .eq("page_id", pageId)
      .order("created_at", { ascending: false });

    const box = document.getElementById("ratings-box");
    box.innerHTML = "";

    if (error) {
      box.innerHTML = `<div class="muted">Error loading ratings</div>`;
      console.error(error);
      return;
    }

    let count = 0;
    let sum = 0; 
    
    data.forEach(r => {
      if (!r.page_ratings) return;
      count += 1;
      sum += r.page_ratings;
      
      const div = document.createElement("div");
      div.className = "rating-item";
      div.innerHTML = `
        <div style="display:flex; justify-content:space-between; gap:12px; align-items:center;">
          <div>
            <strong>${r.page_ratings} / 5</strong>
            <div class="meta" style="margin-top:4px">${new Date(r.created_at).toLocaleString()}</div>
          </div>
          <div style="text-align:right">
            <div style="margin-bottom:6px">${escapeHtml(r.ratings_message || "")}</div>
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
      box.appendChild(div);
    });
  } catch (e) {
    console.error(e);
  }
}

async function submitRating() {
  //const pageId = pageId;
  if (!selectedRating || selectedRating < 1 || selectedRating > 5) {
    alert("Choose 1–5 stars first.");
    return;
  }
  //const msg = ""; // optionally can prompt for message, currently left blank
  const msg = document.getElementById("rating-message").value.trim();
  try {
    const { error } = await supabase
        .from("ratings")
        .insert({
          page_id: pageId,
          page_ratings: selectedRating,
          page_likes: 0,
          ratings_message: msg,
          user_id: user.id
        });
    if (error) {
      console.error(error);
      alert("Error submitting rating");
      return;
    }
    // reset selection and refresh
    selectedRating = 0; hoverRating = 0;
    updateStarVis();
    document.getElementById("rating-message").value = "";
    await loadRatings();
  } catch (e) {
    console.error(e);
  }
}

async function likeRating(oldLikes){
  alert('Liked')
  /*try {
    const { error } = await supabase
      .from("ratings")
      .update({ page_likes: (Number(oldLikes) || 0) + 1 })
      .eq("id", id);
    if (error) console.error(error);
    await loadRatings();
  } catch(e){ console.error(e) }*/
}

//Like page

async function likePage(oldLikes){
  //alert('Liked')
  try {
    const { data, error } = await supabase
      .from("ratings")
      .select("page_likes")
      .eq("user_id", user.id)
      .eq("page_id", pageId);
    if (error) console.error(error);
    
    r = data[0];
    if (r) {
      const { error } = await supabase
        .from("ratings")
        .update({ page_likes: isLiked ? 0 : 1 })
        .eq("user_id", user.id)
        .eq("page_id", pageId);
        
      if (error) {
        console.error(error);
        alert("Error updating likes")
      }
      await loadPageLikes();
      await isLikedOrRated();
    } else {
      //alert('not found')
      try {
        const { error } = await supabase
            .from("ratings")
            .insert({
              page_id: pageId,
              page_likes: 1,
              user_id: user.id
            });
        
        if (error) {
          console.error(error);
          alert("Error submitting Like");
          return;
        }
        await loadPageLikes();
        await isLikedOrRated();
      } catch (e) {
        console.error(e);
      }
    }
  } catch(e){
    console.error(e)
    alert(e)
  }
}

async function loadPageLikes() {
  try {
    const { data, error } = await supabase
        .from("ratings")
        .select("page_likes")
        .eq("page_id", pageId)
        
    totalLikes = 0;
    data.forEach(r => {
      totalLikes += r.page_likes;
    })
    btnLike.remove()
    const btnLikeHtml = `<button id="btnLike" class="btn ghost" onclick="likePage(${totalLikes})">👍 ${totalLikes}</button>`
    topBar.insertAdjacentHTML('beforeend', btnLikeHtml)
    btnLike = document.getElementById("btnLike");
  } catch(e) {
    console.log(e);
  }
}

//loadPageLikes()

//Comments functions

async function loadComments() {
  //const pageId = pageId;
  try {
    const { data, error } = await supabase
       .from("comments")
       .select("id, comment_text, likes, created_at")
       .eq("page_id", pageId)
       .order("created_at", { ascending: false });

    const box = document.getElementById("comments-box");
    box.innerHTML = "";

    if (error) {
      box.innerHTML = `<div class="muted">Error loading comments</div>`;
      console.error(error);
      return;
    }

    if (!data.length) {
      box.innerHTML = `<div class="muted">No comments yet</div>`;
      return;
    }

    data.forEach(c => {
      const d = document.createElement("div");
      d.className = "comment-item";
      d.innerHTML = `
        <div><div style="margin-bottom:8px">${escapeHtml(c.comment_text)}</div>
          <div class="meta" style="display:flex; gap:12px; align-items:center;">
            <small>${new Date(c.created_at).toLocaleString()}</small>
            <button class="btn ghost" onclick="likeComment(${c.id}, ${c.likes})">👍 ${c.likes || 0}</button>
          </div>
        </div>
      `;
      box.appendChild(d);
    });

  } catch(e){
    console.error(e);
  }
}

async function submitComment(){
  const text = document.getElementById("comment-input").value;
  if (!text.trim()) return;
  //const pageId = pageId;
  const payload = { page_id: pageId, comment_text: text, likes: 0 };
  try {
    const { error } = await supabase.from("comments").insert(payload);
    if (error) {
      console.error(error);
      alert("Error posting comment");
      return;
    }
    document.getElementById("comment-input").value = "";
    await loadComments();
  } catch(e){ console.error(e) }
}

async function likeComment(id, oldLikes){
  try {
    await supabase
      .from("comments")
      .update({ likes: (Number(oldLikes)||0)+1 })
      .eq("id", id);
    await loadComments();
  } catch(e){ console.error(e) }
}

//Small helpers

function escapeHtml(text) {
  if (!text) return "";
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

//Wire up UI and init

document.getElementById("submit-rating-btn").addEventListener("click", submitRating);
document.getElementById("clear-rating").addEventListener("click", ()=>{ selectedRating=0; hoverRating=0; updateStarVis(); });

//Load User Info 
userAccount();
loadUserInfo();
isLikedOrRated();
loadPageLikes();
// Render interactive stars and load data
renderInteractiveStars();

// initial loads
//submitUserInfo();

loadRatings();
loadComments();