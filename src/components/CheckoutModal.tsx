import React, { useState, useEffect } from 'react';
import { X, User, Phone, MapPin, Send, Loader2, CheckCircle2 } from 'lucide-react';
import type { CartItem } from '../types';
import LocationPicker from './LocationPicker';
import { supabase } from '../supabaseClient';
import MediaUploader from './MediaUploader';
interface CheckoutModalProps {
  open: boolean;
  onClose: () => void;
  items: CartItem[];
  totalPrice: number;
  whatsappNumber: string;
  onOrderSent: () => void;
}

export default function CheckoutModal({
  open,
  onClose,
  items,
  totalPrice,
  whatsappNumber,
  onOrderSent,
}: CheckoutModalProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [location, setLocation] = useState<{ lat: number; lng: number; label: string } | null>(null);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; phone?: string; address?: string }>({});
const [paymentMethod, setPaymentMethod] = useState<'cod' | 'bank'>('cod');
const [receiptUrl, setReceiptUrl] = useState('');
const [couponCode, setCouponCode] = useState('');
const [discount, setDiscount] = useState(0); // نسبة الخصم بالـ %
const [couponError, setCouponError] = useState('');
const [couponApplied, setCouponApplied] = useState(false);
const [bankAccounts, setBankAccounts] = useState<any[]>([]);

useEffect(() => {
  fetchBankAccounts();
}, []);

const fetchBankAccounts = async () => {
  const { data } = await supabase.from('bank_accounts').select('*');
  if (data) setBankAccounts(data);
};
 const discountAmount = (totalPrice * discount) / 100;
const shipping = totalPrice > 500 ? 0 : 25;
const finalTotal = totalPrice - discountAmount + shipping;
  const validate = () => {
    const e: typeof errors = {};
    if (!name.trim()) e.name = 'الرجاء إدخال الاسم';
    if (!phone.trim()) e.phone = 'الرجاء إدخال رقم الهاتف';
    else if (!/^[0-9+\s-]{8,}$/.test(phone.trim())) e.phone = 'رقم الهاتف غير صحيح';
    if (!address.trim()) e.address = 'الرجاء إدخال عنوان التوصيل';
    setErrors(e);
    return Object.keys(e).length === 0;
  };


  const handleApplyCoupon = async () => {
    setCouponError('');
    if (!couponCode.trim()) {
      setCouponError('الرجاء إدخال كود الخصم');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('coupons')
        .select('*')
        .ilike('code', couponCode.trim())
        .eq('is_active', true)
        .single();

      if (error || !data) {
        setCouponError('كود الخصم غير صحيح أو منتهي الصلاحية');
        setDiscount(0);
        setCouponApplied(false);
        return;
      }

      setDiscount(data.discount);
      setCouponApplied(true);
    } catch (err) {
      setCouponError('حدث خطأ أثناء التحقق من الكود');
    }
  };

  const buildWhatsAppMessage = () => {
    const lines: string[] = [];
    lines.push('🛒 *طلب جديد من متجر القيضي*');
    lines.push('');
    lines.push(`👤 *اسم العملاء:* ${name.trim()}`);
    lines.push(`📞 *رقم الهاتف:* ${phone.trim()}`);
    lines.push(`📍 *عنوان التوصيل:* ${address.trim()}`);
    
    if (location) {
      lines.push(`🗺️ *الموقع على الخريطة:* ${location.label}`);
      lines.push(`📍 *رابط الموقع:* https://maps.google.com/?q=${location.lat},${location.lng}`);
    }

    lines.push('');
    lines.push('📦 *المنتجات المطلوبة:*');
    items.forEach((item, idx) => {
      lines.push(`${idx + 1}. ${item.product.name} - ${item.quantity} × ${item.product.price} ر.س = ${item.product.price * item.quantity} ر.س`);
    });

   lines.push('');
    lines.push(`💰 المجموع الفرعي: *${totalPrice} ر.س*`);
    if (discount > 0) {
      lines.push(`🏷️ الخصم (${discount}%): *- ${discountAmount} ر.س*`);
    }
    lines.push(`🚚 الشحن: *${shipping === 0 ? 'مجاني' : `${shipping} ر.س`}*`);
    lines.push(`🌟 الإجمالي النهائي: *${finalTotal} ر.س*`);
    lines.push(`💳 *طريقة الدفع:* ${paymentMethod === 'bank' ? 'تحويل بنكي' : 'الدفع عند الاستلام'}`);
    if (paymentMethod === 'bank' && receiptUrl) {
      lines.push(`📄 *رابط صورة الإيصال:* ${receiptUrl}`);
    }
    lines.push('');
    lines.push('🙏 شكراً لطلبكم');
    return lines.join('\n');
  };

  const handleSend = () => {
    if (!validate()) return;
    setSending(true);
    const message = buildWhatsAppMessage();
    const cleanPhone = whatsappNumber.replace(/[^0-9]/g, '');
    const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
    
    window.open(url, '_blank');

    setTimeout(() => {
      setSending(false);
      setSent(true);
      setTimeout(() => {
        onOrderSent();
        setName('');
        setPhone('');
        setAddress('');
        setLocation(null);
        setSent(false);
        setErrors({});
      }, 1500);
    }, 500);
  };

  const handleClose = () => {
    onClose();
    setErrors({});
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-sm animate-fade-in" onClick={handleClose} />

      <div className="relative w-full max-w-lg bg-slate-900 border border-amber-500/20 rounded-2xl shadow-2xl animate-scale-in max-h-[90vh] overflow-y-auto p-6 text-right dir-rtl">
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-amber-500/15 sticky top-0 bg-slate-900 z-10">
          <h2 className="font-bold text-lg text-amber-200">إتمام الطلب</h2>
          <button
            onClick={handleClose}
            className="w-9 h-9 rounded-full hover:bg-slate-800 flex items-center justify-center text-amber-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {sent ? (
          <div className="py-12 flex flex-col items-center gap-4 text-center">
            <CheckCircle2 className="w-16 h-16 text-emerald-400" />
            <h3 className="text-lg font-bold text-amber-200">تم إرسال طلبك بنجاح!</h3>
            <p className="text-sm text-slate-300">سيتم التواصل معك عبر واتساب لتأكيد الطلب</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-slate-800/40 rounded-xl p-4 border border-amber-500/10">
              <h3 className="text-sm font-medium text-amber-200 mb-3">ملخص الطلب</h3>
              <div className="space-y-2">
                {items.map((item) => (
                  <div key={item.product.id} className="flex justify-between text-sm text-slate-300">
                    <span className="line-clamp-1">{item.product.name} × {item.quantity}</span>
                    <span className="text-amber-300 shrink-0 mr-2">{item.product.price * item.quantity} ر.س</span>
                  </div>
                ))}
              </div>
              <div className="pt-2 mt-2 border-t border-amber-500/10 flex justify-between text-sm">
                <span className="text-slate-300">الشحن</span>
                <span className="text-slate-200">{shipping === 0 ? 'مجاني' : `${shipping} ر.س`}</span>
              </div>
              <div className="flex justify-between text-base font-bold pt-1">
                <span className="text-amber-200">الإجمالي</span>
                <span className="text-amber-300">{finalTotal} ر.س</span>
              </div>
            </div>
{/* قسم كود الخصم */}
<div className="mt-3 pt-3 border-t border-amber-500/10">
  <label className="block text-xs font-medium text-slate-300 mb-1.5">
    هل لديك كود خصم؟
  </label>
  <div className="flex gap-2">
    <input
      type="text"
      value={couponCode}
      onChange={(e) => setCouponCode(e.target.value)}
      placeholder="أدخل كود الخصم (مثال: OFF10)"
      disabled={couponApplied}
      className="flex-1 bg-slate-800/60 border border-amber-400/15 rounded-xl px-3 py-2 text-sm text-slate-50 placeholder:text-slate-500 focus:border-amber-400/40 uppercase"
    />
    <button
      type="button"
      onClick={handleApplyCoupon}
      disabled={couponApplied}
      className="bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 px-4 py-2 rounded-xl text-sm font-medium transition-colors border border-amber-500/30 disabled:opacity-50"
    >
      {couponApplied ? 'تم التطبيق ✓' : 'تطبيق'}
    </button>
  </div>
  {couponError && (
    <p className="text-xs text-red-400 mt-1">{couponError}</p>
  )}
  {couponApplied && (
    <p className="text-xs text-emerald-400 mt-1">
      تم تطبيق خصم {discount}% بنجاح! (-{discountAmount} ر.س)
    </p>
  )}
</div>
{/* قسم اختيار طريقة الدفع */}
        <div className="space-y-3 pt-2">
          <label className="block text-sm font-medium text-slate-200">اختر طريقة الدفع</label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setPaymentMethod('cod')}
              className={`p-3 rounded-xl border text-sm font-medium flex items-center justify-center gap-2 transition-all ${
                paymentMethod === 'cod'
                  ? 'bg-amber-500/20 border-amber-400 text-amber-200'
                  : 'bg-slate-800/40 border-slate-700 text-slate-400 hover:bg-slate-800'
              }`}
            >
              الدفع عند الاستلام
            </button>
            <button
              type="button"
              onClick={() => setPaymentMethod('bank')}
              className={`p-3 rounded-xl border text-sm font-medium flex items-center justify-center gap-2 transition-all ${
                paymentMethod === 'bank'
                  ? 'bg-amber-500/20 border-amber-400 text-amber-200'
                  : 'bg-slate-800/40 border-slate-700 text-slate-400 hover:bg-slate-800'
              }`}
            >
              التحويل البنكي
            </button>
          </div>

          {/* تفاصيل الحساب ومربع رفع الإيصال عند اختيار التحويل البنكي */}
          {paymentMethod === 'bank' && (
            <div className="p-4 bg-slate-900/60 rounded-xl border border-amber-500/20 space-y-3 animate-fadeIn">
            <div className="text-xs text-slate-300 space-y-2">
  <p className="font-bold text-amber-300">الرجاء التحويل على أحد الحسابات التالية:</p>
 {bankAccounts.length > 0 ? (
  bankAccounts.map((acc: any) => (
    <div key={acc.id} className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/50 space-y-1">
      <p className="font-bold text-amber-200">اسم البنك: {acc.bank_name}</p>
      <p className="font-mono text-amber-300/90 text-xs">رقم الآيبان (IBAN): {acc.iban}</p>
      <p className="text-slate-300 text-xs">اسم الحساب: {acc.account_holder}</p>
    </div>
  ))
) : (
  <p className="text-slate-400">لا توجد حسابات بنكية مضافة حالياً</p>
)}
</div>   
              <div className="border-t border-slate-700/50 pt-3">
                <label className="block text-xs text-amber-200 mb-1.5 font-medium">أرفق صورة سند التحويل / الإيصال</label>
                <MediaUploader
                  value={receiptUrl}
                  onChange={(url: string) => setReceiptUrl(url)}
                  bucket="receipts"
                />
              </div>
            </div>
          )}
        </div>
            <div>
              <label className="text-sm text-slate-200 mb-1.5 flex items-center gap-1.5">
                <User className="w-4 h-4 text-amber-400" />
                اسم العميل
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="أدخل اسمك الكامل"
                className={`w-full bg-slate-800/60 border rounded-xl px-4 py-2.5 text-sm text-slate-50 placeholder:text-slate-500 focus:outline-none ${
                  errors.name ? 'border-red-500/50' : 'border-amber-400/15 focus:border-amber-400/40'
                }`}
              />
              {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="text-sm text-slate-200 mb-1.5 flex items-center gap-1.5">
                <Phone className="w-4 h-4 text-amber-400" />
                رقم الهاتف
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="مثال: 777123456"
                dir="ltr"
                className={`w-full bg-slate-800/60 border rounded-xl px-4 py-2.5 text-sm text-slate-50 placeholder:text-slate-500 focus:outline-none ${
                  errors.phone ? 'border-red-500/50' : 'border-amber-400/15 focus:border-amber-400/40'
                }`}
              />
              {errors.phone && <p className="text-xs text-red-400 mt-1">{errors.phone}</p>}
            </div>

            <div>
              <label className="text-sm text-slate-200 mb-1.5 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-amber-400" />
                عنوان التوصيل
              </label>
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="المدينة، الحي، الشارع، تفاصيل المنزل..."
                rows={2}
                className={`w-full bg-slate-800/60 border rounded-xl px-4 py-2.5 text-sm text-slate-50 placeholder:text-slate-500 focus:outline-none resize-none ${
                  errors.address ? 'border-red-500/50' : 'border-amber-400/15 focus:border-amber-400/40'
                }`}
              />
              {errors.address && <p className="text-xs text-red-400 mt-1">{errors.address}</p>}
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-slate-300 mb-2">
                حدد موقع التوصيل على الخريطة (اختياري)📍
              </label>
              <LocationPicker
                onSelectLocation={(lat, lng) => {
                  setLocation({
                    lat,
                    lng,
                    label: `${lat.toFixed(6)}, ${lng.toFixed(6)}`,
                  });
                }}
              />
            </div>

            <button
              onClick={handleSend}
              disabled={sending}
              className="w-full mt-4 flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-emerald-500 to-emerald-700 text-white font-bold rounded-xl hover:from-emerald-600 hover:to-emerald-800 transition-all shadow-lg text-sm"
            >
              {sending ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  جاري الإرسال...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  إرسال الطلب عبر الواتساب
                </>
              )}
            </button>
            <p className="text-xs text-slate-400 text-center">
              سيتم تحويلك إلى الواتساب لنقل تفاصيل الطلب برقم {whatsappNumber}
            </p>
          </div>
        )}
      </div>
    </div>
  );
 
  }
