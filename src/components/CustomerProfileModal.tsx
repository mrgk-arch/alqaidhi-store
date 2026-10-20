import React, { useState, useEffect } from 'react';
import { ShoppingBag, Bell, MapPin, Trash2, LogOut, X, Package, ShieldAlert } from 'lucide-react';
import { supabase } from '../supabaseClient';

interface CustomerProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
}

export const CustomerProfileModal: React.FC<CustomerProfileModalProps> = ({ isOpen, onClose, user }) => {
  const [activeTab, setActiveTab] = useState<'menu' | 'orders' | 'notifications' | 'address'>('menu');
  const [orders, setOrders] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>({ city: '', address: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && user) {
      fetchCustomerData();
    }
  }, [isOpen, user]);

  const fetchCustomerData = async () => {
    setLoading(true);
    try {
      // جلب بيانات الملف الشخصي
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (profileData) setProfile(profileData);

      // جلب طلبات العميل السابقة
      const { data: ordersData } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (ordersData) setOrders(ordersData);
    } catch (error) {
      console.error('Error fetching customer data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase
      .from('profiles')
      .update({ city: profile.city, address: profile.address })
      .eq('id', user.id);

    if (!error) {
      alert('تم تحديث العنوان بنجاح');
    }
  };

  const handleDeleteAccount = async () => {
    if (confirm('هل أنت متكد من رغبتك في حذف الحساب نهائياً؟ لا يمكن التراجع عن هذا القرار.')) {
      // يتم تفعيل الحذف من خلال لوحة Supabase أو الـ API المخصص
      alert('يرجى التواصل مع الدعم الفني لتأكيد حذف الحساب نهائياً حفاظاً على أمان متجرك.');
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    onClose();
    window.location.reload();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden text-white">
        
        {/* رأس النافذة */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800 bg-slate-950/50">
          <div>
            <h2 className="text-xl font-bold text-slate-100">حسابي الشخصي</h2>
            <p className="text-xs text-slate-400 mt-0.5">{user?.email}</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* محتوى النافذة */}
        <div className="p-6 max-h-[75vh] overflow-y-auto">
          {activeTab === 'menu' && (
            <div className="space-y-3">
              {/* مشترياتي */}
              <button 
                onClick={() => setActiveTab('orders')}
                className="w-full flex items-center justify-between p-4 rounded-2xl bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 transition-all group"
              >
                <div className="flex items-center space-x-3 space-x-reverse">
                  <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 group-hover:scale-110 transition-transform">
                    <ShoppingBag className="w-5 h-5" />
                  </div>
                  <span className="font-medium text-slate-200">مشترياتي</span>
                </div>
                <span className="text-xs text-slate-400 bg-slate-900 px-2.5 py-1 rounded-full border border-slate-700">
                  {orders.length} طلبات
                </span>
              </button>

              {/* شعاراتي */}
              <button 
                onClick={() => setActiveTab('notifications')}
                className="w-full flex items-center justify-between p-4 rounded-2xl bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 transition-all group"
              >
                <div className="flex items-center space-x-3 space-x-reverse">
                  <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 group-hover:scale-110 transition-transform">
                    <Bell className="w-5 h-5" />
                  </div>
                  <span className="font-medium text-slate-200">شعاراتي</span>
                </div>
                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
              </button>

              {/* عنوان التوصيل */}
              <button 
                onClick={() => setActiveTab('address')}
                className="w-full flex items-center justify-between p-4 rounded-2xl bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 transition-all group"
              >
                <div className="flex items-center space-x-3 space-x-reverse">
                  <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 group-hover:scale-110 transition-transform">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <span className="font-medium text-slate-200">عنوان التوصيل</span>
                </div>
                <span className="text-xs text-slate-400 max-w-[150px] truncate">
                  {profile?.city ? `${profile.city} - ${profile.address || ''}` : 'إضافة عنوان'}
                </span>
              </button>

              <hr className="border-slate-800 my-4" />

              {/* حذف الحساب */}
              <button 
                onClick={handleDeleteAccount}
                className="w-full flex items-center space-x-3 space-x-reverse p-4 rounded-2xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 transition-all"
              >
                <Trash2 className="w-5 h-5" />
                <span className="font-medium">حذف الحساب</span>
              </button>

              {/* تسجيل خروج */}
              <button 
                onClick={handleLogout}
                className="w-full flex items-center space-x-3 space-x-reverse p-4 rounded-2xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 transition-all"
              >
                <LogOut className="w-5 h-5" />
                <span className="font-medium">تسجيل خروج</span>
              </button>
            </div>
          )}

          {/* تبويب المشتريات */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-2">
                <button 
                  onClick={() => setActiveTab('menu')}
                  className="text-xs text-amber-400 hover:underline flex items-center gap-1"
                >
                  ← العودة للقائمة الرئيسية
                </button>
                <h3 className="font-bold text-slate-200">سجل المشتريات</h3>
              </div>

              {orders.length === 0 ? (
                <div className="text-center py-10 text-slate-400">
                  <Package className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p>ليس لديك أي طلبات سابقة حتى الآن</p>
                </div>
              ) : (
                orders.map((order, index) => (
                  <div key={index} className="p-4 rounded-2xl bg-slate-800/40 border border-slate-700/40 space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <span className="font-semibold text-amber-400">طلب #{order.id.slice(0, 8)}</span>
                      <span className="text-xs text-slate-400">
                        {new Date(order.created_at).toLocaleDateString('ar-SA')} - {new Date(order.created_at).toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-xs text-slate-300 pt-2 border-t border-slate-700/50">
                      <span>الإجمالي: <strong className="text-white">{order.total_amount} ر.س</strong></span>
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                        {order.status || 'مكتمل'}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* تبويب الشعارات */}
          {activeTab === 'notifications' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-2">
                <button 
                  onClick={() => setActiveTab('menu')}
                  className="text-xs text-amber-400 hover:underline flex items-center gap-1"
                >
                  ← العودة للقائمة الرئيسية
                </button>
                <h3 className="font-bold text-slate-200">الإشعارات والعروض</h3>
              </div>

              <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-700/40 space-y-1">
                <div className="flex justify-between items-center">
                  <h4 className="font-semibold text-sm text-amber-400">🎉 وصول منتجات جديدة!</h4>
                  <span className="text-[10px] text-slate-400">اليوم</span>
                </div>
                <p className="text-xs text-slate-300">تم إضافة تشكيلة فاخرة جديدة في المتجر، تفقّدها الان واستفد من العروض الحصرية.</p>
              </div>
            </div>
          )}

          {/* تبويب العنوان */}
          {activeTab === 'address' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-2">
                <button 
                  onClick={() => setActiveTab('menu')}
                  className="text-xs text-amber-400 hover:underline flex items-center gap-1"
                >
                  ← العودة للقائمة الرئيسية
                </button>
                <h3 className="font-bold text-slate-200">عنوان التوصيل</h3>
              </div>

              <form onSubmit={handleUpdateAddress} className="space-y-3">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">المدينة</label>
                  <input 
                    type="text"
                    value={profile?.city || ''}
                    onChange={(e) => setProfile({ ...profile, city: e.target.value })}
                    placeholder="مثال: الرياض"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">العنوان التفصيلي (الحي، الشارع، رقم المنزل)</label>
                  <textarea 
                    value={profile?.address || ''}
                    onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                    placeholder="مثال: حي الياسمين، شارع التخصصي"
                    rows={3}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500 resize-none"
                  />
                </div>
                <button 
                  type="submit"
                  className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl transition-all shadow-lg shadow-amber-500/20 mt-2"
                >
                  حفظ العنوان
                </button>
              </form>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};