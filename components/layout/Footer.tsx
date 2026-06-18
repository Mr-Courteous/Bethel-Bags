import Link from "next/link";
import Logo from "@/components/ui/Logo";

export default function Footer() {
  return (
    <footer className="bg-empire-charcoal text-white">
      <div className="h-0.5 gold-shimmer" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Logo variant="light" size="md" />
            <p className="mt-4 text-sm text-gray-400 leading-relaxed max-w-xs">
              Crafting premium handmade bags with passion and precision. Every piece tells a story of artistry and elegance.
            </p>
            <div className="flex gap-4 mt-6">
              {["Instagram", "Facebook", "WhatsApp"].map((s) => (
                <a key={s} href="#" className="text-xs text-gray-500 hover:text-gold transition-colors uppercase tracking-wide">{s}</a>
              ))}
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="font-serif text-sm tracking-widest uppercase text-gold mb-4">Shop</h4>
            <ul className="space-y-2.5">
              {[["All Products", "/products"], ["Handbags", "/products?category=handbags"], ["Tote Bags", "/products?category=tote-bags"], ["Clutch Bags", "/products?category=clutch-bags"], ["New Arrivals", "/products?filter=new"]].map(([label, href]) => (
                <li key={href}><Link href={href} className="text-sm text-gray-400 hover:text-gold transition-colors">{label}</Link></li>
              ))}
            </ul>
          </div>

          {/* Info */}
          <div>
            <h4 className="font-serif text-sm tracking-widest uppercase text-gold mb-4">Company</h4>
            <ul className="space-y-2.5">
              {[["About Us", "/about"], ["Training", "/training"], ["Gallery", "/gallery"], ["Blog", "/blog"], ["FAQ", "/faq"], ["Contact", "/contact"]].map(([label, href]) => (
                <li key={href}><Link href={href} className="text-sm text-gray-400 hover:text-gold transition-colors">{label}</Link></li>
              ))}
            </ul>
          </div>
        </div>

        <div className="h-px bg-white/10 my-10" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
          <p>© {new Date().getFullYear()} Bethel Empire. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-gold transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-gold transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
