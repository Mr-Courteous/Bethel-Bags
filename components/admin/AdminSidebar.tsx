"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Logo from "@/components/ui/Logo";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: "◈" },
  { href: "/admin/products", label: "Products", icon: "🛍" },
  { href: "/admin/orders", label: "Orders", icon: "📦" },
  { href: "/admin/categories", label: "Categories", icon: "🏷" },
  { href: "/admin/courses", label: "Courses", icon: "📚" },
  { href: "/admin/enrolments", label: "Enrolments", icon: "🎓" },
  { href: "/admin/gallery", label: "Gallery", icon: "🖼" },
  { href: "/admin/blog", label: "Blog", icon: "✏️" },
  { href: "/admin/testimonials", label: "Testimonials", icon: "⭐" },
  { href: "/admin/users", label: "Customers", icon: "👥" },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-60 bg-empire-charcoal flex-shrink-0 flex flex-col">
      <div className="p-5 border-b border-white/5">
        <Logo variant="light" size="sm" />
        <p className="text-[10px] tracking-widest text-gold/70 uppercase mt-2 ml-0.5">Admin Panel</p>
      </div>

      <nav className="flex-1 py-4 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-5 py-3 text-sm transition-colors duration-150 ${
                isActive
                  ? "bg-gold/15 text-gold border-r-2 border-gold"
                  : "text-gray-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <span className="text-base w-5 text-center">{item.icon}</span>
              <span className="font-sans">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-5 border-t border-white/5">
        <Link href="/" className="text-xs text-gray-600 hover:text-gold transition-colors flex items-center gap-2">
          <span>←</span> View Store
        </Link>
      </div>
    </aside>
  );
}
