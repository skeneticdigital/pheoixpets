import React from 'react';
import useReveal from '../hooks/useReveal';
import { MapPin, Phone, Clock } from 'lucide-react';

export default function ContactUs() {
  const sectionRef = useReveal<HTMLElement>({ duration: 1.2 });

  const [formData, setFormData] = React.useState({ name: '', phone: '', message: '' });

  const handleWhatsAppSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { name, phone, message } = formData;
    const text = `Hi Phoenix Pets,\n\nMy name is ${name}.\nMy phone number is ${phone}.\n\nMessage: ${message}`;
    const url = `https://wa.me/918797979300?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  return (
    <main className="pt-32 pb-24 bg-cream min-h-screen">
      <section id="contact" ref={sectionRef}>
        <div className="container-shell max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl md:text-5xl text-charcoal mb-4">Get in Touch</h2>
            <p className="text-charcoal/70 max-w-xl mx-auto">We'd love to hear from you. Visit our store, drop us a message, or follow us online.</p>
          </div>
          
          <div className="flex flex-col gap-8 bg-[#f9f8f6] rounded-[2rem] shadow-sm border border-charcoal/10 overflow-hidden p-8 lg:p-14">
            
            {/* Top Section: Form (Left) and Details (Right) */}
            <div className="flex flex-col lg:flex-row gap-12">
              
              {/* Left: Send a Message */}
              <div className="lg:w-1/2">
                <h3 className="font-display text-3xl text-charcoal mb-6">Send a Message</h3>
                <form className="space-y-4" onSubmit={handleWhatsAppSubmit}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-charcoal/70 mb-1.5 ml-1">Your Name</label>
                      <input 
                        type="text" 
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full px-4 py-2.5 rounded-xl border border-charcoal/10 bg-white focus:bg-white focus:outline-none focus:ring-2 focus:ring-clay/30 transition-all text-sm shadow-sm" 
                        placeholder="John Doe" 
                        required 
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-charcoal/70 mb-1.5 ml-1">Phone Number</label>
                      <input 
                        type="tel" 
                        value={formData.phone}
                        onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                        className="w-full px-4 py-2.5 rounded-xl border border-charcoal/10 bg-white focus:bg-white focus:outline-none focus:ring-2 focus:ring-clay/30 transition-all text-sm shadow-sm" 
                        placeholder="+91 98765 43210" 
                        required 
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-charcoal/70 mb-1.5 ml-1">Message</label>
                    <textarea 
                      value={formData.message}
                      onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl border border-charcoal/10 bg-white focus:bg-white focus:outline-none focus:ring-2 focus:ring-clay/30 transition-all text-sm min-h-[120px] resize-y shadow-sm" 
                      placeholder="How can we help you?" 
                      required
                    ></textarea>
                  </div>
                  <button type="submit" className="px-8 py-3 bg-clay text-white rounded-full font-medium hover:bg-clay-dark transition-colors text-sm w-full sm:w-auto shadow-sm">
                    Send Message
                  </button>
                </form>
              </div>

              {/* Right: Contact Details */}
              <div className="lg:w-1/2 flex flex-col justify-center">
                <h3 className="font-display text-3xl text-charcoal mb-8">Contact Details</h3>
                
                <div className="flex flex-col gap-6">
                  <div className="flex items-start gap-4 group">
                    <div className="w-12 h-12 rounded-[1rem] bg-white border border-charcoal/5 flex items-center justify-center shrink-0 shadow-sm group-hover:border-clay/30 transition-colors">
                      <MapPin className="text-clay w-5 h-5" />
                    </div>
                    <div className="pt-1">
                      <h4 className="font-display text-lg text-charcoal mb-1">Visit Us</h4>
                      <p className="text-charcoal/70 leading-relaxed text-sm max-w-sm">
                        No.35/15, S Mada St, Sarojini Nagar, Kolathur, Chennai, Tamil Nadu 600099
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 group">
                    <div className="w-12 h-12 rounded-[1rem] bg-white border border-charcoal/5 flex items-center justify-center shrink-0 shadow-sm group-hover:border-clay/30 transition-colors">
                      <Phone className="text-clay w-5 h-5" />
                    </div>
                    <div className="pt-1">
                      <h4 className="font-display text-lg text-charcoal mb-1">WhatsApp & Call</h4>
                      <a href="https://wa.me/918797979300" target="_blank" rel="noopener noreferrer" className="text-charcoal/70 hover:text-clay transition-colors text-sm block">
                        +91 8797979300
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 group">
                    <div className="w-12 h-12 rounded-[1rem] bg-white border border-charcoal/5 flex items-center justify-center shrink-0 shadow-sm group-hover:border-clay/30 transition-colors">
                      <Clock className="text-clay w-5 h-5" />
                    </div>
                    <div className="pt-1">
                      <h4 className="font-display text-lg text-charcoal mb-1">Working Hours</h4>
                      <p className="text-charcoal/70 text-sm">
                        Monday &ndash; Saturday<br/>
                        9:00 AM &ndash; 10:00 PM
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-8 border-t border-charcoal/10 flex items-center gap-4">
                  <h4 className="font-display text-base text-charcoal mr-2">Connect With Us</h4>
                  <a href="https://www.facebook.com/61590696755055/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-charcoal/15 flex items-center justify-center text-charcoal bg-white hover:bg-charcoal hover:text-white transition-all shadow-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                  </a>
                  <a href="https://www.instagram.com/phoenixpets.in?utm_source=qr" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-charcoal/15 flex items-center justify-center text-charcoal bg-white hover:bg-charcoal hover:text-white transition-all shadow-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                  </a>
                  <a href="https://www.youtube.com/@PhoenixPets.in-1104" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-charcoal/15 flex items-center justify-center text-charcoal bg-white hover:bg-charcoal hover:text-white transition-all shadow-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>
                  </a>
                </div>
              </div>
            </div>

            {/* Bottom: Google Map */}
            <div className="w-full h-[400px] relative rounded-2xl overflow-hidden shadow-inner border border-charcoal/5 mt-4">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3886.082728468758!2d80.207869614823!3d13.123287090757!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a5264906f3a3a8b%3A0x6b86e9e4f50f3b0e!2sS%20Mada%20St%2C%20Sarojini%20Nagar%2C%20Kolathur%2C%20Chennai%2C%20Tamil%20Nadu%20600099!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0 w-full h-full grayscale-[30%] opacity-90 object-cover"
                title="Phoenix Pets Location"
              ></iframe>
            </div>

          </div>
        </div>
      </section>
    </main>
  );
}
