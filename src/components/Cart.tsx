import React, { useState, useEffect } from 'react';
import { X, Trash2, ShoppingBag, ArrowRight, Ticket, Check, AlertCircle, CreditCard, ShieldCheck, Download, Award, ChevronRight, Printer, ArrowUpRight } from 'lucide-react';
import { CartItem, Product, Order, UserProfile } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { auth } from '../lib/firebase';
import { getApiUrl } from '../lib/api';

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onRemoveItem: (index: number) => void;
  onUpdateQuantity: (index: number, qty: number) => void;
  onClearCart: () => void;
  user: UserProfile | null;
  onOpenAuth: () => void;
  onNewOrder: (order: Order) => void;
}

const COUPONS = [
  { code: 'WELCOMEBD', discountPercent: 15, description: '15% Off for new customers' },
  { code: 'DIGI30', discountPercent: 30, description: '30% Off special developer discount' },
  { code: 'DHAKA50', discountPercent: 50, description: '50% Megadeal' }
];

export default function Cart({
  isOpen,
  onClose,
  cart,
  onRemoveItem,
  onUpdateQuantity,
  onClearCart,
  user,
  onOpenAuth,
  onNewOrder
}: CartProps) {
  const [checkoutStep, setCheckoutStep] = useState<1 | 2 | 3 | 4>(1); // 1: review, 2: pay, 3: simulator, 4: receipt
  const [couponCode, setCouponCode] = useState('');
  const [activeCoupon, setActiveCoupon] = useState<{ code: string; discountPercent: number } | null>(null);
  const [couponError, setCouponError] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'bKash' | 'Nagad' | 'Rocket' | 'SSLCommerz' | 'Stripe' | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);
  const [gatewayUrl, setGatewayUrl] = useState('');
  const [activeInvoiceId, setActiveInvoiceId] = useState<string>('');

  // Polling for payment status when in checkout step 3 and we have an active invoice id
  useEffect(() => {
    if (checkoutStep !== 3 || !activeInvoiceId) return;

    let isSubscribed = true;
    console.log(`Starting client-side status polling for invoice: ${activeInvoiceId}`);

    const interval = setInterval(async () => {
      try {
        const response = await fetch(getApiUrl('/api/payment/verify'), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ invoice_id: activeInvoiceId })
        });
        const data = await response.json() as any;

        if (isSubscribed && data && data.success && data.order) {
          console.log('Client-side polling: payment successfully verified!', data.order);
          setCompletedOrder(data.order);
          onNewOrder(data.order);
          onClearCart();
          setCheckoutStep(4);
          setIsProcessing(false);
          clearInterval(interval);
        }
      } catch (err) {
        console.error('Error during client-side payment polling:', err);
      }
    }, 4000); // Poll every 4 seconds

    return () => {
      isSubscribed = false;
      clearInterval(interval);
    };
  }, [checkoutStep, activeInvoiceId, onNewOrder, onClearCart]);

  // Customer delivery details states
  const [customerName, setCustomerName] = useState(user?.name || '');
  const [customerEmail, setCustomerEmail] = useState(user?.email || '');
  const [customerWhatsapp, setCustomerWhatsapp] = useState('');
  const [confirmWhatsapp, setConfirmWhatsapp] = useState(false);
  const [detailsError, setDetailsError] = useState('');

  if (!isOpen) return null;

  // Pricing calculations
  const subtotalBDT = cart.reduce((acc, item) => acc + (item.product.priceBDT * item.quantity), 0);
  const subtotalUSD = cart.reduce((acc, item) => acc + (item.product.priceUSD * item.quantity), 0);

  const discountPercent = activeCoupon ? activeCoupon.discountPercent : 0;
  const discountBDT = Math.round((subtotalBDT * discountPercent) / 100);
  const discountUSD = Math.round((subtotalUSD * discountPercent) / 100);

  // Platform fee is free (0) per user instruction
  const feePercent = 0;
  const feeBDT = 0;
  const feeUSD = 0;

  const totalBDT = subtotalBDT - discountBDT + feeBDT;
  const totalUSD = subtotalUSD - discountUSD + feeUSD;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    const code = couponCode.trim().toUpperCase();
    const found = COUPONS.find(c => c.code === code);
    if (found) {
      setActiveCoupon({ code: found.code, discountPercent: found.discountPercent });
      setCouponCode('');
    } else {
      setCouponError('Invalid coupon code. Try WELCOMEBD or DIGI30!');
    }
  };

  const handleStartPayment = () => {
    if (!user) {
      onOpenAuth();
      return;
    }
    setCheckoutStep(2);
  };

  const handleProceedToRealGateway = async () => {
    if (!customerName || !customerEmail || !customerWhatsapp) {
      setDetailsError('Please fill out all delivery details first.');
      return;
    }
    if (!confirmWhatsapp) {
      setDetailsError('Please check the box to confirm your WhatsApp number is correct.');
      return;
    }
    if (!paymentMethod) {
      setDetailsError('Please select a payment gateway option.');
      return;
    }
    setDetailsError('');
    setCheckoutStep(3);
    setIsProcessing(true);

    try {
      const response = await fetch(getApiUrl('/api/payment/create'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          customerName,
          customerEmail,
          customerWhatsapp,
          userId: auth.currentUser?.uid || 'guest@digimarkt.bd',
          userEmail: user?.email || 'guest@digimarkt.bd',
          cart: cart.map(item => ({
            productId: item.product.id,
            productTitle: item.product.title,
            priceUSD: item.product.priceUSD,
            priceBDT: item.product.priceBDT,
            selectedLicense: item.selectedLicense,
            quantity: item.quantity
          })),
          couponCode: activeCoupon?.code || '',
          clientOrigin: window.location.origin
        })
      });

      const data = await response.json() as any;

      if (data && data.success && data.paymentUrl) {
        setGatewayUrl(data.paymentUrl);
        if (data.invoiceId) {
          setActiveInvoiceId(data.invoiceId);
        }
        // Detect if the application is running inside an iframe (like AI Studio preview)
        const isInIframe = window.self !== window.top;
        if (isInIframe) {
          // Open in a new tab securely to bypass frame blocking (X-Frame-Options)
          window.open(data.paymentUrl, '_blank', 'noopener,noreferrer');
        } else {
          // Redirect natively
          window.location.href = data.paymentUrl;
        }
      } else {
        throw new Error(data.error || 'Gateway failed to respond. Please contact support.');
      }
    } catch (err: any) {
      console.error('Payment Initiation Error:', err);
      let errorMsg = err.message || 'Payment server is currently busy. Please try again.';
      if (errorMsg.includes('Failed to fetch') || errorMsg.includes('fetch') || err.name === 'TypeError') {
        errorMsg = `Connection Failed (Failed to fetch): The frontend could not reach the backend API at: "${getApiUrl('/api/payment/create')}". If you are on Netlify, please make sure your Netlify environment variables (PAYMENT_API_KEY, PAYMENT_API_ENDPOINT, etc.) are correctly set in the Netlify dashboard and you have deployed our new Netlify Functions configuration.`;
      }
      setDetailsError(errorMsg);
      setCheckoutStep(2);
      setIsProcessing(false);
    }
  };

  const handleWhatsappCheckout = () => {
    const itemsText = cart
      .map(
        (it, idx) =>
          `${idx + 1}. ${it.product.title} (${it.selectedLicense.toUpperCase()} License) - ৳${it.product.priceBDT.toLocaleString()}`
      )
      .join('\n');
    const text = `Hello DigiMarkt BD!\nI would like to order the following products via WhatsApp:\n\n${itemsText}\n\nTotal Bill: ৳${totalBDT.toLocaleString()}\n\nPlease let me know the payment instructions. Thanks!`;
    const url = `https://wa.me/8801558118588?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleDownloadReceipt = () => {
    if (!completedOrder) return;
    const itemsText = completedOrder.items
      .map(
        (it, idx) =>
          `${idx + 1}. ${it.productTitle}\n   License: ${it.license.toUpperCase()}\n   Price: ৳${it.priceBDT.toLocaleString()}\n   License Key: ${completedOrder.licenseKeys[it.productId] || 'N/A'}`
      )
      .join('\n\n');

    const content = `=========================================
          DIGIMARKT BD - TRANSACTION RECEIPT
=========================================
Order ID      : ${completedOrder.id}
Date          : ${new Date(completedOrder.date).toLocaleString()}
Payment Status: PAID
Payment Method: ${completedOrder.paymentMethod}

CUSTOMER DETAILS
Name          : ${completedOrder.customerName || 'N/A'}
Email         : ${completedOrder.userEmail || 'N/A'}
WhatsApp      : ${completedOrder.customerWhatsapp || 'N/A'}

ITEMS PURCHASED
${itemsText}

-----------------------------------------
Subtotal      : ৳${subtotalBDT.toLocaleString()}
Discount      : -৳${discountBDT.toLocaleString()}
Platform Fee  : FREE (৳0)
TOTAL PAID    : ৳${completedOrder.totalBDT.toLocaleString()}
=========================================
Thank you for choosing DigiMarkt BD!
Your digital assets are secured with us.
For instant queries, message our support.
=========================================`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `DigiMarkt-BD-Receipt-${completedOrder.id}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div id="cart-drawer-overlay" className="fixed inset-0 z-[110] flex justify-end bg-slate-900/40 backdrop-blur-md">
      {/* Background close area */}
      <div className="absolute inset-0" onClick={onClose}></div>

      {/* Sliding Panel */}
      <div className="relative w-full max-w-lg h-full bg-white/95 backdrop-blur-2xl border-l border-slate-200/80 shadow-2xl flex flex-col justify-between" id="cart-sliding-drawer">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="text-blue-600" size={20} />
            <h2 className="text-base sm:text-lg font-black text-slate-950">
              {checkoutStep === 1 && 'Shopping Cart'}
              {checkoutStep === 2 && 'Select Payment Method'}
              {checkoutStep === 3 && 'Simulating Local Gateway'}
              {checkoutStep === 4 && 'Delivery Receipt'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded-full transition-colors"
            id="close-cart-btn"
          >
            <X size={18} />
          </button>
        </div>

        {/* Dynamic Cart Body */}
        <div className="flex-1 overflow-y-auto p-5">
          {/* STEP 1: REVIEW CART ITEMS */}
          {checkoutStep === 1 && (
            <div className="flex flex-col gap-5 h-full" id="cart-step-1">
              {cart.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center gap-4 py-12">
                  <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center border border-blue-100">
                    <ShoppingBag size={28} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm sm:text-base">Your cart is empty</h3>
                    <p className="text-xs text-slate-400 max-w-xs mt-1">Explore our verified high-quality scripts, layouts and start coding today!</p>
                  </div>
                  <button
                    onClick={onClose}
                    className="mt-2 px-6 h-10 bg-blue-600 text-white font-bold text-xs rounded-full hover:bg-blue-700 transition-colors"
                  >
                    Start Exploring
                  </button>
                </div>
              ) : (
                <>
                  {/* Items List */}
                  <div className="flex flex-col gap-3">
                    {cart.map((item, idx) => (
                      <div
                        key={`${item.product.id}-${idx}`}
                        className="flex gap-4 p-3 bg-slate-50/50 border border-slate-100 rounded-2xl relative group"
                      >
                        {/* Thumbnail */}
                        <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${item.product.coverGradient} flex items-center justify-center font-bold text-blue-600 text-xs shrink-0 border border-slate-100/50`}>
                          {item.product.category[0]}
                        </div>

                        {/* Text Details */}
                        <div className="flex-1 min-w-0 pr-6">
                          <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 truncate">{item.product.title}</h4>
                          <p className="text-[10px] text-slate-400 capitalize font-semibold mt-0.5">{item.selectedLicense} License</p>
                          <div className="flex items-center gap-1.5 mt-2">
                            <span className="text-xs font-black text-blue-600">৳{item.product.priceBDT.toLocaleString()}</span>
                            <span className="text-[9px] text-slate-400">(${item.product.priceUSD})</span>
                          </div>
                        </div>

                        {/* Remove item */}
                        <button
                          onClick={() => onRemoveItem(idx)}
                          className="absolute top-3 right-3 text-slate-400 hover:text-red-500 hover:bg-red-50 p-1.5 rounded-lg transition-colors cursor-pointer"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Coupon section */}
                  <form onSubmit={handleApplyCoupon} className="border-t border-slate-100 pt-5 flex flex-col gap-2.5">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Apply Discount Code</span>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <input
                          type="text"
                          placeholder="Enter Promo Code"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value)}
                          className="w-full h-10 px-4 pl-9 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:bg-white focus:border-blue-500 transition-all text-slate-950 font-bold uppercase tracking-wider"
                        />
                        <Ticket size={14} className="absolute left-3 top-3 text-slate-400" />
                      </div>
                      <button
                        type="submit"
                        className="px-5 h-10 bg-slate-900 hover:bg-blue-600 text-white font-bold text-xs rounded-xl transition-all cursor-pointer"
                      >
                        Apply
                      </button>
                    </div>

                    {couponError && (
                      <span className="text-[10px] font-semibold text-red-500 flex items-center gap-1">
                        <AlertCircle size={12} />
                        {couponError}
                      </span>
                    )}

                    {activeCoupon && (
                      <span className="text-[10px] font-bold text-green-600 flex items-center gap-1 bg-green-50/50 p-2 border border-green-100 rounded-lg">
                        <Check size={12} />
                        Code '{activeCoupon.code}' applied! Saved {activeCoupon.discountPercent}% off subtotal.
                      </span>
                    )}
                  </form>
                </>
              )}
            </div>
          )}          {/* STEP 2: PAYMENT METHOD SELECTION */}
          {checkoutStep === 2 && (
            <div className="flex flex-col gap-5" id="cart-step-2">
              {/* Product Preview in Buy Now */}
              <div className="bg-slate-50/60 p-3 rounded-2xl border border-slate-100">
                <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider block mb-2">Buy Now Preview</span>
                <div className="flex flex-col gap-2">
                  {cart.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3 bg-white p-2.5 rounded-xl border border-slate-100 shadow-sm">
                      {item.product.imageUrl ? (
                        <img 
                          src={item.product.imageUrl} 
                          alt={item.product.title} 
                          className="w-10 h-10 object-cover rounded-lg border border-slate-100" 
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-tr from-blue-600/10 to-indigo-600/10 flex items-center justify-center">
                          <Ticket size={16} className="text-blue-500" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h4 className="text-[11px] font-extrabold text-slate-950 truncate">{item.product.title}</h4>
                        <p className="text-[9px] text-slate-400 mt-0.5">{item.selectedLicense.toUpperCase()} LICENSE • Qty: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-black text-slate-900">৳{item.product.priceBDT.toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Delivery Details Form */}
              <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-100 space-y-3.5">
                <span className="text-[10px] font-extrabold text-blue-600 uppercase tracking-wider block">1. Customer Delivery Details</span>
                
                <div className="space-y-1">
                  <label className="text-[9px] font-extrabold uppercase text-slate-400">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Shakib Al Hasan"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full h-9 px-3 bg-white border border-slate-250 rounded-xl text-xs font-semibold focus:border-blue-500 outline-none transition-colors"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-extrabold uppercase text-slate-400">Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. shakib@gmail.com"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className="w-full h-9 px-3 bg-white border border-slate-250 rounded-xl text-xs font-semibold focus:border-blue-500 outline-none transition-colors"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-extrabold uppercase text-slate-400">WhatsApp Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. +88017XXXXXXXX"
                    value={customerWhatsapp}
                    onChange={(e) => setCustomerWhatsapp(e.target.value)}
                    className="w-full h-9 px-3 bg-white border border-slate-250 rounded-xl text-xs font-semibold focus:border-blue-500 outline-none transition-colors"
                  />
                </div>

                {/* Important notice block */}
                <div className="bg-amber-50 border border-amber-200/50 p-3 rounded-xl flex items-start gap-2.5 text-[10px] text-amber-800 leading-normal font-medium">
                  <AlertCircle size={14} className="text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-extrabold text-amber-950">Delivery Information Disclaimer:</p>
                    <p className="mt-0.5 text-slate-600 font-semibold">Product will be delivered to your WhatsApp number.</p>
                    <p className="font-extrabold text-amber-900 mt-1">প্রোডাক্ট আপনার ওয়াটসঅ্যাপ নম্বরে ডেলিভারি দেওয়া হবে। সঠিক নম্বর দিন।</p>
                  </div>
                </div>

                {/* Confirmation Checkbox */}
                <label className="flex items-start gap-2 cursor-pointer select-none pt-1">
                  <input
                    type="checkbox"
                    checked={confirmWhatsapp}
                    onChange={(e) => setConfirmWhatsapp(e.target.checked)}
                    className="mt-0.5 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
                  />
                  <span className="text-[10px] font-extrabold text-slate-700 leading-tight">
                    I confirm my WhatsApp number is correct / আমার ওয়াটসঅ্যাপ নম্বর সঠিক আছে
                  </span>
                </label>
              </div>

              {/* Payment Gateways Selection */}
              <div className="space-y-3">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">2. Select Payment Method (Bangladeshi Wallets)</span>
                
                {detailsError && (
                  <div className="text-[10px] font-bold text-red-600 bg-red-50 p-2.5 rounded-xl border border-red-100">
                    {detailsError}
                  </div>
                )}

                <div className="grid grid-cols-1 gap-2.5">
                  {/* bKash Wallet Button */}
                  <button
                    type="button"
                    onClick={() => {
                      setPaymentMethod('bKash');
                      setDetailsError('');
                    }}
                    className={`p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all group cursor-pointer ${
                      paymentMethod === 'bKash' 
                        ? 'border-pink-500 bg-pink-50/20 ring-2 ring-pink-500/10 shadow-md shadow-pink-500/5' 
                        : 'border-slate-200/80 hover:border-pink-300 hover:bg-slate-50/50'
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-16 h-10 rounded-xl flex items-center justify-center shrink-0 bg-pink-50/60 border border-pink-100 p-1 relative shadow-inner">
                        <svg viewBox="0 0 100 100" className="w-8 h-8 select-none" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M47 10 L37 48 L17 28 Z" fill="#D12053" />
                          <path d="M17 28 L2.5 12 L21 29 Z" fill="#9C113A" />
                          <path d="M17 28 L2.5 12 L37 48 Z" fill="#B01844" />
                          <path d="M37 48 L42.5 73 L23 95 Z" fill="#9C113A" />
                          <path d="M47 10 L37 48 L79 55 Z" fill="#E2136E" />
                          <path d="M37 48 L42.5 73 L79 55 Z" fill="#D11252" />
                          <path d="M42.5 73 L79 55 L78.5 59 Z" fill="#C2104A" />
                          <path d="M67.5 37 L79 55 L88.5 32.5 Z" fill="#D11252" />
                          <path d="M86 42 L97.5 42 L88.5 32.5 Z" fill="#E2136E" />
                        </svg>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs font-black text-slate-900">bKash Personal Wallet</span>
                        <span className="text-[9px] text-slate-400 mt-0.5">Instant Automated Sandbox Node • Fee 0%</span>
                      </div>
                    </div>
                    <span className={`w-4.5 h-4.5 rounded-full border-2 flex items-center justify-center shrink-0 ${paymentMethod === 'bKash' ? 'border-pink-500' : 'border-slate-300'}`}>
                      {paymentMethod === 'bKash' && <span className="w-2.5 h-2.5 bg-pink-500 rounded-full"></span>}
                    </span>
                  </button>

                  {/* Nagad Wallet Button */}
                  <button
                    type="button"
                    onClick={() => {
                      setPaymentMethod('Nagad');
                      setDetailsError('');
                    }}
                    className={`p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all group cursor-pointer ${
                      paymentMethod === 'Nagad' 
                        ? 'border-orange-500 bg-orange-50/20 ring-2 ring-orange-500/10 shadow-md shadow-orange-500/5' 
                        : 'border-slate-200/80 hover:border-orange-300 hover:bg-slate-50/50'
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-16 h-10 rounded-xl flex items-center justify-center shrink-0 bg-orange-50/60 border border-orange-100 p-1 relative shadow-inner">
                        <svg viewBox="0 0 100 100" className="w-8 h-8 select-none" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <defs>
                            <linearGradient id="nagad-grad-1" x1="0" y1="0" x2="1" y2="1">
                              <stop offset="0%" stopColor="#EE1C24" />
                              <stop offset="50%" stopColor="#F15A22" />
                              <stop offset="100%" stopColor="#FF9E1B" />
                            </linearGradient>
                          </defs>
                          <path d="M50,95 C25.147,95 5,74.853 5,50 C5,32.324 15.228,16.924 30.134,9.658 L36.721,18.724 C24.871,24.502 16.732,36.753 16.732,50 C16.732,68.373 31.627,83.268 50,83.268 C68.373,83.268 83.268,68.373 83.268,50 L95,50 C95,74.853 74.853,95 50,95 Z" fill="url(#nagad-grad-1)" />
                          <path d="M30.134,9.658 C38.452,5.612 47.925,3.268 58,3.268 L74,3.268 L74,15 C64,15 54,18 47.5,23.5 L30.134,9.658 Z" fill="#EE1C24" />
                          <path d="M47.5,23.5 C55.5,16.5 66.5,13.5 78,13.5 L91,13.5 L84,24.5 C74,24.5 64,27.5 57,33.5 L47.5,23.5 Z" fill="#EE1C24" />
                          <path d="M57,33.5 C65,26.5 76,23.5 88,23.5 L92.5,31 C83.5,41.5 70.5,47.5 56,47.5 L57,33.5 Z" fill="#F15A22" />
                          <path d="M56,47.5 C40,47.5 28,38 28,26 L39.732,26 C39.732,32 46,38.268 56,38.268 L56,47.5 Z" fill="#FF9E1B" />
                        </svg>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs font-black text-slate-900">Nagad Personal Wallet</span>
                        <span className="text-[9px] text-slate-400 mt-0.5">Instant OTP sandboxed validation • Fee 0%</span>
                      </div>
                    </div>
                    <span className={`w-4.5 h-4.5 rounded-full border-2 flex items-center justify-center shrink-0 ${paymentMethod === 'Nagad' ? 'border-orange-500' : 'border-slate-300'}`}>
                      {paymentMethod === 'Nagad' && <span className="w-2.5 h-2.5 bg-orange-500 rounded-full"></span>}
                    </span>
                  </button>

                  {/* Rocket Wallet Button */}
                  <button
                    type="button"
                    onClick={() => {
                      setPaymentMethod('Rocket');
                      setDetailsError('');
                    }}
                    className={`p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all group cursor-pointer ${
                      paymentMethod === 'Rocket' 
                        ? 'border-purple-600 bg-purple-50/20 ring-2 ring-purple-600/10 shadow-md shadow-purple-500/5' 
                        : 'border-slate-200/80 hover:border-purple-300 hover:bg-slate-50/50'
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-16 h-10 rounded-xl flex items-center justify-center shrink-0 bg-purple-50/60 border border-purple-100 p-1 relative shadow-inner">
                        <svg viewBox="0 0 100 100" className="w-8 h-8 select-none" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M5 45.5 L97.5 6.5 L48.5 75 Z" fill="#8C3092" />
                          <path d="M48.5 75 L97.5 6.5 L80.5 54 Z" fill="#A13CA7" />
                          <path d="M48.5 75 L40 91.5 L49.5 66.5 Z" fill="#5E1F65" />
                          <path d="M49.5 66.5 L48.5 75 L80.5 54 Z" fill="#672D93" />
                        </svg>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs font-black text-slate-900">Rocket DBBL Wallet</span>
                        <span className="text-[9px] text-slate-400 mt-0.5">Secured DBBL token proxy • Fee 0%</span>
                      </div>
                    </div>
                    <span className={`w-4.5 h-4.5 rounded-full border-2 flex items-center justify-center shrink-0 ${paymentMethod === 'Rocket' ? 'border-purple-600' : 'border-slate-300'}`}>
                      {paymentMethod === 'Rocket' && <span className="w-2.5 h-2.5 bg-purple-600 rounded-full"></span>}
                    </span>
                  </button>
                </div>
              </div>

              <button
                onClick={() => setCheckoutStep(1)}
                className="text-xs font-extrabold text-slate-500 hover:text-blue-600 hover:underline text-center mt-1 cursor-pointer"
              >
                Back to Review Items
              </button>
            </div>
          )}

          {/* STEP 3: TRANSACTION PROCESSING SIMULATOR */}
          {checkoutStep === 3 && (
            <div className="flex flex-col items-center justify-center text-center py-12 gap-6" id="cart-step-3">
              <div className="relative">
                <div className="w-20 h-20 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center font-bold text-xs text-blue-600">
                  {paymentMethod}
                </div>
              </div>
              <div className="space-y-3">
                <h3 className="font-extrabold text-slate-900 text-base">Processing Secure Payment</h3>
                
                {/* Clean user-friendly notice for iframe / popup prevention */}
                <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl text-xs text-slate-700 max-w-sm mx-auto leading-relaxed">
                  <p className="font-extrabold text-blue-900 mb-1">
                    পেমেন্ট সম্পন্ন করতে নিচে ক্লিক করুন / Click Below to Pay:
                  </p>
                  <p className="text-[11px] text-slate-600">
                    নিরাপত্তা জনিত কারণে পেমেন্ট গেটওয়েটি নতুন ট্যাবে ওপেন করা হয়েছে। যদি ওপেন না হয়ে থাকে, তাহলে নিচের বাটনে ক্লিক করুন।
                  </p>
                </div>

                {gatewayUrl && (
                  <div className="flex flex-col gap-2.5 w-full max-w-xs mx-auto mt-3">
                    <a
                      href={gatewayUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center px-6 h-11 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-lg transition-all gap-1.5 cursor-pointer"
                    >
                      <span>Click Here to Pay / পেমেন্ট করুন</span>
                      <ArrowUpRight size={15} />
                    </a>
                    
                    <button
                      onClick={() => {
                        setIsProcessing(false);
                        setGatewayUrl('');
                        setActiveInvoiceId('');
                        setCheckoutStep(2);
                      }}
                      className="inline-flex items-center justify-center px-6 h-11 border-2 border-slate-200 hover:border-red-200 hover:bg-red-50 text-slate-500 hover:text-red-600 font-extrabold text-xs sm:text-sm rounded-xl transition-all cursor-pointer"
                    >
                      Cancel Payment / পেমেন্ট বাতিল করুন
                    </button>
                  </div>
                )}
              </div>

              {/* Animated verification badges */}
              <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-bold bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100 mt-2">
                <ShieldCheck size={14} className="text-green-500" />
                <span>SSL Secured • DigiMarkt BD Checkout Protocol</span>
              </div>
            </div>
          )}

          {/* STEP 4: RECEIPT & DELIVERABLES */}
          {checkoutStep === 4 && completedOrder && (
            <div className="flex flex-col gap-6" id="cart-step-4">
              <div className="text-center flex flex-col items-center py-2 gap-2 border-b border-slate-100 pb-5">
                <div className="w-14 h-14 bg-green-50 text-green-600 rounded-full flex items-center justify-center border border-green-100 shadow-md mb-2">
                  <Check size={28} />
                </div>
                <h3 className="text-base sm:text-lg font-black text-slate-900">Payment Successful!</h3>
                <p className="text-xs text-slate-400">Order Reference: <span className="font-bold text-slate-700">{completedOrder.id}</span></p>
              </div>

              {/* Delivery info */}
              <div className="flex flex-col gap-3 bg-emerald-50/30 p-4 border border-emerald-100/50 rounded-2xl">
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 block mb-1">Deliverables & Activation</span>
                
                {completedOrder.items.map((it, idx) => (
                  <div key={idx} className="flex flex-col gap-1.5 bg-white p-3 rounded-xl border border-slate-150 shadow-sm relative group">
                    <h5 className="text-xs font-black text-slate-900 truncate">{it.productTitle}</h5>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                      <span className="text-[10px] text-amber-600 font-extrabold">Delivery Processing (ওয়াটসঅ্যাপে পাঠানো হবে)</span>
                    </div>
                  </div>
                ))}

                <div className="text-[11px] text-slate-600 bg-amber-50/50 border border-amber-200/30 p-3 rounded-xl mt-1 leading-relaxed">
                  <span className="font-bold text-amber-950 block mb-0.5">Note / বিশেষ দ্রষ্টব্য:</span>
                  আপনার পেমেন্টটি নিশ্চিত করা হয়েছে। যেহেতু কোনো প্রোডাক্ট লাইসেন্স কি প্রয়োজন নেই, আমাদের টিম কিছুক্ষণ এর মধ্যে আপনার ওয়াটসঅ্যাপ নম্বর <span className="font-bold text-slate-900">{completedOrder.customerWhatsapp}</span> এ প্রোডাক্ট ফাইল/অ্যাক্সেস ডেলিভারি করে দিবে। ইনশাল্লাহ আপনি দ্রুত ডেলিভারি পেয়ে যাবেন!
                </div>
              </div>

              {/* Receipt Action Buttons */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={handleDownloadReceipt}
                  className="h-10 border border-blue-200 bg-blue-50/50 text-blue-600 font-extrabold text-xs rounded-xl flex items-center justify-center gap-1.5 hover:bg-blue-50 transition-colors cursor-pointer"
                >
                  <Download size={13} />
                  <span>Download Text Invoice</span>
                </button>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="h-10 border border-slate-200 bg-white text-slate-700 font-extrabold text-xs rounded-xl flex items-center justify-center gap-1.5 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <Printer size={13} />
                  <span>Print / Save PDF Receipt</span>
                </button>
              </div>

              {/* Order pricing summary */}
              <div className="flex flex-col gap-2.5 bg-slate-50 p-4 rounded-2xl text-xs text-slate-600 border border-slate-100">
                <div className="flex justify-between">
                  <span>Customer Name</span>
                  <span className="font-bold text-slate-900">{completedOrder.customerName}</span>
                </div>
                <div className="flex justify-between border-t border-slate-200/40 pt-2">
                  <span>WhatsApp Number</span>
                  <span className="font-bold text-slate-900">{completedOrder.customerWhatsapp}</span>
                </div>
                <div className="flex justify-between border-t border-slate-200/40 pt-2">
                  <span>Paid total via {completedOrder.paymentMethod}</span>
                  <span className="font-bold text-slate-950 text-blue-600">৳{completedOrder.totalBDT.toLocaleString()}</span>
                </div>
                <div className="flex justify-between border-t border-slate-200/40 pt-2 text-[10px]">
                  <span>Status</span>
                  <span className="text-green-600 font-extrabold">Paid & Activated</span>
                </div>
              </div>

              <p className="text-[10px] text-slate-400 leading-relaxed text-center">
                A digital download copy has been linked to your <span className="font-bold text-slate-600">User Profile</span> dashboard. You can redownload or claim support any time.
              </p>

              <button
                onClick={() => {
                  setCheckoutStep(1);
                  setCompletedOrder(null);
                  setPaymentMethod(null);
                  onClose();
                }}
                className="w-full h-11 rounded-xl bg-blue-600 text-white font-bold text-xs sm:text-sm hover:bg-blue-700 transition-colors cursor-pointer text-center flex items-center justify-center"
              >
                Continue Browsing
              </button>
            </div>
          )}
        </div>

        {/* STEP 1 & 2 Footer Summary Drawer Sticky Panel */}
        {checkoutStep !== 3 && checkoutStep !== 4 && cart.length > 0 && (
          <div className="p-5 border-t border-slate-100 bg-white shadow-[0_-5px_20px_rgba(0,0,0,0.02)] flex flex-col gap-4">
            <div className="flex flex-col gap-2 text-xs text-slate-500">
              <div className="flex justify-between">
                <span>Subtotal ({cart.reduce((acc, it) => acc + it.quantity, 0)} items)</span>
                <span className="font-bold text-slate-900">৳{subtotalBDT.toLocaleString()}</span>
              </div>

              {discountBDT > 0 && (
                <div className="flex justify-between text-green-600 font-semibold">
                  <span>Coupon Discount ({activeCoupon?.code})</span>
                  <span>-৳{discountBDT.toLocaleString()}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span className="flex items-center gap-1">
                  Platform Fee
                </span>
                <span className="font-extrabold text-green-600">FREE (৳0)</span>
              </div>

              <div className="flex justify-between text-sm sm:text-base text-slate-950 font-black border-t border-slate-100 pt-3 mt-1">
                <span>Total Bill (incl. tax)</span>
                <div className="text-right">
                  <span className="text-blue-600">৳{totalBDT.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Step Action Trigger */}
            {checkoutStep === 1 ? (
              <div className="flex flex-col gap-2">
                <button
                  onClick={handleStartPayment}
                  className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-xl shadow-blue-500/10 flex items-center justify-center gap-1.5 hover:scale-[1.01] transition-all cursor-pointer"
                  id="cart-checkout-cta"
                >
                  <span>Proceed to Gateway Checkout</span>
                  <ArrowRight size={16} />
                </button>
                <button
                  onClick={handleWhatsappCheckout}
                  className="w-full h-11 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-xl shadow-emerald-500/10 flex items-center justify-center gap-1.5 hover:scale-[1.01] transition-all cursor-pointer"
                  id="cart-whatsapp-checkout-cta"
                >
                  <svg className="w-4.5 h-4.5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12.004 2C6.48 2 2 6.48 2 12c0 2.17.7 4.19 1.89 5.83L2.06 22l4.31-1.13c1.62.88 3.48 1.38 5.43 1.38 5.52 0 10-4.48 10-10S17.52 2 12.004 2zm5.71 14.25c-.24.67-1.19 1.25-1.95 1.41-.53.11-1.22.2-3.56-.77-2.99-1.24-4.92-4.29-5.07-4.49-.15-.2-1.21-1.61-1.21-3.07 0-1.46.76-2.18 1.03-2.48.24-.27.65-.4 1.03-.4.12 0 .23 0 .33.01.29.01.44.03.63.48.24.58.83 2.03.9 2.18.07.15.12.33.02.53-.1.2-.15.33-.3.5-.15.17-.32.39-.46.52-.16.15-.33.32-.14.65.19.33.85 1.4 1.83 2.27.76.67 1.4 1.09 1.83 1.27.19.08.38.1.53.07.3-.06.76-.49.86-.97.11-.47.11-.87.08-.97-.03-.1-.13-.15-.29-.24-.16-.09-.97-.48-1.12-.53-.15-.05-.26-.08-.38.09-.12.17-.46.58-.56.7-.1.11-.2.13-.37.04-.17-.09-.72-.27-1.37-.85-.51-.45-.85-.96-.95-1.13-.1-.17-.01-.26.08-.35.08-.08.17-.2.26-.3.09-.1.12-.17.18-.29.06-.12.03-.23-.01-.32-.04-.09-.38-.91-.52-1.25-.14-.34-.28-.29-.38-.3-.1-.01-.21-.01-.33-.01s-.31.04-.48.22c-.17.18-.65.64-.65 1.56s.67 1.81.76 1.94c.09.13 1.32 2.02 3.2 2.83.45.19.8.31 1.07.4.45.14.86.12 1.18.07.36-.05 1.1-.45 1.25-.88z" />
                  </svg>
                  <span>Order via WhatsApp (Talk & Buy)</span>
                </button>
              </div>
            ) : (
              <button
                onClick={handleProceedToRealGateway}
                disabled={!paymentMethod || !confirmWhatsapp}
                className={`w-full h-12 text-white font-bold text-xs sm:text-sm rounded-xl shadow-xl flex items-center justify-center gap-1.5 transition-all ${
                  paymentMethod && confirmWhatsapp
                    ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/10 hover:scale-[1.01] cursor-pointer' 
                    : 'bg-slate-300 shadow-none cursor-not-allowed'
                }`}
                id="payment-confirm-cta"
              >
                <span>Pay ৳{totalBDT.toLocaleString()} via {paymentMethod || 'Select Gateway'}</span>
                <ArrowRight size={16} />
              </button>
            )}

            <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-400">
              <ShieldCheck size={14} className="text-slate-400" />
              <span>Full refunds covered within 7 days of license issue</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
