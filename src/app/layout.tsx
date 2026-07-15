import type { Metadata } from "next";
import { Bricolage_Grotesque } from "next/font/google";
import "./globals.css";

// Brand font (theme.css: --font-sans) — also available to /studio since it's the same document.
const bricolageGrotesque = Bricolage_Grotesque({
  variable: "--font-bricolage-grotesque",
  subsets: ["latin"],
});

// Static placeholder — becomes dynamic (generateMetadata reading Sanity's siteSettings/SEO
// fields) once page data-fetching is wired up. Not the "Create Next App" default at least.
export const metadata: Metadata = {
  title: "Mari Liveaboard",
  description: "A traditional Phinisi liveaboard for serious divers.",
  icons: {
    icon: [
      { url: "/assets/favico/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/assets/favico/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/assets/favico/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/assets/favico/android-chrome-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: "/assets/favico/apple-touch-icon.png",
  },
  manifest: "/assets/favico/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${bricolageGrotesque.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
