import { useState, useMemo, useRef, useEffect } from 'react';
import { Search, Heart, ShoppingBag, User, Settings, Sparkles, X } from 'lucide-react';
import type { Product } from '../types';

const LOGO_URL = '/WhatsApp_Image_2026-09-13_at_2.20.44_PM.jpeg';

interface TopBarProps {
  cartCount: number;
  onCartClick: () => void;
  onSearch: (query: string) => void;
  onAdminClick: () => void;
  products: Product[];
  onAccountClick?: () => void;
}

export default function TopBar({ cartCount, onCartClick, onSearch, onAdminClick, products, onAccountClick }: TopBarProps) {
  const [searchValue, setSearchValue] = useState('');
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
const desktopSuggestionsRef = useRef<HTMLFormElement>(null);
const mobileSuggestionsRef = useRef<HTMLDivElement>(null);

  const suggestions = useMemo(() => {
    if (!searchValue.trim()) return [];
    const q = searchValue.trim();
    return products
      .filter((p) => p.name.includes(q) || p.category.includes(q))
      .slice(0, 5);
  }, [searchValue, products]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        (desktopSuggestionsRef.current && !desktopSuggestionsRef.current.contains(target)) &&
        (mobileSuggestionsRef.current && !mobileSuggestionsRef.current.contains(target))
      ) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchValue);
    setShowSuggestions(false);
  };

  const handleSelectSuggestion = (name: string) => {
    setSearchValue(name);
    onSearch(name);
    setShowSuggestions(false);
  };

  return (
    <header className="sticky top-0 z-50">
      {/* Announcement bar */}
      <div className="gold-gradient text-ink-900 text-center py-1.5 text-xs font-medium">
        <span className="inline-flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5" /> توصيل مجاني للطلبات فوق 500 ر.س - شحن سريع لجميع المدن
        </span>
      </div>

      <div className="glass-card border-b border-gold-400/15">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16 lg:h-20 gap-3">
            {/* Logo */}
            <div className="flex items-center gap-2.5 shrink-0">
              <div className="relative w-11 h-11 lg:w-13 lg:h-13 rounded-full overflow-hidden">
                <img src={LOGO_URL} alt="شعار متجر القيضي" className="w-full h-full object-cover" />
              </div>
              <div className="flex flex-col">
  <h1 className="font-serif text-base sm:text-lg lg:text-xl font-bold gold-text leading-tight">متجر القيضي</h1>
  <p className="text-[9px] sm:text-[10px] text-gold-300/50 tracking-[0.2em] uppercase">Luxury Perfumes</p>
</div>
            </div>

            {/* Search - Desktop */}
            <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md relative" ref={desktopSuggestionsRef}>
              <div className="relative w-full group">
                <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gold-300/60 pointer-events-none" />
                <input
                  type="text"
                  value={searchValue}
                  onChange={(e) => {
                    setSearchValue(e.target.value);
                    setShowSuggestions(true);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  placeholder="ابحث عن عطور، بخور، مكياج..."
                  className="w-full bg-ink-800/60 border border-gold-400/15 rounded-full py-2.5 pr-12 pl-4 text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-gold-400 text-sm transition-all"
                />
                {showSuggestions && suggestions.length > 0 && (
                  <div className="absolute top-full mt-2 left-0 right-0 bg-ink-800 border border-gold-400/20 rounded-2xl shadow-2xl overflow-hidden z-50">
                    {suggestions.map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => handleSelectSuggestion(p.name)}
                        className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gold-400/10 text-right transition-colors"
                      >
                        {p.image_url ? (
                          <img src={p.image_url} alt={p.name} className="w-10 h-10 rounded-lg object-cover shrink-0" />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-ink-700 shrink-0" />
                        )}
                        <div className="flex-1 min-w-0 text-right">
                          <p className="text-sm text-ink-50 line-clamp-1">{p.name}</p>
                          <p className="text-xs text-gold-300/60">{p.category}</p>
                        </div>
                        <span className="text-sm text-gold-300 font-bold shrink-0">{p.price} ر.س</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </form>

            {/* Actions */}
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              <button
                onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
                className="md:hidden w-10 h-10 rounded-full hover:bg-gold-400/10 flex items-center justify-center text-slate-300 transition-colors"
              >
                {mobileSearchOpen ? <X className="w-5 h-5" /> : <Search className="w-5 h-5" />}
              </button>

              <button className="w-10 h-10 rounded-full hover:bg-gold-400/10 flex items-center justify-center text-slate-300 transition-colors">
                <Heart className="w-5 h-5" />
              </button>

              <button
                onClick={onCartClick}
                className="w-10 h-10 rounded-full hover:bg-gold-400/10 flex items-center justify-center text-slate-300 relative transition-colors"
              >
                <ShoppingBag className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-gold-500 text-ink-900 text-xs font-bold rounded-full flex items-center justify-center px-1">
                    {cartCount}
                  </span>
                )}
              </button>

              <button
                onClick={onAccountClick}
                className="w-10 h-10 rounded-full hover:bg-gold-400/10 flex items-center justify-center text-slate-300 transition-colors"
                title="حسابي"
              >
                <User className="w-5 h-5" />
              </button>

              <button
                onClick={onAdminClick}
                className="w-10 h-10 rounded-full bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/40 flex items-center justify-center transition-colors"
                title="لوحة التحكم"
              >
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Search - Mobile */}
          {mobileSearchOpen && (
            <div className="md:hidden pb-3 animate-slide-up relative" ref={mobileSuggestionsRef}>
              <form onSubmit={handleSearch} className="relative w-full">
                <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gold-300/60 pointer-events-none" />
                <input
                  type="text"
                  value={searchValue}
                  onChange={(e) => {
                    setSearchValue(e.target.value);
                    setShowSuggestions(true);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  placeholder="ابحث عن منتج..."
                  className="w-full bg-ink-800/60 border border-gold-400/15 rounded-full py-2.5 pr-12 pl-4 text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-gold-400 text-sm"
                  autoFocus
                />
              </form>
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute top-full mt-2 left-0 right-0 bg-ink-800 border border-gold-400/20 rounded-2xl shadow-2xl overflow-hidden z-50">
                  {suggestions.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => handleSelectSuggestion(p.name)}
                      className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gold-400/10 text-right transition-colors"
                    >
                      {p.image_url ? (
                        <img src={p.image_url} alt={p.name} className="w-10 h-10 rounded-lg object-cover shrink-0" />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-ink-700 shrink-0" />
                      )}
                      <div className="flex-1 min-w-0 text-right">
                        <p className="text-sm text-ink-50 line-clamp-1">{p.name}</p>
                        <p className="text-xs text-gold-300/60">{p.category}</p>
                      </div>
                      <span className="text-sm text-gold-300 font-bold shrink-0">{p.price} ر.س</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}