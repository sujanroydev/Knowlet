# Knowlet

<div align="center">

## 📚 Free Notes & Study Materials Platform for College Students

### Built with Next.js, Supabase & Modern Web Technologies

🌐 https://knowlet.in

</div>

---

# 📖 About Knowlet

Knowlet is a modern educational platform designed to provide free, structured, and accessible study materials for college students. The platform organizes notes, PDFs, previous year questions, important questions, and academic resources into a clean hierarchical structure for easier learning and navigation.

Knowlet focuses on:

- Fast and distraction-free reading experience
- Structured academic content organization
- Student-friendly UI/UX
- Bookmarking and personalized learning
- Scalable educational content management
- Mobile-first responsive design

The platform supports subjects across multiple disciplines including:

- Mathematics
- Physics
- Computer Science
- Statistics
- Economics
- Political Science
- Education
- Zoology
- Botany
- Alternative English
- And more

---

# ✨ Features

## 📚 Academic Library System

- Structured content hierarchy:
  - Level → Subject → Paper → Unit → Resource
- Dynamic routing using catch-all slug system
- Rich HTML note rendering
- Resource categorization:
  - Notes
  - PDFs
  - PYQs
  - Important Questions

---

## 🔐 Authentication System

- Email OTP authentication
- Forgot password flow
- Secure OTP hashing
- Session persistence
- User profile management

---

## ❤️ Reader Features

- Like resources
- Bookmark/save resources
- View history tracking
- Reading statistics
- Delayed history logging for accurate analytics
- Responsive top navigation reader UI

---

## 📊 Analytics & Engagement

- Resource view counting
- Likes count
- Bookmarks count
- Ratings system
- View history optimization

---

## ⚡ Performance Optimizations

- App Router architecture
- Optimized database queries
- Parallel RPC fetching
- Responsive layouts
- Lazy loading support
- Optimized navigation structure

---

## 📱 Responsive Design

- Mobile-first design
- Bottom navigation for mobile
- Fixed responsive top bar
- Dynamic viewport height handling
- Touch-friendly UI

---

# 🛠 Tech Stack

| Category       | Technology      |
| -------------- | --------------- |
| Frontend       | Next.js 15      |
| Language       | TypeScript      |
| Styling        | Tailwind CSS    |
| Backend        | Supabase        |
| Database       | PostgreSQL      |
| Authentication | Custom OTP Auth |
| Email Service  | Resend          |
| Icons          | Lucide React    |
| Notifications  | Sonner          |
| Hosting        | Vercel          |
| Legacy Hosting | Netlify         |

---

# 📂 Project Structure

```bash
src/
│
├── app/
│   ├── api/
│   ├── auth/
│   ├── library/
│   ├── bookmarks/
│   ├── history/
│   ├── public/
│   └── ...
│
├── components/
│
├── context/
│
├── lib/
│
└── utils/
```

---

# 🗂 Database Structure

## Core Tables

### users

Stores user information and authentication data.

### resources

Stores academic resources such as notes, PDFs, and PYQs.

### subjects

Academic subjects.

### papers

Subject papers/semesters.

### units

Unit-wise organization.

### bookmarks

Stores saved/bookmarked resources.

### likes

Tracks liked resources.

### ratings

Stores user ratings.

### view_history

Tracks reading history and engagement.

### password_reset_otps

Secure OTP reset flow support.

---

# 🚀 Getting Started

## 1️⃣ Clone Repository

```bash
git clone https://github.com/your-username/knowlet.git
```

---

## 2️⃣ Install Dependencies

```bash
npm install
```

---

## 3️⃣ Setup Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

SUPABASE_SERVICE_ROLE_KEY=

RESEND_API_KEY=

NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

---

## 4️⃣ Run Development Server

```bash
npm run dev
```

---

## 5️⃣ Open in Browser

```bash
http://localhost:3000
```

---

# 🔑 Environment Variables

| Variable                      | Description              |
| ----------------------------- | ------------------------ |
| NEXT_PUBLIC_SUPABASE_URL      | Supabase project URL     |
| NEXT_PUBLIC_SUPABASE_ANON_KEY | Public Supabase key      |
| SUPABASE_SERVICE_ROLE_KEY     | Server-side admin access |
| RESEND_API_KEY                | Email sending service    |
| NEXT_PUBLIC_SITE_URL          | Base website URL         |

---

# 🔐 Authentication Flow

## Sign Up

1. User enters email
2. OTP generated
3. OTP hashed and stored
4. Verification email sent
5. User verified

---

## Forgot Password

1. User submits email
2. Old OTPs removed
3. New OTP generated
4. OTP email sent
5. User verifies OTP
6. Password updated securely

---

# 📖 Reader System

The reader system includes:

- Dynamic resource loading
- Bookmark state management
- Like toggling
- View tracking
- Reading analytics
- Responsive reading layout

The reader context manages:

```ts
liked;
bookmarked;
toggleLike();
toggleBookmark();
loadResStats();
```

---

# 📈 Resource Statistics

Knowlet uses optimized PostgreSQL RPC functions:

## `get_resource_counts()`

Returns:

```json
{
  "views_count": 0,
  "likes_count": 0,
  "comments_count": 0,
  "saved_count": 0,
  "rating_avg": 0
}
```

---

## `get_user_states()`

Returns:

```json
{
  "liked": false,
  "saved": false,
  "rated": false,
  "my_rating": 0
}
```

---

# 🎨 UI Highlights

- Clean academic interface
- Gradient layouts
- Modern card-based navigation
- Mobile bottom navigation
- Responsive toasts
- Fixed reader topbar
- Optimized spacing system

---

# 📱 Public Pages

Knowlet includes:

- About
- Help
- Declaration
- Privacy Policy
- Terms & Conditions
- Custom 404 Page

---

# ⚙️ Deployment

## Vercel Deployment

```bash
vercel
```

---

## Build Production

```bash
npm run build
```

---

## Start Production

```bash
npm start
```

---

# 🧠 Future Improvements

Planned features:

- AI-generated summaries
- Advanced search system
- Offline support
- Progressive Web App (PWA)
- Resource commenting
- Collaborative notes
- Admin dashboard
- Recommendation engine
- Smart learning analytics

---

# 🤝 Contributing

Contributions are welcome.

## Steps

1. Fork repository
2. Create feature branch
3. Commit changes
4. Push branch
5. Create pull request

---

# 📜 License

This project is licensed under the MIT License.

---

# 👨‍💻 Developer

Developed by **Sujan Roy** https://sujanroy.in

🌐 https://knowlet.in

---

# ⭐ Support

If you like the project:

- Star the repository
- Share Knowlet with students
- Contribute improvements
- Report bugs
- Suggest features

---

# 📬 Contact

For support, suggestions, or collaboration:

🌐 https://knowlet.in
