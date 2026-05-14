import connectDb from "@/lib/db";
import styles from "./Content.module.css";
import { notFound } from "next/navigation";

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
    <article
      className={styles.container}
      dangerouslySetInnerHTML={{
        __html: data.content || "",
      }}
    />
  );
}
