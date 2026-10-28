import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  query,
  where,
  orderBy,
  limit,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase.ts';
import { Book, BulkOrderEnquiry, Order, Publisher, UserProfile } from '../types/index.ts';
import { INITIAL_BOOKS, INITIAL_PUBLISHERS } from '../data/initialData.ts';

const LOCAL_STORAGE_KEY_BOOKS = 'ilmbooks_local_books_v1';
const LOCAL_STORAGE_KEY_ORDERS = 'ilmbooks_local_orders_v1';
const LOCAL_STORAGE_KEY_PUBLISHERS = 'ilmbooks_local_publishers_v1';
const LOCAL_STORAGE_KEY_BULK = 'ilmbooks_local_bulk_v1';

// Seed or retrieve books
export async function getBooks(): Promise<Book[]> {
  try {
    const booksCol = collection(db, 'books');
    const snapshot = await getDocs(booksCol);
    if (!snapshot.empty) {
      const books: Book[] = [];
      snapshot.forEach((d) => books.push(d.data() as Book));
      return books;
    }
  } catch (err) {
    console.warn('Firestore fetch failed or offline, checking local/initial cache:', err);
  }

  // Fallback to local storage or initial seeds
  const local = localStorage.getItem(LOCAL_STORAGE_KEY_BOOKS);
  if (local) {
    try {
      return JSON.parse(local);
    } catch {
      // ignore
    }
  }

  // Initialize with curated books
  localStorage.setItem(LOCAL_STORAGE_KEY_BOOKS, JSON.stringify(INITIAL_BOOKS));
  
  // Try to lazily populate Firestore in background
  try {
    for (const book of INITIAL_BOOKS) {
      setDoc(doc(db, 'books', book.id), book).catch(() => {});
    }
  } catch {
    // ignore
  }

  return INITIAL_BOOKS;
}

// Add or update a book listing
export async function saveBook(book: Book): Promise<void> {
  // Update local storage first
  const currentBooks = await getBooks();
  const existingIdx = currentBooks.findIndex((b) => b.id === book.id);
  let updated: Book[];
  if (existingIdx >= 0) {
    updated = [...currentBooks];
    updated[existingIdx] = book;
  } else {
    updated = [book, ...currentBooks];
  }
  localStorage.setItem(LOCAL_STORAGE_KEY_BOOKS, JSON.stringify(updated));

  // Sync with Firestore
  try {
    await setDoc(doc(db, 'books', book.id), book);
  } catch (error) {
    console.warn('Failed to save book to Firestore, saved to local storage:', error);
  }
}

// Update book approval status (Admin)
export async function updateBookStatus(bookId: string, status: 'approved' | 'rejected'): Promise<void> {
  const books = await getBooks();
  const target = books.find((b) => b.id === bookId);
  if (!target) return;

  const updatedBook = { ...target, status };
  await saveBook(updatedBook);
}

// Get Publishers
export async function getPublishers(): Promise<Publisher[]> {
  try {
    const pubCol = collection(db, 'publishers');
    const snapshot = await getDocs(pubCol);
    if (!snapshot.empty) {
      const pubs: Publisher[] = [];
      snapshot.forEach((d) => pubs.push(d.data() as Publisher));
      return pubs;
    }
  } catch (err) {
    console.warn('Firestore fetch publishers failed, using local/initial:', err);
  }

  const local = localStorage.getItem(LOCAL_STORAGE_KEY_PUBLISHERS);
  if (local) {
    try {
      return JSON.parse(local);
    } catch {
      // ignore
    }
  }

  localStorage.setItem(LOCAL_STORAGE_KEY_PUBLISHERS, JSON.stringify(INITIAL_PUBLISHERS));
  
  // Seed initial publishers to Firestore in background
  try {
    for (const pub of INITIAL_PUBLISHERS) {
      setDoc(doc(db, 'publishers', pub.id), pub).catch(() => {});
    }
  } catch {
    // ignore
  }

  return INITIAL_PUBLISHERS;
}

// Save or register publisher
export async function savePublisher(publisher: Publisher): Promise<void> {
  const currentPubs = await getPublishers();
  const existingIdx = currentPubs.findIndex((p) => p.id === publisher.id);
  let updated: Publisher[];
  if (existingIdx >= 0) {
    updated = [...currentPubs];
    updated[existingIdx] = publisher;
  } else {
    updated = [publisher, ...currentPubs];
  }
  localStorage.setItem(LOCAL_STORAGE_KEY_PUBLISHERS, JSON.stringify(updated));

  try {
    await setDoc(doc(db, 'publishers', publisher.id), publisher);
  } catch (error) {
    console.warn('Failed to save publisher to Firestore:', error);
  }
}

// Update publisher status
export async function updatePublisherStatus(publisherId: string, status: 'approved' | 'rejected'): Promise<void> {
  const pubs = await getPublishers();
  const target = pubs.find((p) => p.id === publisherId);
  if (!target) return;
  const updatedPub = { ...target, status };
  await savePublisher(updatedPub);
}

// Orders management
export async function getOrders(userId?: string, isAdmin: boolean = false): Promise<Order[]> {
  try {
    const ordersCol = collection(db, 'orders');
    const snapshot = await getDocs(ordersCol);
    if (!snapshot.empty) {
      const orders: Order[] = [];
      snapshot.forEach((d) => orders.push(d.data() as Order));
      if (isAdmin) return orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      if (userId) return orders.filter((o) => o.customerId === userId).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      return orders;
    }
  } catch (err) {
    console.warn('Firestore fetch orders failed, using local storage:', err);
  }

  const local = localStorage.getItem(LOCAL_STORAGE_KEY_ORDERS);
  const orders: Order[] = local ? JSON.parse(local) : [];
  if (isAdmin) return orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  if (userId) return orders.filter((o) => o.customerId === userId).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  return orders;
}

export async function createOrder(order: Order): Promise<void> {
  const local = localStorage.getItem(LOCAL_STORAGE_KEY_ORDERS);
  const currentOrders: Order[] = local ? JSON.parse(local) : [];
  const updated = [order, ...currentOrders];
  localStorage.setItem(LOCAL_STORAGE_KEY_ORDERS, JSON.stringify(updated));

  try {
    await setDoc(doc(db, 'orders', order.id), order);
  } catch (error) {
    console.warn('Failed to save order to Firestore:', error);
  }
}

export async function updateOrderStatus(orderId: string, orderStatus: Order['orderStatus'], trackingNumber?: string): Promise<void> {
  const local = localStorage.getItem(LOCAL_STORAGE_KEY_ORDERS);
  const currentOrders: Order[] = local ? JSON.parse(local) : [];
  const idx = currentOrders.findIndex((o) => o.id === orderId);
  if (idx >= 0) {
    currentOrders[idx].orderStatus = orderStatus;
    if (trackingNumber) currentOrders[idx].trackingNumber = trackingNumber;
    localStorage.setItem(LOCAL_STORAGE_KEY_ORDERS, JSON.stringify(currentOrders));
  }

  try {
    const ref = doc(db, 'orders', orderId);
    await updateDoc(ref, {
      orderStatus,
      ...(trackingNumber ? { trackingNumber } : {}),
    });
  } catch (error) {
    console.warn('Failed to update order status in Firestore:', error);
  }
}

// Bulk Order Enquiries (School Quotes)
export async function getBulkOrders(isAdmin: boolean = false, userEmail?: string): Promise<BulkOrderEnquiry[]> {
  try {
    const bulkCol = collection(db, 'bulkOrders');
    const snapshot = await getDocs(bulkCol);
    if (!snapshot.empty) {
      const enquiries: BulkOrderEnquiry[] = [];
      snapshot.forEach((d) => enquiries.push(d.data() as BulkOrderEnquiry));
      if (isAdmin) return enquiries.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      if (userEmail) return enquiries.filter((e) => e.email.toLowerCase() === userEmail.toLowerCase());
      return enquiries;
    }
  } catch (err) {
    console.warn('Firestore fetch bulk orders failed, using local storage:', err);
  }

  const local = localStorage.getItem(LOCAL_STORAGE_KEY_BULK);
  const enquiries: BulkOrderEnquiry[] = local ? JSON.parse(local) : [];
  if (isAdmin) return enquiries.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  if (userEmail) return enquiries.filter((e) => e.email.toLowerCase() === userEmail.toLowerCase());
  return enquiries;
}

export async function submitBulkOrder(enquiry: BulkOrderEnquiry): Promise<void> {
  const local = localStorage.getItem(LOCAL_STORAGE_KEY_BULK);
  const current: BulkOrderEnquiry[] = local ? JSON.parse(local) : [];
  const updated = [enquiry, ...current];
  localStorage.setItem(LOCAL_STORAGE_KEY_BULK, JSON.stringify(updated));

  try {
    await setDoc(doc(db, 'bulkOrders', enquiry.id), enquiry);
  } catch (error) {
    console.warn('Failed to save bulk order enquiry to Firestore:', error);
  }
}

export async function updateBulkOrderQuote(
  enquiryId: string,
  quotedAmount: number,
  discountPercentage: number,
  adminResponseNote: string,
  status: BulkOrderEnquiry['status']
): Promise<void> {
  const local = localStorage.getItem(LOCAL_STORAGE_KEY_BULK);
  const current: BulkOrderEnquiry[] = local ? JSON.parse(local) : [];
  const idx = current.findIndex((e) => e.id === enquiryId);
  if (idx >= 0) {
    current[idx].quotedAmount = quotedAmount;
    current[idx].discountPercentage = discountPercentage;
    current[idx].adminResponseNote = adminResponseNote;
    current[idx].status = status;
    localStorage.setItem(LOCAL_STORAGE_KEY_BULK, JSON.stringify(current));
  }

  try {
    const ref = doc(db, 'bulkOrders', enquiryId);
    await updateDoc(ref, {
      quotedAmount,
      discountPercentage,
      adminResponseNote,
      status,
    });
  } catch (error) {
    console.warn('Failed to update bulk order quote in Firestore:', error);
  }
}
