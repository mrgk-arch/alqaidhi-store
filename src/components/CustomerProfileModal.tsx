import React, { useState } from 'react';
import { X, ShoppingBag, Bell, MapPin, User, LogOut, Trash2, ChevronRight, ShieldCheck } from 'lucide-react';
import { supabase } from '../supabaseClient';

interface CustomerProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
}

export const CustomerProfileModal: React.FC<CustomerProfileModalProps> = ({ isOpen, onClose, user }) => {
  const [activeTab, setActiveTab] = useState<'orders' | 'notifications' | 'address' | 'settings'>('orders');

  if (!isOpen || !user) return null;

  const handleLogout = async () => {
    await supabase.auth.signOut();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl h-[85vh] rounded-3xl bg-slate-900/95 border border-amber-500/20 shadow-2xl overflow-hidden flex flex-col text-right text-slate-100">
        
        {/* الهيدر الفاخر */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-950/40">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-300 text-slate-950 font-bold flex items-center justify-center text-lg shadow-md">
              {user?.email?.[0]?.toUpperCase() || 'U'}
            </div>
            <div>
              <h2 className="font-bold text-base text-slate-100">{user?.user_metadata?.full_name || 'عميلنا المميز'}</h2>
              <p className="text-xs text-slate-400">{user?.email}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-full bg-slate-800/80 hover:bg-slate-800 text-slate-400 hover:text-white transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* الشريط العلوي للتبويبات */}
        <div className="flex border-b border-slate-800 bg-slate-950/20 px-4 overflow-x-auto scrollbar-none">
          {[
            { id: 'orders', label: 'طلباتي', icon: ShoppingBag },
            { id: 'notifications', label: 'الإشعارات', icon: Bell },
            { id: 'address', label: 'العناوين', icon: MapPin },
            { id: 'settings', label: 'الإعدادات', icon: User },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-5 py-3.5 text-xs font-semibold border-b-2 transition whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-amber-500 text-amber-400 bg-amber-500/5'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* محتوى الصفحة */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {activeTab === 'orders' && (
            <div className="text-center py-12 text-slate-400">
              <ShoppingBag className="w-12 h-12 mx-auto mb-3 opacity-30 text-amber-400" />
              <p className="text-sm font-medium">لا توجد طلبات سابقة حتى الآن</p>
              <p className="text-xs text-slate-500 mt-1">ابدأ التسوق واستمتع بعروضنا الحصرية</p>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="text-center py-12 text-slate-400">
              <Bell className="w-12 h-12 mx-auto mb-3 opacity-30 text-amber-400" />
              <p className="text-sm font-medium">لا توجد إشعارات جديدة</p>
            </div>
          )}

          {activeTab === 'address' && (
            <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-700/50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-amber-400" />
                <div>
                  <p className="text-xs font-bold text-slate-200">العنوان الرئيسي</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">المملكة العربية السعودية</p>
                </div>
              </div>
              <span className="text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2.5 py-1 rounded-lg">افتراضي</span>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-3">
              <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-700/50 flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-slate-200">حالة الحساب</p>
                  <p className="text-[11px] text-emerald-400 mt-0.5 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> حساب نشط وموثق
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* الفوتر وزر تسجيل الخروج */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/40 flex items-center justify-between">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 text-xs font-semibold transition"
          >
            <LogOut className="w-4 h-4" />
            تسجيل الخروج
          </button>
        </div>

      </div>
    </div>
  );
};