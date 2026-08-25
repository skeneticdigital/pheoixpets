import { useEffect } from 'react';

export default function TermsOfService() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="pt-32 pb-24 bg-cream min-h-screen">
      <div className="container-shell max-w-4xl">
        <h1 className="font-display text-4xl md:text-5xl text-charcoal mb-8">Terms of Service</h1>
        <div className="prose prose-lg text-charcoal/80 space-y-6">
          <p>Welcome to Phoenix Pets. By using our website and services, you agree to comply with and be bound by the following terms of service.</p>
          
          <h2 className="font-display text-2xl text-charcoal mt-8 mb-4">1. Acceptance of Terms</h2>
          <p>By accessing or using our site, you agree to these Terms of Service and all applicable laws and regulations.</p>
          
          <h2 className="font-display text-2xl text-charcoal mt-8 mb-4">2. Use of Service</h2>
          <p>You agree to use our services only for lawful purposes and in a way that does not infringe the rights of, restrict, or inhibit anyone else's use of the website.</p>
          
          <h2 className="font-display text-2xl text-charcoal mt-8 mb-4">3. Product Information</h2>
          <p>We strive to ensure that all information on our website is accurate. However, we do not warrant that product descriptions or other content are error-free.</p>
          
          <h2 className="font-display text-2xl text-charcoal mt-8 mb-4">4. Changes to Terms</h2>
          <p>We reserve the right to modify these terms at any time. Your continued use of the site following any changes signifies your acceptance of the new terms.</p>
        </div>
      </div>
    </main>
  );
}
