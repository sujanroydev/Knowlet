import type { Metadata } from "next";
import { Mail, MessageSquare, Bug, Lightbulb } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact Us | Knowlet",
  description:
    "Get in touch with Knowlet for questions, suggestions, feedback, or issues with study materials.",
};

const contactOptions = [
  {
    icon: MessageSquare,
    title: "General Questions",
    description:
      "Have a question about Knowlet or how to use the platform? Feel free to reach out.",
  },
  {
    icon: Lightbulb,
    title: "Suggestions & Feedback",
    description:
      "Have an idea that could make Knowlet better? We would love to hear your suggestions.",
  },
  {
    icon: Bug,
    title: "Report an Issue",
    description:
      "Found an incorrect note, broken link, technical problem, or something that doesn't work as expected?",
  },
];

export default function ContactPage() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "Contact Knowlet",
    description:
      "Contact Knowlet for questions, feedback, suggestions, or support.",
    url: "https://knowlet.in/contact",
    isPartOf: {
      "@type": "WebSite",
      name: "Knowlet",
      url: "https://knowlet.in/contact",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schema),
        }}
      />

      <main className="min-h-screen bg-background text-foreground">
        {/* Hero */}
        <section className="mx-auto max-w-4xl px-4 pb-12 pt-16 text-center sm:px-6">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-accent text-primary">
            <Mail className="h-6 w-6" />
          </div>

          <h1 className="mt-6 text-3xl font-bold tracking-tight sm:text-4xl">
            Get in touch with us
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
            Have a question, suggestion, or found an issue with Knowlet?
            We&apos;re always happy to hear from you.
          </p>
        </section>

        {/* Contact Card */}
        <section className="mx-auto max-w-5xl px-4 pb-16 sm:px-6">
          <div className="grid gap-6 lg:grid-cols-3">
            {contactOptions.map((option) => {
              const Icon = option.icon;

              return (
                <div
                  key={option.title}
                  className="rounded-2xl border border-border bg-card p-6"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent text-primary">
                    <Icon className="h-5 w-5" />
                  </div>

                  <h2 className="mt-5 text-lg font-semibold">{option.title}</h2>

                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {option.description}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Email Section */}
        <section className="border-y border-border bg-muted/40">
          <div className="mx-auto max-w-3xl px-4 py-14 text-center sm:px-6">
            <h2 className="text-2xl font-semibold">Email us</h2>

            <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-muted-foreground">
              For questions, feedback, corrections, or other inquiries, you can
              contact us directly by email.
            </p>

            <a
              href="mailto:knowlet.official@gmail.com"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
            >
              <Mail className="h-4 w-4" />
              knowlet.official@gmail.com
            </a>
          </div>
        </section>

        {/* Resource Correction */}
        <section className="mx-auto max-w-3xl px-4 py-14 text-center sm:px-6">
          <h2 className="text-xl font-semibold">
            Found an error in a resource?
          </h2>

          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            If you notice incorrect information, missing content, formatting
            problems, or a broken resource, please let us know. Include the
            resource name and a short description of the issue so we can review
            it.
          </p>

          <a
            href="mailto:knowlet.official@gmail.com?subject=Knowlet%20Resource%20Issue"
            className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
          >
            Report a resource issue
          </a>
        </section>
      </main>
    </>
  );
}
