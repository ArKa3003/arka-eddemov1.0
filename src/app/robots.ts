import { MetadataRoute } from "next";

/**
 * Robots.txt Generation
 *
 * Controls search engine crawling behavior.
 * Allows marketing pages, disallows dashboard and admin.
 */

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://arka-ed.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: [
          "/",
          "/pricing",
          "/about",
          "/features",
          "/login",
          "/register",
          "/specialty/*",
        ],
        disallow: [
          // Dashboard pages (require auth)
          "/cases/*",
          "/progress/*",
          "/assessments/*",
          
          // Admin pages
          "/admin/*",
          
          // Auth flows
          "/onboarding/*",
          "/forgot-password",
          "/reset-password",
          
          // API routes
          "/api/*",
          
          // Private assets
          "/_next/*",
          "/static/*",
        ],
      },
      {
        // Specific rules for Googlebot
        userAgent: "Googlebot",
        allow: "/",
        disallow: [
          "/admin/*",
          "/api/*",
          "/cases/*",
          "/progress/*",
          "/assessments/*",
        ],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
