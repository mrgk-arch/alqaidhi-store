import React, { useState } from 'react';

interface ProductDetailsProps {
  product: {
    id?: string;
    _id?: string;
    name: string;
    price: number;
    originalPrice?: number;
    images?: string[] | null;
    image?: string | null;
    image_url?: string | null;
    secondary_image_url?: string | null;
    extra_info_label?: string | null;
    extra_info_content?: string | null;
    origin_info?: string | null;
    description?: string | null;
    category?: string | null;
    notes?: {
      top?: string;
      middle?: string;
      base?: string;
    } | null;
    manufactureInfo?: {
      country?: string;
      year?: string;
    } | null;
    [key: string]: any;
  };
  onAddToCart?: (product: any) => void;
  onBack?: () => void; 
} 
 
export const ProductDetails: React.FC<ProductDetailsProps> = ({ 
  product, 
  onAddToCart, 
  onBack, 
}) => { 
  // تجميع كافة الصور المتوفرة للمنتج 
  const productImages = [
    product.image_url || product.image,
    product.secondary_image_url
  ].filter(Boolean) as string[];
 
  const [currentImageIdx, setCurrentImageIdx] = useState(0); 
  const [openSection, setOpenSection] = useState<'desc' | 'info' | 'manufacture' | null>('desc'); 
 
  const toggleSection = (section: 'desc' | 'info' | 'manufacture') => { 
    setOpenSection(openSection === section ? null : section); 
  }; 
 
  return ( 
    <div className="bg-white min-h-screen text-slate-900 pb-28 dir-rtl text-right"> 
      {/* 1. الشريط العلوي زر العودة */} 
      <div className="sticky top-0 bg-white/95 backdrop-blur-md z-30 border-b border-gray-100 px-4 py-3 flex items-center justify-between"> 
        <button 
          onClick={onBack} 
          className="text-slate-800 font-bold text-xl p-2 hover:bg-gray-100 rounded-full transition-colors" 
        > 
          → 
        </button> 
        <span className="font-bold text-slate-900 text-base truncate max-w-[200px]"> 
          {product.name} 
        </span> 
        <div className="w-8" /> 
      </div> 
 
      {/* 2. معرض الصور المتعددة Slider */} 
      <div className="relative w-full bg-slate-50 flex flex-col items-center py-8"> 
        <img 
          src={productImages[currentImageIdx] || product.image_url || ''} 
          alt={product.name} 
          className="h-80 object-contain transition-all duration-300 drop-shadow-md" 
        /> 
 
        {/* نقاط التنقل بين الصور */} 
        {productImages.length > 1 && ( 
          <div className="flex gap-2 mt-6"> 
            {productImages.map((_, idx) => ( 
              <button 
                key={idx} 
                onClick={() => setCurrentImageIdx(idx)} 
                className={`h-2.5 rounded-full transition-all ${ 
                  currentImageIdx === idx ? 'bg-amber-600 w-6' : 'bg-gray-300 w-2.5' 
                }`} 
              /> 
            ))} 
          </div> 
        )} 
      </div> 
 
      {/* 3. تفاصيل اسم المنتج والسعر */} 
      <div className="p-5 border-b border-gray-100"> 
        <h1 className="text-2xl font-black text-slate-900 mb-3">{product.name}</h1> 
        <div className="flex items-center gap-3"> 
          <span className="text-2xl font-bold text-amber-600">{product.price} ر.س</span> 
          {product.originalPrice && ( 
            <span className="text-sm text-gray-400 line-through"> 
              {product.originalPrice} ر.س 
            </span> 
          )} 
        </div> 
      </div> 
 
      {/* 4. القوائم المنسدلة (الأكوردبيون) للمعلومات */} 
      <div className="divide-y divide-gray-100 border-b border-gray-100"> 
        {/* قسم الوصف */} 
        <div> 
          <button 
            onClick={() => toggleSection('desc')} 
            className="w-full py-4 px-5 flex justify-between items-center font-bold text-slate-800 text-base" 
          > 
            <span>الوصف</span> 
            <span className="text-amber-600 font-bold">{openSection === 'desc' ? '▲' : '▼'}</span> 
          </button> 
          {openSection === 'desc' && ( 
            <div className="px-5 pb-5 text-gray-600 text-sm leading-relaxed"> 
              {product.description || '.لا يوجد وصف متاح لهذا المنتج حالياً'} 
            </div> 
          )} 
        </div> 
 
        {/* 3. مكونات المنتج / الهرم العطري */}
<div>
  <button
    onClick={() => toggleSection('info')}
    className="w-full py-4 px-5 flex justify-between items-center font-bold text-slate-800 text-base"
  >
    <span>معلومات المنتج {product.extra_info_label && `(${product.extra_info_label})`}</span>
    <span className="text-amber-600 font-bold">{openSection === 'info' ? '▲' : '▼'}</span>
  </button>
  {openSection === 'info' && (
    <div className="px-5 pb-5 text-gray-600 text-sm space-y-3">
      <p className="whitespace-pre-line leading-relaxed">
        {product.extra_info_content || 'لا توجد معلومات مضافة لهذا المنتج حالياً.'}
      </p>
    </div>
  )}
</div>
 
        {/* قسم معلومات الصنع */} 
        <div> 
          <button 
            onClick={() => toggleSection('manufacture')} 
            className="w-full py-4 px-5 flex justify-between items-center font-bold text-slate-800 text-base" 
          > 
            <span>معلومات الصنع</span> 
            <span className="text-amber-600 font-bold">{openSection === 'manufacture' ? '▲' : '▼'}</span> 
          </button> 
          {openSection === 'manufacture' && ( 
            <div className="px-5 pb-5 text-gray-600 text-sm space-y-2"> 
              {product.origin_info ? ( 
                <p>{product.origin_info}</p> 
              ) : ( 
                <> 
                  <p><strong className="text-slate-800">بلد الصنع: </strong>{product.manufactureInfo?.country || 'فرنسا'}</p> 
                  <p><strong className="text-slate-800">سنة الصنع: </strong>{product.manufactureInfo?.year || '2026'}</p> 
                </> 
              )} 
            </div> 
          )} 
        </div> 
      </div> 
 
      {/* 5. عرض صور وعروض تسويقية جذابة */} 
      <div className="p-5 space-y-6"> 
        <h3 className="font-bold text-slate-800 text-lg">معرض الصور التفصيلي:</h3> 
        {productImages.map((imgUrl, index) => ( 
          <div key={index} className="rounded-2xl overflow-hidden border border-gray-100 shadow-sm bg-slate-50 p-2"> 
            <img src={imgUrl} alt={`${product.name} ${index + 1}`} className="w-full h-auto rounded-xl object-cover" /> 
          </div> 
        ))} 
      </div> 
 
      {/* 6. الشريط السفلي الثابت لشراء المنتج */} 
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 flex items-center justify-between gap-4 z-20"> 
        <div> 
          <span className="block text-xs text-gray-400">الإجمالي</span> 
          <span className="text-xl font-black text-amber-600">{product.price} ر.س</span> 
        </div> 
        <button 
          onClick={() => onAddToCart && onAddToCart(product)} 
          className="flex-1 bg-amber-500 hover:bg-amber-600 active:scale-95 text-slate-950 font-bold py-3.5 px-6 rounded-xl text-center transition-all shadow-lg shadow-amber-500/20" 
        > 
          أضف إلى السلة 
        </button> 
      </div> 
    </div> 
  ); 
};