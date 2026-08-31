import type { Metadata } from "next";
import { Epilogue } from "next/font/google";
import "./globals.css";
import { SITE_URL } from "@/lib/seo";

/**
 * Epilogue is the single typeface for the whole site — the `font-serif` and
 * `font-mono` tokens both resolve to it (see globals.css), so no surface can
 * fall back to another family. Italics are loaded as a real style rather than
 * left to the browser to synthesise, since several headings set `italic`.
 */
// No `weight` array on purpose: that pins static per-weight instances, and
// Google no longer serves the static *italic* cuts of Epilogue v20 (they 404,
// which fails the build on a clean CDN fetch). Omitting it uses the variable
// font, whose 100–900 axis covers every weight the site asks for — normal and
// italic — from two files.
const epilogue = Epilogue({
  variable: "--font-epilogue",
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
});


export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Equinoux | Strategic Design Studio, Brand, Identity & Web",
    template: "%s",
  },
  description:
    "Equinoux is an independent strategic design studio crafting brand systems, identities, and websites for ambitious companies. Abuja, Nigeria, working worldwide.",
  applicationName: "Equinoux",
  authors: [{ name: "Equinoux Studio" }],
  keywords: [
    "brand strategy",
    "brand identity",
    "design systems",
    "web design",
    "design studio",
    "Abuja",
    "Nigeria",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: "Equinoux",
    url: SITE_URL,
    title: "Equinoux | Strategic Design Studio",
    description:
      "Brand systems, identities, and digital experiences for ambitious companies. Independent and founder-led, from Abuja, Nigeria.",
    /* The share card. Pasting the link anywhere should land on the hero, not
       on a mark — so this is the hero frame itself, pre-desaturated: the site
       greys it with a CSS filter, and no unfurler runs CSS. Cropped to 1200x630
       here rather than left to each platform to cut the face where it likes,
       and kept well under WhatsApp's size ceiling so the card actually
       resolves on a phone. */
    images: [
      {
        url: "/og.jpg",
        width: 1200,
        height: 630,
        type: "image/jpeg",
        alt: "Equinoux, a strategic design studio.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Equinoux | Strategic Design Studio",
    description:
      "Brand systems, identities, and digital experiences for ambitious companies.",
    images: ["/og.jpg"],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${epilogue.variable} h-full antialiased`}
    >
      <head>
        {/* Scroll-reveal sections are server-rendered at opacity:0 — that is
            the frame the animation starts from. Without JS nothing ever
            animates them in, so the whole page reads as blank. Restore them. */}
        <noscript>
          <style>{`.eqx-reveal{opacity:1!important;transform:none!important}`}</style>
        </noscript>
      </head>
      <body className="min-h-full flex flex-col overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
