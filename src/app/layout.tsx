// @ts-nocheck
import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Providers } from "@/app/providers";

// ============================================================================
// Fonts
// ============================================================================

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

// ============================================================================
// Metadata
// ============================================================================

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://arka-ed.com";

export const metadata: Metadata = {
  // Basic metadata
  title: {
    default: "ARKA-ED - Master Medical Imaging Appropriateness",
    template: "%s | ARKA-ED",
  },
  description:
    "The first interactive platform teaching physicians when to order imaging — not just how to read it. Master ACR Appropriateness Criteria through real clinical cases.",
  keywords: [
    "medical education",
    "imaging appropriateness",
    "ACR criteria",
    "radiology education",
    "clinical decision support",
    "medical training",
    "physician education",
    "healthcare training",
    "diagnostic imaging",
    "medical imaging",
  ],
  authors: [{ name: "ARKA-ED Team" }],
  creator: "ARKA-ED",
  publisher: "ARKA-ED",
  
  // Base URL
  metadataBase: new URL(siteUrl),
  
  // Open Graph
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "ARKA-ED",
    title: "ARKA-ED - Master Medical Imaging Appropriateness",
    description:
      "The first interactive platform teaching physicians when to order imaging — not just how to read it. Master ACR Appropriateness Criteria through real clinical cases.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "ARKA-ED - Medical Imaging Education Platform",
      },
    ],
  },
  
  // Twitter
  twitter: {
    card: "summary_large_image",
    title: "ARKA-ED - Master Medical Imaging Appropriateness",
    description:
      "The first interactive platform teaching physicians when to order imaging — not just how to read it.",
    images: ["/og-image.png"],
    creator: "@arkaed",
  },
  
  // Icons
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180" },
    ],
  },
  
  // Manifest
  manifest: "/manifest.json",
  
  // Robots
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  
  // Verification
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
  
  // Category
  category: "education",
};

// ============================================================================
// Viewport
// ============================================================================

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
  ],
};

// ============================================================================
// JSON-LD Structured Data
// ============================================================================

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    // Organization
    {
      "@type": "Organization",
      "@id": `${siteUrl}/#organization`,
      name: "ARKA-ED",
      url: siteUrl,
      logo: {
        "@type": "ImageObject",
        url: `${siteUrl}/logo.png`,
        width: 512,
        height: 512,
      },
      sameAs: [
        "https://twitter.com/arkaed",
        "https://linkedin.com/company/arka-ed",
      ],
      contactPoint: {
        "@type": "ContactPoint",
        email: "support@arka-ed.com",
        contactType: "customer support",
      },
    },
    // Educational Application
    {
      "@type": "WebApplication",
      "@id": `${siteUrl}/#application`,
      name: "ARKA-ED",
      applicationCategory: "EducationalApplication",
      operatingSystem: "Web Browser",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
        description: "Free tier with 10 clinical cases",
      },
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: "4.9",
        reviewCount: "500",
      },
      featureList: [
        "50+ Clinical Cases",
        "ACR Criteria Integration",
        "Progress Tracking",
        "Specialty Tracks",
        "Assessment Mode",
      ],
    },
    // Website
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: siteUrl,
      name: "ARKA-ED",
      description:
        "Medical imaging appropriateness education platform",
      publisher: {
        "@id": `${siteUrl}/#organization`,
      },
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: `${siteUrl}/cases?search={search_term_string}`,
        },
        "query-input": "required name=search_term_string",
      },
    },
  ],
};

// ============================================================================
// Root Layout
// ============================================================================

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <head>
        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="font-sans antialiased">
        {/* Skip to content link for accessibility */}
        <a href="#main-content" className="skip-to-content">
          Skip to main content
        </a>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
