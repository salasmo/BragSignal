import type { MetadataRoute } from "next";

const SITE_URL = "https://brag-signal.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${SITE_URL}/`, lastModified: new Date(), priority: 1 },
    { url: `${SITE_URL}/privacy`, lastModified: new Date(), priority: 0.3 },
  ];
}
