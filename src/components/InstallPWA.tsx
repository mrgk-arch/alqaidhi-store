import { useState, useEffect } from 'react';
import { Download, Sparkles } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function InstallPWA() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsVisible(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('تم تثبيت التطبيق بنجاح');
    }
    
    setDeferredPrompt(null);
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-bounce">
      <button
        onClick={handleInstallClick}
        className="gold-gradient text-ink-900 font-bold px-5 py-3 rounded-full shadow-2xl flex items-center gap-2.5 border border-gold-300/40 hover:scale-105 transition-transform"
      >
        <Download className="w-5 h-5 animate-pulse" />
        <span className="text-sm">تثبيت تطبيق القيضي</span>
        <Sparkles className="w-4 h-4" />
      </button>
    </div>
  );
}