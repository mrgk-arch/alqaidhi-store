import { Home, LayoutGrid, Tag, ShoppingBag, User } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface BottomNavProps {
  active: string;
  onNavigate: (view: 'home' | 'categories' | 'offers' | 'cart' | 'account') => void;
  cartCount: number;
  onCartClick: () => void;
}

interface NavItem {
  id: 'home' | 'categories' | 'offers' | 'cart' | 'account';
  label: string;
  icon: LucideIcon;
}

const navItems: NavItem[] = [
  { id: 'home', label: 'الرئيسية', icon: Home },
  { id: 'categories', label: 'الأقسام', icon: LayoutGrid },
  { id: 'offers', label: 'العروض', icon: Tag },
  { id: 'cart', label: 'السلة', icon: ShoppingBag },
  { id: 'account', label: 'حسابي', icon: User },
];

export default function BottomNav({ active, onNavigate, cartCount, onCartClick }: BottomNavProps) {
  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 glass-card border-t border-gold-400/15 px-2 py-1.5 pb-[max(0.375rem,env(safe-area-inset-bottom))]">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = active === item.id;

          if (item.id === 'cart') {
            return (
              <button
                key={item.id}
                onClick={onCartClick}
                className="flex flex-col items-center gap-0.5 px-3 py-1.5 relative"
              >
                <div className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${isActive ? 'bg-gold-400/15 gold-glow' : ''}`}>
                  <Icon className={`w-5 h-5 ${isActive ? 'text-gold-300' : 'text-ink-300'} transition-colors`} />
                </div>
                <span className={`text-[10px] ${isActive ? 'text-gold-300 font-medium' : 'text-ink-400'}`}>{item.label}</span>
                {cartCount > 0 && (
                  <span className="absolute top-0 right-2 min-w-[16px] h-4 px-1 gold-gradient text-ink-900 text-[9px] font-bold rounded-full flex items-center justify-center shadow-md shadow-gold-500/30">
                    {cartCount}
                  </span>
                )}
              </button>
            );
          }

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className="flex flex-col items-center gap-0.5 px-3 py-1.5"
            >
              <div className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${isActive ? 'bg-gold-400/15 gold-glow' : ''}`}>
                <Icon className={`w-5 h-5 ${isActive ? 'text-gold-300' : 'text-ink-300'} transition-colors`} />
              </div>
              <span className={`text-[10px] ${isActive ? 'text-gold-300 font-medium' : 'text-ink-400'}`}>{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
