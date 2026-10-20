import React, { useState } from 'react';
import { X, Mail, Lock, User, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { supabase } from '../supabaseClient';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: fullName }
          }
        });
        if (error) throw error;
        onSuccess();
        onClose();
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        if (error) throw error;
        onSuccess();
        onClose();
      }
    } catch (err: any) {
      if (err.message.includes('Invalid login credentials')) {
        setErrorMsg('بيانات الدخول غير صحيحة، أو أن الحساب غير موجود.');
      } else {
        setErrorMsg(err.message || 'حدث خطأ أثناء العملية');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl bg-slate-900/90 border border-amber-500/20 p-8 shadow-2xl backdrop-blur-xl text-right">
        
        {/* زر الإغلاق */}
        <button
          onClick={onClose}
          className="absolute left-5 top-5 p-2 rounded-full bg-slate-800/60 text-slate-400 hover:text-white hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* الهيدر والعنوان */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 mb-3 shadow-inner">
            <User className="w-7 h-7" />
          </div>
          <h3 className="text-2xl font-bold text-slate-100 font-serif">
            {isSignUp ? 'إنشاء حساب جديد' : 'مرحباً بعودتك'}
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            {isSignUp ? 'أنشئ حسابك للاستمتاع بتجربة تسوق فريدة' : 'سجل دخولك لمتابعة طلباتك ومشترياتك'}
          </p>
        </div>

        {/* التبديل بين تسجيل الدخول وإنشاء حساب */}
        <div className="grid grid-cols-2 gap-1 p-1 bg-slate-800/70 rounded-2xl mb-6 border border-slate-700/50">
          <button
            type="button"
            onClick={() => { setIsSignUp(false); setErrorMsg(''); }}
            className={`py-2.5 text-xs font-semibold rounded-xl transition-all duration-300 ${
              !isSignUp ? 'bg-amber-500 text-slate-950 shadow-lg' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            تسجيل الدخول
          </button>
          <button
            type="button"
            onClick={() => { setIsSignUp(true); setErrorMsg(''); }}
            className={`py-2.5 text-xs font-semibold rounded-xl transition-all duration-300 ${
              isSignUp ? 'bg-amber-500 text-slate-950 shadow-lg' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            حساب جديد
          </button>
        </div>

        {/* رسالة الخطأ المترجمة والمصممة بأناقة */}
        {errorMsg && (
          <div className="mb-5 p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs text-center font-medium animate-shake">
            {errorMsg}
          </div>
        )}

        {/* النموذج */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <div>
              <label className="block text-[11px] font-medium text-slate-300 mb-1.5">الاسم الكامل</label>
              <div className="relative">
                <User className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="أدخل اسمك الكريم"
                  className="w-full pr-10 pl-4 py-3 bg-slate-800/50 border border-slate-700/60 rounded-2xl text-slate-100 text-xs focus:outline-none focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/60 transition"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-[11px] font-medium text-slate-300 mb-1.5">البريد الإلكتروني</label>
            <div className="relative">
              <Mail className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pr-10 pl-4 py-3 bg-slate-800/50 border border-slate-700/60 rounded-2xl text-slate-100 text-xs focus:outline-none focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/60 transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-300 mb-1.5">كلمة المرور</label>
            <div className="relative">
              <Lock className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pr-10 pl-4 py-3 bg-slate-800/50 border border-slate-700/60 rounded-2xl text-slate-100 text-xs focus:outline-none focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/60 transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 mt-2 bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 font-bold rounded-2xl text-xs hover:brightness-110 active:scale-[0.99] transition shadow-lg shadow-amber-500/10 disabled:opacity-50"
          >
            {loading ? 'جاري التحقق...' : isSignUp ? 'إنشاء الحساب' : 'دخول'}
          </button>
        </form>
      </div>
    </div>
  );
};