import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms and Conditions | Knowlet",

  description:
    "Read the terms and conditions governing your use of Knowlet, including accounts, content, acceptable use, and our services.",

  alternates: {
    canonical: "https://knowlet.in/terms-and-conditions",
  },

  openGraph: {
    title: "Terms and Conditions | Knowlet",
    description:
      "Terms and conditions governing the use of Knowlet and its services.",
    url: "https://knowlet.in/terms-and-conditions",
    siteName: "Knowlet",
    type: "website",
  },

  twitter: {
    card: "summary",
    title: "Terms and Conditions | Knowlet",
    description:
      "Terms and conditions governing the use of Knowlet and its services.",
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function TermsAndConditionsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-4xl mx-auto px-5 py-10">
        <header className="border-b border-border pb-6 mb-8">
          <h1 className="text-3xl font-bold">Terms and Conditions</h1>

          <p className="text-sm text-muted-foreground mt-1">
            Last updated: August 7, 2026
          </p>

          <p className="text-sm text-foreground mt-2">
            By accessing or using Knowlet, you agree to these Terms and
            Conditions. If you do not agree with these terms, please do not use
            the service.
          </p>
        </header>

        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-2">1. Using Knowlet</h2>
          <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
            <li>Use Knowlet only for lawful purposes.</li>
            <li>
              Do not upload harmful, abusive, illegal, or malicious content.
            </li>
            <li>Do not attempt to gain unauthorized access to the service.</li>
            <li>Do not interfere with, disrupt, or damage the platform.</li>
            <li>
              Do not scrape, copy, or misuse platform data without permission.
            </li>
            <li>Do not use the service to violate the rights of others.</li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-2">2. Accounts</h2>
          <p className="text-muted-foreground mb-2">
            Some Knowlet features may require an account. You are responsible
            for maintaining the security of your account and for activities
            performed through it.
          </p>

          <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
            <li>Provide accurate and up-to-date information.</li>
            <li>Keep your login credentials secure.</li>
            <li>
              Do not share your account in a way that compromises its security.
            </li>
            <li>
              Notify us if you suspect unauthorized access to your account.
            </li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-2">3. User Content</h2>
          <p className="text-muted-foreground">
            You retain ownership of content you create or upload to Knowlet. By
            using the service, you grant Knowlet the limited permission
            necessary to store, process, display, and transmit that content for
            the purpose of providing and improving the service.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-2">
            4. Knowlet Content and Intellectual Property
          </h2>
          <p className="text-muted-foreground">
            Knowlet&apos;s branding, logo, design, software, interface, and
            other original platform materials are owned by or licensed to
            Knowlet and may not be copied, modified, distributed, or used
            without appropriate permission.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-2">5. Educational Content</h2>
          <p className="text-muted-foreground">
            Knowlet provides educational materials for informational and
            learning purposes. We do not guarantee that all content is complete,
            accurate, current, or suitable for every academic requirement. You
            are responsible for verifying information before relying on it for
            academic or other important decisions.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-2">
            6. AI-Generated Content
          </h2>
          <p className="text-muted-foreground">
            Some Knowlet features may use artificial intelligence to generate
            responses, explanations, summaries, questions, or other content.
            AI-generated content may contain errors or inaccuracies and should
            not be treated as guaranteed factual information.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-2">7. Privacy</h2>
          <p className="text-muted-foreground">
            Your use of Knowlet is also governed by our Privacy Policy, which
            explains how we collect, use, store, and protect information.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-2">
            8. Third-Party Services
          </h2>
          <p className="text-muted-foreground">
            Knowlet may rely on third-party services for functions such as
            authentication, hosting, analytics, storage, email, or other
            infrastructure. Third-party services may have their own terms and
            privacy policies. We are not responsible for services that we do not
            control.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-2">9. Availability</h2>
          <p className="text-muted-foreground">
            We aim to keep Knowlet available and reliable, but we do not
            guarantee uninterrupted or error-free access. Features, content,
            services, or availability may change, be suspended, or be removed at
            any time.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-2">10. Termination</h2>
          <p className="text-muted-foreground">
            We may suspend or terminate access to Knowlet if you violate these
            terms, misuse the service, create security risks, or engage in
            unlawful activity. You may also stop using the service at any time.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-2">11. Disclaimer</h2>
          <p className="text-muted-foreground">
            Knowlet is provided on an &quot;as is&quot; and &quot;as
            available&quot; basis to the extent permitted by applicable law. We
            do not guarantee that the service or its content will always be
            accurate, complete, secure, or available.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-2">
            12. Limitation of Liability
          </h2>
          <p className="text-muted-foreground">
            To the extent permitted by applicable law, Knowlet and its operators
            will not be responsible for indirect, incidental, consequential, or
            other losses arising from your use of or inability to use the
            service.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-2">
            13. Changes to These Terms
          </h2>
          <p className="text-muted-foreground">
            We may update these Terms and Conditions from time to time. When
            significant changes are made, we may update the date shown at the
            top of this page. Your continued use of Knowlet after changes take
            effect constitutes acceptance of the updated terms.
          </p>
        </section>

        <section className="mt-10 p-6 bg-card rounded-2xl shadow-sm border border-card">
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
