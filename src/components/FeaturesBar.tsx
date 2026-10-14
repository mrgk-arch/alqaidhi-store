import { Truck, ShieldCheck, Sparkles, Headphones } from 'lucide-react';

const features = [
  { icon: Truck, title: 'توصيل سريع', desc: 'شحن لجميع المدن' },
  { icon: ShieldCheck, title: 'منتجات أصلية', desc: 'جودة مضمونة 100%' },
  { icon: Sparkles, title: 'تشكيلة فاخرة', desc: 'أرقى الماركات العالمية' },
  { icon: Headphones, title: 'دعم 24/7', desc: 'خدمة عملاء متواصلة' },
];

export default function FeaturesBar() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 mt-8 lg:mt-10">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
        {features.map((f, idx) => {
          const Icon = f.icon;
          return (
            <div
              key={idx}
              className="flex items-center gap-3 luxury-card rounded-2xl p-3.5 lg:p-4 border border-gold-400/10 hover:border-gold-400/25 transition-all hover:shadow-lg hover:shadow-gold-500/5 animate-slide-up"
              style={{ animationDelay: `${idx * 0.08}s` }}
            >
              <div className="w-11 h-11 lg:w-12 lg:h-12 rounded-xl gold-gradient-soft border border-gold-400/20 flex items-center justify-center shrink-0">
                <Icon className="w-5 h-5 lg:w-6 lg:h-6 text-gold-300" />
              </div>
              <div className="min-w-0">
                <h3 className="text-sm font-bold text-ink-50 line-clamp-1">{f.title}</h3>
                <p className="text-xs text-ink-400 line-clamp-1">{f.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
