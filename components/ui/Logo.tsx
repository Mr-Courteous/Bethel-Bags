import Link from "next/link";

interface LogoProps {
  variant?: "light" | "dark";
  size?: "sm" | "md" | "lg";
}

export default function Logo({ variant = "dark", size = "md" }: LogoProps) {
  const sizes = { sm: "text-lg", md: "text-2xl", lg: "text-4xl" };
  const textColor = variant === "light" ? "text-white" : "text-empire-black";

  return (
    <Link href="/" className="flex items-center gap-2 group">
      {/* BE monogram */}
      <div className={`relative flex items-center justify-center font-serif font-bold leading-none ${sizes[size]} ${textColor}`}>
        <span>B</span>
        <span className="relative">
          E
          <span className="absolute -top-1 -right-1 text-gold text-xs">✦</span>
        </span>
      </div>
      <div className="flex flex-col leading-tight">
        <span className={`font-serif font-bold tracking-widest ${size === "sm" ? "text-sm" : size === "lg" ? "text-xl" : "text-base"} ${textColor}`}>
          BETHEL
        </span>
        <span className={`font-sans tracking-[0.3em] uppercase ${size === "sm" ? "text-[8px]" : "text-[10px]"} text-gold`}>
          EMPIRE
        </span>
      </div>
    </Link>
  );
}
