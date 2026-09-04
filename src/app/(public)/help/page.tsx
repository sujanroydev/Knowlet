import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Help Center | Knowlet",

  description:
    "Get help with using Knowlet, accessing study materials, managing bookmarks, and navigating the platform.",

  alternates: {
    canonical: "https://knowlet.in/help",
  },

  openGraph: {
    title: "Help Center | Knowlet",
    description: "Support and guidance for using Knowlet effectively.",
    url: "https://knowlet.in/help",
    siteName: "Knowlet",
    type: "website",
  },

  twitter: {
    card: "summary",
    title: "Help Center | Knowlet",
    description: "Support and guidance for using Knowlet effectively.",
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function HelpPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border pb-6 mb-8">
        <div className="max-w-4xl mx-auto px-5 pt-10">
          <h1 className="text-3xl md:text-4xl font-bold">Help Center</h1>
          <p className="text-muted-foreground mt-2">
            Get help with using Knowlet, accessing resources, and navigating the
            platform.
          </p>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-5 py-14 space-y-8">
        {/* Section 1 */}
        <section className="bg-card rounded-2xl shadow-md border border-border p-6 md:p-8 mb-8">
          <h2 className="text-xl font-semibold mb-2">
            Install the Knowlet Web App
          </h2>

          <p className="text-muted-foreground mb-4 leading-relaxed">
            This tutorial shows how to install Knowlet on your device for faster
            access.
          </p>

          <ul className="list-disc pl-5 space-y-1 text-foreground mb-6">
            <li>Open Knowlet in your browser</li>
            <li>Scroll to download section</li>
            <li>Select Install Web App or APK</li>
            <li>Confirm install popup</li>
          </ul>

          <div className="aspect-video w-full">
            <iframe
              className="w-full h-full rounded-lg"
              src="https://www.youtube.com/embed/N6p0fq2jSuU"
              allowFullScreen
            />
          </div>
        </section>

        {/* Section 2 */}
        <section className="bg-card rounded-2xl shadow-md border border-border p-6 md:p-8 mb-8\">
          <h2 className="text-xl font-semibold mb-2">
            Create a Knowlet Account
          </h2>

          <p className="text-muted-foreground mb-4 leading-relaxed">
            Learn how to register and access personalised features.
          </p>

          <ul className="list-disc pl-5 space-y-1 text-foreground mb-6">
            <li>Go to profile section</li>
            <li>Click Sign Up</li>
            <li>Enter name, email, password</li>
            <li>Submit form</li>
          </ul>

          <div className="aspect-video w-full">
            <iframe
              className="w-full h-full rounded-lg"
              src="https://www.youtube.com/embed/JmjlW5EyMUU"
              allowFullScreen
            />
          </div>
        </section>

        {/* Section 3: Features Guide */}
        <section className="bg-card rounded-2xl shadow-md border border-border p-6 md:p-8 mb-8">
          <h2 className="text-xl font-semibold mb-4">Key Features</h2>

          <div className="space-y-4">
            <div className="border-l-4 border-primary pl-4">
              <h3 className="font-semibold text-foreground mb-1">Bookmarks</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Save your favorite resources for quick access later. You can
                organize bookmarks by subject or topic to keep your learning
                organized.
              </p>
            </div>

            <div className="border-l-4 border-primary pl-4">
              <h3 className="font-semibold text-foreground mb-1">
                Search & Discovery
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Use our powerful search feature to find study materials,
                questions, and resources across all subjects. Filter by
                difficulty level and type to find exactly what you need.
              </p>
            </div>

            <div className="border-l-4 border-primary pl-4">
              <h3 className="font-semibold text-foreground mb-1">Library</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Access your personal library of resources. Keep track of all the
                materials you've collected and easily manage your learning
                collection.
              </p>
            </div>

            <div className="border-l-4 border-primary pl-4">
              <h3 className="font-semibold text-foreground mb-1">
                History & Progress
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                View your learning history and track your progress. Knowlet
                helps you understand which topics you've studied and your
                performance over time.
              </p>
            </div>

            <div className="border-l-4 border-primary pl-4">
              <h3 className="font-semibold text-foreground mb-1">
                Notifications
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Stay updated with important notifications about new resources,
                updates, and personalized learning recommendations.
              </p>
            </div>
          </div>
        </section>

        {/* Section 4: FAQ */}
        <section className="bg-card rounded-2xl shadow-md border border-border p-6 md:p-8 mb-8">
          <h2 className="text-xl font-semibold mb-4">
            Frequently Asked Questions
          </h2>

          <div className="space-y-4">
            <details className="border-b border-border pb-4 cursor-pointer">
              <summary className="font-semibold text-foreground hover:text-primary transition">
                How do I reset my password?
              </summary>
              <p className="text-muted-foreground text-sm mt-2 leading-relaxed">
                Click on "Forgot Password" on the sign-in page. Enter your email
                address and follow the instructions sent to your email to reset
                your password.
              </p>
            </details>

            <details className="border-b border-border pb-4 cursor-pointer">
              <summary className="font-semibold text-foreground hover:text-primary transition">
                Can I access Knowlet offline?
              </summary>
              <p className="text-muted-foreground text-sm mt-2 leading-relaxed">
                Knowlet is primarily web-based, but you can install it as a web
                app for faster access. Some features may require an internet
                connection.
              </p>
            </details>

            <details className="border-b border-border pb-4 cursor-pointer">
              <summary className="font-semibold text-foreground hover:text-primary transition">
                How do I report a problem with a resource?
              </summary>
              <p className="text-muted-foreground text-sm mt-2 leading-relaxed">
                You can report issues using the report button on each resource
                page. Provide details about the problem so our team can
                investigate.
              </p>
            </details>

            <details className="border-b border-border pb-4 cursor-pointer">
              <summary className="font-semibold text-foreground hover:text-primary transition">
                Is my data private and secure?
              </summary>
              <p className="text-muted-foreground text-sm mt-2 leading-relaxed">
                Yes, we take privacy seriously. Your data is encrypted and
                securely stored. Read our Privacy Policy for more details about
                how we handle your information.
              </p>
            </details>

            <details className="border-b border-border pb-4 cursor-pointer">
              <summary className="font-semibold text-foreground hover:text-primary transition">
                How can I contribute resources to Knowlet?
              </summary>
              <p className="text-muted-foreground text-sm mt-2 leading-relaxed">
                We welcome community contributions. Contact us through our
                support email to learn about how you can contribute quality
                resources to our platform.
              </p>
            </details>
          </div>
        </section>

        {/* Section 5: Troubleshooting */}
        <section className="bg-card rounded-2xl shadow-md border border-border p-6 md:p-8 mb-8">
          <h2 className="text-xl font-semibold mb-4">Troubleshooting</h2>

          <div className="space-y-4">
            <details className="border-b border-border pb-4 cursor-pointer">
              <summary className="font-semibold text-foreground hover:text-primary transition">
                The app is loading slowly
              </summary>
              <p className="text-muted-foreground text-sm mt-2 leading-relaxed">
                Clear your browser cache and cookies. Check your internet
                connection and try refreshing the page. Disable any browser
                extensions that might interfere with loading.
              </p>
            </details>

            <details className="border-b border-border pb-4 cursor-pointer">
              <summary className="font-semibold text-foreground hover:text-primary transition">
                Videos are not playing
              </summary>
              <p className="text-muted-foreground text-sm mt-2 leading-relaxed">
                Ensure you have a stable internet connection. Check if
                JavaScript is enabled in your browser. Try using a different
                browser or device to isolate the issue.
              </p>
            </details>

            <details className="border-b border-border pb-4 cursor-pointer">
              <summary className="font-semibold text-foreground hover:text-primary transition">
                I can't find a specific resource
              </summary>
              <p className="text-muted-foreground text-sm mt-2 leading-relaxed">
                Try using different keywords in the search. Adjust filters like
                subject and difficulty level. Check if the resource is in your
                library or bookmarks.
              </p>
            </details>

            <details className="border-b border-border pb-4 cursor-pointer">
              <summary className="font-semibold text-foreground hover:text-primary transition">
                App crashes or freezes
              </summary>
              <p className="text-muted-foreground text-sm mt-2 leading-relaxed">
                Close and reopen the app. Ensure your device has sufficient
                storage and memory. Uninstall and reinstall the app if the issue
                persists.
              </p>
            </details>
          </div>
        </section>

        {/* Section 6: Tips & Tricks */}
        <section className="bg-card rounded-2xl shadow-md border border-border p-6 md:p-8 mb-8">
          <h2 className="text-xl font-semibold mb-4">Tips & Tricks</h2>

          <ul className="space-y-3 list-disc pl-5 text-foreground">
            <li>
              Use the dark mode for comfortable reading during night study
              sessions
            </li>
            <li>Create bookmarks for frequently used resources to save time</li>
            <li>
              Explore different subjects to discover new learning materials
            </li>
            <li>
              Enable notifications to stay updated about new resources in your
              interests
            </li>
            <li>Review your history to track which topics you've covered</li>
            <li>
              Use filters in search to narrow down results by subject or
              difficulty
            </li>
          </ul>
        </section>

        {/* Section 7: Support */}
        <section className="bg-card rounded-2xl shadow-md border border-border p-6 md:p-8">
          <h2 className="text-xl font-semibold mb-2">Need More Help?</h2>

          <p className="text-muted-foreground mb-6 leading-relaxed">
            If you couldn't find the answer you're looking for, we're here to
            help. Check out our other resources or reach out to our support
            team.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <a
              href="/privacy"
              className="block p-4 border border-border rounded-lg hover:bg-accent transition"
            >
              <h3 className="font-semibold text-foreground mb-1">
                Privacy Policy
              </h3>
              <p className="text-muted-foreground text-sm">
                Learn how we handle your data
              </p>
            </a>

            <a
              href="/terms"
              className="block p-4 border border-border rounded-lg hover:bg-accent transition"
            >
              <h3 className="font-semibold text-foreground mb-1">
                Terms & Conditions
              </h3>
              <p className="text-muted-foreground text-sm">
                Review our terms of service
              </p>
            </a>

            <a
              href="/about"
              className="block p-4 border border-border rounded-lg hover:bg-accent transition"
            >
              <h3 className="font-semibold text-foreground mb-1">About Us</h3>
              <p className="text-muted-foreground text-sm">
                Learn more about Knowlet
              </p>
            </a>

            <div className="p-4 border border-border rounded-lg">
              <h3 className="font-semibold text-foreground mb-1">
                Contact Support
              </h3>
              <p className="text-muted-foreground text-sm">
                Email us at knowlet.official@gmail.com
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
