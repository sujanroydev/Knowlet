import connectDb from "@/lib/db";
import type { MetadataRoute } from "next";

const baseUrl = "https://knowlet.in";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/library`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/bookmarks`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/history`,
      lastModified: new Date(),
    },

    // Public pages
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/help`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/terms-and-conditions`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/declaration`,
      lastModified: new Date(),
    },
  ];

  const db = await connectDb();

  // Fetch dynamic resources
  const { data: resources, error } = await db
    .from("resources")
    .select("path, updated_at, is_published")
    .eq("is_published", true);

  if (error) {
    console.error("Sitemap Error:", error.message);
    return staticPages;
  }

  const resourcePages: MetadataRoute.Sitemap =
    resources?.map((resource) => ({
      url: `${baseUrl}/library/${resource.path}`,
      lastModified: resource.updated_at
        ? new Date(resource.updated_at)
        : new Date(),
    })) || [];

  return [...staticPages, ...resourcePages];
}
