import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ARKA-ED - Medical Education Platform",
  description: "Medical education platform teaching imaging appropriateness",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}