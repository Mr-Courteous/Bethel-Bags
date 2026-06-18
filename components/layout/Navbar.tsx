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

export default function Navbar() {
  const { data: session } = useSession();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? "bg-white/95 backdrop-blur-sm shadow-sm" : "bg-white"
    }`}>
      {/* Top gold bar */}
      <div className="h-0.5 gold-shimmer" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <Logo size="md" />

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-sans text-sm tracking-wide text-empire-grey hover:text-gold transition-colors duration-200 uppercase"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-4">
            {/* Cart icon */}
            <Link href="/cart" className="relative p-2 text-empire-black hover:text-gold transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </Link>

            {/* Account */}
            {session ? (
              <div className="relative group hidden lg:block">
                <button className="flex items-center gap-2 text-sm text-empire-grey hover:text-gold transition-colors">
                  <span className="font-medium">{session.user?.name?.split(" ")[0]}</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
                <div className="absolute right-0 top-full mt-2 w-44 bg-white border border-gray-100 shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  {(session.user as any)?.role === "ADMIN" && (
                    <Link href="/admin" className="block px-4 py-2.5 text-sm text-empire-black hover:bg-gold/10 hover:text-gold border-b border-gray-100">
                      Admin Dashboard
                    </Link>
                  )}
                  <Link href="/account/orders" className="block px-4 py-2.5 text-sm text-empire-black hover:bg-gold/10 hover:text-gold">
                    My Orders
                  </Link>
                  <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="block w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 border-t border-gray-100"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <Link href="/login" className="hidden lg:block btn-gold py-2 px-5 text-xs">
                Sign In
              </Link>
            )}

            {/* Mobile menu button */}
            <button
              className="lg:hidden p-2 text-empire-black"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
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
      {menuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 shadow-lg">
          <nav className="flex flex-col px-4 py-4 gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="px-4 py-3 text-sm font-sans tracking-wide uppercase text-empire-grey hover:text-gold hover:bg-gold/5 transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-2 pt-2 border-t border-gray-100">
              {session ? (
                <>
                  {(session.user as any)?.role === "ADMIN" && (
                    <Link href="/admin" onClick={() => setMenuOpen(false)} className="block px-4 py-3 text-sm text-gold font-medium">
                      Admin Dashboard
                    </Link>
                  )}
                  <button onClick={() => { signOut({ callbackUrl: "/" }); setMenuOpen(false); }} className="block px-4 py-3 text-sm text-red-600">
                    Sign Out
                  </button>
                </>
              ) : (
                <Link href="/login" onClick={() => setMenuOpen(false)} className="block px-4 py-3 text-sm font-medium text-gold">
                  Sign In / Register
                </Link>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
