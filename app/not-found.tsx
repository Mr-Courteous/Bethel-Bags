import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-empire-black flex items-center justify-center px-4">
      <div className="absolute top-0 left-0 right-0 h-0.5 gold-shimmer" />
      <div className="text-center">
        <p className="font-serif text-[10rem] font-bold text-white/5 leading-none select-none">404</p>
        <div className="-mt-16 relative z-10">
          <p className="text-gold text-xs tracking-[0.4em] uppercase mb-4">Page Not Found</p>
          <h1 className="font-serif text-5xl text-white mb-4">Lost in the Empire?</h1>
          <p className="text-gray-400 max-w-sm mx-auto mb-8">The page you're looking for doesn't exist or has been moved.</p>
          <Link href="/" className="btn-gold">Return Home</Link>
        </div>
      </div>
    </div>
  );
}
