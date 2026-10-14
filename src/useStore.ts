import { useState, useEffect, useCallback } from 'react';
import { supabase } from './supabaseClient';
import type { Product, Video, StoreSettings } from './types';

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true });
    if (error) {
      console.error('Error fetching products:', error);
    }
    setProducts(data || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return { products, loading, refetch: fetchProducts };
}

export function useVideos() {
  const [videos, setVideos] = useState<Video[]>([]);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from('videos')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });
      if (error) console.error('Error fetching videos:', error);
      setVideos(data || []);
    })();
  }, []);

  return videos;
}

export function useStoreSettings() {
  const [settings, setSettings] = useState<StoreSettings | null>(null);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from('store_settings')
        .select('*')
        .eq('id', 1)
        .maybeSingle();
      if (error) console.error('Error fetching settings:', error);
      setSettings(data);
    })();
  }, []);

  return settings;
}
