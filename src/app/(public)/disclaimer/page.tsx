import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Disclaimer | Knowlet",

  description:
    "Read Knowlet's official disclaimer regarding its educational purpose, content accuracy, AI-generated information, and responsible use.",

  alternates: {
    canonical: "https://knowlet.in/disclaimer",
  },

  openGraph: {
    title: "Disclaimer | Knowlet",
    description:
      "Official disclaimer regarding the purpose, educational resources, and responsible use of Knowlet.",
    url: "https://knowlet.in/disclaimer",
    siteName: "Knowlet",
    type: "website",
  },

  twitter: {
    card: "summary",
    title: "Disclaimer | Knowlet",
    description:
      "Official disclaimer regarding the purpose, educational resources, and responsible use of Knowlet.",
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function DisclaimerPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border pb-6 mb-8">
        <div className="max-w-4xl mx-auto px-5 pt-10">
          <h1 className="text-3xl md:text-4xl font-bold">Disclaimer</h1>
          <p className="text-muted-foreground mt-2">
            Our official disclaimer about Knowlet's purpose, content accuracy,
            and responsible use.
          </p>
          <p className="text-muted-foreground text-sm mt-2">
            Last updated: September 4, 2026
          </p>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-5 py-14 space-y-8">
        <section className="bg-card rounded-2xl shadow-md border border-border p-6 md:p-8">
          <h2 className="text-lg font-semibold text-primary mb-3">
            1. Purpose of Knowlet
          </h2>

          <p className="text-foreground leading-relaxed">
            Knowlet is an educational and informational platform intended to
            provide study materials, educational resources, learning tools, and
            other services that may support students and learners. Knowlet is
            not a replacement for teachers, educational institutions,
            professional advice, or official academic sources.
          </p>
        </section>

        <section className="bg-card rounded-2xl shadow-md border border-border p-6 md:p-8">
          <h2 className="text-lg font-semibold text-primary mb-3">
            2. Educational Information
          </h2>

          <p className="text-foreground leading-relaxed">
            The information and resources available through Knowlet are provided
            primarily for educational and informational purposes. Educational
            requirements, syllabi, examination rules, and other academic
            information may change over time. Users should verify important
            information against official or authoritative sources when
            necessary.
          </p>
        </section>

        <section className="bg-card rounded-2xl shadow-md border border-border p-6 md:p-8">
          <h2 className="text-lg font-semibold text-primary mb-3">
            3. Accuracy and Completeness
          </h2>

          <p className="text-foreground leading-relaxed">
            We make reasonable efforts to provide useful and accurate
            information, but we cannot guarantee that every resource is
            completely accurate, current, complete, or free from errors. Knowlet
            should not be treated as the sole source of information for
            important academic, professional, legal, financial, medical, or
            other decisions.
          </p>
        </section>

        <section className="bg-card rounded-2xl shadow-md border border-border p-6 md:p-8">
          <h2 className="text-lg font-semibold text-primary mb-3">
            4. AI-Generated Content
          </h2>

          <p className="text-foreground leading-relaxed">
            Certain Knowlet features may use artificial intelligence to generate
            explanations, summaries, questions, study assistance,
            recommendations, or other content. AI-generated content can contain
            mistakes, outdated information, or misleading statements.
          </p>

          <p className="text-foreground leading-relaxed mt-2">
            Users should independently verify AI-generated information before
            relying on it, particularly when accuracy is important.
          </p>
        </section>

        <section className="bg-card rounded-2xl shadow-md border border-border p-6 md:p-8">
          <h2 className="text-lg font-semibold text-primary mb-3">
            5. User Responsibility
          </h2>

          <p className="text-foreground leading-relaxed">
            Users are responsible for how they use information and resources
            obtained through Knowlet. Users should exercise reasonable judgment,
            follow applicable laws and academic rules, and verify information
            when appropriate.
          </p>
        </section>

        <section className="bg-card rounded-2xl shadow-md border border-border p-6 md:p-8">
          <h2 className="text-lg font-semibold text-primary mb-3">
            6. Responsible Use
          </h2>

          <p className="text-foreground leading-relaxed">
            Knowlet must not be used for unlawful, harmful, abusive, fraudulent,
            disruptive, or unauthorized activities. Users must also respect the
            intellectual property, privacy, and other rights of individuals and
            organizations.
          </p>
        </section>

        <section className="bg-card rounded-2xl shadow-md border border-border p-6 md:p-8">
          <h2 className="text-lg font-semibold text-primary mb-3">
            7. Third-Party Content and Services
          </h2>

          <p className="text-foreground leading-relaxed">
            Knowlet may contain links to or rely on third-party services and
            resources. Third-party content and services are controlled by their
            respective providers and may be subject to separate terms and
            privacy policies. Knowlet does not necessarily endorse or guarantee
            the accuracy or availability of third-party content.
          </p>
        </section>

        <section className="bg-card rounded-2xl shadow-md border border-border p-6 md:p-8">
          <h2 className="text-lg font-semibold text-primary mb-3">
            8. Availability and Technical Issues
          </h2>

          <p className="text-foreground leading-relaxed">
            We aim to keep Knowlet available and functional, but temporary
            interruptions, maintenance, technical problems, data loss, or other
            service disruptions may occur. Features and resources may also be
            changed, updated, suspended, or removed over time.
          </p>
        </section>

        <section className="bg-card rounded-2xl shadow-md border border-border p-6 md:p-8">
          <h2 className="text-lg font-semibold text-primary mb-3">
            9. Data and Privacy
          </h2>

          <p className="text-foreground leading-relaxed">
            Knowlet may collect and process information necessary to provide and
            maintain its services. The collection and use of personal
            information are described in our Privacy Policy.
          </p>
        </section>

        <section className="bg-card rounded-2xl shadow-md border border-border p-6 md:p-8">
          <h2 className="text-lg font-semibold text-primary mb-3">
            10. Intellectual Property
          </h2>

          <p className="text-foreground leading-relaxed">
            Knowlet&apos;s branding, software, design, interface, and other
            original materials are protected by applicable intellectual property
            laws. Users should not reproduce, distribute, modify, or
            commercially exploit protected Knowlet materials without appropriate
            authorization.
          </p>
        </section>

        <section className="bg-card rounded-2xl shadow-md border border-border p-6 md:p-8">
          <h2 className="text-lg font-semibold text-primary mb-3">
            11. Limitation of Responsibility
          </h2>

          <p className="text-foreground leading-relaxed">
            Knowlet provides its services and resources in good faith and to the
            extent permitted by applicable law. We are not responsible for
            losses, damages, or consequences resulting from reliance on
            information provided through the platform, technical interruptions,
            inaccuracies, or other circumstances beyond our reasonable control.
          </p>
        </section>

        <section className="bg-card rounded-2xl shadow-md border border-border p-6 md:p-8">
          <h2 className="text-lg font-semibold text-primary mb-3">
            12. Exam and Academic Use
          </h2>

          <p className="text-foreground leading-relaxed">
            Knowlet is designed for learning and preparation purposes. While the
            content aims to align with educational standards, it is the
            user&apos;s responsibility to verify that resources match their
            specific exam board, curriculum, or academic institution&apos;s
            requirements. Knowlet is not an official source for exam
            specifications or official syllabus information.
          </p>
        </section>

        <section className="bg-card rounded-2xl shadow-md border border-border p-6 md:p-8">
          <h2 className="text-lg font-semibold text-primary mb-3">
            13. Changes to This Disclaimer
          </h2>

          <p className="text-foreground leading-relaxed">
            This disclaimer may be updated when Knowlet&apos;s services,
            features, policies, or practices change. The &quot;Last
            updated&quot; date at the top of this page will be updated when
            material changes are made.
          </p>
        </section>
      </main>

      {/* Footer Contact Section */}
      <div className="max-w-4xl mx-auto px-5 py-12">
        <section className="p-6 bg-card rounded-2xl shadow-md border border-border">
          <h2 className="text-lg font-semibold text-primary mb-3">
            14. Contact
          </h2>

          <p className="text-foreground">
            Knowlet
            <br />
            Email: knowlet.official@gmail.com
            <br />
            Website: https://knowlet.in
          </p>
        </section>
      </div>
    </div>
  );
}
