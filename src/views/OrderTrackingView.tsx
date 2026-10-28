import React, { useState } from 'react';
import { Search, Truck, CheckCircle2, Clock, MapPin, Package, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';
import { getOrders } from '../services/storeService.ts';
import { Order } from '../types/index.ts';

export const OrderTrackingView: React.FC = () => {
  const [orderQuery, setOrderQuery] = useState('');
  const [trackedOrder, setTrackedOrder] = useState<Order | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderQuery.trim()) return;

    setIsLoading(true);
    setHasSearched(true);
    const allOrders = await getOrders(undefined, true);
    const match = allOrders.find(
      (o) =>
        o.id.toLowerCase() === orderQuery.trim().toLowerCase() ||
        o.customerEmail.toLowerCase() === orderQuery.trim().toLowerCase() ||
        o.customerPhone.includes(orderQuery.trim())
    );
    setTrackedOrder(match || null);
    setIsLoading(false);
  };

  const getStepState = (currentStatus: Order['orderStatus'], step: number) => {
    const statuses = ['pending', 'processing', 'shipped', 'delivered'];
    const currentIdx = statuses.indexOf(currentStatus);
    if (currentIdx >= step) return 'completed';
    if (currentIdx === step - 1) return 'active';
    return 'pending';
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Search Box */}
      <div className="bg-white rounded-3xl p-8 border border-stone-200 shadow-sm text-center mb-8">
        <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto mb-4 shadow-xs">
          <Truck className="w-7 h-7" />
        </div>
        <h1 className="text-2xl font-bold text-stone-900 tracking-tight">Track Your IlmBooks Order</h1>
        <p className="text-xs text-stone-500 max-w-md mx-auto mt-1 mb-6">
          Enter your Order Reference ID (e.g. <code className="bg-stone-100 px-1 py-0.5 rounded font-mono">ORD-ILM-920145</code>) or telephone number to see live dispatch progress.
        </p>

        <form onSubmit={handleSearch} className="max-w-md mx-auto flex gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              required
              value={orderQuery}
              onChange={(e) => setOrderQuery(e.target.value)}
              placeholder="e.g. ORD-ILM-102931 or email"
              className="w-full bg-stone-50 border border-stone-300 rounded-xl pl-10 pr-4 py-3 text-xs focus:ring-2 focus:ring-emerald-700 focus:outline-none font-mono"
            />
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="px-5 py-3 rounded-xl bg-emerald-800 text-amber-300 hover:bg-emerald-900 font-bold text-xs shadow-md transition-colors"
          >
            {isLoading ? 'Searching...' : 'Track'}
          </button>
        </form>
      </div>

      {/* Results */}
      {hasSearched && (
        <>
          {!trackedOrder ? (
            <div className="bg-white rounded-2xl border border-stone-200 p-8 text-center text-stone-500">
              <AlertCircle className="w-10 h-10 text-stone-300 mx-auto mb-2" />
              <h3 className="font-bold text-stone-800 text-sm">No Matching Order Found</h3>
              <p className="text-xs max-w-sm mx-auto mt-1">
                Please double check the order code from your email receipt or contact our South-West dispatch desk on WhatsApp.
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-sm space-y-6 text-xs">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-stone-100 gap-3">
                <div>
                  <span className="font-mono text-base font-extrabold text-stone-900">
                    {trackedOrder.id}
                  </span>
                  <p className="text-stone-500 text-[11px]">
                    Recipient: {trackedOrder.customerName} | Destination: {trackedOrder.deliveryCity}, {trackedOrder.deliveryState} State
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-100 text-emerald-900">
                    Status: {trackedOrder.orderStatus}
                  </span>
                  <span className="font-mono font-bold text-emerald-950 text-sm">
                    ₦{trackedOrder.total.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Step Timeline */}
              <div className="py-4">
                <div className="grid grid-cols-4 gap-2 text-center relative">
                  {/* Step 1 */}
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs mb-2 ${
                        getStepState(trackedOrder.orderStatus, 0) === 'completed'
                          ? 'bg-emerald-800 text-amber-300'
                          : 'bg-stone-200 text-stone-600'
                      }`}
                    >
                      ✓
                    </div>
                    <span className="font-bold text-[11px] text-stone-900">Order Placed</span>
                    <span className="text-[10px] text-stone-400">Payment verified</span>
                  </div>

                  {/* Step 2 */}
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs mb-2 ${
                        getStepState(trackedOrder.orderStatus, 1) === 'completed'
                          ? 'bg-emerald-800 text-amber-300'
                          : 'bg-stone-200 text-stone-600'
                      }`}
                    >
                      2
                    </div>
                    <span className="font-bold text-[11px] text-stone-900">Processing</span>
                    <span className="text-[10px] text-stone-400">Packed in Ibadan</span>
                  </div>

                  {/* Step 3 */}
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs mb-2 ${
                        getStepState(trackedOrder.orderStatus, 2) === 'completed'
                          ? 'bg-emerald-800 text-amber-300'
                          : 'bg-stone-200 text-stone-600'
                      }`}
                    >
                      3
                    </div>
                    <span className="font-bold text-[11px] text-stone-900">Dispatched</span>
                    <span className="text-[10px] text-stone-400">With courier</span>
                  </div>

                  {/* Step 4 */}
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs mb-2 ${
                        getStepState(trackedOrder.orderStatus, 3) === 'completed'
                          ? 'bg-emerald-800 text-amber-300'
                          : 'bg-stone-200 text-stone-600'
                      }`}
                    >
                      4
                    </div>
                    <span className="font-bold text-[11px] text-stone-900">Delivered</span>
                    <span className="text-[10px] text-stone-400">Received & Signed</span>
                  </div>
                </div>
              </div>

              {/* Tracking number badge if shipped */}
              {trackedOrder.trackingNumber && (
                <div className="p-3 bg-stone-50 border border-stone-200 rounded-xl flex items-center justify-between">
                  <span className="text-stone-600">Waybill / Courier Tracking:</span>
                  <span className="font-mono font-bold text-emerald-900">{trackedOrder.trackingNumber}</span>
                </div>
              )}

              {/* Items in this parcel */}
              <div className="space-y-2 pt-2 border-t border-stone-100">
                <span className="font-bold text-stone-700 block">Package Contents:</span>
                {trackedOrder.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center text-xs">
                    <span className="text-stone-800 truncate pr-4">
                      {item.titleEn} ({item.format}) x {item.quantity}
                    </span>
                    <span className="font-mono text-stone-600">
                      ₦{(item.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
