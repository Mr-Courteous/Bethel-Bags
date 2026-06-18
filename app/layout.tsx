import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import SessionProviderWrapper from "@/components/providers/SessionProviderWrapper";

export const metadata: Metadata = {
  title: { default: "Bethel Empire – Premium Handcrafted Bags", template: "%s | Bethel Empire" },
  description: "Luxury handcrafted bags made with passion. Shop our collection or enrol in our bag-making courses.",
  keywords: ["handmade bags", "luxury bags Nigeria", "bag making course", "leather bags"],
  openGraph: {
    type: "website",
    locale: "en_NG",
    siteName: "Bethel Empire",
  },
};

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
