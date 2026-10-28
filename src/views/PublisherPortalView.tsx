import React, { useState, useEffect } from 'react';
import {
  Briefcase,
  BookPlus,
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  Upload,
  Plus,
  Building,
  Eye,
  Check,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { Book, Publisher } from '../types/index.ts';
import { getBooks, saveBook, getPublishers, savePublisher } from '../services/storeService.ts';
import { CATEGORIES } from '../data/initialData.ts';
import { useAuth } from '../context/AuthContext.tsx';

export const PublisherPortalView: React.FC = () => {
  const { currentUser } = useAuth();
  const [books, setBooks] = useState<Book[]>([]);
  const [myPublisherProfile, setMyPublisherProfile] = useState<Publisher | null>(null);
  const [activeTab, setActiveTab] = useState<'listings' | 'submit' | 'earnings' | 'profile'>('listings');
  
  // Submit new book form fields
  const [titleEn, setTitleEn] = useState('');
  const [titleAr, setTitleAr] = useState('');
  const [author, setAuthor] = useState('');
  const [authorAr, setAuthorAr] = useState('');
  const [category, setCategory] = useState('arabic-language');
  const [language, setLanguage] = useState<Book['language']>('Arabic');
  const [format, setFormat] = useState<Book['format']>('paperback');
  const [price, setPrice] = useState<number>(3500);
  const [stock, setStock] = useState<number>(50);
  const [isbn, setIsbn] = useState('');
  const [pages, setPages] = useState<number>(120);
  const [publicationYear, setPublicationYear] = useState<number>(2025);
  const [description, setDescription] = useState('');
  const [coverUrl, setCoverUrl] = useState('');
  const [sampleExcerpt, setSampleExcerpt] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Profile registration / edit form fields
  const [businessName, setBusinessName] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [state, setState] = useState('Oyo');
  const [bio, setBio] = useState('');
  const [bankName, setBankName] = useState('Jaiz Bank PLC');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountName, setAccountName] = useState('');
  const [payoutRequested, setPayoutRequested] = useState(false);

  useEffect(() => {
    loadData();
  }, [currentUser]);

  const loadData = async () => {
    const allPublishers = await getPublishers();
    // Match by userId or fallback to primary publisher
    let currentPub = allPublishers.find((p) => p.userId === currentUser?.uid);
    if (!currentPub) {
      currentPub = allPublishers[0]; // Darul-Ilm default for demo
    }
    setMyPublisherProfile(currentPub);
    if (currentPub) {
      setBusinessName(currentPub.businessName);
      setContactPerson(currentPub.contactPerson);
      setPhone(currentPub.phone);
      setEmail(currentPub.email);
      setState(currentPub.state);
      setBio(currentPub.bio);
      setBankName(currentPub.bankName || 'Jaiz Bank PLC');
      setAccountNumber(currentPub.accountNumber || '');
      setAccountName(currentPub.accountName || '');
    }

    const allBooks = await getBooks();
    // Filter books published by this publisher
    const publisherBooks = allBooks.filter(
      (b) => b.publisherId === currentPub?.id || b.publisherName === currentPub?.businessName
    );
    setBooks(publisherBooks);
  };

  const handleBookSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!titleEn || !author || !description) {
      alert('Please fill out required title, author, and description fields.');
      return;
    }

    setIsSubmitting(true);
    const bookId = 'ilm-pub-' + Math.floor(1000 + Math.random() * 9000);

    const newBook: Book = {
      id: bookId,
      titleEn,
      titleAr,
      author,
      authorAr,
      publisherId: myPublisherProfile?.id || 'pub-darul-ilm',
      publisherName: myPublisherProfile?.businessName || 'Darul-Ilm Academic Press',
      isbn: isbn || `978-978-${Math.floor(1000 + Math.random() * 9000)}-01`,
      category,
      language,
      format,
      price: Number(price),
      stock: Number(stock),
      isFeatured: false,
      isBestSeller: false,
      status: 'pending', // Administrator must approve new listings
      description,
      coverUrl: coverUrl || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=700&q=80',
      pages: Number(pages),
      publicationYear: Number(publicationYear),
      sampleExcerpt,
      tags: ['Publisher Submission', category, language],
      rating: 5.0,
      reviewsCount: 0,
      createdAt: new Date().toISOString(),
    };

    try {
      await saveBook(newBook);
      setSubmitSuccess(true);
      setTitleEn('');
      setTitleAr('');
      setAuthor('');
      setDescription('');
      setSampleExcerpt('');
      await loadData();
      setActiveTab('listings');
    } catch (err) {
      console.error('Book submission failed:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!myPublisherProfile) return;

    const updatedProfile: Publisher = {
      ...myPublisherProfile,
      businessName,
      contactPerson,
      phone,
      email,
      state,
      bio,
      bankName,
      accountNumber,
      accountName,
    };

    await savePublisher(updatedProfile);
    setMyPublisherProfile(updatedProfile);
    alert('Publisher Profile updated successfully!');
  };

  const handleRequestPayout = () => {
    setPayoutRequested(true);
    setTimeout(() => {
      alert(`Payout request of ₦${myPublisherProfile?.pendingPayout?.toLocaleString()} submitted for administrator review.`);
      setPayoutRequested(false);
    }, 1000);
  };

  const commissionRate = myPublisherProfile?.commissionRate || 15;
  const publisherShareRate = 100 - commissionRate;
  const totalSales = myPublisherProfile?.totalSales || 485000;
  const earnedRoyalties = Math.round((totalSales * publisherShareRate) / 100);
  const pendingPayout = myPublisherProfile?.pendingPayout || 62000;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="bg-[#064E3B] text-white rounded-3xl p-8 shadow-xl border border-emerald-800 relative overflow-hidden mb-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-900 border border-emerald-700 text-amber-300 text-xs font-bold uppercase tracking-wider mb-2">
              <Briefcase className="w-3.5 h-3.5" />
              <span>Publisher & Author Management Portal</span>
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              {myPublisherProfile?.businessName || 'Publisher Workspace'}
            </h1>
            <p className="text-xs text-emerald-200 mt-1">
              Account status:{' '}
              <span className="font-bold text-amber-300 uppercase tracking-wide">
                {myPublisherProfile?.status || 'Approved'} Partner
              </span>{' '}
              | Operating from {myPublisherProfile?.state || 'Oyo'} State
            </p>
          </div>

          <button
            onClick={() => setActiveTab('submit')}
            className="px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs flex items-center gap-2 shadow-lg transition-transform active:scale-95"
          >
            <BookPlus className="w-4 h-4" />
            <span>Submit New Book for Approval</span>
          </button>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-6 border-t border-emerald-800/80 text-xs">
          <div className="bg-emerald-950/50 p-3.5 rounded-xl border border-emerald-800">
            <span className="text-emerald-300 text-[11px] block">Catalogue Titles</span>
            <span className="text-xl font-extrabold text-white font-mono">{books.length}</span>
          </div>
          <div className="bg-emerald-950/50 p-3.5 rounded-xl border border-emerald-800">
            <span className="text-emerald-300 text-[11px] block">Gross Platform Sales</span>
            <span className="text-xl font-extrabold text-white font-mono">₦{totalSales.toLocaleString()}</span>
          </div>
          <div className="bg-emerald-950/50 p-3.5 rounded-xl border border-emerald-800">
            <span className="text-emerald-300 text-[11px] block">
              Earned Royalties ({publisherShareRate}%)
            </span>
            <span className="text-xl font-extrabold text-amber-300 font-mono">
              ₦{earnedRoyalties.toLocaleString()}
            </span>
          </div>
          <div className="bg-emerald-950/50 p-3.5 rounded-xl border border-emerald-800">
            <span className="text-emerald-300 text-[11px] block">Pending Payout</span>
            <span className="text-xl font-extrabold text-white font-mono">
              ₦{pendingPayout.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-stone-200 pb-3 mb-8 gap-4 text-xs font-bold">
        <button
          onClick={() => setActiveTab('listings')}
          className={`pb-2 border-b-2 transition-colors flex items-center gap-1.5 ${
            activeTab === 'listings'
              ? 'border-emerald-800 text-emerald-950 text-sm'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>My Publications ({books.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('submit')}
          className={`pb-2 border-b-2 transition-colors flex items-center gap-1.5 ${
            activeTab === 'submit'
              ? 'border-emerald-800 text-emerald-950 text-sm'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <BookPlus className="w-4 h-4" />
          <span>Submit Manuscript / Title</span>
        </button>
        <button
          onClick={() => setActiveTab('earnings')}
          className={`pb-2 border-b-2 transition-colors flex items-center gap-1.5 ${
            activeTab === 'earnings'
              ? 'border-emerald-800 text-emerald-950 text-sm'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <DollarSign className="w-4 h-4" />
          <span>Royalties & Bank Payouts</span>
        </button>
        <button
          onClick={() => setActiveTab('profile')}
          className={`pb-2 border-b-2 transition-colors flex items-center gap-1.5 ${
            activeTab === 'profile'
              ? 'border-emerald-800 text-emerald-950 text-sm'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <Building className="w-4 h-4" />
          <span>Publisher Profile & Bank Info</span>
        </button>
      </div>

      {/* Tab 1: Listings */}
      {activeTab === 'listings' && (
        <div className="space-y-4">
          {books.length === 0 ? (
            <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center text-stone-500">
              <BookPlus className="w-12 h-12 text-stone-300 mx-auto mb-3" />
              <h3 className="font-bold text-stone-800 text-base mb-1">No Books Listed Yet</h3>
              <p className="text-xs max-w-sm mx-auto mb-4">
                Submit your Arabic grammar primers, Hadith commentaries or school texts for administrator review.
              </p>
              <button
                onClick={() => setActiveTab('submit')}
                className="px-4 py-2 bg-emerald-800 text-amber-300 rounded-xl text-xs font-bold hover:bg-emerald-900"
              >
                Submit First Title
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
              <div className="p-4 bg-stone-50 border-b border-stone-200 text-xs font-bold text-stone-600 flex justify-between">
                <span>Submitted Publications</span>
                <span>Review & Marketplace Status</span>
              </div>
              <div className="divide-y divide-stone-100">
                {books.map((b) => (
                  <div key={b.id} className="p-4 flex items-center justify-between gap-4 text-xs">
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={b.coverUrl}
                        alt={b.titleEn}
                        className="w-12 h-16 object-cover rounded shadow-xs bg-stone-100 shrink-0"
                      />
                      <div className="min-w-0">
                        {b.titleAr && (
                          <p className="font-['Amiri'] text-emerald-800 font-bold truncate text-right dir-rtl">
                            {b.titleAr}
                          </p>
                        )}
                        <h4 className="font-bold text-stone-900 truncate">{b.titleEn}</h4>
                        <p className="text-stone-500 text-[11px] truncate">
                          By {b.author} | {b.language} | {b.format}
                        </p>
                        <p className="text-emerald-900 font-mono font-bold mt-0.5">
                          ₦{b.price.toLocaleString()} ({b.stock} units in stock)
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          b.status === 'approved'
                            ? 'bg-emerald-100 text-emerald-900'
                            : b.status === 'rejected'
                            ? 'bg-rose-100 text-rose-900'
                            : 'bg-amber-100 text-amber-900 animate-pulse'
                        }`}
                      >
                        {b.status === 'approved' ? 'Active & Live' : b.status === 'pending' ? 'Pending Approval' : 'Revision Required'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Submit New Title */}
      {activeTab === 'submit' && (
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-stone-200 shadow-xs max-w-3xl mx-auto">
          <div className="mb-6 pb-4 border-b border-stone-100">
            <h2 className="text-lg font-bold text-stone-900">Submit Book Listing for Approval</h2>
            <p className="text-xs text-stone-500 mt-1">
              All books are vetted for theological integrity, accurate Arabic typesetting, and proper ISBN copyright compliance before being published on IlmBooks.
            </p>
          </div>

          <form onSubmit={handleBookSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Title in English / Latin Script *
                </label>
                <input
                  type="text"
                  required
                  value={titleEn}
                  onChange={(e) => setTitleEn(e.target.value)}
                  placeholder="e.g. Matn Al-Bina' fi Ilm As-Sarf"
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Title in Arabic Script (العنوان بالعربية)
                </label>
                <input
                  type="text"
                  value={titleAr}
                  onChange={(e) => setTitleAr(e.target.value)}
                  placeholder="e.g. متن البناء في علم الصرف"
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 focus:ring-2 focus:ring-emerald-700 focus:outline-none font-['Amiri'] text-right dir-rtl"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Author / Compiler *
                </label>
                <input
                  type="text"
                  required
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="e.g. Imam al-Danqazi"
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Author Name in Arabic (اسم المؤلف)
                </label>
                <input
                  type="text"
                  value={authorAr}
                  onChange={(e) => setAuthorAr(e.target.value)}
                  placeholder="e.g. الإمام الدنقزي"
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 focus:ring-2 focus:ring-emerald-700 focus:outline-none font-['Amiri'] text-right dir-rtl"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Category *</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 focus:ring-2 focus:ring-emerald-700 focus:outline-none font-medium"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.nameEn}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Language *</label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value as Book['language'])}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 focus:ring-2 focus:ring-emerald-700 focus:outline-none font-medium"
                >
                  <option value="Arabic">Arabic Only</option>
                  <option value="Bilingual AR/EN">Bilingual Arabic & English</option>
                  <option value="Bilingual AR/YO">Bilingual Arabic & Yoruba</option>
                  <option value="Yoruba">Yoruba Only</option>
                  <option value="English">English</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Binding Format *</label>
                <select
                  value={format}
                  onChange={(e) => setFormat(e.target.value as Book['format'])}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 focus:ring-2 focus:ring-emerald-700 focus:outline-none font-medium"
                >
                  <option value="paperback">Paperback</option>
                  <option value="hardcover">Hardcover Volume</option>
                  <option value="digital">Digital PDF / eBook</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Retail Price in Nigerian Naira (₦) *
                </label>
                <input
                  type="number"
                  required
                  min={500}
                  step={100}
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 focus:ring-2 focus:ring-emerald-700 focus:outline-none font-mono font-bold"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Initial Stock Copies *
                </label>
                <input
                  type="number"
                  required
                  min={1}
                  value={stock}
                  onChange={(e) => setStock(Number(e.target.value))}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 focus:ring-2 focus:ring-emerald-700 focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">ISBN Number (Optional)</label>
                <input
                  type="text"
                  value={isbn}
                  onChange={(e) => setIsbn(e.target.value)}
                  placeholder="e.g. 978-978-5421-12-8"
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 focus:ring-2 focus:ring-emerald-700 focus:outline-none font-mono"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-semibold text-stone-700 mb-1">Cover Image URL</label>
                <input
                  type="url"
                  value={coverUrl}
                  onChange={(e) => setCoverUrl(e.target.value)}
                  placeholder="https://... (or leave empty for default cover)"
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-semibold text-stone-700 mb-1">
                  Book Description / Synopsis *
                </label>
                <textarea
                  rows={3}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the content, academic level, and target madrasah audience..."
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-semibold text-stone-700 mb-1">
                  Sample Excerpt in Arabic (نص من المتن)
                </label>
                <textarea
                  rows={2}
                  value={sampleExcerpt}
                  onChange={(e) => setSampleExcerpt(e.target.value)}
                  placeholder="مقتطف من المتن أو المقدمة بالتشكيل..."
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 focus:ring-2 focus:ring-emerald-700 focus:outline-none font-['Amiri'] text-right dir-rtl"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-4 rounded-xl bg-[#064E3B] text-amber-300 hover:text-white hover:bg-emerald-800 font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition-all"
            >
              <Upload className="w-4 h-4" />
              <span>{isSubmitting ? 'Uploading & Submitting...' : 'Submit Listing for Admin Approval'}</span>
            </button>
          </form>
        </div>
      )}

      {/* Tab 3: Royalties & Payouts */}
      {activeTab === 'earnings' && (
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-stone-200 shadow-xs">
            <h2 className="text-base font-bold text-stone-900 mb-1">Marketplace Commission & Royalties</h2>
            <p className="text-xs text-stone-500 mb-6">
              Standard marketplace split: <strong>{commissionRate}% Platform Fee</strong> (payment processing, server hosting, packaging) and <strong>{publisherShareRate}% Direct Publisher Royalty</strong>.
            </p>

            <div className="bg-stone-50 rounded-xl p-4 border border-stone-200 space-y-3 text-xs mb-6">
              <div className="flex justify-between">
                <span className="text-stone-600">Total Book Sales Generated:</span>
                <span className="font-mono font-bold text-stone-900">₦{totalSales.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-600">Platform Service Commission ({commissionRate}%):</span>
                <span className="font-mono text-stone-500">
                  - ₦{Math.round((totalSales * commissionRate) / 100).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t border-stone-200 font-bold text-sm text-emerald-950">
                <span>Net Publisher Earnings:</span>
                <span className="font-mono text-emerald-900">₦{earnedRoyalties.toLocaleString()}</span>
              </div>
            </div>

            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between">
              <div>
                <span className="text-xs text-emerald-900 font-semibold block">Available Settlement Balance:</span>
                <span className="text-2xl font-extrabold text-emerald-950 font-mono">
                  ₦{pendingPayout.toLocaleString()}
                </span>
                <span className="text-[11px] text-emerald-700 block mt-0.5">
                  Direct transfer to {myPublisherProfile?.bankName} ({myPublisherProfile?.accountNumber})
                </span>
              </div>

              <button
                onClick={handleRequestPayout}
                disabled={payoutRequested || pendingPayout === 0}
                className="px-5 py-2.5 rounded-xl bg-emerald-800 text-amber-300 hover:text-white hover:bg-emerald-900 font-bold text-xs shadow-md transition-all disabled:opacity-50"
              >
                {payoutRequested ? 'Requesting...' : 'Request Bank Payout'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Profile & Bank Info */}
      {activeTab === 'profile' && (
        <div className="max-w-2xl mx-auto bg-white rounded-2xl p-6 sm:p-8 border border-stone-200 shadow-xs">
          <h2 className="text-base font-bold text-stone-900 mb-1">Publisher & Settlement Settings</h2>
          <p className="text-xs text-stone-500 mb-6">
            Configure your registered publishing imprint and Nigerian bank account details for automated royalty transfers.
          </p>

          <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-stone-700 mb-1">Publishing House / Imprint *</label>
              <input
                type="text"
                required
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 focus:ring-2 focus:ring-emerald-700 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Contact Person *</label>
                <input
                  type="text"
                  required
                  value={contactPerson}
                  onChange={(e) => setContactPerson(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Phone / WhatsApp *</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">Settlement Bank Name (NUBAN) *</label>
              <select
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 focus:ring-2 focus:ring-emerald-700 focus:outline-none font-semibold"
              >
                <option value="Jaiz Bank PLC">Jaiz Bank PLC (Non-Interest)</option>
                <option value="Lotus Bank Ltd">Lotus Bank Ltd</option>
                <option value="TAJBank Ltd">TAJBank Ltd</option>
                <option value="Stanbic IBTC Bank">Stanbic IBTC Bank</option>
                <option value="First Bank of Nigeria">First Bank of Nigeria</option>
                <option value="Guaranty Trust Bank (GTBank)">Guaranty Trust Bank (GTBank)</option>
                <option value="Zenith Bank PLC">Zenith Bank PLC</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">10-Digit Account Number *</label>
                <input
                  type="text"
                  maxLength={10}
                  required
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  placeholder="0012398451"
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 font-mono focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Account Holder Name *</label>
                <input
                  type="text"
                  required
                  value={accountName}
                  onChange={(e) => setAccountName(e.target.value)}
                  placeholder="Darul-Ilm Academic Press Ltd"
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-emerald-800 text-amber-300 hover:text-white hover:bg-emerald-900 font-bold text-xs shadow-md transition-colors"
            >
              Save Publisher Profile
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
