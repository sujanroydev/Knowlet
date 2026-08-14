const faqs = [
  {
    q: "Is Knowlet free to use?",
    a: "Yes. All materials are free for students.",
  },
  {
    q: "Can I download study resources?",
    a: "Yes. Supported resources can be downloaded for offline study or viewed directly on Knowlet.",
  },
  {
    q: "What kind of study materials are available?",
    a: "Knowlet provides notes, previous year questions, important questions, and other study resources.",
  },
  {
    q: "Can I access Knowlet anytime?",
    a: "Yes. Knowlet is available online anytime, so you can study whenever you need.",
  },
  {
    q: "Do I need an account to access resources?",
    a: "You can browse and view resources without an account. Some features may require you to sign in.",
  },
];

export default function FAQ() {
  return (
    <section className="py-12 px-4">
      <h2 className="text-center text-blue-900 text-xl font-semibold mb-6">
        Frequently Asked Questions
      </h2>

      <div className="max-w-3xl mx-auto space-y-4">
        {faqs.map((f, i) => (
          <div
            key={i}
            className="bg-white p-5 rounded-xl shadow-sm hover:shadow-md transition"
          >
            <h3 className="font-semibold text-blue-900">{f.q}</h3>
            <p className="text-gray-700 mt-1">{f.a}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
