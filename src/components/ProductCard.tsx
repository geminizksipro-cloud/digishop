import React from 'react';
import { Star, ShoppingCart, Eye, Heart, ArrowUpRight } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
  onAddToCart: (product: Product, e: React.MouseEvent) => void;
  onToggleWishlist: (product: Product, e: React.MouseEvent) => void;
  isWishlisted: boolean;
}

export default function ProductCard({
  product,
  onSelect,
  onAddToCart,
  onToggleWishlist,
  isWishlisted
}: ProductCardProps) {
  // Calculate discount percentage if old price exists
  const discountPercent = product.oldPriceBDT 
    ? Math.round(((product.oldPriceBDT - product.priceBDT) / product.oldPriceBDT) * 100)
    : 0;

  return (
    <div
      onClick={() => onSelect(product)}
      className="group bg-white/40 backdrop-blur-sm border border-white/60 p-2.5 sm:p-3.5 rounded-[16px] sm:rounded-[24px] shadow-sm hover:shadow-xl hover:shadow-blue-900/5 transition-all duration-300 flex flex-col justify-between cursor-pointer h-full relative"
      id={`product-card-${product.id}`}
    >
      {/* Thumbnail area with image rendering support or fallback gradients */}
      <div className={`relative h-28 xs:h-36 sm:h-44 w-full bg-gradient-to-br ${product.coverGradient} rounded-[12px] sm:rounded-[18px] mb-2.5 sm:mb-4 overflow-hidden border border-slate-100/50 flex items-center justify-center transition-all group-hover:scale-[0.99]`}>
        
        {product.imageUrl ? (
          <img 
            src={product.imageUrl} 
            alt={product.title} 
            className="w-full h-full object-cover select-none pointer-events-none"
            referrerPolicy="no-referrer"
          />
        ) : (
          <>
            {/* Dynamic mockup visuals inside gradient based on category */}
            {product.category === 'Scripts & Plugins' && (
              <div className="w-16 h-10 sm:w-24 sm:h-16 bg-white/80 backdrop-blur-md rounded-lg shadow-lg border border-blue-100 flex flex-col p-1.5 sm:p-2.5 transform group-hover:rotate-1 transition-transform">
                <div className="w-full h-1 bg-blue-100 rounded mb-1"></div>
                <div className="w-2/3 h-1 bg-blue-50 rounded mb-1"></div>
                <div className="grid grid-cols-2 gap-1 mt-0.5">
                  <div className="h-2 bg-blue-600/15 rounded"></div>
                  <div className="h-2 bg-blue-600/15 rounded"></div>
                </div>
              </div>
            )}

            {product.category === 'UI Templates' && (
              <div className="w-20 h-14 sm:w-28 sm:h-20 bg-white/90 backdrop-blur-md rounded-lg sm:rounded-xl shadow-lg border border-slate-100 p-1 sm:p-2 transform group-hover:translate-y-[-2px] transition-transform flex flex-col gap-1 sm:gap-1.5">
                <div className="flex items-center gap-0.5 sm:gap-1">
                  <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-red-400"></span>
                  <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-amber-400"></span>
                  <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-green-400"></span>
                </div>
                <div className="w-full h-1 bg-slate-100 rounded"></div>
                <div className="grid grid-cols-3 gap-0.5 sm:gap-1 mt-0.5">
                  <div className="h-4 bg-sky-100 rounded"></div>
                  <div className="h-4 bg-slate-50 border border-slate-100 rounded"></div>
                  <div className="h-4 bg-slate-50 border border-slate-100 rounded"></div>
                </div>
              </div>
            )}

            {product.category === 'Mobile Kits' && (
              <div className="w-10 h-16 sm:w-14 sm:h-24 bg-slate-900 rounded-lg sm:rounded-2xl p-0.5 sm:p-1 shadow-2xl border border-white/20 transform group-hover:scale-105 transition-transform flex flex-col justify-between">
                <div className="w-3 h-0.5 bg-slate-800 rounded mx-auto mt-0.5"></div>
                <div className="flex-1 bg-white rounded mt-0.5 sm:mt-1 overflow-hidden p-0.5 flex flex-col gap-0.5">
                  <div className="w-full h-1 bg-blue-500 rounded"></div>
                  <div className="w-2/3 h-0.5 bg-slate-200 rounded"></div>
                  <div className="w-full h-6 sm:h-10 bg-slate-50 border border-slate-100 rounded"></div>
                </div>
              </div>
            )}

            {product.category === 'AI Scripts' && (
              <div className="w-12 h-12 sm:w-20 sm:h-20 bg-indigo-600 rounded-2xl sm:rounded-3xl flex items-center justify-center shadow-lg transform group-hover:rotate-[-6deg] transition-transform">
                <div className="w-6 h-6 sm:w-10 sm:h-10 border-2 sm:border-4 border-white border-t-transparent rounded-full animate-spin duration-[3000ms]"></div>
              </div>
            )}

            {product.category === 'Design Assets' && (
              <div className="grid grid-cols-2 gap-1 sm:gap-2 transform group-hover:scale-105 transition-transform">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-white/90 backdrop-blur-md rounded-lg sm:rounded-xl shadow border border-purple-100 flex items-center justify-center text-[10px] sm:text-xs font-bold text-purple-600">3D</div>
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-purple-600 rounded-lg sm:rounded-xl shadow flex items-center justify-center text-[10px] sm:text-xs font-bold text-white">✨</div>
              </div>
            )}
          </>
        )}

        {/* Wishlist Button Overlay */}
        <button
          onClick={(e) => onToggleWishlist(product, e)}
          className={`absolute top-2 right-2 p-1.5 sm:p-2 rounded-lg sm:rounded-xl backdrop-blur-md transition-all ${
            isWishlisted 
              ? 'bg-red-500 text-white shadow-md shadow-red-500/20' 
              : 'bg-white/90 text-slate-400 hover:text-red-500 hover:scale-105'
          }`}
          title="Add to Wishlist"
        >
          <Heart size={12} className={isWishlisted ? 'fill-white' : ''} />
        </button>

        {/* Discount Badge Overlay */}
        {discountPercent > 0 && (
          <div className="absolute top-2 left-2 px-1.5 py-0.5 sm:px-2.5 sm:py-1 bg-blue-600 text-white rounded-md sm:rounded-lg text-[8px] sm:text-[9px] font-extrabold uppercase tracking-wider shadow-sm">
            {discountPercent}% OFF
          </div>
        )}

        {/* Flash Deal Label Overlay */}
        {product.isFlashDeal && (
          <div className="absolute bottom-1.5 left-1.5 px-1.5 py-0.5 bg-amber-500 text-white rounded-md text-[7px] sm:text-[8px] font-black uppercase tracking-widest shadow-sm animate-pulse">
            Flash Deal
          </div>
        )}
      </div>

      {/* Description & Metadata */}
      <div className="flex-1 flex flex-col justify-between px-0.5 sm:px-1">
        <div>
          <div className="flex items-center gap-1 sm:gap-1.5 text-[8px] sm:text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">
            <span className="truncate max-w-[55px] sm:max-w-none">{product.category}</span>
            {product.fileSize && (
              <>
                <span>•</span>
                <span>{product.fileSize}</span>
              </>
            )}
          </div>

          <h3 className="font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1 text-xs sm:text-sm md:text-base mb-1" title={product.title}>
            {product.title}
          </h3>
          
          <p className="text-[10px] sm:text-xs text-slate-500 line-clamp-2 leading-relaxed mb-2.5 sm:mb-3">
            {product.shortDescription}
          </p>
        </div>

        {/* Pricing, sales count & Add-to-cart row */}
        <div>
          {/* Rating stars & Sales count */}
          <div className="flex items-center gap-1 sm:gap-1.5 mb-2.5 sm:mb-3 text-[10px] sm:text-xs text-slate-400 font-medium">
            <div className="flex items-center text-amber-500">
              <Star size={10} className="fill-amber-500 shrink-0" />
              <span className="font-bold text-slate-700 ml-0.5">{product.rating.toFixed(1)}</span>
            </div>
            <span>•</span>
            <span className="text-[8px] sm:text-[10px] bg-slate-100 text-slate-600 px-1 sm:px-1.5 py-0.5 rounded-full font-bold">
              {product.salesCount} sold
            </span>
          </div>

          <div className="flex items-center justify-between border-t border-slate-100/50 pt-2.5 sm:pt-3 mt-1.5 sm:mt-2">
            <div className="flex flex-col">
              <div className="flex items-baseline gap-0.5 sm:gap-1">
                <span className="text-sm sm:text-base md:text-lg font-black text-blue-600">৳{product.priceBDT.toLocaleString()}</span>
              </div>
              
              {product.oldPriceBDT && (
                <div className="flex items-baseline gap-0.5 sm:gap-1 -mt-0.5 text-[8px] sm:text-[10px] text-slate-400 font-medium line-through">
                  <span>৳{product.oldPriceBDT.toLocaleString()}</span>
                </div>
              )}
            </div>

            {/* View Details/Add to Cart Button */}
            <div className="flex items-center gap-1 sm:gap-1.5">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onSelect(product);
                }}
                className="p-1.5 sm:p-2 bg-slate-100 hover:bg-blue-50 text-slate-600 hover:text-blue-600 rounded-lg sm:rounded-xl transition-all"
                title="Quick View"
              >
                <Eye size={13} />
              </button>

              <button
                onClick={(e) => onAddToCart(product, e)}
                className="w-7 h-7 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-slate-950 text-white flex items-center justify-center hover:bg-blue-600 shadow-md transition-colors"
                title="Add to Cart"
              >
                <ShoppingCart size={12} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
