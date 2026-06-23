import connectDb from "@/lib/db";
import styles from "./Content.module.css";
import { notFound } from "next/navigation";
import ReaderPageClient from "./ReaderPageClient";
import ResourceFooterActions from "./resource-footer-actions";

export default async function Content({ slug }: { slug: string[] }) {
  const db = await connectDb();

  const { data, error } = await db
    .from("resources")
    .select("*")
    .eq("path", slug.join("/"))
    .maybeSingle();

  if (error || !data) {
    notFound();
  }

  return (
    <ReaderPageClient resourceId={data.id}>
      <div className="max-w-5xl mx-auto px-4 py-6 lg:my-10 lg:p-8 lg:rounded-xl bg-white text-gray-800  shadow-lg leading-loose text-base break-words">
        <article
          className={styles.container}
          dangerouslySetInnerHTML={{
            __html: data.content || "",
          }}
        />

        <div className="my-16 flex items-center gap-4">
          <hr className="flex-1 border-border" />
          <span className="text-sm font-medium text-muted-foreground">xxx</span>
          <hr className="flex-1 border-border" />
        </div>

        <ResourceFooterActions />
      </div>
    </ReaderPageClient>
  );
}
