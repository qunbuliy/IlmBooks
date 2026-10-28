import React, { useState } from 'react';
import {
  X,
  ShoppingBag,
  Heart,
  Star,
  CheckCircle2,
  BookOpen,
  Share2,
  FileText,
  Shield,
  Layers,
  Sparkles,
  Download,
} from 'lucide-react';
import { Book, BookFormat } from '../types/index.ts';
import { useCart } from '../context/CartContext.tsx';
import { useAuth } from '../context/AuthContext.tsx';

interface BookDetailModalProps {
  book: Book | null;
  onClose: () => void;
}

export const BookDetailModal: React.FC<BookDetailModalProps> = ({ book, onClose }) => {
  const { addToCart } = useCart();
  const { wishlist, toggleWishlist } = useAuth();
  const [selectedFormat, setSelectedFormat] = useState<BookFormat>(book?.format || 'paperback');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'overview' | 'excerpt' | 'specs'>('overview');
  const [copied, setCopied] = useState(false);

  if (!book) return null;

  const isLiked = wishlist.includes(book.id);

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[#FAF7F2] text-stone-900 w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden border border-stone-300 relative flex flex-col md:flex-row max-h-[90vh]">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-stone-900/60 text-white hover:bg-stone-900 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Column: Cover & Quick Info */}
        <div className="md:w-5/12 bg-stone-100 p-6 sm:p-8 flex flex-col justify-between border-b md:border-b-0 md:border-r border-stone-200">
          <div className="flex flex-col items-center">
            <div className="relative group shadow-2xl rounded-xl overflow-hidden max-w-[240px] border-4 border-white bg-white">
              <img
                src={book.coverUrl}
                alt={book.titleEn}
                className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              {book.isBestSeller && (
                <span className="absolute top-3 left-3 bg-amber-500 text-stone-950 text-[10px] uppercase font-black px-2 py-0.5 rounded shadow-md tracking-wider">
                  Best Seller
                </span>
              )}
            </div>

            {/* Quick stock badge */}
            <div className="mt-5 flex items-center gap-2 text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="font-semibold text-emerald-800">
                {book.format === 'digital'
                  ? 'Instant Download Available'
                  : `${book.stock} copies in stock (Ibadan Warehouse)`}
              </span>
            </div>
          </div>

          {/* Publisher Card */}
          <div className="mt-6 p-3 bg-white rounded-xl border border-stone-200 text-xs">
            <div className="text-[10px] text-stone-500 uppercase tracking-wider font-semibold">
              Published & Distributed by
            </div>
            <div className="font-bold text-stone-900 text-sm mt-0.5">{book.publisherName}</div>
            <div className="text-stone-500 text-[11px] mt-0.5">
              Verified Nigerian Islamic Publisher
            </div>
          </div>
        </div>

        {/* Right Column: Book Details & Actions */}
        <div className="md:w-7/12 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto">
          <div>
            {/* Arabic Title */}
            {book.titleAr && (
              <h2 className="font-['Amiri'] text-2xl sm:text-3xl text-emerald-900 font-bold text-right dir-rtl leading-snug mb-1">
                {book.titleAr}
              </h2>
            )}

            {/* English Title */}
            <h1 className="text-xl sm:text-2xl font-extrabold text-stone-900 tracking-tight leading-snug">
              {book.titleEn}
            </h1>

            {/* Author */}
            <div className="flex items-center gap-2 mt-2 text-xs text-stone-600">
              <span>By</span>
              <span className="font-bold text-emerald-950 text-sm">{book.author}</span>
              {book.authorAr && (
                <span className="font-['Amiri'] text-emerald-800 font-semibold">({book.authorAr})</span>
              )}
            </div>

            {/* Rating & Reviews */}
            <div className="flex items-center gap-4 mt-3 pb-3 border-b border-stone-200 text-xs">
              <div className="flex items-center gap-1 text-amber-500">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span className="font-bold text-stone-800">{book.rating || 5.0}</span>
                <span className="text-stone-500">({book.reviewsCount || 12} reviews)</span>
              </div>
              <span className="text-stone-300">|</span>
              <span className="text-stone-600 font-medium">Category: {book.category}</span>
              <button
                onClick={handleShare}
                className="ml-auto text-stone-500 hover:text-emerald-800 flex items-center gap-1 text-xs"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>{copied ? 'Copied Link' : 'Share'}</span>
              </button>
            </div>

            {/* Price section */}
            <div className="flex items-baseline gap-3 mt-4">
              <span className="text-3xl font-extrabold text-emerald-900 font-mono">
                ₦{book.price.toLocaleString()}
              </span>
              {book.originalPrice && book.originalPrice > book.price && (
                <>
                  <span className="text-base text-stone-400 line-through font-mono">
                    ₦{book.originalPrice.toLocaleString()}
                  </span>
                  <span className="text-xs bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full">
                    Save ₦{(book.originalPrice - book.price).toLocaleString()}
                  </span>
                </>
              )}
            </div>

            {/* Format selection */}
            <div className="mt-4">
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                Format & Edition
              </label>
              <div className="flex gap-2">
                {(['paperback', 'hardcover', 'digital'] as BookFormat[]).map((fmt) => (
                  <button
                    key={fmt}
                    onClick={() => setSelectedFormat(fmt)}
                    className={`px-3 py-2 rounded-xl text-xs font-semibold capitalize border transition-all flex items-center gap-1.5 ${
                      selectedFormat === fmt
                        ? 'border-emerald-800 bg-emerald-800 text-amber-300 shadow-sm'
                        : 'border-stone-200 bg-white text-stone-700 hover:border-stone-300'
                    }`}
                  >
                    {fmt === 'digital' ? <Download className="w-3.5 h-3.5" /> : <BookOpen className="w-3.5 h-3.5" />}
                    <span>{fmt}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex gap-4 mt-5 border-b border-stone-200 text-xs font-semibold">
              <button
                onClick={() => setActiveTab('overview')}
                className={`pb-2 border-b-2 transition-colors ${
                  activeTab === 'overview'
                    ? 'border-emerald-800 text-emerald-900 font-bold'
                    : 'border-transparent text-stone-500 hover:text-stone-800'
                }`}
              >
                Synopsis
              </button>
              <button
                onClick={() => setActiveTab('excerpt')}
                className={`pb-2 border-b-2 transition-colors flex items-center gap-1 ${
                  activeTab === 'excerpt'
                    ? 'border-emerald-800 text-emerald-900 font-bold'
                    : 'border-transparent text-stone-500 hover:text-stone-800'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Text Excerpt (نص المتن)</span>
              </button>
              <button
                onClick={() => setActiveTab('specs')}
                className={`pb-2 border-b-2 transition-colors ${
                  activeTab === 'specs'
                    ? 'border-emerald-800 text-emerald-900 font-bold'
                    : 'border-transparent text-stone-500 hover:text-stone-800'
                }`}
              >
                Specifications
              </button>
            </div>

            {/* Tab Contents */}
            <div className="py-3 text-xs leading-relaxed text-stone-700 min-h-[100px]">
              {activeTab === 'overview' && (
                <div className="space-y-2">
                  <p>{book.description}</p>
                  {book.descriptionAr && (
                    <p className="font-['Amiri'] text-sm text-stone-800 text-right dir-rtl leading-relaxed pt-2 border-t border-stone-100">
                      {book.descriptionAr}
                    </p>
                  )}
                </div>
              )}

              {activeTab === 'excerpt' && (
                <div className="bg-stone-50 p-4 rounded-xl border border-stone-200">
                  <div className="text-[10px] text-stone-400 uppercase font-semibold mb-2">
                    Sample Excerpt from Published Text
                  </div>
                  <p className="font-['Amiri'] text-base text-stone-900 text-right dir-rtl leading-loose">
                    {book.sampleExcerpt || 'نص الكتاب معتمد ومحقق بأعلى معايير الطباعة والنشر الإسلامي.'}
                  </p>
                </div>
              )}

              {activeTab === 'specs' && (
                <div className="grid grid-cols-2 gap-2 text-stone-600">
                  <div className="bg-white p-2 rounded-lg border border-stone-200">
                    <span className="text-stone-400 block text-[10px]">Language:</span>
                    <span className="font-semibold text-stone-800">{book.language}</span>
                  </div>
                  <div className="bg-white p-2 rounded-lg border border-stone-200">
                    <span className="text-stone-400 block text-[10px]">ISBN:</span>
                    <span className="font-semibold text-stone-800 font-mono">{book.isbn || 'N/A'}</span>
                  </div>
                  <div className="bg-white p-2 rounded-lg border border-stone-200">
                    <span className="text-stone-400 block text-[10px]">Pages:</span>
                    <span className="font-semibold text-stone-800">{book.pages || 120}</span>
                  </div>
                  <div className="bg-white p-2 rounded-lg border border-stone-200">
                    <span className="text-stone-400 block text-[10px]">Publication Year:</span>
                    <span className="font-semibold text-stone-800">{book.publicationYear || 2024}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Action Row */}
          <div className="pt-4 border-t border-stone-200 flex items-center gap-3">
            <div className="flex items-center border border-stone-300 rounded-xl bg-white">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-3 py-2.5 text-stone-600 hover:text-stone-900 font-bold"
              >
                -
              </button>
              <span className="px-3 text-xs font-bold font-mono text-stone-900">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="px-3 py-2.5 text-stone-600 hover:text-stone-900 font-bold"
              >
                +
              </button>
            </div>

            <button
              onClick={() => {
                addToCart(book, selectedFormat, quantity);
                onClose();
              }}
              className="flex-1 py-3 px-4 rounded-xl bg-[#064E3B] text-amber-300 hover:text-white hover:bg-emerald-900 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/20 transition-all active:scale-[0.99]"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Add to Cart (₦{(book.price * quantity).toLocaleString()})</span>
            </button>

            <button
              onClick={() => toggleWishlist(book.id)}
              className={`p-3 rounded-xl border transition-colors ${
                isLiked
                  ? 'border-rose-300 bg-rose-50 text-rose-600'
                  : 'border-stone-300 bg-white text-stone-500 hover:text-rose-600'
              }`}
              title="Add to Wishlist"
            >
              <Heart className={`w-4 h-4 ${isLiked ? 'fill-rose-500' : ''}`} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
