import { MetadataRoute } from "next";

/**
 * Web App Manifest
 *
 * Defines how the app appears when installed on a device.
 */

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "ARKA-ED - Medical Imaging Education",
    short_name: "ARKA-ED",
    description:
      "The first interactive platform teaching physicians when to order imaging — not just how to read it.",
    start_url: "/",
    display: "standalone",
    background_color: "#0f172a",
    theme_color: "#06b6d4",
    orientation: "portrait-primary",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
    categories: ["education", "medical", "health"],
    lang: "en",
    dir: "ltr",
    prefer_related_applications: false,
    screenshots: [
      {
        src: "/screenshot-desktop.png",
        sizes: "1920x1080",
        type: "image/png",
        label: "ARKA-ED Desktop View",
      },
      {
        src: "/screenshot-mobile.png",
        sizes: "390x844",
        type: "image/png",
        label: "ARKA-ED Mobile View",
      },
    ],
  };
}
