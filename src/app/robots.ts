
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL;

    return {
        rules: {
            userAgent: "*",
            allow: "/",
            // Add disallow rules for private routes if appropriate.
        },
        ...(baseUrl
            ? { sitemap: `${baseUrl.replace(/\/$/, "")}/sitemap.xml` }
            : {}),
    };
}
