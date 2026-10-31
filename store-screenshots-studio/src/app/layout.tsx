import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "WebToMarkdown Store Screenshots",
  description:
    "Local-only screenshot studio for Mac App Store marketing assets.",
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
