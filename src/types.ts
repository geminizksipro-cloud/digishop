export interface VersionHistory {
  version: string;
  date: string;
  changes: string[];
}

export interface Review {
  id: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  date: string;
  verified: boolean;
  helpfulVotes: number;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface Product {
  id: string;
  title: string;
  shortDescription: string;
  longDescription: string;
  priceUSD: number;
  priceBDT: number;
  oldPriceUSD?: number;
  oldPriceBDT?: number;
  rating: number;
  salesCount: number;
  category: string;
  tags: string[];
  features: string[];
  whatsIncluded: string[];
  versionHistory: VersionHistory[];
  reviews: Review[];
  faqs: FAQItem[];
  coverGradient: string; // Beautiful gradients matching Frosted Glass Theme
  previewVideo?: string;
  fileSize: string;
  compatiblePlatforms: string[];
  licenseType: string;
  downloadUrl: string; // Simulated download asset
  isFlashDeal?: boolean;
  flashDealExpiry?: string; // ISO String
  imageUrl?: string;
  promoCode?: string;
  promoDiscountBDT?: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedLicense: 'personal' | 'commercial' | 'extended';
}

export interface Order {
  id: string;
  userId: string;
  userEmail?: string;
  customerName?: string;
  customerWhatsapp?: string;
  date: string;
  items: {
    productId: string;
    productTitle: string;
    priceUSD: number;
    priceBDT: number;
    license: string;
  }[];
  totalUSD: number;
  totalBDT: number;
  paymentMethod: string;
  paymentStatus: 'Pending' | 'Processing' | 'Paid' | 'Delivered' | 'Refunded' | 'Cancelled';
  couponCode?: string;
  invoiceId?: string;
  licenseKeys: Record<string, string>; // Maps productId to a unique license key
}

export interface UserProfile {
  id?: string;
  name: string;
  email: string;
  avatar: string;
  phone?: string;
  joinedDate: string;
  wishlist: string[]; // Product IDs
  purchasedProductIds: string[]; // Product IDs
}

export interface Coupon {
  code: string;
  discountPercent: number;
  description: string;
  minSpendUSD: number;
}
