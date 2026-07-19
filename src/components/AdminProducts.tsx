import React, { useState } from 'react';
import { 
  Plus, Search, Edit3, Trash2, Tag, Layers, Check, X, Eye, 
  HelpCircle, Sparkles, Flame, DollarSign, ArrowUpRight, AlertCircle
} from 'lucide-react';
import { Product } from '../types';
import { CATEGORIES } from '../data/products';

interface AdminProductsProps {
  products: Product[];
  onAddProduct: (product: Product) => void;
  onUpdateProduct: (product: Product) => void;
  onDeleteProduct: (productId: string) => void;
  currency: 'BDT' | 'USD';
}

export default function AdminProducts({
  products,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  currency
}: AdminProductsProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProductId, setDeletingProductId] = useState<string | null>(null);

  // Form Fields
  const [title, setTitle] = useState('');
  const [shortDesc, setShortDesc] = useState('');
  const [longDesc, setLongDesc] = useState('');
  const [priceUSD, setPriceUSD] = useState<number>(0);
  const [priceBDT, setPriceBDT] = useState<number>(0);
  const [category, setCategory] = useState('UI Templates');
  const [fileSize, setFileSize] = useState('15.5 MB');
  const [licenseType, setLicenseType] = useState('Commercial Use');
  const [downloadUrl, setDownloadUrl] = useState('https://example.com/downloads/premium-asset.zip');
  
  // Collections states for form
  const [newTag, setNewTag] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [newFeature, setNewFeature] = useState('');
  const [features, setFeatures] = useState<string[]>([]);
  const [newIncluded, setNewIncluded] = useState('');
  const [whatsIncluded, setWhatsIncluded] = useState<string[]>([]);
  const [isFlashDeal, setIsFlashDeal] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [promoCode, setPromoCode] = useState('');
  const [promoDiscountBDT, setPromoDiscountBDT] = useState<number>(0);

  // Open modal for Creating
  const handleOpenCreate = () => {
    setEditingProduct(null);
    setTitle('');
    setShortDesc('');
    setLongDesc('');
    setPriceUSD(29);
    setPriceBDT(3400);
    setCategory('UI Templates');
    setFileSize('');
    setLicenseType('');
    setDownloadUrl('https://example.com/downloads/asset-pro.zip');
    setImageUrl('');
    setTags(['React', 'Tailwind', 'SaaS']);
    setFeatures([
      'Fully responsive clean layouts',
      'High performance loading animations',
      '100% editable with type interfaces'
    ]);
    setWhatsIncluded([
      'Full TypeScript codebase archive',
      'PDF Quickstart user instructions',
      '1 Year developer support'
    ]);
    setIsFlashDeal(false);
    setPromoCode('');
    setPromoDiscountBDT(0);
    setIsModalOpen(true);
  };

  // Open modal for Editing
  const handleOpenEdit = (product: Product) => {
    setEditingProduct(product);
    setTitle(product.title);
    setShortDesc(product.shortDescription);
    setLongDesc(product.longDescription);
    setPriceUSD(product.priceUSD);
    setPriceBDT(product.priceBDT);
    setCategory(product.category);
    setFileSize('');
    setLicenseType('');
    setDownloadUrl(product.downloadUrl);
    setImageUrl(product.imageUrl || '');
    setTags(product.tags || []);
    setFeatures(product.features || []);
    setWhatsIncluded(product.whatsIncluded || []);
    setIsFlashDeal(!!product.isFlashDeal);
    setPromoCode(product.promoCode || '');
    setPromoDiscountBDT(product.promoDiscountBDT || 0);
    setIsModalOpen(true);
  };

  // Handle Form Submit (Add or Edit)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !shortDesc || !longDesc) {
      alert('Please fill out the product title and description fields.');
      return;
    }

    const payload: Product = {
      id: editingProduct ? editingProduct.id : title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      title,
      shortDescription: shortDesc,
      longDescription: longDesc,
      priceUSD,
      priceBDT,
      category,
      fileSize: '',
      licenseType: '',
      downloadUrl,
      imageUrl: imageUrl || undefined,
      rating: editingProduct ? editingProduct.rating : 5.0,
      salesCount: editingProduct ? editingProduct.salesCount : 0,
      tags,
      features,
      whatsIncluded,
      compatiblePlatforms: [],
      coverGradient: editingProduct ? editingProduct.coverGradient : 'from-blue-600/20 via-sky-600/10 to-transparent',
      versionHistory: [],
      reviews: editingProduct ? editingProduct.reviews : [],
      faqs: editingProduct ? editingProduct.faqs : [
        { question: 'Is priority developer support active?', answer: 'Yes, full commercial support covers all license purchases on DigiMarkt BD.' }
      ],
      isFlashDeal,
      flashDealExpiry: isFlashDeal ? new Date(Date.now() + 18 * 60 * 60 * 1000).toISOString() : undefined,
      promoCode: promoCode || undefined,
      promoDiscountBDT: promoDiscountBDT > 0 ? promoDiscountBDT : undefined
    };

    if (editingProduct) {
      onUpdateProduct(payload);
    } else {
      onAddProduct(payload);
    }
    setIsModalOpen(false);
  };

  // Tag & List additions helpers
  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const handleAddFeature = () => {
    if (newFeature.trim() && !features.includes(newFeature.trim())) {
      setFeatures([...features, newFeature.trim()]);
      setNewFeature('');
    }
  };

  const handleAddIncluded = () => {
    if (newIncluded.trim() && !whatsIncluded.includes(newIncluded.trim())) {
      setWhatsIncluded([...whatsIncluded, newIncluded.trim()]);
      setNewIncluded('');
    }
  };

  const handleDeleteProductConfirm = (productId: string) => {
    setDeletingProductId(productId);
  };

  // Filter Catalog
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCat = selectedCategory === 'All' || p.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6">
      {/* Search and Quick Filters header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3 bg-white/70 backdrop-blur-md border border-slate-100 rounded-2xl px-3.5 py-1.5 flex-1 max-w-md shadow-inner">
          <Search size={15} className="text-slate-400" />
          <input
            type="text"
            placeholder="Search catalog by title, tags or tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs font-semibold text-slate-800 bg-transparent outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          {/* Category Dropdown */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-white/70 backdrop-blur-md border border-slate-200/50 hover:bg-white text-xs font-bold text-slate-700 px-3 py-2.5 rounded-2xl outline-none cursor-pointer transition-colors shadow-sm"
          >
            <option value="All">All Categories</option>
            {CATEGORIES.filter(c => c !== 'All').map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          {/* Add product button */}
          <button
            onClick={handleOpenCreate}
            className="h-10 rounded-2xl bg-blue-600 hover:bg-blue-700 hover:scale-[1.01] transition-all px-4 flex items-center gap-2 text-xs font-black text-white shadow-lg shadow-blue-200 cursor-pointer"
          >
            <Plus size={15} />
            <span>Add Asset</span>
          </button>
        </div>
      </div>

      {/* Product List Table */}
      <div className="bg-white/70 backdrop-blur-md border border-white/60 rounded-3xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50 text-slate-400 font-extrabold text-[10px] uppercase tracking-wider">
                <th className="p-4 pl-6">Product details</th>
                <th className="p-4">Category</th>
                <th className="p-4 text-center">Unit Price BDT/USD</th>
                <th className="p-4 text-center">Sales count</th>
                <th className="p-4 text-center">Flash Deal</th>
                <th className="p-4 text-center">Rating</th>
                <th className="p-4 text-right pr-6">Manage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
              {filteredProducts.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/40 transition-colors">
                  {/* Title & Desc */}
                  <td className="p-4 pl-6 max-w-sm">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${p.coverGradient} flex items-center justify-center font-bold text-blue-600 text-xs border border-blue-100/50 shadow-inner shrink-0`}>
                        {p.category[0]}
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-xs font-extrabold text-slate-900 leading-snug group-hover:text-blue-600 truncate">{p.title}</h4>
                        <p className="text-[10px] text-slate-400 font-medium truncate mt-0.5">{p.shortDescription}</p>
                      </div>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="p-4">
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                      <Layers size={10} />
                      {p.category}
                    </span>
                  </td>

                  {/* Price */}
                  <td className="p-4 text-center">
                    <div className="flex flex-col items-center">
                      <span className="text-slate-900 font-black text-xs">৳{p.priceBDT.toLocaleString()}</span>
                      <span className="text-slate-400 text-[10px] font-bold">${p.priceUSD}</span>
                    </div>
                  </td>

                  {/* Sales */}
                  <td className="p-4 text-center">
                    <span className="text-slate-800 font-bold text-xs bg-blue-50/50 px-2 py-1 rounded-xl">
                      {p.salesCount} copies
                    </span>
                  </td>

                  {/* Flash Deal Toggle */}
                  <td className="p-4 text-center">
                    <button
                      onClick={() => {
                        const updated = { ...p, isFlashDeal: !p.isFlashDeal };
                        onUpdateProduct(updated);
                      }}
                      className={`inline-flex items-center gap-1 text-[10px] font-black uppercase px-2.5 py-1 rounded-full border transition-all ${
                        p.isFlashDeal
                          ? 'bg-amber-500 text-slate-950 border-amber-300 animate-pulse'
                          : 'bg-slate-50 text-slate-400 border-slate-100 hover:text-slate-700'
                      }`}
                      title="Toggle Evening flash deal"
                    >
                      <Flame size={12} className={p.isFlashDeal ? 'fill-slate-950' : ''} />
                      <span>{p.isFlashDeal ? 'Active' : 'Offline'}</span>
                    </button>
                  </td>

                  {/* Rating */}
                  <td className="p-4 text-center">
                    <div className="inline-flex items-center gap-0.5 text-amber-500">
                      <span>★</span>
                      <span className="text-xs text-slate-800 font-black">{p.rating.toFixed(1)}</span>
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="p-4 text-right pr-6">
                    <div className="flex items-center justify-end gap-1.5">
                      {/* Live Link */}
                      <a 
                        href={`/#product=${p.id}`} 
                        className="p-1.5 bg-slate-50 text-slate-400 hover:text-blue-600 hover:bg-blue-50/50 rounded-lg border border-transparent hover:border-blue-100 transition-colors"
                        title="View details as customer"
                      >
                        <Eye size={13} />
                      </a>

                      {/* Edit */}
                      <button
                        onClick={() => handleOpenEdit(p)}
                        className="p-1.5 bg-slate-50 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50/50 rounded-lg border border-transparent hover:border-indigo-100 transition-colors cursor-pointer"
                        title="Edit asset attributes"
                      >
                        <Edit3 size={13} />
                      </button>

                      {/* Delete */}
                      <button
                        onClick={() => handleDeleteProductConfirm(p.id)}
                        className="p-1.5 bg-slate-50 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg border border-transparent hover:border-red-100 transition-colors cursor-pointer"
                        title="Delete from marketplace"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-slate-400 font-semibold">
                    No digital products match your active search terms or category.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CRUD Add/Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[140] bg-slate-950/40 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h3 className="text-sm font-black uppercase text-slate-800 tracking-wider">
                {editingProduct ? `Edit ${editingProduct.title}` : 'Add New Digital Asset'}
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 bg-slate-50 p-1.5 rounded-full"
              >
                <X size={15} />
              </button>
            </div>

            {/* Scrollable Body */}
            <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-5 flex-1 text-slate-800">
              {/* Row 1: Title & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Title name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. SSLCommerz Bangla SDK"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:bg-white focus:border-blue-500 outline-none transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Division category *</label>
                  <select
                    value={category}
                    onChange={(e) => {
                      const selectedVal = e.target.value;
                      setCategory(selectedVal);
                      if (selectedVal === 'Premium Accounts') {
                        setFileSize('');
                        setLicenseType('');
                      }
                    }}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:bg-white focus:border-blue-500 outline-none transition-colors cursor-pointer"
                  >
                    {CATEGORIES.filter(c => c !== 'All').map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Row 2: Short description */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Short description (Max 300 Chars) *</label>
                <input
                  type="text"
                  required
                  maxLength={300}
                  placeholder="e.g. Zero-dependency payment gateway wrapper optimized for local wallets."
                  value={shortDesc}
                  onChange={(e) => setShortDesc(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:bg-white focus:border-blue-500 outline-none transition-colors"
                />
              </div>

              {/* Row 3: Long description */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Long markdown description *</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Supports full details, markdown syntax and structural blocks."
                  value={longDesc}
                  onChange={(e) => setLongDesc(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:bg-white focus:border-blue-500 outline-none transition-colors resize-none"
                />
              </div>

              {/* Row 4: Pricing BDT & USD */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Price in BDT *</label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-2 text-xs font-extrabold text-slate-400">৳</span>
                    <input
                      type="number"
                      required
                      min={0}
                      value={priceBDT}
                      onChange={(e) => setPriceBDT(Number(e.target.value))}
                      className="w-full pl-7 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:bg-white focus:border-blue-500 outline-none transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Price in USD *</label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-2 text-xs font-extrabold text-slate-400">$</span>
                    <input
                      type="number"
                      required
                      min={0}
                      value={priceUSD}
                      onChange={(e) => setPriceUSD(Number(e.target.value))}
                      className="w-full pl-7 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:bg-white focus:border-blue-500 outline-none transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Row 5: Asset Download URL (Optional) */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Asset Download URL (Optional)</label>
                <input
                  type="text"
                  value={downloadUrl}
                  onChange={(e) => setDownloadUrl(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:bg-white focus:border-blue-500 outline-none transition-colors"
                />
              </div>

              {/* Product Image URL Input */}
              <div className="space-y-1.5 bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">Product Image URL (Optional)</label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/photo-... or any valid image link"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold focus:border-blue-500 outline-none transition-colors"
                  />
                </div>
                {imageUrl && (
                  <div className="mt-3 relative w-32 h-20 rounded-xl overflow-hidden border border-slate-200 bg-white shadow-sm">
                    <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    <button 
                      type="button" 
                      onClick={() => setImageUrl('')}
                      className="absolute top-1.5 right-1.5 bg-red-500 hover:bg-red-600 text-white p-1 rounded-full text-xs transition-colors shadow-sm"
                      title="Remove image"
                    >
                      <X size={10} />
                    </button>
                  </div>
                )}
              </div>

              {/* Tags Section */}
              <div className="space-y-2">
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">Search tags & tags</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Type and press add"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                    className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:bg-white focus:border-blue-500 outline-none flex-1"
                  />
                  <button
                    type="button"
                    onClick={handleAddTag}
                    className="px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-black rounded-xl cursor-pointer"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {tags.map(t => (
                    <span key={t} className="inline-flex items-center gap-1 bg-blue-50 text-blue-600 px-2.5 py-1 rounded-xl text-[10px] font-extrabold">
                      <span>{t}</span>
                      <button type="button" onClick={() => setTags(tags.filter(tg => tg !== t))} className="text-blue-400 hover:text-blue-700">
                        <X size={10} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Features List Section */}
              <div className="space-y-2">
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">Highlights / Features</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. 100% Mobile Optimized design grid"
                    value={newFeature}
                    onChange={(e) => setNewFeature(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddFeature())}
                    className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:bg-white focus:border-blue-500 outline-none flex-1"
                  />
                  <button
                    type="button"
                    onClick={handleAddFeature}
                    className="px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-black rounded-xl cursor-pointer"
                  >
                    Add
                  </button>
                </div>
                <ul className="space-y-1.5 pt-1">
                  {features.map(f => (
                    <li key={f} className="flex items-center justify-between text-xs font-bold text-slate-600 bg-slate-50 px-3 py-1.5 rounded-xl">
                      <span>• {f}</span>
                      <button type="button" onClick={() => setFeatures(features.filter(ft => ft !== f))} className="text-slate-400 hover:text-red-500">
                        <X size={12} />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* whatsIncluded Section */}
              <div className="space-y-2">
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">What is included in package</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. Step-by-step setup documentation PDF"
                    value={newIncluded}
                    onChange={(e) => setNewIncluded(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddIncluded())}
                    className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:bg-white focus:border-blue-500 outline-none flex-1"
                  />
                  <button
                    type="button"
                    onClick={handleAddIncluded}
                    className="px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-black rounded-xl cursor-pointer"
                  >
                    Add
                  </button>
                </div>
                <ul className="space-y-1.5 pt-1">
                  {whatsIncluded.map(wi => (
                    <li key={wi} className="flex items-center justify-between text-xs font-bold text-slate-600 bg-slate-50 px-3 py-1.5 rounded-xl">
                      <span>✔ {wi}</span>
                      <button type="button" onClick={() => setWhatsIncluded(whatsIncluded.filter(item => item !== wi))} className="text-slate-400 hover:text-red-500">
                        <X size={12} />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Product Promo Code & Discount */}
              <div className="bg-blue-50/40 p-4 rounded-2xl border border-blue-100/50 space-y-3">
                <span className="text-[10px] font-extrabold text-blue-600 uppercase tracking-wider block">Product-Specific Promo Code (Optional)</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Promo Code</label>
                    <input
                      type="text"
                      placeholder="e.g. FLASH500"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold focus:border-blue-500 outline-none uppercase"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Discount Amount (BDT)</label>
                    <input
                      type="number"
                      min={0}
                      placeholder="e.g. 500"
                      value={promoDiscountBDT || ''}
                      onChange={(e) => setPromoDiscountBDT(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold focus:border-blue-500 outline-none"
                    />
                  </div>
                </div>
                <p className="text-[9px] text-slate-400">
                  When a customer applies this promo code in their cart, they will get a direct discount of this amount in BDT on this product.
                </p>
              </div>

              {/* Flash Deal Setting */}
              <div className="flex items-center gap-2 p-3 bg-amber-50 rounded-2xl border border-amber-100/50">
                <input
                  type="checkbox"
                  id="modal-flash-checkbox"
                  checked={isFlashDeal}
                  onChange={(e) => setIsFlashDeal(e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="modal-flash-checkbox" className="text-xs font-black text-amber-900 flex items-center gap-1.5 cursor-pointer">
                  <Flame size={14} className="fill-amber-500 text-amber-600" />
                  <span>Promote as Flash Deal (Enables discount triggers & countdowns)</span>
                </label>
              </div>

              {/* Submit panel */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-black text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md transition-all cursor-pointer"
                >
                  {editingProduct ? 'Save Changes' : 'Publish Asset'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Custom Interactive Delete Warning Alert Dialog Modal */}
      {deletingProductId && (
        <div className="fixed inset-0 z-[150] bg-slate-950/50 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-[28px] w-full max-w-sm p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-red-50 border border-red-100 flex items-center justify-center text-red-500 mb-4 animate-bounce">
                <AlertCircle size={24} />
              </div>
              <h3 className="text-base font-black text-slate-900 uppercase tracking-tight">
                Confirm Deletion?
              </h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Are you absolutely sure you want to permanently delete{' '}
                <span className="font-extrabold text-slate-800">
                  "{products.find(p => p.id === deletingProductId)?.title || 'this digital asset'}"
                </span>
                ? This operation is irreversible and will remove it from the catalog immediately.
              </p>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => setDeletingProductId(null)}
                className="flex-1 h-11 bg-slate-100 hover:bg-slate-200 text-slate-600 font-extrabold text-xs rounded-xl transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  if (deletingProductId) {
                    onDeleteProduct(deletingProductId);
                    setDeletingProductId(null);
                  }
                }}
                className="flex-1 h-11 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-red-500/10 transition-all cursor-pointer animate-pulse"
              >
                Delete Asset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
