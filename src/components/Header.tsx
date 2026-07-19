import React, { useState, useRef, useEffect } from 'react';
import { Search, ShoppingBag, User, LogOut, Heart, Landmark, Menu, X, ChevronRight, ChevronDown } from 'lucide-react';
import { Product, UserProfile, CartItem } from '../types';
import { PRODUCTS, CATEGORIES } from '../data/products';
import BrandLogo from './BrandLogo';

interface HeaderProps {
  user: UserProfile | null;
  onOpenAuth: () => void;
  onLogout: () => void;
  cart: CartItem[];
  onOpenCart: () => void;
  onSelectProduct: (product: Product | null) => void;
  onSelectCategory: (category: string) => void;
  selectedCategory: string;
  onOpenProfile: () => void;
  onOpenWishlist: () => void;
  onOpenAdmin?: () => void;
}

export default function Header({
  user,
  onOpenAuth,
  onLogout,
  cart,
  onOpenCart,
  onSelectProduct,
  onSelectCategory,
  selectedCategory,
  onOpenProfile,
  onOpenWishlist,
  onOpenAdmin
}: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showMobileCategories, setShowMobileCategories] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setSuggestions([]);
      return;
    }

    const filtered = PRODUCTS.filter(p =>
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
    );
    setSuggestions(filtered.slice(0, 5));
  }, [searchQuery]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const ADMIN_EMAILS = [
    'info.shorif0000@gmail.com',
    'geminizksipro@gmail.com',
    'admin@digimarkt.bd',
    'admin@gmail.com'
  ];
  const isUserAdmin = user && (
    ADMIN_EMAILS.includes(user.email.toLowerCase()) || 
    user.email.toLowerCase().includes('admin')
  );

  return (
    <nav className="sticky top-0 z-[100] h-16 w-full flex items-center justify-between px-4 sm:px-8 bg-white/80 backdrop-blur-xl border-b border-blue-50/80 shadow-sm shadow-blue-900/[0.02] font-sans" id="app-header">
      {/* Brand Logo & Static Links */}
      <div className="flex items-center gap-4 sm:gap-6 md:gap-10">
        <div 
          onClick={() => {
            onSelectProduct(null);
            onSelectCategory('All');
            setIsMobileMenuOpen(false);
          }}
          className="flex items-center cursor-pointer group"
          id="brand-logo"
        >
          <BrandLogo size="md" variant="dark" />
        </div>

        {/* Categories / Navigation Links (Desktop) */}
        <div className="hidden lg:flex items-center gap-6 text-sm font-semibold text-slate-500">
          <button 
            onClick={() => {
              onSelectProduct(null);
              onSelectCategory('All');
            }}
            className={`hover:text-blue-600 transition-colors ${selectedCategory === 'All' ? 'text-blue-600' : ''}`}
            id="nav-home-btn"
          >
            Marketplace
          </button>
          
          <div className="relative group/cat">
            <button className="flex items-center gap-1 hover:text-blue-600 transition-colors py-2" id="nav-categories-trigger">
              Categories
            </button>
            <div className="absolute top-full left-0 mt-1 w-56 bg-white/90 backdrop-blur-2xl border border-blue-50 rounded-2xl shadow-xl p-2 hidden group-hover/cat:block animate-in fade-in slide-in-from-top-2 duration-150">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    onSelectProduct(null);
                    onSelectCategory(cat);
                  }}
                  className={`w-full text-left px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors ${
                    selectedCategory === cat ? 'bg-blue-50 text-blue-600' : 'text-slate-600 hover:bg-slate-50 hover:text-blue-600'
                  }`}
                >
                  {cat === 'All' ? 'Browse All Categories' : cat}
                </button>
              ))}
            </div>
          </div>

          <button 
            onClick={onOpenWishlist}
            className="flex items-center gap-1 hover:text-blue-600 transition-colors"
            id="nav-wishlist-btn"
          >
            Wishlist
          </button>
        </div>
      </div>

      {/* Live Search Bar */}
      <div className="flex-1 max-w-[150px] xs:max-w-xs sm:max-w-md mx-2 sm:mx-8 relative" ref={searchRef}>
        <div className="relative" id="search-input-container">
          <input
            type="text"
            placeholder="Search digital assets..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            className="w-full h-10 px-3 pl-8 sm:pl-9 bg-slate-100/80 border border-transparent rounded-full text-[10px] sm:text-xs text-slate-950 focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none"
            id="header-search-bar"
          />
          <div className="absolute left-2.5 sm:left-3 top-3.5 text-slate-400">
            <Search size={12} />
          </div>
        </div>

        {/* Live Search Suggestions Dropdown */}
        {showSuggestions && searchQuery && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white/90 backdrop-blur-2xl border border-blue-50 rounded-2xl shadow-xl overflow-hidden z-[110]" id="search-suggestions">
            {suggestions.length > 0 ? (
              <div className="p-2 flex flex-col gap-1">
                <span className="text-[9px] font-bold text-slate-400 px-3 py-1 uppercase tracking-wider">Search Results</span>
                {suggestions.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => {
                      onSelectProduct(p);
                      setShowSuggestions(false);
                      setSearchQuery('');
                    }}
                    className="flex items-center gap-2.5 p-2 hover:bg-blue-50 rounded-xl cursor-pointer transition-colors group"
                  >
                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${p.coverGradient} flex items-center justify-center text-[10px] shrink-0 font-bold text-blue-600 border border-blue-100/50`}>
                      {p.category[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-[11px] font-bold text-slate-900 group-hover:text-blue-600 transition-colors truncate">{p.title}</h4>
                      <p className="text-[9px] text-slate-500 truncate">{p.shortDescription}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-[11px] font-bold text-blue-600">৳{p.priceBDT.toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 text-center text-xs text-slate-400">
                No premium products found for "<span className="font-bold text-slate-600">{searchQuery}</span>"
              </div>
            )}
          </div>
        )}
      </div>

      {/* Navigation Actions (Cart, Wishlist, User Authentication) */}
      <div className="flex items-center gap-1 sm:gap-4 shrink-0">
        {/* Dynamic Cart Button */}
        <button
          onClick={onOpenCart}
          className="relative cursor-pointer p-2 hover:bg-blue-50 rounded-full transition-colors text-slate-700"
          id="cart-trigger-btn"
        >
          <ShoppingBag size={18} />
          {totalItems > 0 && (
            <span className="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 bg-blue-600 text-white text-[9px] flex items-center justify-center rounded-full font-bold animate-bounce" id="cart-count">
              {totalItems}
            </span>
          )}
        </button>

        {/* Authentication or Profile Toggle (Desktop) */}
        <div className="hidden sm:flex items-center gap-2">
          {user ? (
            <>
              {isUserAdmin && onOpenAdmin && (
                <button
                  onClick={onOpenAdmin}
                  className="flex items-center gap-1.5 px-3 h-9 rounded-xl text-xs font-black uppercase text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-150 transition-all cursor-pointer shadow-sm mr-1"
                  id="header-admin-trigger"
                >
                  <Landmark size={13} />
                  <span>Admin Hub</span>
                </button>
              )}

              {/* User Profile Trigger */}
              <button
                onClick={onOpenProfile}
                className="flex items-center gap-2.5 p-1 pr-3 bg-slate-100/60 hover:bg-blue-50 border border-slate-200/40 rounded-full transition-all text-slate-800"
                id="user-profile-btn"
              >
                <img src={user.avatar} alt={user.name} className="w-7 h-7 rounded-full shadow-sm bg-blue-100 object-cover" />
                <span className="text-xs font-bold truncate max-w-[80px]">{user.name.split(' ')[0]}</span>
              </button>

              {/* Logout Trigger */}
              <button
                onClick={onLogout}
                className="flex p-2 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-full transition-colors"
                title="Sign Out"
                id="logout-btn"
              >
                <LogOut size={16} />
              </button>
            </>
          ) : (
            <button
              onClick={onOpenAuth}
              className="px-5 h-9 rounded-full text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 hover:scale-[1.01] shadow-md shadow-blue-200 active:scale-95 transition-all cursor-pointer"
              id="signin-btn"
            >
              Sign In
            </button>
          )}
        </div>

        {/* Mobile Menu Icon (Mobile Only) */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="flex sm:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
          id="mobile-menu-toggle"
        >
          {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* MOBILE MENU DROPDOWN DRAWER */}
      {isMobileMenuOpen && (
        <div 
          className="absolute top-16 left-0 right-0 bg-white/95 backdrop-blur-2xl border-b border-slate-200/80 shadow-xl flex flex-col p-4 gap-4 z-[120] sm:hidden animate-in slide-in-from-top-4 duration-200" 
          id="mobile-drawer-overlay"
        >
          {/* User Section */}
          {user ? (
            <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="flex items-center gap-3">
                <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full shadow-sm object-cover bg-blue-100" />
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{user.name}</h4>
                  <p className="text-[10px] text-slate-500 truncate max-w-[150px]">{user.email}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  onLogout();
                  setIsMobileMenuOpen(false);
                }}
                className="p-2 bg-red-50 text-red-500 hover:bg-red-100 rounded-xl transition-all"
                title="Sign Out"
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                onOpenAuth();
                setIsMobileMenuOpen(false);
              }}
              className="w-full h-11 bg-blue-600 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-md shadow-blue-500/10"
            >
              <span>Sign In to DigiMarkt</span>
            </button>
          )}

          {/* Navigation Links */}
          <div className="flex flex-col gap-1.5">
            {isUserAdmin && onOpenAdmin && (
              <button
                onClick={() => {
                  onOpenAdmin();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full text-left px-4 h-11 rounded-xl bg-blue-50 border border-blue-100 font-extrabold text-xs uppercase text-blue-600 flex items-center gap-2"
              >
                <Landmark size={14} />
                <span>Admin Hub Portal</span>
              </button>
            )}

            <button
              onClick={() => {
                onSelectProduct(null);
                onSelectCategory('All');
                setIsMobileMenuOpen(false);
              }}
              className="w-full text-left px-4 h-10 rounded-xl hover:bg-slate-50 font-bold text-xs text-slate-700 flex items-center justify-between"
            >
              <span>Marketplace Catalog</span>
              <ChevronRight size={14} className="text-slate-400" />
            </button>

            {user && (
              <button
                onClick={() => {
                  onOpenProfile();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full text-left px-4 h-10 rounded-xl hover:bg-slate-50 font-bold text-xs text-slate-700 flex items-center justify-between"
              >
                <span>My Dashboard & Purchases</span>
                <ChevronRight size={14} className="text-slate-400" />
              </button>
            )}

            <button
              onClick={() => {
                onOpenWishlist();
                setIsMobileMenuOpen(false);
              }}
              className="w-full text-left px-4 h-10 rounded-xl hover:bg-slate-50 font-bold text-xs text-slate-700 flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <Heart size={14} className="text-red-500" />
                <span>My Wishlist</span>
              </div>
              <ChevronRight size={14} className="text-slate-400" />
            </button>

            {/* Expandable Categories Panel */}
            <div className="border-t border-slate-100 pt-2 mt-2">
              <button
                onClick={() => setShowMobileCategories(!showMobileCategories)}
                className="w-full text-left px-4 h-10 rounded-xl hover:bg-slate-50 font-bold text-xs text-slate-800 flex items-center justify-between"
              >
                <span>Browse Categories</span>
                <ChevronDown size={14} className={`text-slate-500 transition-transform ${showMobileCategories ? 'rotate-180' : ''}`} />
              </button>

              {showMobileCategories && (
                <div className="pl-4 flex flex-col gap-1 mt-1 animate-in fade-in duration-100">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => {
                        onSelectProduct(null);
                        onSelectCategory(cat);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`w-full text-left h-9 px-4 rounded-xl text-xs font-semibold ${
                        selectedCategory === cat ? 'bg-blue-50/60 text-blue-600' : 'text-slate-500 hover:text-blue-600'
                      }`}
                    >
                      {cat === 'All' ? 'All Digital Products' : cat}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
