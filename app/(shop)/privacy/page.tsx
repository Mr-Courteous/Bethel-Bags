import type { Metadata } from "next";
export const metadata: Metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
  return (
    <div>
      <section className="bg-empire-black py-20 relative">
        <div className="absolute top-0 left-0 right-0 h-0.5 gold-shimmer" />
        <div className="container-max px-4 sm:px-6 lg:px-8">
          <h1 className="font-serif text-5xl text-white">Privacy Policy</h1>
          <p className="text-gray-400 mt-3">Last updated: {new Date().toLocaleDateString("en-NG", { month: "long", year: "numeric" })}</p>
        </div>
      </section>
      <section className="section-padding bg-white">
        <div className="container-max px-4 sm:px-6 lg:px-8 max-w-3xl prose prose-lg">
          <h2>1. Information We Collect</h2>
          <p>We collect information you provide directly to us — including name, email address, phone number, and shipping address when you make a purchase or contact us.</p>
          <h2>2. How We Use Your Information</h2>
          <p>We use the information we collect to process transactions, send order confirmations and updates, respond to enquiries, and improve our services. We do not sell your personal information to third parties.</p>
          <h2>3. Payment Information</h2>
          <p>All payment transactions are processed through Paystack, a PCI-DSS compliant payment processor. We do not store your card details on our servers.</p>
          <h2>4. Cookies</h2>
          <p>We use cookies to maintain your shopping cart session. You can disable cookies in your browser settings, but this may affect site functionality.</p>
          <h2>5. Data Security</h2>
          <p>We implement appropriate security measures to protect your personal information against unauthorised access, alteration, disclosure, or destruction.</p>
          <h2>6. Contact Us</h2>
          <p>If you have questions about this Privacy Policy, please contact us at <a href="mailto:hello@bethelempire.com" className="text-gold">hello@bethelempire.com</a>.</p>
        </div>
      </section>
    </div>
  );
}
