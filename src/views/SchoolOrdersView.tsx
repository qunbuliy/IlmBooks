import React, { useState, useEffect } from 'react';
import {
  GraduationCap,
  BookOpen,
  Send,
  CheckCircle2,
  Clock,
  FileText,
  Truck,
  ShieldCheck,
  Building,
  UserCheck,
  Phone,
  Mail,
  MapPin,
  Sparkles,
} from 'lucide-react';
import { BulkOrderEnquiry } from '../types/index.ts';
import { submitBulkOrder, getBulkOrders } from '../services/storeService.ts';
import { NIGERIAN_STATES_SHIPPING } from '../data/initialData.ts';
import { useAuth } from '../context/AuthContext.tsx';

export const SchoolOrdersView: React.FC = () => {
  const { currentUser } = useAuth();
  const [schoolName, setSchoolName] = useState('');
  const [contactPerson, setContactPerson] = useState(currentUser?.displayName || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [state, setState] = useState('Oyo');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [curriculumLevel, setCurriculumLevel] = useState('Primary (Ibtida’i)');
  const [requiredSubjects, setRequiredSubjects] = useState('');
  const [estimatedQuantity, setEstimatedQuantity] = useState<number>(100);
  const [notes, setNotes] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);
  const [myEnquiries, setMyEnquiries] = useState<BulkOrderEnquiry[]>([]);
  const [activeTab, setActiveTab] = useState<'form' | 'my-quotes'>('form');

  useEffect(() => {
    loadEnquiries();
  }, [currentUser, successMessage]);

  const loadEnquiries = async () => {
    try {
      const orders = await getBulkOrders(false, currentUser?.email);
      setMyEnquiries(orders);
    } catch (err) {
      console.warn('Could not load bulk enquiries:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!schoolName || !contactPerson || !email || !phone || !requiredSubjects) {
      alert('Please fill out all mandatory school details.');
      return;
    }

    setIsSubmitting(true);
    const enquiryId = 'BLK-ILM-' + Math.floor(100000 + Math.random() * 900000);

    const enquiry: BulkOrderEnquiry = {
      id: enquiryId,
      userId: currentUser?.uid,
      schoolName,
      contactPerson,
      email,
      phone,
      state,
      city: city || 'City',
      address: address || 'School Address',
      curriculumLevel,
      requiredSubjects,
      estimatedQuantity,
      notes,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    try {
      await submitBulkOrder(enquiry);
      setSuccessMessage(true);
      setSchoolName('');
      setRequiredSubjects('');
      setNotes('');
      await loadEnquiries();
    } catch (err) {
      console.error('Failed to submit bulk enquiry:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Hero Header */}
      <div className="bg-gradient-to-br from-[#064E3B] to-[#022C22] text-white rounded-3xl p-8 sm:p-12 shadow-xl border border-emerald-800 relative overflow-hidden mb-12">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[radial-gradient(circle_at_top_right,rgba(245,158,11,0.15),transparent_70%)] pointer-events-none" />

        <div className="max-w-3xl relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-800/80 border border-emerald-600/60 text-amber-300 text-xs font-bold uppercase tracking-wider mb-4">
            <GraduationCap className="w-4 h-4 text-amber-400" />
            <span>Madrasah & Educational Institutions Desk</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white font-['Plus_Jakarta_Sans'] leading-tight">
            Bulk Textbooks & Curriculum Quotations for Islamic Schools
          </h1>

          <p className="mt-3 text-sm sm:text-base text-emerald-100/90 leading-relaxed">
            Supplying primary schools, secondary colleges, and Arabic institutes across 
            <strong> Lagos, Oyo, Ogun, Osun, Ondo, Ekiti, and nationwide</strong> with authentic, 
            vocalized Arabic readers, Tajweed textbooks, and Maliki jurisprudence curricula. 
            Enjoy institutional bulk pricing (10% to 25% discount) and coordinated school delivery.
          </p>

          <div className="mt-6 flex flex-wrap gap-4 text-xs font-semibold text-emerald-200">
            <div className="flex items-center gap-1.5 bg-emerald-950/60 px-3 py-1.5 rounded-lg border border-emerald-800">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>Standard Approved Curricula</span>
            </div>
            <div className="flex items-center gap-1.5 bg-emerald-950/60 px-3 py-1.5 rounded-lg border border-emerald-800">
              <Truck className="w-4 h-4 text-amber-400" />
              <span>Direct Madrasah Gate Dispatch</span>
            </div>
            <div className="flex items-center gap-1.5 bg-emerald-950/60 px-3 py-1.5 rounded-lg border border-emerald-800">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Official Institutional Invoices</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center justify-between border-b border-stone-200 pb-3 mb-8">
        <div className="flex gap-4 text-sm font-bold">
          <button
            onClick={() => setActiveTab('form')}
            className={`pb-2 border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'form'
                ? 'border-emerald-800 text-emerald-950'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Request School Quotation</span>
          </button>
          <button
            onClick={() => setActiveTab('my-quotes')}
            className={`pb-2 border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'my-quotes'
                ? 'border-emerald-800 text-emerald-950'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Track My School Enquiries ({myEnquiries.length})</span>
          </button>
        </div>
      </div>

      {/* Tab 1: Form */}
      {activeTab === 'form' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Form */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-6 sm:p-8 border border-stone-200 shadow-xs">
            {successMessage && (
              <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-sm">Quotation Request Submitted Successfully!</h4>
                  <p className="mt-0.5">
                    Our educational relations coordinator is reviewing your textbook quantities and will generate an official discounted quote within 24 hours. You can track status under the <strong>Track My School Enquiries</strong> tab.
                  </p>
                  <button
                    onClick={() => setSuccessMessage(false)}
                    className="mt-2 text-xs font-bold text-emerald-700 underline"
                  >
                    Submit another request
                  </button>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6 text-xs">
              {/* Institution Information */}
              <div>
                <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider mb-4 pb-2 border-b border-stone-100 flex items-center gap-2">
                  <Building className="w-4 h-4 text-emerald-700" />
                  <span>1. Institution & Administrative Contact</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">
                      School / Madrasah Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={schoolName}
                      onChange={(e) => setSchoolName(e.target.value)}
                      placeholder="e.g. Al-Bayan Arabic College, Ibadan"
                      className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">
                      Head Administrator / Principal Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={contactPerson}
                      onChange={(e) => setContactPerson(e.target.value)}
                      placeholder="e.g. Ustadh Rasheed Al-Ameen"
                      className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">Official Email *</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. info@albayan.edu.ng"
                      className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">
                      Telephone / WhatsApp Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g. +234 803 241 8892"
                      className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Delivery Location */}
              <div>
                <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider mb-4 pb-2 border-b border-stone-100 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-emerald-700" />
                  <span>2. Preferred Delivery Destination</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">State in Nigeria *</label>
                    <select
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 text-xs font-semibold focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                    >
                      {NIGERIAN_STATES_SHIPPING.map((s) => (
                        <option key={s.state} value={s.state}>
                          {s.state} State
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
                      placeholder="e.g. Bodija, Ibadan / Ikeja, Lagos"
                      className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block font-semibold text-stone-700 mb-1">
                      Campus Premises / Delivery Address *
                    </label>
                    <textarea
                      rows={2}
                      required
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Full physical campus address for courier logistics..."
                      className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Curriculum Requirements */}
              <div>
                <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider mb-4 pb-2 border-b border-stone-100 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-emerald-700" />
                  <span>3. Required Textbooks & Quantities</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">
                      Curriculum Level *
                    </label>
                    <select
                      value={curriculumLevel}
                      onChange={(e) => setCurriculumLevel(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 text-xs font-medium focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                    >
                      <option value="Primary (Ibtida’i)">Primary School (Ibtida’i)</option>
                      <option value="Junior Secondary (I’dadi)">Junior Secondary / I’dadi</option>
                      <option value="Senior Secondary (Thanawi)">Senior Secondary / Thanawi</option>
                      <option value="Advanced Arabic Institute / Markaz">
                        Advanced Arabic Institute / Markaz
                      </option>
                      <option value="Adult Islamic Evening Classes">Adult Islamic Evening Classes</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">
                      Estimated Student Volume / Copies *
                    </label>
                    <input
                      type="number"
                      required
                      min={10}
                      step={5}
                      value={estimatedQuantity}
                      onChange={(e) => setEstimatedQuantity(Number(e.target.value))}
                      className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 text-xs font-mono font-bold focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block font-semibold text-stone-700 mb-1">
                      Target Textbooks & Subjects (Comma-separated or list) *
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={requiredSubjects}
                      onChange={(e) => setRequiredSubjects(e.target.value)}
                      placeholder="e.g. Basic Arabic for Nigerian Primary Schools (Book 1-3), Tuhfat Al-Atfal Tajweed (100 copies), Matn Al-Ashmawiyyah Maliki Fiqh (50 copies), Nawawi 40 Hadith with Yoruba (60 copies)..."
                      className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-emerald-700 focus:outline-none font-mono"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block font-semibold text-stone-700 mb-1">
                      Additional Requirements / Term Deadline
                    </label>
                    <input
                      type="text"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="e.g. Required before resumption on Sept 15; require stamp of endorsement"
                      className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-6 rounded-xl bg-[#064E3B] text-amber-300 hover:text-white hover:bg-emerald-800 font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/20 transition-all active:scale-[0.99]"
              >
                <Send className="w-4 h-4" />
                <span>{isSubmitting ? 'Submitting Enquiry...' : 'Request Official School Quotation'}</span>
              </button>
            </form>
          </div>

          {/* Right Info Box */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4 text-xs">
              <h3 className="font-bold text-stone-900 text-sm flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Institutional Bulk Tiers</span>
              </h3>
              <p className="text-stone-600">
                IlmBooks works directly with verified publishers and printing houses in Nigeria to provide the most competitive educational rates.
              </p>
              <div className="space-y-2 pt-2 border-t border-stone-100">
                <div className="flex justify-between p-2 bg-stone-50 rounded-lg">
                  <span className="font-semibold text-stone-800">25 - 99 copies</span>
                  <span className="font-bold text-emerald-800 font-mono">10% OFF</span>
                </div>
                <div className="flex justify-between p-2 bg-stone-50 rounded-lg">
                  <span className="font-semibold text-stone-800">100 - 299 copies</span>
                  <span className="font-bold text-emerald-800 font-mono">15% OFF</span>
                </div>
                <div className="flex justify-between p-2 bg-emerald-50 rounded-lg border border-emerald-200">
                  <span className="font-semibold text-emerald-950">300+ copies</span>
                  <span className="font-bold text-emerald-800 font-mono">20% - 25% OFF</span>
                </div>
              </div>
            </div>

            <div className="bg-stone-100 p-6 rounded-2xl border border-stone-200 text-xs space-y-3">
              <h4 className="font-bold text-stone-900">Need Immediate Assistance?</h4>
              <p className="text-stone-600">
                Speak directly with our Madrasah Curriculum Relations Officer on WhatsApp for urgent term orders:
              </p>
              <a
                href="https://wa.me/2348032418892?text=Assalamu%20Alaykum,%20I%20am%20calling%20regarding%20Islamic%20School%20Bulk%20Textbooks"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-800 text-amber-300 font-bold rounded-xl hover:bg-emerald-900 transition-colors"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>WhatsApp: +234 803 241 8892</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: My Enquiries List */}
      {activeTab === 'my-quotes' && (
        <div className="space-y-4">
          {myEnquiries.length === 0 ? (
            <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center text-stone-500">
              <FileText className="w-12 h-12 text-stone-300 mx-auto mb-3" />
              <h3 className="font-bold text-stone-800 text-base mb-1">No School Enquiries Found</h3>
              <p className="text-xs max-w-sm mx-auto mb-4">
                You haven't submitted any bulk textbook requests under this email yet.
              </p>
              <button
                onClick={() => setActiveTab('form')}
                className="px-4 py-2 bg-emerald-800 text-amber-300 rounded-xl text-xs font-bold hover:bg-emerald-900"
              >
                Submit First Request
              </button>
            </div>
          ) : (
            myEnquiries.map((enq) => (
              <div
                key={enq.id}
                className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-bold text-emerald-900 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      {enq.id}
                    </span>
                    <span
                      className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                        enq.status === 'quoted'
                          ? 'bg-amber-100 text-amber-900'
                          : enq.status === 'fulfilled'
                          ? 'bg-emerald-100 text-emerald-900'
                          : 'bg-stone-100 text-stone-700'
                      }`}
                    >
                      {enq.status}
                    </span>
                  </div>
                  <h3 className="font-bold text-base text-stone-900 mt-1">{enq.schoolName}</h3>
                  <p className="text-xs text-stone-500">
                    Contact: {enq.contactPerson} | {enq.phone} | {enq.state} State ({enq.curriculumLevel})
                  </p>
                  <p className="text-xs text-stone-700 font-mono mt-1">
                    Books requested: <span className="font-semibold">{enq.requiredSubjects}</span> ({enq.estimatedQuantity} copies)
                  </p>
                </div>

                <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 min-w-[200px] text-right">
                  <div className="text-[10px] text-stone-500 uppercase font-semibold">Official Quote</div>
                  {enq.quotedAmount ? (
                    <div>
                      <div className="text-xl font-extrabold text-emerald-900 font-mono">
                        ₦{enq.quotedAmount.toLocaleString()}
                      </div>
                      <div className="text-[11px] text-amber-700 font-semibold">
                        Includes {enq.discountPercentage || 15}% School Discount
                      </div>
                      {enq.adminResponseNote && (
                        <p className="text-[11px] text-stone-600 mt-1 italic">
                          "{enq.adminResponseNote}"
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="text-xs text-amber-700 font-semibold mt-1">
                      Awaiting Administrator Review
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
