import React, { useState } from 'react';
import {
  BookOpen,
  ShoppingBag,
  GraduationCap,
  Briefcase,
  ArrowRight,
  Search,
  Sparkles,
  ShieldCheck,
  Truck,
  Heart,
  Star,
  CheckCircle2,
  Mail,
  Languages,
  ScrollText,
  Scale,
  Landmark,
  Smile,
  Globe,
  Download,
  Building,
} from 'lucide-react';
import { Book, Category, Publisher } from '../types/index.ts';
import { CATEGORIES } from '../data/initialData.ts';
import { useCart } from '../context/CartContext.tsx';
import { useAuth } from '../context/AuthContext.tsx';

interface HomeViewProps {
  books: Book[];
  publishers: Publisher[];
  onSelectBook: (book: Book) => void;
  onNavigateTab: (tab: string, categoryId?: string) => void;
  onSearch: (query: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  books,
  publishers,
  onSelectBook,
  onNavigateTab,
  onSearch,
}) => {
  const { addToCart } = useCart();
  const { wishlist, toggleWishlist } = useAuth();
  const [localSearch, setLocalSearch] = useState('');
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  const featuredBooks = books.filter((b) => b.isFeatured && b.status === 'approved').slice(0, 6);
  const bestSellers = books.filter((b) => b.isBestSeller && b.status === 'approved').slice(0, 6);
  const newArrivals = [...books].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 6);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (localSearch.trim()) {
      onSearch(localSearch);
    }
  };

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail) {
      setNewsletterSubscribed(true);
      setNewsletterEmail('');
    }
  };

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Languages': return <Languages className="w-6 h-6 text-emerald-800" />;
      case 'BookOpen': return <BookOpen className="w-6 h-6 text-emerald-800" />;
      case 'ScrollText': return <ScrollText className="w-6 h-6 text-emerald-800" />;
      case 'Scale': return <Scale className="w-6 h-6 text-emerald-800" />;
      case 'Landmark': return <Landmark className="w-6 h-6 text-emerald-800" />;
      case 'Smile': return <Smile className="w-6 h-6 text-emerald-800" />;
      case 'GraduationCap': return <GraduationCap className="w-6 h-6 text-emerald-800" />;
      case 'Globe': return <Globe className="w-6 h-6 text-emerald-800" />;
      default: return <BookOpen className="w-6 h-6 text-emerald-800" />;
    }
  };

  return (
    <div className="space-y-16 pb-16">
      {/* 1. Hero Section */}
      <section className="relative bg-gradient-to-br from-[#064E3B] via-[#043E2F] to-[#022C22] text-white pt-16 pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Subtle decorative geometric patterns */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#F59E0B_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Headlines & Call to Actions */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-900/80 border border-emerald-700 text-amber-300 text-xs font-bold uppercase tracking-wider shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Premier Arabic & Islamic Publishing Marketplace</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white font-['Plus_Jakarta_Sans'] leading-[1.15]">
                Knowledge, Books <br />
                <span className="text-amber-400 font-serif italic">& Community.</span>
              </h1>

              <p className="text-base sm:text-lg text-emerald-100/90 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-light">
                Connecting Nigerian madrasahs, scholars, students, and readers with authentic Arabic grammar, Maliki jurisprudence manuals, Qur’anic exegesis, and Yoruba translations. Direct delivery across South-West Nigeria & nationwide.
              </p>

              {/* Search Widget */}
              <form onSubmit={handleSearchSubmit} className="max-w-xl mx-auto lg:mx-0 pt-2">
                <div className="relative flex items-center shadow-2xl rounded-2xl overflow-hidden bg-white p-1.5 border-2 border-amber-400/60 focus-within:border-amber-400">
                  <input
                    type="text"
                    value={localSearch}
                    onChange={(e) => setLocalSearch(e.target.value)}
                    placeholder="Search Arabic books, Nahw, Fiqh, Yoruba, authors, ISBN..."
                    className="flex-1 bg-transparent px-4 py-3 text-stone-900 placeholder-stone-400 text-xs sm:text-sm focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="px-5 py-3 rounded-xl bg-[#064E3B] hover:bg-emerald-800 text-amber-300 font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-colors shadow-sm"
                  >
                    <Search className="w-4 h-4" />
                    <span>Search</span>
                  </button>
                </div>
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 mt-3 text-[11px] text-emerald-200">
                  <span className="text-emerald-300 font-medium">Popular:</span>
                  {['متن الآجرومية', 'العشماوية', 'Forty Hadith Yoruba', 'Tajweed', 'Primary Arabic'].map((term) => (
                    <button
                      key={term}
                      type="button"
                      onClick={() => onSearch(term)}
                      className="px-2.5 py-0.5 rounded-full bg-emerald-900/60 border border-emerald-700/60 hover:bg-emerald-800 text-stone-200 transition-colors"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </form>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-4">
                <button
                  onClick={() => onNavigateTab('books')}
                  className="px-6 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-sm shadow-lg shadow-black/20 flex items-center gap-2 transition-transform active:scale-95"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Explore 50+ Books</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => onNavigateTab('schools')}
                  className="px-6 py-3.5 rounded-xl bg-emerald-900/80 hover:bg-emerald-800 border border-emerald-600 text-stone-100 font-semibold text-sm flex items-center gap-2 transition-colors"
                >
                  <GraduationCap className="w-4 h-4 text-amber-400" />
                  <span>School & Madrasah Orders</span>
                </button>
              </div>
            </div>

            {/* Right Column: Featured Book Highlight Showcase */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative group max-w-sm">
                <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-amber-400 to-emerald-400 opacity-30 blur-xl group-hover:opacity-50 transition duration-500" />
                <div className="relative bg-white rounded-3xl p-6 shadow-2xl border border-stone-200 text-stone-900">
                  <div className="flex justify-between items-center mb-3 text-xs">
                    <span className="font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      Editor's Classical Pick
                    </span>
                    <span className="text-amber-500 font-bold flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-amber-400" /> 5.0 Rating
                    </span>
                  </div>

                  {books[0] && (
                    <div className="space-y-4">
                      <div className="overflow-hidden rounded-2xl bg-stone-100 flex items-center justify-center p-4">
                        <img
                          src={books[0].coverUrl}
                          alt={books[0].titleEn}
                          className="w-44 h-60 object-cover rounded-lg shadow-xl group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div>
                        <p className="font-['Amiri'] text-xl text-emerald-900 font-bold text-right dir-rtl">
                          {books[0].titleAr}
                        </p>
                        <h3 className="font-bold text-base text-stone-900 line-clamp-1">{books[0].titleEn}</h3>
                        <p className="text-xs text-stone-500 mt-0.5">By {books[0].author}</p>
                        <p className="text-xs text-stone-600 line-clamp-2 mt-2 leading-relaxed">
                          {books[0].description}
                        </p>
                      </div>

                      <div className="pt-2 flex items-center justify-between border-t border-stone-100">
                        <div>
                          <span className="text-xl font-extrabold text-emerald-950 font-mono">
                            ₦{books[0].price.toLocaleString()}
                          </span>
                          <span className="text-[11px] text-stone-400 line-through block font-mono">
                            ₦{books[0].originalPrice?.toLocaleString()}
                          </span>
                        </div>

                        <button
                          onClick={() => addToCart(books[0], books[0].format, 1)}
                          className="px-4 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-amber-300 font-bold text-xs flex items-center gap-1.5 shadow-md"
                        >
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>Add to Cart</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
        <div className="bg-white rounded-2xl p-6 shadow-xl border border-stone-200 grid grid-cols-1 md:grid-cols-4 gap-6 text-xs text-stone-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-stone-900 text-sm">Vetted Islamic Texts</h4>
              <p className="text-stone-500 text-[11px]">Authorized editions from verified publishers</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-stone-900 text-sm">South-West Fast Dispatch</h4>
              <p className="text-stone-500 text-[11px]">1 - 2 business days to Lagos, Ibadan, Ogun</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-stone-900 text-sm">School Bulk Quotes</h4>
              <p className="text-stone-500 text-[11px]">Up to 25% discount for madrasahs & colleges</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-stone-900 text-sm">Paystack Verified</h4>
              <p className="text-stone-500 text-[11px]">Cards, USSD, transfers & Cash on Delivery</p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Category Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block mb-1">
              Curated Islamic Disciplines
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
              Explore by Subject & Category
            </h2>
          </div>
          <button
            onClick={() => onNavigateTab('books')}
            className="text-xs font-bold text-emerald-800 hover:text-emerald-950 flex items-center gap-1"
          >
            <span>View All Categories</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {CATEGORIES.map((cat) => (
            <div
              key={cat.id}
              onClick={() => onNavigateTab('books', cat.id)}
              className="group bg-white p-5 rounded-2xl border border-stone-200 hover:border-emerald-700/60 shadow-xs hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                  {getCategoryIcon(cat.iconName)}
                </div>
                <p className="font-['Amiri'] text-emerald-900 font-bold text-sm text-right dir-rtl mb-1">
                  {cat.nameAr}
                </p>
                <h3 className="font-bold text-sm text-stone-900 group-hover:text-emerald-900 transition-colors">
                  {cat.nameEn}
                </h3>
                <p className="text-stone-500 text-xs mt-1 line-clamp-2 leading-relaxed">
                  {cat.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-emerald-800 font-bold">
                <span>Browse Subject</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Featured Books Carousel / Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-8">
          <div>
            <span className="text-xs font-bold text-amber-700 uppercase tracking-wider block mb-1">
              Handpicked by Scholars
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
              Featured Publications
            </h2>
          </div>
          <button
            onClick={() => onNavigateTab('books')}
            className="text-xs font-bold text-emerald-800 hover:underline flex items-center gap-1"
          >
            <span>See Catalogue</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {featuredBooks.map((book) => {
            const isLiked = wishlist.includes(book.id);
            return (
              <div
                key={book.id}
                className="group bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs hover:shadow-xl hover:border-emerald-700/40 transition-all flex flex-col justify-between"
              >
                <div className="relative bg-stone-100 p-3 flex items-center justify-center">
                  <img
                    src={book.coverUrl}
                    alt={book.titleEn}
                    className="w-28 h-38 object-cover rounded shadow-md group-hover:scale-105 transition-transform bg-white"
                  />
                  <button
                    onClick={() => toggleWishlist(book.id)}
                    className="absolute top-2 right-2 p-1.5 rounded-full bg-white/80 hover:bg-white text-stone-500"
                  >
                    <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
                  </button>
                </div>

                <div className="p-3 flex-1 flex flex-col justify-between text-xs">
                  <div>
                    {book.titleAr && (
                      <p className="font-['Amiri'] text-xs text-emerald-800 font-bold truncate text-right dir-rtl">
                        {book.titleAr}
                      </p>
                    )}
                    <h4
                      onClick={() => onSelectBook(book)}
                      className="font-bold text-stone-900 line-clamp-2 cursor-pointer hover:text-emerald-800 mt-0.5"
                    >
                      {book.titleEn}
                    </h4>
                    <p className="text-[11px] text-stone-500 truncate mt-1">By {book.author}</p>
                  </div>

                  <div className="mt-3 pt-2 border-t border-stone-100 flex items-center justify-between">
                    <span className="font-mono font-bold text-emerald-950 text-sm">
                      ₦{book.price.toLocaleString()}
                    </span>
                    <button
                      onClick={() => addToCart(book, book.format, 1)}
                      className="p-2 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-amber-300"
                      title="Add to cart"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. Best Selling Books & Top Recommendations */}
      <section className="bg-stone-100/70 py-12 border-y border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-8">
            <div>
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block mb-1">
                Reader Favorites Across Nigeria
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
                Best-Selling Islamic Books
              </h2>
            </div>
            <button
              onClick={() => onNavigateTab('books')}
              className="text-xs font-bold text-emerald-800 hover:underline flex items-center gap-1"
            >
              <span>Explore All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {bestSellers.map((book) => (
              <div
                key={book.id}
                onClick={() => onSelectBook(book)}
                className="group bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between"
              >
                <div className="bg-stone-50 p-3 flex items-center justify-center relative">
                  <img
                    src={book.coverUrl}
                    alt={book.titleEn}
                    className="w-28 h-38 object-cover rounded shadow group-hover:scale-105 transition-transform"
                  />
                  <span className="absolute top-2 left-2 bg-amber-500 text-stone-950 text-[9px] font-black uppercase px-1.5 py-0.5 rounded shadow">
                    Top
                  </span>
                </div>

                <div className="p-3 text-xs flex flex-col justify-between flex-1">
                  <div>
                    <h4 className="font-bold text-stone-900 line-clamp-2">{book.titleEn}</h4>
                    <p className="text-[11px] text-stone-500 truncate mt-0.5">{book.author}</p>
                  </div>
                  <div className="mt-3 pt-2 border-t border-stone-100 flex items-center justify-between">
                    <span className="font-mono font-bold text-emerald-950">
                      ₦{book.price.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-stone-500 capitalize">{book.format}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Islamic Schools & Bulk Orders Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-emerald-900 via-emerald-950 to-stone-900 text-white rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 border border-emerald-800">
          <div className="max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/40 uppercase">
              <GraduationCap className="w-4 h-4" />
              <span>For Madrasahs, Arabic Colleges & Schools</span>
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight text-white font-['Plus_Jakarta_Sans']">
              Equip Your Students with Authentic Approved Textbooks
            </h2>
            <p className="text-sm text-emerald-100 leading-relaxed font-light">
              Are you an Islamic school administrator in Ibadan, Lagos, Abeokuta, Ilorin, or across Nigeria? Order bulk copies of our approved Arabic grammar, Tajweed, Maliki fiqh, and Hadith textbooks with up to 25% institutional discount and coordinated school-gate delivery.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <button
                onClick={() => onNavigateTab('schools')}
                className="px-6 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold text-xs flex items-center gap-2 shadow-lg transition-transform active:scale-95"
              >
                <span>Request School Quotation</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="w-full md:w-auto shrink-0 bg-emerald-950/80 border border-emerald-800/80 p-6 rounded-2xl text-xs space-y-3 max-w-xs text-emerald-200">
            <h4 className="font-bold text-white text-sm">Madrasah Benefits:</h4>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Official institutional invoices & receipts</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Bulk packaging per classroom grade</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Direct delivery to your campus</span>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Featured Publishers Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block mb-1">
            Publishing Partners
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
            Verified Nigerian Islamic Publishers
          </h2>
          <p className="text-xs text-stone-500 mt-2">
            Meet the academic presses preserving authentic Islamic classical heritage and school curricula.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {publishers.map((pub) => (
            <div
              key={pub.id}
              className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-emerald-800 text-amber-300 flex items-center justify-center font-bold text-lg mb-4">
                  {pub.businessName[0]}
                </div>
                <h3 className="font-bold text-sm text-stone-900">{pub.businessName}</h3>
                <p className="text-xs text-emerald-800 font-semibold mt-0.5">
                  Based in {pub.city}, {pub.state} State
                </p>
                <p className="text-xs text-stone-500 mt-2 leading-relaxed line-clamp-3">{pub.bio}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
                <span>{pub.booksCount || 5} Publications</span>
                <span className="text-emerald-800 font-bold">Verified Partner</span>
              </div>
            </div>
          ))}
        </div>

        {/* Call to join as publisher */}
        <div className="mt-8 bg-amber-50 border border-amber-200 rounded-2xl p-6 text-center max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-left">
            <h4 className="font-bold text-stone-900 text-sm">Are you an Islamic Author or Publisher?</h4>
            <p className="text-xs text-stone-600 mt-0.5">
              Publish your manuscripts, set your retail prices, and earn transparent royalties.
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('publisher-portal')}
            className="px-5 py-2.5 rounded-xl bg-emerald-800 text-amber-300 hover:bg-emerald-900 font-bold text-xs shrink-0 shadow-sm transition-colors"
          >
            Join Marketplace as Publisher
          </button>
        </div>
      </section>

      {/* 7. Newsletter Subscription Form */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-8 border border-stone-200 text-center shadow-xs">
          <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto mb-3">
            <Mail className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-stone-900">Subscribe to IlmBooks Bulletin</h3>
          <p className="text-xs text-stone-500 max-w-md mx-auto mt-1 mb-6">
            Receive monthly updates on newly published Arabic literature, madrasah textbook releases, and academic research in West Africa.
          </p>

          {newsletterSubscribed ? (
            <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl text-xs font-semibold max-w-md mx-auto flex items-center justify-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>جزاكم الله خيراً! You have been subscribed to our monthly bulletin.</span>
            </div>
          ) : (
            <form onSubmit={handleNewsletter} className="max-w-md mx-auto flex gap-2">
              <input
                type="email"
                required
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="Enter your email address..."
                className="flex-1 bg-stone-50 border border-stone-300 rounded-xl px-4 py-2.5 text-xs focus:ring-2 focus:ring-emerald-700 focus:outline-none"
              />
              <button
                type="submit"
                className="px-5 py-2.5 bg-emerald-800 text-amber-300 hover:bg-emerald-900 font-bold text-xs rounded-xl shadow-sm transition-colors"
              >
                Subscribe
              </button>
            </form>
          )}
        </div>
      </section>

      {/* 8. Footer */}
      <footer className="bg-[#022C22] text-stone-300 pt-16 pb-8 border-t border-emerald-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-12 border-b border-emerald-800/60 text-xs">
            {/* Col 1 */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="font-['Amiri'] text-2xl font-bold text-amber-400">علم</span>
                <span className="text-xl font-extrabold text-white">IlmBooks</span>
              </div>
              <p className="text-stone-400 text-xs leading-relaxed">
                Knowledge, Books and Community. Dedicated to the advancement of authentic Islamic education, classical Arabic literacy, and Yoruba scholarship across South-West Nigeria and beyond.
              </p>
              <p className="text-[11px] text-amber-300/80 font-mono">
                RC Number: 1849204 | Ibadan, Oyo State, Nigeria
              </p>
            </div>

            {/* Col 2: Navigation */}
            <div className="space-y-2">
              <h4 className="font-bold text-white text-sm uppercase tracking-wider mb-2">Bookstore</h4>
              <ul className="space-y-1.5 text-stone-400">
                <li><button onClick={() => onNavigateTab('books', 'arabic-language')} className="hover:text-amber-300">Arabic Language & Nahw</button></li>
                <li><button onClick={() => onNavigateTab('books', 'fiqh')} className="hover:text-amber-300">Maliki Fiqh & Jurisprudence</button></li>
                <li><button onClick={() => onNavigateTab('books', 'quran-studies')} className="hover:text-amber-300">Qur’an & Tajweed Manuals</button></li>
                <li><button onClick={() => onNavigateTab('books', 'yoruba-bilingual')} className="hover:text-amber-300">Yoruba Translations</button></li>
                <li><button onClick={() => onNavigateTab('books', 'children')} className="hover:text-amber-300">Children's Moral Stories</button></li>
              </ul>
            </div>

            {/* Col 3: Institutional Services */}
            <div className="space-y-2">
              <h4 className="font-bold text-white text-sm uppercase tracking-wider mb-2">Institutional Services</h4>
              <ul className="space-y-1.5 text-stone-400">
                <li><button onClick={() => onNavigateTab('schools')} className="hover:text-amber-300">School & Madrasah Bulk Orders</button></li>
                <li><button onClick={() => onNavigateTab('publisher-portal')} className="hover:text-amber-300">Publisher Marketplace Portal</button></li>
                <li><button onClick={() => onNavigateTab('tracking')} className="hover:text-amber-300">Order Tracking & Waybill Check</button></li>
                <li><button onClick={() => onNavigateTab('admin-dashboard')} className="hover:text-amber-300">Administration Console</button></li>
              </ul>
            </div>

            {/* Col 4: Contact & South-West Dispatch */}
            <div className="space-y-2">
              <h4 className="font-bold text-white text-sm uppercase tracking-wider mb-2">Contact & Logistics</h4>
              <p className="text-stone-400 text-xs">
                <strong>South-West Dispatch Hub:</strong><br />
                Bodija Market Rd / Ring Road, Ibadan, Oyo State.<br />
                <strong>Lagos Depo:</strong> Ikeja, Lagos State.
              </p>
              <p className="text-stone-400 text-xs pt-1">
                <strong>WhatsApp / Orders:</strong> +234 803 241 8892<br />
                <strong>Email:</strong> support@ilmbooks.ng
              </p>
            </div>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
            <p>© {new Date().getFullYear()} IlmBooks Nigeria. All rights reserved. Knowledge, Books and Community.</p>
            <div className="flex gap-4">
              <span>Privacy Policy</span>
              <span>Terms of Service</span>
              <span>Publisher Agreement</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
