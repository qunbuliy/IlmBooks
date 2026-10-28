import React from 'react';
import { X, Trash2, Plus, Minus, ArrowRight, MessageCircle, ShieldCheck, Sparkles, BookOpen } from 'lucide-react';
import { useCart } from '../context/CartContext.tsx';
import { NIGERIAN_STATES_SHIPPING } from '../data/initialData.ts';

interface CartDrawerProps {
  onProceedToCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ onProceedToCheckout }) => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    subtotal,
    shippingFee,
    total,
    selectedState,
    setSelectedState,
    hasPhysicalItems,
    clearCart,
  } = useCart();

  if (!isCartOpen) return null;

  const handleWhatsAppOrder = () => {
    const itemsList = cart
      .map(
        (item, idx) =>
          `${idx + 1}. ${item.book.titleEn} (${item.selectedFormat}) x ${item.quantity} = ₦${(
            item.book.price * item.quantity
          ).toLocaleString()}`
      )
      .join('%0A');

    const message = `Assalamu Alaykum IlmBooks,%0A%0AI would like to place an order:%0A${itemsList}%0A%0ASubtotal: ₦${subtotal.toLocaleString()}%0AShipping Destination: ${selectedState} State (₦${shippingFee.toLocaleString()})%0ATotal Amount: ₦${total.toLocaleString()}%0A%0APlease confirm stock availability and payment instructions.`;
    window.open(`https://wa.me/2348032418892?text=${message}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-stone-950/60 backdrop-blur-xs transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FAF7F2] text-stone-900 shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-5 bg-[#064E3B] text-white flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-2">
              <span className="font-['Amiri'] text-2xl text-amber-400 font-bold">سلّة الكتب</span>
              <h2 className="text-lg font-bold">Shopping Cart</h2>
              <span className="text-xs bg-emerald-800 text-amber-300 font-mono px-2 py-0.5 rounded-full">
                {cart.length} {cart.length === 1 ? 'item' : 'items'}
              </span>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1 rounded-lg text-emerald-200 hover:text-white hover:bg-emerald-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-stone-500">
                <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-800 mb-4">
                  <BookOpen className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-stone-800 text-lg mb-1">Your cart is empty</h3>
                <p className="text-xs text-stone-500 max-w-xs mb-6">
                  Browse our curated collection of authentic Arabic literature, Maliki jurisprudence, and school texts.
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-[#064E3B] text-white font-medium text-sm hover:bg-emerald-800 transition-all shadow-md shadow-emerald-950/20"
                >
                  Explore Bookstore
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={`${item.book.id}-${item.selectedFormat}`}
                  className="flex gap-3 p-3 bg-white rounded-xl border border-stone-200 shadow-xs hover:border-emerald-300 transition-colors"
                >
                  <img
                    src={item.book.coverUrl}
                    alt={item.book.titleEn}
                    className="w-16 h-22 object-cover rounded-lg shadow-inner shrink-0 bg-stone-100"
                  />
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-1">
                        <h4 className="font-semibold text-xs text-stone-900 leading-snug line-clamp-2">
                          {item.book.titleEn}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.book.id, item.selectedFormat)}
                          className="text-stone-400 hover:text-rose-600 transition-colors p-1"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      {item.book.titleAr && (
                        <p className="font-['Amiri'] text-xs text-emerald-800 font-bold truncate text-right dir-rtl mt-0.5">
                          {item.book.titleAr}
                        </p>
                      )}
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-stone-100 text-stone-600 border border-stone-200">
                          {item.selectedFormat}
                        </span>
                        <span className="text-xs font-bold text-emerald-900">
                          ₦{(item.book.price * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-stone-100">
                      <div className="flex items-center border border-stone-200 rounded-lg overflow-hidden bg-stone-50">
                        <button
                          onClick={() =>
                            updateQuantity(item.book.id, item.selectedFormat, item.quantity - 1)
                          }
                          className="p-1 hover:bg-stone-200 text-stone-700"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-semibold text-stone-900 font-mono">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.book.id, item.selectedFormat, item.quantity + 1)
                          }
                          className="p-1 hover:bg-stone-200 text-stone-700"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <span className="text-[11px] text-stone-500 font-mono">
                        @ ₦{item.book.price.toLocaleString()} ea
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Calculations */}
          {cart.length > 0 && (
            <div className="p-5 bg-white border-t border-stone-200 space-y-4 shadow-lg">
              {/* Delivery State Selector */}
              {hasPhysicalItems && (
                <div className="bg-stone-50 p-3 rounded-xl border border-stone-200 text-xs">
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="font-semibold text-stone-700">Delivery State:</span>
                    <span className="text-[11px] text-emerald-700 font-medium">
                      South-West & Nationwide
                    </span>
                  </div>
                  <select
                    value={selectedState}
                    onChange={(e) => setSelectedState(e.target.value)}
                    className="w-full bg-white border border-stone-300 rounded-lg p-2 text-xs font-medium focus:ring-1 focus:ring-emerald-700 focus:outline-none"
                  >
                    {NIGERIAN_STATES_SHIPPING.map((s) => (
                      <option key={s.state} value={s.state}>
                        {s.state} (₦{s.fee.toLocaleString()} - {s.estimatedDays})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-stone-600">
                  <span>Subtotal:</span>
                  <span className="font-semibold text-stone-900 font-mono">
                    ₦{subtotal.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>Estimated Shipping ({selectedState}):</span>
                  <span className="font-semibold text-stone-900 font-mono">
                    {shippingFee === 0 ? 'FREE (Digital)' : `₦${shippingFee.toLocaleString()}`}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-bold text-stone-900 pt-2 border-t border-stone-200">
                  <span>Total Amount:</span>
                  <span className="text-emerald-900 font-mono text-base">
                    ₦{total.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-1">
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    onProceedToCheckout();
                  }}
                  className="w-full py-3 px-4 rounded-xl bg-[#064E3B] text-amber-300 hover:text-white hover:bg-emerald-900 font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md shadow-emerald-950/20 active:scale-[0.99]"
                >
                  <span>Proceed to Paystack Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={handleWhatsAppOrder}
                  className="w-full py-2.5 px-4 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 hover:bg-emerald-100 font-semibold text-xs flex items-center justify-center gap-2 transition-colors"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-600" />
                  <span>Order via WhatsApp Direct</span>
                </button>
              </div>

              <div className="flex items-center justify-center gap-2 text-[11px] text-stone-500 pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Verified SSL & Paystack Escrow Protection</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
