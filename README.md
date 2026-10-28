# IlmBooks — Arabic and Islamic Publishing Marketplace

> "Knowledge, Books and Community."

**IlmBooks** is a full-featured Arabic and Islamic book publishing and marketplace platform serving South-West Nigeria initially (Lagos, Oyo/Ibadan, Ogun, Osun, Ondo, Ekiti, Kwara) and expanding nationwide and internationally.

---

## 🌟 Key Features

1. **Editorial Bookstore & Catalogue**:
   - Curated collections: Arabic Language & Grammar (Nahw/Sarf), Qur’anic Studies & Tajweed, Hadith & Sunnah, Maliki Fiqh & Jurisprudence, Seerah & Islamic History, Children's Moral Stories, Islamic School Textbooks, and Yoruba Translations.
   - Dual-language typography with Arabic script (`Amiri`, `Cairo`) and full Tashkeel vocalization support.
   - Dynamic multi-facet filtering (Category, Language, Format, Price, Popularity).
   - Book detail modal with sample text excerpts (نصوص المتون), publication specs, and ISBN.

2. **Full E-Commerce & Checkout**:
   - Live shopping cart with regional delivery rate calculator for South-West Nigeria states and nationwide dispatch.
   - Paystack online payment gateway simulation (Cards, Bank Transfer, USSD).
   - Cash on Delivery (COD) for eligible Lagos, Ibadan, and Ogun delivery zones.
   - Direct WhatsApp ordering option with automated cart invoice links.
   - Instant order tracking with courier waybill updates.

3. **Publisher & Author Partner Portal**:
   - Publisher registration and brand profile management.
   - Book manuscript and title submission with mandatory administrator vetting.
   - Sales volume, gross revenue, and royalty calculation (standard 15% platform commission / 85% publisher payout).
   - Nigerian NUBAN bank account settlement management (Jaiz Bank, Lotus Bank, etc.) with payout request workflow.

4. **Islamic Schools & Madrasah Bulk Orders Desk**:
   - Dedicated quotation portal for primary madrasahs, junior/senior secondary colleges, and Arabic institutes.
   - Institutional bulk discount pricing (10% to 25% OFF publisher prices).
   - Administrator quote review and custom quote generation with official notes.

5. **Customer Accounts & Digital Library**:
   - Multi-role demo switcher (Customer, Publisher, Administrator) for instant testing.
   - Customer order history with live status timelines.
   - Digital Library for instant reading and downloading of purchased PDF eBooks.
   - Saved Wishlist.

6. **Central Administrator HQ**:
   - Platform KPI metrics (Gross verified revenue, retained commissions, total order volume).
   - 1-click book approval queue for publisher submissions.
   - Order fulfillment manager (Pending → Processing → Shipped with Waybill → Delivered).
   - School bulk enquiry reviewer and quote generator.
   - Publisher verification directory and stock inventory management.

---

## 🏗️ Architecture & Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS, Lucide Icons, Google Fonts (`Amiri`, `Cairo`, `Plus Jakarta Sans`).
- **Backend & Persistence**: Firebase Firestore (`ai-studio-d71d35c2-1981-4256-9d42-10c13e964cb8`) with deployed hardened security rules (`firestore.rules`) and local persistence fallback.
- **Payment Verification**: Paystack test and live verification flow.

---

## 🚀 Running Locally

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev

# 3. Build for production
npm run build
```
