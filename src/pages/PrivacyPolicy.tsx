import { useEffect } from 'react';

export default function PrivacyPolicy() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="pt-32 pb-24 bg-cream min-h-screen">
      <div className="container-shell max-w-4xl">
        <h1 className="font-display text-4xl md:text-5xl text-charcoal mb-8">Privacy Policy</h1>
        <div className="prose prose-lg text-charcoal/80 space-y-6">
          <p>At Phoenix Pets, we take your privacy seriously. This Privacy Policy outlines how we collect, use, and protect your personal information.</p>
          
          <h2 className="font-display text-2xl text-charcoal mt-8 mb-4">1. Information We Collect</h2>
          <p>We may collect personal information such as your name, email address, phone number, and shipping address when you make a purchase, sign up for our newsletter, or contact us.</p>
          
          <h2 className="font-display text-2xl text-charcoal mt-8 mb-4">2. How We Use Your Information</h2>
          <p>We use your information to process transactions, deliver products, communicate with you about your orders, and send promotional offers if you have opted in.</p>
          
          <h2 className="font-display text-2xl text-charcoal mt-8 mb-4">3. Data Security</h2>
          <p>We implement a variety of security measures to maintain the safety of your personal information. However, no method of transmission over the Internet is 100% secure.</p>
          
          <h2 className="font-display text-2xl text-charcoal mt-8 mb-4">4. Contact Us</h2>
          <p>If you have any questions regarding this privacy policy, you may contact us using the information in our footer.</p>
        </div>
      </div>
    </main>
  );
}
