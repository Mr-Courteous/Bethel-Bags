"use client";

export default function NewsletterForm() {
  return (
    <form className="flex flex-col sm:flex-row gap-3" onSubmit={(e) => e.preventDefault()}>
      <input 
        type="email" 
        placeholder="Enter your email address" 
        className="flex-1 px-4 py-3 bg-white border-0 text-sm focus:outline-none focus:ring-2 focus:ring-empire-black/20" 
      />
      <button type="submit" className="btn-dark whitespace-nowrap">Subscribe</button>
    </form>
  );
}
