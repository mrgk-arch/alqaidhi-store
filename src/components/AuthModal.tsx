import React, { useState } from 'react';
import { X, Mail, Lock, User, Sparkles, ArrowLeft } from 'lucide-react';
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
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name: fullName } }
        });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
      onSuccess();
      onClose();
    } catch (err: any) {
      if (err.message.includes('Invalid login credentials')) {
        setErrorMsg('البريد الإلكتروني أو كلمة المرور غير صحيحة');
      } else {
        setErrorMsg(err.message || 'حدث خطأ، يرجى المحاولة لاحقاً');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-fade-in">
      <div className="relative w-full max-w-sm rounded-[32px] bg-slate-900/95 border border-amber-500/30 p-7 shadow-2xl text-right text-slate-100">
        
        <button
          onClick={onClose}
          className="absolute left-5 top-5 p-2 rounded-full bg-slate-800/50 hover:bg-slate-800 text-slate-400 hover:text-amber-400 transition"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 mb-3">
            <Sparkles className="w-6 h-6 animate-pulse" />
          </div>
          <h3 className="text-xl font-bold font-serif text-amber-300">
            {isSignUp ? 'حساب جديد' : 'مرحباً بك'}
          </h3>
          <p className="text-[11px] text-slate-400 mt-1">
            {isSignUp ? 'أنشئ حسابك للاستمتاع بتجربة تسوق فريدة' : 'سجل دخولك لمتابعة مشترياتك وطلباتك'}
          </p>
        </div>

        <div className="flex p-1 bg-slate-800/50 rounded-2xl mb-5 border border-slate-700/50">
          <button
            type="button"
            onClick={() => { setIsSignUp(false); setErrorMsg(''); }}
            className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all ${
              !isSignUp ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400'
            }`}
          >
            تسجيل الدخول
          </button>
          <button
            type="button"
            onClick={() => { setIsSignUp(true); setErrorMsg(''); }}
            className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all ${
              isSignUp ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400'
            }`}
          >
            حساب جديد
          </button>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[11px] text-center font-medium">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          {isSignUp && (
            <div className="relative">
              <User className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-500/60" />
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="الاسم الكامل"
                className="w-full pr-10 pl-4 py-3 bg-slate-800/40 border border-slate-700/60 rounded-xl text-slate-100 text-xs focus:border-amber-500 transition outline-none placeholder:text-slate-500"
              />
            </div>
          )}

          <div className="relative">
            <Mail className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-500/60" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="البريد الإلكتروني"
              className="w-full pr-10 pl-4 py-3 bg-slate-800/40 border border-slate-700/60 rounded-xl text-slate-100 text-xs focus:border-amber-500 transition outline-none placeholder:text-slate-500"
            />
          </div>

          <div className="relative">
            <Lock className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-500/60" />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="كلمة المرور"
              className="w-full pr-10 pl-4 py-3 bg-slate-800/40 border border-slate-700/60 rounded-xl text-slate-100 text-xs focus:border-amber-500 transition outline-none placeholder:text-slate-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 mt-2 bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 font-bold rounded-xl text-xs hover:brightness-110 transition shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2"
          >
            {loading ? 'جاري التحقق...' : isSignUp ? 'إنشاء الحساب' : 'دخول'}
            <ArrowLeft className="w-4 h-4" />
          </button>
        </form>

      </div>
    </div>
  );
};

export default AuthModal;