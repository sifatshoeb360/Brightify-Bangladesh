
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, Category, BlogPost, Testimonial, AppSettings, CartItem, Order, FormSubmission, Language, User, Review } from '../types';
import { INITIAL_PRODUCTS, INITIAL_CATEGORIES, INITIAL_BLOG_POSTS, INITIAL_TESTIMONIALS, INITIAL_SETTINGS, TRANSLATIONS } from '../constants';

interface AppContextType {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  categories: Category[];
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
  blogPosts: BlogPost[];
  setBlogPosts: React.Dispatch<React.SetStateAction<BlogPost[]>>;
  testimonials: Testimonial[];
  settings: AppSettings;
  setSettings: React.Dispatch<React.SetStateAction<AppSettings>>;
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  wishlist: Product[];
  toggleWishlist: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;
  orders: Order[];
  addOrder: (order: Order) => void;
  submissions: FormSubmission[];
  addSubmission: (type: 'contact' | 'newsletter', data: any) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: keyof typeof TRANSLATIONS.en) => string;
  // Auth & Reviews
  currentUser: User | null;
  users: User[];
  login: (email: string, pass: string) => boolean;
  register: (name: string, email: string, pass: string) => void;
  logout: () => void;
  addReview: (productId: string, rating: number, comment: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('language');
    return (saved as Language) || 'en';
  });

  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('site_users');
    return saved ? JSON.parse(saved) : [];
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('current_site_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [categories, setCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem('categories');
    return saved ? JSON.parse(saved) : INITIAL_CATEGORIES;
  });

  const [blogPosts, setBlogPosts] = useState<BlogPost[]>(() => {
    const saved = localStorage.getItem('blogPosts');
    return saved ? JSON.parse(saved) : INITIAL_BLOG_POSTS;
  });

  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem('settings');
    return saved ? JSON.parse(saved) : INITIAL_SETTINGS;
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [wishlist, setWishlist] = useState<Product[]>(() => {
    const saved = localStorage.getItem('wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('orders');
    return saved ? JSON.parse(saved) : [];
  });

  const [submissions, setSubmissions] = useState<FormSubmission[]>(() => {
    const saved = localStorage.getItem('submissions');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => localStorage.setItem('products', JSON.stringify(products)), [products]);
  useEffect(() => localStorage.setItem('categories', JSON.stringify(categories)), [categories]);
  useEffect(() => localStorage.setItem('blogPosts', JSON.stringify(blogPosts)), [blogPosts]);
  useEffect(() => localStorage.setItem('settings', JSON.stringify(settings)), [settings]);
  useEffect(() => localStorage.setItem('cart', JSON.stringify(cart)), [cart]);
  useEffect(() => localStorage.setItem('wishlist', JSON.stringify(wishlist)), [wishlist]);
  useEffect(() => localStorage.setItem('orders', JSON.stringify(orders)), [orders]);
  useEffect(() => localStorage.setItem('submissions', JSON.stringify(submissions)), [submissions]);
  useEffect(() => localStorage.setItem('language', language), [language]);
  useEffect(() => localStorage.setItem('site_users', JSON.stringify(users)), [users]);
  useEffect(() => localStorage.setItem('current_site_user', JSON.stringify(currentUser)), [currentUser]);

  const addToCart = (product: Product, quantity = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item);
      }
      return [...prev, { ...product, quantity }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    setCart(prev => prev.map(item => item.id === productId ? { ...item, quantity } : item));
  };

  const clearCart = () => setCart([]);

  const toggleWishlist = (product: Product) => {
    setWishlist(prev => {
      const exists = prev.find(item => item.id === product.id);
      if (exists) {
        return prev.filter(item => item.id !== product.id);
      }
      return [...prev, product];
    });
  };

  const isInWishlist = (productId: string) => wishlist.some(item => item.id === productId);

  const addOrder = (order: Order) => setOrders(prev => [order, ...prev]);

  const addSubmission = (type: 'contact' | 'newsletter', data: any) => {
    const newSub: FormSubmission = {
      id: Date.now().toString(),
      type,
      data,
      date: new Date().toISOString(),
      read: false
    };
    setSubmissions(prev => [newSub, ...prev]);
  };

  // Auth Functions
  const loginUser = (email: string, pass: string): boolean => {
    const user = users.find(u => u.email === email && u.password === pass);
    if (user) {
      setCurrentUser(user);
      return true;
    }
    return false;
  };

  const registerUser = (name: string, email: string, pass: string) => {
    const newUser: User = { id: Date.now().toString(), name, email, password: pass };
    setUsers(prev => [...prev, newUser]);
    setCurrentUser(newUser);
  };

  const logoutUser = () => {
    setCurrentUser(null);
  };

  const addReview = (productId: string, rating: number, comment: string) => {
    if (!currentUser) return;
    const newReview: Review = {
      id: Date.now().toString(),
      userId: currentUser.id,
      userName: currentUser.name,
      rating,
      comment,
      date: new Date().toLocaleDateString()
    };
    setProducts(prev => prev.map(p => {
      if (p.id === productId) {
        return { ...p, reviews: [...(p.reviews || []), newReview] };
      }
      return p;
    }));
  };

  const t = (key: keyof typeof TRANSLATIONS.en): string => {
    return TRANSLATIONS[language][key] || key;
  };

  return (
    <AppContext.Provider value={{
      products, setProducts, categories, setCategories, blogPosts, setBlogPosts, testimonials: INITIAL_TESTIMONIALS,
      settings, setSettings, cart, addToCart, removeFromCart, updateCartQuantity, clearCart, 
      wishlist, toggleWishlist, isInWishlist, orders, addOrder,
      submissions, addSubmission, language, setLanguage, t,
      currentUser, users, login: loginUser, register: registerUser, logout: logoutUser, addReview
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
