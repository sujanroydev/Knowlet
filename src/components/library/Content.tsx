import connectDb from "@/lib/db";
import styles from "./Content.module.css";
import { notFound } from "next/navigation";
import ReaderPageClient from "./ReaderPageClient";

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

  // TODO: ADD A NAVIGATOR IN LEFT SIDE TOGGLE FROM 3 LINES IN HEADER
  // TODO: SHARE BUTTON IN THE TOP BAR

  return (
    <ReaderPageClient resourceId={data.id}>
      <article
        className={styles.container}
        dangerouslySetInnerHTML={{
          __html: data.content || "",
        }}
      />
    </ReaderPageClient>
  );
}
