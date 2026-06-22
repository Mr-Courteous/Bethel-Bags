import Link from "next/link";
import Image from "next/image";

interface LogoProps {
  variant?: "light" | "dark";
  size?: "sm" | "md" | "lg";
}

export default function Logo({ variant = "dark", size = "md" }: LogoProps) {
  const dims = { sm: 28, md: 36, lg: 52 };

  return (
    <Link href="/" className="flex items-center gap-2 group">
      <div className="relative flex-shrink-0" style={{ width: dims[size], height: dims[size] }}>
        <Image src="/bethel-logo.jpg" alt="Bethel Empire" fill className="object-contain" />
      </div>
      <div className="flex flex-col leading-tight">
        <span className={`font-serif font-bold tracking-widest ${size === "sm" ? "text-sm" : size === "lg" ? "text-xl" : "text-base"} ${variant === "light" ? "text-white" : "text-empire-black"}`}>
          BETHEL
        </span>
        <span className={`font-sans tracking-[0.3em] uppercase ${size === "sm" ? "text-[8px]" : "text-[10px]"} text-gold`}>
          EMPIRE
        </span>
      </div>
    </Link>
  );
}
