export const dynamic = "force-dynamic";
import type { Metadata } from "next";
import FaqAccordion from "@/components/shop/FaqAccordion";
import Link from "next/link";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Frequently asked questions about Bethel Empire bags, orders, shipping, and training.",
};

const faqs = [
  {
    category: "Orders & Shipping",
    items: [
      { q: "How long does delivery take?", a: "Standard delivery within Nigeria takes 3–5 business days. Express delivery (1–2 days) is available in Lagos and Abuja. We'll send you a tracking number once your order ships." },
      { q: "Do you ship internationally?", a: "Yes! We ship to select countries across Africa, Europe, and North America. International shipping takes 7–14 business days. Contact us for a shipping quote to your country." },
      { q: "How do I track my order?", a: "Once your order is dispatched, you'll receive an email with a tracking number. You can also view your order status by logging into your account under 'My Orders'." },
      { q: "Can I change or cancel my order?", a: "You can cancel or modify your order within 2 hours of placing it, as long as it hasn't been picked for packing yet. Contact us immediately via WhatsApp or email." },
    ],
  },
  {
    category: "Products",
    items: [
      { q: "Are all bags 100% handmade?", a: "Yes! Every single Bethel Empire bag is handcrafted by skilled artisans in our workshop. No mass production — each piece is made with care and attention to detail." },
      { q: "What materials do you use?", a: "We use premium genuine leather, high-quality faux leather, and selected fabrics sourced for durability and beauty. All hardware (zippers, clasps, chains) is solid and tarnish-resistant." },
      { q: "How do I care for my bag?", a: "For leather bags, wipe with a slightly damp cloth and use a leather conditioner every few months. Avoid prolonged exposure to direct sunlight or rain. Store in the dust bag provided when not in use." },
      { q: "Can I place a custom order?", a: "Absolutely! We love custom orders. You can choose colour, size, style, and even add personalised details. Contact us via WhatsApp or email with your specifications for a quote and timeline." },
    ],
  },
  {
    category: "Payments & Returns",
    items: [
      { q: "What payment methods do you accept?", a: "We accept all major debit/credit cards, bank transfers, and USSD payments through our secure Paystack payment gateway. All payments are encrypted and safe." },
      { q: "Is my payment information secure?", a: "Yes. All payments are processed through Paystack, a PCI-DSS compliant payment gateway. We never store your card details on our servers." },
      { q: "What is your return policy?", a: "We accept returns within 7 days of delivery if the item is in its original condition, unused, with all tags attached. Custom orders are non-refundable. Contact us to initiate a return." },
      { q: "How long do refunds take?", a: "Once we receive and inspect the returned item, refunds are processed within 5–7 business days back to your original payment method." },
    ],
  },
  {
    category: "Training & Courses",
    items: [
      { q: "Do I need any prior experience to enrol?", a: "Not at all! Our beginner courses are designed for complete newcomers. All you need is enthusiasm and the desire to learn. Advanced courses are also available for those with some experience." },
      { q: "Are the courses held online or in-person?", a: "We currently offer in-person training at our workshop. We are developing online course options which will be announced soon." },
      { q: "What will I need to bring to training?", a: "We provide all materials and tools during training. You just need to bring yourself, a notebook, and your enthusiasm! A materials list is sent after you complete registration." },
      { q: "Do I get a certificate after completing a course?", a: "Yes! Every graduate receives a Bethel Empire Certificate of Completion, which you can use to showcase your new skills to potential clients." },
    ],
  },
];

export default function FaqPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-empire-black py-24 relative">
        <div className="absolute top-0 left-0 right-0 h-0.5 gold-shimmer" />
        <div className="container-max px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gold text-xs tracking-[0.4em] uppercase mb-4">Help Centre</p>
          <h1 className="font-serif text-5xl lg:text-6xl text-white">Frequently Asked<br />Questions</h1>
          <p className="text-gray-400 mt-5 text-lg max-w-lg mx-auto">Everything you need to know about our products, orders, and training programmes.</p>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="section-padding bg-empire-light">
        <div className="container-max px-4 sm:px-6 lg:px-8 max-w-4xl">
          <FaqAccordion faqs={faqs} />
        </div>
      </section>

      {/* Still have questions */}
      <section className="section-padding bg-white">
        <div className="container-max px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 border border-gold/30 mb-6">
            <span className="text-gold text-2xl">?</span>
          </div>
          <h2 className="font-serif text-3xl text-empire-black mb-4">Still Have Questions?</h2>
          <p className="text-empire-grey max-w-md mx-auto mb-8">Our team is happy to help. Reach out via the contact form or WhatsApp and we'll respond promptly.</p>
          <Link href="/contact" className="btn-gold">Contact Us</Link>
        </div>
      </section>
    </div>
  );
}
