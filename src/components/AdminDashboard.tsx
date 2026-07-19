import React, { useState } from 'react';
import { 
  BarChart3, Package, ShoppingBag, Users, ArrowLeft, 
  DollarSign, Sparkles, LogOut, CheckCircle, Flame, Menu, X, Globe, ShieldAlert
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Product, Order, UserProfile } from '../types';
import AdminAnalytics from './AdminAnalytics';
import AdminProducts from './AdminProducts';
import AdminOrders from './AdminOrders';
import AdminUsers from './AdminUsers';
import BrandLogo from './BrandLogo';

export interface ActivityLog {
  id: string;
  time: string;
  user: string;
  action: string;
  type: 'auth' | 'product' | 'order' | 'system' | 'coupon';
  status: 'success' | 'warn' | 'error';
}

interface AdminDashboardProps {
  products: Product[];
  orders: Order[];
  users: UserProfile[];
  activityLogs: ActivityLog[];
  currency: 'BDT' | 'USD';
  onSetCurrency: (curr: 'BDT' | 'USD') => void;
  onAddProduct: (product: Product) => void;
  onUpdateProduct: (product: Product) => void;
  onDeleteProduct: (productId: string) => void;
  onUpdateOrderStatus: (orderId: string, status: Order['paymentStatus']) => void;
  onDeleteOrder: (orderId: string) => void;
  onToggleUserRole: (email: string) => void;
  onClose: () => void;
}

export default function AdminDashboard({
  products,
  orders,
  users,
  activityLogs,
  currency,
  onSetCurrency,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  onUpdateOrderStatus,
  onDeleteOrder,
  onToggleUserRole,
  onClose
}: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<'analytics' | 'products' | 'orders' | 'users'>('analytics');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleNavigateToTab = (tab: string) => {
    if (tab === 'products') setActiveTab('products');
    else if (tab === 'orders') setActiveTab('orders');
    else if (tab === 'settings') setActiveTab('analytics'); // Fallback/Redirect
  };

  const menuItems = [
    { id: 'analytics', label: 'Insights (Analytics)', icon: BarChart3 },
    { id: 'products', label: 'Assets Catalog', icon: Package },
    { id: 'orders', label: 'Orders Queue', icon: ShoppingBag },
    { id: 'users', label: 'Users Directory', icon: Users },
  ] as const;

  const SidebarContent = () => (
    <div className="flex flex-col h-full justify-between p-6">
      {/* Top Brand Section */}
      <div className="space-y-6">
        <div className="pb-5 border-b border-slate-100 flex items-center justify-between">
          <BrandLogo size="sm" variant="dark" />
          <span className="text-[9px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-extrabold uppercase tracking-widest shrink-0">Hub</span>
        </div>

        {/* Menu Navigation */}
        <div className="space-y-1">
          <span className="text-[9px] font-black uppercase tracking-wider text-slate-400 block px-2 mb-2">Navigation Menu</span>
          
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer text-xs font-black transition-all ${
                  isActive 
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/10' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Icon size={15} className={isActive ? 'text-white' : 'text-slate-400'} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Footer Meta Section */}
      <div className="space-y-3.5 pt-5 border-t border-slate-100">
        <div className="bg-slate-50 border border-slate-100 px-3.5 py-2.5 rounded-2xl flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-pulse"></div>
            <span className="text-[10px] font-black text-slate-600">Store Currency</span>
          </div>
          <span className="text-[10px] bg-blue-50 text-blue-600 border border-blue-100 px-2 py-0.5 rounded-lg font-black">BDT (৳)</span>
        </div>

        <button
          onClick={onClose}
          className="w-full h-10 flex items-center justify-center gap-2 rounded-xl border border-slate-200 hover:border-slate-300 text-slate-700 font-bold text-xs bg-white hover:bg-slate-50 active:scale-95 transition-all cursor-pointer"
        >
          <ArrowLeft size={14} />
          <span>Marketplace</span>
        </button>

        <button
          onClick={onClose}
          className="w-full h-10 flex items-center justify-center gap-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 font-bold text-xs active:scale-95 transition-all cursor-pointer"
        >
          <LogOut size={14} />
          <span>Exit Console</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col lg:flex-row font-sans relative overflow-x-hidden" id="admin-dashboard-container">
      {/* Decorative Top Ambient glow */}
      <div className="absolute top-0 right-0 w-full lg:w-[calc(100%-256px)] h-[350px] bg-gradient-to-b from-blue-50/20 to-transparent rounded-b-[100px] pointer-events-none z-0"></div>

      {/* 1. DESKTOP PERMANENT LEFT SIDEBAR */}
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-slate-200/80 h-screen sticky top-0 shrink-0 z-[80]">
        <SidebarContent />
      </aside>

      {/* 2. MOBILE & TABLET STICKY HEADER */}
      <header className="lg:hidden flex sticky top-0 z-[90] h-14 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/60 px-4 items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          {/* Hamburger menu trigger */}
          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 -ml-2 rounded-xl hover:bg-slate-100 text-slate-600 active:scale-95 transition-all cursor-pointer"
            aria-label="Open Admin Menu"
          >
            <Menu size={20} />
          </button>

          {/* Mobile Title */}
          <div className="flex items-center gap-2">
            <div className="w-6.5 h-6.5 bg-blue-600 rounded-lg flex items-center justify-center text-white shrink-0">
              <span className="font-black text-[11px]">D</span>
            </div>
            <span className="font-extrabold text-xs tracking-tight text-slate-900 leading-none">
              Control Hub
            </span>
            <span className="text-[8px] bg-blue-50 border border-blue-100 px-1.5 py-0.5 rounded text-blue-600 font-black tracking-wider leading-none">
              Console
            </span>
          </div>
        </div>

        {/* Home/Exit back to Marketplace */}
        <button
          onClick={onClose}
          className="p-2 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-xl transition-all active:scale-95 cursor-pointer"
          title="Exit Admin View"
        >
          <LogOut size={16} />
        </button>
      </header>

      {/* 3. MOBILE DRAWERS SLIDING SIDEBAR (SLIDE BAR MENU) */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-[120] lg:hidden">
            {/* Backdrop lock */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="absolute inset-0 bg-black"
            />

            {/* Sidebar drawer panel */}
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="absolute top-0 bottom-0 left-0 w-72 max-w-[85vw] bg-white h-full shadow-2xl flex flex-col z-10"
            >
              {/* Close button inside drawer */}
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="absolute top-5 right-4 p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-all cursor-pointer active:scale-95"
              >
                <X size={15} />
              </button>

              <div className="flex-1 overflow-y-auto">
                <SidebarContent />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 4. MAIN CENTRAL CONTENT LAYOUT PANEL */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen relative z-10">
        
        {/* SUB-HEADER WITH TITLE AND EXPLAINER */}
        <div className="px-4 sm:px-8 pt-6 sm:pt-8 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 flex items-center gap-2">
              <Sparkles className="text-blue-600 shrink-0" size={22} />
              <span>DigiMarkt BD Control Hub</span>
            </h1>
            <p className="text-[11px] sm:text-xs text-slate-500 mt-1 font-semibold leading-relaxed">
              Manage your digital templates, monitor simulated checkouts, and administer verified developer accounts.
            </p>
          </div>

          {/* Active selection tag for clear visual status */}
          <div className="inline-flex self-start sm:self-center items-center gap-1.5 px-3 py-1.5 bg-blue-50/80 border border-blue-100/50 rounded-2xl text-[10px] font-black text-blue-600">
            <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-ping"></span>
            <span className="uppercase tracking-wider">Active: {activeTab}</span>
          </div>
        </div>

        {/* DASHBOARD BODY MAIN */}
        <main className="px-4 sm:px-8 py-6 sm:py-8 flex-1 flex flex-col min-w-0">
          {activeTab === 'analytics' && (
            <AdminAnalytics
              products={products}
              orders={orders}
              users={users}
              currency={currency}
              onNavigateToTab={handleNavigateToTab}
            />
          )}

          {activeTab === 'products' && (
            <AdminProducts
              products={products}
              onAddProduct={onAddProduct}
              onUpdateProduct={onUpdateProduct}
              onDeleteProduct={onDeleteProduct}
              currency={currency}
            />
          )}

          {activeTab === 'orders' && (
            <AdminOrders
              orders={orders}
              onUpdateOrderStatus={onUpdateOrderStatus}
              onDeleteOrder={onDeleteOrder}
              currency={currency}
            />
          )}

          {activeTab === 'users' && (
            <AdminUsers
              users={users}
              onToggleUserRole={onToggleUserRole}
              activityLogs={activityLogs}
            />
          )}
        </main>

        {/* SYSTEM META FOOTER */}
        <footer className="px-4 sm:px-8 py-5 border-t border-slate-200/50 flex flex-col sm:flex-row justify-between items-center text-[9px] text-slate-400 font-bold gap-2">
          <span>DigiMarkt BD Enterprise System. Strictly Authorized Access Only.</span>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
            <span>Security Ledger: Session Lock Active</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
