"use client";
import { signOut } from "next-auth/react";

interface AdminTopbarProps {
  user: any;
}

export default function AdminTopbar({ user }: AdminTopbarProps) {
  return (
    <header className="bg-white border-b border-gray-100 px-6 lg:px-8 h-14 flex items-center justify-between flex-shrink-0">
      <div className="h-0.5 absolute top-0 left-0 right-0 gold-shimmer" />
      <div />
      <div className="flex items-center gap-4">
        <span className="text-sm text-empire-grey">{user?.name}</span>
        <span className="text-xs bg-gold/15 text-gold px-2 py-0.5 uppercase tracking-wide font-medium">Admin</span>
        <button
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          className="text-xs text-gray-400 hover:text-red-500 transition-colors uppercase tracking-wide"
        >
          Sign Out
        </button>
      </div>
    </header>
  );
}
