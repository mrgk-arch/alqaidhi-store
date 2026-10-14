/*
# Storage policies for products bucket

1. Security
- Allow public read access to product images (they are displayed on the storefront).
- Allow anon + authenticated upload (admin panel uploads images directly).
- Allow anon + authenticated update and delete.

2. Notes
- The products bucket is public (public = true).
- These policies allow the frontend to upload images without requiring authentication.
*/

DROP POLICY IF EXISTS "public_read_products" ON storage.objects;
CREATE POLICY "public_read_products" ON storage.objects FOR SELECT
  TO anon, authenticated USING (bucket_id = 'products');

DROP POLICY IF EXISTS "anon_insert_products" ON storage.objects;
CREATE POLICY "anon_insert_products" ON storage.objects FOR INSERT
  TO anon, authenticated WITH CHECK (bucket_id = 'products');

DROP POLICY IF EXISTS "anon_update_products" ON storage.objects;
CREATE POLICY "anon_update_products" ON storage.objects FOR UPDATE
  TO anon, authenticated USING (bucket_id = 'products') WITH CHECK (bucket_id = 'products');

DROP POLICY IF EXISTS "anon_delete_products" ON storage.objects;
CREATE POLICY "anon_delete_products" ON storage.objects FOR DELETE
  TO anon, authenticated USING (bucket_id = 'products');
