export default function WelcomePage() {
  return (
    <main className="min-h-screen bg-background px-6 py-10">
      <div className="mx-auto flex max-w-5xl flex-col gap-8">
        {/* Hero */}
        <section className="overflow-hidden rounded-[32px] bg-gradient-to-br from-blue-600 to-indigo-700 p-8 text-white shadow-xl md:p-12">
          <div className="max-w-2xl space-y-5">
            <span className="inline-flex rounded-full bg-white/15 px-4 py-1 text-sm font-medium backdrop-blur-sm">
              Welcome to Knowlet
            </span>

            <h1 className="text-4xl font-black leading-tight md:text-6xl">
              Your Study Space,
              <br />
              Organized Better.
            </h1>

            <p className="text-base leading-7 text-blue-100 md:text-lg">
              Access notes, PYQs, PDFs, important questions, and structured
              semester resources in one clean learning platform.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <a
                href="/library"
                className="rounded-2xl bg-white text-black px-6 py-3 text-sm font-semibold transition hover:scale-[1.02]"
              >
                Explore Library
              </a>

              <a
                href="/"
                className="rounded-2xl border border-white/30 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/20"
              >
                Go to Home
              </a>

              {/* <a
                href="/profile"
                className="rounded-2xl border border-white/30 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/20"
              >
                Complete Profile
              </a> */}

              <a
                href="settings/password/set"
                className="rounded-2xl border border-white/30 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/20"
              >
                Set Password
              </a>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="grid gap-5 md:grid-cols-3">
          {[
            {
              title: "Structured Notes",
              desc: "Semester, subject, paper, and unit based organization for faster learning.",
              icon: "📚",
            },
            {
              title: "Bookmarks & History",
              desc: "Save resources and continue learning from where you stopped.",
              icon: "🔖",
            },
            {
              title: "Clean Reading Experience",
              desc: "Focused layouts optimized for long study sessions and mobile reading.",
              icon: "✨",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-3xl border border-border bg-card p-6 shadow-sm"
            >
              <div className="mb-4 text-4xl">{item.icon}</div>

              <h2 className="text-lg font-bold text-foreground">
                {item.title}
              </h2>

              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                {item.desc}
              </p>
            </div>
          ))}
        </section>

        {/* Steps */}
        <section className="rounded-[32px] border border-border bg-card p-8 shadow-sm">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-foreground">Get Started</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Complete these steps to personalize your experience.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {[
              {
                step: "01",
                title: "Complete Profile",
                desc: "Add your academic details and preferences.",
              },
              {
                step: "02",
                title: "Explore Resources",
                desc: "Browse notes, PYQs, and study materials.",
              },
              {
                step: "03",
                title: "Start Learning",
                desc: "Bookmark and continue your study journey.",
              },
            ].map((item) => (
              <div key={item.step} className="rounded-3xl">
                <span className="text-sm font-bold text-primary">
                  {item.step}
                </span>

                <h3 className="mt-3 text-lg font-semibold text-foreground">
                  {item.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
