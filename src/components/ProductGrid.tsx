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
      {(activeCategory === 'عطور' || activeCategory === 'perfumes') && brands && brands.length > 0 && (
        <div className="my-12 px-2">
          <h3 className="text-3xl font-extrabold mb-10 text-center text-amber-400 tracking-tight">
            استكشف أفخم الماركات العالمية
          </h3>
          
          <div className="flex flex-wrap justify-center gap-8 md:gap-10">
            {brands
              .filter(brand => brand.category === 'عطور' || brand.category === activeCategory)
              .map((brand, idx) => (
              <div 
            key={brand.id || idx}
 onClick={() => {
              // إذا ضغط على نفس الماركة تلغى التصفية، وإذا ضغط أخرى يتم تفعيلها
              const brandIdentifier = brand.id || brand.name;
              setSelectedBrandFilter(selectedBrandFilter === brandIdentifier ? null : brandIdentifier);
            }}
            className="group flex flex-col items-center w-28 sm:w-32 transition-all duration-300 transform hover:-translate-y-2 cursor-pointer"
          >
                  {/* حاوية الصورة الدائرية البارزة */}
                  <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-ink-950 border-4 border-amber-500/10 shadow-[0_0_20px_rgba(217,119,6,0.15)] group-hover:border-amber-500 group-hover:shadow-[0_0_30px_rgba(217,119,6,0.4)] transition-all duration-300 flex items-center justify-center p-2 overflow-hidden">
                    
                    {/* خلفية وهج خفيف خلف الشعار */}
                    <div className="absolute inset-0 bg-gradient-to-b from-amber-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full"></div>
                    
                    {/* صورة الشعار */}
                    <img 
                      src={brand.image_url || brand.logo} 
                      alt={brand.name} 
                      className="w-full h-full object-contain rounded-full relative z-10 p-2"
                    />
                  </div>
                  
                  {/* اسم الماركة الفخم */}
                  <h4 className="mt-5 text-slate-100 font-bold text-base text-center tracking-wide group-hover:text-amber-400 transition-colors duration-200 line-clamp-1">
                    {brand.name}
                  </h4>
                  
                  {/* خط زخرفي صغير تحت الاسم عند التحويم */}
                  <div className="w-0 h-0.5 bg-amber-500 mt-1.5 group-hover:w-16 transition-all duration-300 rounded-full"></div>
                </div>
              ))}
          </div>
        </div>
      )}
      {/* ========================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
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
            navigation={true}
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
                  <div className="absolute inset-0 bg-black/40 pointer-events-none" />
                  <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center text-white p-4 pointer-events-none">
                    <h2 className="text-2xl md:text-3xl font-bold">
                      {banner.title || ''}
                    </h2>
                    <button
                      type="button"
                      className="mt-6 inline-block rounded-full bg-gold-500 px-6 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-gold-600 transition-colors pointer-events-auto cursor-pointer"
                    >
                      تسوق الآن
                    </button>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
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