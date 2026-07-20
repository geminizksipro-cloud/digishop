import 'dotenv/config';
import express from 'express';
import path from 'path';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// 1. Initialize Firebase Admin dynamically using credentials from environment variables if present (needed for Netlify/external servers), otherwise fallback to local defaults
const getFirebaseAdminDb = () => {
  if (getApps().length === 0) {
    const projectId = process.env.FIREBASE_PROJECT_ID || "ai-studio-applet-webapp-105ba";
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    let privateKey = process.env.FIREBASE_PRIVATE_KEY;

    if (process.env.FIREBASE_PROJECT_ID && clientEmail && privateKey) {
      // Replace literal \n from environmental secrets with actual system newlines
      privateKey = privateKey.replace(/\\n/g, '\n');
      console.log('Firebase Admin: Initializing using customized environment variables.');
      initializeApp({
        credential: cert({
          projectId,
          clientEmail,
          privateKey
        }),
        projectId
      });
    } else {
      console.log('Firebase Admin: Initializing using local default credentials.');
      try {
        initializeApp({
          projectId: "ai-studio-applet-webapp-105ba"
        });
      } catch (err: any) {
        console.error("Failed to initialize Firebase with default credentials:", err.message);
        throw new Error("Firebase Admin credentials are required in this environment. Please configure FIREBASE_CLIENT_EMAIL and FIREBASE_PRIVATE_KEY.");
      }
    }
  }
  const dbId = process.env.FIREBASE_DATABASE_ID || "ai-studio-digimarktbd-809b0803-e513-4cac-b196-2ecffa5af32f";
  return getFirestore(dbId);
};

let dbInstance: any = null;
const getDb = () => {
  if (!dbInstance) {
    dbInstance = getFirebaseAdminDb();
  }
  return dbInstance;
};

// UddoktaPay / Paymently API Configurations
let UDDOKTAPAY_API_KEY = process.env.PAYMENT_API_KEY || process.env.UDDOKTAPAY_API_KEY || 'a0u7xqq21IRUDUIYamk3jLQT3KwqRIkX0aVGkR7Q';
if (UDDOKTAPAY_API_KEY === 'u8jrK1ke69REzIELoy9SRl10vExeRksPRpjP7m8A') {
  UDDOKTAPAY_API_KEY = 'a0u7xqq21IRUDUIYamk3jLQT3KwqRIkX0aVGkR7Q';
}
const envEndpoint = process.env.PAYMENT_API_ENDPOINT || process.env.UDDOKTAPAY_API_ENDPOINT;

const UDDOKTAPAY_CANDIDATE_URLS = envEndpoint 
  ? [envEndpoint] 
  : [
      'https://digitalmarketbd.paymently.io/api',
      'https://digimarktbd.paymently.io/api'
    ];
let activeUddoktaPayBaseUrl = UDDOKTAPAY_CANDIDATE_URLS[0];

const app = express();

  // Middleware for body parsing
  app.use(express.json());

  // Support Netlify Serverless Functions path prefix routing
  app.use((req, res, next) => {
    if (req.url.startsWith('/.netlify/functions/api')) {
      req.url = req.url.replace('/.netlify/functions/api', '/api');
    }
    next();
  });

  // Custom CORS middleware to support cross-origin requests (e.g. from Netlify)
  app.use((req, res, next) => {
    const origin = req.headers.origin;
    if (origin) {
      res.setHeader('Access-Control-Allow-Origin', origin);
    } else {
      res.setHeader('Access-Control-Allow-Origin', '*');
    }
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, RT-UDDOKTAPAY-API-KEY');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    
    if (req.method === 'OPTIONS') {
      return res.sendStatus(200);
    }
    next();
  });

  // Helper to securely calculate cart totals on the server using current product database
  const getSecureCartTotals = async (cartItems: any[], couponCode?: string) => {
    let subtotalBDT = 0;
    let subtotalUSD = 0;

    for (const item of cartItems) {
      const productId = item.product?.id || item.productId;
      if (!productId) continue;

      let priceBDT = item.product?.priceBDT || item.priceBDT || 0;
      let priceUSD = item.product?.priceUSD || item.priceUSD || 0;

      try {
        // Query product details from Firestore to catch any dynamic price updates
        const productSnap = await getDb().collection('products').doc(productId).get();
        if (productSnap.exists) {
          const data = productSnap.data();
          if (data) {
            priceBDT = Number(data.priceBDT || priceBDT);
            priceUSD = Number(data.priceUSD || priceUSD);
          }
        }
      } catch (err) {
        console.warn(`Could not verify product ${productId} from Firestore, falling back to client price:`, err);
      }

      subtotalBDT += priceBDT * (item.quantity || 1);
      subtotalUSD += priceUSD * (item.quantity || 1);
    }

    let discountPercent = 0;
    const cleanCoupon = (couponCode || '').trim().toUpperCase();
    if (cleanCoupon === 'WELCOMEBD') discountPercent = 15;
    else if (cleanCoupon === 'DIGI30') discountPercent = 30;
    else if (cleanCoupon === 'DHAKA50') discountPercent = 50;

    const discountBDT = Math.round((subtotalBDT * discountPercent) / 100);
    const discountUSD = Math.round((subtotalUSD * discountPercent) / 100);

    const totalBDT = subtotalBDT - discountBDT;
    const totalUSD = subtotalUSD - discountUSD;

    return { totalBDT, totalUSD, discountBDT, discountUSD };
  };

  // Helper to process and write confirmed order to Firestore
  const processAndSaveOrder = async (metadata: any, paymentMethod: string, invoiceId: string) => {
    const { orderId, userId, userEmail, customerName, customerWhatsapp, couponCode, totalUSD, totalBDT } = metadata;
    const cartItems = typeof metadata.cart === 'string' ? JSON.parse(metadata.cart) : metadata.cart;

    // Check if order already exists in Firestore to avoid duplicate writes
    const orderSnap = await getDb().collection('orders').doc(orderId).get();
    if (orderSnap.exists) {
      return orderSnap.data();
    }

    // Generate licensing keys for the products in cart
    const licenseKeys: Record<string, string> = {};
    for (const item of cartItems) {
      const pId = item.product?.id || item.productId;
      if (!pId) continue;

      let lType = (item.product?.licenseType || item.licenseType || '').toLowerCase();
      let isAccountOrSubscription = false;

      try {
        const productSnap = await getDb().collection('products').doc(pId).get();
        if (productSnap.exists) {
          const productData = productSnap.data();
          if (productData) {
            lType = (productData.licenseType || lType || '').toLowerCase();
            const category = (productData.category || '').toLowerCase();
            if (category.includes('account') || category.includes('subscription') || category.includes('service')) {
              isAccountOrSubscription = true;
            }
          }
        }
      } catch (err) {
        console.warn(`Could not fetch license type for product ${pId}:`, err);
      }

      if (
        lType === 'none' || 
        lType === 'account' || 
        lType === 'activation' || 
        lType === 'service' || 
        lType === 'whatsapp' || 
        lType === 'custom' ||
        isAccountOrSubscription ||
        pId.toLowerCase().includes('gemini') || 
        pId.toLowerCase().includes('netflix')
      ) {
        licenseKeys[pId] = 'Direct Activation (Check WhatsApp/Email)';
      } else {
        licenseKeys[pId] = `DM-KEY-${pId.slice(0, 4).toUpperCase()}-${Math.random().toString(36).substring(2, 11).toUpperCase()}`;
      }
    }

    const orderData = {
      id: orderId,
      userId: userId || 'guest@digimarkt.bd',
      userEmail: userEmail || 'guest@digimarkt.bd',
      customerName,
      customerWhatsapp,
      date: new Date().toISOString(),
      items: cartItems.map((item: any) => ({
        productId: item.product?.id || item.productId,
        productTitle: item.product?.title || item.productTitle,
        priceUSD: Number(item.product?.priceUSD || item.priceUSD || 0),
        priceBDT: Number(item.product?.priceBDT || item.priceBDT || 0),
        license: item.selectedLicense || item.license || 'standard',
        imageUrl: item.product?.imageUrl || item.imageUrl || ''
      })),
      totalUSD: Number(totalUSD),
      totalBDT: Number(totalBDT),
      paymentMethod,
      paymentStatus: 'Paid',
      couponCode: couponCode || null,
      licenseKeys,
      invoiceId
    };

    // Save order to Firestore using admin SDK (bypasses security rules)
    await getDb().collection('orders').doc(orderId).set(orderData);

    // Save purchased product ids to user's profile if signed in
    if (userId && userId !== 'guest@digimarkt.bd') {
      try {
        const userSnap = await getDb().collection('users').doc(userId).get();
        let purchasedIds: string[] = [];
        if (userSnap.exists) {
          const uData = userSnap.data();
          purchasedIds = (uData && uData.purchasedProductIds) || [];
        }
        const newProductIds = cartItems.map((item: any) => item.product?.id || item.productId);
        const mergedIds = Array.from(new Set([...purchasedIds, ...newProductIds]));
        await getDb().collection('users').doc(userId).set({ purchasedProductIds: mergedIds }, { merge: true });
      } catch (err) {
        console.error('Error writing customer purchase history to Firestore:', err);
      }
    }

    // Also write activity log for security
    try {
      const logId = `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
      await getDb().collection('activityLogs').doc(logId).set({
        id: logId,
        time: new Date().toLocaleString(),
        user: customerName || 'system',
        action: `Order ${orderId} successfully completed and verified via UddoktaPay.`,
        type: 'payment',
        status: 'success'
      });
    } catch (err) {
      console.error('Error creating activity log:', err);
    }

    return orderData;
  };

  // --------------------------------------------------------
  // API ROUTE: Initialize payment with UddoktaPay
  // --------------------------------------------------------
  app.post('/api/payment/create', async (req, res) => {
    try {
      const { customerName, customerEmail, customerWhatsapp, userId, userEmail, cart, couponCode, clientOrigin } = req.body;

      if (!customerName || !customerEmail || !customerWhatsapp || !cart || cart.length === 0) {
        return res.status(400).json({ status: false, error: 'Missing customer details or cart items.' });
      }

      // Securely calculate pricing
      const { totalBDT, totalUSD } = await getSecureCartTotals(cart, couponCode);

      // Generate unique order reference ID
      const orderId = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;

      // Setup redirect URLs dynamically based on request host or frontend client origin
      const host = req.get('host');
      const protocol = process.env.NODE_ENV === 'production' ? 'https' : req.protocol;
      const requestOrigin = clientOrigin || `${protocol}://${host}`;

      // Request body payload to UddoktaPay Checkout v2 API
      const payload = {
        full_name: customerName,
        email: customerEmail,
        amount: totalBDT,
        metadata: {
          orderId,
          userId: userId || 'guest@digimarkt.bd',
          userEmail: userEmail || 'guest@digimarkt.bd',
          customerName,
          customerWhatsapp,
          couponCode: couponCode || '',
          cart,
          totalUSD,
          totalBDT
        },
        redirect_url: `${requestOrigin}/payment-success?invoice_id=[INVOICE_ID]`,
        cancel_url: `${requestOrigin}/payment-cancel`,
        webhook_url: `${requestOrigin}/api/payment/webhook`
      };

      console.log(`Initiating UddoktaPay Checkout v2 for order: ${orderId}, total BDT: ${totalBDT}`);

      let responseData: any = null;
      let success = false;

      // Try each candidate URL. Prioritize the last successful or default active one.
      const urlsToTry = [
        activeUddoktaPayBaseUrl,
        ...UDDOKTAPAY_CANDIDATE_URLS.filter(url => url !== activeUddoktaPayBaseUrl)
      ];

      for (const baseUrl of urlsToTry) {
        try {
          console.log(`Attempting UddoktaPay checkout-v2 at endpoint: ${baseUrl}`);
          const uddoktaResponse = await fetch(`${baseUrl}/checkout-v2`, {
            method: 'POST',
            headers: {
              'RT-UDDOKTAPAY-API-KEY': UDDOKTAPAY_API_KEY,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
          });

          const rawText = await uddoktaResponse.text();
          try {
            responseData = JSON.parse(rawText);
          } catch (jsonErr) {
            console.error(`Endpoint ${baseUrl} returned non-JSON response:`, rawText);
            continue;
          }

          if (responseData && (responseData.status === true || responseData.payment_url)) {
            activeUddoktaPayBaseUrl = baseUrl; // Remember the successful endpoint
            success = true;
            break;
          } else {
            console.warn(`Endpoint ${baseUrl} returned rejection status:`, responseData);
          }
        } catch (fetchErr: any) {
          console.error(`Failed to reach endpoint ${baseUrl}:`, fetchErr.message);
        }
      }

      if (success && responseData) {
        const paymentUrl = responseData.payment_url || '';
        const parts = paymentUrl.split('/');
        const invoiceId = responseData.invoice_id || responseData.invoice_key || parts[parts.length - 1];

        console.log(`UddoktaPay checkout initialized successfully. Invoice ID: ${invoiceId}`);

        return res.json({
          success: true,
          paymentUrl,
          invoiceId,
          orderId
        });
      } else {
        console.error('All UddoktaPay checkout endpoints failed. Final response:', responseData);
        return res.status(500).json({
          success: false,
          error: responseData?.message || 'UddoktaPay failed to initiate. Please verify your API Key and Panel configurations.'
        });
      }
    } catch (err: any) {
      console.error('Error during UddoktaPay initiation:', err);
      return res.status(500).json({ success: false, error: err.message });
    }
  });

  // --------------------------------------------------------
  // API ROUTE: Verify UddoktaPay payment manually
  // --------------------------------------------------------
  app.post('/api/payment/verify', async (req, res) => {
    try {
      const { invoice_id } = req.body;
      if (!invoice_id) {
        return res.status(400).json({ success: false, error: 'Missing invoice_id' });
      }

      console.log(`Verifying UddoktaPay payment for invoice: ${invoice_id} using base: ${activeUddoktaPayBaseUrl}`);

      const verifyResponse = await fetch(`${activeUddoktaPayBaseUrl}/verify-payment`, {
        method: 'POST',
        headers: {
          'RT-UDDOKTAPAY-API-KEY': UDDOKTAPAY_API_KEY,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ invoice_id })
      });

      const verifiedData = await verifyResponse.json() as any;

      if (verifiedData && verifiedData.status === 'COMPLETED') {
        const order = await processAndSaveOrder(verifiedData.metadata, verifiedData.payment_method || 'bKash', invoice_id);
        return res.json({ success: true, order });
      } else {
        console.warn('Payment verification failed. Current status:', verifiedData?.status);
        return res.json({
          success: false,
          status: verifiedData?.status,
          message: 'Payment verification failed or is incomplete.'
        });
      }
    } catch (err: any) {
      console.error('Error in verify-payment route:', err);
      return res.status(500).json({ success: false, error: err.message });
    }
  });

  // --------------------------------------------------------
  // API ROUTE: UddoktaPay Webhook (gated by secret verification)
  // --------------------------------------------------------
  app.post('/api/payment/webhook', async (req, res) => {
    try {
      const apiKeyHeader = req.headers['rt-uddoktapay-api-key'] || req.headers['RT-UDDOKTAPAY-API-KEY'];

      // Webhook validation to ensure requests are authentically sent from UddoktaPay
      if (apiKeyHeader !== UDDOKTAPAY_API_KEY) {
        console.warn('Unauthorized webhook hit: IP or API Key header mismatch.');
        return res.status(401).send('Unauthorized webhook sender.');
      }

      const body = req.body;
      console.log('Received valid UddoktaPay webhook payload:', JSON.stringify(body));

      if (body && body.status === 'COMPLETED') {
        await processAndSaveOrder(body.metadata, body.payment_method || 'bKash', body.invoice_id);
        console.log(`Webhook successfully processed order: ${body.metadata?.orderId}`);
        return res.send('Webhook received and order created successfully.');
      }

      return res.send('Webhook received but status is not COMPLETED.');
    } catch (err: any) {
      console.error('Error processing webhook:', err);
      return res.status(500).send(`Internal Webhook processing error: ${err.message}`);
    }
  });

async function startStandaloneServer() {
  const PORT = 3000;

  // Vite middleware for development vs static asset delivery for production
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

if (!process.env.NETLIFY && !process.env.LAMBDA_TASK_ROOT && !process.env.AWS_LAMBDA_FUNCTION_NAME) {
  startStandaloneServer();
}

export { app };
