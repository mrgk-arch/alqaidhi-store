import React, { useState } from 'react';
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

  // تصفير فلتر الماركة عند تغيير القسم
  React.useEffect(() => {
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      {/* إذا تم اختيار ماركة: عرض شريط الماركة في الوسط في أعلى المنتجات */}
      {selectedBrandFilter ? (
        <div className="w-full mb-8">
          <div className="flex items-center justify-between bg-ink-900 border-2 border-amber-500/50 rounded-2xl p-4 shadow-2xl backdrop-blur-md">
            
            {/* زر العودة للماركات مع السهم */}
            <button
              onClick={() => setSelectedBrandFilter(null)}
              className="flex items-center gap-2 text-amber-400 hover:text-amber-300 font-bold bg-amber-500/10 px-4 py-2 rounded-xl transition-all"
            >
              <span>العودة للماركات</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            {/* اسم الماركة وشعارها في المنتصف */}
            <div className="flex items-center gap-3">
              <span className="text-xl sm:text-2xl font-extrabold text-white tracking-wide">
                {selectedBrandObj?.name || 'الماركة'}
              </span>
              {selectedBrandObj?.image_url && (
                <img
                  src={selectedBrandObj.image_url}
                  alt={selectedBrandObj.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-amber-400 shadow-md"
                />
              )}
            </div>

          </div>
        </div>
      ) : (
        /* إذا لم يتم اختيار ماركة: عرض قائمة الماركات الخاصة بالقسم فقط */
        activeCategory && activeCategory !== 'all' && activeCategory !== 'الكل' && brands && brands.length > 0 && (
          <div className="my-8 px-2">
            <h3 className="text-3xl font-extrabold mb-8 text-center text-ink-300 tracking-tight">
              استكشف أفخم الماركات العالمية
            </h3>
            <div className="flex flex-wrap justify-center gap-6 md:gap-8">
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
                      className="cursor-pointer group flex flex-col items-center w-28 sm:w-32 transition-all duration-300"
                    >
                      <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-ink-950 border-2 border-amber-500/20 group-hover:border-amber-400 shadow-xl overflow-hidden transition-all duration-300 group-hover:scale-105">
                        <img
                          src={brand.image_url || brand.logo}
                          alt={brand.name}
                          className="w-full h-full object-cover rounded-full"
                        />
                      </div>
                      <h4 className="mt-3 text-slate-100 font-bold text-base text-center group-hover:text-amber-400">
                        {brand.name}
                      </h4>
                    </div>
                  );
                })}
            </div>
          </div>
        )
      )}

      {/* عنوان القسم أو نتائج البحث */}
      <h2 className="text-2xl font-bold mb-6 text-right text-amber-400">
        {selectedBrandFilter
          ? `منتجات ماركة: ${selectedBrandObj?.name || ''}`
          : searchQuery
          ? `نتائج البحث عن "${searchQuery}"`
          : activeCategory === 'all' || activeCategory === 'الكل'
          ? 'المنتجات'
          : `قسم: ${activeCategory}`}
      </h2>

      {/* في حال عدم وجود منتجات للماركة أو القسم */}
      {(!filteredProducts || filteredProducts.length === 0) ? (
        <div className="max-w-7xl mx-auto px-4 py-12 text-center text-gray-400 font-medium">
          {searchQuery ? `لا توجد نتائج بحث تطابق "${searchQuery}"` : 'لا توجد منتجات متوفرة حالياً لهذه الماركة أو القسم.'}
        </div>
      ) : (
        <>
          {/* النصف الأول من المنتجات */}
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 mt-6">
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

          {/* البنرات الإعلانية في المنتصف */}
          {middleBanners && middleBanners.length > 0 && !selectedBrandFilter && (
            <div className="my-8 w-full overflow-hidden rounded-2xl shadow-xl">
              <Swiper
                modules={[Navigation, Pagination, Autoplay]}
                navigation={false}
                pagination={{ clickable: true }}
                autoplay={{ delay: 5000, disableOnInteraction: false }}
                loop={true}
                className="myswiper w-full h-60 md:h-80 rounded-2xl"
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

          {/* النصف الثاني من المنتجات */}
          {secondHalf.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 mt-6">
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