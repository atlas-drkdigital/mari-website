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
