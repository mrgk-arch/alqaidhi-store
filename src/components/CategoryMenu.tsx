import { useState } from 'react';
import { Flower2, Flame, Sparkles, Wind, Palette, ShoppingBag, Moon, Tag, type LucideIcon } from 'lucide-react';
import { CATEGORIES } from '../types';

const iconMap: Record<string, LucideIcon> = {
  'عطور': Flower2,
  'بخور': Flame,
  'عناية خاصة': Sparkles,
  'عناية بالشعر': Wind,
  'مكياج': Palette,
  'شنط': ShoppingBag,
  'ملابس نوم': Moon,
  'عروض': Tag,
};

const categoryImages: Record<string, string> = {
  'عطور': 'https://images.pexels.com/photos/36389336/pexels-photo-36389336.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'بخور': 'https://images.pexels.com/photos/6201645/pexels-photo-6201645.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'عناية خاصة': 'https://images.pexels.com/photos/16233812/pexels-photo-16233812.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'عناية بالشعر': 'https://images.pexels.com/photos/30696654/pexels-photo-30696654.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'مكياج': 'https://images.pexels.com/photos/26927323/pexels-photo-26927323.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'شنط': 'https://images.pexels.com/photos/290523/pexels-photo-290523.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'ملابس نوم': 'https://images.pexels.com/photos/6724531/pexels-photo-6724531.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'عروض': 'https://images.pexels.com/photos/7703038/pexels-photo-7703038.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
};

interface CategoryMenuProps {
  categories: any[]; 
  activeCategory: string | 'all';
  onCategoryChange: (id: string | 'all') => void;
}

export default function CategoryMenu({ categories, activeCategory, onCategoryChange }: CategoryMenuProps) {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 mt-16 lg:mt-20 pt-4">
      <div className="flex items-center gap-4 mb-6">
        <div className="h-px flex-1 ornamental-line" />
        <h2 className="font-serif text-lg lg:text-2xl font-bold text-gold-200 text-glow-gold">تسوق حسب القسم</h2>
        <div className="h-px flex-1 ornamental-line" />
      </div>

      <div className="flex justify-start sm:justify-center gap-3 sm:gap-5 lg:gap-6 overflow-x-auto no-scrollbar pb-3 px-4">
     {categories.map((cat, idx) => {
          const isActive = activeCategory === cat.slug || activeCategory === cat.name;
          const isHovered = hovered === idx;

          return (
            <button
              key={cat.id || idx}
              onClick={() => onCategoryChange(isActive ? 'all' : (cat.slug || cat.name))}
              onMouseEnter={() => setHovered(idx)}
              onMouseLeave={() => setHovered(null)}
              className="flex flex-col items-center gap-2.5 shrink-0 group"
            >
<div
  className={`relative w-[76px] h-[76px] sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-2xl overflow-hidden transition-all duration-300 shadow-lg ${
    isActive
      ? 'ring-4 ring-gold-400 ring-offset-2 ring-offset-ink-900 scale-110 shadow-[0_0_20px_rgba(212,175,55,0.6)]'
      : 'ring-2 ring-gold-400/40 hover:scale-105 hover:ring-gold-400'
  }`}
>
  <img
    src={cat.image_url}
    alt={cat.name}
    className="w-full h-full object-contain rounded-2xl transition-transform duration-500 group-hover:scale-110"
  />
</div>
              <span
                className={`text-xs sm:text-sm font-medium transition-colors ${
                  isActive ? 'text-gold-300' : 'text-ink-200 group-hover:text-gold-200'
                }`}
              >
                {cat.name}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
