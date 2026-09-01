import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Knowlet",

  description:
    "Learn about Knowlet, an independent learning platform built to help students access, organize, and understand academic resources with a simple and modern experience.",

  alternates: {
    canonical: "https://knowlet.in/about",
  },

  openGraph: {
    title: "About Knowlet",
    description:
      "Learn about Knowlet, its mission, features, development, technology, and AI-powered learning tools.",
    url: "https://knowlet.in/about",
    siteName: "Knowlet",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "About Knowlet",
    description:
      "Learn about Knowlet, its mission, features, development, and AI-powered learning tools.",
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="relative overflow-hidden bg-primary text-primary-foreground py-16 px-6 text-center">
        <h1 className="text-4xl md:text-5xl font-bold tracking-wide">
          About Knowlet
        </h1>

        <p className="mt-3 max-w-2xl mx-auto text-base md:text-lg opacity-90">
          A simple, modern learning platform built to make studying more
          organized, accessible, and productive.
        </p>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-5 py-14 space-y-8">
        {/* Introduction */}
        <section className="bg-card rounded-2xl shadow-md border border-border p-6 md:p-8">
          <h2 className="text-xl font-semibold text-primary mb-3">
            What is Knowlet?
          </h2>

          <p className="leading-relaxed text-foreground">
            Knowlet is an independent web-based learning platform designed
            primarily for students. It provides a structured place to discover,
            organize, read, download, and work with academic resources such as
            notes, previous-year questions, important questions, and study
            materials.
          </p>

          <p className="mt-4 leading-relaxed text-foreground">
            The goal is simple: reduce the friction students face when looking
            for study material and provide a clean learning experience without
            unnecessary complexity.
          </p>
        </section>

        {/* Mission */}
        <section className="bg-card rounded-2xl shadow-md border border-border p-6 md:p-8">
          <h2 className="text-xl font-semibold text-primary mb-3">
            Our Mission
          </h2>

          <p className="leading-relaxed text-foreground">
            Knowlet aims to make academic resources easier to discover, access,
            download, and understand. Instead of forcing students to search
            through scattered files, messages, websites, and folders, Knowlet
            organizes learning resources into a structured academic system.
          </p>

          <p className="mt-4 leading-relaxed text-foreground">
            The platform is built around three principles:
          </p>

          <ul className="mt-4 list-disc pl-5 space-y-2 text-foreground">
            <li>
              <strong>Simplicity</strong> — learning resources should be easy to
              find and use.
            </li>
            <li>
              <strong>Speed</strong> — the interface should remain responsive
              and lightweight.
            </li>
            <li>
              <strong>Organization</strong> — academic content should follow a
              clear structure instead of becoming a collection of random files.
            </li>
          </ul>
        </section>

        {/* What Knowlet Provides */}
        <section className="bg-card rounded-2xl shadow-md border border-border p-6 md:p-8">
          <h2 className="text-xl font-semibold text-primary mb-3">
            What Can You Do With Knowlet?
          </h2>

          <p className="leading-relaxed text-foreground mb-5">
            Knowlet brings several parts of the student learning workflow
            together in one platform.
          </p>

          <ul className="list-disc pl-5 space-y-2 text-foreground">
            <li>Browse organized academic notes and study materials.</li>
            <li>Access previous-year question papers and solutions.</li>
            <li>Find important questions for revision and preparation.</li>
            <li>
              Navigate resources through levels, subjects, papers, and units.
            </li>
            <li>Download study resources for offline access.</li>
            <li>Bookmark useful resources for quick access later.</li>
            <li>Read learning content through a focused reading experience.</li>
            <li>
              Use AI-powered tools to study, explain, summarize, and work with
              content.
            </li>
          </ul>
        </section>

        {/* Knowva */}
        <section className="bg-card rounded-2xl shadow-md border border-border p-6 md:p-8">
          <h2 className="text-xl font-semibold text-primary mb-3">
            Knowva — AI-Powered Learning
          </h2>

          <p className="leading-relaxed text-foreground">
            Knowlet is also being developed with an AI-powered learning
            assistant called <strong>Knowva</strong>. Knowva is designed to make
            AI useful within the learning workflow rather than treating it as a
            separate chatbot.
          </p>

          <p className="mt-4 leading-relaxed text-foreground">
            Depending on the task, students can use AI-assisted features for
            studying, explaining concepts, generating shorter explanations,
            creating learning resources, and interacting with academic content.
          </p>

          <p className="mt-4 leading-relaxed text-foreground">
            The goal is not to replace learning, but to provide students with an
            additional tool for understanding and working with information.
          </p>
        </section>

        {/* Why */}
        <section className="bg-card rounded-2xl shadow-md border border-border p-6 md:p-8">
          <h2 className="text-xl font-semibold text-primary mb-3">
            Why Was Knowlet Created?
          </h2>

          <p className="leading-relaxed text-foreground">
            Students often receive study materials from many different sources:
            classroom groups, messaging apps, cloud storage, websites, PDFs, and
            personal folders. Finding the right material at the right time can
            become unnecessarily difficult.
          </p>

          <p className="mt-4 leading-relaxed text-foreground">
            Knowlet was created to address that problem by building a more
            structured and focused environment for academic resources.
          </p>
        </section>

        {/* Development */}
        <section className="bg-card rounded-2xl shadow-md border border-border p-6 md:p-8">
          <h2 className="text-xl font-semibold text-primary mb-3">
            When Was Knowlet Developed?
          </h2>

          <p className="leading-relaxed text-foreground">
            The initial development of Knowlet took place between{" "}
            <span className="font-semibold">September and October 2025</span>.
          </p>

          <p className="mt-4 leading-relaxed text-foreground">
            Knowlet was officially released on{" "}
            <span className="font-semibold">5 December 2025</span> under the
            domain{" "}
            <a
              href="https://knowlet.in"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary font-semibold underline hover:opacity-80"
            >
              knowlet.in
            </a>
            .
          </p>

          <p className="mt-4 leading-relaxed text-foreground">
            Since its initial release, the platform has continued to evolve
            through new features, architectural improvements, and experiments
            with AI-assisted learning.
          </p>
        </section>

        {/* Developer */}
        <section className="bg-card rounded-2xl shadow-md border border-border p-6 md:p-8">
          <h2 className="text-xl font-semibold text-primary mb-3">
            Who Developed Knowlet?
          </h2>

          <p className="leading-relaxed text-foreground">
            Knowlet is independently developed by{" "}
            <span className="font-semibold">Sujan Roy</span>, a student
            developer interested in software development, web technologies, and
            building practical digital products.
          </p>

          <p className="mt-4 leading-relaxed text-foreground">
            The project is developed independently, with the goal of learning
            through real-world software development while creating something
            useful for students.
          </p>

          <div className="mt-5 flex flex-wrap gap-4 text-primary font-medium">
            <a
              href="https://sujanroy.in"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              Portfolio
            </a>

            <a
              href="https://github.com/sujanroydev"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              GitHub
            </a>

            <a
              href="https://www.linkedin.com/in/sujanroydev"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              LinkedIn
            </a>
          </div>
        </section>

        {/* Technology */}
        <section className="bg-card rounded-2xl shadow-md border border-border p-6 md:p-8">
          <h2 className="text-xl font-semibold text-primary mb-3">
            Technology Behind Knowlet
          </h2>

          <p className="leading-relaxed text-foreground">
            Knowlet is built using modern web technologies with an emphasis on
            performance, maintainability, and a responsive user experience.
          </p>

          <ul className="mt-5 list-disc pl-5 space-y-2 text-foreground">
            <li>
              <strong>Next.js</strong> — application framework and routing.
            </li>
            <li>
              <strong>React</strong> — user interface development.
            </li>
            <li>
              <strong>TypeScript</strong> — type-safe application development.
            </li>
            <li>
              <strong>Tailwind CSS</strong> — responsive interface styling.
            </li>
            <li>
              <strong>Supabase</strong> — database and backend infrastructure.
            </li>
            <li>
              <strong>Google Gemini</strong> — AI capabilities used by Knowva.
            </li>
          </ul>
        </section>

        {/* Design Philosophy */}
        <section className="bg-card rounded-2xl shadow-md border border-border p-6 md:p-8">
          <h2 className="text-xl font-semibold text-primary mb-3">
            Our Approach
          </h2>

          <p className="leading-relaxed text-foreground">
            Knowlet is intentionally designed to avoid unnecessary complexity.
            The interface focuses on readable content, clear navigation, fast
            access to resources, and useful functionality.
          </p>

          <p className="mt-4 leading-relaxed text-foreground">
            At the same time, the underlying architecture is designed to support
            more advanced features as the platform grows.
          </p>
        </section>

        {/* Future */}
        <section className="bg-card rounded-2xl shadow-md border border-border p-6 md:p-8">
          <h2 className="text-xl font-semibold text-primary mb-3">
            What's Next?
          </h2>

          <p className="leading-relaxed text-foreground">
            Knowlet is an ongoing project. Future development is focused on
            improving the learning experience, expanding academic resources,
            strengthening AI-assisted learning, and making the platform more
            useful across different study workflows.
          </p>

          <p className="mt-4 leading-relaxed text-foreground">
            The long-term vision is to build more than a repository of notes:
            Knowlet aims to become a practical learning environment where
            students can discover resources, study them, organize their
            learning, and use intelligent tools when they need additional help.
          </p>
        </section>

        {/* Closing */}
        <section className="bg-primary text-primary-foreground rounded-2xl shadow-md p-6 md:p-8 text-center">
          <h2 className="text-2xl font-bold mb-3">Built for Learning</h2>

          <p className="max-w-2xl mx-auto leading-relaxed opacity-90">
            Knowlet started as an independent student project and continues to
            evolve with the goal of making learning resources more organized,
            accessible, and useful.
          </p>
        </section>
      </main>

      {/* Footer */}
      <footer className="text-center py-8 text-sm text-muted-foreground border-t border-border bg-muted">
        © 2026 Knowlet. All rights reserved.
      </footer>
    </div>
  );
}
