import connectDb from "@/lib/db";

type Feedback = {
  id: string;
  message: string;
  created_at: string;

  resource: {
    id: string;
    title: string;
  } | null;

  user: {
    id: string;
    name: string;
    avatar_url: string | null;
  } | null;
};

export default async function FeedbackPage() {
  const db = await connectDb();

  const { data, error } = await db
    .from("resource_feedback")
    .select(
      `
      id,
      message,
      created_at,
      resource:resources (
        id,
        title
      ),
      user:users (
        id,
        name,
        picture
      )
    `,
    )
    .order("created_at", {
      ascending: false,
    });

  const feedbacks = data as Feedback[] | null;

  if (error) {
    console.log(error);
    return (
      <div className="p-6">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-red-600 dark:border-red-900 dark:bg-red-950/30">
          Failed to load feedback.
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">Resource Feedback</h1>

        <p className="mt-1 text-sm text-muted-foreground">
          Review feedback submitted by users.
        </p>
      </div>

      {!feedbacks?.length ? (
        <div className="rounded-2xl border border-dashed p-10 text-center">
          <p className="text-muted-foreground">No feedback submitted yet.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {feedbacks.map((feedback) => (
            <div
              key={feedback.id}
              className="rounded-2xl border bg-card p-5 shadow-sm"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="space-y-1">
                  <h2 className="text-base font-semibold">
                    {feedback.resource?.title || "Unknown Resource"}
                  </h2>

                  <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                    <span>{feedback.user?.name || "Anonymous User"}</span>

                    <span>•</span>

                    <span>
                      {new Date(feedback.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-4 rounded-xl bg-muted/40 p-4">
                <p className="whitespace-pre-wrap text-sm leading-7">
                  {feedback.message}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
