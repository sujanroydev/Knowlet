import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Declaration | Knowlet",

  description:
    "Read Knowlet's official declaration regarding its educational purpose, content accuracy, AI-generated information, and responsible use.",

  alternates: {
    canonical: "https://knowlet.in/declaration",
  },

  openGraph: {
    title: "Declaration | Knowlet",
    description:
      "Official declaration regarding the purpose, educational resources, and responsible use of Knowlet.",
    url: "https://knowlet.in/declaration",
    siteName: "Knowlet",
    type: "website",
  },

  twitter: {
    card: "summary",
    title: "Declaration | Knowlet",
    description:
      "Official declaration regarding the purpose, educational resources, and responsible use of Knowlet.",
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function DeclarationPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-4xl mx-auto px-5 py-10">
        <header className="border-b border-border pb-6 mb-8">
          <h1 className="text-3xl font-bold">Declaration</h1>

          <p className="text-sm text-muted-foreground mt-1">
            Last updated: August 7, 2026
          </p>

          <p className="text-sm text-muted-foreground mt-2">
            This declaration explains the purpose, limitations, and responsible
            use of the educational resources and services provided by Knowlet.
          </p>
        </header>

        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-2">1. Purpose of Knowlet</h2>

          <p className="text-foreground leading-relaxed">
            Knowlet is an educational and informational platform intended to
            provide study materials, educational resources, learning tools, and
            other services that may support students and learners. Knowlet is
            not a replacement for teachers, educational institutions,
            professional advice, or official academic sources.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-2">
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

        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-2">
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

        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-2">
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

        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-2">5. User Responsibility</h2>

          <p className="text-foreground leading-relaxed">
            Users are responsible for how they use information and resources
            obtained through Knowlet. Users should exercise reasonable judgment,
            follow applicable laws and academic rules, and verify information
            when appropriate.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-2">6. Responsible Use</h2>

          <p className="text-foreground leading-relaxed">
            Knowlet must not be used for unlawful, harmful, abusive, fraudulent,
            disruptive, or unauthorized activities. Users must also respect the
            intellectual property, privacy, and other rights of individuals and
            organizations.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-2">
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

        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-2">
            8. Availability and Technical Issues
          </h2>

          <p className="text-foreground leading-relaxed">
            We aim to keep Knowlet available and functional, but temporary
            interruptions, maintenance, technical problems, data loss, or other
            service disruptions may occur. Features and resources may also be
            changed, updated, suspended, or removed over time.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-2">9. Data and Privacy</h2>

          <p className="text-foreground leading-relaxed">
            Knowlet may collect and process information necessary to provide and
            maintain its services. The collection and use of personal
            information are described in our Privacy Policy.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-2">
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

        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-2">
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

        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-2">
            12. Changes to This Declaration
          </h2>

          <p className="text-foreground leading-relaxed">
            This declaration may be updated when Knowlet&apos;s services,
            features, policies, or practices change. The &quot;Last
            updated&quot; date at the top of this page will be updated when
            material changes are made.
          </p>
        </section>

        <section className="mt-10 p-6 bg-card rounded-2xl shadow-sm border border-border">
          <h2 className="text-lg font-semibold mb-2">13. Contact</h2>

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
