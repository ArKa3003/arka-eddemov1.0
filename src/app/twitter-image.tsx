import { ImageResponse } from "next/og";

// ============================================================================
// Configuration
// ============================================================================

export const runtime = "edge";

export const alt = "ARKA-ED - Master Medical Imaging Appropriateness";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

// ============================================================================
// Twitter Image Generation (Same as OG Image)
// ============================================================================

export default async function TwitterImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)",
          fontFamily: "Inter, sans-serif",
        }}
      >
        {/* Background Pattern */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 0.1,
            background:
              "radial-gradient(circle at 25% 25%, #06b6d4 0%, transparent 50%), radial-gradient(circle at 75% 75%, #8b5cf6 0%, transparent 50%)",
          }}
        />

        {/* Content Container */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "60px",
            position: "relative",
          }}
        >
          {/* Logo */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "40px",
            }}
          >
            <span
              style={{
                fontSize: "64px",
                fontWeight: 800,
                color: "#06b6d4",
                letterSpacing: "-0.02em",
              }}
            >
              ARKA
            </span>
            <span
              style={{
                fontSize: "64px",
                fontWeight: 800,
                color: "#ffffff",
                letterSpacing: "-0.02em",
              }}
            >
              -ED
            </span>
          </div>

          {/* Main Headline */}
          <h1
            style={{
              fontSize: "48px",
              fontWeight: 700,
              color: "#ffffff",
              textAlign: "center",
              lineHeight: 1.2,
              marginBottom: "24px",
              maxWidth: "900px",
            }}
          >
            Master Medical Imaging
            <span
              style={{
                background: "linear-gradient(90deg, #06b6d4, #22d3ee)",
                backgroundClip: "text",
                color: "transparent",
                display: "block",
              }}
            >
              Appropriateness
            </span>
          </h1>

          {/* Tagline */}
          <p
            style={{
              fontSize: "24px",
              color: "#94a3b8",
              textAlign: "center",
              maxWidth: "700px",
              lineHeight: 1.5,
            }}
          >
            The first interactive platform teaching physicians when to order
            imaging — not just how to read it.
          </p>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
