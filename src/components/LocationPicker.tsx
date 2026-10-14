import React, { useState } from 'react';

interface LocationPickerProps {
  onSelectLocation?: (lat: number, lng: number) => void;
}

export default function LocationPicker({ onSelectLocation }: LocationPickerProps) {
  const [coords, setCoords] = useState<{ lat: number; lng: number }>({
    lat: 24.7136,
    lng: 46.6753,
  });
  const [loadingGeo, setLoadingGeo] = useState(false);

  const handleGetCurrentLocation = () => {
    if ('geolocation' in navigator) {
      setLoadingGeo(true);
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const newLat = pos.coords.latitude;
          const newLng = pos.coords.longitude;
          setCoords({ lat: newLat, lng: newLng });
          if (onSelectLocation) onSelectLocation(newLat, newLng);
          setLoadingGeo(false);
        },
        () => {
          alert('تعذر الوصول لموقعك. تأكد من تفعيل خدمة الـ GPS في جهازك.');
          setLoadingGeo(false);
        },
        { enableHighAccuracy: true }
      );
    } else {
      alert('المتصفح لا يدعم خدمة تحديد الموقع.');
    }
  };

  return (
    <div className="relative w-full my-4 rounded-xl overflow-hidden border border-amber-500/30 shadow-2xl bg-slate-900 p-2 text-right">
      <button
        type="button"
        onClick={handleGetCurrentLocation}
        className="w-full mb-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 px-4 rounded-lg shadow-md transition-all duration-200 text-sm"
      >
        {loadingGeo ? '📍 جاري تحديد موقعك بدقة...' : '📍 اضغط هنا لتحديد موقعي الحالي تلقائياً'}
      </button>

      <div className="w-full h-64 rounded-lg overflow-hidden border border-slate-700">
        <iframe
          title="Map Location"
          width="100%"
          height="100%"
          frameBorder="0"
          scrolling="no"
          marginHeight={0}
          marginWidth={0}
          src={`https://maps.google.com/maps?q=${coords.lat},${coords.lng}&z=15&output=embed`}
        ></iframe>
      </div>

      <div className="mt-2 text-xs text-amber-300/80 text-center dir-rtl">
        الإحداثيات المحددة: {coords.lat.toFixed(5)}, {coords.lng.toFixed(5)}
      </div>
    </div>
  );
}