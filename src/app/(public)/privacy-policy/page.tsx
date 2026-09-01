import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Knowlet",

  description:
    "Read Knowlet's Privacy Policy to understand how we collect, use, store, and protect personal information and user content.",

  alternates: {
    canonical: "https://knowlet.in/privacy-policy",
  },

  openGraph: {
    title: "Privacy Policy | Knowlet",
    description:
      "Learn how Knowlet collects, uses, stores, and protects user information.",
    url: "https://knowlet.in/privacy-policy",
    siteName: "Knowlet",
    type: "website",
  },

  twitter: {
    card: "summary",
    title: "Privacy Policy | Knowlet",
    description:
      "Learn how Knowlet collects, uses, stores, and protects user information.",
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-4xl mx-auto px-5 py-10">
        <header className="border-b border-border pb-6 mb-8">
          <h1 className="text-3xl font-bold">Privacy Policy</h1>

          <p className="text-sm text-muted-foreground mt-1">
            Last updated: August 7, 2026
          </p>

          <p className="text-sm text-foreground mt-2">
            This Privacy Policy explains how Knowlet collects, uses, stores, and
            protects information when you use our services.
          </p>
        </header>

        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-2">
            1. Information We Collect
          </h2>

          <p className="text-muted-foreground mb-3">
            We collect information that you provide directly and information
            generated when you use Knowlet.
          </p>

          <h3 className="font-semibold mb-1">1.1 Information You Provide</h3>

          <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
            <li>Account information such as name and email address.</li>
            <li>Profile information that you choose to provide.</li>
            <li>
              Notes, uploads, bookmarks, and other user-generated content.
            </li>
            <li>Messages or information you send to us for support.</li>
          </ul>

          <h3 className="font-semibold mt-4 mb-1">
            1.2 Information Collected Automatically
          </h3>

          <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
            <li>IP address and basic technical information.</li>
            <li>Browser, device, and operating system information.</li>
            <li>Pages, features, and interactions with the service.</li>
            <li>Log and diagnostic information.</li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-2">
            2. How We Use Your Information
          </h2>

          <p className="text-muted-foreground mb-2">
            We may use collected information for purposes including:
          </p>

          <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
            <li>Providing and maintaining Knowlet.</li>
            <li>Creating and managing user accounts.</li>
            <li>Storing and displaying user content.</li>
            <li>Providing AI-powered features and responses.</li>
            <li>Improving features, performance, and user experience.</li>
            <li>
              Detecting abuse, fraud, security issues, and unauthorized
              activity.
            </li>
            <li>
              Sending important service, account, or security notifications.
            </li>
            <li>Complying with applicable legal obligations.</li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-2">3. AI Features</h2>

          <p className="text-muted-foreground">
            Knowlet may provide AI-powered features such as explanations,
            summaries, questions, study assistance, or other generated content.
            Information submitted to these features may be processed by the
            third-party AI providers we use to provide the requested
            functionality.
          </p>

          <p className="text-muted-foreground mt-2">
            AI-generated responses may contain errors or inaccuracies. You
            should avoid submitting sensitive information unless it is necessary
            for the feature you are using.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-2">
            4. Cookies and Similar Technologies
          </h2>

          <p className="text-muted-foreground">
            Knowlet may use cookies, local storage, and similar technologies to
            maintain authentication, remember preferences, improve
            functionality, and understand how the service is used.
          </p>

          <p className="text-muted-foreground mt-2">
            Some cookies or technologies may be provided by third-party services
            used by Knowlet.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-2">
            5. Sharing and Disclosure
          </h2>

          <p className="text-muted-foreground mb-2">
            We do not sell your personal information. We may share information
            when reasonably necessary for the following purposes:
          </p>

          <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
            <li>
              Service providers that help operate Knowlet, such as hosting,
              storage, authentication, analytics, email, or AI providers.
            </li>
            <li>To comply with applicable laws or legal requests.</li>
            <li>To investigate security incidents, fraud, or abuse.</li>
            <li>
              In connection with a merger, acquisition, restructuring, or
              transfer of business assets.
            </li>
            <li>With your consent or at your direction.</li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-2">6. Data Retention</h2>

          <p className="text-muted-foreground">
            We retain information for as long as reasonably necessary to provide
            our services, maintain legitimate business records, resolve
            disputes, prevent abuse, and comply with legal obligations.
          </p>

          <p className="text-muted-foreground mt-2">
            When information is no longer required, we may delete it or
            anonymize it where reasonably appropriate.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-2">7. Data Security</h2>

          <p className="text-muted-foreground">
            We use reasonable technical and organizational measures to protect
            information from unauthorized access, alteration, disclosure, or
            destruction.
          </p>

          <p className="text-muted-foreground mt-2">
            However, no online service or method of electronic transmission is
            completely secure, and we cannot guarantee absolute security.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-2">8. Your Rights</h2>

          <p className="text-muted-foreground mb-2">
            Depending on applicable law, you may have rights including:
          </p>

          <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
            <li>Request access to personal information we hold about you.</li>
            <li>Request correction of inaccurate information.</li>
            <li>Request deletion of your personal information.</li>
            <li>Withdraw consent where processing is based on consent.</li>
            <li>
              Request a copy or portability of certain information where
              applicable.
            </li>
            <li>Object to or restrict certain processing where applicable.</li>
          </ul>

          <p className="text-muted-foreground mt-2">
            To make a privacy-related request, contact us using the information
            provided below.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-2">
            9. Account and Content Deletion
          </h2>

          <p className="text-muted-foreground">
            You may request deletion of your account or personal information by
            contacting us. Some information may need to be retained where
            required by law, necessary for security, or reasonably required to
            resolve disputes and enforce our agreements.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-2">
            10. Third-Party Services
          </h2>

          <p className="text-muted-foreground">
            Knowlet may use third-party services for infrastructure,
            authentication, analytics, email, storage, AI processing, and other
            functionality. These providers may process information according to
            their own privacy policies and applicable agreements.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-2">
            11. Children&apos;s Privacy
          </h2>

          <p className="text-muted-foreground">
            Knowlet is not intended for children under the age of 13. We do not
            knowingly collect personal information from children under 13. If
            you believe that a child has provided personal information to us,
            please contact us so that we can take appropriate action.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-2">
            12. International Data Processing
          </h2>

          <p className="text-muted-foreground">
            Depending on the services and infrastructure we use, your
            information may be processed or stored in countries other than your
            own. Where required, we take reasonable steps to ensure that such
            processing is carried out in accordance with applicable laws.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-2">
            13. Changes to This Privacy Policy
          </h2>

          <p className="text-muted-foreground">
            We may update this Privacy Policy from time to time. When changes
            are made, we will update the &quot;Last updated&quot; date shown at
            the top of this page. Continued use of Knowlet after changes take
            effect means you acknowledge the updated policy.
          </p>
        </section>

        <section className="mt-10 p-6 bg-card rounded-2xl shadow-sm border border-border">
          <h2 className="text-lg font-semibold mb-2">Contact</h2>

          <p className="text-muted-foreground">
            Email: knowlet.official@gmail.com
            <br />
            Website: https://knowlet.in
          </p>
        </section>
      </div>
    </div>
  );
}
