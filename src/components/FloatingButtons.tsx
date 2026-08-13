import { useEffect, useState } from 'react';
import { ArrowUp, MessageCircle } from 'lucide-react';

export default function FloatingButtons() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 480);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-center gap-3">
      <button
        aria-label="Chat on WhatsApp"
        className="h-[52px] w-[52px] flex items-center justify-center rounded-full bg-[#2E7D5B] text-white shadow-card transition-all duration-300 hover:scale-110 hover:rotate-6"
      >
        <MessageCircle size={22} />
      </button>
      <button
        aria-label="Scroll to top"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className={`h-11 w-11 flex items-center justify-center rounded-full bg-charcoal text-cream shadow-card transition-all duration-400 ease-cinematic hover:scale-110 ${
          visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
      >
        <ArrowUp size={18} />
      </button>
    </div>
  );
}
