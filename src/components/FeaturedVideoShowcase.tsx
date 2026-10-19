import React from 'react';
import { Star } from 'lucide-react';

interface FeaturedVideoProps {
  videoUrl: string;
  title: string;
  price: string;
  productImage: string;
  rating?: number;
  reviewsCount?: number;
  onAddToCart: () => void;
  onProductClick: () => void;
}

export const FeaturedVideoShowcase: React.FC<FeaturedVideoProps> = ({
  videoUrl,
  title,
  price,
  productImage,
  rating = 5.0,
  reviewsCount = 128,
  onAddToCart,
  onProductClick,
}) => {
  return (
    <div className="w-full my-4 px-4">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-xl font-bold text-amber-400">الأكثر مبيعاً</h2>
      </div>

      <div className="relative w-full max-w-md mx-auto rounded-3xl overflow-hidden shadow-2xl bg-neutral-900 border border-amber-500/30">
        {/* فيديو العرض التفاعلي */}
        <div className="relative w-full aspect-[4/3] cursor-pointer" onClick={onProductClick}>
          <video
            src={videoUrl}
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            className="w-full h-full object-cover"
          />

          {/* صورة المنتج المصغرة العائمة */}
          <div className="absolute bottom-3 left-3 w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md p-1 border border-amber-500/40 shadow-lg">
            <img
              src={productImage}
              alt={title}
              className="w-full h-full object-cover rounded-xl"
            />
          </div>
        </div>

        {/* تفاصيل المنتج وزر الإضافة */}
        <div className="p-4 bg-gradient-to-b from-neutral-900 to-black text-right">
          <h3
            onClick={onProductClick}
            className="text-lg font-bold text-white mb-1 hover:text-amber-400 cursor-pointer transition-colors line-clamp-1"
          >
            {title}
          </h3>

          {/* التقييمات والنجوم */}
          <div className="flex items-center justify-end gap-1 mb-2">
            <span className="text-xs text-neutral-400">({reviewsCount})</span>
            <span className="text-xs font-semibold text-amber-400">{rating}</span>
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              ))}
            </div>
          </div>

          <div className="flex justify-between items-center mt-3 pt-2 border-t border-neutral-800">
            <button
              onClick={onAddToCart}
              className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black font-bold px-6 py-2.5 rounded-full text-sm shadow-lg transition-all transform active:scale-95"
            >
              أضف إلى السلة
            </button>
            <div className="text-left">
              <span className="text-xs text-neutral-400 mr-1">ر.س</span>
              <span className="text-xl font-extrabold text-amber-400">{price}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};