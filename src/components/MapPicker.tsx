import { useEffect, useRef } from 'react';
import { MapPin, Loader2 } from 'lucide-react';

// Load Leaflet CSS
const LEAFLET_CSS = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
const LEAFLET_JS = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';

let leafletLoaded = false;

function loadLeaflet(): Promise<void> {
  return new Promise((resolve) => {
    if (leafletLoaded) {
      resolve();
      return;
    }
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = LEAFLET_CSS;
    document.head.appendChild(link);

    const script = document.createElement('script');
    script.src = LEAFLET_JS;
    script.onload = () => {
      leafletLoaded = true;
      resolve();
    };
    document.head.appendChild(script);
  });
}

interface MapPickerProps {
  onLocationSelect: (location: { lat: number; lng: number; label: string }) => void;
  location: { lat: number; lng: number; label: string } | null;
}

export default function MapPicker({ onLocationSelect, location }: MapPickerProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markerRef = useRef<any>(null);

  useEffect(() => {
    loadLeaflet().then(() => {
      if (!mapRef.current || mapInstanceRef.current) return;
      const L = (window as any).L;

      const defaultLat = location?.lat || 15.3694;
      const defaultLng = location?.lng || 44.1910;

      const map = L.map(mapRef.current).setView([defaultLat, defaultLng], 13);
      mapInstanceRef.current = map;

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: 'OpenStreetMap',
      }).addTo(map);

      if (location) {
        markerRef.current = L.marker([location.lat, location.lng]).addTo(map);
      }

      map.on('click', (e: any) => {
        const { lat, lng } = e.latlng;
        if (markerRef.current) {
          markerRef.current.setLatLng([lat, lng]);
        } else {
          markerRef.current = L.marker([lat, lng]).addTo(map);
        }
        onLocationSelect({ lat, lng, label: `${lat.toFixed(4)}, ${lng.toFixed(4)}` });
      });

      // Fix tile rendering after container becomes visible
      setTimeout(() => map.invalidateSize(), 200);
    });

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        markerRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <label className="text-sm text-ink-200 mb-1.5 flex items-center gap-1.5">
        <MapPin className="w-4 h-4 text-gold-400" />
        موقع التوصيل على الخريطة
      </label>
      <div ref={mapRef} className="w-full h-48 rounded-xl border border-gold-400/20 overflow-hidden" />
      {location ? (
        <p className="text-xs text-emerald-400 mt-1.5 flex items-center gap-1">
          <MapPin className="w-3 h-3" />
          تم تحديد الموقع: {location.label}
        </p>
      ) : (
        <p className="text-xs text-ink-400 mt-1.5">اضغط على الخريطة لتحديد موقعك</p>
      )}
    </div>
  );
}
