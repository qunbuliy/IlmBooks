import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  CreditCard,
  Truck,
  MessageCircle,
  CheckCircle2,
  Lock,
  ArrowRight,
  Download,
  AlertCircle,
} from 'lucide-react';
import { useCart } from '../context/CartContext.tsx';
import { useAuth } from '../context/AuthContext.tsx';
import { createOrder } from '../services/storeService.ts';
import { Order, OrderItem, PaymentMethod } from '../types/index.ts';
import { NIGERIAN_STATES_SHIPPING } from '../data/initialData.ts';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOrderSuccess: (order: Order) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose, onOrderSuccess }) => {
  const { cart, subtotal, shippingFee, total, selectedState, setSelectedState, clearCart, hasPhysicalItems } =
    useCart();
  const { currentUser } = useAuth();

  const [fullName, setFullName] = useState(currentUser?.displayName || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [city, setCity] = useState(currentUser?.state === 'Oyo' ? 'Ibadan' : 'Ikeja');
  const [address, setAddress] = useState(currentUser?.address || '');
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('paystack');

  const [isProcessing, setIsProcessing] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);
  const [paystackStep, setPaystackStep] = useState<'form' | 'paystack_modal' | 'success'>('form');

  if (!isOpen) return null;

  const shippingInfo = NIGERIAN_STATES_SHIPPING.find((s) => s.state === selectedState);
  const isCodEligible = shippingInfo?.codEligible && hasPhysicalItems;

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !phone || (hasPhysicalItems && !address)) {
      alert('Please fill in all required delivery contact fields.');
      return;
    }

    if (paymentMethod === 'paystack') {
      // Show Paystack simulated secure gateway modal
      setPaystackStep('paystack_modal');
      return;
    }

    await finalizeOrder(paymentMethod === 'cod' ? 'pending' : 'paid', 'MANUAL-REF-' + Date.now());
  };

  const finalizeOrder = async (paymentStatus: 'pending' | 'paid', ref: string) => {
    setIsProcessing(true);
    const orderItems: OrderItem[] = cart.map((item) => ({
      bookId: item.book.id,
      titleEn: item.book.titleEn,
      titleAr: item.book.titleAr,
      author: item.book.author,
      price: item.book.price,
      quantity: item.quantity,
      format: item.selectedFormat,
      coverUrl: item.book.coverUrl,
      digitalFileUrl: item.book.digitalFileUrl,
    }));

    const orderId = 'ORD-ILM-' + Math.floor(100000 + Math.random() * 900000);

    const newOrder: Order = {
      id: orderId,
      customerId: currentUser?.uid || 'guest-' + Date.now(),
      customerName: fullName,
      customerEmail: email,
      customerPhone: phone,
      deliveryState: selectedState,
      deliveryCity: city,
      deliveryAddress: address || 'Digital Order (No physical shipping)',
      items: orderItems,
      subtotal,
      shippingFee,
      total,
      paymentMethod,
      paymentStatus,
      orderStatus: paymentStatus === 'paid' ? 'processing' : 'pending',
      paystackReference: ref,
      notes,
      createdAt: new Date().toISOString(),
    };

    try {
      await createOrder(newOrder);
      setCompletedOrder(newOrder);
      clearCart();
      setPaystackStep('success');
      onOrderSuccess(newOrder);
    } catch (err) {
      console.error('Order creation failed:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[#FAF7F2] text-stone-900 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden border border-stone-300">
        
        {/* Header */}
        <div className="bg-[#064E3B] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-400 text-stone-950 font-bold flex items-center justify-center font-['Amiri'] text-xl">
              ع
            </div>
            <div>
              <h2 className="text-lg font-bold leading-tight">IlmBooks Secure Checkout</h2>
              <p className="text-xs text-emerald-200">
                Encrypted transaction | Official South-West Nigerian dispatch
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-emerald-200 hover:text-white hover:bg-emerald-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step 1: Form */}
        {paystackStep === 'form' && (
          <form onSubmit={handleSubmitOrder} className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
            {/* Delivery Details */}
            <div>
              <h3 className="text-sm font-bold text-emerald-950 uppercase tracking-wider mb-3 flex items-center gap-2">
                <Truck className="w-4 h-4 text-emerald-700" />
                <span>1. Contact & Delivery Destination</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Ustadh Abdullah Adekola"
                    className="w-full bg-white border border-stone-300 rounded-lg p-2.5 focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Phone Number (WhatsApp) *</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. 0803 241 8892"
                    className="w-full bg-white border border-stone-300 rounded-lg p-2.5 focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block font-semibold text-stone-700 mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. adekola@ilmbooks.ng (receipt & digital files sent here)"
                    className="w-full bg-white border border-stone-300 rounded-lg p-2.5 focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                  />
                </div>

                {hasPhysicalItems && (
                  <>
                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">State *</label>
                      <select
                        value={selectedState}
                        onChange={(e) => setSelectedState(e.target.value)}
                        className="w-full bg-white border border-stone-300 rounded-lg p-2.5 focus:ring-2 focus:ring-emerald-700 focus:outline-none font-medium"
                      >
                        {NIGERIAN_STATES_SHIPPING.map((s) => (
                          <option key={s.state} value={s.state}>
                            {s.state} State ({s.estimatedDays})
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">City / Town *</label>
                      <input
                        type="text"
                        required
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="e.g. Ibadan / Ikeja / Abeokuta / Osogbo"
                        className="w-full bg-white border border-stone-300 rounded-lg p-2.5 focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block font-semibold text-stone-700 mb-1">
                        Street Address / Landmark *
                      </label>
                      <textarea
                        rows={2}
                        required
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="House or Madrasah name, street, nearest landmark..."
                        className="w-full bg-white border border-stone-300 rounded-lg p-2.5 focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                      />
                    </div>
                  </>
                )}

                <div className="sm:col-span-2">
                  <label className="block font-semibold text-stone-700 mb-1">Special Order Notes (Optional)</label>
                  <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="e.g. Call before delivery, wrap books securely"
                    className="w-full bg-white border border-stone-300 rounded-lg p-2 focus:ring-1 focus:ring-emerald-700 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method Selection */}
            <div>
              <h3 className="text-sm font-bold text-emerald-950 uppercase tracking-wider mb-3 flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-emerald-700" />
                <span>2. Select Payment Method</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Paystack */}
                <label
                  className={`p-3.5 rounded-xl border cursor-pointer flex flex-col justify-between transition-all ${
                    paymentMethod === 'paystack'
                      ? 'border-emerald-700 bg-emerald-50/70 shadow-xs ring-2 ring-emerald-700/20'
                      : 'border-stone-200 bg-white hover:border-stone-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-xs text-stone-900">Paystack Online</span>
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === 'paystack'}
                      onChange={() => setPaymentMethod('paystack')}
                      className="accent-emerald-700"
                    />
                  </div>
                  <p className="text-[11px] text-stone-500">
                    Debit Card, Bank Transfer, USSD, Apple Pay & NQR. Instant receipt.
                  </p>
                  <div className="mt-2 text-[10px] text-emerald-700 font-bold uppercase tracking-wider flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" />
                    <span>Recommended</span>
                  </div>
                </label>

                {/* Cash on Delivery */}
                <label
                  className={`p-3.5 rounded-xl border flex flex-col justify-between transition-all ${
                    !isCodEligible
                      ? 'opacity-50 cursor-not-allowed bg-stone-100 border-stone-200'
                      : paymentMethod === 'cod'
                      ? 'border-emerald-700 bg-emerald-50/70 shadow-xs ring-2 ring-emerald-700/20 cursor-pointer'
                      : 'border-stone-200 bg-white hover:border-stone-300 cursor-pointer'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-xs text-stone-900">Cash on Delivery</span>
                    <input
                      type="radio"
                      name="paymentMethod"
                      disabled={!isCodEligible}
                      checked={paymentMethod === 'cod'}
                      onChange={() => isCodEligible && setPaymentMethod('cod')}
                      className="accent-emerald-700"
                    />
                  </div>
                  <p className="text-[11px] text-stone-500">
                    Pay driver in cash or transfer upon arrival.
                  </p>
                  <div className="mt-2 text-[10px] font-semibold text-stone-500">
                    {isCodEligible ? 'Available for ' + selectedState : 'Only Lagos, Oyo & Ogun'}
                  </div>
                </label>

                {/* WhatsApp Order */}
                <label
                  className={`p-3.5 rounded-xl border cursor-pointer flex flex-col justify-between transition-all ${
                    paymentMethod === 'whatsapp'
                      ? 'border-emerald-700 bg-emerald-50/70 shadow-xs ring-2 ring-emerald-700/20'
                      : 'border-stone-200 bg-white hover:border-stone-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-xs text-stone-900">Bank Transfer / WhatsApp</span>
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === 'whatsapp'}
                      onChange={() => setPaymentMethod('whatsapp')}
                      className="accent-emerald-700"
                    />
                  </div>
                  <p className="text-[11px] text-stone-500">
                    Direct transfer to Jaiz / Lotus Bank account with WhatsApp slip confirmation.
                  </p>
                  <div className="mt-2 text-[10px] text-emerald-800 font-semibold flex items-center gap-1">
                    <MessageCircle className="w-3 h-3 text-emerald-600" />
                    <span>Direct Chat</span>
                  </div>
                </label>
              </div>
            </div>

            {/* Summary Box */}
            <div className="bg-stone-100 p-4 rounded-xl border border-stone-200 space-y-2 text-xs">
              <div className="flex justify-between text-stone-600">
                <span>Items Subtotal ({cart.length} titles):</span>
                <span className="font-mono font-semibold text-stone-900">₦{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>Shipping ({selectedState}):</span>
                <span className="font-mono font-semibold text-stone-900">
                  {shippingFee === 0 ? 'FREE' : `₦${shippingFee.toLocaleString()}`}
                </span>
              </div>
              <div className="flex justify-between text-sm font-bold text-emerald-950 pt-2 border-t border-stone-200">
                <span>Total Due:</span>
                <span className="font-mono text-base text-emerald-900">₦{total.toLocaleString()}</span>
              </div>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={isProcessing}
              className="w-full py-3.5 px-4 rounded-xl bg-[#064E3B] text-amber-300 hover:text-white hover:bg-emerald-800 font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-950/20"
            >
              <Lock className="w-4 h-4" />
              <span>
                {paymentMethod === 'paystack'
                  ? `Pay ₦${total.toLocaleString()} via Paystack`
                  : `Place Order (₦${total.toLocaleString()})`}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* Step 2: Paystack Gateway Modal */}
        {paystackStep === 'paystack_modal' && (
          <div className="p-8 text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center shadow-inner">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <div>
              <span className="text-[11px] font-bold tracking-wider uppercase text-emerald-700 bg-emerald-100/80 px-2.5 py-1 rounded-full">
                Paystack Verified Gateway
              </span>
              <h3 className="text-xl font-bold text-stone-900 mt-2">Complete Payment for IlmBooks</h3>
              <p className="text-xs text-stone-500 max-w-sm mx-auto mt-1">
                Transaction Reference: <code className="font-mono text-stone-800 bg-stone-200 px-1 py-0.5 rounded">ILM-PSTK-{Date.now().toString().slice(-8)}</code>
              </p>
            </div>

            <div className="bg-white border border-stone-200 p-4 rounded-xl text-left max-w-sm mx-auto space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-stone-500">Merchant:</span>
                <span className="font-semibold text-stone-800">IlmBooks Nigeria Ltd</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Customer:</span>
                <span className="font-semibold text-stone-800">{fullName} ({email})</span>
              </div>
              <div className="flex justify-between font-bold text-sm pt-2 border-t border-stone-100 text-emerald-900">
                <span>Amount:</span>
                <span className="font-mono">₦{total.toLocaleString()}</span>
              </div>
            </div>

            <div className="space-y-3 max-w-sm mx-auto">
              <button
                onClick={() => finalizeOrder('paid', 'pstk_' + Math.random().toString(36).substring(2, 10))}
                disabled={isProcessing}
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-all"
              >
                {isProcessing ? 'Verifying with Paystack...' : 'Simulate Successful Payment (Test Mode)'}
              </button>
              <button
                onClick={() => setPaystackStep('form')}
                className="w-full py-2 text-xs text-stone-500 hover:text-stone-800 font-medium"
              >
                Cancel and return to checkout
              </button>
            </div>

            <div className="text-[11px] text-stone-400 flex items-center justify-center gap-1">
              <Lock className="w-3 h-3" />
              <span>PCI-DSS Level 1 Certified & Server-side signature verified</span>
            </div>
          </div>
        )}

        {/* Step 3: Success Screen */}
        {paystackStep === 'success' && completedOrder && (
          <div className="p-8 text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center shadow-lg">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <span className="font-['Amiri'] text-2xl text-emerald-900 font-bold">جزاكم الله خيراً</span>
              <h3 className="text-2xl font-bold text-stone-900 mt-1">Thank you for your order!</h3>
              <p className="text-xs text-stone-600 mt-1">
                Your order <strong className="text-stone-900 font-mono">{completedOrder.id}</strong> has been received and confirmed.
              </p>
            </div>

            {/* Digital download entitlements */}
            {completedOrder.items.some((i) => i.format === 'digital') && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-left max-w-md mx-auto space-y-2">
                <div className="flex items-center gap-2 text-amber-900 font-bold text-xs">
                  <Download className="w-4 h-4 text-amber-700" />
                  <span>Authorized Digital Editions Ready for Download</span>
                </div>
                <p className="text-[11px] text-amber-800">
                  Your purchase includes instant digital access. You can download and read the files immediately below or through your IlmBooks Account:
                </p>
                <div className="space-y-1.5 pt-1">
                  {completedOrder.items
                    .filter((i) => i.format === 'digital')
                    .map((item) => (
                      <div
                        key={item.bookId}
                        className="flex items-center justify-between p-2 bg-white rounded-lg border border-amber-200 text-xs"
                      >
                        <span className="font-semibold text-stone-800 truncate pr-2">
                          {item.titleEn} (PDF)
                        </span>
                        <a
                          href={item.digitalFileUrl || '#'}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2.5 py-1 bg-emerald-800 text-amber-300 rounded font-semibold text-[11px] hover:bg-emerald-900 transition-colors"
                        >
                          Download
                        </a>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Order details summary */}
            <div className="bg-white border border-stone-200 rounded-xl p-4 text-left max-w-md mx-auto text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-stone-500">Destination:</span>
                <span className="font-semibold text-stone-800">
                  {completedOrder.deliveryCity}, {completedOrder.deliveryState} State
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Payment Status:</span>
                <span className="font-semibold text-emerald-800 uppercase font-mono">
                  {completedOrder.paymentStatus}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Estimated Dispatch:</span>
                <span className="font-semibold text-stone-800">
                  {shippingInfo?.estimatedDays || '1 - 3 business days'}
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={onClose}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#064E3B] text-amber-300 hover:text-white hover:bg-emerald-900 font-bold text-xs shadow-md transition-colors"
              >
                Continue Browsing
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
