import React, { useState, useEffect } from 'react';
import {
  Shield,
  CheckCircle,
  XCircle,
  Clock,
  Package,
  TrendingUp,
  GraduationCap,
  Briefcase,
  Search,
  Check,
  Truck,
  RotateCcw,
  Sparkles,
  Layers,
  DollarSign,
  AlertCircle,
  FileCheck,
} from 'lucide-react';
import { Book, BulkOrderEnquiry, Order, Publisher } from '../types/index.ts';
import {
  getBooks,
  updateBookStatus,
  getOrders,
  updateOrderStatus,
  getBulkOrders,
  updateBulkOrderQuote,
  getPublishers,
  updatePublisherStatus,
} from '../services/storeService.ts';

export const AdminDashboardView: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [bulkOrders, setBulkOrders] = useState<BulkOrderEnquiry[]>([]);
  const [publishers, setPublishers] = useState<Publisher[]>([]);

  const [activeTab, setActiveTab] = useState<'approvals' | 'orders' | 'schools' | 'publishers' | 'inventory'>('approvals');

  // School quotation modal / inline inputs
  const [selectedEnquiry, setSelectedEnquiry] = useState<BulkOrderEnquiry | null>(null);
  const [quoteAmount, setQuoteAmount] = useState<number>(0);
  const [discountPercent, setDiscountPercent] = useState<number>(15);
  const [adminNote, setAdminNote] = useState<string>('');

  // Tracking input for orders
  const [trackingNumber, setTrackingNumber] = useState<string>('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    loadAllAdminData();
  }, []);

  const loadAllAdminData = async () => {
    const [bList, oList, boList, pList] = await Promise.all([
      getBooks(),
      getOrders(undefined, true),
      getBulkOrders(true),
      getPublishers(),
    ]);
    setBooks(bList);
    setOrders(oList);
    setBulkOrders(boList);
    setPublishers(pList);
  };

  const handleApproveBook = async (bookId: string) => {
    await updateBookStatus(bookId, 'approved');
    await loadAllAdminData();
  };

  const handleRejectBook = async (bookId: string) => {
    await updateBookStatus(bookId, 'rejected');
    await loadAllAdminData();
  };

  const handleUpdateOrderStatus = async (orderId: string, status: Order['orderStatus']) => {
    await updateOrderStatus(orderId, status, trackingNumber || undefined);
    setSelectedOrder(null);
    setTrackingNumber('');
    await loadAllAdminData();
  };

  const handleSaveQuote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEnquiry) return;
    await updateBulkOrderQuote(
      selectedEnquiry.id,
      Number(quoteAmount),
      Number(discountPercent),
      adminNote || 'Discounted rate applied for school semester.',
      'quoted'
    );
    setSelectedEnquiry(null);
    await loadAllAdminData();
  };

  const handleTogglePublisher = async (pubId: string, status: 'approved' | 'rejected') => {
    await updatePublisherStatus(pubId, status);
    await loadAllAdminData();
  };

  // KPIs
  const totalRevenue = orders.reduce((sum, o) => sum + (o.paymentStatus === 'paid' ? o.total : 0), 0);
  const platformCommission = Math.round(totalRevenue * 0.15);
  const pendingBookApprovals = books.filter((b) => b.status === 'pending');
  const pendingSchoolQuotes = bulkOrders.filter((bo) => bo.status === 'pending');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Admin Title */}
      <div className="bg-[#043427] text-white rounded-3xl p-8 shadow-xl border border-emerald-800 mb-8 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-900 border border-emerald-700 text-amber-300 text-xs font-bold uppercase tracking-wider mb-2">
              <Shield className="w-3.5 h-3.5 text-amber-400" />
              <span>IlmBooks Central Headquarters</span>
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              Platform Administration & Audit Desk
            </h1>
            <p className="text-xs text-emerald-200 mt-1">
              South-West Hub: Oversight of publishing partners, book approvals, school quotes & orders
            </p>
          </div>
          <button
            onClick={loadAllAdminData}
            className="px-4 py-2 bg-emerald-800 hover:bg-emerald-700 text-amber-300 rounded-xl text-xs font-bold flex items-center gap-1.5 self-start md:self-auto transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Refresh Live Data</span>
          </button>
        </div>

        {/* Admin KPI row */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mt-8 pt-6 border-t border-emerald-800 text-xs">
          <div className="bg-emerald-950/60 p-3.5 rounded-xl border border-emerald-800">
            <span className="text-emerald-300 text-[11px] block">Verified Gross Revenue</span>
            <span className="text-xl font-extrabold text-white font-mono">
              ₦{totalRevenue.toLocaleString()}
            </span>
          </div>
          <div className="bg-emerald-950/60 p-3.5 rounded-xl border border-emerald-800">
            <span className="text-emerald-300 text-[11px] block">Retained Commission (15%)</span>
            <span className="text-xl font-extrabold text-amber-300 font-mono">
              ₦{platformCommission.toLocaleString()}
            </span>
          </div>
          <div className="bg-emerald-950/60 p-3.5 rounded-xl border border-emerald-800">
            <span className="text-emerald-300 text-[11px] block">Processed Orders</span>
            <span className="text-xl font-extrabold text-white font-mono">{orders.length}</span>
          </div>
          <div className="bg-emerald-950/60 p-3.5 rounded-xl border border-emerald-800">
            <span className="text-emerald-300 text-[11px] block">Pending Book Approvals</span>
            <span className="text-xl font-extrabold text-amber-400 font-mono">
              {pendingBookApprovals.length}
            </span>
          </div>
          <div className="bg-emerald-950/60 p-3.5 rounded-xl border border-emerald-800 col-span-2 lg:col-span-1">
            <span className="text-emerald-300 text-[11px] block">School Quotation Requests</span>
            <span className="text-xl font-extrabold text-amber-400 font-mono">
              {pendingSchoolQuotes.length}
            </span>
          </div>
        </div>
      </div>

      {/* Admin Tabs */}
      <div className="flex border-b border-stone-200 pb-3 mb-8 gap-4 text-xs font-bold overflow-x-auto">
        <button
          onClick={() => setActiveTab('approvals')}
          className={`pb-2 border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'approvals'
              ? 'border-emerald-800 text-emerald-950 text-sm'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <FileCheck className="w-4 h-4" />
          <span>Book Listing Approvals ({pendingBookApprovals.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          className={`pb-2 border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'orders'
              ? 'border-emerald-800 text-emerald-950 text-sm'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Orders & Shipments ({orders.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('schools')}
          className={`pb-2 border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'schools'
              ? 'border-emerald-800 text-emerald-950 text-sm'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          <span>School Quotes ({bulkOrders.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('publishers')}
          className={`pb-2 border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'publishers'
              ? 'border-emerald-800 text-emerald-950 text-sm'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <Briefcase className="w-4 h-4" />
          <span>Publishers Directory ({publishers.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('inventory')}
          className={`pb-2 border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'inventory'
              ? 'border-emerald-800 text-emerald-950 text-sm'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Inventory & Catalogue ({books.length})</span>
        </button>
      </div>

      {/* Tab 1: Book Approvals */}
      {activeTab === 'approvals' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center text-xs text-stone-600">
            <span>
              Review newly submitted manuscripts and editions from partner publishers.
            </span>
          </div>

          {books.filter((b) => b.status === 'pending').length === 0 ? (
            <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center text-stone-500">
              <CheckCircle className="w-12 h-12 text-emerald-600 mx-auto mb-3" />
              <h3 className="font-bold text-stone-800 text-base mb-1">All Listings Reviewed</h3>
              <p className="text-xs max-w-sm mx-auto">
                No publications are currently waiting in the pending approval queue.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {books
                .filter((b) => b.status === 'pending')
                .map((b) => (
                  <div
                    key={b.id}
                    className="bg-white rounded-2xl border border-amber-200 p-5 shadow-xs flex gap-4"
                  >
                    <img
                      src={b.coverUrl}
                      alt={b.titleEn}
                      className="w-20 h-28 object-cover rounded-lg shadow-inner bg-stone-100 shrink-0"
                    />
                    <div className="flex-1 min-w-0 flex flex-col justify-between text-xs">
                      <div>
                        {b.titleAr && (
                          <p className="font-['Amiri'] text-emerald-800 font-bold truncate text-right dir-rtl">
                            {b.titleAr}
                          </p>
                        )}
                        <h4 className="font-bold text-stone-900 line-clamp-1">{b.titleEn}</h4>
                        <p className="text-stone-500 text-[11px] truncate">
                          Author: <span className="font-semibold">{b.author}</span>
                        </p>
                        <p className="text-stone-500 text-[11px] truncate">
                          Publisher: <span className="font-semibold text-emerald-950">{b.publisherName}</span>
                        </p>
                        <p className="text-emerald-900 font-mono font-bold mt-1">
                          ₦{b.price.toLocaleString()} | {b.stock} in stock
                        </p>
                        <p className="text-stone-600 line-clamp-2 mt-1 text-[11px]">{b.description}</p>
                      </div>

                      <div className="flex items-center gap-2 mt-3 pt-2 border-t border-stone-100">
                        <button
                          onClick={() => handleApproveBook(b.id)}
                          className="flex-1 py-1.5 px-3 rounded-lg bg-emerald-800 text-amber-300 hover:bg-emerald-900 font-bold text-xs flex items-center justify-center gap-1 transition-colors"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Approve & Publish</span>
                        </button>
                        <button
                          onClick={() => handleRejectBook(b.id)}
                          className="py-1.5 px-3 rounded-lg bg-stone-100 text-rose-700 hover:bg-rose-50 border border-stone-200 font-bold text-xs transition-colors"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Orders & Shipments */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
            <div className="p-4 bg-stone-50 border-b border-stone-200 text-xs font-bold text-stone-600 grid grid-cols-12 gap-2">
              <span className="col-span-3">Order Reference / Recipient</span>
              <span className="col-span-3">Destination State & Method</span>
              <span className="col-span-2 text-right">Amount (₦)</span>
              <span className="col-span-2 text-center">Fulfillment Status</span>
              <span className="col-span-2 text-right">Actions</span>
            </div>

            <div className="divide-y divide-stone-100 text-xs">
              {orders.length === 0 ? (
                <div className="p-8 text-center text-stone-400">No orders recorded yet.</div>
              ) : (
                orders.map((o) => (
                  <div key={o.id} className="p-4 grid grid-cols-12 gap-2 items-center">
                    <div className="col-span-3">
                      <span className="font-mono font-bold text-stone-900 block">{o.id}</span>
                      <span className="text-stone-700 font-semibold">{o.customerName}</span>
                      <span className="text-[11px] text-stone-400 block">{o.customerPhone}</span>
                    </div>

                    <div className="col-span-3">
                      <span className="font-semibold text-stone-800 block">
                        {o.deliveryCity}, {o.deliveryState}
                      </span>
                      <span className="text-[11px] text-emerald-800 uppercase font-mono">
                        {o.paymentMethod} ({o.paymentStatus})
                      </span>
                      {o.trackingNumber && (
                        <span className="text-[10px] text-stone-500 block font-mono">
                          Tracking: {o.trackingNumber}
                        </span>
                      )}
                    </div>

                    <div className="col-span-2 text-right font-mono font-bold text-emerald-950">
                      ₦{o.total.toLocaleString()}
                    </div>

                    <div className="col-span-2 text-center">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          o.orderStatus === 'delivered'
                            ? 'bg-emerald-100 text-emerald-900'
                            : o.orderStatus === 'shipped'
                            ? 'bg-blue-100 text-blue-900'
                            : 'bg-amber-100 text-amber-900'
                        }`}
                      >
                        {o.orderStatus}
                      </span>
                    </div>

                    <div className="col-span-2 text-right">
                      <select
                        value={o.orderStatus}
                        onChange={(e) =>
                          handleUpdateOrderStatus(o.id, e.target.value as Order['orderStatus'])
                        }
                        className="bg-stone-50 border border-stone-300 rounded-lg p-1 text-[11px] font-semibold focus:outline-none"
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: School Quotes */}
      {activeTab === 'schools' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
            <div className="p-4 bg-stone-50 border-b border-stone-200 text-xs font-bold text-stone-600 flex justify-between">
              <span>Institution Enquiries</span>
              <span>Quotation & Action</span>
            </div>

            <div className="divide-y divide-stone-100 text-xs">
              {bulkOrders.length === 0 ? (
                <div className="p-8 text-center text-stone-400">No school bulk enquiries yet.</div>
              ) : (
                bulkOrders.map((bo) => (
                  <div key={bo.id} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-emerald-900">{bo.id}</span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-stone-100">
                          {bo.status}
                        </span>
                      </div>
                      <h4 className="font-bold text-stone-900 text-sm">{bo.schoolName}</h4>
                      <p className="text-stone-600 text-xs">
                        {bo.contactPerson} ({bo.phone} | {bo.email}) - {bo.state} State ({bo.curriculumLevel})
                      </p>
                      <p className="text-stone-700 font-mono text-xs">
                        Subjects: <span className="font-semibold">{bo.requiredSubjects}</span> ({bo.estimatedQuantity} copies)
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      {bo.quotedAmount ? (
                        <div className="text-right">
                          <span className="text-emerald-900 font-bold font-mono text-sm block">
                            ₦{bo.quotedAmount.toLocaleString()}
                          </span>
                          <span className="text-[11px] text-amber-700 font-semibold">
                            {bo.discountPercentage}% Discount Quoted
                          </span>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            setSelectedEnquiry(bo);
                            setQuoteAmount(bo.estimatedQuantity * 2800 * 0.85); // approximate default
                          }}
                          className="px-4 py-2 rounded-xl bg-emerald-800 text-amber-300 hover:bg-emerald-900 font-bold text-xs"
                        >
                          Prepare School Quote
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* School Quotation Modal */}
          {selectedEnquiry && (
            <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 flex items-center justify-center p-4">
              <div className="bg-[#FAF7F2] rounded-2xl p-6 max-w-lg w-full border border-stone-300 text-xs space-y-4">
                <div className="flex justify-between items-center border-b pb-3">
                  <h3 className="font-bold text-sm text-stone-900">
                    Prepare Official Quote for {selectedEnquiry.schoolName}
                  </h3>
                  <button onClick={() => setSelectedEnquiry(null)}>✕</button>
                </div>

                <form onSubmit={handleSaveQuote} className="space-y-3">
                  <div>
                    <label className="block font-semibold mb-1">Discounted Quotation Total (₦) *</label>
                    <input
                      type="number"
                      required
                      value={quoteAmount}
                      onChange={(e) => setQuoteAmount(Number(e.target.value))}
                      className="w-full bg-white border p-2 rounded-lg font-mono font-bold"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold mb-1">Discount Applied (%) *</label>
                    <input
                      type="number"
                      value={discountPercent}
                      onChange={(e) => setDiscountPercent(Number(e.target.value))}
                      className="w-full bg-white border p-2 rounded-lg font-mono"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold mb-1">Official Administrator Note</label>
                    <textarea
                      rows={2}
                      value={adminNote}
                      onChange={(e) => setAdminNote(e.target.value)}
                      placeholder="e.g. Free delivery included for orders above 200 copies; packing slips marked for school reception."
                      className="w-full bg-white border p-2 rounded-lg"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-emerald-800 text-amber-300 font-bold hover:bg-emerald-900"
                  >
                    Save & Send Official Quotation
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 4: Publishers Directory */}
      {activeTab === 'publishers' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {publishers.map((p) => (
            <div key={p.id} className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs text-xs space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-bold text-stone-900 text-sm">{p.businessName}</h4>
                  <p className="text-stone-500">
                    {p.contactPerson} | {p.phone} | {p.state} State
                  </p>
                </div>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                    p.status === 'approved' ? 'bg-emerald-100 text-emerald-900' : 'bg-amber-100 text-amber-900'
                  }`}
                >
                  {p.status}
                </span>
              </div>

              <div className="bg-stone-50 p-2.5 rounded-xl border border-stone-200 space-y-1">
                <div className="flex justify-between">
                  <span className="text-stone-500">Bank Settlement:</span>
                  <span className="font-semibold text-stone-800">
                    {p.bankName} - {p.accountNumber} ({p.accountName})
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Agreed Platform Commission:</span>
                  <span className="font-bold text-emerald-900">{p.commissionRate || 15}%</span>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-stone-100">
                {p.status === 'pending' ? (
                  <button
                    onClick={() => handleTogglePublisher(p.id, 'approved')}
                    className="px-3 py-1.5 bg-emerald-800 text-amber-300 rounded-lg font-bold text-xs hover:bg-emerald-900"
                  >
                    Approve Publisher
                  </button>
                ) : (
                  <button
                    onClick={() => handleTogglePublisher(p.id, 'rejected')}
                    className="px-3 py-1.5 bg-stone-100 text-rose-700 rounded-lg font-bold text-xs hover:bg-rose-50"
                  >
                    Revoke Approval
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 5: Inventory */}
      {activeTab === 'inventory' && (
        <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs text-xs">
          <div className="p-4 bg-stone-50 border-b border-stone-200 font-bold text-stone-600 grid grid-cols-12 gap-2">
            <span className="col-span-5">Book Title</span>
            <span className="col-span-3">Publisher</span>
            <span className="col-span-2 text-right">Price (₦)</span>
            <span className="col-span-2 text-right">Available Stock</span>
          </div>

          <div className="divide-y divide-stone-100">
            {books.map((b) => (
              <div key={b.id} className="p-3.5 grid grid-cols-12 gap-2 items-center">
                <div className="col-span-5 flex items-center gap-2 truncate">
                  <img src={b.coverUrl} alt="" className="w-8 h-10 object-cover rounded shadow-xs" />
                  <span className="font-semibold text-stone-900 truncate">{b.titleEn}</span>
                </div>
                <div className="col-span-3 text-stone-600 truncate">{b.publisherName}</div>
                <div className="col-span-2 text-right font-mono font-bold text-emerald-900">
                  ₦{b.price.toLocaleString()}
                </div>
                <div className="col-span-2 text-right font-mono font-semibold text-stone-800">
                  {b.format === 'digital' ? 'Unlimited (Digital)' : `${b.stock} units`}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
