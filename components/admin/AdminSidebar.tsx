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

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
  const pathname = usePathname();

  const sidebarContent = (
    <div className="flex flex-col h-full">
      <div className="p-5 border-b border-white/5 flex items-center justify-between">
        <Logo variant="light" size="sm" />
        <button onClick={onClose} className="lg:hidden text-gray-400 hover:text-white text-lg leading-none">&times;</button>
      </div>
      <nav className="flex-1 py-4 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
          return (
            <Link key={item.href} href={item.href} onClick={onClose}
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
        <Link href="/" onClick={onClose} className="text-xs text-gray-600 hover:text-gold transition-colors flex items-center gap-2">
          <span>←</span> View Store
        </Link>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-60 bg-empire-charcoal flex-shrink-0 flex-col">
        {sidebarContent}
      </aside>

      {/* Mobile drawer overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={onClose} />
          <aside className="absolute left-0 top-0 bottom-0 w-64 bg-empire-charcoal flex-shrink-0 flex-col shadow-2xl z-10">
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
}
