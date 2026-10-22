import React, { useEffect, useState } from 'react';

interface SplashScreenProps {
  onFinish?: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const [fade, setFade] = useState(false);

  useEffect(() => {
    // التلاشي السلس بعد عرض الحركة الفاخرة
    const timer = setTimeout(() => {
      setFade(true);
    }, 2400);

    const finishTimer = setTimeout(() => {
      if (onFinish) onFinish();
    }, 3000);

    return () => {
      clearTimeout(timer);
      clearTimeout(finishTimer);
    };
  }, [onFinish]);

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#070A0F] transition-opacity duration-700 ${
        fade ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* خلفية التوهج الذهبي الفاخر */}
      <div className="absolute w-80 h-80 rounded-full bg-amber-500/15 blur-[90px] animate-pulse pointer-events-none" />

      {/* حاوية الشعار مع حركة الظهور والتكبير السلس */}
      <div className="relative flex flex-col items-center justify-center animate-splash-scale px-4 text-center">
        
        {/* إطار الشعار الدائري الفاخر */}
        <div className="relative p-3 rounded-full bg-gradient-to-b from-amber-400/20 via-amber-500/5 to-transparent border border-amber-500/30 shadow-[0_0_60px_rgba(217,119,6,0.3)] backdrop-blur-sm">
          <img
            src="/logo.png"
            alt="القيضي للعود"
            className="w-48 h-48 md:w-60 md:h-60 object-contain drop-shadow-[0_12px_24px_rgba(0,0,0,0.9)] rounded-full"
          />
        </div>

        {/* خط ذهبي ديكوري فاخر فاصل */}
        <div className="flex items-center gap-3 my-6">
          <div className="w-12 h-[1px] bg-gradient-to-r from-transparent to-amber-400" />
          <div className="w-2 h-2 rotate-45 bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]" />
          <div className="w-12 h-[1px] bg-gradient-to-l from-transparent to-amber-400" />
        </div>

        {/* اسم المتجر بخط ذهبي لامع وفخم */}
        <h1 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-500 bg-clip-text text-transparent drop-shadow-[0_4px_12px_rgba(217,119,6,0.4)] tracking-wide">
          الـقـيـضـي لـلـعـود
        </h1>

        {/* النص باللغة الإنجليزية تحت الاسم العربي */}
        <p className="text-amber-300/80 text-xs md:text-sm font-medium tracking-[0.25em] mt-2 uppercase">
          AL-QAYDI FOR OUD
        </p>
      </div>
    </div>
  );
};