import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserRole } from '../types/index.ts';
import { auth, googleAuthProvider } from '../lib/firebase.ts';
import { onAuthStateChanged, signInWithPopup, signOut as fbSignOut } from 'firebase/auth';

interface AuthContextType {
  currentUser: UserProfile | null;
  role: UserRole;
  setRole: (role: UserRole) => void;
  switchDemoUser: (role: UserRole) => void;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  wishlist: string[];
  toggleWishlist: (bookId: string) => void;
  isWishlisted: (bookId: string) => boolean;
}

const DEMO_USERS: Record<UserRole, UserProfile> = {
  customer: {
    uid: 'demo-customer-101',
    email: 'ahmad.ibrahim@example.ng',
    displayName: 'Ahmad Ibrahim',
    role: 'customer',
    phone: '+234 802 345 6789',
    state: 'Lagos',
    address: '14 Allen Avenue, Ikeja, Lagos State',
    createdAt: '2025-01-10T00:00:00Z',
  },
  publisher: {
    uid: 'user-pub-1',
    email: 'info@darulilmpress.ng',
    displayName: 'Ustadh Luqman (Darul-Ilm Press)',
    role: 'publisher',
    phone: '+234 803 241 8892',
    state: 'Oyo',
    address: 'Bompai Road / Bodija Market Rd, Ibadan',
    createdAt: '2025-01-15T00:00:00Z',
  },
  admin: {
    uid: 'admin-hq-master',
    email: 'adekolaabdullah56@gmail.com',
    displayName: 'Abdullah (Admin HQ)',
    role: 'admin',
    phone: '+234 800 456 2665',
    state: 'Oyo',
    address: 'IlmBooks Headquarters, Ring Road, Ibadan',
    createdAt: '2024-12-01T00:00:00Z',
  },
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('ilmbooks_current_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return DEMO_USERS.customer;
  });

  const [wishlist, setWishlist] = useState<string[]>(() => {
    const saved = localStorage.getItem('ilmbooks_wishlist');
    return saved ? JSON.parse(saved) : ['ilm-001', 'ilm-003'];
  });

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('ilmbooks_current_user', JSON.stringify(currentUser));
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('ilmbooks_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  // Optional real Firebase Auth listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (fbUser) => {
      if (fbUser) {
        const isAdmin = fbUser.email === 'adekolaabdullah56@gmail.com' || fbUser.email?.includes('admin');
        const role: UserRole = isAdmin ? 'admin' : 'customer';
        setCurrentUser({
          uid: fbUser.uid,
          email: fbUser.email || 'user@example.com',
          displayName: fbUser.displayName || 'IlmBooks User',
          role,
          phone: fbUser.phoneNumber || undefined,
          createdAt: new Date().toISOString(),
        });
      }
    });
    return () => unsubscribe();
  }, []);

  const switchDemoUser = (role: UserRole) => {
    const user = DEMO_USERS[role];
    setCurrentUser(user);
  };

  const setRole = (newRole: UserRole) => {
    if (currentUser) {
      setCurrentUser({ ...currentUser, role: newRole });
    }
  };

  const loginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleAuthProvider);
      const fbUser = result.user;
      const isAdmin = fbUser.email === 'adekolaabdullah56@gmail.com' || fbUser.email?.includes('admin');
      setCurrentUser({
        uid: fbUser.uid,
        email: fbUser.email || 'user@example.com',
        displayName: fbUser.displayName || 'IlmBooks Member',
        role: isAdmin ? 'admin' : 'customer',
        createdAt: new Date().toISOString(),
      });
    } catch (err) {
      console.warn('Google sign-in popup cancelled or error:', err);
    }
  };

  const logout = async () => {
    try {
      await fbSignOut(auth);
    } catch {
      // ignore
    }
    setCurrentUser(null);
  };

  const toggleWishlist = (bookId: string) => {
    setWishlist((prev) =>
      prev.includes(bookId) ? prev.filter((id) => id !== bookId) : [...prev, bookId]
    );
  };

  const isWishlisted = (bookId: string) => wishlist.includes(bookId);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        role: currentUser?.role || 'customer',
        setRole,
        switchDemoUser,
        loginWithGoogle,
        logout,
        wishlist,
        toggleWishlist,
        isWishlisted,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
