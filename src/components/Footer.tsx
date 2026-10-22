import { Twitter, Facebook, Instagram, MapPin, Phone, Mail, Send } from 'lucide-react';
import type { StoreSettings } from '../types';
import TikTokIcon from './TikTokIcon';

const LOGO_URL = '/logo.png';

interface FooterProps {
  settings: StoreSettings | null;
}

export default function Footer({ settings }: FooterProps) {
  const socials = [
    { name: 'تيك توك', icon: TikTokIcon, url: settings?.tiktok_url || 'https://tiktok.com' },
    { name: 'تويتر', icon: Twitter, url: settings?.twitter_url || 'https://twitter.com' },
    { name: 'فيسبوك', icon: Facebook, url: settings?.facebook_url || 'https://facebook.com' },
    { name: 'انستغرام', icon: Instagram, url: settings?.instagram_url || 'https://instagram.com' },
  ];

  return (
    <footer className="relative mt-12 border-t border-gold-400/15 bg-ink-950/60">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="w-16 h-16 rounded-full bg-ink-900 border border-gold-400/20 flex items-center justify-center">
          <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-gold-400/40">
            <img src={LOGO_URL} alt="شعار متجر القيضي" className="w-full h-full object-cover" />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-16 pb-24 lg:pb-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="text-center sm:text-right">
            <div className="flex items-center justify-center sm:justify-start gap-2.5 mb-3">
              <div>
                <h3 className="font-serif text-xl font-bold gold-text">متجر القيضي</h3>
                <p className="text-[10px] text-gold-300/50 tracking-[0.25em] uppercase">Luxury Store</p>
              </div>
            </div>
            <p className="text-sm text-ink-300 leading-relaxed max-w-xs">
              متجر القيضي لأفخم العطور والبخور ومنتجات العناية والمكياج والشنط
            </p>
          </div>

          {/* Quick Links */}
          <div className="text-center sm:text-right">
            <h4 className="font-bold text-gold-200 mb-3">روابط سريعة</h4>
            <ul className="space-y-2 text-sm text-ink-300">
              <li><a href="#" className="hover:text-gold-300 transition-colors">العطور</a></li>
              <li><a href="#" className="hover:text-gold-300 transition-colors">البخور</a></li>
              <li><a href="#" className="hover:text-gold-300 transition-colors">العناية الخاصة</a></li>
              <li><a href="#" className="hover:text-gold-300 transition-colors">العروض</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="text-center sm:text-right">
            <h4 className="font-bold text-gold-200 mb-3">تواصل معنا</h4>
            <div className="space-y-2.5 text-sm text-ink-300">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <Phone className="w-4 h-4 text-gold-400 shrink-0" />
                <span dir="ltr">+{settings?.whatsapp_number || '967779392061'}</span>
              </div>
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <MapPin className="w-4 h-4 text-gold-400 shrink-0" />
                <span>مأرب، اليمن</span>
              </div>
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <Mail className="w-4 h-4 text-gold-400 shrink-0" />
                <span>info@al-qaydhi.com</span>
              </div>
            </div>
          </div>

          {/* Social */}
          <div className="text-center sm:text-right">
            <h4 className="font-bold text-gold-200 mb-3">تابعنا على</h4>
            <div className="flex items-center justify-center sm:justify-start gap-3 mb-4">
              {socials.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-11 h-11 rounded-full bg-ink-800 border border-gold-400/15 hover:border-gold-400/40 hover:bg-gold-400/10 flex items-center justify-center text-gold-200 hover:text-gold-400 transition-all hover:scale-110 hover:shadow-lg hover:shadow-gold-500/20"
                    title={social.name}
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
            <a
              href={`https://wa.me/${settings?.whatsapp_number || '967779392061'}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white text-sm font-medium rounded-full transition-all hover:scale-105 hover:shadow-lg hover:shadow-emerald-600/30"
            >
              <Send className="w-4 h-4" />
              تواصل عبر واتساب
            </a>
          </div>
        </div>

        <div className="pt-6 border-t border-gold-400/10 text-center">
          <p className="text-xs text-ink-400">© 2026 متجر القيضي. جميع الحقوق محفوظة.</p>
        </div>
      </div>
    </footer>
  );
}
