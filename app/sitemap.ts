import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: siteUrl, changeFrequency: "monthly", priority: 1 },
    { url: `${siteUrl}/procedimentos`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteUrl}/privacidade`, changeFrequency: "yearly", priority: 0.4 },
  ];
}
