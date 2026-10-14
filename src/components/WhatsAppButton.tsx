import { MessageCircle } from 'lucide-react';

interface WhatsAppButtonProps {
  whatsappNumber: string;
}

export default function WhatsAppButton({ whatsappNumber }: WhatsAppButtonProps) {
  const link = `https://wa.me/${whatsappNumber}`;

  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-20 lg:bottom-6 left-4 z-40 group"
      aria-label="تواصل عبر واتساب"
    >
      <div className="relative">
        <div className="absolute inset-0 bg-emerald-500 rounded-full animate-ping opacity-20" />
        <div className="relative w-14 h-14 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-full flex items-center justify-center shadow-xl shadow-emerald-600/40 hover:scale-110 transition-transform border border-emerald-400/30">
          <MessageCircle className="w-7 h-7 text-white" fill="white" />
        </div>
        <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-ink-800 text-gold-100 text-sm px-3 py-1.5 rounded-full whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border border-gold-400/20 shadow-lg">
          تواصل معنا
        </span>
      </div>
    </a>
  );
}
