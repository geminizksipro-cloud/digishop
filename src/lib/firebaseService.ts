import { 
  collection, 
  doc, 
  getDocs, 
  getDoc,
  setDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where,
  orderBy, 
  addDoc, 
  limit,
  deleteField
} from 'firebase/firestore';
import { db, auth } from './firebase';
import { Product, Order, UserProfile } from '../types';
import { PRODUCTS } from '../data/products';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Helper to seed products if the collection is empty
export async function seedProductsIfEmpty() {
  try {
    const productsCol = collection(db, 'products');
    const snapshot = await getDocs(productsCol);
    if (snapshot.empty) {
      console.log('Seeding products collection in Firestore...');
      for (const prod of PRODUCTS) {
        await setDoc(doc(db, 'products', prod.id), {
          title: prod.title,
          shortDescription: prod.shortDescription,
          longDescription: prod.longDescription,
          priceUSD: Number(prod.priceUSD),
          priceBDT: Number(prod.priceBDT),
          oldPriceUSD: prod.oldPriceUSD ? Number(prod.oldPriceUSD) : null,
          oldPriceBDT: prod.oldPriceBDT ? Number(prod.oldPriceBDT) : null,
          rating: Number(prod.rating),
          salesCount: Number(prod.salesCount),
          category: prod.category,
          tags: prod.tags || [],
          features: prod.features || [],
          whatsIncluded: prod.whatsIncluded || [],
          fileSize: '',
          compatiblePlatforms: [],
          licenseType: '',
          downloadUrl: prod.downloadUrl || 'https://example.com/download',
          isFlashDeal: prod.isFlashDeal || false,
          flashDealExpiry: prod.flashDealExpiry || '',
          coverGradient: prod.coverGradient || 'from-blue-600/20 via-sky-600/10 to-transparent',
          promoCode: prod.promoCode || null,
          promoDiscountBDT: prod.promoDiscountBDT ? Number(prod.promoDiscountBDT) : null
        });
      }
    }
  } catch (err) {
    console.warn('Could not seed products (this is normal for guest/customer roles lacking write permissions):', err);
  }
}

// Fetch all products
export async function getProductsFromFirestore(): Promise<Product[]> {
  try {
    await seedProductsIfEmpty();
  } catch (err) {
    console.warn('Seeding failed:', err);
  }

  try {
    const productsCol = collection(db, 'products');
    const snapshot = await getDocs(productsCol);
    
    if (snapshot.empty) {
      console.log('Firestore products collection is empty, returning local fallback products.');
      return PRODUCTS;
    }

    const products: Product[] = [];
    snapshot.forEach((docSnap) => {
      const data = docSnap.data();

      // Background cleanup: If there are existing specs in Firestore, delete those fields from the document
      if (data.fileSize || data.licenseType || (data.compatiblePlatforms && data.compatiblePlatforms.length > 0) || (data.versionHistory && data.versionHistory.length > 0)) {
        updateDoc(docSnap.ref, {
          fileSize: deleteField(),
          licenseType: deleteField(),
          compatiblePlatforms: deleteField(),
          versionHistory: deleteField()
        }).catch((err) => {
          console.warn(`Could not purge specs for product ${docSnap.id}:`, err);
        });
      }

      products.push({
        id: docSnap.id,
        title: data.title || '',
        shortDescription: data.shortDescription || '',
        longDescription: data.longDescription || '',
        priceUSD: Number(data.priceUSD || 0),
        priceBDT: Number(data.priceBDT || 0),
        oldPriceUSD: data.oldPriceUSD ? Number(data.oldPriceUSD) : undefined,
        oldPriceBDT: data.oldPriceBDT ? Number(data.oldPriceBDT) : undefined,
        rating: Number(data.rating || 5.0),
        salesCount: Number(data.salesCount || 0),
        category: data.category || 'UI Templates',
        tags: data.tags || [],
        features: data.features || [],
        whatsIncluded: data.whatsIncluded || [],
        fileSize: '',
        compatiblePlatforms: [],
        licenseType: '',
        downloadUrl: data.downloadUrl || '',
        isFlashDeal: data.isFlashDeal || false,
        flashDealExpiry: data.flashDealExpiry || '',
        coverGradient: data.coverGradient || 'from-blue-600/20 via-sky-600/10 to-transparent',
        imageUrl: data.imageUrl || '',
        promoCode: data.promoCode || '',
        promoDiscountBDT: data.promoDiscountBDT ? Number(data.promoDiscountBDT) : undefined,
        versionHistory: [],
        reviews: data.reviews || [],
        faqs: data.faqs || []
      });
    });
    return products;
  } catch (err) {
    console.error('Failed to get products from Firestore, falling back to local products:', err);
    return PRODUCTS;
  }
}

// Add or update a product
export async function saveProductToFirestore(product: Product): Promise<void> {
  const prodRef = doc(db, 'products', product.id);
  await setDoc(prodRef, {
    title: product.title,
    shortDescription: product.shortDescription,
    longDescription: product.longDescription,
    priceUSD: Number(product.priceUSD),
    priceBDT: Number(product.priceBDT),
    oldPriceUSD: product.oldPriceUSD ? Number(product.oldPriceUSD) : null,
    oldPriceBDT: product.oldPriceBDT ? Number(product.oldPriceBDT) : null,
    rating: Number(product.rating || 5.0),
    salesCount: Number(product.salesCount || 0),
    category: product.category,
    tags: product.tags || [],
    features: product.features || [],
    whatsIncluded: product.whatsIncluded || [],
    fileSize: '',
    compatiblePlatforms: [],
    licenseType: '',
    downloadUrl: product.downloadUrl || '',
    isFlashDeal: product.isFlashDeal || false,
    flashDealExpiry: product.flashDealExpiry || '',
    coverGradient: product.coverGradient || 'from-blue-600/20 via-sky-600/10 to-transparent',
    imageUrl: product.imageUrl || '',
    promoCode: product.promoCode || null,
    promoDiscountBDT: product.promoDiscountBDT ? Number(product.promoDiscountBDT) : null,
    versionHistory: [],
    reviews: product.reviews || [],
    faqs: product.faqs || []
  });
}

// Delete product
export async function deleteProductFromFirestore(productId: string): Promise<void> {
  const prodRef = doc(db, 'products', productId);
  await deleteDoc(prodRef);
}

// Fetch all orders
export async function getOrdersFromFirestore(): Promise<Order[]> {
  try {
    const ordersCol = collection(db, 'orders');
    const snapshot = await getDocs(ordersCol);
    const orders: Order[] = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      orders.push({
        id: doc.id,
        userId: data.userId || '',
        userEmail: data.userEmail || data.userId || '',
        date: data.date || '',
        items: data.items || [],
        totalUSD: Number(data.totalUSD || 0),
        totalBDT: Number(data.totalBDT || 0),
        paymentMethod: data.paymentMethod || 'bKash',
        paymentStatus: data.paymentStatus || 'Paid',
        couponCode: data.couponCode || '',
        licenseKeys: data.licenseKeys || {}
      });
    });
    // Sort by date descending
    return orders.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  } catch (err) {
    if (err instanceof Error && err.message.includes('permission')) {
      handleFirestoreError(err, OperationType.LIST, 'orders');
    }
    throw err;
  }
}

// Save order
export async function saveOrderToFirestore(order: Order): Promise<void> {
  try {
    const orderRef = doc(db, 'orders', order.id);
    await setDoc(orderRef, {
      userId: order.userId,
      userEmail: order.userEmail || '',
      date: order.date,
      items: order.items,
      totalUSD: Number(order.totalUSD),
      totalBDT: Number(order.totalBDT),
      paymentMethod: order.paymentMethod,
      paymentStatus: order.paymentStatus,
      couponCode: order.couponCode || null,
      licenseKeys: order.licenseKeys || {}
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `orders/${order.id}`);
  }

  // Also update user purchased products if user profile exists
  if (order.userId && order.userId !== 'guest@digimarkt.bd') {
    try {
      const userRef = doc(db, 'users', order.userId);
      const newProductIds = order.items.map(item => item.productId);
      
      // Update purchasedProductIds in the user doc
      await setDoc(userRef, {
        purchasedProductIds: newProductIds
      }, { merge: true });
    } catch (err) {
      console.error('Error updating user purchase history in Firestore:', err);
      if (err instanceof Error && err.message.includes('permission')) {
        handleFirestoreError(err, OperationType.WRITE, `users/${order.userId}`);
      }
    }
  }
}

// Delete order
export async function deleteOrderFromFirestore(orderId: string): Promise<void> {
  try {
    const orderRef = doc(db, 'orders', orderId);
    await deleteDoc(orderRef);
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `orders/${orderId}`);
    throw err;
  }
}

// Fetch all users
export async function getUsersFromFirestore(): Promise<UserProfile[]> {
  try {
    const usersCol = collection(db, 'users');
    const snapshot = await getDocs(usersCol);
    const users: UserProfile[] = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      users.push({
        id: doc.id,
        name: data.name || '',
        email: data.email || doc.id, // Fallback to doc ID (which might be email or uid)
        avatar: data.avatar || `https://api.dicebear.com/7.x/pixel-art/svg?seed=${doc.id}`,
        phone: data.phone || '',
        joinedDate: data.joinedDate || new Date().toISOString(),
        wishlist: data.wishlist || [],
        purchasedProductIds: data.purchasedProductIds || []
      });
    });
    return users;
  } catch (err) {
    if (err instanceof Error && err.message.includes('permission')) {
      handleFirestoreError(err, OperationType.LIST, 'users');
    }
    throw err;
  }
}

// Save or update user profile
export async function saveUserToFirestore(userId: string, user: UserProfile): Promise<void> {
  try {
    const userRef = doc(db, 'users', userId);
    await setDoc(userRef, {
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      phone: user.phone || '',
      joinedDate: user.joinedDate || new Date().toISOString(),
      wishlist: user.wishlist || [],
      purchasedProductIds: user.purchasedProductIds || []
    }, { merge: true });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `users/${userId}`);
  }
}

// Save Activity Logs
export interface FirestoreActivityLog {
  id: string;
  time: string;
  user: string;
  action: string;
  type: 'auth' | 'product' | 'order' | 'system' | 'coupon';
  status: 'success' | 'warn' | 'error';
}

export async function getActivityLogsFromFirestore(): Promise<FirestoreActivityLog[]> {
  const logsCol = collection(db, 'activityLogs');
  const snapshot = await getDocs(logsCol);
  const logs: FirestoreActivityLog[] = [];
  snapshot.forEach((doc) => {
    const data = doc.data();
    logs.push({
      id: doc.id,
      time: data.time || '',
      user: data.user || 'system',
      action: data.action || '',
      type: data.type || 'system',
      status: data.status || 'success'
    });
  });
  // Sort logs
  return logs.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());
}

export async function saveActivityLogToFirestore(log: FirestoreActivityLog): Promise<void> {
  const logRef = doc(db, 'activityLogs', log.id);
  await setDoc(logRef, {
    time: log.time,
    user: log.user,
    action: log.action,
    type: log.type,
    status: log.status
  });
}

// Fetch a single user profile from Firestore securely
export async function getUserProfileFromFirestore(userId: string): Promise<UserProfile | null> {
  try {
    const userRef = doc(db, 'users', userId);
    const docSnap = await getDoc(userRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        name: data.name || '',
        email: data.email || userId,
        avatar: data.avatar || `https://api.dicebear.com/7.x/pixel-art/svg?seed=${userId}`,
        phone: data.phone || '',
        joinedDate: data.joinedDate || new Date().toISOString(),
        wishlist: data.wishlist || [],
        purchasedProductIds: data.purchasedProductIds || []
      };
    }
  } catch (err) {
    console.error(`Error loading user profile for ${userId} from Firestore:`, err);
  }
  return null;
}

// Fetch all orders for a specific user securely
export async function getOrdersForUserFromFirestore(userId: string): Promise<Order[]> {
  try {
    const ordersCol = collection(db, 'orders');
    const q = query(ordersCol, where('userId', '==', userId));
    const snapshot = await getDocs(q);
    const orders: Order[] = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      orders.push({
        id: doc.id,
        userId: data.userId || '',
        userEmail: data.userEmail || data.userId || '',
        date: data.date || '',
        items: data.items || [],
        totalUSD: Number(data.totalUSD || 0),
        totalBDT: Number(data.totalBDT || 0),
        paymentMethod: data.paymentMethod || 'bKash',
        paymentStatus: data.paymentStatus || 'Paid',
        couponCode: data.couponCode || '',
        licenseKeys: data.licenseKeys || {}
      });
    });
    return orders.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  } catch (err) {
    console.error(`Error loading user orders for ${userId} from Firestore:`, err);
    if (err instanceof Error && err.message.includes('permission')) {
      handleFirestoreError(err, OperationType.LIST, 'orders');
    }
    return [];
  }
}
