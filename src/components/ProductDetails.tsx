import React, { useState } from 'react';
import { Star, ShieldCheck, Download, History, HelpCircle, MessagesSquare, CheckCircle, ArrowLeft, ArrowRight, ShoppingCart, Share2, Sparkles, Copy, FileCode, MonitorPlay, ZoomIn } from 'lucide-react';
import { Product } from '../types';
import { PRODUCTS } from '../data/products';
import { motion } from 'motion/react';

interface ProductDetailsProps {
  product: Product;
  onBack: () => void;
  onAddToCart: (product: Product) => void;
  onBuyNow: (product: Product) => void;
  onSelectProduct: (product: Product) => void;
}

export default function ProductDetails({
  product,
  onBack,
  onAddToCart,
  onBuyNow,
  onSelectProduct
}: ProductDetailsProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'changelog' | 'faqs' | 'reviews'>('overview');
  const [isZoomed, setIsZoomed] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const relatedProducts = PRODUCTS.filter(p => p.category === product.category && p.id !== product.id).slice(0, 3);

  const handleShare = () => {
    // Write deep link hash to URL clipboard
    const deepLink = `${window.location.origin}/#product=${product.id}`;
    navigator.clipboard.writeText(deepLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const discountPercent = product.oldPriceBDT 
    ? Math.round(((product.oldPriceBDT - product.priceBDT) / product.oldPriceBDT) * 100)
    : 0;

  const isPremiumOrApp = product.category.toLowerCase().includes('premium') || 
                         product.category.toLowerCase().includes('app') || 
                         product.category.toLowerCase().includes('account');

  return (
    <div className="font-sans max-w-7xl mx-auto px-4 sm:px-8 py-8" id="product-details-container">
      {/* Back and Share Controls */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors"
          id="back-to-catalog-btn"
        >
          <ArrowLeft size={16} />
          <span>Back to Browse Products</span>
        </button>

        <button
          onClick={handleShare}
          className="inline-flex items-center gap-2 px-3.5 py-2 bg-white hover:bg-slate-50 border border-slate-200/60 rounded-xl text-xs font-bold text-slate-700 transition-all cursor-pointer relative active:scale-95"
          id="share-product-btn"
        >
          {copiedLink ? (
            <>
              <CheckCircle size={14} className="text-green-500 animate-pulse" />
              <span className="text-green-600">Link Copied!</span>
            </>
          ) : (
            <>
              <Share2 size={14} className="text-slate-500" />
              <span>Share Product Link</span>
            </>
          )}
        </button>
      </div>

      {/* Main Details Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left column: Showcase Gallery (8 cols) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {/* Interactive Mockup Gallery Container */}
          <div className={`relative h-64 sm:h-96 w-full rounded-3xl ${product.imageUrl ? 'bg-slate-100' : `bg-gradient-to-br ${product.coverGradient}`} border border-slate-150 overflow-hidden flex items-center justify-center`}>
            {/* Gallery floating control icons */}
            <div className="absolute top-4 left-4 z-20 flex gap-2">
              <span className="px-2.5 py-1 bg-white/80 backdrop-blur-md text-slate-800 rounded-lg text-[10px] font-bold border border-slate-100">
                {product.imageUrl ? 'Product Image' : 'Mock Preview File'}
              </span>
              <span className="px-2.5 py-1 bg-blue-600 text-white rounded-lg text-[10px] font-bold">
                HD Quality
              </span>
            </div>

            <div className="absolute top-4 right-4 z-20 flex gap-1.5">
              <button 
                onClick={() => setIsZoomed(!isZoomed)}
                className="p-2 bg-white/90 backdrop-blur-md text-slate-700 hover:text-blue-600 rounded-xl shadow-sm hover:scale-105 transition-all"
                title="Zoom Preview"
              >
                <ZoomIn size={14} />
              </button>
            </div>

            {/* Simulated Live Frame / Product Image */}
            {product.imageUrl ? (
              <img 
                src={product.imageUrl} 
                alt={product.title} 
                className={`transition-all duration-300 ${isZoomed ? 'scale-125' : 'scale-100'} w-full h-full object-cover`}
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className={`transition-all duration-300 ${isZoomed ? 'scale-125' : 'scale-100'} p-4`}>
                {product.category === 'Scripts & Plugins' && (
                  <div className="bg-slate-900 text-slate-200 font-mono text-[10px] sm:text-xs p-5 rounded-2xl shadow-2xl border border-white/10 max-w-sm sm:max-w-md">
                    <div className="flex items-center gap-1.5 border-b border-white/10 pb-2 mb-3">
                      <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                      <span className="w-2.5 h-2.5 rounded-full bg-green-500"></span>
                      <span className="text-slate-400 text-[8px] ml-2">SDK_bKash_Handler.ts</span>
                    </div>
                    <p className="text-sky-400">{"import { DigiMarktSDK } from \"@digimarkt/payment-sdk\";"}</p>
                    <p className="text-slate-500 mt-2">{"// Initialize sandbox payment request"}</p>
                    <p className="text-purple-400">{"const payment = await DigiMarktSDK.create({"}</p>
                    <p className="pl-4 text-emerald-400">{"amount: 5900,"}</p>
                    <p className="pl-4 text-emerald-400">{"currency: \"BDT\","}</p>
                    <p className="pl-4 text-emerald-400">{"provider: \"bKash\""}</p>
                    <p className="text-purple-400">{"});"}</p>
                  </div>
                )}

              {product.category === 'UI Templates' && (
                <div className="bg-white rounded-2xl p-4 shadow-2xl border border-slate-100 flex flex-col gap-2 max-w-sm sm:max-w-md">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-blue-600 rounded"></div>
                      <span className="text-xs font-bold text-slate-900">Vercel Admin</span>
                    </div>
                    <span className="text-[9px] text-green-500 bg-green-50 px-1.5 py-0.5 rounded font-bold">Active</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="h-10 bg-slate-50 border border-slate-100 rounded-lg p-1.5 flex flex-col justify-between">
                      <span className="text-[8px] text-slate-400 uppercase">Sales</span>
                      <span className="text-xs font-bold text-slate-900">৳240k</span>
                    </div>
                    <div className="h-10 bg-slate-50 border border-slate-100 rounded-lg p-1.5 flex flex-col justify-between">
                      <span className="text-[8px] text-slate-400 uppercase">API calls</span>
                      <span className="text-xs font-bold text-slate-900">99.8%</span>
                    </div>
                    <div className="h-10 bg-blue-600/5 border border-blue-100 rounded-lg p-1.5 flex flex-col justify-between">
                      <span className="text-[8px] text-blue-500 uppercase">Latency</span>
                      <span className="text-xs font-bold text-blue-600">12ms</span>
                    </div>
                  </div>
                </div>
              )}

              {product.category === 'Mobile Kits' && (
                <div className="bg-slate-950 text-white w-32 sm:w-40 h-56 sm:h-64 rounded-3xl p-2 shadow-2xl border border-white/20 flex flex-col justify-between">
                  <div className="flex items-center justify-between border-b border-white/10 pb-1.5">
                    <span className="text-[8px] font-bold">AmarBazaar App</span>
                    <span className="text-[8px] text-sky-400 font-bold">4G Live</span>
                  </div>
                  <div className="flex-1 flex flex-col gap-1 mt-2">
                    <div className="h-20 bg-gradient-to-tr from-pink-500/20 to-purple-500/20 rounded-xl border border-white/10 flex items-center justify-center text-[10px] font-bold">
                      Banner Slider
                    </div>
                    <div className="h-10 bg-white/5 rounded-lg border border-white/5 p-1 flex justify-between items-center mt-1">
                      <div className="flex flex-col">
                        <span className="text-[6px] text-slate-400">Total Bill</span>
                        <span className="text-[8px] font-bold">৳3,400</span>
                      </div>
                      <span className="text-[7px] bg-blue-600 px-1 py-0.5 rounded font-black">PAY</span>
                    </div>
                  </div>
                </div>
              )}

              {product.category === 'AI Scripts' && (
                <div className="bg-indigo-950 text-indigo-100 rounded-2xl p-4 shadow-2xl border border-indigo-900 flex flex-col gap-3 max-w-sm sm:max-w-md">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 bg-indigo-500 rounded-full animate-pulse"></span>
                    <span className="text-xs font-black uppercase tracking-wider text-indigo-300">AI Bangla Processor</span>
                  </div>
                  <div className="bg-black/40 p-2.5 rounded-xl border border-white/5">
                    <p className="text-[10px] text-slate-300 italic">"আমাদের এই প্রোডাক্টটি অত্যন্ত প্রিমিয়াম এবং..."</p>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[8px] text-indigo-400">Processing Dialect: Colloquial</span>
                    <span className="text-[9px] bg-indigo-600 text-white px-2 py-0.5 rounded font-bold">Ready</span>
                  </div>
                </div>
              )}

              {product.category === 'Design Assets' && (
                <div className="flex flex-col items-center gap-2 transform rotate-1">
                  <div className="w-24 h-24 bg-white rounded-3xl shadow-2xl border border-slate-100 flex items-center justify-center text-4xl">
                    🇧🇩
                  </div>
                  <span className="text-[10px] font-extrabold text-slate-700 bg-white shadow-sm border border-slate-150 px-2.5 py-0.5 rounded-full">
                    Cultural 3D Assets
                  </span>
                </div>
              )}
            </div>
          )}

          </div>
        </div>

        {/* Right column: Sticky Checkout card (4 cols) */}
        <div className="lg:col-span-4 lg:sticky lg:top-24 flex flex-col gap-4">
          <div className="bg-white/70 backdrop-blur-md border border-white p-5 rounded-3xl shadow-xl shadow-blue-900/[0.02]" id="sticky-checkout-card">
            {/* Title & category */}
            <h3 className="font-extrabold text-slate-900 text-lg mb-1 leading-snug">{product.title}</h3>
            <p className="text-xs text-slate-500 mb-4">{product.category}</p>

            {/* Rating summary */}
            <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-6 font-semibold">
              <div className="flex items-center text-amber-500">
                <Star size={13} className="fill-amber-500" />
                <span className="text-slate-800 ml-0.5">{product.rating.toFixed(1)}</span>
              </div>
              <span>•</span>
              <span>{product.salesCount} purchases</span>
            </div>

            {/* Big price display */}
            <div className="mb-6 p-4 bg-slate-50/80 border border-slate-100 rounded-2xl">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Local Price (incl. tax)</span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-black text-slate-950">৳{product.priceBDT.toLocaleString()}</span>
              </div>
              {product.oldPriceBDT && (
                <div className="flex items-center gap-2 text-xs text-slate-400 font-medium mt-1 line-through">
                  <span>৳{product.oldPriceBDT.toLocaleString()} BDT</span>
                </div>
              )}
            </div>

            {/* Dynamic Buttons */}
            <div className="flex flex-col gap-2.5">
              <button
                onClick={() => onBuyNow(product)}
                className="w-full h-12 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-xl shadow-blue-500/10 hover:scale-[1.01] active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                id="buy-now-details-btn"
              >
                <span>Buy Now (৳{product.priceBDT.toLocaleString()})</span>
              </button>

              <button
                onClick={() => onAddToCart(product)}
                className="w-full h-12 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm hover:scale-[1.01] active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                id="add-to-cart-details-btn"
              >
                <ShoppingCart size={15} />
                <span>Add to Cart</span>
              </button>

              <a
                href={`https://wa.me/8801558118588?text=Hello%20DigiMarkt%20BD!%20I'm%20interested%20in%20buying%20"${encodeURIComponent(product.title)}".%20Please%20let%20me%20know%20how%20to%20proceed%20with%20payment.`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full h-12 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-xl shadow-emerald-500/10 hover:scale-[1.01] active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-1.5 text-center"
                id="whatsapp-details-btn"
              >
                <svg className="w-5 h-5 fill-current shrink-0" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12.004 2C6.48 2 2 6.48 2 12c0 2.17.7 4.19 1.89 5.83L2.06 22l4.31-1.13c1.62.88 3.48 1.38 5.43 1.38 5.52 0 10-4.48 10-10S17.52 2 12.004 2zm5.71 14.25c-.24.67-1.19 1.25-1.95 1.41-.53.11-1.22.2-3.56-.77-2.99-1.24-4.92-4.29-5.07-4.49-.15-.2-1.21-1.61-1.21-3.07 0-1.46.76-2.18 1.03-2.48.24-.27.65-.4 1.03-.4.12 0 .23 0 .33.01.29.01.44.03.63.48.24.58.83 2.03.9 2.18.07.15.12.33.02.53-.1.2-.15.33-.3.5-.15.17-.32.39-.46.52-.16.15-.33.32-.14.65.19.33.85 1.4 1.83 2.27.76.67 1.4 1.09 1.83 1.27.19.08.38.1.53.07.3-.06.76-.49.86-.97.11-.47.11-.87.08-.97-.03-.1-.13-.15-.29-.24-.16-.09-.97-.48-1.12-.53-.15-.05-.26-.08-.38.09-.12.17-.46.58-.56.7-.1.11-.2.13-.37.04-.17-.09-.72-.27-1.37-.85-.51-.45-.85-.96-.95-1.13-.1-.17-.01-.26.08-.35.08-.08.17-.2.26-.3.09-.1.12-.17.18-.29.06-.12.03-.23-.01-.32-.04-.09-.38-.91-.52-1.25-.14-.34-.28-.29-.38-.3-.1-.01-.21-.01-.33-.01s-.31.04-.48.22c-.17.18-.65.64-.65 1.56s.67 1.81.76 1.94c.09.13 1.32 2.02 3.2 2.83.45.19.8.31 1.07.4.45.14.86.12 1.18.07.36-.05 1.1-.45 1.25-.88z" />
                </svg>
                <span>Order via WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Secure Trust Stamp */}
          <div className="flex items-center justify-center gap-2 p-3 bg-green-50/50 border border-green-100 rounded-2xl text-[10px] text-green-700 font-bold">
            <ShieldCheck size={16} />
            <span>Encrypted digital delivery. Refunds covered by terms.</span>
          </div>
        </div>
      </div>

      {/* Bottom Section: Tabbed Navigation & Active Tab Panels */}
      <div className="mt-12 max-w-4xl flex flex-col gap-6" id="product-bottom-info">
        {/* Tabbed Navigation */}
        <div className="flex items-center gap-1.5 border-b border-slate-150 pb-px" id="details-tabs">
          {(['overview', 'changelog', 'faqs', 'reviews'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2.5 text-xs sm:text-sm font-bold border-b-2 capitalize transition-all ${
                activeTab === tab
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
              id={`tab-btn-${tab}`}
            >
              {tab === 'faqs' ? 'FAQ' : tab}
            </button>
          ))}
        </div>

        {/* Dynamic Tab Panels */}
        <div className="bg-white/40 backdrop-blur-sm border border-slate-200/50 p-6 rounded-3xl" id="details-tab-panel">
          {activeTab === 'overview' && (
            <div className="flex flex-col gap-6" id="overview-panel">
              {/* Description */}
              <div>
                <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">Description</h4>
                <p className="text-sm text-slate-600 leading-relaxed">{product.longDescription}</p>
              </div>

              {/* Key Features */}
              <div>
                <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">Key Features</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {product.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-600">
                      <CheckCircle size={15} className="text-blue-600 shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* What's Included */}
              <div>
                <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">What's Included in Delivery</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {product.whatsIncluded.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-600">
                      <CheckCircle size={15} className="text-green-500 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'changelog' && (
            <div className="flex flex-col gap-6" id="changelog-panel">
              <div className="flex items-center gap-2 mb-2">
                <History size={18} className="text-blue-600" />
                <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Version History & Logs</h4>
              </div>

              <div className="flex flex-col gap-4 border-l border-blue-50 pl-4 ml-2">
                {product.versionHistory.map((v, idx) => (
                  <div key={idx} className="relative">
                    {/* Timeline node */}
                    <span className="absolute -left-[21px] top-1.5 w-2 h-2 rounded-full bg-blue-600 ring-4 ring-blue-50"></span>
                    
                    <div className="flex items-center gap-2.5">
                      <span className="text-sm font-black text-slate-950">{v.version}</span>
                      <span className="text-[10px] bg-slate-100 text-slate-500 font-bold px-2 py-0.5 rounded-full">{v.date}</span>
                    </div>

                    <ul className="mt-2 flex flex-col gap-1.5 text-xs text-slate-600 list-disc list-inside pl-1">
                      {v.changes.map((change, cIdx) => (
                        <li key={cIdx}>{change}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'faqs' && (
            <div className="flex flex-col gap-4" id="faqs-panel">
              <div className="flex items-center gap-2 mb-2">
                <HelpCircle size={18} className="text-blue-600" />
                <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Frequently Asked Questions</h4>
              </div>

              <div className="flex flex-col gap-3">
                {product.faqs.map((faq, idx) => (
                  <div key={idx} className="p-4 bg-slate-50/75 border border-slate-100 rounded-2xl">
                    <h5 className="text-xs sm:text-sm font-extrabold text-slate-900 mb-1.5">Q: {faq.question}</h5>
                    <p className="text-xs text-slate-600 leading-relaxed">A: {faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="flex flex-col gap-5" id="reviews-panel">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <MessagesSquare size={18} className="text-blue-600" />
                  <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">User Reviews</h4>
                </div>
                <div className="flex items-center gap-1">
                  <Star size={14} className="text-amber-500 fill-amber-500" />
                  <span className="text-sm font-bold text-slate-800">{product.rating.toFixed(1)} / 5.0</span>
                </div>
              </div>

              {product.reviews.length > 0 ? (
                <div className="flex flex-col gap-4">
                  {product.reviews.map((r) => (
                    <div key={r.id} className="p-4 bg-white/60 border border-slate-100 rounded-2xl flex flex-col gap-2.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-xs font-bold text-blue-600 border border-blue-100">
                            {r.userName[0]}
                          </div>
                          <div className="flex flex-col">
                            <span className="text-xs font-extrabold text-slate-900">{r.userName}</span>
                            <span className="text-[9px] text-slate-400">{r.date}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <div className="flex items-center text-amber-500">
                            {[...Array(r.rating)].map((_, i) => (
                              <Star key={i} size={11} className="fill-amber-500" />
                            ))}
                          </div>
                          {r.verified && (
                            <span className="text-[8px] font-extrabold bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full border border-blue-100">
                              Verified Buyer
                            </span>
                          )}
                        </div>
                      </div>

                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed italic">
                        "{r.comment}"
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center p-6 text-xs text-slate-400">
                  No reviews yet. Be the first to buy and write a review!
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <div className="mt-14 border-t border-slate-100 pt-10" id="related-products-section">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-slate-900">Related Products</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedProducts.map(p => (
              <div
                key={p.id}
                onClick={() => {
                  onSelectProduct(p);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="group bg-white/40 backdrop-blur-sm border border-white/60 p-3.5 rounded-[24px] shadow-sm hover:shadow-xl hover:shadow-blue-900/5 transition-all cursor-pointer flex flex-col justify-between"
              >
                <div className={`h-36 w-full bg-gradient-to-br ${p.coverGradient} rounded-[18px] mb-3 flex items-center justify-center`}>
                  <div className="w-16 h-10 bg-white/80 rounded border border-slate-100 flex flex-col p-1.5 shadow">
                    <div className="w-full h-1 bg-slate-200 rounded mb-0.5"></div>
                    <div className="w-2/3 h-1 bg-slate-100 rounded mb-1"></div>
                  </div>
                </div>
                <div>
                  <span className="text-[9px] font-bold uppercase text-slate-400 tracking-wider mb-1 block">{p.category}</span>
                  <h4 className="font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors text-sm line-clamp-1">{p.title}</h4>
                  <p className="text-xs text-slate-500 line-clamp-1 mt-1">{p.shortDescription}</p>
                </div>
                <div className="flex items-center justify-between border-t border-slate-100 pt-3 mt-3">
                  <span className="text-sm font-bold text-blue-600">৳{p.priceBDT.toLocaleString()}</span>
                  {p.fileSize && (
                    <span className="text-[10px] font-extrabold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">{p.fileSize}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
