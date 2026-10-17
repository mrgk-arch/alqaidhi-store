import { useState, useEffect, useCallback, useRef } from 'react';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import type { StoreSettings, Banner } from '../types';

interface HeroSlide {
  id: number;
  title: string;
  subtitle: string;
  image: string;
  cta: string;
  badge: string;
  originalBanner?: Banner; // أضف هذا السطر هنا
}

const defaultSlides: HeroSlide[] = [
  {
    id: 1,
    title: 'تشكيلة العطور الفاخرة',
    subtitle: 'اكتشف أرقى العطور العالمية والعربية بخصومات تصل إلى 40%',
    image: 'https://images.pexels.com/photos/10924522/pexels-photo-10924522.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    cta: 'تسوق الآن',
    badge: 'عرض خاص',
  },
  {
    id: 2,
    title: 'البخور والمسك الأصيل',
    subtitle: 'روائح شرقية أصيلة تنشر العبير في منزلك بأجود الأنواع',
    image: 'https://images.pexels.com/photos/6201645/pexels-photo-6201645.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    cta: 'اكتشف المجموعة',
    badge: 'وصل حديثاً',
  },
  {
    id: 3,
    title: 'عناية خاصة ببشرتك',
    subtitle: 'منتجات العناية الفاخرة لنضارة وإشراقة تدوم طوال اليوم',
    image: 'https://images.pexels.com/photos/7670737/pexels-photo-7670737.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    cta: 'تسوق العناية',
    badge: 'الأكثر مبيعاً',
  },
];
 interface HeroCarouselProps {
  settings: StoreSettings | null;
  banners?: Banner[];
  onBannerClick?: (banner: Banner) => void;
}

export default function HeroCarousel({ settings, banners = [], onBannerClick }: HeroCarouselProps) {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
    touchEndX.current = null;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    if (distance > 40) {
      next(); // سحب لليسار -> البنر التالي
    } else if (distance < -40) {
      prev(); // سحب لليمين -> البنر السابق
    }
  };
const slides = banners.length > 0
    ? banners.map((b, i) => ({
        id: i + 1,
        title: b.title || 'عرض خاص',
        subtitle: '',
        image: b.image_url,
        cta: 'تسوق الآن',
        badge: 'إعلان',
        originalBanner: b, // <--- هذه الإضافة الضرورية ليتم التعرف على المنتج المرتبط بالبنر
      }))
    : [
        { ...defaultSlides[0], image: settings?.hero_image_1 || defaultSlides[0].image },
        { ...defaultSlides[1], image: settings?.hero_image_2 || defaultSlides[1].image },
        { ...defaultSlides[2], image: settings?.hero_image_3 || defaultSlides[2].image },
      ];

  const next = useCallback(() => setCurrent((p) => (p + 1) % slides.length), [slides.length]);
  const prev = useCallback(() => setCurrent((p) => (p - 1 + slides.length) % slides.length), [slides.length]);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(next, 5500);
    return () => clearInterval(timer);
  }, [isPaused, next]);

  return (
    <section
  className="relative w-full"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
   <div 
  onTouchStart={handleTouchStart}
  onTouchMove={handleTouchMove}
  onTouchEnd={handleTouchEnd}
  className="relative w-full h-[65vh] min-h-[420px] max-h-[650px] overflow-hidden"
>
        {slides.map((slide, idx) => (
          <div
          key={slide.id}
         onClick={() => {
            const banner = (slide as any).originalBanner;
            if (banner) {
              onBannerClick?.(banner);
            }
          }}
          className={`absolute inset-0 transition-all duration-1000 ease-out ${
            idx === current ? 'opacity-100 scale-100' : 'opacity-0 scale-110 pointer-events-none'
         } ${(slide as any).originalBanner?.product_id ? 'cursor-pointer' : ''}`}
        >
          <img 
  src={slide.image} 
  alt={slide.title} 
  className="w-full h-full object-cover object-center" 
/>
{/* طبقة تدرج خفيفة جداً فقط لإبراز النص دون إخفاء الصورة */}
<div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />  
            

            <div className="absolute inset-0 flex items-center">
              <div className="max-w-lg px-6 sm:px-10 lg:px-16">
                <span
                  className={`inline-flex items-center gap-1.5 px-4 py-1.5 gold-gradient-soft border border-gold-400/40 rounded-full text-gold-200 text-xs font-medium mb-4 ${
                    idx === current ? 'animate-slide-up' : ''
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  {slide.badge}
                </span>
                <h2
                  className={`font-serif text-2xl sm:text-4xl lg:text-5xl font-bold text-ink-50 mb-3 lg:mb-4 leading-tight text-glow-gold ${
                    idx === current ? 'animate-slide-up' : ''
                  }`}
                  style={{ animationDelay: '0.1s' }}
                >
                  {slide.title}
                </h2>
                <p
                  className={`text-sm sm:text-lg text-ink-200 mb-5 lg:mb-7 leading-relaxed max-w-md ${
                    idx === current ? 'animate-slide-up' : ''
                  }`}
                  style={{ animationDelay: '0.2s' }}
                >
                  {slide.subtitle}
                </p>
                <button
                  className={`group inline-flex items-center gap-2 px-7 py-3 lg:px-9 lg:py-3.5 gold-gradient text-ink-900 font-bold rounded-full text-sm hover:shadow-2xl hover:shadow-gold-500/40 hover:scale-105 transition-all ${
                    idx === current ? 'animate-slide-up' : ''
                  }`}
                  style={{ animationDelay: '0.3s' }}
                >
                  {slide.cta}
                  <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        ))}


        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrent(idx)}
              className={`h-2 rounded-full transition-all duration-300 ${
                idx === current ? 'w-10 bg-gold-400 shadow-md shadow-gold-500/40' : 'w-2 bg-ink-300/40 hover:bg-gold-400/40'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
