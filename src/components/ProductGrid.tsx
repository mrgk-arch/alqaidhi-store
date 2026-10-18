import React from 'react';
import ProductCard from './ProductCard';
import type { Banner } from '../types';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
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
  const middleBanners = banners.filter((b) => b.position === 'middle' || !b.position);
const [selectedBrandFilter, setSelectedBrandFilter] = React.useState<string | null>(null);
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center text-amber-400 font-medium">
        جاري تحميل المنتجات...
      </div>
    );
  }

const filteredProducts = products.filter((product) => {
    const matchesCategory =
      !activeCategory ||
      activeCategory === 'all' ||
      activeCategory === 'الكل' ||
      product.category === activeCategory;

    // الفلترة بالماركة المختارة عبر الـ id أو الاسم بشكل دقيق وآمن
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

  if (!filteredProducts || filteredProducts.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center text-gray-400 font-medium">
        {searchQuery ? `لا توجد نتائج بحث تطابق "${searchQuery}"` : 'لا توجد منتجات متوفرة حالياً لهذا القسم.'}
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h2 className="text-2xl font-bold mb-6 text-right text-amber-400">
        {searchQuery
          ? `نتائج البحث عن: "${searchQuery}"`
          : activeCategory === 'all' || activeCategory === 'الكل'
          ? 'المنتجات'
          : `قسم: ${activeCategory}`}
      </h2>
{/* ========================================================= */}
      {/* قسم الماركات الفخم والدائري - يظهر فقط في قسم العطور */}
      {/* ========================================================= */}
{activeCategory === 'عطور' && brands && brands.length > 0 && (
  <div>
    {/* إذا اختار الزبون ماركة، نعرض اسمها وشعارها في المنتصف وتحتها سهم الرجوع */}
    {selectedBrandFilter ? (
      <div className="flex flex-col items-center justify-center my-8 bg-ink-950/60 p-6 rounded-2xl border border-gold-500/20 relative">
        {/* زر السهم الصغير في الزاوية للخروج من الماركة */}
        <button 
          onClick={() => setSelectedBrandFilter(null)}
          className="absolute top-4 left-4 bg-ink-900 border border-gold-500/30 text-gold-400 p-2 rounded-full hover:bg-gold-500 hover:text-ink-950 transition-colors flex items-center justify-center"
          title="الرجوع للماركات"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* جلب بيانات الماركة المختارة لعرض شعارها واسمها */}
        {(() => {
          const currentBrand = brands.find((b: any) => String(b.id) === String(selectedBrandFilter) || b.name === selectedBrandFilter);
          return (
            <>
              {currentBrand?.image_url && (
             <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-gold-500/40 mb-3 shadow-lg bg-ink-950">
  <img src={currentBrand?.image_url || currentBrand?.logo} alt={currentBrand?.name} className="w-full h-full object-cover rounded-full" />
</div>  
              )}
              <h3 className="text-2xl font-bold text-gold-300">{currentBrand?.name || selectedBrandFilter}</h3>
              <p className="text-xs text-ink-300 mt-1">منتجات الماركة المختارة</p>
            </>
          );
        })()}
      </div>
    ) : (
      /* إذا لم يختار ماركة، تعرض له قائمة الماركات الدائرية العادية الطبيعية */
      <div className="my-12 px-2">
        <h3 className="text-3xl font-extrabold mb-10 text-center text-ink-300 tracking-tight">
          استكشف أفخم الماركات العالمية
        </h3>
        <div className="flex flex-wrap justify-center gap-8 md:gap-10">
          {brands
            .filter((brand: any) => brand.category === 'عطور' || brand.category === activeCategory)
            .map((brand: any, idx: number) => {
              const brandIdentifier = brand.id || brand.name;
              return (
                <div
                  key={brand.id || idx}
                  onClick={() => {
                    const brandIdentifier = String(brand.id);
                    setSelectedBrandFilter(selectedBrandFilter === brandIdentifier ? null : brandIdentifier);
                  }}
                  className="group flex flex-col items-center w-28 sm:w-32 transition-all duration-300 transform hover:-translate-y-2 cursor-pointer"
                >
            <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-ink-950 border-2 border-amber-500/20 group-hover:border-amber-400 group-hover:shadow-[0_0_15px_rgba(251,191,36,0.4)] transition-all duration-300 overflow-hidden">
  <img 
    src={brand.image_url || brand.logo}
    alt={brand.name}
    className="w-full h-full object-cover rounded-full transition-transform duration-300 group-hover:scale-110"
  />
</div>
                  <h4 className="mt-4 text-slate-100 font-bold text-base text-center group-hover:text-amber-400 transition-colors">
                    {brand.name}
                  </h4>
                </div>
              );
            })}
        </div>
      </div>
    )}
  </div>
)}
      
      {/* ========================================================= */}
      <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4 mt-6">
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

      {middleBanners && middleBanners.length > 0 && (
        <div className="my-8 w-full overflow-hidden rounded-2xl shadow-xl">
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            navigation={false}
            pagination={{ clickable: true }}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
            }}
            loop={true}
            className="mySwiper w-full h-60 md:h-80 rounded-2xl"
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

     <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
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
    </div>
  );
};

export default ProductGrid;