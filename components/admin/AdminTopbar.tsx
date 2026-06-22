"use client";
import { signOut } from "next-auth/react";

interface AdminTopbarProps {
  user: any;
  onToggleSidebar: () => void;
}

export default function AdminTopbar({ user, onToggleSidebar }: AdminTopbarProps) {
  return (
    <header className="bg-white border-b border-gray-100 px-4 lg:px-8 h-14 flex items-center justify-between flex-shrink-0 relative">
      <div className="h-0.5 absolute top-0 left-0 right-0 gold-shimmer" />
      <button onClick={onToggleSidebar} className="lg:hidden text-empire-black text-xl p-1 -ml-1" aria-label="Toggle menu">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
      <div className="flex items-center gap-3 ml-auto">
        <span className="text-sm text-empire-grey hidden sm:inline">{user?.name}</span>
        <span className="text-xs bg-gold/15 text-gold px-2 py-0.5 uppercase tracking-wide font-medium">Admin</span>
        <button
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          className="text-xs text-gray-400 hover:text-red-500 transition-colors uppercase tracking-wide whitespace-nowrap"
        >
          Sign Out
        </button>
      </div>
    </header>
  );
}
