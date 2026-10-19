import React from 'react';

interface FeaturedVideoProps {
  videoUrl: string;
  title: string;
  price: string;
  productImage: string;
  onAddToCart: () => void;
  onProductClick: () => void;
}

export const FeaturedVideoShowcase: React.FC<FeaturedVideoProps> = ({
  videoUrl,
  title,
  price,
  productImage,
  onAddToCart,
  onProductClick,
}) => {
  return (
    <div className="w-full my-6 px-4">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-xl font-bold text-amber-400">الأكثر مبيعاً</h2>
      </div>

      <div className="relative w-full max-w-md mx-auto rounded-3xl overflow-hidden shadow-2xl bg-neutral-900 border border-amber-500/20">
        <div className="relative w-full aspect-[4/3] cursor-pointer" onClick={onProductClick}>
          <video
            src={videoUrl}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          />

          <div className="absolute bottom-3 left-3 w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md p-1 border border-white/40 shadow-lg">
            <img
              src={productImage}
              alt={title}
              className="w-full h-full object-contain rounded-xl"
            />
          </div>
        </div>

        <div className="p-4 bg-gradient-to-b from-neutral-900 to-black text-right">
          <h3 
            onClick={onProductClick}
            className="text-lg font-bold text-white mb-1 hover:text-amber-400 cursor-pointer transition-colors"
          >
            {title}
          </h3>

          <div className="flex justify-between items-center mt-3">
            <span className="text-xl font-extrabold text-amber-400">
              {price} <span className="text-xs font-normal">ر.س</span>
            </span>

            <button
              onClick={onAddToCart}
              className="bg-amber-500 hover:bg-amber-600 text-black font-bold py-2.5 px-6 rounded-2xl shadow-lg transition-transform active:scale-95"
            >
              أضف إلى السلة
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};