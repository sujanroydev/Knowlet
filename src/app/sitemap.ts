import { getSitemapResources } from "@/db/resource";
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
    {
      url: `${baseUrl}/knowva`,
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
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/disclaimer`,
      lastModified: new Date(),
    },
  ];

  const resources = await getSitemapResources().catch((error) => {
    console.error("Sitemap Error:", error.message);
    return [];
  });

  const resourcePages: MetadataRoute.Sitemap =
    resources?.map((resource) => ({
      url: `${baseUrl}/library/${resource.path}`,
      lastModified: resource.updated_at
        ? new Date(resource.updated_at)
        : new Date(),
    })) || [];

  return [...staticPages, ...resourcePages];
}
