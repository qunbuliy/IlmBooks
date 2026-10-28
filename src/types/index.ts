export type BookFormat = 'paperback' | 'hardcover' | 'digital';
export type BookLanguage = 'Arabic' | 'English' | 'Yoruba' | 'Bilingual AR/EN' | 'Bilingual AR/YO';
export type PublicationStatus = 'pending' | 'approved' | 'rejected';
export type PaymentMethod = 'paystack' | 'cod' | 'whatsapp';
export type PaymentStatus = 'pending' | 'paid' | 'failed';
export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
export type UserRole = 'customer' | 'publisher' | 'admin';

export interface Book {
  id: string;
  titleEn: string;
  titleAr: string;
  author: string;
  authorAr?: string;
  publisherId: string;
  publisherName: string;
  isbn?: string;
  category: string;
  language: BookLanguage;
  format: BookFormat;
  price: number; // in NGN (Nigerian Naira)
  originalPrice?: number;
  stock: number;
  isFeatured?: boolean;
  isBestSeller?: boolean;
  status: PublicationStatus;
  description: string;
  descriptionAr?: string;
  coverUrl: string;
  digitalFileUrl?: string; // Authorized PDF preview / download
  pages?: number;
  publicationYear?: number;
  tags?: string[];
  rating?: number;
  reviewsCount?: number;
  sampleExcerpt?: string;
  createdAt: string;
}

export interface Category {
  id: string;
  nameEn: string;
  nameAr: string;
  description: string;
  iconName: string;
  count?: number;
}

export interface Publisher {
  id: string;
  userId: string;
  businessName: string;
  contactPerson: string;
  email: string;
  phone: string;
  state: string;
  city?: string;
  bio: string;
  status: 'pending' | 'approved' | 'rejected';
  commissionRate: number; // e.g. 15 for 15%
  bankName?: string;
  accountNumber?: string;
  accountName?: string;
  booksCount?: number;
  totalSales?: number;
  pendingPayout?: number;
  createdAt: string;
}

export interface CartItem {
  book: Book;
  quantity: number;
  selectedFormat: BookFormat;
}

export interface OrderItem {
  bookId: string;
  titleEn: string;
  titleAr?: string;
  author: string;
  price: number;
  quantity: number;
  format: BookFormat;
  coverUrl: string;
  digitalFileUrl?: string;
}

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  deliveryState: string;
  deliveryCity: string;
  deliveryAddress: string;
  items: OrderItem[];
  subtotal: number;
  shippingFee: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  paystackReference?: string;
  trackingNumber?: string;
  notes?: string;
  createdAt: string;
}

export interface BulkOrderEnquiry {
  id: string;
  userId?: string;
  schoolName: string;
  contactPerson: string;
  email: string;
  phone: string;
  state: string;
  city?: string;
  address: string;
  curriculumLevel: string; // e.g., 'Primary (Ibtida'i)', 'Junior Secondary', 'Senior Secondary (Thanawi)', 'Madrasah / Arabic College'
  requiredSubjects: string;
  estimatedQuantity: number;
  notes?: string;
  status: 'pending' | 'quoted' | 'fulfilled' | 'cancelled';
  quotedAmount?: number;
  discountPercentage?: number;
  adminResponseNote?: string;
  createdAt: string;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  phone?: string;
  state?: string;
  address?: string;
  createdAt: string;
}
