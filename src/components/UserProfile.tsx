import React, { useState } from 'react';
import { User, Key, ShoppingBag, Heart, Shield, LogOut, CheckCircle, Mail, Phone, Calendar, Download, HelpCircle, FileCheck } from 'lucide-react';
import { UserProfile as ProfileType, Order, Product } from '../types';
import { PRODUCTS } from '../data/products';

interface UserProfileProps {
  isOpen: boolean;
  user: ProfileType;
  orders: Order[];
  onClose: () => void;
  onLogout: () => void;
  onSelectProduct: (product: Product) => void;
  wishlist: string[];
  onToggleWishlist: (product: Product, e: React.MouseEvent) => void;
}

export default function UserProfile({
  isOpen,
  user,
  orders,
  onClose,
  onLogout,
  onSelectProduct,
  wishlist,
  onToggleWishlist
}: UserProfileProps) {
  const [activeTab, setActiveTab] = useState<'profile' | 'downloads' | 'orders' | 'wishlist'>('downloads');

  if (!isOpen) return null;

  // Filter products that are in the user's wishlist
  const wishlistedProducts = PRODUCTS.filter(p => wishlist.includes(p.id));

  // Determine all products the user has successfully purchased across their orders
  const paidOrders = orders.filter(o => o.paymentStatus === 'Paid');
  const purchasedProductIds = paidOrders.flatMap(o => o.items.map(it => it.productId));
  const purchasedProducts = PRODUCTS.filter(p => purchasedProductIds.includes(p.id));

  return (
    <div id="user-profile-overlay" className="fixed inset-0 z-[110] flex justify-end bg-slate-900/40 backdrop-blur-md">
      {/* Background close area */}
      <div className="absolute inset-0" onClick={onClose}></div>

      {/* Profile Sidebar */}
      <div className="relative w-full max-w-lg h-full bg-white/95 backdrop-blur-2xl border-l border-slate-200/80 shadow-2xl flex flex-col justify-between" id="user-profile-panel">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <User className="text-blue-600" size={20} />
            <h2 className="text-base sm:text-lg font-black text-slate-950">User Dashboard</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded-full transition-colors"
            id="close-profile-btn"
          >
            <XIcon size={18} />
          </button>
        </div>

        {/* User Card */}
        <div className="p-5 bg-gradient-to-br from-blue-50/50 via-sky-50/25 to-transparent border-b border-slate-100">
          <div className="flex items-center gap-4">
            <img src={user.avatar} alt={user.name} className="w-14 h-14 rounded-full border-2 border-white shadow bg-blue-100 object-cover" />
            <div className="flex-1 min-w-0">
              <h3 className="font-extrabold text-slate-900 truncate">{user.name}</h3>
              <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                <Mail size={12} />
                <span className="truncate">{user.email}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Tabs Navigation */}
        <div className="flex border-b border-slate-100 bg-slate-50/50">
          {(['downloads', 'orders', 'wishlist', 'profile'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-3 text-xs font-bold border-b-2 capitalize transition-all ${
                activeTab === tab
                  ? 'border-blue-600 text-blue-600 bg-white'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              {tab === 'downloads' ? 'My Downloads' : tab}
            </button>
          ))}
        </div>

        {/* Panel Content Body */}
        <div className="flex-1 overflow-y-auto p-5">
          {/* TAB: MY DOWNLOADS & LICENSE KEYS */}
          {activeTab === 'downloads' && (
            <div className="flex flex-col gap-4" id="downloads-tab-panel">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Your Digital Deliverables</span>
              
              {purchasedProducts.length === 0 ? (
                <div className="py-12 text-center text-xs text-slate-400">
                  <Key size={32} className="mx-auto text-slate-300 mb-2" />
                  <span>No downloads available yet. Purchase products to get access instantly!</span>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {purchasedProducts.map((p) => {
                    // Find corresponding license key from completed orders
                    const correspondingOrder = paidOrders.find(o => o.items.some(it => it.productId === p.id));
                    const licenseKey = correspondingOrder ? correspondingOrder.licenseKeys[p.id] : 'DM-KEY-ACTIVE-LICENSE';

                    return (
                      <div
                        key={p.id}
                        className="p-4 bg-slate-50/50 border border-slate-150 rounded-2xl relative flex flex-col gap-2.5 shadow-sm"
                      >
                        <div className="flex items-center justify-between pr-10">
                          <h4
                            onClick={() => {
                              onSelectProduct(p);
                              onClose();
                            }}
                            className="text-xs sm:text-sm font-black text-slate-950 hover:text-blue-600 transition-colors cursor-pointer truncate"
                          >
                            {p.title}
                          </h4>
                          <span className="text-[9px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded font-bold shrink-0">
                            {p.fileSize}
                          </span>
                        </div>

                        {/* License key display */}
                        <div className="flex items-center gap-1.5 bg-white p-2 rounded-xl border border-slate-100 text-[10px] text-slate-500 font-medium">
                          <Key size={12} className="text-blue-500 shrink-0" />
                          <span>License: </span>
                          <code className="bg-slate-50 text-slate-800 px-1.5 py-0.5 rounded font-mono font-bold border border-slate-100">
                            {licenseKey}
                          </code>
                        </div>

                        {/* Download button */}
                        <button
                          onClick={() => alert(`Starting download of ${p.title} (${p.fileSize} ZIP archives)`)}
                          className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center shadow transition-colors"
                          title="Download Zip Archive"
                        >
                          <Download size={13} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB: ORDER HISTORY */}
          {activeTab === 'orders' && (
            <div className="flex flex-col gap-4" id="orders-tab-panel">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Your Purchase History Ledger</span>

              {orders.length === 0 ? (
                <div className="py-12 text-center text-xs text-slate-400">
                  <ShoppingBag size={32} className="mx-auto text-slate-300 mb-2" />
                  <span>No purchase history recorded.</span>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {orders.map((o) => (
                    <div key={o.id} className="p-4 bg-white border border-slate-200/80 rounded-2xl flex flex-col gap-3 shadow-sm">
                      <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                        <div>
                          <span className="text-xs font-extrabold text-slate-900">{o.id}</span>
                          <span className="text-[9px] text-slate-400 block mt-0.5">{new Date(o.date).toLocaleDateString()}</span>
                        </div>
                        <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full ${
                          o.paymentStatus === 'Paid' 
                            ? 'bg-green-50 text-green-600 border border-green-100' 
                            : 'bg-amber-50 text-amber-600 border border-amber-100'
                        }`}>
                          {o.paymentStatus}
                        </span>
                      </div>

                      {/* Items loop */}
                      <div className="flex flex-col gap-1.5">
                        {o.items.map((it, idx) => (
                          <div key={idx} className="flex justify-between items-center text-xs text-slate-600">
                            <span className="truncate pr-4">{it.productTitle}</span>
                            <span className="font-bold text-slate-800 shrink-0">৳{it.priceBDT.toLocaleString()}</span>
                          </div>
                        ))}
                      </div>

                      <div className="flex justify-between items-center pt-2 border-t border-slate-100 text-xs">
                        <span className="font-bold text-slate-400">Total via {o.paymentMethod}</span>
                        <span className="font-extrabold text-blue-600">৳{o.totalBDT.toLocaleString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB: WISHLIST */}
          {activeTab === 'wishlist' && (
            <div className="flex flex-col gap-4" id="wishlist-tab-panel">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Your Saved Items ({wishlistedProducts.length})</span>

              {wishlistedProducts.length === 0 ? (
                <div className="py-12 text-center text-xs text-slate-400">
                  <Heart size={32} className="mx-auto text-slate-300 mb-2" />
                  <span>Your wishlist is empty. Save products to track them!</span>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {wishlistedProducts.map((p) => (
                    <div
                      key={p.id}
                      onClick={() => {
                        onSelectProduct(p);
                        onClose();
                      }}
                      className="p-3 bg-slate-50/50 border border-slate-100 rounded-2xl cursor-pointer hover:bg-blue-50/20 transition-all flex flex-col justify-between group"
                    >
                      <h4 className="text-xs font-extrabold text-slate-900 truncate group-hover:text-blue-600">{p.title}</h4>
                      <p className="text-[10px] text-slate-400 truncate mt-1">{p.category}</p>
                      <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-slate-100/50">
                        <span className="text-xs font-black text-blue-600">৳{p.priceBDT.toLocaleString()}</span>
                        <button
                          onClick={(e) => onToggleWishlist(p, e)}
                          className="text-red-500 hover:text-slate-400 p-1 rounded-md transition-colors shrink-0"
                          title="Remove from Wishlist"
                        >
                          <Heart size={12} className="fill-red-500" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB: ACCOUNT SETTINGS */}
          {activeTab === 'profile' && (
            <div className="flex flex-col gap-4" id="settings-tab-panel">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Account Information</span>

              <div className="flex flex-col gap-3">
                <div className="p-3.5 bg-slate-50/50 border border-slate-150 rounded-2xl flex flex-col gap-1.5 text-xs text-slate-600">
                  <div className="flex items-center gap-2.5 py-1">
                    <Mail size={14} className="text-slate-400" />
                    <span>Email: <span className="font-bold text-slate-800">{user.email}</span></span>
                  </div>
                  <div className="flex items-center gap-2.5 py-1">
                    <Phone size={14} className="text-slate-400" />
                    <span>Phone: <span className="font-bold text-slate-800">{user.phone || '01700000000'}</span></span>
                  </div>
                  <div className="flex items-center gap-2.5 py-1">
                    <Calendar size={14} className="text-slate-400" />
                    <span>Joined: <span className="font-bold text-slate-800">{new Date(user.joinedDate).toLocaleDateString()}</span></span>
                  </div>
                </div>

                <div className="p-3.5 bg-blue-50/20 border border-blue-100/40 rounded-2xl text-[11px] text-slate-500 leading-relaxed">
                  <div className="flex items-center gap-2 mb-1.5 text-blue-600 font-bold">
                    <Shield size={14} />
                    <span>Future Ready Security Guard</span>
                  </div>
                  Our accounts integrate with Firebase Auth secure token nodes. Standard cookies and JWTs protect your session. Change password request links are validated automatically.
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar Footer */}
        <div className="p-5 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          <button
            onClick={onLogout}
            className="flex items-center gap-1.5 text-xs font-bold text-red-600 hover:text-red-700 transition-colors"
          >
            <LogOut size={15} />
            <span>Sign Out Account</span>
          </button>
          
          <span className="text-[10px] text-slate-400">Secure Dashboard</span>
        </div>
      </div>
    </div>
  );
}

// Minimalistic fallback icon helper to prevent crashes or compile warnings
function XIcon({ size = 16 }: { size?: number }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18"></line>
      <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
  );
}
