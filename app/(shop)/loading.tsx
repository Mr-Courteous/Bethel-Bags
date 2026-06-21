export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-empire-light">
      <div className="text-center">
        <div className="relative w-16 h-16 mx-auto mb-4">
          <div className="w-16 h-16 border-2 border-gold/20 border-t-gold rounded-full animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-serif text-gold font-bold text-sm">BE</span>
          </div>
        </div>
        <p className="text-xs tracking-widest uppercase text-empire-grey">Loading</p>
      </div>
    </div>
  );
}
