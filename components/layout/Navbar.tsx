"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import Logo from "@/components/ui/Logo";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Shop" },
  { href: "/training", label: "Training" },
  { href: "/gallery", label: "Gallery" },
  { href: "/about", label: "About" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

function CartIcon({ count }: { count: number }) {
  return (
    <Link href="/cart" className="relative p-2 text-empire-black hover:text-gold transition-colors group">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
      </svg>
      {count > 0 && (
        <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-gold text-empire-black text-[10px] font-bold flex items-center justify-center leading-none rounded-full">
          {count > 9 ? "9+" : count}
        </span>
      )}
    </Link>
  );
}

export default function Navbar() {
  const { data: session } = useSession();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  // Fetch cart count on mount + whenever session changes
  useEffect(() => {
    async function fetchCount() {
      try {
        const res = await fetch("/api/cart/count");
        if (res.ok) {
          const data = await res.json();
          setCartCount(data.count || 0);
        }
      } catch {}
    }
    fetchCount();
    // Poll every 30s to keep in sync
    const interval = setInterval(fetchCount, 30000);
    return () => clearInterval(interval);
  }, [session]);

  // Expose refresh function globally so AddToCartButton can trigger it
  useEffect(() => {
    (window as any).__refreshCartCount = async () => {
      try {
        const res = await fetch("/api/cart/count");
        if (res.ok) {
          const data = await res.json();
          setCartCount(data.count || 0);
        }
      } catch {}
    };
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? "bg-white/97 backdrop-blur-sm shadow-sm" : "bg-white"
    }`}>
      <div className="h-0.5 gold-shimmer" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <Logo size="md" />

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-7">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}
                className="font-sans text-sm tracking-wide text-empire-grey hover:text-gold transition-colors duration-200 uppercase">
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-3">
            <CartIcon count={cartCount} />

            {/* Account dropdown */}
            {session ? (
              <div className="relative group hidden lg:block">
                <button className="flex items-center gap-2 text-sm text-empire-grey hover:text-gold transition-colors px-2 py-1">
                  <div className="w-7 h-7 bg-gold/15 flex items-center justify-center">
                    <span className="text-gold font-serif font-bold text-xs">
                      {(session.user?.name || session.user?.email || "U")[0].toUpperCase()}
                    </span>
                  </div>
                  <span className="font-medium text-sm">{session.user?.name?.split(" ")[0]}</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
                <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-100 shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  {(session.user as any)?.role === "ADMIN" && (
                    <Link href="/admin" className="flex items-center gap-2 px-4 py-3 text-sm text-empire-black hover:bg-gold/10 hover:text-gold border-b border-gray-100">
                      <span>⚙</span> Admin Dashboard
                    </Link>
                  )}
                  <Link href="/account/orders" className="flex items-center gap-2 px-4 py-3 text-sm text-empire-black hover:bg-gold/10 hover:text-gold">
                    <span>📦</span> My Orders
                  </Link>
                  <button onClick={() => signOut({ callbackUrl: "/" })}
                    className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-600 hover:bg-red-50 border-t border-gray-100">
                    <span>↩</span> Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <Link href="/login" className="hidden lg:block btn-gold py-2 px-5 text-xs">Sign In</Link>
            )}

            {/* Mobile menu toggle */}
            <button className="lg:hidden p-2 text-empire-black" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {menuOpen
                  ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                  : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
                }
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`lg:hidden bg-white border-t border-gray-100 shadow-lg overflow-hidden transition-all duration-300 ${menuOpen ? "max-h-screen" : "max-h-0"}`}>
        <nav className="flex flex-col px-4 py-4 gap-1">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} onClick={() => setMenuOpen(false)}
              className="px-4 py-3 text-sm font-sans tracking-wide uppercase text-empire-grey hover:text-gold hover:bg-gold/5 transition-colors">
              {link.label}
            </Link>
          ))}
          <Link href="/cart" onClick={() => setMenuOpen(false)}
            className="px-4 py-3 text-sm font-sans tracking-wide uppercase text-empire-grey hover:text-gold hover:bg-gold/5 transition-colors flex items-center gap-2">
            Cart {cartCount > 0 && <span className="w-5 h-5 bg-gold text-empire-black text-[10px] font-bold flex items-center justify-center rounded-full">{cartCount}</span>}
          </Link>
          <div className="mt-2 pt-2 border-t border-gray-100">
            {session ? (
              <>
                {(session.user as any)?.role === "ADMIN" && (
                  <Link href="/admin" onClick={() => setMenuOpen(false)} className="block px-4 py-3 text-sm text-gold font-medium">⚙ Admin Dashboard</Link>
                )}
                <Link href="/account/orders" onClick={() => setMenuOpen(false)} className="block px-4 py-3 text-sm text-empire-grey">📦 My Orders</Link>
                <button onClick={() => { signOut({ callbackUrl: "/" }); setMenuOpen(false); }}
                  className="block w-full text-left px-4 py-3 text-sm text-red-600">↩ Sign Out</button>
              </>
            ) : (
              <Link href="/login" onClick={() => setMenuOpen(false)} className="block px-4 py-3 text-sm font-medium text-gold">Sign In / Register</Link>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
