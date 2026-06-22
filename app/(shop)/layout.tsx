import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

function absUrl(url: string) {
  if (url.startsWith("http")) return url;
  const base = process.env.NEXT_PUBLIC_SITE_URL
    || (process.env.VERCEL_URL && `https://${process.env.VERCEL_URL}`)
    || "https://bethelempire.com";
  return `${base.replace(/\/+$/, "")}${url.startsWith("/") ? url : `/${url}`}`;
}

export const metadata: Metadata = {
  openGraph: {
    type: "website",
    locale: "en_NG",
    siteName: "Bethel Empire",
    images: [{ url: absUrl("/bethel-logo.jpg"), width: 800, height: 800, alt: "Bethel Empire" }],
  },
  twitter: {
    card: "summary_large_image",
    images: [absUrl("/bethel-logo.jpg")],
  },
};

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="pt-16 lg:pt-20 min-h-screen">
        {children}
      </main>
      <Footer />
    </>
  );
}
