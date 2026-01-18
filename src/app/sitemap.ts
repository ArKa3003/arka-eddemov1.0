import { MetadataRoute } from "next";

/**
 * Sitemap Generation
 *
 * Generates a sitemap for search engines.
 * Includes only public/marketing pages.
 * Excludes dashboard, admin, and auth pages.
 */

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://arka-ed.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const currentDate = new Date().toISOString();

  // Marketing/Public Pages
  const marketingPages: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${siteUrl}/pricing`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/about`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${siteUrl}/features`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];

  // Auth Pages (public but lower priority)
  const authPages: MetadataRoute.Sitemap = [
    {
      url: `${siteUrl}/login`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${siteUrl}/register`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];

  // Specialty Track Landing Pages (if public)
  const specialtyPages: MetadataRoute.Sitemap = [
    {
      url: `${siteUrl}/specialty/em`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${siteUrl}/specialty/im`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${siteUrl}/specialty/fm`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${siteUrl}/specialty/surgery`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${siteUrl}/specialty/peds`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];

  // Note: Dashboard pages (/cases/*, /progress/*, /assessments/*, /admin/*)
  // are intentionally excluded as they require authentication

  return [...marketingPages, ...authPages, ...specialtyPages];
}
