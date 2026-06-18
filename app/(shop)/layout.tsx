import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

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
