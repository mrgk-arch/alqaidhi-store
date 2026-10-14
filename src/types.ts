export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  old_price: number | null;
  image_url: string | null;
  secondary_image_url?: string | null;
  extra_info_label?: string | null;
  extra_info_content?: string | null;
  origin_info?: string | null;
  description?: string | null;
  rating: number;
  reviews_count: number;
  badge: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
}

export interface Video {
  id: string;
  title: string;
  description: string | null;
  video_url: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
}

export interface StoreSettings {
  id: number;
  whatsapp_number: string;
  tiktok_url: string | null;
  twitter_url: string | null;
  facebook_url: string | null;
  instagram_url: string | null;
  hero_image_1: string | null;
  hero_image_2: string | null;
  hero_image_3: string | null;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface CustomerInfo {
  name: string;
  phone: string;
  address: string;
  location: { lat: number; lng: number; label: string } | null;
}
export interface Banner {
  id: string;
  title: string;          // عنوان الإعلان (مثال: عروض اليوم الوطني)
  image_url: string;      // رابط الصورة
  link?: string;          // رابط يفتح عند الضغط على الصورة (اختياري)
  position: 'hero' | 'middle'; // هل هو في البنر العلوي المتحرك أم بين المنتجات؟
}
export const CATEGORIES = [
  'عطور',
  'بخور',
  'عناية خاصة',
  'عناية بالشعر',
  'مكياج',
  'شنط',
  'ملابس نوم',
  'عروض',
] as const;
