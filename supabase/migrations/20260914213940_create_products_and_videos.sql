/*
# Create products and videos tables for متجر القيضي

1. New Tables
- `products`: stores all store products with name, category, price, old_price, image_url, rating, reviews_count, badge, sort_order, is_active, created_at
- `videos`: stores promotional/advertising video URLs with title, description, sort_order, is_active, created_at
- `store_settings`: single-row table for store-wide settings (whatsapp_number, social links, hero images)

2. Security
- Enable RLS on all tables.
- This is a single-tenant store with no sign-in — allow anon + authenticated full CRUD.
- All data is intentionally public/shared.

3. Notes
- Products table supports soft-delete via is_active flag.
- Categories are stored as text (not a separate table) for simplicity: مكياج, شنط, ملابس نوم, عطور, بخور, عناية خاصة, عناية بالشعر, عروض
- Videos table stores external video URLs (YouTube/embed links).
- Store settings uses a fixed id = 1 row pattern.
*/

CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text NOT NULL DEFAULT 'عطور',
  price numeric NOT NULL DEFAULT 0,
  old_price numeric,
  image_url text,
  rating numeric DEFAULT 5.0,
  reviews_count integer DEFAULT 0,
  badge text,
  sort_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_products" ON products;
CREATE POLICY "anon_select_products" ON products FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_products" ON products;
CREATE POLICY "anon_insert_products" ON products FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_products" ON products;
CREATE POLICY "anon_update_products" ON products FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_products" ON products;
CREATE POLICY "anon_delete_products" ON products FOR DELETE
  TO anon, authenticated USING (true);

CREATE TABLE IF NOT EXISTS videos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  video_url text NOT NULL,
  sort_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE videos ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_videos" ON videos;
CREATE POLICY "anon_select_videos" ON videos FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_videos" ON videos;
CREATE POLICY "anon_insert_videos" ON videos FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_videos" ON videos;
CREATE POLICY "anon_update_videos" ON videos FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_videos" ON videos;
CREATE POLICY "anon_delete_videos" ON videos FOR DELETE
  TO anon, authenticated USING (true);

CREATE TABLE IF NOT EXISTS store_settings (
  id integer PRIMARY KEY DEFAULT 1,
  whatsapp_number text DEFAULT '967779392061',
  tiktok_url text,
  twitter_url text,
  facebook_url text,
  instagram_url text,
  hero_image_1 text,
  hero_image_2 text,
  hero_image_3 text,
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE store_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_settings" ON store_settings;
CREATE POLICY "anon_select_settings" ON store_settings FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_settings" ON store_settings;
CREATE POLICY "anon_insert_settings" ON store_settings FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_settings" ON store_settings;
CREATE POLICY "anon_update_settings" ON store_settings FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

-- Seed default settings row
INSERT INTO store_settings (id, whatsapp_number, tiktok_url, twitter_url, facebook_url, instagram_url)
VALUES (1, '967779392061', 'https://tiktok.com', 'https://twitter.com', 'https://facebook.com', 'https://instagram.com')
ON CONFLICT (id) DO NOTHING;

-- Seed sample products
INSERT INTO products (name, category, price, old_price, image_url, rating, reviews_count, badge, sort_order) VALUES
('عطر العود الملكي', 'عطور', 450, 650, 'https://images.pexels.com/photos/36389336/pexels-photo-36389336.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 4.8, 124, 'الأكثر مبيعاً', 1),
('بخور العود الفاخر', 'بخور', 220, 300, 'https://images.pexels.com/photos/6201645/pexels-photo-6201645.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 4.9, 89, 'عرض خاص', 2),
('سيروم النضارة الفاخر', 'عناية خاصة', 180, NULL, 'https://images.pexels.com/photos/16233812/pexels-photo-16233812.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 4.7, 203, 'جديد', 3),
('عطر المسك الأبيض', 'عطور', 320, 400, 'https://images.pexels.com/photos/264819/pexels-photo-264819.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 4.6, 67, NULL, 4),
('زيت العود الطبيعي', 'عطور', 550, NULL, 'https://images.pexels.com/photos/21008941/pexels-photo-21008941.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 5.0, 45, 'حصري', 5),
('كريم العناية المرطب', 'عناية خاصة', 145, 190, 'https://images.pexels.com/photos/36339062/pexels-photo-36339062.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 4.5, 156, NULL, 6),
('شامبو الشعر الطبيعي', 'عناية بالشعر', 95, NULL, 'https://images.pexels.com/photos/30696654/pexels-photo-30696654.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 4.4, 78, 'عرض', 7),
('مجموعة العطور الفاخرة', 'عروض', 890, 1200, 'https://images.pexels.com/photos/7703038/pexels-photo-7703038.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 4.9, 34, 'وفّر 26%', 8),
('أحمر شفاه فاخر', 'مكياج', 120, 160, 'https://images.pexels.com/photos/26927323/pexels-photo-26927323.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 4.6, 91, 'جديد', 9),
('حقيبة يد أنيقة', 'شنط', 340, NULL, 'https://images.pexels.com/photos/290523/pexels-photo-290523.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 4.7, 52, NULL, 10),
('طقم نوم حريري', 'ملابس نوم', 210, 280, 'https://images.pexels.com/photos/6724531/pexels-photo-6724531.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 4.8, 38, 'عرض خاص', 11),
('عطر الياسمين الملكي', 'عطور', 380, NULL, 'https://images.pexels.com/photos/13662407/pexels-photo-13662407.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 4.7, 92, NULL, 12)
ON CONFLICT DO NOTHING;

-- Seed sample videos
INSERT INTO videos (title, description, video_url, sort_order) VALUES
('إعلان عطور القيضي الفاخرة', 'اكتشف أرقى تشكيلة العطور العالمية والعربية', 'https://www.youtube.com/embed/dQw4w9WgXcQ', 1),
('تشكيلة البخور والمسك الأصيل', 'روائح شرقية أصيلة تنشر العبير في منزلك', 'https://www.youtube.com/embed/dQw4w9WgXcQ', 2)
ON CONFLICT DO NOTHING;
