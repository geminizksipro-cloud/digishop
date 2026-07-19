/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Star, Gift, Flame, TrendingUp, Sparkles, Send, ShieldCheck, CheckCircle, 
  ChevronDown, MessageSquare, Award, Clock, ArrowUpRight, HelpCircle,
  Lock, Mail, Chrome, ArrowLeft, AlertCircle, ShieldAlert, Check, Download, Printer
} from 'lucide-react';
import { 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider 
} from 'firebase/auth';

import Header from './components/Header';
import Hero from './components/Hero';
import ProductCard from './components/ProductCard';
import ProductDetails from './components/ProductDetails';
import Cart from './components/Cart';
import UserProfile from './components/UserProfile';
import HelpCenter from './components/HelpCenter';
import AuthModal from './components/AuthModal';
import AdminDashboard, { ActivityLog } from './components/AdminDashboard';
import BrandLogo from './components/BrandLogo';

import { PRODUCTS, CATEGORIES } from './data/products';
import { Product, CartItem, Order, UserProfile as UserType } from './types';

import { auth } from './lib/firebase';
import { 
  getProductsFromFirestore, 
  saveProductToFirestore, 
  deleteProductFromFirestore, 
  getOrdersFromFirestore, 
  saveOrderToFirestore, 
  deleteOrderFromFirestore,
  getUsersFromFirestore, 
  saveUserToFirestore,
  getActivityLogsFromFirestore,
  saveActivityLogToFirestore,
  getUserProfileFromFirestore,
  getOrdersForUserFromFirestore
} from './lib/firebaseService';

import { getApiUrl } from './lib/api';

const INITIAL_USERS: UserType[] = [];

const BENGALI_REVIEWS = [
  {
    name: 'মেহরাব হোসেন',
    role: 'Freelance Web Developer',
    text: 'আমি DigiMarkt BD থেকে Gemini 18 Month Premium অ্যাকাউন্টটা নিয়েছিলাম। ৪ মাস হয়ে গেছে সার্ভিস একদম সুপারফাস্ট আর ফুল প্রিমিয়াম ফিচারের সব পাচ্ছি। কোনো ডাউনটাইম নাই!',
    product: 'Gemini 18-Month',
    avatar: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=Mehrab'
  },
  {
    name: 'তানজিমুল বারী',
    role: 'Lead Dev, Pixels BD',
    text: 'এদের পোর্টফোলিও ওয়েব টেমপ্লেট ডিজাইনগুলো অসাধারণ! সরাসরি রিঅ্যাক্ট কোড ডাউনলোড করে একটা প্রজেক্ট সাবমিট করেছি, ক্লায়েন্ট তো ডিজাইন দেখে পুরাই ফিদা। ৳১,৫০০ টাকা উসুল।',
    product: 'Portfolio UI Kit',
    avatar: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=Tanzim'
  },
  {
    name: 'নুসরাত জাহান',
    role: 'Frontend Engineer',
    text: 'bKash/Nagad integration SDK স্ক্রিপ্টটা অনেক হেল্প করেছে। বাংলাদেশ সার্ভারে লোকাল গেটওয়ে অ্যাড করতে গিয়ে কত প্যারা খাইতে হইতো, এদের স্ক্রিপ্ট দিয়ে মাত্র ২০ মিনিটে কাজ শেষ!',
    product: 'bKash/Nagad SDK',
    avatar: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=Nusrat'
  },
  {
    name: 'শরিফুল ইসলাম',
    role: 'Full Stack Developer',
    text: 'Gemini Advanced ১৮ মাসের সাবস্ক্রিপশন কি ইনস্ট্যান্টলি ডেলিভারি পেয়েছি। দাম অনেক কম আর ফুল অফিশিয়াল সাপোর্ট পাওয়া যায়। যেকোনো সমস্যায় টিম সবসময় একটিভ।',
    product: 'Gemini 18-Month',
    avatar: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=Shariful'
  },
  {
    name: 'রাইহান চৌধুরী',
    role: 'Indie Maker',
    text: 'Netflix 4K ১ মাসের সাবস্ক্রিপশন আর সাথে OpenAI API key টা নিয়েছিলাম। রিসিট পেজেই সাথে সাথে পাসওয়ার্ড আর ডিটেইলস চলে এসেছে। গ্রেট সার্ভিস!',
    product: 'Netflix 4K',
    avatar: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=Raihan'
  },
  {
    name: 'আফরোজা ইয়াছমিন',
    role: 'UI Designer',
    text: 'বাংলাদেশি লোকাল থিমের ফিগমা ইউআই কিটটা চরম ছিল। কমার্শিয়াল লাইসেন্সসহ এত কম বাজেটে প্রিমিয়াম কোয়ালিটি রিসোর্স ঢাকার কোথাও পাওয়া যায় না।',
    product: 'E-Com Figma Pack',
    avatar: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=Afroza'
  }
];

const ADMIN_EMAILS = [
  'info.shorif0000@gmail.com',
  'geminizksipro@gmail.com',
  'admin@digimarkt.bd',
  'admin@gmail.com'
];

export default function App() {
  // Core state engines
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [user, setUser] = useState<UserType | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);

  // Admin & Custom Management States
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminAuthError, setAdminAuthError] = useState('');
  const [isAdminAuthenticating, setIsAdminAuthenticating] = useState(false);
  const [currency, setCurrency] = useState<'BDT' | 'USD'>('BDT');
  const [products, setProducts] = useState<Product[]>(PRODUCTS.map(p => ({
    ...p,
    fileSize: '',
    compatiblePlatforms: [],
    licenseType: '',
    versionHistory: []
  })));
  const [users, setUsers] = useState<UserType[]>(INITIAL_USERS);
  const [isLoading, setIsLoading] = useState(true);

  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([
    {
      id: 'log-1',
      time: new Date().toLocaleString(),
      user: 'system',
      action: 'DigiMarkt BD enterprise security log engine initialized.',
      type: 'system',
      status: 'success'
    }
  ]);
  
  // UI Panel Controllers
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'info' } | null>(null);

  // FAQ Accordion State
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(0);

  // Newsletter state
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  // Countdown timer for Flash Deals (simulated BDT evening sale)
  const [timeLeft, setTimeLeft] = useState({ hours: 11, minutes: 42, seconds: 58 });

  // UddoktaPay State Controllers
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'verifying' | 'success' | 'cancel' | 'failed'>('idle');
  const [verifiedOrder, setVerifiedOrder] = useState<any | null>(null);
  const [verificationError, setVerificationError] = useState<string>('');

  // Intercept payment status routes on mount
  useEffect(() => {
    const handlePaymentRouteCheck = async () => {
      const path = window.location.pathname;
      const urlParams = new URLSearchParams(window.location.search);
      const invoiceId = urlParams.get('invoice_id');

      if ((path === '/payment-success' || urlParams.has('invoice_id')) && invoiceId) {
        setPaymentStatus('verifying');
        try {
          const res = await fetch(getApiUrl('/api/payment/verify'), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ invoice_id: invoiceId })
          });
          const data = await res.json() as any;
          if (data && data.success && data.order) {
            setVerifiedOrder(data.order);
            setPaymentStatus('success');
            setCart([]);
            localStorage.removeItem('dm_cart');
            triggerToast('Payment successfully verified!', 'success');
          } else {
            setVerificationError(data.message || 'Payment verification failed.');
            setPaymentStatus('failed');
          }
        } catch (err: any) {
          console.error('UddoktaPay verification failed:', err);
          setVerificationError('Unable to securely connect with payment verification node.');
          setPaymentStatus('failed');
        }
      } else if (path === '/payment-cancel') {
        setPaymentStatus('cancel');
      }
    };

    handlePaymentRouteCheck();
  }, []);

  // Sync states from Firebase on Mount
  useEffect(() => {
    async function loadData() {
      try {
        const firestoreProducts = await getProductsFromFirestore();
        if (firestoreProducts.length > 0) {
          setProducts(firestoreProducts);
        }
      } catch (err) {
        console.error("Error loading products from Firestore:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();

    // Setup Auth Listener
    const unsubscribeAuth = auth.onAuthStateChanged(async (fbUser) => {
      if (fbUser) {
        const email = fbUser.email || '';
        const name = fbUser.displayName || email.split('@')[0].toUpperCase();
        const avatar = fbUser.photoURL || `https://api.dicebear.com/7.x/pixel-art/svg?seed=${email}`;
        
        const isAdmin = ADMIN_EMAILS.includes(email.toLowerCase());
        
        if (isAdmin) {
          // If they are on the marketplace (not the admin flow), sign out immediately
          const path = window.location.pathname.replace(/\/$/, '').toLowerCase();
          const hash = window.location.hash;
          const isInAdminFlow = hash === '#admin' || hash === '#/admin' || path === '/admin' || path.endsWith('/admin');
          
          if (!isInAdminFlow) {
            await auth.signOut();
            setUser(null);
            return;
          }

          try {
            // Load admin full data sets
            const [firestoreOrders, firestoreUsers, firestoreLogs] = await Promise.all([
              getOrdersFromFirestore(),
              getUsersFromFirestore(),
              getActivityLogsFromFirestore()
            ]);
            
            setOrders(firestoreOrders);
            setUsers(firestoreUsers);
            setActivityLogs(firestoreLogs);

            // Admin does not have a standard client profile in the user directory
            const profile: UserType = {
              name,
              email,
              avatar,
              phone: '',
              joinedDate: fbUser.metadata.creationTime || new Date().toISOString(),
              wishlist: [],
              purchasedProductIds: []
            };
            setUser(profile);
          } catch (err) {
            console.error("Error loading admin data from Firestore:", err);
          }
        } else {
          try {
            // Load customer specific data sets securely
            const [profile, customerOrders] = await Promise.all([
              getUserProfileFromFirestore(fbUser.uid),
              getOrdersForUserFromFirestore(fbUser.uid)
            ]);

            setOrders(customerOrders || []);

            let finalProfile: UserType;
            if (profile) {
              finalProfile = profile;
            } else {
              finalProfile = {
                name,
                email,
                avatar,
                phone: '',
                joinedDate: new Date().toISOString(),
                wishlist: [],
                purchasedProductIds: []
              };
              await saveUserToFirestore(fbUser.uid, finalProfile);
            }
            setUser(finalProfile);
            // Non-admin can only see themselves in users state
            setUsers([finalProfile]);
          } catch (err) {
            console.error("Error loading customer data from Firestore:", err);
          }
        }
      } else {
        setUser(null);
        setOrders([]);
        setUsers([]);
      }
    });

    // Intercept path or hash routing checks
    const handleHashCheck = (isInitialLoad = false) => {
      const hash = window.location.hash;
      const path = window.location.pathname;
      const cleanPath = path.replace(/\/$/, '').toLowerCase();

      // 1. Check for Admin Portal path/hash
      if (hash === '#admin' || hash === '#/admin' || cleanPath === '/admin' || cleanPath.endsWith('/admin')) {
        setIsAdminOpen(true);
        if (isInitialLoad) {
          // Force sign out on direct initial load of /admin to require credentials every time
          auth.signOut().then(() => {
            setUser(null);
          });
        }
      } else {
        setIsAdminOpen(false);
      }

      // 2. Check for Product Details deep links
      if (hash && hash.startsWith('#product=')) {
        if (isInitialLoad) {
          // If it is initial page load/refresh, clear the hash and do not open the product modal
          window.location.hash = '';
          setSelectedProduct(null);
        } else {
          const prodId = hash.replace('#product=', '');
          const currentProducts = products.length > 0 ? products : PRODUCTS;
          const matched = currentProducts.find((p: Product) => p.id === prodId);
          if (matched) {
            setSelectedProduct(matched);
          }
        }
      } else {
        setSelectedProduct(null);
      }

      // 3. Check for wishlist views
      if (hash === '#wishlist') {
        setIsProfileOpen(true);
      }
    };

    handleHashCheck(true);
    const onHashChange = () => handleHashCheck(false);
    window.addEventListener('hashchange', onHashChange);
    window.addEventListener('popstate', onHashChange);
    
    // Also load local storage items for Cart and Wishlist
    try {
      const storedCart = localStorage.getItem('dm_cart');
      const storedWishlist = localStorage.getItem('dm_wishlist');
      if (storedCart) setCart(JSON.parse(storedCart));
      if (storedWishlist) setWishlist(JSON.parse(storedWishlist));
    } catch (e) {
      console.error(e);
    }

    return () => {
      window.removeEventListener('hashchange', onHashChange);
      window.removeEventListener('popstate', onHashChange);
      unsubscribeAuth();
    };
  }, []);

  // Update localStorage when state fields modify
  useEffect(() => {
    localStorage.setItem('dm_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('dm_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  // Flash deal simulated decrement ticking
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 12, minutes: 0, seconds: 0 }; // reset simulated cycle
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Utility toast dispatcher
  const triggerToast = (msg: string, type: 'success' | 'info' = 'success') => {
    setNotification({ message: msg, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // 3. Shopping Experience Action Handlers
  const handleAddToCart = (product: Product, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();

    const existingIdx = cart.findIndex(item => item.product.id === product.id);
    if (existingIdx > -1) {
      const updated = [...cart];
      updated[existingIdx].quantity += 1;
      setCart(updated);
    } else {
      setCart([...cart, { product, quantity: 1, selectedLicense: 'commercial' }]);
    }

    triggerToast(`Added ${product.title} to your Shopping Cart!`);
  };

  const handleBuyNow = (product: Product) => {
    // Inject directly into cart and pop drawer
    const existingIdx = cart.findIndex(item => item.product.id === product.id);
    if (existingIdx === -1) {
      setCart([{ product, quantity: 1, selectedLicense: 'commercial' }, ...cart]);
    }
    setIsCartOpen(true);
  };

  const handleRemoveFromCart = (index: number) => {
    const updated = [...cart];
    const removedTitle = updated[index].product.title;
    updated.splice(index, 1);
    setCart(updated);
    triggerToast(`Removed ${removedTitle} from cart`, 'info');
  };

  const handleUpdateCartQty = (index: number, qty: number) => {
    if (qty <= 0) {
      handleRemoveFromCart(index);
      return;
    }
    const updated = [...cart];
    updated[index].quantity = qty;
    setCart(updated);
  };

  const handleToggleWishlist = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    if (wishlist.includes(product.id)) {
      setWishlist(wishlist.filter(id => id !== product.id));
      triggerToast(`Removed ${product.title} from Wishlist`, 'info');
    } else {
      setWishlist([...wishlist, product.id]);
      triggerToast(`Saved ${product.title} to your Wishlist!`);
    }
  };

  const handleSelectProduct = (product: Product | null) => {
    setSelectedProduct(product);
    if (product) {
      window.location.hash = `product=${product.id}`;
    } else {
      window.location.hash = '';
    }
  };

  const handleAddActivityLog = async (log: ActivityLog) => {
    setActivityLogs(prev => [log, ...prev]);
    try {
      await saveActivityLogToFirestore({
        id: log.id,
        time: log.time,
        user: log.user,
        action: log.action,
        type: log.type as any,
        status: log.status
      });
    } catch (err) {
      console.error('Error saving activity log to Firestore:', err);
    }
  };

  const handleNewOrderCreated = async (order: Order) => {
    setOrders(prev => [order, ...prev]);
    setCart([]);
    
    await handleAddActivityLog({
      id: `log-${Date.now()}`,
      time: new Date().toLocaleString(),
      user: user?.name || 'Guest Developer',
      action: `Placed order ${order.id} for ৳${order.totalBDT.toLocaleString()}`,
      type: 'order',
      status: 'success'
    });

    try {
      await saveOrderToFirestore(order);
    } catch (err) {
      console.error('Error saving order to Firestore:', err);
    }

    triggerToast(`Order ${order.id} processed successfully!`, 'success');
  };

  const handleAddProduct = async (newProd: Product) => {
    setProducts(prev => [newProd, ...prev]);
    
    await handleAddActivityLog({
      id: `log-${Date.now()}`,
      time: new Date().toLocaleString(),
      user: user?.name || 'Admin',
      action: `Created new digital asset: "${newProd.title}"`,
      type: 'product',
      status: 'success'
    });

    try {
      await saveProductToFirestore(newProd);
    } catch (err) {
      console.error('Error saving product to Firestore:', err);
    }
    
    triggerToast(`Product "${newProd.title}" added successfully!`);
  };

  const handleUpdateProduct = async (updatedProd: Product) => {
    setProducts(prev => prev.map(p => p.id === updatedProd.id ? updatedProd : p));
    
    await handleAddActivityLog({
      id: `log-${Date.now()}`,
      time: new Date().toLocaleString(),
      user: user?.name || 'Admin',
      action: `Updated digital asset details: "${updatedProd.title}"`,
      type: 'product',
      status: 'success'
    });

    try {
      await saveProductToFirestore(updatedProd);
    } catch (err) {
      console.error('Error updating product in Firestore:', err);
    }
    
    triggerToast(`Product "${updatedProd.title}" updated!`);
  };

  const handleDeleteProduct = async (prodId: string) => {
    const target = products.find(p => p.id === prodId);
    setProducts(prev => prev.filter(p => p.id !== prodId));
    
    await handleAddActivityLog({
      id: `log-${Date.now()}`,
      time: new Date().toLocaleString(),
      user: user?.name || 'Admin',
      action: `Deleted digital asset: "${target?.title || prodId}"`,
      type: 'product',
      status: 'warn'
    });

    try {
      await deleteProductFromFirestore(prodId);
    } catch (err) {
      console.error('Error deleting product from Firestore:', err);
    }
    
    triggerToast(`Product deleted successfully`, 'info');
  };

  const handleUpdateOrderStatus = async (orderId: string, status: Order['paymentStatus']) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, paymentStatus: status } : o));
    
    await handleAddActivityLog({
      id: `log-${Date.now()}`,
      time: new Date().toLocaleString(),
      user: user?.name || 'Admin',
      action: `Updated Order status of ${orderId} to "${status}"`,
      type: 'order',
      status: status === 'Refunded' || status === 'Cancelled' ? 'error' : 'success'
    });

    const matchedOrder = orders.find(o => o.id === orderId);
    if (matchedOrder) {
      try {
        await saveOrderToFirestore({
          ...matchedOrder,
          paymentStatus: status
        });
      } catch (err) {
        console.error('Error updating order status in Firestore:', err);
      }
    }
    
    triggerToast(`Order status updated to ${status}`);
  };

  const handleDeleteOrder = async (orderId: string) => {
    setOrders(prev => prev.filter(o => o.id !== orderId));
    
    await handleAddActivityLog({
      id: `log-${Date.now()}`,
      time: new Date().toLocaleString(),
      user: user?.name || 'Admin',
      action: `Deleted Order ${orderId}`,
      type: 'order',
      status: 'warn'
    });

    try {
      await deleteOrderFromFirestore(orderId);
    } catch (err) {
      console.error('Error deleting order from Firestore:', err);
    }
    
    triggerToast(`Order deleted successfully`, 'info');
  };

  const handleToggleUserRole = async (email: string) => {
    if (email === 'admin@digimarkt.bd') {
      triggerToast('Cannot demote root administrator', 'info');
      return;
    }

    const matchedUser = users.find(u => u.email === email);
    if (!matchedUser) return;

    let newEmail = email;
    if (email.toLowerCase().includes('admin')) {
      newEmail = email.replace('-admin', '').replace('admin-', '').replace('admin.', '');
      if (newEmail === email) {
        newEmail = `dev.${email}`;
      }
    } else {
      newEmail = `admin.${email}`;
    }

    const updatedUserProfile = {
      ...matchedUser,
      email: newEmail
    };

    setUsers(prev => prev.map(u => u.email === email ? updatedUserProfile : u));

    await handleAddActivityLog({
      id: `log-${Date.now()}`,
      time: new Date().toLocaleString(),
      user: user?.name || 'Admin',
      action: `Toggled user security role for account: ${email}`,
      type: 'auth',
      status: 'success'
    });

    try {
      await saveUserToFirestore(matchedUser.id || email, updatedUserProfile);
    } catch (err) {
      console.error('Error saving toggled user role to Firestore:', err);
    }

    triggerToast('User role toggled successfully');
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail) {
      setNewsletterSubscribed(true);
      setNewsletterEmail('');
      triggerToast('Thank you! Welcome to DigiMarkt BD Insights.');
    }
  };

  // Filter Catalog
  const filteredProducts = products.filter(p => {
    if (selectedCategory === 'All') return true;
    return p.category === selectedCategory;
  });

  const flashDeals = products.filter(p => p.isFlashDeal);
  const bestSellers = products.slice().sort((a, b) => b.salesCount - a.salesCount).slice(0, 3);
  const trendingProducts = products.slice().sort((a, b) => b.rating - a.rating).slice(0, 4);

  const isUserAdmin = user && user.email && ADMIN_EMAILS.includes(user.email.toLowerCase());

  const handleAdminEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdminAuthError('');
    setIsAdminAuthenticating(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, adminEmail, adminPassword);
      const fbUser = userCredential.user;
      const email = (fbUser.email || '').toLowerCase();
      const name = fbUser.displayName || email.split('@')[0].toUpperCase();
      const avatar = fbUser.photoURL || `https://api.dicebear.com/7.x/pixel-art/svg?seed=${email}`;
      
      const isAdmin = ADMIN_EMAILS.includes(email);
      
      if (!isAdmin) {
        setAdminAuthError('Access Denied: This account is not listed in DigiMarkt BD\'s administrator cluster.');
        setIsAdminAuthenticating(false);
        return;
      }
      
      const profile: UserType = {
        name,
        email,
        avatar,
        phone: '',
        joinedDate: fbUser.metadata.creationTime || new Date().toISOString(),
        wishlist: [],
        purchasedProductIds: []
      };
      
      setUser(profile);
      triggerToast('Administrator cluster session active!', 'success');
    } catch (err: any) {
      console.warn("Firebase email sign-in failed:", err);
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setAdminAuthError('Invalid administrator credentials.');
      } else {
        setAdminAuthError(err.message || 'Authentication failed. Please try again.');
      }
    } finally {
      setIsAdminAuthenticating(false);
    }
  };

  const handleAdminGoogleLogin = async () => {
    setAdminAuthError('');
    setIsAdminAuthenticating(true);
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      const fbUser = userCredential.user;
      const email = fbUser.email || '';
      const name = fbUser.displayName || email.split('@')[0].toUpperCase();
      const avatar = fbUser.photoURL || `https://api.dicebear.com/7.x/pixel-art/svg?seed=${email}`;
      
      const isAdmin = ADMIN_EMAILS.includes(email.toLowerCase());
      
      if (!isAdmin) {
        setAdminAuthError('Access Denied: This account is not listed in DigiMarkt BD\'s administrator cluster.');
        setIsAdminAuthenticating(false);
        return;
      }
      
      const profile: UserType = {
        name,
        email,
        avatar,
        phone: '',
        joinedDate: fbUser.metadata.creationTime || new Date().toISOString(),
        wishlist: [],
        purchasedProductIds: []
      };
      
      setUser(profile);
      triggerToast('Administrator cluster session active!', 'success');
    } catch (err: any) {
      console.error(err);
      setAdminAuthError(err.message || 'Google administrator authentication failed.');
    } finally {
      setIsAdminAuthenticating(false);
    }
  };

  if (isAdminOpen) {
    if (isUserAdmin) {
      return (
        <AdminDashboard
          products={products}
          orders={orders}
          users={users}
          activityLogs={activityLogs}
          currency={currency}
          onSetCurrency={setCurrency}
          onAddProduct={handleAddProduct}
          onUpdateProduct={handleUpdateProduct}
          onDeleteProduct={handleDeleteProduct}
          onUpdateOrderStatus={handleUpdateOrderStatus}
          onDeleteOrder={handleDeleteOrder}
          onToggleUserRole={handleToggleUserRole}
          onClose={async () => {
            await auth.signOut();
            setUser(null);
            window.history.pushState({}, '', '/');
            setIsAdminOpen(false);
          }}
        />
      );
    }

    // Render Secure Admin Authentication Portal (Dark Glassmorphic UI)
    return (
      <div className="min-h-screen bg-[#020617] text-slate-100 flex items-center justify-center p-4 relative overflow-hidden font-sans">
        {/* Futuristic glowing backdrop */}
        <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] rounded-full bg-blue-600/10 blur-[150px] animate-pulse pointer-events-none" />
        <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] rounded-full bg-indigo-600/10 blur-[150px] animate-pulse duration-[8000ms] pointer-events-none" />
        
        <div className="w-full max-w-md bg-slate-900/60 backdrop-blur-xl border border-slate-800 p-8 rounded-3xl shadow-2xl relative z-10">
          <button 
            onClick={async () => {
              await auth.signOut();
              setUser(null);
              window.history.pushState({}, '', '/');
              setIsAdminOpen(false);
            }}
            className="absolute top-6 left-6 text-slate-400 hover:text-white flex items-center gap-1.5 text-xs font-semibold bg-slate-800/40 hover:bg-slate-800 px-3 py-1.5 rounded-xl transition-all"
          >
            <ArrowLeft size={13} />
            <span>Marketplace</span>
          </button>

          <div className="text-center mt-6 mb-8 flex flex-col items-center">
            <div className="mb-4">
              <BrandLogo size="lg" variant="light" showSubtitle={true} />
            </div>
            <h2 className="text-lg font-black tracking-tight uppercase text-white mt-2">Security Portal</h2>
            <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
              DigiMarkt BD Secure Access Control. Please authenticate with registered administrator credentials.
            </p>
          </div>

          {adminAuthError && (
            <div className="mb-5 p-3 bg-red-500/10 border border-red-500/25 text-red-400 rounded-xl flex items-start gap-2.5 text-xs font-medium">
              <AlertCircle size={15} className="shrink-0 mt-0.5" />
              <span>{adminAuthError}</span>
            </div>
          )}

          <form onSubmit={handleAdminEmailLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">Admin Email Address</label>
              <div className="relative">
                <Mail size={15} className="absolute left-3.5 top-3.5 text-slate-500" />
                <input
                  type="email"
                  required
                  placeholder="admin@digimarkt.bd"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  className="w-full h-11 pl-10 pr-4 bg-slate-950/40 border border-slate-800 rounded-xl text-xs font-semibold outline-none focus:bg-slate-950 focus:border-blue-500 text-white placeholder-slate-600 transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">Security Password</label>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-3.5 text-slate-500" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  className="w-full h-11 pl-10 pr-4 bg-slate-950/40 border border-slate-800 rounded-xl text-xs font-semibold outline-none focus:bg-slate-950 focus:border-blue-500 text-white placeholder-slate-600 transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isAdminAuthenticating}
              className="w-full h-11 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-blue-900/20 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
            >
              <span>{isAdminAuthenticating ? 'Authorizing Cluster...' : 'Verify Access Keys'}</span>
              <ShieldCheck size={14} />
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-800"></div>
            </div>
            <div className="relative flex justify-center text-[10px] uppercase tracking-wider">
              <span className="px-3 bg-[#0d1527] text-slate-500 font-bold">Or authenticate with</span>
            </div>
          </div>

          <button
            onClick={handleAdminGoogleLogin}
            disabled={isAdminAuthenticating}
            type="button"
            className="w-full h-11 rounded-xl border border-slate-800 hover:bg-slate-800/40 flex items-center justify-center gap-2.5 text-slate-300 font-bold text-xs transition-all cursor-pointer disabled:opacity-50"
          >
            <Chrome size={15} className="text-blue-400" />
            <span>Sign In with Administrator Google Account</span>
          </button>
        </div>
      </div>
    );
  }

  if (paymentStatus !== 'idle') {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 sm:p-6 md:p-8 font-sans selection:bg-blue-600/10 selection:text-blue-600">
        <div className="w-full max-w-xl bg-white border border-slate-200/80 rounded-3xl shadow-2xl p-6 sm:p-8 flex flex-col gap-6 relative overflow-hidden">
          {/* Top colored accent bar */}
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-blue-600 via-sky-500 to-emerald-500"></div>

          {/* 1. VERIFYING PAYMENT VIEW */}
          {paymentStatus === 'verifying' && (
            <div className="flex flex-col items-center justify-center text-center py-12 gap-6">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center font-black text-xs text-blue-600">
                  Secure
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-black text-slate-900 tracking-tight">Verifying Secure Payment</h3>
                <p className="text-xs text-slate-500 max-w-sm leading-relaxed">
                  Connecting to UddoktaPay node to verify transaction security keys... Please do not close or refresh this page.
                </p>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-extrabold bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-full">
                <ShieldCheck size={14} className="text-green-500" />
                <span>SSL SECURED TRANSMISSION PROTOCOL</span>
              </div>
            </div>
          )}

          {/* 2. SUCCESS VIEW */}
          {paymentStatus === 'success' && verifiedOrder && (
            <div className="flex flex-col gap-6">
              <div className="text-center flex flex-col items-center pb-5 border-b border-slate-100 gap-2">
                <div className="w-16 h-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center border border-green-100 shadow-md mb-2">
                  <Check size={32} />
                </div>
                <h3 className="text-xl font-black text-slate-900 tracking-tight">Payment Successful!</h3>
                <p className="text-xs text-slate-400 font-semibold">
                  Invoice ID: <span className="font-extrabold text-slate-700">{verifiedOrder.invoiceId || 'N/A'}</span>
                </p>
                <p className="text-xs text-slate-400">
                  Order Reference: <span className="font-extrabold text-slate-700">{verifiedOrder.id}</span>
                </p>
              </div>

              {/* Delivery notice */}
              <div className="bg-emerald-50 border border-emerald-200/40 p-4 rounded-2xl flex items-start gap-3">
                <CheckCircle className="text-emerald-600 shrink-0 mt-0.5" size={16} />
                <div className="text-xs leading-relaxed text-emerald-800">
                  <p className="font-black text-emerald-950">Delivery Processing / ডেলিভারি প্রসেসিং হচ্ছে:</p>
                  <p className="mt-0.5 text-slate-600">আপনার পেমেন্টটি নিশ্চিত করা হয়েছে। যেহেতু কোনো প্রোডাক্ট লাইসেন্স কি প্রয়োজন নেই, আমাদের টিম কিছুক্ষণ এর মধ্যে আপনার ওয়াটসঅ্যাপ নম্বর <span className="font-bold text-slate-900">{verifiedOrder.customerWhatsapp || 'যা আপনি চেকআউটে দিয়েছেন'}</span> এ প্রোডাক্ট ফাইল/অ্যাক্সেস ডেলিভারি করে দিবে। ইনশাল্লাহ আপনি দ্রুত ডেলিভারি পেয়ে যাবেন!</p>
                </div>
              </div>

              {/* Verified order items */}
              <div className="flex flex-col gap-3.5 bg-slate-50/50 border border-slate-100 p-4 rounded-2xl">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-600 block">Deliverables & Activation Status</span>
                
                {verifiedOrder.items.map((it: any, idx: number) => (
                  <div key={idx} className="flex gap-3 bg-white p-3.5 rounded-xl border border-slate-200/60 shadow-sm relative items-center">
                    {it.imageUrl ? (
                      <img 
                        src={it.imageUrl} 
                        alt={it.productTitle} 
                        className="w-12 h-12 rounded-lg object-cover bg-slate-50 border border-slate-100 shrink-0" 
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                        <span className="text-[10px] text-slate-400 font-bold">DIGI</span>
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h5 className="text-xs font-extrabold text-slate-950 truncate">{it.productTitle}</h5>
                      <div className="flex items-center gap-1.5 mt-1 text-[10px]">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse shrink-0"></span>
                        <span className="text-amber-700 font-extrabold">Delivery Processing (ওয়াটসঅ্যাপে পাঠানো হবে)</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Invoice Action Buttons */}
              <div className="grid grid-cols-2 gap-3 border-t border-slate-100 pt-5">
                <button
                  onClick={() => {
                    const itemsText = verifiedOrder.items
                      .map((it: any, idx: number) => 
                        `${idx + 1}. ${it.productTitle}\n   License: ${it.license.toUpperCase()}\n   Price: ৳${it.priceBDT.toLocaleString()}\n   Status: Delivery Processing (sent via WhatsApp)`
                      )
                      .join('\n\n');

                    const content = `=========================================
          DIGIMARKT BD - OFFICIAL RECEIPT
=========================================
Invoice ID    : ${verifiedOrder.invoiceId || 'N/A'}
Order ID      : ${verifiedOrder.id}
Date          : ${new Date(verifiedOrder.date).toLocaleString()}
Payment Status: PAID
Payment Method: ${verifiedOrder.paymentMethod}

CUSTOMER DETAILS
Name          : ${verifiedOrder.customerName || 'N/A'}
WhatsApp      : ${verifiedOrder.customerWhatsapp || 'N/A'}
Email         : ${verifiedOrder.userEmail || 'N/A'}

ITEMS PURCHASED
${itemsText}

-----------------------------------------
TOTAL PAID    : ৳${verifiedOrder.totalBDT.toLocaleString()}
=========================================
Thank you for purchasing from DigiMarkt BD!
Support Line: WhatsApp 01558118588
=========================================`;

                    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
                    const url = URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = `DigiMarkt-BD-Invoice-${verifiedOrder.id}.txt`;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    URL.revokeObjectURL(url);
                  }}
                  className="h-10 border border-blue-200 bg-blue-50/50 text-blue-600 font-extrabold text-xs rounded-xl flex items-center justify-center gap-1.5 hover:bg-blue-50 transition-colors cursor-pointer"
                >
                  <Download size={13} />
                  <span>Download Text Invoice</span>
                </button>
                <button
                  onClick={() => window.print()}
                  className="h-10 border border-slate-200 bg-white text-slate-700 font-extrabold text-xs rounded-xl flex items-center justify-center gap-1.5 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <Printer size={13} />
                  <span>Print Receipt</span>
                </button>
              </div>

              {/* Order bill breakdown */}
              <div className="flex flex-col gap-2.5 bg-slate-50 p-4 rounded-2xl text-xs text-slate-600 border border-slate-150">
                <div className="flex justify-between">
                  <span>Customer Name</span>
                  <span className="font-extrabold text-slate-900">{verifiedOrder.customerName}</span>
                </div>
                <div className="flex justify-between">
                  <span>WhatsApp Number</span>
                  <span className="font-extrabold text-slate-900">{verifiedOrder.customerWhatsapp}</span>
                </div>
                <div className="flex justify-between border-t border-slate-200/40 pt-2 text-sm text-slate-900 font-black">
                  <span>Paid Bill</span>
                  <span className="text-blue-600">৳{verifiedOrder.totalBDT.toLocaleString()}</span>
                </div>
              </div>

              <button
                onClick={() => {
                  setPaymentStatus('idle');
                  setVerifiedOrder(null);
                  window.history.pushState({}, '', '/');
                }}
                className="w-full h-11 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm transition-all cursor-pointer text-center flex items-center justify-center"
              >
                Go Back to Marketplace
              </button>
            </div>
          )}

          {/* 3. CANCEL VIEW */}
          {paymentStatus === 'cancel' && (
            <div className="flex flex-col items-center justify-center text-center py-8 gap-5">
              <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center border border-amber-100 shadow-md">
                <AlertCircle size={32} />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">Payment Cancelled</h3>
                <p className="text-xs text-slate-500 max-w-sm leading-relaxed">
                  The payment session was cancelled. No money was charged from your account. You can retry anytime.
                </p>
              </div>
              <button
                onClick={() => {
                  setPaymentStatus('idle');
                  window.history.pushState({}, '', '/');
                }}
                className="mt-2 w-full h-11 rounded-xl bg-slate-900 hover:bg-blue-600 text-white font-bold text-xs transition-all cursor-pointer text-center"
              >
                Explore Marketplace
              </button>
            </div>
          )}

          {/* 4. FAILED VIEW */}
          {paymentStatus === 'failed' && (
            <div className="flex flex-col items-center justify-center text-center py-8 gap-5">
              <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center border border-red-100 shadow-md">
                <AlertCircle size={32} />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">Verification Failed</h3>
                <p className="text-xs text-slate-500 max-w-sm leading-relaxed">
                  {verificationError || "We were unable to verify your UddoktaPay transaction."}
                </p>
              </div>
              <div className="bg-slate-50 border border-slate-100 p-3.5 rounded-xl text-[10px] text-slate-500 leading-normal font-semibold max-w-md">
                If you made a payment and received an SMS, but see this error, please message us on WhatsApp with your payment details for instant support.
              </div>
              <div className="flex flex-col sm:flex-row gap-2.5 w-full mt-2">
                <a
                  href="https://wa.me/8801558118588"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 h-11 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors"
                >
                  <MessageSquare size={14} />
                  <span>WhatsApp Support</span>
                </a>
                <button
                  onClick={() => {
                    setPaymentStatus('idle');
                    window.history.pushState({}, '', '/');
                  }}
                  className="flex-1 h-11 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer"
                >
                  Return Home
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col font-sans selection:bg-blue-600/10 selection:text-blue-600 relative overflow-x-hidden" id="marketplace-app-root">
      {/* Decorative ambient gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1400px] h-[500px] bg-gradient-to-b from-blue-50/40 via-sky-50/10 to-transparent rounded-b-[100px] pointer-events-none"></div>
 
      {/* STICKY GLASSMORPHIC HEADER */}
      <Header
        user={user}
        onOpenAuth={() => setIsAuthOpen(true)}
        onLogout={() => {
          setUser(null);
          triggerToast('Logged out of DigiMarkt BD', 'info');
        }}
        cart={cart}
        onOpenCart={() => setIsCartOpen(true)}
        onSelectProduct={handleSelectProduct}
        onSelectCategory={setSelectedCategory}
        selectedCategory={selectedCategory}
        onOpenProfile={() => {
          setIsProfileOpen(true);
        }}
        onOpenWishlist={() => {
          setSelectedCategory('All');
          setSelectedProduct(null);
          setIsProfileOpen(true);
        }}
        onOpenAdmin={() => {
          window.history.pushState({}, '', '/admin');
          setIsAdminOpen(true);
        }}
      />

      {/* Main Container */}
      <main className="flex-1 relative z-10">
        <AnimatePresence mode="wait">
          {!selectedProduct ? (
            <motion.div
              key="catalog"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
            >
              {/* HERO BANNER SECTION */}
              <Hero 
                onExplore={() => {
                  const el = document.getElementById('catalog-explore-head');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
              />

              {/* EXPLORE CATALOG / SEARCH ACTIONS */}
              <section className="max-w-7xl mx-auto px-4 sm:px-8 py-8" id="catalog-explorer">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4" id="catalog-explore-head">
                  <div>
                    <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Explore Digital Products</h2>
                    <p className="text-xs text-slate-500 mt-1">Verified files and assets for modern development projects</p>
                  </div>

                  {/* Categories Scroller pill */}
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 scrollbar-none max-w-full">
                    {CATEGORIES.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-4 py-2 rounded-full text-xs font-bold shrink-0 transition-all cursor-pointer ${
                          selectedCategory === cat
                            ? 'bg-blue-600 text-white shadow-md shadow-blue-500/10'
                            : 'bg-white border border-slate-200/80 text-slate-600 hover:border-blue-400 hover:text-blue-600'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Primary products Grid */}
                {filteredProducts.length > 0 ? (
                  <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6" id="products-catalog-grid">
                    {filteredProducts.map((p) => (
                      <div key={p.id}>
                        <ProductCard
                          product={p}
                          onSelect={handleSelectProduct}
                          onAddToCart={handleAddToCart}
                          onToggleWishlist={handleToggleWishlist}
                          isWishlisted={wishlist.includes(p.id)}
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-24 bg-white/40 backdrop-blur-sm border border-white/50 rounded-[32px] p-8 max-w-lg mx-auto shadow-sm">
                    <span className="text-3xl">📦</span>
                    <h3 className="text-base font-extrabold text-slate-900 mt-4">No assets in this category</h3>
                    <p className="text-xs text-slate-500 mt-1">Try resetting the categories filter to browse all premium assets.</p>
                    <button
                      onClick={() => setSelectedCategory('All')}
                      className="mt-4 px-5 h-9 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-full transition-colors"
                    >
                      Show All Products
                    </button>
                  </div>
                )}
              </section>

              {/* BEST SELLERS & TRENDING BENTO */}
              <section className="bg-slate-100/50 border-y border-slate-200/40 py-14 px-4 sm:px-8">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
                  {/* Trending list (7 cols) */}
                  <div className="lg:col-span-8 flex flex-col gap-6" id="trending-section">
                    <div>
                      <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-1.5">
                        <TrendingUp size={20} className="text-blue-600" />
                        <span>Trending Digital Assets</span>
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">Highly reviewed by regional engineering teams</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {trendingProducts.map((p) => (
                        <div
                          key={p.id}
                          onClick={() => handleSelectProduct(p)}
                          className="p-4 bg-white/80 border border-slate-200/50 rounded-2xl flex gap-3.5 cursor-pointer hover:shadow-lg hover:shadow-blue-900/[0.02] hover:border-blue-200 transition-all group"
                        >
                          <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${p.coverGradient} flex items-center justify-center text-xs font-bold text-blue-600 shrink-0 border border-slate-100/50`}>
                            {p.category[0]}
                          </div>
                          <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                            <div>
                              <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 truncate group-hover:text-blue-600 transition-colors">{p.title}</h4>
                              <p className="text-[10px] text-slate-400 mt-0.5 font-medium uppercase tracking-wider">{p.category}</p>
                            </div>
                            <div className="flex items-center justify-between mt-1">
                              <span className="text-xs font-black text-blue-600">৳{p.priceBDT.toLocaleString()}</span>
                              <div className="flex items-center text-[10px] font-bold text-amber-500 gap-0.5">
                                <Star size={11} className="fill-amber-500" />
                                <span>{p.rating.toFixed(1)}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Best Sellers Accordion (4 cols) */}
                  <div className="lg:col-span-4 flex flex-col gap-6" id="bestsellers-section">
                    <div>
                      <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-1.5">
                        <Award size={20} className="text-blue-600" />
                        <span>Best Sellers</span>
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">Most downloaded with commercial support</p>
                    </div>

                    <div className="flex flex-col gap-3">
                      {bestSellers.map((p, index) => (
                        <div
                          key={p.id}
                          onClick={() => handleSelectProduct(p)}
                          className="flex items-center gap-3.5 p-3.5 bg-white rounded-2xl border border-slate-200/60 cursor-pointer hover:border-blue-200 transition-all group relative overflow-hidden"
                        >
                          {/* Rank number badge */}
                          <div className="absolute top-0 left-0 w-6 h-6 bg-blue-600 text-white text-[9px] font-black flex items-center justify-center rounded-br-2xl">
                            #{index + 1}
                          </div>

                          <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${p.coverGradient} flex items-center justify-center text-xs font-bold text-blue-600 shrink-0 border border-slate-100/50 pl-2`}>
                            {p.category[0]}
                          </div>

                          <div className="flex-1 min-w-0 pl-1.5">
                            <h4 className="text-xs font-extrabold text-slate-900 truncate group-hover:text-blue-600 transition-colors">{p.title}</h4>
                            <span className="text-[10px] text-slate-400 block mt-0.5">{p.salesCount} verified developer sales</span>
                          </div>

                          <span className="text-xs font-black text-slate-800 shrink-0 pr-1">৳{p.priceBDT.toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </section>

              {/* TESTIMONIALS / CUSTOMER REVIEWS */}
              <section className="max-w-full overflow-hidden py-14 flex flex-col gap-8 bg-slate-50/50 border-y border-slate-100" id="testimonials">
                <div className="text-center max-w-xl mx-auto px-4">
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Loved by Developers</h3>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1.5 leading-relaxed">
                    আমাদের প্রিমিয়াম ডিজিটাল প্রোডাক্ট কিনে গ্রাহকদের মূল্যবান মতামত দেখে নিন।
                  </p>
                </div>

                {/* Marquee Ticker */}
                <div className="relative w-full flex overflow-x-hidden">
                  {/* Gradient Mask Overlay */}
                  <div className="absolute top-0 bottom-0 left-0 w-12 sm:w-28 bg-gradient-to-r from-[#f8fafc] to-transparent z-10 pointer-events-none"></div>
                  <div className="absolute top-0 bottom-0 right-0 w-12 sm:w-28 bg-gradient-to-l from-[#f8fafc] to-transparent z-10 pointer-events-none"></div>

                  <div className="animate-marquee flex gap-6 py-2">
                    {/* Set 1 */}
                    {BENGALI_REVIEWS.map((review, idx) => (
                      <div 
                        key={`set1-${idx}`} 
                        className="w-[280px] sm:w-[320px] bg-white border border-slate-200/85 p-5 rounded-2xl flex flex-col justify-between shadow-sm shrink-0 hover:border-blue-400 hover:shadow-md transition-all duration-300 select-none"
                      >
                        <p className="text-xs text-slate-600 leading-relaxed italic mb-4">
                          "{review.text}"
                        </p>
                        <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-auto">
                          <div className="flex items-center gap-2.5">
                            <img src={review.avatar} alt={review.name} className="w-8 h-8 rounded-full bg-blue-50 border border-slate-100 object-cover" />
                            <div>
                              <h4 className="text-[10px] font-extrabold text-slate-900">{review.name}</h4>
                              <span className="text-[8px] text-slate-400 block font-medium">{review.role}</span>
                            </div>
                          </div>
                          <span className="text-[8px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-md font-black uppercase tracking-wider shrink-0">
                            {review.product}
                          </span>
                        </div>
                      </div>
                    ))}

                    {/* Set 2 (Duplicate for seamless loop) */}
                    {BENGALI_REVIEWS.map((review, idx) => (
                      <div 
                        key={`set2-${idx}`} 
                        className="w-[280px] sm:w-[320px] bg-white border border-slate-200/85 p-5 rounded-2xl flex flex-col justify-between shadow-sm shrink-0 hover:border-blue-400 hover:shadow-md transition-all duration-300 select-none"
                      >
                        <p className="text-xs text-slate-600 leading-relaxed italic mb-4">
                          "{review.text}"
                        </p>
                        <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-auto">
                          <div className="flex items-center gap-2.5">
                            <img src={review.avatar} alt={review.name} className="w-8 h-8 rounded-full bg-blue-50 border border-slate-100 object-cover" />
                            <div>
                              <h4 className="text-[10px] font-extrabold text-slate-900">{review.name}</h4>
                              <span className="text-[8px] text-slate-400 block font-medium">{review.role}</span>
                            </div>
                          </div>
                          <span className="text-[8px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-md font-black uppercase tracking-wider shrink-0">
                            {review.product}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* ACCORDION FAQ */}
              <section className="max-w-3xl mx-auto px-4 py-14 flex flex-col gap-6" id="catalog-faq">
                <div className="text-center">
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center justify-center gap-2">
                    <HelpCircle className="text-blue-600" />
                    <span>Frequently Asked Questions</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">সবচেয়ে সাধারণ প্রশ্নগুলোর দ্রুত অফিশিয়াল উত্তর</p>
                </div>

                <div className="flex flex-col gap-3 mt-4">
                  {[
                    {
                      q: "আমি এখান থেকে সাবস্ক্রিপশন (Gemini Pro, Netflix, ChatGPT) কিনলে কতক্ষণে ডেলিভারি পাবো?",
                      a: "আমাদের সার্ভিস থেকে সাবস্ক্রিপশন বা ডিজিটাল প্রোডাক্টগুলো সম্পূর্ণ অটোমেটেড ও ইনস্ট্যান্ট ডেলিভারি দেওয়া হয়। পেমেন্ট সম্পন্ন হওয়ার সাথে সাথেই পেমেন্ট রিসিট এবং আপনার ড্যাশবোর্ডে অ্যাক্সেস কী/লগইন ডিটেইলস চলে আসবে।"
                    },
                    {
                      q: "Gemini ১৮ মাসের প্রিমিয়াম বা ChatGPT এর অফিশিয়াল গ্যারান্টি আছে কি?",
                      a: "হ্যাঁ, DigiMarkt BD-তে বিক্রি হওয়া প্রতিটি প্রিমিয়াম সাবস্ক্রিপশন ১০০% অফিশিয়াল ও ফুল মেয়াদের গ্যারান্টিযুক্ত। যেকোনো সমস্যায় আমাদের ড্যাশবোর্ড বা হেল্প সেন্টার থেকে সাপোর্ট টিকেট ওপেন করলেই আমাদের কাস্টমার সাকসেস টিম দ্রুত সমাধান করে দেবে।"
                    },
                    {
                      q: "পেমেন্ট করার জন্য কি কি গেটওয়ে সাপোর্ট করে?",
                      a: "আমরা বাংলাদেশে বহুল ব্যবহৃত মোবাইল ব্যাংকিং যেমন বিকাশ (bKash), নগদ (Nagad), রকেট (Rocket) এবং যেকোনো ব্যাংকের ক্রেডিট/ডেবিট কার্ড (SSLCommerz) ও আন্তর্জাতিক পেমেন্টের জন্য Stripe সাপোর্ট করি। কোনো অতিরিক্ত ফি ছাড়াই আপনি সুরক্ষিত উপায়ে পেমেন্ট করতে পারবেন।"
                    },
                    {
                      q: "পোর্টফোলিও বা ই-কমার্স টেমপ্লেটগুলোর সাথে কি সোর্স কোড পাওয়া যাবে?",
                      a: "হ্যাঁ! যেকোনো কোড টেমপ্লেট বা স্ক্রিপ্ট কেনার পর আপনি সেটির সম্পূর্ণ সোর্স কোড (.zip ফরম্যাটে) পাবেন। সাথে কমার্শিয়াল লাইসেন্স দেওয়া থাকবে, যা দিয়ে আপনি আপনার ক্লায়েন্টের প্রোডাকশন প্রজেক্টে কোনো বাধা ছাড়াই ব্যবহার করতে পারবেন।"
                    },
                    {
                      q: "কেনার পর কোনো সমস্যা বা ফাইল ডাউনলোড করতে না পারলে কাস্টমার সাপোর্ট কিভাবে পাবো?",
                      a: "যেকোনো প্রশ্নের জন্য আমাদের ডেডিকেটেড টিম প্রস্তুত আছে। আপনি ওয়েবসাইটের নিচে থাকা চ্যাট আইকনে ক্লিক করে সরাসরি আমাদের কাস্টমার সাকসেস টিমের সাথে যোগাযোগ করতে পারেন।"
                    }
                  ].map((faq, idx) => (
                    <div
                      key={idx}
                      className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden transition-all duration-300 shadow-sm"
                    >
                      <button
                        onClick={() => setOpenFaqIdx(openFaqIdx === idx ? null : idx)}
                        className="w-full text-left p-4 flex items-center justify-between font-extrabold text-xs sm:text-sm text-slate-900 hover:bg-slate-50 transition-colors cursor-pointer outline-none"
                      >
                        <span>{faq.q}</span>
                        <ChevronDown 
                          size={16} 
                          className={`text-slate-400 transition-transform duration-300 ${openFaqIdx === idx ? 'rotate-180' : 'rotate-0'}`} 
                        />
                      </button>

                      {openFaqIdx === idx && (
                        <div className="px-4 pb-4 text-xs text-slate-600 leading-relaxed border-t border-slate-50 pt-2.5 bg-slate-50/20">
                          {faq.a}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            </motion.div>
          ) : (
            <motion.div
              key="details"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
            >
              {/* IMMERSIVE PRODUCT DETAIL VIEW */}
              <ProductDetails
                product={selectedProduct}
                onBack={() => handleSelectProduct(null)}
                onAddToCart={handleAddToCart}
                onBuyNow={handleBuyNow}
                onSelectProduct={handleSelectProduct}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* FOOTER */}
      <footer className="bg-[#090d16] text-slate-400 border-t border-slate-900/60 font-sans mt-auto" id="app-footer">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
          {/* Brand Info */}
          <div className="flex flex-col gap-4 bg-slate-950/20 p-5 rounded-2xl border border-slate-900/40 backdrop-blur-sm">
            <div className="flex items-center">
              <BrandLogo size="md" variant="light" showSubtitle={true} />
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed font-semibold">
              বাংলাদেশের প্রিমিয়াম ডিজিটাল অ্যাসেট ও সাবস্ক্রিপশন মার্কেটপ্লেস। ভেরিফাইড ইউআই কিট, ডেভেলপমেন্ট স্ক্রিপ্ট ও অফিশিয়াল প্রিমিয়াম মেম্বারশিপ কিনুন নিরাপদে।
            </p>
            <div className="flex flex-col gap-2 text-xs text-slate-300 mt-1 font-bold">
              <a
                href="mailto:info.shorif0000@gmail.com"
                className="flex items-center gap-2.5 hover:text-white transition-all duration-200 bg-slate-900/45 p-2 rounded-xl border border-slate-800/40 hover:border-slate-700/60 cursor-pointer"
              >
                <div className="w-6 h-6 bg-blue-500/15 rounded-lg flex items-center justify-center text-blue-400 shrink-0">
                  <Mail size={13} />
                </div>
                <span className="truncate">info.shorif0000@gmail.com</span>
              </a>
              <a
                href="https://wa.me/8801558118588"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 hover:text-white transition-all duration-200 bg-slate-900/45 p-2 rounded-xl border border-slate-800/40 hover:border-slate-700/60 cursor-pointer"
              >
                <div className="w-6 h-6 bg-green-500/15 rounded-lg flex items-center justify-center text-green-400 shrink-0">
                  <MessageSquare size={13} />
                </div>
                <span>WhatsApp: 01558118588</span>
              </a>
              <a
                href="https://t.me/Shorif_331"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 hover:text-white transition-all duration-200 bg-slate-900/45 p-2 rounded-xl border border-slate-800/40 hover:border-slate-700/60 cursor-pointer"
              >
                <div className="w-6 h-6 bg-sky-500/15 rounded-lg flex items-center justify-center text-sky-400 shrink-0">
                  <Send size={13} />
                </div>
                <span>Telegram: @Shorif_331</span>
              </a>
            </div>
          </div>

          {/* Categories */}
          <div className="p-5 rounded-2xl bg-slate-950/10 border border-transparent sm:border-slate-900/10">
            <h4 className="text-xs font-black uppercase tracking-widest text-white mb-4 border-l-2 border-blue-600 pl-2.5">Categories</h4>
            <div className="flex flex-col gap-3 text-xs text-slate-400 font-bold">
              <button onClick={() => { handleSelectProduct(null); setSelectedCategory('UI Templates'); }} className="text-left hover:text-white hover:translate-x-1.5 transition-all duration-200 flex items-center gap-2 cursor-pointer">
                <span className="text-[9px] text-blue-500">◆</span> UI Templates
              </button>
              <button onClick={() => { handleSelectProduct(null); setSelectedCategory('Scripts & Plugins'); }} className="text-left hover:text-white hover:translate-x-1.5 transition-all duration-200 flex items-center gap-2 cursor-pointer">
                <span className="text-[9px] text-blue-500">◆</span> Scripts & Plugins
              </button>
              <button onClick={() => { handleSelectProduct(null); setSelectedCategory('Mobile Kits'); }} className="text-left hover:text-white hover:translate-x-1.5 transition-all duration-200 flex items-center gap-2 cursor-pointer">
                <span className="text-[9px] text-blue-500">◆</span> Mobile Kits
              </button>
              <button onClick={() => { handleSelectProduct(null); setSelectedCategory('AI Scripts'); }} className="text-left hover:text-white hover:translate-x-1.5 transition-all duration-200 flex items-center gap-2 cursor-pointer">
                <span className="text-[9px] text-blue-500">◆</span> AI Scripts
              </button>
            </div>
          </div>

          {/* Customer Care */}
          <div className="p-5 rounded-2xl bg-slate-950/10 border border-transparent sm:border-slate-900/10">
            <h4 className="text-xs font-black uppercase tracking-widest text-white mb-4 border-l-2 border-blue-600 pl-2.5">Customer Care</h4>
            <div className="flex flex-col gap-3 text-xs text-slate-400 font-bold">
              <a href="#" onClick={(e) => { e.preventDefault(); triggerToast('Refund Policy: Digital keys and downloads are refundable within 7 days if technically broken.', 'info'); }} className="hover:text-white hover:translate-x-1.5 transition-all duration-200 flex items-center gap-2">
                <span className="text-[9px] text-indigo-500">◆</span> Refund Policy
              </a>
              <a href="#" onClick={(e) => { e.preventDefault(); triggerToast('Terms of License: All digital assets include commercial single-domain standard rights.', 'info'); }} className="hover:text-white hover:translate-x-1.5 transition-all duration-200 flex items-center gap-2">
                <span className="text-[9px] text-indigo-500">◆</span> Terms of License
              </a>
              <a href="#" onClick={(e) => { e.preventDefault(); triggerToast('Privacy Policy: Developer data is encrypted under multi-layered Firebase rules.', 'info'); }} className="hover:text-white hover:translate-x-1.5 transition-all duration-200 flex items-center gap-2">
                <span className="text-[9px] text-indigo-500">◆</span> Privacy Policy
              </a>
            </div>
          </div>

          {/* Safe Payments */}
          <div className="p-5 rounded-2xl bg-slate-950/20 border border-slate-900/40 backdrop-blur-sm">
            <h4 className="text-xs font-black uppercase tracking-widest text-white mb-4 border-l-2 border-blue-600 pl-2.5">Safe Payments</h4>
            <div className="flex flex-col gap-3 text-xs text-slate-400 font-semibold">
              <div className="flex items-center gap-1.5 text-emerald-500 font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Gateways 100% Secure</span>
              </div>
              <p className="text-[10px] text-slate-500 leading-relaxed">
                We accept bKash, Nagad, Rocket, Visa/Mastercard credit cards, and online bank transfers inside Bangladesh.
              </p>
              {/* Payment brand placeholders in sleek capsule tags */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                <span className="bg-pink-950/40 text-pink-400 text-[9px] font-black px-2.5 py-1 rounded-lg border border-pink-900/30">bKash</span>
                <span className="bg-orange-950/40 text-orange-400 text-[9px] font-black px-2.5 py-1 rounded-lg border border-orange-900/30">Nagad</span>
                <span className="bg-purple-950/40 text-purple-400 text-[9px] font-black px-2.5 py-1 rounded-lg border border-purple-900/30">Rocket</span>
                <span className="bg-blue-950/40 text-blue-400 text-[9px] font-black px-2.5 py-1 rounded-lg border border-blue-900/30">Cards</span>
              </div>
            </div>
          </div>
        </div>

        {/* Mini Copyright Bar */}
        <div className="border-t border-slate-900 bg-[#060910] px-4 sm:px-8 py-5 flex flex-col sm:flex-row items-center justify-between text-[10px] font-bold text-slate-500 gap-2">
          <span>&copy; {new Date().getFullYear()} DigiMarkt BD. All digital rights reserved.</span>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            <span>Powered by official Firebase Authentication & SSL Secure Nodes</span>
          </div>
        </div>
      </footer>

      {/* FLOATING HELP CENTER BUTTON */}
      <HelpCenter />

      {/* AUTHENTICATION MODAL */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onSuccess={(newUser) => {
          setUser(newUser);
          setIsProfileOpen(true); // show their dashboard after sign in
        }}
      />

      {/* SHOPPING CART DRAWER */}
      <Cart
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onRemoveItem={handleRemoveFromCart}
        onUpdateQuantity={handleUpdateCartQty}
        onClearCart={() => setCart([])}
        user={user}
        onOpenAuth={() => {
          setIsCartOpen(false);
          setIsAuthOpen(true);
        }}
        onNewOrder={handleNewOrderCreated}
      />

      {/* USER PROFILE DRAWER */}
      {user && (
        <UserProfile
          isOpen={isProfileOpen}
          onClose={() => setIsProfileOpen(false)}
          user={user}
          orders={orders}
          onLogout={async () => {
            await auth.signOut();
            setUser(null);
            setIsProfileOpen(false);
            triggerToast('Signed out successfully', 'info');
          }}
          onSelectProduct={handleSelectProduct}
          wishlist={wishlist}
          onToggleWishlist={handleToggleWishlist}
        />
      )}

      {/* LIVE TOAST FEEDBACK ALERTS */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className={`fixed bottom-6 left-6 z-[130] px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 text-xs font-bold border ${
              notification.type === 'success' 
                ? 'bg-emerald-950 text-emerald-200 border-emerald-800' 
                : 'bg-blue-950 text-blue-200 border-blue-800'
            }`}
            id="toast-notification"
          >
            <CheckCircle size={15} />
            <span>{notification.message}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
