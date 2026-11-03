import React, { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import type { Banner } from '../types';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { ArrowRight } from 'lucide-react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface ProductGridProps {
  products?: any[];
  activeCategory?: string;
  searchQuery?: string;
  onAddToCart?: (product: any) => void;
  onSelectProduct?: (product: any) => void;
  loading?: boolean;
  banners?: Banner[];
  brands?: any[];
  onBannerClick?: (banner: Banner) => void;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products = [],
  activeCategory = 'all',
  searchQuery = '',
  onAddToCart,
  onSelectProduct,
  loading,
  banners = [],
  brands = [],
  onBannerClick
}) => {
  const [selectedBrandFilter, setSelectedBrandFilter] = useState<string | null>(null);

  // إعادة ضبط الماركة عند تغيير القسم
  useEffect(() => {
    setSelectedBrandFilter(null);
  }, [activeCategory]);

  const middleBanners = banners.filter((b) => b.position === 'middle' || !b.position);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center text-amber-400 font-medium">
        ... جاري تحميل المنتجات
      </div>
    );
  }

  const filteredProducts = products.filter((product: any) => {
    const matchesCategory =
      !activeCategory ||
      activeCategory === 'all' ||
      activeCategory === 'الكل' ||
      product.category === activeCategory ||
      (product.category && activeCategory && product.category.trim() === activeCategory.trim());

    const matchesBrand =
      !selectedBrandFilter ||
      product.brand_id === selectedBrandFilter ||
      product.brand === selectedBrandFilter ||
      product.brand_name === selectedBrandFilter;

    const matchesSearch =
      !searchQuery ||
      product.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.brand?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.brand_name?.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesBrand && matchesSearch;
  });

  const firstHalf = filteredProducts.slice(0, 4);
  const secondHalf = filteredProducts.slice(4);

  const selectedBrandObj = brands.find(
    (b: any) => String(b.id || b.name) === String(selectedBrandFilter)
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

      {/* 1. حالة اختيار الماركة: إخفاء الأقسام وعرض الهيدر الأنيق في المنتصف */}
      {selectedBrandFilter ? (
        <div className="w-full mb-6 dir-rtl">
          <div className="flex items-center justify-between bg-ink-900/90 border border-amber-500/30 rounded-2xl p-3 sm:p-4 shadow-xl backdrop-blur-md">
            
            {/* جهة اليمين: الشعار واسم الماركة */}
            <div className="flex items-center gap-3">
              {selectedBrandObj?.image_url && (
                <img
                  src={selectedBrandObj.image_url}
                  alt={selectedBrandObj.name}
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover border border-amber-400 shadow-sm shrink-0"
                />
              )}
              <span className="text-base sm:text-lg font-bold text-white tracking-wide truncate max-w-[140px] sm:max-w-none">
                {selectedBrandObj?.name || 'الماركة'}
              </span>
            </div>

            {/* جهة اليسار: زر العودة للماركات */}
            <button
              onClick={() => setSelectedBrandFilter(null)}
              className="flex items-center gap-1.5 text-amber-400 hover:text-amber-300 font-semibold bg-amber-500/10 hover:bg-amber-500/20 text-xs sm:text-sm px-3 py-2 rounded-xl transition-all shrink-0 border border-amber-500/20"
            >
              <span>العودة للماركات</span>
              <ArrowRight className="w-4 h-4" />
            </button>

          </div>
        </div>
      ) : (
        /* 2. حالة عدم اختيار ماركة: عرض الماركات التابعة للقسم المختاري فقط */
        activeCategory && activeCategory !== 'all' && activeCategory !== 'الكل' && brands && brands.length > 0 && (
          <div className="my-6 px-2">
            <h3 className="text-2xl font-bold mb-6 text-center text-amber-400 tracking-tight">
              تصفح ماركات القسم
            </h3>
            <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
              {brands
                .filter((brand: any) => {
                  if (!brand.category || !activeCategory) return false;
                  return brand.category.trim() === activeCategory.trim();
                })
                .map((brand: any, idx: number) => {
                  const brandIdentifier = String(brand.id || brand.name);
                  return (
                    <div
                      key={brand.id || idx}
                      onClick={() => {
                        setSelectedBrandFilter(brandIdentifier);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="cursor-pointer group flex flex-col items-center w-20 sm:w-24 transition-all duration-300"
                    >
                      <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-ink-950 border border-amber-500/30 group-hover:border-amber-400 shadow-md overflow-hidden transition-all duration-300 group-hover:scale-105">
                        <img
                          src={brand.image_url || brand.logo}
                          alt={brand.name}
                          className="w-full h-full object-cover rounded-full"
                        />
                      </div>
                      <h4 className="mt-2 text-slate-200 font-medium text-xs sm:text-sm text-center group-hover:text-amber-400 line-clamp-1">
                        {brand.name}
                      </h4>
                    </div>
                  );
                })}
            </div>
          </div>
        )
      )}

      {/* عنوان التصفح */}
      <h2 className="text-xl sm:text-2xl font-bold mb-4 text-right text-amber-400">
        {selectedBrandFilter
          ? `منتجات ${selectedBrandObj?.name || 'الماركة'}`
          : searchQuery
          ? `نتائج البحث عن "${searchQuery}"`
          : activeCategory === 'all' || activeCategory === 'الكل'
          ? 'جميع المنتجات'
          : `قسم: ${activeCategory}`}
      </h2>

      {/* عرض المنتجات أو التنبيه في حال عدم وجود منتجات */}
      {(!filteredProducts || filteredProducts.length === 0) ? (
        <div className="max-w-7xl mx-auto px-4 py-12 text-center text-gray-400 font-medium bg-ink-900/40 rounded-2xl border border-slate-800">
          {searchQuery ? `لا توجد نتائج بحث تطابق "${searchQuery}"` : 'لا توجد منتجات متوفرة حالياً لخياراتك الحالية.'}
        </div>
      ) : (
        <>
          {/* شبكة المنتجات - الجزء الأول */}
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 mt-4">
            {firstHalf.map((product: any, idx: number) => (
              <ProductCard
                key={product.id || product._id || idx}
                product={product}
                index={idx}
                onAddToCart={onAddToCart ? () => onAddToCart(product) : () => {}}
                onSelectProduct={onSelectProduct}
              />
            ))}
          </div>

          {/* البنرات الإعلانية الوسطى (تختفي عند تصفح ماركة محددة لتصفية الشاشة) */}
          {middleBanners && middleBanners.length > 0 && !selectedBrandFilter && (
            <div className="my-8 w-full overflow-hidden rounded-2xl shadow-xl">
              <Swiper
                modules={[Navigation, Pagination, Autoplay]}
                navigation={false}
                pagination={{ clickable: true }}
                autoplay={{ delay: 5000, disableOnInteraction: false }}
                loop={true}
                className="myswiper w-full h-48 sm:h-64 md:h-80 rounded-2xl"
              >
                {middleBanners.map((banner, index) => (
                  <SwiperSlide key={banner.id || index} className="relative w-full h-full">
                    <div
                      onClick={() => {
                        if (onBannerClick && banner) {
                          onBannerClick(banner);
                        }
                      }}
                      className="absolute inset-0 block w-full h-full z-20 flex flex-col items-center justify-center cursor-pointer"
                    >
                      <img
                        src={banner.image_url}
                        alt={banner.title || 'Banner'}
                        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                      />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          )}

          {/* شبكة المنتجات - الجزء الثاني */}
          {secondHalf.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 mt-4">
              {secondHalf.map((product: any, idx: number) => (
                <ProductCard
                  key={product.id || product._id || idx}
                  product={product}
                  index={idx}
                  onAddToCart={onAddToCart ? () => onAddToCart(product) : () => {}}
                  onSelectProduct={onSelectProduct}
                />
              ))}
            </div>
          )}
        </>
      )}

    </div>
  );
};

export default ProductGrid;