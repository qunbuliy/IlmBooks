import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  SlidersHorizontal,
  BookOpen,
  ShoppingBag,
  Heart,
  Eye,
  Check,
  RotateCcw,
  Sparkles,
  Download,
} from 'lucide-react';
import { Book, BookFormat } from '../types/index.ts';
import { CATEGORIES } from '../data/initialData.ts';
import { useCart } from '../context/CartContext.tsx';
import { useAuth } from '../context/AuthContext.tsx';

interface BookstoreViewProps {
  books: Book[];
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  onSelectBook: (book: Book) => void;
}

export const BookstoreView: React.FC<BookstoreViewProps> = ({
  books,
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  onSelectBook,
}) => {
  const { addToCart } = useCart();
  const { wishlist, toggleWishlist } = useAuth();

  const [selectedLanguage, setSelectedLanguage] = useState<string>('all');
  const [selectedFormat, setSelectedFormat] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('featured');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Filter and sort logic
  const filteredBooks = useMemo(() => {
    return books.filter((b) => {
      // Must be approved status
      if (b.status !== 'approved') return false;

      // Category filter
      if (selectedCategory !== 'all' && b.category !== selectedCategory) {
        return false;
      }

      // Language filter
      if (selectedLanguage !== 'all' && !b.language.includes(selectedLanguage)) {
        return false;
      }

      // Format filter
      if (selectedFormat !== 'all' && b.format !== selectedFormat) {
        return false;
      }

      // Search query (matches titleEn, titleAr, author, tags, isbn, description)
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const inTitleEn = b.titleEn.toLowerCase().includes(query);
        const inTitleAr = b.titleAr?.toLowerCase().includes(query) || false;
        const inAuthor = b.author.toLowerCase().includes(query);
        const inTags = b.tags?.some((t) => t.toLowerCase().includes(query)) || false;
        const inIsbn = b.isbn?.toLowerCase().includes(query) || false;
        const inDesc = b.description.toLowerCase().includes(query);
        if (!inTitleEn && !inTitleAr && !inAuthor && !inTags && !inIsbn && !inDesc) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      // default: featured or popularity
      return (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0);
    });
  }, [books, selectedCategory, selectedLanguage, selectedFormat, searchQuery, sortBy]);

  const clearAllFilters = () => {
    setSelectedCategory('all');
    setSelectedLanguage('all');
    setSelectedFormat('all');
    setSearchQuery('');
    setSortBy('featured');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Title & Page Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-stone-200">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-800 mb-1">
              <BookOpen className="w-4 h-4 text-amber-600" />
              <span>Authentic Islamic & Arabic Literature</span>
            </div>
            <h1 className="text-3xl font-extrabold text-stone-900 tracking-tight">
              IlmBooks Marketplace Catalogue
            </h1>
            <p className="text-xs sm:text-sm text-stone-600 max-w-2xl mt-1">
              Explore classic and contemporary Islamic treatises, grammar primers, Maliki jurisprudence manuals, and Nigerian madrasah curricula.
            </p>
          </div>

          {/* Quick search & filter toggle */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
              className="lg:hidden px-3.5 py-2 rounded-xl bg-white border border-stone-300 text-xs font-semibold text-stone-700 flex items-center gap-2 shadow-xs"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Filters</span>
            </button>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white border border-stone-300 rounded-xl px-3.5 py-2 text-xs font-semibold text-stone-800 shadow-xs focus:ring-1 focus:ring-emerald-700 focus:outline-none"
            >
              <option value="featured">Sort by: Featured & Popular</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="newest">Newest Arrivals</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Sidebar: Filters */}
        <aside
          className={`space-y-6 lg:block ${
            mobileFilterOpen ? 'block fixed inset-0 z-50 bg-[#FAF7F2] p-6 overflow-y-auto' : 'hidden'
          }`}
        >
          {mobileFilterOpen && (
            <div className="flex justify-between items-center pb-4 border-b border-stone-200 lg:hidden">
              <h3 className="font-bold text-base text-stone-900">Filter Books</h3>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="text-xs font-bold px-3 py-1 bg-stone-200 rounded-lg"
              >
                Done
              </button>
            </div>
          )}

          {/* Categories */}
          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider">Categories</h3>
              {(selectedCategory !== 'all' || selectedLanguage !== 'all' || selectedFormat !== 'all') && (
                <button
                  onClick={clearAllFilters}
                  className="text-[11px] text-amber-700 hover:text-amber-900 font-semibold flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset</span>
                </button>
              )}
            </div>

            <div className="space-y-1 text-xs">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`w-full text-left px-3 py-2 rounded-xl flex items-center justify-between transition-colors ${
                  selectedCategory === 'all'
                    ? 'bg-emerald-800 text-amber-300 font-bold'
                    : 'text-stone-700 hover:bg-stone-100'
                }`}
              >
                <span>All Disciplines</span>
                <span className="text-[10px] font-mono opacity-80">{books.length}</span>
              </button>

              {CATEGORIES.map((cat) => {
                const count = books.filter((b) => b.category === cat.id && b.status === 'approved').length;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`w-full text-left px-3 py-2 rounded-xl flex items-center justify-between transition-colors ${
                      selectedCategory === cat.id
                        ? 'bg-emerald-800 text-amber-300 font-bold'
                        : 'text-stone-700 hover:bg-stone-100'
                    }`}
                  >
                    <span className="truncate pr-2">{cat.nameEn}</span>
                    <span className="text-[10px] font-mono opacity-80">{count}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Language Filter */}
          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
            <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider mb-3">
              Language / Éde
            </h3>
            <div className="space-y-1.5 text-xs">
              {[
                { id: 'all', label: 'All Languages' },
                { id: 'Arabic', label: 'Arabic Only (العربية)' },
                { id: 'Yoruba', label: 'Yoruba & Bilingual (Èdè Yorùbá)' },
                { id: 'English', label: 'English' },
                { id: 'Bilingual', label: 'Bilingual Annotations' },
              ].map((lang) => (
                <label
                  key={lang.id}
                  className="flex items-center gap-2.5 text-stone-700 cursor-pointer hover:text-stone-900"
                >
                  <input
                    type="radio"
                    name="languageFilter"
                    checked={selectedLanguage === lang.id}
                    onChange={() => setSelectedLanguage(lang.id)}
                    className="accent-emerald-800"
                  />
                  <span>{lang.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Format Filter */}
          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
            <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider mb-3">
              Format & Binding
            </h3>
            <div className="space-y-1.5 text-xs">
              {[
                { id: 'all', label: 'All Formats' },
                { id: 'paperback', label: 'Paperback (Traditional Binding)' },
                { id: 'hardcover', label: 'Hardcover (Deluxe Volume)' },
                { id: 'digital', label: 'Digital eBook / PDF' },
              ].map((fmt) => (
                <label
                  key={fmt.id}
                  className="flex items-center gap-2.5 text-stone-700 cursor-pointer hover:text-stone-900"
                >
                  <input
                    type="radio"
                    name="formatFilter"
                    checked={selectedFormat === fmt.id}
                    onChange={() => setSelectedFormat(fmt.id)}
                    className="accent-emerald-800"
                  />
                  <span>{fmt.label}</span>
                </label>
              ))}
            </div>
          </div>
        </aside>

        {/* Right Area: Books Grid */}
        <main className="lg:col-span-3">
          {/* Active filter pills */}
          {(selectedCategory !== 'all' || selectedLanguage !== 'all' || selectedFormat !== 'all' || searchQuery) && (
            <div className="flex flex-wrap items-center gap-2 mb-6 text-xs">
              <span className="text-stone-500 font-medium">Active Filters:</span>
              {selectedCategory !== 'all' && (
                <span className="px-2.5 py-1 bg-emerald-100 text-emerald-900 rounded-full flex items-center gap-1 font-semibold">
                  <span>Category: {CATEGORIES.find((c) => c.id === selectedCategory)?.nameEn}</span>
                  <button onClick={() => setSelectedCategory('all')}>×</button>
                </span>
              )}
              {selectedLanguage !== 'all' && (
                <span className="px-2.5 py-1 bg-amber-100 text-amber-900 rounded-full flex items-center gap-1 font-semibold">
                  <span>Language: {selectedLanguage}</span>
                  <button onClick={() => setSelectedLanguage('all')}>×</button>
                </span>
              )}
              {selectedFormat !== 'all' && (
                <span className="px-2.5 py-1 bg-stone-200 text-stone-800 rounded-full flex items-center gap-1 font-semibold capitalize">
                  <span>Format: {selectedFormat}</span>
                  <button onClick={() => setSelectedFormat('all')}>×</button>
                </span>
              )}
              {searchQuery && (
                <span className="px-2.5 py-1 bg-stone-200 text-stone-800 rounded-full flex items-center gap-1 font-semibold">
                  <span>Search: "{searchQuery}"</span>
                  <button onClick={() => setSearchQuery('')}>×</button>
                </span>
              )}
              <button
                onClick={clearAllFilters}
                className="text-xs text-rose-600 hover:underline font-bold ml-2"
              >
                Clear All
              </button>
            </div>
          )}

          {/* Results Count */}
          <div className="flex justify-between items-center mb-4 text-xs text-stone-500">
            <span>
              Showing <strong className="text-stone-800 font-mono">{filteredBooks.length}</strong> publications
            </span>
          </div>

          {/* Grid */}
          {filteredBooks.length === 0 ? (
            <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center text-stone-500">
              <BookOpen className="w-12 h-12 text-stone-300 mx-auto mb-3" />
              <h3 className="font-bold text-stone-800 text-base mb-1">No matching titles found</h3>
              <p className="text-xs max-w-sm mx-auto mb-4">
                Try searching with different Arabic or English terms, or reset your active filters.
              </p>
              <button
                onClick={clearAllFilters}
                className="px-4 py-2 bg-emerald-800 text-amber-300 rounded-xl text-xs font-bold hover:bg-emerald-900 transition-colors"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {filteredBooks.map((book) => {
                const isLiked = wishlist.includes(book.id);
                return (
                  <div
                    key={book.id}
                    className="group bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs hover:shadow-xl hover:border-emerald-700/40 transition-all duration-300 flex flex-col justify-between"
                  >
                    {/* Top image & badges */}
                    <div className="relative bg-stone-100 p-4 flex items-center justify-center overflow-hidden">
                      <img
                        src={book.coverUrl}
                        alt={book.titleEn}
                        className="w-36 h-48 object-cover rounded-md shadow-md group-hover:scale-105 transition-transform duration-300 bg-white"
                      />
                      
                      {/* Wishlist Button */}
                      <button
                        onClick={() => toggleWishlist(book.id)}
                        className={`absolute top-3 right-3 p-2 rounded-full shadow-md transition-colors ${
                          isLiked
                            ? 'bg-rose-50 text-rose-600'
                            : 'bg-white/90 text-stone-500 hover:text-rose-600'
                        }`}
                        title="Wishlist"
                      >
                        <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-rose-500' : ''}`} />
                      </button>

                      {/* Best Seller / Digital Badge */}
                      <div className="absolute top-3 left-3 flex flex-col gap-1">
                        {book.isBestSeller && (
                          <span className="bg-amber-500 text-stone-950 font-black text-[9px] uppercase px-2 py-0.5 rounded shadow tracking-wider">
                            Top Seller
                          </span>
                        )}
                        {book.format === 'digital' && (
                          <span className="bg-emerald-900 text-amber-300 font-bold text-[9px] uppercase px-1.5 py-0.5 rounded flex items-center gap-1 shadow">
                            <Download className="w-2.5 h-2.5" />
                            <span>eBook</span>
                          </span>
                        )}
                      </div>

                      {/* Hover Quick View Trigger */}
                      <div className="absolute inset-0 bg-stone-950/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button
                          onClick={() => onSelectBook(book)}
                          className="px-3.5 py-2 bg-white text-stone-900 rounded-xl text-xs font-bold shadow-lg flex items-center gap-1.5 hover:bg-emerald-50 hover:text-emerald-900 transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Quick View</span>
                        </button>
                      </div>
                    </div>

                    {/* Book Details */}
                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <div>
                        {book.titleAr && (
                          <p className="font-['Amiri'] text-sm text-emerald-800 font-bold truncate text-right dir-rtl mb-1">
                            {book.titleAr}
                          </p>
                        )}
                        <h3
                          onClick={() => onSelectBook(book)}
                          className="font-bold text-xs text-stone-900 leading-snug line-clamp-2 cursor-pointer hover:text-emerald-800 transition-colors"
                        >
                          {book.titleEn}
                        </h3>
                        <p className="text-[11px] text-stone-500 truncate mt-1">
                          By <span className="font-semibold text-stone-700">{book.author}</span>
                        </p>
                        <p className="text-[10px] text-stone-400 mt-0.5 truncate">
                          {book.publisherName}
                        </p>
                      </div>

                      {/* Price & Action */}
                      <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
                        <div>
                          <span className="text-base font-extrabold text-emerald-900 font-mono">
                            ₦{book.price.toLocaleString()}
                          </span>
                          {book.originalPrice && book.originalPrice > book.price && (
                            <span className="text-[11px] text-stone-400 line-through block font-mono">
                              ₦{book.originalPrice.toLocaleString()}
                            </span>
                          )}
                        </div>

                        <button
                          onClick={() => addToCart(book, book.format, 1)}
                          className="p-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-amber-300 hover:text-white transition-colors shadow-xs"
                          title="Add to Cart"
                        >
                          <ShoppingBag className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
