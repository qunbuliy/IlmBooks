import React, { createContext, useContext, useState, useEffect } from 'react';
import { Book, BookFormat, CartItem } from '../types/index.ts';
import { NIGERIAN_STATES_SHIPPING } from '../data/initialData.ts';

interface CartContextType {
  cart: CartItem[];
  addToCart: (book: Book, format?: BookFormat, quantity?: number) => void;
  removeFromCart: (bookId: string, format: BookFormat) => void;
  updateQuantity: (bookId: string, format: BookFormat, quantity: number) => void;
  clearCart: () => void;
  subtotal: number;
  shippingFee: number;
  total: number;
  selectedState: string;
  setSelectedState: (state: string) => void;
  totalItemsCount: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  hasPhysicalItems: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('ilmbooks_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [selectedState, setSelectedState] = useState<string>('Oyo');
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('ilmbooks_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (book: Book, format: BookFormat = book.format, quantity: number = 1) => {
    setCart((prev) => {
      const existing = prev.find(
        (item) => item.book.id === book.id && item.selectedFormat === format
      );
      if (existing) {
        return prev.map((item) =>
          item.book.id === book.id && item.selectedFormat === format
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { book, selectedFormat: format, quantity }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (bookId: string, format: BookFormat) => {
    setCart((prev) =>
      prev.filter((item) => !(item.book.id === bookId && item.selectedFormat === format))
    );
  };

  const updateQuantity = (bookId: string, format: BookFormat, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(bookId, format);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.book.id === bookId && item.selectedFormat === format
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => setCart([]);

  const subtotal = cart.reduce((sum, item) => sum + item.book.price * item.quantity, 0);

  const hasPhysicalItems = cart.some((item) => item.selectedFormat !== 'digital');

  const shippingInfo = NIGERIAN_STATES_SHIPPING.find((s) => s.state === selectedState);
  const shippingFee = !hasPhysicalItems ? 0 : (shippingInfo?.fee || 2000);
  const total = subtotal + shippingFee;

  const totalItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        subtotal,
        shippingFee,
        total,
        selectedState,
        setSelectedState,
        totalItemsCount,
        isCartOpen,
        setIsCartOpen,
        hasPhysicalItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};
