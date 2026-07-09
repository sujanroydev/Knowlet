export default function MailPage() {
  return (
    <main className="mx-auto max-w-3xl p-6">
      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold">📧 Send Email</h1>
        <p className="mt-1 text-sm text-gray-500">Send a single email.</p>

        <form className="mt-6 space-y-5">
          <div>
            <label htmlFor="to" className="mb-2 block text-sm font-medium">
              To
            </label>

            <input
              id="to"
              type="email"
              placeholder="user@example.com"
              className="w-full rounded-lg border px-4 py-2 outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label htmlFor="subject" className="mb-2 block text-sm font-medium">
              Subject
            </label>

            <input
              id="subject"
              type="text"
              placeholder="Welcome to Knowlet"
              className="w-full rounded-lg border px-4 py-2 outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label htmlFor="body" className="mb-2 block text-sm font-medium">
              Body
            </label>

            <textarea
              id="body"
              rows={12}
              placeholder="Write your email..."
              className="w-full rounded-lg border px-4 py-3 outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="rounded-lg bg-blue-600 px-5 py-2.5 text-white transition hover:bg-blue-700"
            >
              Send Email
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
