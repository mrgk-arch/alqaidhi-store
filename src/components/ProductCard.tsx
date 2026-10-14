import { Star, Plus, Heart } from 'lucide-react';
import type { Product } from '../types';
import { useState } from 'react';
import { supabase } from '../supabaseClient';
interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onSelectProduct?: (product: Product) => void;
  index: number;
}

export default function ProductCard({ product, onAddToCart, onSelectProduct, index }: ProductCardProps) {
  const discount = product.old_price
    ? Math.round(((product.old_price - product.price) / product.old_price) * 100)
    : 0;
const [userRating, setUserRating] = useState<number | null>(null);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleRate = async (e: React.MouseEvent, selectedStar: number) => {
    e.stopPropagation();
    if (isSubmitting) return;

    setIsSubmitting(true);
    setUserRating(selectedStar);

    try {
      const currentCount = product.reviews_count || 0;
      const currentRating = product.rating || 5;
      const newCount = currentCount + 1;
      const newRating = Number(((currentRating * currentCount + selectedStar) / newCount).toFixed(1));

      const { error } = await supabase
        .from('products')
        .update({ rating: newRating, reviews_count: newCount })
        .eq('id', product.id);

      if (error) throw error;
    } catch (err) {
      console.error('فشل حفظ التقييم:', err);
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div
      onClick={() => onSelectProduct && onSelectProduct(product)}
      className="group relative luxury-card rounded-2xl lg:rounded-3xl overflow-hidden border border-gold-400/10 hover:border-gold-400/30 transition-all duration-500 hover:shadow-2xl cursor-pointer"
      style={{ animationDelay: `${index * 0.06}s` }}
    >
      <div className="relative aspect-square overflow-hidden bg-ink-900">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-115"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-ink-500">
            <Star className="w-12 h-12" />
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-ink-900/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        <div className="absolute top-3 right-3 flex flex-col gap-1.5">
          {product.badge && (
            <span className="px-3 py-1 gold-gradient text-ink-900 text-[10px] font-bold rounded-full shadow-lg shadow-gold-500/20">
              {product.badge}
            </span>
          )}
          {discount > 0 && (
            <span className="px-3 py-1 bg-emerald-600 text-gold-100 text-[10px] font-bold rounded-full shadow-lg shadow-emerald-600/30">
              -{discount}%
            </span>
          )}
        </div>

        <button 
          onClick={(e) => {
            e.stopPropagation();
          }}
          className="absolute top-3 left-3 w-9 h-9 glass-card rounded-full flex items-center justify-center text-gold-200 hover:text-gold-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        >
          <Heart className="w-4 h-4" />
        </button>
      </div>

      <div className="p-3.5 lg:p-4">
        <span className="text-[10px] text-gold-400/70 uppercase tracking-wider font-medium">{product.category}</span>
        <h3 className="text-sm lg:text-base font-medium text-ink-50 mb-2 line-clamp-1 group-hover:text-gold-200 transition-colors">
          {product.name}
        </h3>

       <div className="flex items-center gap-2 mb-3">
  <div className="flex items-center gap-0.5">
    {[1, 2, 3, 4, 5].map((star) => {
      const activeStar = hoverRating || userRating || Math.round(product.rating || 5);
      const isFilled = star <= activeStar;

      return (
        <button
          key={star}
          type="button"
          onClick={(e) => handleRate(e, star)}
          onMouseEnter={() => setHoverRating(star)}
          onMouseLeave={() => setHoverRating(0)}
          className="p-0.5 transition-transform hover:scale-125 focus:outline-none"
          title={`تقييم ${star} من 5`}
        >
          <Star
            className={`w-4 h-4 transition-colors ${
              isFilled ? 'fill-gold-400 text-gold-400' : 'text-ink-500 hover:text-gold-300'
            }`}
          />
        </button>
      );
    })}
  </div>
  <span className="text-xs text-ink-400">
    ({(product.reviews_count || 0) + (userRating ? 1 : 0)})
  </span>
</div>

        <div className="flex items-center justify-between gap-2">
          <div className="flex flex-col">
            <span className="text-base lg:text-lg font-bold text-gold-300">
              {product.price} ر.س
            </span>
            {product.old_price && (
              <span className="text-xs text-ink-400 line-through">
                {product.old_price} ر.س
              </span>
            )}
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart(product);
            }}
            className="flex items-center gap-1.5 px-3 py-2 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-gold-100 text-xs font-medium rounded-xl transition-all"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">إضافة للسلّة</span>
          </button>
        </div>
      </div>
    </div>
  );
}