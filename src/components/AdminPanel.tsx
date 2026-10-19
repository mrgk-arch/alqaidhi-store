import { useState, useEffect } from 'react';
import { X, Plus, Edit2, Trash2, Save, Loader2, Package, Video as VideoIcon, Settings, Image as ImageIcon, Ticket } from 'lucide-react';
import { Product, Video, StoreSettings, Banner } from '../types';
import MediaUploader from './MediaUploader';
import { supabase } from '../supabaseClient';

interface AdminPanelProps {
  open: boolean;
  onClose: () => void;
  products: Product[];
  videos: Video[];
  settings: StoreSettings | null;
  onProductsChanged: () => void;
  onVideosChanged: () => void;
}

type Tab = 'products' | 'categories' | 'videos' | 'banners' | 'brands' | 'settings' | 'coupons';


export default function AdminPanel({
  open,
  onClose,
  products,
  videos,
  settings,
  onProductsChanged,
  onVideosChanged,
}: AdminPanelProps) {
  const [tab, setTab] = useState<Tab>('products');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showProductForm, setShowProductForm] = useState(false);
  const [saving, setSaving] = useState(false);

  // Product form state
  const [form, setForm] = useState({
    name: '',
    brand_id: '',
    category: 'عطور',
    price: '',
    old_price: '',
    image_url: '',
    rating: '5',
    reviews_count: '0',
    badge: '',
    sort_order: '0',
    secondary_image_url: '',
    extra_info_label: '',
    extra_info_content: '',
    origin_info: '',
    description: '',
  });

  // Video form state
  const [videoForm, setVideoForm] = useState({ title: '', description: '', video_url: '', position: 'hero', sort_order: '0' });
  const [showVideoForm, setShowVideoForm] = useState(false);
// Featured Showcase form state
  const [showcaseForm, setShowcaseForm] = useState({
    title: '',
    video_url: '',
    price: '',
    product_image: '',
    rating: 5.0,
    reviews_count: 128
  });
  const [isSavingShowcase, setIsSavingShowcase] = useState(false);
  // Settings form state
  const [settingsForm, setSettingsForm] = useState({
    whatsapp_number: '967779392061',
    tiktok_url: '',
    twitter_url: '',
    facebook_url: '',
    instagram_url: '',
  });

  // Banners state
  const [banners, setBanners] = useState<Banner[]>([]);
  const [showBannerForm, setShowBannerForm] = useState(false);
  const [bannerForm, setBannerForm] = useState({ title: '', image_url: '', position: 'hero' as 'hero' | 'middle', product_id: '' });

  // Brands state
  const [brands, setBrands] = useState<any[]>([]);
  const [showBrandForm, setShowBrandForm] = useState(false);
  const [brandForm, setBrandForm] = useState({ name: '', image_url: '', category: 'عطور' });
// Categories state
const [categories, setCategories] = useState<any[]>([]);
const [showCategoryForm, setShowCategoryForm] = useState(false);
const [categoryForm, setCategoryForm] = useState({ name: '', image_url: '' });
// Coupons state
const [coupons, setCoupons] = useState<any[]>([]);
const [couponForm, setCouponForm] = useState({ code: '', discount: '' });
const [loadingCoupons, setLoadingCoupons] = useState(false);
// Bank accounts state
  const [bankAccounts, setBankAccounts] = useState<any[]>([]);
  const [newBankName, setNewBankName] = useState('');
  const [newAccountHolder, setNewAccountHolder] = useState('');
  const [newIban, setNewIban] = useState('');

  // جلب الحسابات البنكية من قاعدة البيانات
  const fetchBankAccounts = async () => {
    const { data } = await supabase.from('bank_accounts').select('*').order('created_at', { ascending: false });
    if (data) setBankAccounts(data);
  };
// جلب الكوبونات من قاعدة البيانات
const fetchCoupons = async () => {
  setLoadingCoupons(true);
  const { data, error } = await supabase.from('coupons').select('*').order('created_at', { ascending: false });
  if (!error && data) {
    setCoupons(data);
  }
  setLoadingCoupons(false);
};

// استدعاء جلب الكوبونات عند اختيار تبويب الكوبونات
useEffect(() => {
  if (tab === 'coupons') {
    fetchCoupons();
  }
}, [tab]);

// حفظ كوبون جديد
const handleSaveCoupon = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!couponForm.code || !couponForm.discount) return;

  setSaving(true);
  const { error } = await supabase.from('coupons').insert([
    {
      code: couponForm.code.trim().toUpperCase(),
      discount: parseInt(couponForm.discount),
      is_active: true
    }
  ]);

  setSaving(false);

  if (error) {
    alert('حدث خطأ أثناء إضافة الكوبون: ' + error.message);
  } else {
    setCouponForm({ code: '', discount: '' });
    fetchCoupons();
  }
};

// حذف كوبون
const handleDeleteCoupon = async (id: string) => {
  if (!confirm('هل أنت متأكد من حذف هذا الكوبون؟')) return;

  const { error } = await supabase.from('coupons').delete().eq('id', id);
  if (!error) {
    setCoupons(coupons.filter(c => c.id !== id));
  } else {
    alert('حدث خطأ أثناء حذف الكوبون: ' + error.message);
  }
};
// جلب الأقسام عند التحميل
useEffect(() => {
    supabase.from('categories').select('*').then(({ data }) => {
      if (data) setCategories(data);
    });
    fetchBankAccounts();
  }, []);

// حفظ قسم جديد
const handleSaveCategory = async () => {
  if (!categoryForm.name.trim()) return;
  setSaving(true);
  const { error } = await supabase.from('categories').insert([categoryForm]);
  setSaving(false);
  if (error) {
    alert('حدث خطأ أثناء حفظ القسم: ' + error.message);
  } else {
    setShowCategoryForm(false);
    setCategoryForm({ name: '', image_url: '' });
    supabase.from('categories').select('*').then(({ data }) => {
      if (data) setCategories(data);
    });
  }
};

// حذف قسم
const handleDeleteCategory = async (id: string) => {
  if (!confirm('هل أنت تأكد من حذف هذا القسم؟')) return;
  await supabase.from('categories').delete().eq('id', id);
  setCategories(categories.filter((c) => c.id !== id));
};
  useEffect(() => {
    if (settings) {
      setSettingsForm({
        whatsapp_number: settings.whatsapp_number || '967779392061',
        tiktok_url: settings.tiktok_url || '',
        twitter_url: settings.twitter_url || '',
        facebook_url: settings.facebook_url || '',
        instagram_url: settings.instagram_url || '',
      });
    }

    // جلب البنرات عند التحميل
    supabase.from('banners').select('*').then(({ data }) => {
      if (data) setBanners(data);
    });
  }, [settings]);

  const resetForm = () => {
    setForm({
      name: '',
      brand_id: '',
      category: 'عطور',
      price: '',
      old_price: '',
      image_url: '',
      rating: '5',
      reviews_count: '0',
      badge: '',
      sort_order: '0',
      secondary_image_url: '',
      extra_info_label: '',
      extra_info_content: '',
      origin_info: '',
      description: '',
    });
    setEditingProduct(null);
    setShowProductForm(false);
  };

  const handleEdit = (product: any) => {
    setEditingProduct(product);
    setForm({
      name: product.name || '',
      brand_id: product.brand_id || '',
      category: product.category || 'عطور',
      price: String(product.price ?? ''),
      old_price: product.old_price ? String(product.old_price) : '',
      image_url: product.image_url || '',
      rating: String(product.rating ?? '5'),
      reviews_count: String(product.reviews_count ?? '0'),
      badge: product.badge || '',
      sort_order: String(product.sort_order ?? '0'),
      secondary_image_url: product.secondary_image_url || '',
      extra_info_label: product.extra_info_label || '',
      extra_info_content: product.extra_info_content || '',
      origin_info: product.origin_info || '',
      description: product.description || '',
    });
    setShowProductForm(true);
  };

const handleSaveProduct = async () => {
  if (!form.name.trim() || !form.price) return;
  setSaving(true);
  const data = {
    name: form.name.trim(),
    brand_id: form.brand_id || null,
    category: form.category,
    price: parseFloat(form.price),
    old_price: form.old_price ? parseFloat(form.old_price) : null,
    image_url: form.image_url || null,
    secondary_image_url: form.secondary_image_url || null,
    description: form.description || null,
    extra_info_label: form.extra_info_label || null,
    extra_info_content: form.extra_info_content || null,
    origin_info: form.origin_info || null,
    rating: parseFloat(form.rating) || 5,
    reviews_count: parseInt(form.reviews_count) || 0,
    badge: form.badge || null,
    sort_order: parseInt(form.sort_order) || 0,
    is_active: true,
  };

  if (editingProduct) {
    const { error } = await supabase.from('products').update(data).eq('id', editingProduct.id);
    if (error) {
      console.error('خطأ التحديث:', error);
      alert('لم يتم التحديث: ' + error.message);
    }
  } else {
    const { error } = await supabase.from('products').insert([data]);
    if (error) {
      console.error('خطأ الإضافة:', error);
      alert('لم يتم الإضافة: ' + error.message);
    }
  }
  setSaving(false);
  resetForm();
  setShowProductForm(false);
  if (onProductsChanged) onProductsChanged();
};
const handleDeleteProduct = async (id: string) => {
  if (!confirm('هل أنت متأكد من حذف هذا المنتج؟')) return;
  await supabase.from('products').delete().eq('id', id);
  onProductsChanged();
};

const handleSaveVideo = async () => {
  if (!videoForm.title.trim()) {
    alert("يرجى إدخال عنوان الفيديو");
    return;
  }
  if (!videoForm.video_url.trim()) {
    alert("يرجى رفع ملف الفيديو أو إدخال الرابط أولاً والانتظار حتى يكتمل الرفع");
    return;
  }

  setSaving(true);
const data = {
    title: videoForm.title.trim(),
    video_url: videoForm.video_url.trim(),
    position: videoForm.position || 'hero',
    sort_order: parseInt(videoForm.sort_order) || 0,
    is_active: true,
  };

  const { error } = await supabase.from('videos').insert([data]);
  setSaving(false);

  if (error) {
    alert('حدث خطأ أثناء حفظ الفيديو: ' + error.message);
  } else {
    setVideoForm({ title: '', description: '', video_url: '', position: 'hero', sort_order: '0' });
    setShowVideoForm(false);
    if (onVideosChanged) onVideosChanged();
  }
};
const handleSaveShowcase = async (e?: React.FormEvent) => {
  if (e) e.preventDefault();

  if (!showcaseForm.title.trim() || !showcaseForm.video_url.trim()) {
      return;
    }
    setSaving(true);
    const { error } = await supabase.from('featured_video_showcase').insert([
      {
        title: showcaseForm.title.trim(),
        video_url: showcaseForm.video_url.trim(),
        price: showcaseForm.price || '178',
        product_image: showcaseForm.product_image,
        rating: Number(showcaseForm.rating) || 5.0,
        reviews_count: Number(showcaseForm.reviews_count) || 128
      }
    ]);
    setSaving(false);
    if (error) {
      alert('حدث خطأ أثناء حفظ الفيديو الفاخر: ' + error.message);
    } else {
      alert('تم حفظ الفيديو الفاخر بنجاح!');
      setShowcaseForm({
        title: '',
        video_url: '',
        price: '',
        product_image: '',
        rating: 5.0,
        reviews_count: 128
      });
      if (onVideosChanged) onVideosChanged();
    }
  };

const handleDeleteVideo = async (id: string) => {
  if (!confirm('هل أنت متأكد من حذف هذا الفيديو؟')) return;
  await supabase.from('videos').delete().eq('id', id);
  onVideosChanged();
};

const handleSaveBanner = async () => {
  if (!bannerForm.image_url.trim()) return;
  setSaving(true);

  const data: Record<string, any> = {
    title: bannerForm.title.trim() || null,
    image_url: bannerForm.image_url.trim(),
    link: null,
    position: bannerForm.position,
    is_active: true,
    ...(bannerForm.product_id ? { product_id: bannerForm.product_id } : {}),
  };

  const { error } = await supabase.from('banners').insert(data);

  setSaving(false);
  if (!error) {
    setShowBannerForm(false);
    setBannerForm({ title: '', image_url: '', position: 'hero', product_id: '' });
    const { data: updatedBanners } = await supabase.from('banners').select('*');
    if (updatedBanners) setBanners(updatedBanners);
  } else {
    alert('حدث خطأ أثناء حفظ البنر: ' + error.message);
  }
};

const handleDeleteBanner = async (id: string) => {
  if (!confirm('هل أنت متأكد من حذف هذا البنر؟')) return;
  await supabase.from('banners').delete().eq('id', id);
  setBanners(banners.filter((b) => b.id !== id));
};

// جلب الماركات عند تحميل الصفحة
useEffect(() => {
  supabase.from('brands').select('*').then(({ data }) => {
    if (data) setBrands(data);
  });
}, [settings]);

// حفظ ماركة جديدة
const handleSaveBrand = async () => {
  if (!brandForm.name.trim() || !brandForm.image_url.trim()) return;
  setSaving(true);
  const { error } = await supabase.from('brands').insert([brandForm]);
  setSaving(false);
  if (error) {
    alert('خطأ أثناء حفظ الماركة: ' + error.message);
  } else {
    setShowBrandForm(false);
    setBrandForm({ name: '', image_url: '', category: 'عطور' });
    supabase.from('brands').select('*').then(({ data }) => {
      if (data) setBrands(data);
    });
  }
};

// حذف ماركة
const handleDeleteBrand = async (id: string) => {
  if (!confirm('هل أنت متأكد من حذف هذه الماركة؟')) return;
  await supabase.from('brands').delete().eq('id', id);
  setBrands(brands.filter((b) => b.id !== id));
};

const handleSaveSettings = async () => {
  try {
    setSaving(true);
    const payload: Record<string, any> = { id: 1 };

    if (settingsForm.whatsapp_number) payload.whatsapp_number = settingsForm.whatsapp_number;
    if (settingsForm.tiktok_url) payload.tiktok_url = settingsForm.tiktok_url;
    if (settingsForm.twitter_url) payload.twitter_url = settingsForm.twitter_url;
    if (settingsForm.facebook_url) payload.facebook_url = settingsForm.facebook_url;
    if (settingsForm.instagram_url) payload.instagram_url = settingsForm.instagram_url;

    const { error } = await supabase
      .from('store_settings')
      .upsert(payload, { onConflict: 'id' });

    if (error) {
      const fallbackPayload = {
        id: 1,
        whatsapp_number: settingsForm.whatsapp_number || '',
      };
      const { error: fallbackError } = await supabase
        .from('store_settings')
        .upsert(fallbackPayload, { onConflict: 'id' });

      if (fallbackError) throw fallbackError;
    }

    alert('تم حفظ الإعدادات بنجاح! ✨');
  } catch (err: any) {
    console.error('خطأ أثناء حفظ الإعدادات:', err);
    alert('حدث خطأ أثناء الحفظ: ' + (err.message || 'يرجى التأكد من البيانات'));
  } finally {
    setSaving(false);
  }
};

if (!open) return null;

return (
  <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
    <div className="absolute inset-0 bg-ink-950/90 backdrop-blur-sm animate-fade-in" onClick={onClose} />

    <div className="relative w-full max-w-4xl bg-ink-800 rounded-2xl border border-gold-400/20 shadow-2xl animate-scale-in max-h-[90vh] overflow-hidden flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-gold-400/15 shrink-0">
        <h2 className="font-serif text-lg font-bold text-gold-200">لوحة التحكم</h2>
        <button onClick={onClose} className="w-9 h-9 rounded-full hover:bg-ink-700 flex items-center justify-center text-gold-200 transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Tabs */}
    <div className="flex gap-2 overflow-x-auto whitespace-nowrap px-5 py-3 border-b border-gold-400/10 w-full [-webkit-overflow-scrolling:touch]">
        {[
         { id: 'products' as Tab, label: 'المنتجات', icon: Package },
{ id: 'categories' as Tab, label: 'الأقسام', icon: Package },
{ id: 'videos' as Tab, label: 'الفيديوهات', icon: VideoIcon },
{ id: 'banners' as Tab, label: 'البنرات', icon: ImageIcon },
{ id: 'brands' as Tab, label: 'الماركات', icon: Package },
{ id: 'settings' as Tab, label: 'الإعدادات', icon: Settings },
{ id: 'coupons' as Tab, label: 'الكوبونات', icon: Ticket },
{ id: 'bank_accounts' as Tab, label: 'الحسابات البنكية', icon: Ticket },
        ].map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-1.5 shrink-0 px-4 py-2 rounded-full text-sm font-medium transition ${tab === t.id ? 'gold-gradient text-ink-900' : 'text-ink-300 hover:bg-ink-700/60'}`}
            >
              <Icon className="w-4 h-4" />
              {t.label}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-5 py-4">
{/* Categories Tab Content */}
{tab === 'categories' && (
  <div className="space-y-4">
    {!showCategoryForm ? (
      <>
        <button
          onClick={() => setShowCategoryForm(true)}
          className="w-full flex items-center justify-center gap-2 py-2.5 gold-gradient text-ink-900 font-bold rounded-xl shadow-lg hover:opacity-95 transition-opacity"
        >
          <Plus className="w-4 h-4" />
          إضافة قسم جديد
        </button>

        <div className="space-y-2">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="flex items-center justify-between p-3 bg-ink-700/40 rounded-xl border border-gold-400/10"
            >
              <div className="flex items-center gap-3">
                {cat.image_url ? (
                  <img
                    src={cat.image_url}
                    alt={cat.name}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-lg bg-ink-700 flex items-center justify-center text-ink-500">
                    <Package className="w-6 h-6" />
                  </div>
                )}
                <h4 className="text-sm font-medium text-gold-200">{cat.name}</h4>
              </div>
              <button
                onClick={() => handleDeleteCategory(cat.id)}
                className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
          {categories.length === 0 && (
            <p className="text-center text-sm text-ink-400 py-4">
              لا توجد أقسام حالياً
            </p>
          )}
        </div>
      </>
    ) : (
      <div className="space-y-4 animate-fade-in">
        <h3 className="font-bold text-gold-200">إضافة قسم جديد</h3>
        <div>
          <label className="block text-xs text-ink-300 mb-1">اسم القسم</label>
          <input
            type="text"
            placeholder="مثال: عطور، بخور..."
            value={categoryForm.name}
            onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
            className="w-full bg-ink-900/60 border border-gold-400/20 rounded-xl px-3 py-2 text-sm text-ink-100 placeholder:text-ink-500 focus:outline-none focus:border-gold-400/50"
          />
        </div>
        <MediaUploader
          value={categoryForm.image_url}
          onChange={(url) => setCategoryForm({ ...categoryForm, image_url: url })}
          bucket="categories-images"
          label="صورة القسم"
        />
        <div className="flex gap-2 pt-2">
          <button
            onClick={handleSaveCategory}
            disabled={saving}
            className="flex-1 flex items-center justify-center gap-2 py-2 gold-gradient text-ink-900 font-medium rounded-xl text-sm disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            حفظ
          </button>
          <button
            onClick={() => setShowCategoryForm(false)}
            className="px-4 py-2 bg-ink-700 text-ink-200 rounded-xl text-sm hover:bg-ink-600 transition-colors"
          >
            إلغاء
          </button>
        </div>
      </div>
    )}
  </div>
)}
{/* Coupons Tab */}
{tab === 'coupons' && (
<div className="space-y-6">
      {/* نموذج إضافة كوبون جديد */}
      <div className="bg-ink-700/40 p-5 rounded-2xl border border-gold-400/20 space-y-4">
        <h3 className="font-bold text-gold-200 text-base flex items-center gap-2">
          <Plus className="w-4 h-4 text-gold-200" />
          إضافة كوبون خصم جديد
        </h3>
        <form onSubmit={handleSaveCoupon} className="space-y-3">
          <div>
            <label className="block text-xs text-ink-300 mb-1">كود الخصم (رمز الكوبون)</label>
            <input
              type="text"
              placeholder="مثال: SAVE20"
              value={couponForm.code}
              onChange={(e) => setCouponForm({ ...couponForm, code: e.target.value })}
              className="w-full bg-ink-900/60 border border-gold-400/20 rounded-xl px-3 py-2 text-sm text-ink-100 uppercase"
              required
            />
          </div>
          <div>
            <label className="block text-xs text-ink-300 mb-1">نسبة الخصم (%)</label>
            <input
              type="number"
              placeholder="مثال: 15"
              value={couponForm.discount}
              onChange={(e) => setCouponForm({ ...couponForm, discount: e.target.value })}
              className="w-full bg-ink-900/60 border border-gold-400/20 rounded-xl px-3 py-2 text-sm text-ink-100"
              required
            />
          </div>
          <button
            type="submit"
            disabled={saving}
            className="w-full gold-gradient text-ink-900 font-bold rounded-xl py-2.5 px-4 text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            حفظ الكوبون
          </button>
        </form>
      </div>

      {/* قائمة الكوبونات الحالية */}
      <div className="space-y-3">
        <h3 className="font-bold text-gold-200 text-sm">الكوبونات المتاحة</h3>
        {loadingCoupons ? (
          <div className="text-center py-4 text-ink-300 text-sm">جاري جلب الكوبونات...</div>
        ) : coupons.length === 0 ? (
          <div className="text-center py-6 text-ink-400 text-sm bg-ink-700/20 rounded-xl border border-gold-400/10">
            لا توجد كوبونات مضافة حالياً
          </div>
        ) : (
          <div className="space-y-2">
            {coupons.map((coupon) => (
              <div
                key={coupon.id}
                className="flex items-center justify-between p-3.5 bg-ink-700/40 rounded-xl border border-gold-400/10"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gold-400/10 rounded-lg text-gold-200 font-bold text-sm">
                    {coupon.code}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-ink-100">خصم {coupon.discount}%</p>
                    <p className="text-xs text-emerald-400">نشط</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleDeleteCoupon(coupon.id)}
                  className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                  title="حذف الكوبون"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
)}
{/* Bank Accounts Tab Content */}
{tab === ('bank_accounts' as any) && (
  <div className="space-y-6">
    <div className="bg-slate-900/60 p-6 rounded-2xl border border-amber-500/25 space-y-4">
      <h3 className="text-lg font-bold text-amber-300 flex items-center gap-2">
        💳 إضافة حساب بنكي جديد
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <input
          type="text"
          placeholder="اسم البنك (مثال: الراجحي)"
          value={newBankName}
          onChange={(e) => setNewBankName(e.target.value)}
          className="p-3 bg-slate-800/80 border border-slate-700 rounded-xl text-slate-200 text-sm"
        />
        <input
          type="text"
          placeholder="اسم صاحب الحساب"
          value={newAccountHolder}
          onChange={(e) => setNewAccountHolder(e.target.value)}
          className="p-3 bg-slate-800/80 border border-slate-700 rounded-xl text-slate-200 text-sm"
        />
        <input
          type="text"
          placeholder="رقم الآيبان (IBAN)"
          value={newIban}
          onChange={(e) => setNewIban(e.target.value)}
          className="p-3 bg-slate-800/80 border border-slate-700 rounded-xl text-slate-200 text-sm font-mono"
        />
      </div>

      <button
        type="button"
        onClick={async () => {
          if (!newBankName || !newIban) return alert('الرجاء إدخال اسم البنك ورقم الآيبان على الأقل');
          const { error } = await supabase.from('bank_accounts').insert([{
            bank_name: newBankName,
            account_holder: newAccountHolder,
            iban: newIban,
            is_active: true
          }]);
          if (error) {
            alert('حدث خطأ أثناء الإضافة: ' + error.message);
          } else {
            setNewBankName('');
            setNewAccountHolder('');
            setNewIban('');
            fetchBankAccounts();
            alert('تم إضافة الحساب البنكي بنجاح');
          }
        }}
        className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-sm transition-all"
      >
        حفظ الحساب البنكي
      </button>
    </div>

    {/* قائمة الحسابات البنكية الحالية */}
    <div className="bg-slate-900/60 p-6 rounded-2xl border border-amber-500/25 space-y-4">
      <h3 className="text-lg font-bold text-amber-300">الحسابات البنكية المضافة</h3>
      <div className="space-y-2">
        {bankAccounts.map((acc) => (
          <div key={acc.id} className="flex items-center justify-between p-3.5 bg-slate-800/40 rounded-xl border border-slate-700/50">
            <div className="text-xs text-slate-300 space-y-1">
              <p className="font-bold text-amber-200 text-sm">{acc.bank_name} <span className="text-slate-400 font-normal">({acc.account_holder})</span></p>
              <p className="font-mono text-amber-300/90">{acc.iban}</p>
            </div>
            <button
              onClick={async () => {
                if (confirm('هل أنت متأكد من حذف هذا الحساب؟')) {
                  await supabase.from('bank_accounts').delete().eq('id', acc.id);
                  fetchBankAccounts();
                }
              }}
              className="text-red-400 hover:text-red-300 text-xs px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 rounded-lg transition-all"
            >
              حذف
            </button>
          </div>
        ))}
        {bankAccounts.length === 0 && (
          <p className="text-slate-400 text-xs text-center py-4">لا توجد حسابات بنكية مضافة حالياً</p>
        )}
      </div>
    </div>
  </div>
)}
        {/* Products Tab */}
        {tab === 'products' && (
          <div className="space-y-4">
            {!showProductForm ? (
              <>
                <button
                  onClick={() => { resetForm(); setShowProductForm(true); }}
                  className="w-full flex items-center justify-center gap-2 py-2.5 gold-gradient text-ink-900 font-bold rounded-xl text-sm hover:scale-[1.01] transition-transform"
                >
                  <Plus className="w-4 h-4" />
                  إضافة منتج جديد
                </button>

                <div className="space-y-2">
                  {products.map((product) => (
                    <div key={product.id} className="flex items-center gap-3 bg-ink-700/40 rounded-xl p-3 border border-gold-400/10">
                      {product.image_url ? (
                        <img src={product.image_url} alt={product.name} className="w-14 h-14 rounded-lg object-cover shrink-0" />
                      ) : (
                        <div className="w-14 h-14 rounded-lg bg-ink-700 flex items-center justify-center shrink-0">
                          <Package className="w-6 h-6 text-ink-500" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium text-ink-50 line-clamp-1">{product.name}</h3>
                        <p className="text-xs text-gold-300">{product.price} ر.س · {product.category}</p>
                      </div>
                      <button onClick={() => handleEdit(product)} className="w-9 h-9 rounded-full hover:bg-ink-600 flex items-center justify-center text-gold-200 transition-colors">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDeleteProduct(product.id)} className="w-9 h-9 rounded-full hover:bg-red-900/30 flex items-center justify-center text-ink-400 hover:text-red-400 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="space-y-3 animate-fade-in">
                <h3 className="font-bold text-gold-200">{editingProduct ? 'تعديل المنتج' : 'منتج جديد'}</h3>

                <div>
                  <label className="text-sm text-ink-200 mb-1 block">اسم المنتج</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full bg-ink-700/60 border border-gold-400/15 rounded-xl px-4 py-2.5 text-sm text-ink-50"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm text-ink-200 mb-1 block">التصنيف</label>
                    <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full bg-ink-700/60 border border-gold-400/15 rounded-xl px-4 py-2.5 text-sm text-ink-50 focus:outline-none focus:border-gold-400/40">
                    {categories && categories.map((c) => (
  <option key={c.id || c.name} value={c.name}>
    {c.name}
  </option>
))}  
                    </select>
                  </div>
                  <div>
                    <label className="text-sm text-ink-200 mb-1 block">الماركة التابع لها</label>
                    <select
                      value={form.brand_id || ''}
                      onChange={(e) => setForm({ ...form, brand_id: e.target.value })}
                      className="w-full bg-ink-700/60 border border-gold-400/15 rounded-xl px-4 py-2.5 text-sm text-ink-50 focus:outline-none focus:border-gold-400/40"
                    >
                      <option value="">-- بدون ماركة --</option>
                      {brands.map((brand) => (
                        <option key={brand.id} value={brand.id}>
                          {brand.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm text-ink-200 mb-1 block">السعر (ر.س)</label>
                    <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="0" className="w-full bg-ink-700/60 border border-gold-400/15 rounded-xl px-4 py-2.5 text-sm text-ink-50 focus:outline-none focus:border-gold-400/40" />
                  </div>
                  <div>
                    <label className="text-sm text-ink-200 mb-1 block">السعر القديم (اختياري)</label>
                    <input type="number" value={form.old_price} onChange={(e) => setForm({ ...form, old_price: e.target.value })} placeholder="0" className="w-full bg-ink-700/60 border border-gold-400/15 rounded-xl px-4 py-2.5 text-sm text-ink-50 focus:outline-none focus:border-gold-400/40" />
                  </div>
                </div>

                <div>
                  <label className="text-sm text-ink-200 mb-1 block">وصف المنتج</label>
                  <textarea
                    value={form.description || ''}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-ink-700/60 text-white border border-gold-400/15 text-sm"
                    placeholder="اكتب وصف المنتج هنا..."
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-sm text-ink-200 mb-1 block">التقييم</label>
                    <input type="number" step="0.1" max="5" value={form.rating} onChange={(e) => setForm({ ...form, rating: e.target.value })} className="w-full bg-ink-700/60 border border-gold-400/15 rounded-xl px-4 py-2.5 text-sm text-ink-50 focus:outline-none focus:border-gold-400/40" />
                  </div>
                  <div>
                    <label className="text-sm text-ink-200 mb-1 block">عدد المراجعات</label>
                    <input type="number" value={form.reviews_count} onChange={(e) => setForm({ ...form, reviews_count: e.target.value })} className="w-full bg-ink-700/60 border border-gold-400/15 rounded-xl px-4 py-2.5 text-sm text-ink-50 focus:outline-none focus:border-gold-400/40" />
                  </div>
                  <div>
                    <label className="text-sm text-ink-200 mb-1 block">الترتيب</label>
                    <input type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: e.target.value })} className="w-full bg-ink-700/60 border border-gold-400/15 rounded-xl px-4 py-2.5 text-sm text-ink-50 focus:outline-none focus:border-gold-400/40" />
                  </div>
                </div>

                <div>
                  <label className="text-sm text-ink-200 mb-1 block">صورة المعرض التفصيلي (الصورة الثانية)</label>
                  <MediaUploader
                    value={form.secondary_image_url || ''}
                    onChange={(url) => setForm({ ...form, secondary_image_url: url })}
                  />
                </div>

                <div>
                  <label className="text-sm text-ink-200 mb-1 block">عنوان المعلومات المخصص</label>
                  <input
                    type="text"
                    placeholder="...مثال: وصف مدح المنتج"
                    value={form.extra_info_label || ''}
                    onChange={(e) => setForm({ ...form, extra_info_label: e.target.value })}
                    className="w-full bg-ink-700/60 border border-gold-400/15 rounded-xl px-4 py-2.5 text-sm"
                  />
                </div>

                <div>
                  <label className="text-sm text-ink-200 mb-1 block">معلومات المنتج</label>
                  <textarea
                    placeholder="...اكتب التفاصيل هنا"
                    value={form.extra_info_content || ''}
                    onChange={(e) => setForm({ ...form, extra_info_content: e.target.value })}
                    className="w-full bg-ink-700/60 border border-gold-400/15 rounded-xl px-4 py-2.5 text-sm h-20 text-ink-50"
                  />
                </div>

                <div>
                  <label className="text-sm text-ink-200 mb-1 block">معلومات الصنع</label>
                  <input
                    type="text"
                    placeholder="مثال: صنع في المملكة العربية السعودية"
                    value={form.origin_info || ''}
                    onChange={(e) => setForm({ ...form, origin_info: e.target.value })}
                    className="w-full bg-ink-700/60 border border-gold-400/15 rounded-xl px-4 py-2.5 text-sm text-ink-50"
                  />
                </div>

                <MediaUploader
                  value={form.image_url}
                  onChange={(url) => setForm({ ...form, image_url: url })}
                  bucket="products"
                  label="رفع ملف من الجهاز (صورة أو فيديو)"
                />

                <div className="flex gap-2 pt-2">
                  <button onClick={handleSaveProduct} disabled={saving} className="flex-1 flex items-center justify-center gap-2 py-2.5 gold-gradient text-ink-900 font-bold rounded-xl text-sm disabled:opacity-60">
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    حفظ
                  </button>
                  <button onClick={resetForm} className="px-6 py-2.5 bg-ink-700 text-ink-200 rounded-xl text-sm hover:bg-ink-600 transition-colors">
                    إلغاء
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Banners Tab */}
        {tab === 'banners' && (
          <div className="space-y-4">
            {!showBannerForm ? (
              <>
                <button
                  onClick={() => setShowBannerForm(true)}
                  className="w-full flex items-center justify-center gap-2 py-2.5 gold-gradient text-ink-900 rounded-xl font-medium"
                >
                  <Plus className="w-4 h-4" />
                  إضافة بنر جديد
                </button>

                <div className="space-y-2">
                  {banners.map((banner) => (
                    <div key={banner.id} className="flex items-center justify-between p-3 bg-ink-700/40 rounded-xl border border-gold-400/10">
                      <div className="flex items-center gap-3">
                        {banner.image_url && (
                          <img src={banner.image_url} alt={banner.title || ''} className="w-16 h-10 object-cover rounded-lg" />
                        )}
                        <div>
                          <h4 className="text-sm font-medium text-gold-200">{banner.title || 'عنوان البنر'}</h4>
                          <p className="text-xs text-ink-300">
                            {banner.position === 'hero' ? 'البنر الرئيسي' : 'بنر فرعي'}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteBanner(banner.id)}
                        className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  {banners.length === 0 && (
                    <p className="text-center text-sm text-ink-400 py-4">لا توجد بنرات حالياً</p>
                  )}
                </div>
              </>
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); handleSaveBanner(); }} className="space-y-4">
                <div>
                  <label className="block text-xs text-ink-300 mb-1">عنوان البنر / العبارة (مثال: الباقة الذهبية)</label>
                  <input
                    type="text"
                    placeholder="اكتب العبارة الخاصة بهذه الصورة..."
                    value={bannerForm.title}
                    onChange={(e) => setBannerForm({ ...bannerForm, title: e.target.value })}
                    className="w-full bg-ink-900/60 border border-gold-400/20 rounded-xl px-3 py-2 text-sm text-gold-100"
                  />
                </div>

                <div>
                  <label className="block text-xs text-ink-300 mb-1">مكان العرض</label>
                  <select
                    value={bannerForm.position}
                    onChange={(e) => setBannerForm({ ...bannerForm, position: e.target.value as any })}
                    className="w-full bg-ink-900/60 border border-gold-400/20 rounded-xl px-3 py-2 text-sm text-gold-100"
                  >
                    <option value="hero">الرئيسي (Hero)</option>
                    <option value="middle">الوسط (Middle)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-ink-300 mb-1">رفع صورة البنر من الجهاز</label>
                  <MediaUploader
                    value={bannerForm.image_url}
                    onChange={(url) => setBannerForm({ ...bannerForm, image_url: url })}
                    bucket="products"
                    label="اختر صورة البنر من جهازك"
                  />
                </div>

                <div>
                  <label className="block text-xs text-ink-300 mb-1">ربط بمنتج (اختياري)</label>
                  <select
                    value={bannerForm.product_id || ''}
                    onChange={(e) => setBannerForm({ ...bannerForm, product_id: e.target.value })}
                    className="w-full bg-ink-900/60 border border-gold-400/20 rounded-xl px-3 py-2 text-sm text-gold-200"
                  >
                    <option value="">-- بدون ربط بمنتج --</option>
                    {products.map((product) => (
                      <option key={product.id} value={product.id}>
                        {product.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="submit"
                    disabled={saving || !bannerForm.image_url}
                    className="flex-1 py-2 gold-gradient text-ink-900 rounded-xl text-sm font-medium disabled:opacity-50"
                  >
                    {saving ? 'جاري الحفظ...' : 'حفظ البنر'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowBannerForm(false)}
                    className="px-4 py-2 bg-ink-700 text-ink-200 rounded-xl text-sm"
                  >
                    إلغاء
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* Brands Tab */}
        {tab === 'brands' && (
          <div className="space-y-4">
            {!showBrandForm ? (
              <button
                onClick={() => {
                  setBrandForm({ name: '', image_url: '', category: 'عطور' });
                  setShowBrandForm(true);
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 gold-gradient text-ink-900 font-bold rounded-xl text-sm"
              >
                <Plus className="w-4 h-4" />
                إضافة ماركة جديدة
              </button>
            ) : (
              <div className="space-y-3 bg-ink-700/40 p-4 rounded-xl border border-gold-400/10">
                <h3 className="font-bold text-gold-200">إضافة ماركة جديدة</h3>
                <div>
                  <label className="text-sm text-ink-200 mb-1 block">اسم الماركة</label>
                  <input
                    type="text"
                    value={brandForm.name}
                    onChange={(e) => setBrandForm({ ...brandForm, name: e.target.value })}
                    placeholder="مثال: الماجد للعود"
                    className="w-full bg-ink-800/60 border border-gold-400/15 rounded-xl px-4 py-2.5 text-sm"
                  />
                </div>

                <div>
                  <label className="text-sm text-ink-200 mb-1 block">صورة الماركة</label>
                  <MediaUploader
                    value={brandForm.image_url}
                    onChange={(url) => setBrandForm({ ...brandForm, image_url: url })}
                    bucket="products"
                    label="اختر صورة الماركة من جهازك"
                  />
                </div>
                <div>
                  <label className="text-sm text-ink-200 mb-1 block">القسم التابع له</label>
                  <select
                    value={brandForm.category}
                    onChange={(e) => setBrandForm({ ...brandForm, category: e.target.value })}
                    className="w-full bg-ink-800/60 border border-gold-400/15 rounded-xl px-4 py-2.5 text-sm"
                  >
               {categories && categories.map((c) => (
  <option key={c.id || c.name} value={c.name}>
    {c.name}
  </option>
))}
                  </select>
                </div>
                <div className="flex gap-2 pt-2">
                  <button
                    onClick={handleSaveBrand}
                    disabled={saving}
                    className="flex-1 py-2 gold-gradient text-ink-900 font-bold rounded-xl text-sm"
                  >
                    {saving ? 'جاري الحفظ...' : 'حفظ الماركة'}
                  </button>
                  <button
                    onClick={() => setShowBrandForm(false)}
                    className="px-4 py-2 bg-ink-700 text-ink-200 rounded-xl text-sm"
                  >
                    إلغاء
                  </button>
                </div>
              </div>
            )}

            <div className="space-y-2">
              {brands.map((brand) => (
                <div key={brand.id} className="flex items-center justify-between p-3 bg-ink-700/40 rounded-xl border border-gold-400/10">
                  <div className="flex items-center gap-3">
                    <img src={brand.image_url} alt={brand.name} className="w-12 h-12 object-cover rounded-lg" />
                    <div>
                      <h4 className="text-sm font-medium text-ink-50">{brand.name}</h4>
                      <p className="text-xs text-gold-300">القسم: {brand.category}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteBrand(brand.id)}
                    className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              {brands.length === 0 && (
                <p className="text-center text-sm text-ink-400 py-4">لا توجد ماركات مضافة حالياً</p>
              )}
            </div>
          </div>
        )}

        {/* Videos Tab */}
        {tab === 'videos' && (
          <div className="space-y-4">
            <div className="bg-slate-800/50 p-6 rounded-2xl border border-gold-500/20 mb-8 space-y-4">
  <h3 className="text-xl font-bold text-gold-400 mb-2">🎬 إدارة الفيديو الفاخر المميز (أعلى الموقع)</h3>
  
  <div>
    <label className="block text-sm text-slate-300 mb-1">عنوان العطر / المنتج</label>
    <input
      type="text"
      value={showcaseForm.title}
      onChange={(e) => setShowcaseForm({ ...showcaseForm, title: e.target.value })}
      placeholder="مثال: عطر جلو 100مل أو دو بارفيوم"
      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white"
    />
  </div>

  <div>
    <label className="block text-sm text-slate-300 mb-1">رفع ملف الفيديو</label>
    <MediaUploader
      value={showcaseForm.video_url}
      onChange={(url: string) => setShowcaseForm({ ...showcaseForm, video_url: url })}
      bucket="products"
      label="رفع ملف الفيديو من الجهاز"
    />
  </div>
    <div>
      <label className="block text-sm text-slate-300 mb-1">السعر (ر.س)</label>
      <input
        type="text"
        value={showcaseForm.price}
        onChange={(e) => setShowcaseForm({ ...showcaseForm, price: e.target.value })}
        placeholder="178"
        className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white"
      />
    </div>
  </div>

  <div>
    <label className="block text-sm text-slate-300 mb-1">رفع صورة المنتج</label>
    <MediaUploader
      value={showcaseForm.product_image}
      onChange={(url: string) => setShowcaseForm({ ...showcaseForm, product_image: url })}
      bucket="products"
      label="رفع صورة المنتج من الجهاز"
    />
  </div>

  <button
    type="button"
   onClick={(e) => handleSaveShowcase(e)}
    disabled={saving}
    className="w-full py-3 bg-gold-500 hover:bg-gold-600 text-slate-950 font-bold rounded-xl transition"
  >
    {saving ? 'جاري الحفظ...' : 'حفظ ونشر الفيديو الفاخر'}
  </button>
  
            {!showVideoForm ? (
              <>
                <button onClick={() => setShowVideoForm(true)} className="w-full flex items-center justify-center gap-2 py-2.5 gold-gradient text-ink-900 font-bold rounded-xl text-sm hover:scale-[1.01] transition-transform">
                  <Plus className="w-4 h-4" />
                  إضافة فيديو جديد
                </button>
                <div className="space-y-2">
                  {videos.map((video) => (
                    <div key={video.id} className="flex items-center gap-3 bg-ink-700/40 rounded-xl p-3 border border-gold-400/10">
                      <VideoIcon className="w-10 h-10 text-gold-400 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium text-ink-50 line-clamp-1">{video.title}</h3>
                        <p className="text-xs text-ink-400 line-clamp-1">{video.video_url}</p>
                      </div>
                      <button onClick={() => handleDeleteVideo(video.id)} className="w-9 h-9 rounded-full hover:bg-red-900/30 flex items-center justify-center text-ink-400 hover:text-red-400 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  {videos.length === 0 && <p className="text-center text-ink-400 py-8">لا توجد فيديوهات</p>}
                </div>
              </>
            ) : (
              <div className="space-y-3 animate-fade-in">
                <h3 className="font-bold text-gold-200">فيديو جديد</h3>
                <div>
                  <label className="text-sm text-ink-200 mb-1 block">العنوان</label>
                  <input type="text" value={videoForm.title} onChange={(e) => setVideoForm({ ...videoForm, title: e.target.value })} placeholder="عنوان الفيديو" className="w-full bg-ink-700/60 border border-gold-400/15 rounded-xl px-4 py-2.5 text-sm text-ink-50 focus:outline-none focus:border-gold-400/40" />
                </div>
                <div>
                  <label className="text-sm text-ink-200 mb-1 block">الوصف</label>
                  <input type="text" value={videoForm.description} onChange={(e) => setVideoForm({ ...videoForm, description: e.target.value })} placeholder="وصف الفيديو" className="w-full bg-ink-700/60 border border-gold-400/15 rounded-xl px-4 py-2.5 text-sm text-ink-50 focus:outline-none focus:border-gold-400/40" />
                </div>
                <div>
  <label className="text-sm text-ink-200 mb-1 block">موقع عرض الفيديو</label>
  <select
    value={videoForm.position || 'hero'}
    onChange={(e) => setVideoForm({ ...videoForm, position: e.target.value })}
    className="w-full bg-ink-700/60 border border-gold-400/15 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-gold-400/40"
  >
    <option value="hero">في الأعلى (تحت البنر الرئيسي)</option>
    <option value="middle">في الوسط (تحت البنرات الوسطى)</option>
  </select>
</div>
                <MediaUploader
                  value={videoForm.video_url}
                  onChange={(url) => setVideoForm({ ...videoForm, video_url: url })}
                  bucket="products"
                  label="رفع ملف من الجهاز (صورة أو فيديو)"
                />
                <div className="flex gap-2 pt-2">
                  <button onClick={handleSaveVideo} disabled={saving} className="flex-1 flex items-center justify-center gap-2 py-2.5 gold-gradient text-ink-900 font-bold rounded-xl text-sm disabled:opacity-60">
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    حفظ
                  </button>
                  <button onClick={() => { setVideoForm({ title: '', description: '', video_url: '', position: 'hero', sort_order: '0' }); }} className="px-6 py-2.5 bg-ink-700 text-ink-200 rounded-xl text-sm hover:bg-ink-600 transition-colors">
                    إلغاء
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Settings Tab */}
        {tab === 'settings' && (
          <div className="space-y-4">
            <h3 className="font-bold text-gold-200">إعدادات المتجر</h3>
            <div>
              <label className="text-sm text-ink-200 mb-1 block">رقم واتساب (بدون +)</label>
              <input type="text" value={settingsForm.whatsapp_number} onChange={(e) => setSettingsForm({ ...settingsForm, whatsapp_number: e.target.value })} dir="ltr" className="w-full bg-ink-700/60 border border-gold-400/15 rounded-xl px-4 py-2.5 text-sm text-ink-50 focus:outline-none focus:border-gold-400/40 text-right" />
            </div>
            <div>
              <label className="text-sm text-ink-200 mb-1 block">رابط تيك توك</label>
              <input type="text" value={settingsForm.tiktok_url} onChange={(e) => setSettingsForm({ ...settingsForm, tiktok_url: e.target.value })} dir="ltr" className="w-full bg-ink-700/60 border border-gold-400/15 rounded-xl px-4 py-2.5 text-sm text-ink-50 focus:outline-none focus:border-gold-400/40 text-right" />
            </div>
            <div>
              <label className="text-sm text-ink-200 mb-1 block">رابط تويتر</label>
              <input type="text" value={settingsForm.twitter_url} onChange={(e) => setSettingsForm({ ...settingsForm, twitter_url: e.target.value })} dir="ltr" className="w-full bg-ink-700/60 border border-gold-400/15 rounded-xl px-4 py-2.5 text-sm text-ink-50 focus:outline-none focus:border-gold-400/40 text-right" />
            </div>
            <div>
              <label className="text-sm text-ink-200 mb-1 block">رابط فيسبوك</label>
              <input type="text" value={settingsForm.facebook_url} onChange={(e) => setSettingsForm({ ...settingsForm, facebook_url: e.target.value })} dir="ltr" className="w-full bg-ink-700/60 border border-gold-400/15 rounded-xl px-4 py-2.5 text-sm text-ink-50 focus:outline-none focus:border-gold-400/40 text-right" />
            </div>
            <div>
              <label className="text-sm text-ink-200 mb-1 block">رابط انستغرام</label>
              <input type="text" value={settingsForm.instagram_url} onChange={(e) => setSettingsForm({ ...settingsForm, instagram_url: e.target.value })} dir="ltr" className="w-full bg-ink-700/60 border border-gold-400/15 rounded-xl px-4 py-2.5 text-sm text-ink-50 focus:outline-none focus:border-gold-400/40 text-right" />
            </div>
            <button onClick={handleSaveSettings} disabled={saving} className="w-full flex items-center justify-center gap-2 py-2.5 gold-gradient text-ink-900 font-bold rounded-xl text-sm disabled:opacity-60">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              حفظ الإعدادات
            </button>
          </div>
        )}
      </div>
    </div>
  </div>
 );
}