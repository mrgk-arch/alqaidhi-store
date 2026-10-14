import { useState } from 'react';
import { X, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';
import type { CartItem } from '../types';
import CheckoutModal from './CheckoutModal';

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
  items: CartItem[];
  totalPrice: number;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  whatsappNumber: string;
}

export default function CartDrawer({
  open,
  onClose,
  items,
  totalPrice,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  whatsappNumber,
}: CartDrawerProps) {
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const shipping = totalPrice > 500 ? 0 : 25;
  const finalTotal = totalPrice + shipping;

  return (
    <>
      <div
        className={`fixed inset-0 bg-ink-950/85 backdrop-blur-md z-[60] transition-opacity duration-300 ${
          open ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      <aside
        className={`fixed top-0 left-0 h-full w-full max-w-md bg-ink-800 z-[70] shadow-2xl flex flex-col transition-transform duration-400 ease-out border-l border-gold-400/15 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-gold-400/15 bg-gradient-to-l from-gold-400/5 to-transparent">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl gold-gradient-soft border border-gold-400/20 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5 text-gold-300" />
            </div>
            <div>
              <h2 className="font-serif text-lg font-bold text-gold-200">سلة التسوق</h2>
              <span className="text-xs text-ink-400">{items.length} منتج</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full hover:bg-ink-700 flex items-center justify-center text-gold-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-3 text-center">
              <div className="w-24 h-24 rounded-full bg-ink-700/40 flex items-center justify-center border border-gold-400/10">
                <ShoppingBag className="w-12 h-12 text-ink-500" />
              </div>
              <p className="text-ink-200 text-lg font-medium">سلتك فارغة</p>
              <p className="text-ink-400 text-sm">أضف منتجات لتبدأ التسوق</p>
              <button
                onClick={onClose}
                className="mt-3 px-7 py-2.5 gold-gradient text-ink-900 font-bold rounded-full text-sm hover:scale-105 hover:shadow-lg hover:shadow-gold-500/30 transition-all"
              >
                تصفح المنتجات
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {items.map((item) => (
                <div
                  key={item.product.id}
                  className="flex gap-3 luxury-card rounded-xl p-3 border border-gold-400/10 animate-slide-in-right hover:border-gold-400/20 transition-colors"
                >
                  <img
                    src={item.product.image_url || ''}
                    alt={item.product.name}
                    className="w-20 h-20 rounded-lg object-cover shrink-0 bg-ink-700 ring-1 ring-gold-400/10"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-ink-50 line-clamp-1">{item.product.name}</h3>
                    <p className="text-sm text-gold-300 font-bold mt-0.5">{item.product.price} ر.س</p>

                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-1.5 bg-ink-800 rounded-full p-1 border border-gold-400/10">
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                          className="w-7 h-7 rounded-full hover:bg-gold-400/15 flex items-center justify-center text-gold-200 transition-colors"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-sm font-medium text-ink-50 w-6 text-center">{item.quantity}</span>
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                          className="w-7 h-7 rounded-full hover:bg-gold-400/15 flex items-center justify-center text-gold-200 transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <button
                        onClick={() => onRemoveItem(item.product.id)}
                        className="w-8 h-8 rounded-full hover:bg-red-900/30 flex items-center justify-center text-ink-400 hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              <button
                onClick={onClearCart}
                className="w-full text-center text-sm text-ink-400 hover:text-red-400 transition-colors py-2"
              >
                إفراغ السلة
              </button>
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-gold-400/15 px-5 py-4 space-y-3 bg-ink-800">
            <div className="flex justify-between text-sm text-ink-300">
              <span>المجموع الفرعي</span>
              <span className="text-ink-100">{totalPrice} ر.س</span>
            </div>
            <div className="flex justify-between text-sm text-ink-300">
              <span>الشحن</span>
              <span className={shipping === 0 ? 'text-emerald-400 font-medium' : 'text-ink-100'}>
                {shipping === 0 ? 'مجاني' : `${shipping} ر.س`}
              </span>
            </div>
            {shipping === 0 && (
              <p className="text-xs text-emerald-400 text-center bg-emerald-900/20 rounded-lg py-1.5 border border-emerald-600/20">
                حصلت على الشحن المجاني!
              </p>
            )}
            {shipping > 0 && (
              <p className="text-xs text-gold-300/60 text-center bg-gold-400/5 rounded-lg py-1.5 border border-gold-400/10">
                أضف {500 - totalPrice} ر.س للحصول على شحن مجاني
              </p>
            )}
            <div className="flex justify-between text-base font-bold pt-2 border-t border-gold-400/10">
              <span className="text-gold-200">الإجمالي</span>
              <span className="text-gold-300 text-lg">{finalTotal} ر.س</span>
            </div>
            <button
              onClick={() => setCheckoutOpen(true)}
              className="w-full py-3.5 gold-gradient text-ink-900 font-bold rounded-full hover:scale-[1.02] hover:shadow-2xl hover:shadow-gold-500/40 transition-all"
            >
              إتمام الشراء
            </button>
          </div>
        )}
      </aside>

      <CheckoutModal
        open={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        items={items}
        totalPrice={totalPrice}
        whatsappNumber={whatsappNumber}
        onOrderSent={() => {
          setCheckoutOpen(false);
          onClearCart();
          onClose();
        }}
      />
    </>
  );
}
