import { useState, useCallback, useRef, useEffect } from 'react';
import TopBar from './components/TopBar';
import HeroCarousel from './components/HeroCarousel';
import CategoryMenu from './components/CategoryMenu';
import { ProductGrid } from './components/ProductGrid';
import CartDrawer from './components/CartDrawer';
import WhatsAppButton from './components/WhatsAppButton';
import BottomNav from './components/BottomNav';
import Footer from './components/Footer';
import VideoSection from './components/VideoSection';
import AdminPanel from './components/AdminPanel';
import FeaturesBar from './components/FeaturesBar';
import ToastContainer from './components/Toast';
import type { ToastData } from './components/Toast';
import type { Product, Banner } from './types';
import { useCart } from './useCart';
import { useProducts, useVideos, useStoreSettings } from './useStore';
import { supabase } from './supabaseClient';
import AuthModal from './components/AuthModal';
import { ProductDetails } from './components/ProductDetails';
import InstallPWA from './components/InstallPWA';
type NavigationView = 'home' | 'categories' | 'offers' | 'cart' | 'account';

export default function App() {
  const [cartOpen, setCartOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeNav, setActiveNav] = useState<NavigationView>('home');
  const [adminOpen, setAdminOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [toasts, setToasts] = useState<ToastData[]>([]);
  const toastIdRef = useRef(0);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const [banners, setBanners] = useState<Banner[]>([]);
  const [brands, setBrands] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);

  const fetchBanners = useCallback(async () => {
    const { data, error } = await supabase.from('banners').select('*');
    if (data && !error) {
      setBanners(data);
    }
  }, []);

  const fetchBrands = useCallback(async () => {
    const { data, error } = await supabase.from('brands').select('*');
    if (data && !error) {
      setBrands(data);
    }
  }, []);

  const fetchCategories = useCallback(async () => {
    const { data, error } = await supabase.from('categories').select('*');
    if (data && !error) {
      setCategories(data);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
    fetchBanners();
    fetchBrands();

    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [fetchCategories, fetchBanners, fetchBrands]);

  const { products, loading, refetch: refetchProducts } = useProducts();
  const videos = useVideos();
  const settings = useStoreSettings();

  const {
    items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalItems,
    totalPrice,
  } = useCart();

  const handleBannerClick = (banner: Banner) => {
    const bannerData = banner as any;
    if (bannerData && bannerData.product_id) {
      const linkedProduct = products.find(
        (p) => String(p.id) === String(bannerData.product_id)
      );
      if (linkedProduct) {
        setSelectedProduct(linkedProduct);
      }
    }
  };

  const showToast = useCallback((message: string) => {
    const id = ++toastIdRef.current;
    setToasts((prev) => [...prev, { id, message }]);
  }, []);

  const dismissToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const handleAddToCart = useCallback(
    (product: Product) => {
      addToCart(product);
      showToast(`تمت إضافة "${product.name}" إلى السلة`);
    },
    [addToCart, showToast]
  );

  const handleNavigate = (view: NavigationView) => {
    setActiveNav(view);
    if (view === 'home') {
      setActiveCategory('all');
      setSearchQuery('');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (view === 'categories') {
      const el = document.getElementById('categories-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
      else window.scrollTo({ top: 300, behavior: 'smooth' });
    } else if (view === 'offers') {
      setActiveCategory('عروض');
      window.scrollTo({ top: 400, behavior: 'smooth' });
    } else if (view === 'cart') {
      setCartOpen(true);
    } else if (view === 'account') {
      setAuthOpen(true);
    }
  };

  const handleAdminClick = () => {
    const password = prompt('أدخل كلمة المرور للوصول إلى لوحة التحكم');
    if (password === '0000') {
      setAdminOpen(true);
    } else if (password !== null) {
      alert('كلمة المرور غير صحيحة');
    }
  };

  const whatsappNumber = settings?.whatsapp_number || '967779392061';

  if (selectedProduct) {
    return (
      <ProductDetails
        product={selectedProduct}
        onBack={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
      />
    );
  }

  return (
    <div className="min-h-screen bg-ink-900 text-slate-100 font-sans dir-rtl">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gold-600/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -left-40 w-96 h-96 bg-emerald-700/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/3 w-80 h-80 bg-gold-500/3 rounded-full blur-3xl" />
      </div>

      <div className="relative">
      <TopBar
          cartCount={totalItems}
          onCartClick={() => setCartOpen(true)}
          onSearch={(query) => setSearchQuery(query)}
          onAdminClick={handleAdminClick}
          products={products}
          onAccountClick={() => setAuthOpen(true)}
        />

   <HeroCarousel 
  settings={settings}
  banners={banners.filter((b) => b.position === 'hero')}
  onBannerClick={handleBannerClick}
/>

{/* فيديوهات ترويجية أولى تحت البنر الرئيسي */}
<VideoSection videos={videos} />
        <FeaturesBar />

        <div id="categories-section">
          <CategoryMenu
            categories={categories}
            activeCategory={activeCategory}
            onCategoryChange={(cat) => {
              setActiveCategory(cat);
              const el = document.getElementById('products-section');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
          />
        </div>

        <div id="products-section">
          <ProductGrid
            products={products}
            activeCategory={activeCategory}
            searchQuery={searchQuery}
            onAddToCart={handleAddToCart}
            onSelectProduct={(product) => setSelectedProduct(product)}
            loading={loading}
            banners={banners.filter((b) => b.position === 'middle')}
            brands={brands}
            onBannerClick={handleBannerClick}
          />
        </div>

        <VideoSection videos={videos} />

        <Footer settings={settings} />

        <CartDrawer
          open={cartOpen}
          onClose={() => setCartOpen(false)}
          items={items}
          totalPrice={totalPrice}
          onUpdateQuantity={updateQuantity}
          onRemoveItem={removeFromCart}
          onClearCart={clearCart}
          whatsappNumber={whatsappNumber}
        />

        <WhatsAppButton whatsappNumber={whatsappNumber} />

        <BottomNav
          active={activeNav}
          onNavigate={handleNavigate}
          cartCount={totalItems}
          onCartClick={() => setCartOpen(true)}
        />

        <AdminPanel
          open={adminOpen}
          onClose={() => setAdminOpen(false)}
          products={products}
          videos={videos}
          settings={settings}
          onProductsChanged={() => {
            refetchProducts();
            fetchBanners();
          }}
          onVideosChanged={() => window.location.reload()}
        />
      </div>

      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

      <AuthModal 
        isOpen={authOpen} 
        onClose={() => setAuthOpen(false)} 
        onSuccess={() => {
          showToast('تم تسجيل الدخول بنجاح!');
        }}
      />
      <InstallPWA />
    </div>
  );
}