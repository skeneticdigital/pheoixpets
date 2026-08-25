import { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import { faqContent } from '../../data/faqContent';
import useReveal from '../../hooks/useReveal';

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const containerRef = useReveal<HTMLDivElement>({ type: 'fade-up', duration: 1.0 });

  return (
    <section className="py-24 bg-cream">
      <div className="container-shell max-w-3xl" ref={containerRef}>
        <div className="text-center mb-16">
          <h2 className="font-display text-4xl md:text-5xl text-charcoal mb-4">{faqContent.headline}</h2>
          <p className="text-charcoal/70 text-lg">{faqContent.subheadline}</p>
        </div>

        <div className="space-y-4">
          {faqContent.faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div 
                key={index}
                className={`border border-charcoal/10 rounded-2xl overflow-hidden transition-all duration-300 ${isOpen ? 'bg-white shadow-soft' : 'bg-transparent'}`}
              >
                <button
                  className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                >
                  <span className="font-display text-xl text-charcoal pr-8">{faq.question}</span>
                  <span className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center border transition-colors duration-300 ${isOpen ? 'border-[#ff7a00] bg-[#ff7a00] text-white' : 'border-charcoal/20 text-charcoal/50'}`}>
                    {isOpen ? <Minus size={16} /> : <Plus size={16} />}
                  </span>
                </button>
                
                <div 
                  className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-40 pb-5 opacity-100' : 'max-h-0 opacity-0'}`}
                >
                  <p className="text-charcoal/70 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
