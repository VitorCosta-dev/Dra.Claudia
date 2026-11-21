import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/privacidade", "/procedimentos"],
      disallow: ["/admin", "/paciente", "/questionario", "/acesso", "/recuperar-senha", "/auth"],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
