import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About Us",
  description: "The story behind Bethel Empire — handcrafted bags made with passion in Nigeria.",
};

const values = [
  { icon: "✦", title: "Artistry", desc: "Every cut, stitch, and finish is done with deliberate care and creative pride." },
  { icon: "◈", title: "Quality", desc: "We use only premium materials that stand the test of time and daily use." },
  { icon: "❖", title: "Empowerment", desc: "Through our training programmes, we equip others to build thriving bag-making businesses." },
  { icon: "✧", title: "Authenticity", desc: "Our designs are original, rooted in African creativity fused with global aesthetics." },
];

const team = [
  { name: "Founder & Lead Artisan", role: "Bethel Empire", initial: "B" },
  { name: "Head of Training", role: "Courses & Curriculum", initial: "T" },
  { name: "Creative Director", role: "Design & Collections", initial: "C" },
];

export default function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative bg-empire-black py-28 overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-0.5 gold-shimmer" />
        <div className="absolute inset-0 pointer-events-none select-none opacity-[0.03]">
          <span className="absolute right-0 top-1/2 -translate-y-1/2 font-serif font-bold text-white leading-none" style={{ fontSize: "50vw" }}>B</span>
        </div>
        <div className="container-max px-4 sm:px-6 lg:px-8 relative">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-px w-8 bg-gold" />
            <p className="text-gold text-xs tracking-[0.4em] uppercase">Our Story</p>
          </div>
          <h1 className="font-serif text-5xl lg:text-7xl text-white leading-tight max-w-2xl">
            Crafted With<br />
            <span className="text-transparent bg-clip-text bg-gold-gradient italic">Purpose.</span>
          </h1>
        </div>
      </section>

      {/* Story */}
      <section className="section-padding bg-white">
        <div className="container-max px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-gold text-xs tracking-[0.3em] uppercase mb-4">Who We Are</p>
              <h2 className="font-serif text-4xl text-empire-black mb-6">The Bethel Empire Story</h2>
              <div className="space-y-4 text-empire-grey leading-relaxed">
                <p>
                  Bethel Empire was born from a deep love of craftsmanship and a desire to redefine what African luxury looks like. What started as a small workshop has grown into a celebrated brand known for premium handcrafted bags that blend elegance with everyday functionality.
                </p>
                <p>
                  Each bag that leaves our studio carries the fingerprints of its maker — a testament to hours of careful work, thoughtful design, and a relentless pursuit of excellence. We don't just make bags. We make statements.
                </p>
                <p>
                  Beyond products, we are passionate about knowledge-sharing. Our training programmes have empowered dozens of artisans and entrepreneurs to start and grow their own bag-making businesses — multiplying the craft across Nigeria and beyond.
                </p>
              </div>
              <Link href="/training" className="btn-gold mt-8 inline-flex">Our Training Courses</Link>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="aspect-[3/4] bg-gold-muted flex items-end p-4">
                <p className="font-serif text-gold text-opacity-50 text-sm italic">"Wear the Empire."</p>
              </div>
              <div className="flex flex-col gap-4 mt-8">
                <div className="aspect-square bg-empire-black flex items-center justify-center">
                  <div className="text-center">
                    <p className="font-serif text-4xl text-gold font-bold">500+</p>
                    <p className="text-xs text-gray-400 tracking-widest uppercase mt-1">Bags Made</p>
                  </div>
                </div>
                <div className="aspect-square bg-gold flex items-center justify-center">
                  <div className="text-center">
                    <p className="font-serif text-4xl text-empire-black font-bold">50+</p>
                    <p className="text-xs text-empire-black/60 tracking-widest uppercase mt-1">Graduates</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="section-padding bg-empire-light">
        <div className="container-max px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              { label: "Our Mission", icon: "◈", text: "To craft premium handmade bags that celebrate African artistry, empower local creators, and make luxury accessible — one stitch at a time." },
              { label: "Our Vision", icon: "✦", text: "To become Africa's most beloved handcrafted bag brand, recognised globally for quality, creativity, and the impact we have on the artisan community." },
            ].map((item) => (
              <div key={item.label} className="bg-white p-10 border border-gray-100">
                <span className="text-gold text-2xl">{item.icon}</span>
                <h3 className="font-serif text-2xl text-empire-black mt-4 mb-4">{item.label}</h3>
                <p className="text-empire-grey leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section-padding bg-white">
        <div className="container-max px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-gold text-xs tracking-[0.3em] uppercase mb-3">What Drives Us</p>
            <h2 className="font-serif text-4xl text-empire-black">Our Core Values</h2>
            <div className="h-px w-16 bg-gold-gradient mx-auto mt-4" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v) => (
              <div key={v.title} className="text-center p-8 border border-gray-100 hover:border-gold/30 hover:shadow-md transition-all group">
                <span className="text-gold text-3xl group-hover:scale-110 inline-block transition-transform">{v.icon}</span>
                <h3 className="font-serif text-xl text-empire-black mt-4 mb-3">{v.title}</h3>
                <p className="text-empire-grey text-sm leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="section-padding bg-empire-charcoal">
        <div className="container-max px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-gold text-xs tracking-[0.3em] uppercase mb-3">The People</p>
            <h2 className="font-serif text-4xl text-white">Meet the Team</h2>
            <div className="h-px w-16 bg-gold-gradient mx-auto mt-4" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {team.map((member) => (
              <div key={member.name} className="text-center">
                <div className="w-28 h-28 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center mx-auto mb-5">
                  <span className="font-serif text-5xl text-gold font-bold">{member.initial}</span>
                </div>
                <h3 className="font-serif text-lg text-white">{member.name}</h3>
                <p className="text-gold text-xs tracking-widest uppercase mt-1">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-gold">
        <div className="container-max px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-serif text-4xl text-empire-black mb-4">Ready to Experience the Empire?</h2>
          <p className="text-empire-black/70 mb-8 max-w-md mx-auto">Browse our collection or join one of our training programmes today.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/products" className="btn-dark">Shop Bags</Link>
            <Link href="/contact" className="btn-outline border-empire-black text-empire-black hover:bg-empire-black hover:text-white">Contact Us</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
