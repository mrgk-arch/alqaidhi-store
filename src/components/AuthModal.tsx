import React, { useState } from 'react';
import { X, Mail, Lock, User, LogIn, UserPlus, Loader2 } from 'lucide-react';
import { supabase } from '../supabaseClient';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      if (isLogin) {
        // تسجيل الدخول
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
      } else {
        // إنشاء حساب جديد
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
            },
          },
        });
        if (error) throw error;
      }

      if (onSuccess) onSuccess();
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'حدث خطأ أثناء العملية، يرجى المحاولة لاحقاً');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl text-right overflow-hidden">
        {/* زر الإغلاق */}
        <button
          onClick={onClose}
          className="absolute top-5 left-5 p-2 text-slate-400 hover:text-white rounded-full bg-slate-800/50 hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* عنوان وتصميم التبويب */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-amber-300 mb-2">
            {isLogin ? 'مرحباً بعودتك! 👋' : 'إنشاء حساب جديد ✨'}
          </h2>
          <p className="text-sm text-slate-400">
            {isLogin
              ? 'سجل دخولك لمتابعة طلباتك والاستفادة من عروضنا'
              : 'انضم إلينا واستمتع بتجربة تسوق فريدة وسريعة'}
          </p>
        </div>

        {/* أزرار التنقل بين التسجيل والدخول */}
        <div className="flex bg-slate-800/70 p-1 rounded-2xl mb-6 border border-slate-700/50">
          <button
            type="button"
            onClick={() => { setIsLogin(true); setErrorMsg(''); }}
            className={`flex-1 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 flex items-center justify-center gap-2 ${
              isLogin
                ? 'bg-amber-400 text-slate-950 font-bold shadow-lg'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <LogIn className="w-4 h-4" />
            تسجيل الدخول
          </button>
          <button
            type="button"
            onClick={() => { setIsLogin(false); setErrorMsg(''); }}
            className={`flex-1 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 flex items-center justify-center gap-2 ${
              !isLogin
                ? 'bg-amber-400 text-slate-950 font-bold shadow-lg'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            حساب جديد
          </button>
        </div>

        {/* رسالة الخطأ إن وجدت */}
        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs text-center">
            {errorMsg}
          </div>
        )}

        {/* النموذج */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">الاسم الكامل</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="أدخل اسمك الكامل"
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-xl py-3 pr-10 pl-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition-colors"
                />
                <User className="w-4 h-4 text-slate-400 absolute right-3.5 top-3.5" />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">البريد الإلكتروني</label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full bg-slate-800/50 border border-slate-700 rounded-xl py-3 pr-10 pl-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition-colors dir-ltr text-right"
              />
              <Mail className="w-4 h-4 text-slate-400 absolute right-3.5 top-3.5" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">كلمة المرور</label>
            <div className="relative">
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-800/50 border border-slate-700 rounded-xl py-3 pr-10 pl-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition-colors"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute right-3.5 top-3.5" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-bold rounded-xl transition-all shadow-lg hover:shadow-amber-500/20 flex items-center justify-center gap-2"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : isLogin ? (
              'دخول'
            ) : (
              'إنشاء الحساب'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}