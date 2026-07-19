import { Product } from '../types';

export const PRODUCTS: Product[] = [
  {
    id: "gemini-pro-18-month",
    title: "Google Gemini Pro 1.5 - 18 Months Premium",
    shortDescription: "Official 18-Month access to Gemini Pro with full advanced multimodal reasoning, 1M token context, and API access.",
    longDescription: "Get premium, high-speed access to Google's state-of-the-art Gemini 1.5 Pro model. Perfect for developers, researchers, and content creators. This digital package provides an authentic, fully secured private profile or API key wrapper with a continuous 18-month subscription. Features ultra-large 1 million token context windows, native multimodal input processing (text, code, image, audio, video), and top-tier priority queue generation.",
    priceUSD: 45,
    priceBDT: 5200,
    oldPriceUSD: 99,
    oldPriceBDT: 11500,
    rating: 4.9,
    salesCount: 1540,
    category: "Premium Accounts",
    tags: ["Gemini Pro", "AI", "Google", "API", "Premium"],
    features: [
      "1,000,000 token massive context window",
      "Multimodal analysis (combines code, video, voice, images)",
      "Ultra-low latency generation with highest priority access",
      "Official developer console integration keys",
      "Guaranteed 18-month continuous active license"
    ],
    whatsIncluded: [
      "Dedicated Premium Account Credentials",
      "Secure API Access Guide & Wrapper Script",
      "Step-by-step connection instructions document",
      "18 Months warranty with active customer support",
      "Instant credentials delivery after BDT checkout verification"
    ],
    versionHistory: [
      {
        version: "v1.5.0",
        date: "2026-07-01",
        changes: ["Upgraded with Gemini 1.5 Pro multimodal stream integration", "Enhanced API rate limits to 120 RPM"]
      }
    ],
    reviews: [
      {
        id: "rev-gem-1",
        userName: "Munir Chowdhury",
        rating: 5,
        comment: "Outstanding! Gemini 1.5 Pro changed my development workflow. The 1M token context is magical for entire codebases.",
        date: "2026-07-10",
        verified: true,
        helpfulVotes: 48
      },
      {
        id: "rev-gem-2",
        userName: "Fahim Ahmed",
        rating: 5,
        comment: "Excellent service from DigiMarkt BD. Delivery was done in under 10 minutes. Fully recommended!",
        date: "2026-07-15",
        verified: true,
        helpfulVotes: 21
      }
    ],
    faqs: [
      {
        question: "Is this a shared account or private?",
        answer: "This is a private profile/credentials package where your work, chat history, and API logs are kept entirely confidential."
      },
      {
        question: "What happens if there's an issue with the subscription?",
        answer: "We offer a full 18-month replacement warranty. If your access is interrupted, our support team will reactivate it within hours."
      }
    ],
    coverGradient: "from-blue-600/20 via-indigo-600/10 to-transparent",
    fileSize: "Lightweight Credentials File",
    compatiblePlatforms: ["Web Browser", "Node.js", "Python SDK", "API Requests"],
    licenseType: "Private License",
    downloadUrl: "https://example.com/downloads/gemini-pro-access.zip",
    imageUrl: "https://images.unsplash.com/photo-1675557009875-436f09780264?auto=format&fit=crop&w=800&q=80",
    isFlashDeal: true,
    flashDealExpiry: new Date(Date.now() + 14 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "chatgpt-plus-premium",
    title: "ChatGPT Plus & GPT-4o Premium Account",
    shortDescription: "Premium Access to GPT-4o, Custom GPTs, Advanced Data Analysis, and DALL-E 3 image generation.",
    longDescription: "Get official premium access to OpenAI's ChatGPT Plus featuring the latest GPT-4o model. This package provides high-priority, zero-throttle query generation, interactive data analysis, direct image generation via DALL-E 3, and full access to the Custom GPT store. Comes with clean, verified premium credentials or direct tokenized browser access.",
    priceUSD: 19,
    priceBDT: 2200,
    oldPriceUSD: 29,
    oldPriceBDT: 3400,
    rating: 4.8,
    salesCount: 2310,
    category: "Premium Accounts",
    tags: ["ChatGPT", "GPT-4o", "OpenAI", "AI Tools"],
    features: [
      "Access to standard GPT-4o and custom prompt wrappers",
      "Integrate with DALL-E 3 for professional graphics modeling",
      "Advanced Data Analysis engine with safe CSV file uploading",
      "Voice mode and web scraping capabilities unlocked",
      "Ultra-fast speed during peak hours"
    ],
    whatsIncluded: [
      "Validated premium login credentials",
      "Private workspace with secure session cookies",
      "Custom GPT store developer collection guide",
      "Full warranty support for the entire billing cycle",
      "Direct chat dashboard link"
    ],
    versionHistory: [
      {
        version: "v4.2.0",
        date: "2026-06-20",
        changes: ["Added GPT-4o multi-modal voice model tips", "Fixed chrome browser session extension issues"]
      }
    ],
    reviews: [
      {
        id: "rev-gpt-1",
        userName: "Anika Rahman",
        rating: 5,
        comment: "Excellent value for money. ChatGPT Plus is necessary for my copywriting agency. Fast delivery, working perfectly.",
        date: "2026-07-08",
        verified: true,
        helpfulVotes: 32
      }
    ],
    faqs: [
      {
        question: "Is this valid on mobile apps?",
        answer: "Yes, you can log in on the official ChatGPT app for iOS and Android using the provided premium credentials."
      }
    ],
    coverGradient: "from-emerald-600/20 via-teal-500/10 to-transparent",
    fileSize: "Digital Delivery",
    compatiblePlatforms: ["Web", "iOS", "Android"],
    licenseType: "Single User Login",
    downloadUrl: "https://example.com/downloads/chatgpt-plus-guide.zip",
    imageUrl: "https://images.unsplash.com/photo-1684369175833-31f06f7df107?auto=format&fit=crop&w=800&q=80",
    isFlashDeal: true,
    flashDealExpiry: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "netflix-premium-4k",
    title: "Netflix Premium Ultra HD - Private Profile",
    shortDescription: "Ultra HD 4K Netflix account access. Secure private profile with custom PIN, 100% stable.",
    longDescription: "Enjoy unlimited streaming of your favorite movies and shows in breathtaking Ultra HD 4K resolution. This digital product grants you a private profile inside a verified premium subscription with a custom lock PIN. Enjoy uninterrupted streaming on any device (Smart TV, Mobile, Laptop) with zero interruptions or password resets.",
    priceUSD: 4,
    priceBDT: 450,
    oldPriceUSD: 8,
    oldPriceBDT: 950,
    rating: 4.7,
    salesCount: 4510,
    category: "Premium Accounts",
    tags: ["Netflix", "4K UHD", "Streaming", "Premium", "Entertainment"],
    features: [
      "Stunning 4K Ultra HD visual playback resolution",
      "HDR10 and Dolby Atmos spatial sound support",
      "Private profile with personalized watchlists",
      "Set your own profile PIN lock for complete privacy",
      "Download movies to watch offline on phone/tablet"
    ],
    whatsIncluded: [
      "Premium account email & password credentials",
      "Private designated Profile number with name selection",
      "Step-by-step Smart TV login QR connection helper",
      "Full monthly active account backup warranty",
      "Official Netflix download access"
    ],
    versionHistory: [
      {
        version: "v3.1.0",
        date: "2026-05-12",
        changes: ["Configured automatic backup profile assignment on server changes"]
      }
    ],
    reviews: [
      {
        id: "rev-net-1",
        userName: "Sajid Karim",
        rating: 5,
        comment: "Super cheap and the profile is completely mine. Put a PIN on it, 4K HDR works beautifully on my Sony TV.",
        date: "2026-07-11",
        verified: true,
        helpfulVotes: 15
      }
    ],
    faqs: [
      {
        question: "Can I use it on multiple devices?",
        answer: "You can log in on multiple devices, but stream concurrently on 1 active screen at a time to comply with profile terms."
      }
    ],
    coverGradient: "from-red-600/20 via-rose-600/10 to-transparent",
    fileSize: "Instant Credentials Delivery",
    compatiblePlatforms: ["Smart TV", "Android", "iOS", "PC", "PlayStation", "Xbox"],
    licenseType: "Single Private Profile",
    downloadUrl: "https://example.com/downloads/netflix-tv-guide.zip",
    imageUrl: "https://images.unsplash.com/photo-1574375927938-d5a98e8edd86?auto=format&fit=crop&w=800&q=80",
    isFlashDeal: false
  },
  {
    id: "portfolio-website-pro",
    title: "Minimalist Developer Portfolio Website Template",
    shortDescription: "Ultra-fast Swiss design developer portfolio website in React 19, Vite, Tailwind v4, & Framer Motion.",
    longDescription: "Stand out in your tech recruitment cycles! A highly modern, fully interactive developer portfolio built with premium minimal aesthetics. Highly responsive typography, custom grid system, staggered scrolling animations, interactive dark/light layout transitions, built-in blog editor, and full contact form integrations with Formspree and Netlify forms. Designed to get you hired at top SaaS companies.",
    priceUSD: 15,
    priceBDT: 1750,
    oldPriceUSD: 29,
    oldPriceBDT: 3400,
    rating: 4.9,
    salesCount: 890,
    category: "Websites & Templates",
    tags: ["React 19", "Vite", "Tailwind CSS", "Portfolio", "Framer Motion"],
    features: [
      "Ultra high 100% Lighthouse performance & SEO score",
      "Framer Motion smooth scroll-linked staggered entry animations",
      "Interactive Project showcase gallery with search tags",
      "Clean TypeScript interfaces and highly modularized code",
      "Dynamic theme swapper with system auto-detection"
    ],
    whatsIncluded: [
      "Full source code repository access",
      "Step-by-step local development & deployment documentation",
      "Figma design frame project layouts",
      "Configured setup for one-click Vercel, Netlify, and GitHub Pages",
      "Free lifetime updates"
    ],
    versionHistory: [
      {
        version: "v2.0.0",
        date: "2026-07-05",
        changes: ["Rewritten in Tailwind v4 for compilation speedup", "Upgraded React modules to v19"]
      }
    ],
    reviews: [
      {
        id: "rev-port-1",
        userName: "Naimur Rahman",
        rating: 5,
        comment: "This portfolio layout is incredibly clean. I deployed it on Vercel in 5 minutes, customized my info, and got a callback next week!",
        date: "2026-07-12",
        verified: true,
        helpfulVotes: 25
      }
    ],
    faqs: [
      {
        question: "Is it easy to edit the projects list?",
        answer: "Yes! All projects, social links, and bio data are kept in a simple JSON data config file. You don't need to change any JSX structure."
      }
    ],
    coverGradient: "from-amber-600/20 via-orange-500/10 to-transparent",
    fileSize: "12.4 MB",
    compatiblePlatforms: ["Vite", "Node.js", "React", "Tailwind CSS"],
    licenseType: "Commercial Developer License",
    downloadUrl: "https://example.com/downloads/portfolio-pro.zip",
    imageUrl: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80",
    isFlashDeal: false
  },
  {
    id: "ecommerce-website-next",
    title: "SaaS E-Commerce Website - Full-Stack App",
    shortDescription: "Complete commercial digital store built with Next.js 14 App Router, Stripe, Tailwind, and Prisma DB.",
    longDescription: "Build and scale your e-commerce platform with the most modern software stack. This product is a production-ready digital e-commerce codebase with beautiful modern layouts, Stripe/PayPal checkout routes, inventory stock controls, multi-role user schemas, robust admin analytics panel, discount coupon modules, and SEO optimized dynamic rendering.",
    priceUSD: 59,
    priceBDT: 6900,
    oldPriceUSD: 119,
    oldPriceBDT: 13900,
    rating: 4.9,
    salesCount: 620,
    category: "Websites & Templates",
    tags: ["Next.js 14", "Stripe", "Prisma", "PostgreSQL", "Full-Stack"],
    features: [
      "Next.js App Router server-side fetching with optimal cache control",
      "Fully responsive Shopping Cart, Wishlist, and Checkout drawers",
      "Robust Admin Panel with charts, product editors, and sales reports",
      "Stripe checkout sessions and local webhook listeners configured",
      "Automatic email invoice generation module included"
    ],
    whatsIncluded: [
      "Complete Next.js codebase (TypeScript)",
      "Database schema definitions (Prisma & PostgreSQL)",
      "Tailwind theme configuration setup files",
      "1 Year code troubleshooting developer support",
      "Deployment guide for Vercel, Railway, and Neon Postgres"
    ],
    versionHistory: [
      {
        version: "v1.1.0",
        date: "2026-06-18",
        changes: ["Added multi-currency auto conversion selector", "Fixed Prisma transaction race conditions in batch orders"]
      }
    ],
    reviews: [
      {
        id: "rev-eco-1",
        userName: "Tasnim Sultana",
        rating: 5,
        comment: "This codebase is extremely modular and perfectly commented. Building an online boutique store was incredibly fast using this.",
        date: "2026-07-02",
        verified: true,
        helpfulVotes: 14
      }
    ],
    faqs: [
      {
        question: "Can I integrate Bangladeshi local gateways instead of Stripe?",
        answer: "Yes, our codebase has modular payment providers. You can easily plug in the bKash or SSLCommerz wrappers into the payment action hook."
      }
    ],
    coverGradient: "from-sky-600/20 via-blue-500/10 to-transparent",
    fileSize: "45.8 MB",
    compatiblePlatforms: ["Next.js 14", "Node.js", "Prisma ORM", "Stripe API"],
    licenseType: "Unlimited Commercial License",
    downloadUrl: "https://example.com/downloads/ecommerce-nextjs-pro.zip",
    imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
    isFlashDeal: true,
    flashDealExpiry: new Date(Date.now() + 20 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "bkash-nagad-rocket-sdk",
    title: "bKash & Nagad Payment SDK Pro",
    shortDescription: "Zero-dependency payment gateway integration wrapper for SSLCommerz, bKash, Nagad, and Rocket.",
    longDescription: "The ultimate payment gateway integration suite built specifically for Bangladeshi developers. Integrate bKash, Nagad, Rocket, and SSLCommerz API endpoints with just a few lines of code. It includes pre-built sandbox configurations, tokenization support, auto-refund handlers, and secure webhooks verified for production environments.",
    priceUSD: 49,
    priceBDT: 5900,
    oldPriceUSD: 89,
    oldPriceBDT: 10500,
    rating: 4.9,
    salesCount: 428,
    category: "Scripts & Plugins",
    tags: ["bKash", "Nagad", "SSLCommerz", "NodeJS", "React"],
    features: [
      "Dynamic BDT to USD exchange rate conversion",
      "Robust Webhook verification algorithms to prevent fraud",
      "One-click bKash tokenized payment and agreements",
      "Express, NestJS, and Next.js Route Handler templates included",
      "100% Type-safe with TypeScript interfaces"
    ],
    whatsIncluded: [
      "Full clean source code (ES Modules & CommonJS)",
      "Interactive Developer Playground (local dashboard)",
      "Comprehensive PDF Documentation (Step-by-step setup)",
      "1 Year of priority support via Telegram & WhatsApp",
      "Lifetime automated security patches"
    ],
    versionHistory: [
      {
        version: "v2.1.0",
        date: "2026-06-15",
        changes: ["Added Nagad merchant-initiated refund API endpoint support", "Fixed Rocket token expiry refresh token race condition"]
      }
    ],
    reviews: [
      {
        id: "rev-sdk-1",
        userName: "Ahsan Habib",
        rating: 5,
        comment: "This saved me weeks of head scratching with the official bKash docs. Seamless integration, works flawlessly in our production app!",
        date: "2026-07-01",
        verified: true,
        helpfulVotes: 14
      }
    ],
    faqs: [
      {
        question: "Does it support SSLCommerz official sandbox credentials?",
        answer: "Yes, it has built-in development sandbox flags so you can test all gateways securely without actual transactions."
      }
    ],
    coverGradient: "from-fuchsia-600/20 via-pink-600/10 to-transparent",
    fileSize: "14.2 MB",
    compatiblePlatforms: ["Node.js", "Express", "Next.js", "Nuxt.js"],
    licenseType: "Single & Unlimited Commercial Licenses",
    downloadUrl: "https://example.com/downloads/bkash-nagad-sdk-pro.zip",
    imageUrl: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=800&q=80",
    isFlashDeal: false
  }
];

export const CATEGORIES = [
  "All",
  "Premium Accounts",
  "Websites & Templates",
  "Scripts & Plugins"
];
