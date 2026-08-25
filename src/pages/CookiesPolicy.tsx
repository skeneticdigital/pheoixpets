import { useEffect } from 'react';

export default function CookiesPolicy() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="pt-32 pb-24 bg-cream min-h-screen">
      <div className="container-shell max-w-4xl">
        <h1 className="font-display text-4xl md:text-5xl text-charcoal mb-8">Cookies Policy</h1>
        <div className="prose prose-lg text-charcoal/80 space-y-6">
          <p>Phoenix Pets uses cookies to improve your browsing experience, analyze site traffic, and personalize content. This policy explains what cookies are and how we use them.</p>
          
          <h2 className="font-display text-2xl text-charcoal mt-8 mb-4">1. What Are Cookies?</h2>
          <p>Cookies are small text files that are stored on your device when you visit a website. They help the website remember your actions and preferences over a period of time.</p>
          
          <h2 className="font-display text-2xl text-charcoal mt-8 mb-4">2. How We Use Cookies</h2>
          <p>We use cookies to remember your login details, keep items in your shopping cart, and understand how you interact with our website to improve our services.</p>
          
          <h2 className="font-display text-2xl text-charcoal mt-8 mb-4">3. Types of Cookies We Use</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Essential Cookies:</strong> Necessary for the website to function properly.</li>
            <li><strong>Analytical Cookies:</strong> Help us understand how visitors interact with our website.</li>
            <li><strong>Marketing Cookies:</strong> Used to track visitors across websites to display relevant advertisements.</li>
          </ul>
          
          <h2 className="font-display text-2xl text-charcoal mt-8 mb-4">4. Managing Cookies</h2>
          <p>You can control and/or delete cookies as you wish through your browser settings. However, disabling certain cookies may impact the functionality of our website.</p>
        </div>
      </div>
    </main>
  );
}
