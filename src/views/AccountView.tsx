import React, { useState, useEffect } from 'react';
import {
  User,
  ShoppingBag,
  Heart,
  Download,
  BookOpen,
  MapPin,
  Clock,
  CheckCircle,
  ExternalLink,
  Trash2,
  FileText,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';
import { useCart } from '../context/CartContext.tsx';
import { Book, Order } from '../types/index.ts';
import { getOrders, getBooks } from '../services/storeService.ts';

interface AccountViewProps {
  onSelectBook: (book: Book) => void;
}

export const AccountView: React.FC<AccountViewProps> = ({ onSelectBook }) => {
  const { currentUser, wishlist, toggleWishlist } = useAuth();
  const { addToCart } = useCart();
  const [orders, setOrders] = useState<Order[]>([]);
  const [allBooks, setAllBooks] = useState<Book[]>([]);
  const [activeTab, setActiveTab] = useState<'orders' | 'digital' | 'wishlist' | 'profile'>('orders');

  useEffect(() => {
    loadCustomerData();
  }, [currentUser]);

  const loadCustomerData = async () => {
    const [userOrders, bList] = await Promise.all([
      getOrders(currentUser?.uid),
      getBooks(),
    ]);
    setOrders(userOrders);
    setAllBooks(bList);
  };

  const wishlistedBooks = allBooks.filter((b) => wishlist.includes(b.id));

  // Extract all digital books from customer orders
  const digitalPurchases = orders
    .flatMap((o) => o.items)
    .filter((item) => item.format === 'digital');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Account Hero */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs mb-8 flex flex-col sm:flex-row items-center gap-6">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-800 to-emerald-950 text-amber-300 flex items-center justify-center font-['Amiri'] text-3xl font-bold shadow-md">
          {currentUser?.displayName?.[0] || 'ع'}
        </div>
        <div className="flex-1 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <h1 className="text-2xl font-bold text-stone-900">{currentUser?.displayName}</h1>
            <span className="inline-block px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 text-xs font-bold uppercase tracking-wider">
              {currentUser?.role} Account
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-1">{currentUser?.email} | {currentUser?.phone || '+234 802 345 6789'}</p>
          <p className="text-xs text-stone-600 mt-0.5 flex items-center justify-center sm:justify-start gap-1">
            <MapPin className="w-3.5 h-3.5 text-emerald-700" />
            <span>{currentUser?.address || 'Lagos State, Nigeria'}</span>
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-stone-200 pb-3 mb-8 gap-4 text-xs font-bold overflow-x-auto">
        <button
          onClick={() => setActiveTab('orders')}
          className={`pb-2 border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'orders'
              ? 'border-emerald-800 text-emerald-950 text-sm'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>My Orders ({orders.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('digital')}
          className={`pb-2 border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'digital'
              ? 'border-emerald-800 text-emerald-950 text-sm'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <Download className="w-4 h-4" />
          <span>Digital Library ({digitalPurchases.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('wishlist')}
          className={`pb-2 border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'wishlist'
              ? 'border-emerald-800 text-emerald-950 text-sm'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <Heart className="w-4 h-4" />
          <span>Saved Wishlist ({wishlistedBooks.length})</span>
        </button>
      </div>

      {/* Tab 1: Orders */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          {orders.length === 0 ? (
            <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center text-stone-500">
              <ShoppingBag className="w-12 h-12 text-stone-300 mx-auto mb-3" />
              <h3 className="font-bold text-stone-800 text-base mb-1">No Orders Placed Yet</h3>
              <p className="text-xs max-w-sm mx-auto">
                Explore our bookstore to place your first order.
              </p>
            </div>
          ) : (
            orders.map((o) => (
              <div
                key={o.id}
                className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-4 text-xs"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-stone-100 gap-2">
                  <div>
                    <span className="font-mono font-bold text-stone-900 text-sm">{o.id}</span>
                    <span className="text-stone-400 text-[11px] block">
                      Placed on {new Date(o.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        o.orderStatus === 'delivered'
                          ? 'bg-emerald-100 text-emerald-900'
                          : o.orderStatus === 'shipped'
                          ? 'bg-blue-100 text-blue-900'
                          : 'bg-amber-100 text-amber-900'
                      }`}
                    >
                      {o.orderStatus}
                    </span>
                    <span className="font-mono font-extrabold text-emerald-950 text-sm">
                      ₦{o.total.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  {o.items.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 truncate">
                        <img
                          src={item.coverUrl}
                          alt=""
                          className="w-10 h-14 object-cover rounded bg-stone-100 shadow-xs shrink-0"
                        />
                        <div className="truncate">
                          <h4 className="font-semibold text-stone-900 truncate">{item.titleEn}</h4>
                          <span className="text-[11px] text-stone-500 capitalize">
                            {item.format} x {item.quantity}
                          </span>
                        </div>
                      </div>
                      <span className="font-mono font-bold text-stone-800">
                        ₦{(item.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>

                {o.trackingNumber && (
                  <div className="bg-stone-50 p-3 rounded-xl border border-stone-200 flex items-center justify-between">
                    <span className="text-stone-600">Dispatch Courier Tracking:</span>
                    <span className="font-mono font-bold text-emerald-900">{o.trackingNumber}</span>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab 2: Digital Library */}
      {activeTab === 'digital' && (
        <div className="space-y-4">
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 text-xs text-amber-900 mb-6">
            <h3 className="font-bold text-sm mb-1">Your Authorized Digital Publications</h3>
            <p>
              Digital editions include immediate DRM-verified PDF viewing and download entitlements. Click any book to download or open your study reader.
            </p>
          </div>

          {digitalPurchases.length === 0 ? (
            <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center text-stone-500">
              <Download className="w-12 h-12 text-stone-300 mx-auto mb-3" />
              <h3 className="font-bold text-stone-800 text-base mb-1">No Digital Books in Your Library</h3>
              <p className="text-xs max-w-sm mx-auto">
                Select "Digital" format on any book (e.g. *Tuhfat Al-Atfal*) to get instant digital access.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {digitalPurchases.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs flex flex-col justify-between"
                >
                  <div className="flex gap-3">
                    <img src={item.coverUrl} alt="" className="w-14 h-20 object-cover rounded shadow-xs" />
                    <div>
                      <h4 className="font-bold text-xs text-stone-900 line-clamp-2">{item.titleEn}</h4>
                      <p className="text-[11px] text-stone-500 mt-0.5">{item.author}</p>
                      <span className="inline-block mt-2 px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-900 text-[10px] font-bold">
                        PDF eBook
                      </span>
                    </div>
                  </div>

                  <a
                    href={item.digitalFileUrl || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 w-full py-2 bg-emerald-800 text-amber-300 hover:bg-emerald-900 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download / Read PDF</span>
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Wishlist */}
      {activeTab === 'wishlist' && (
        <div className="space-y-4">
          {wishlistedBooks.length === 0 ? (
            <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center text-stone-500">
              <Heart className="w-12 h-12 text-stone-300 mx-auto mb-3" />
              <h3 className="font-bold text-stone-800 text-base mb-1">Wishlist is empty</h3>
              <p className="text-xs max-w-sm mx-auto">
                Click the heart icon on any book to save it for later review.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {wishlistedBooks.map((b) => (
                <div
                  key={b.id}
                  className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs flex flex-col justify-between"
                >
                  <div className="flex gap-3">
                    <img src={b.coverUrl} alt="" className="w-14 h-20 object-cover rounded shadow-xs" />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-xs text-stone-900 truncate">{b.titleEn}</h4>
                      <p className="text-[11px] text-stone-500 truncate">{b.author}</p>
                      <p className="text-emerald-900 font-mono font-bold mt-1">₦{b.price.toLocaleString()}</p>
                    </div>
                    <button
                      onClick={() => toggleWishlist(b.id)}
                      className="text-stone-400 hover:text-rose-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <button
                    onClick={() => addToCart(b, b.format, 1)}
                    className="mt-4 w-full py-2 bg-emerald-800 text-amber-300 hover:bg-emerald-900 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Move to Cart</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
