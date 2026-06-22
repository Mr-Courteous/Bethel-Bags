import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import SessionProviderWrapper from "@/components/providers/SessionProviderWrapper";

export const dynamic = "force-dynamic";

function absUrl(url: string) {
  if (url.startsWith("http")) return url;
  const base = process.env.NEXT_PUBLIC_SITE_URL
    || (process.env.VERCEL_URL && `https://${process.env.VERCEL_URL}`)
    || "https://bethelempire.com";
  return `${base.replace(/\/+$/, "")}${url.startsWith("/") ? url : `/${url}`}`;
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    metadataBase: new URL(absUrl("/")),
    title: { default: "Bethel Empire – Premium Handcrafted Bags", template: "%s | Bethel Empire" },
    description: "Luxury handcrafted bags made with passion. Shop our collection or enrol in our bag-making courses.",
    keywords: ["handmade bags", "luxury bags Nigeria", "bag making course", "leather bags", "Bethel Empire"],
    authors: [{ name: "Bethel Empire" }],
    creator: "Bethel Empire",
    publisher: "Bethel Empire",
    applicationName: "Bethel Empire",
    manifest: "/favicon/site.webmanifest",
    icons: {
      icon: [
        { url: "/favicon/favicon.ico", sizes: "any" },
        { url: "/favicon/favicon-16x16.png", sizes: "16x16", type: "image/png" },
        { url: "/favicon/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      ],
      apple: [{ url: "/favicon/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
    },
    other: {
      "theme-color": "#C9A84C",
      "apple-mobile-web-app-capable": "yes",
    },
    openGraph: {
      type: "website",
      locale: "en_NG",
      siteName: "Bethel Empire",
      title: "Bethel Empire – Premium Handcrafted Bags",
      description: "Luxury handcrafted bags made with passion. Shop our collection or enrol in our bag-making courses.",
      url: absUrl("/"),
      images: [{ url: absUrl("/bethel-logo.jpg"), width: 800, height: 800, alt: "Bethel Empire" }],
    },
    twitter: {
      card: "summary_large_image",
      title: "Bethel Empire – Premium Handcrafted Bags",
      description: "Luxury handcrafted bags made with passion. Shop our collection or enrol in our bag-making courses.",
      images: [absUrl("/bethel-logo.jpg")],
    },
    robots: { index: true, follow: true },
  };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <SessionProviderWrapper>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              style: { background: "#1A1A1A", color: "#fff", borderLeft: "3px solid #C9A84C" },
              success: { iconTheme: { primary: "#C9A84C", secondary: "#1A1A1A" } },
            }}
          />
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
