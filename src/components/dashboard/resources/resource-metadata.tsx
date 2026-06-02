export default function ResourceMetadata({
  metadata,
}: {
  metadata:
    | { title: string; description: string; word_count: string }
    | undefined;
}) {
  return (
    <div className="grid gap-6 lg:grid-cols-4">
      <Card title="Title" value={metadata?.title || "Resource Title"} />
      <Card
        title="Description"
        value={metadata?.description || "A brief description of the resource."}
      />
      <Card title="Word Count" value={metadata?.word_count || "0"} />
    </div>
  );
}

function Card({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-medium text-slate-500">{title}</p>

      <h3 className="mt-2 text-lg font-semibold text-slate-900">{value}</h3>
    </div>
  );
}
