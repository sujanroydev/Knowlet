import { useRouter } from "next/navigation";
import { BookOpen } from "lucide-react";

interface Item {
  title: string;
  description: string;
  path: string;
}

export default function NavigatorBtnCard({ item }: { item: Item }) {
  const router = useRouter();
  return (
    <button
      type="button"
      onClick={() => router.push(`/library/${item.path}`)}
      className={`${item.description ? "min-h-35" : "min-h-28"} group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border bg-card p-5 text-left shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-md active:scale-[0.98]`}
    >
      <div className="absolute right-4 top-4 rounded-lg bg-accent p-2 text-primary"><BookOpen size={16} /></div>
      <div>
        <h2 className="max-w-[80%] text-lg font-semibold tracking-[-0.02em] text-foreground transition-colors group-hover:text-primary">
          {item.title?.slice(0, 30) + (item.title?.slice(30, 31) ? " ..." : "")}
        </h2>

        {item.description && (
          <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground">
            {item.description.slice(0, 50) +
              (item.description.slice(50, 51) ? " ..." : "")}
          </p>
        )}
      </div>

      <div className="mt-4 text-xs font-medium text-blue-500">Open →</div>
    </button>
  );
}
