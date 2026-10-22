
import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL;

    if (!baseUrl) return [];

    const origin = baseUrl.replace(/\/$/, "");

    return [
        {
            url: origin,
            changeFrequency: "weekly",
            priority: 1,
        },
    ];
}
