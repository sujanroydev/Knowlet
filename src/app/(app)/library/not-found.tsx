import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-xl rounded-3xl border border-border bg-card p-10 shadow-xl text-center">
        <div className="mb-6 text-7xl">📚</div>

        <h1 className="text-4xl font-bold text-foreground mb-4">
          Content Not Found
        </h1>

        <p className="text-muted-foreground text-lg leading-8 mb-8">
          The note, PYQ, or study material you are looking for does not exist,
          may have been removed, or the URL is incorrect.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/library"
            className="rounded-xl bg-primary px-6 py-3 text-primary-foreground font-medium transition hover:opacity-90"
          >
            Browse Library
          </Link>

          <Link
            href="/"
            className="rounded-xl border border-border px-6 py-3 font-medium text-foreground transition hover:bg-muted"
          >
            Go Home
          </Link>
        </div>

        <div className="mt-10 border-t border-border pt-6 text-sm text-muted-foreground">
          Error Code: 404
        </div>
      </div>
    </div>
  );
}
