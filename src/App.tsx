/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext.tsx';
import { CartProvider, useCart } from './context/CartContext.tsx';
import { Navbar } from './components/Navbar.tsx';
import { CartDrawer } from './components/CartDrawer.tsx';
import { CheckoutModal } from './components/CheckoutModal.tsx';
import { BookDetailModal } from './components/BookDetailModal.tsx';
import { HomeView } from './views/HomeView.tsx';
import { BookstoreView } from './views/BookstoreView.tsx';
import { SchoolOrdersView } from './views/SchoolOrdersView.tsx';
import { PublisherPortalView } from './views/PublisherPortalView.tsx';
import { AdminDashboardView } from './views/AdminDashboardView.tsx';
import { AccountView } from './views/AccountView.tsx';
import { OrderTrackingView } from './views/OrderTrackingView.tsx';
import { getBooks, getPublishers } from './services/storeService.ts';
import { Book, Order, Publisher } from './types/index.ts';

function MainLayout() {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  const [books, setBooks] = useState<Book[]>([]);
  const [publishers, setPublishers] = useState<Publisher[]>([]);
  const [selectedBookForModal, setSelectedBookForModal] = useState<Book | null>(null);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [bList, pList] = await Promise.all([getBooks(), getPublishers()]);
      setBooks(bList);
      setPublishers(pList);
    } catch (err) {
      console.error('Error loading bookstore data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNavigateWithCategory = (tab: string, categoryId?: string) => {
    setActiveTab(tab);
    if (categoryId) {
      setSelectedCategory(categoryId);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearchTrigger = (query: string) => {
    setSearchQuery(query);
    setActiveTab('books');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-stone-900 selection:bg-amber-300 selection:text-stone-900">
      {/* Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onOpenSearch={() => setActiveTab('books')}
      />

      {/* Main View Router */}
      <main className="flex-1">
        {activeTab === 'home' && (
          <HomeView
            books={books}
            publishers={publishers}
            onSelectBook={(book) => setSelectedBookForModal(book)}
            onNavigateTab={handleNavigateWithCategory}
            onSearch={handleSearchTrigger}
          />
        )}

        {activeTab === 'books' && (
          <BookstoreView
            books={books}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            onSelectBook={(book) => setSelectedBookForModal(book)}
          />
        )}

        {activeTab === 'schools' && <SchoolOrdersView />}

        {activeTab === 'publisher-portal' && <PublisherPortalView />}

        {activeTab === 'admin-dashboard' && <AdminDashboardView />}

        {activeTab === 'account' && (
          <AccountView onSelectBook={(book) => setSelectedBookForModal(book)} />
        )}

        {activeTab === 'tracking' && <OrderTrackingView />}
      </main>

      {/* Cart Drawer */}
      <CartDrawer
        onProceedToCheckout={() => setIsCheckoutModalOpen(true)}
      />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutModalOpen}
        onClose={() => setIsCheckoutModalOpen(false)}
        onOrderSuccess={(order: Order) => {
          // Can refresh orders or switch to account
          loadData();
        }}
      />

      {/* Book Detail Modal */}
      <BookDetailModal
        book={selectedBookForModal}
        onClose={() => setSelectedBookForModal(null)}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <MainLayout />
      </CartProvider>
    </AuthProvider>
  );
}
