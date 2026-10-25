import type { Metadata } from "next";
import { Archivo, IBM_Plex_Mono } from "next/font/google";
import { createPageMetadata } from "@/lib/metadata";
import {
  createOrganizationJsonLd,
  createWebsiteJsonLd,
  site,
} from "@/lib/site";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next"

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  axes: ["wdth"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  applicationName: site.name,
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/icon.png", type: "image/png" },
    ],
    apple: [{ url: "/apple-icon.png", type: "image/png" }],
    shortcut: ["/icon.png"],
  },
  ...createPageMetadata({
    title: site.defaultTitle,
    description: site.defaultDescription,
    canonical: "/",
    keywords: site.keywords,
  }),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${archivo.variable} ${plexMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-paper text-ink">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(createWebsiteJsonLd()),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(createOrganizationJsonLd()),
          }}
        />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
