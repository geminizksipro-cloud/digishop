import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowRight, 
  ShieldCheck, 
  Download, 
  Headphones, 
  LayoutGrid, 
  ChevronLeft, 
  ChevronRight, 
  Globe, 
  Code, 
  Layers, 
  Sparkles, 
  Tv, 
  Key, 
  Shield, 
  Zap, 
  Flame, 
  Monitor, 
  Cpu,
  Lock,
  Compass
} from 'lucide-react';

interface HeroProps {
  onExplore: () => void;
}

const SLIDES = [
  {
    id: 'slide-web',
    title: 'Premium Custom Websites & Scripts',
    subtitle: 'Boost your business instantly with high-converting landing pages, professional portfolios, secure PHP Laravel e-commerce engines, and premium responsive web design files.',
    bgGradient: 'from-blue-50/40 via-indigo-50/20 to-sky-50/30',
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80',
    badge: 'Website & Code Marketplace',
    badgeColor: 'bg-blue-50 border-blue-100 text-blue-600',
    btnText: 'Get Website Code',
    accentColor: 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/10 text-white',
    secondaryBtnText: 'Browse Web Scripts',
    logos: [
      { name: 'Laravel', color: 'bg-[#FF2D20]/10 text-[#FF2D20] border-[#FF2D20]/20' },
      { name: 'React', color: 'bg-[#61DAFB]/10 text-[#00D8FF] border-[#61DAFB]/20' },
      { name: 'PHP', color: 'bg-[#777BB4]/10 text-[#777BB4] border-[#777BB4]/20' },
      { name: 'Tailwind', color: 'bg-[#38BDF8]/10 text-[#38BDF8] border-[#38BDF8]/20' }
    ]
  },
  {
    id: 'slide-ai',
    title: 'ChatGPT, Grok & Gemini Premium',
    subtitle: 'Unlock the full power of the world\'s best AI models. Instant access. Official accounts. 100% secure.',
    bgGradient: 'from-purple-50/30 via-indigo-50/20 to-pink-50/30',
    image: 'https://images.unsplash.com/photo-1684369175833-397a6e60b615?auto=format&fit=crop&w=800&q=80',
    badge: 'Premium AI Subscriptions',
    badgeColor: 'bg-purple-50 border-purple-100 text-purple-600',
    btnText: 'Explore Accounts',
    accentColor: 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-95 shadow-indigo-500/20 text-white',
    secondaryBtnText: 'View All Pricing',
    logos: [
      { name: 'ChatGPT Plus', color: 'bg-[#10a37f]/10 text-[#10a37f] border-[#10a37f]/20' },
      { name: 'Gemini Adv', color: 'bg-[#1a73e8]/10 text-[#1a73e8] border-[#1a73e8]/20' },
      { name: 'Grok AI', color: 'bg-slate-900/10 text-slate-800 border-slate-900/20' }
    ]
  },
  {
    id: 'slide-streaming',
    title: 'Netflix 4K UHD & CyberGhost VPN',
    subtitle: 'Experience ultimate entertainment with UHD Netflix streaming profiles paired with CyberGhost VPN premium keys. Smooth access, zero screen blockages.',
    bgGradient: 'from-rose-50/30 via-indigo-50/20 to-red-50/30',
    image: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?auto=format&fit=crop&w=800&q=80',
    badge: 'UHD Streaming & VPN Keys',
    badgeColor: 'bg-rose-50 border-rose-100 text-rose-600',
    btnText: 'Rent Streaming & VPN',
    accentColor: 'bg-rose-600 hover:bg-rose-700 shadow-rose-500/10 text-white',
    secondaryBtnText: 'View Secure Keys',
    logos: [
      { name: 'Netflix 4K', color: 'bg-[#E50914]/10 text-[#E50914] border-[#E50914]/20' },
      { name: 'CyberGhost', color: 'bg-[#FFBF00]/10 text-[#FF9000] border-[#FFBF00]/20' },
      { name: 'Ultra HD', color: 'bg-slate-900/10 text-slate-800 border-slate-900/20' }
    ]
  }
];

export default function Hero({ onExplore }: HeroProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0); // -1 for left, 1 for right

  // Auto slide cycle every 7 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      handleNext();
    }, 7000);
    return () => clearInterval(timer);
  }, [currentIndex]);

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % SLIDES.length);
  };

  const handlePrev = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
  };

  const currentSlide = SLIDES[currentIndex];

  return (
    <>
      {/* Mobile-Only Elegant Simple Static Banner */}
      <div 
        className="block sm:hidden relative overflow-hidden rounded-[20px] mx-4 my-4 p-5 bg-gradient-to-br from-indigo-950 via-slate-900 to-purple-950 text-white border border-white/10 shadow-xl"
        id="marketplace-hero-mobile"
      >
        {/* Glowing atmospheric background accents */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-purple-500/20 rounded-full blur-[35px] pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-blue-500/15 rounded-full blur-[25px] pointer-events-none" />

        <div className="relative z-10 flex flex-col gap-3">
          {/* Category badge */}
          <div className="inline-flex items-center gap-1.5 bg-white/10 border border-white/15 px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider text-purple-200 self-start">
            <Sparkles size={10} className="text-purple-400 animate-pulse animate-duration-1000" />
            <span>Premium AI Subscriptions</span>
          </div>

          {/* Headline */}
          <h1 className="text-base font-black tracking-tight leading-tight text-white">
            ChatGPT, Grok & Gemini Premium
          </h1>

          {/* Short subtitle */}
          <p className="text-[10.5px] text-slate-300 leading-relaxed font-medium">
            Get instant, 100% secure official accounts for the world's leading AI models. Instantly delivered with full warranty.
          </p>

          {/* Quick highlight logo pills */}
          <div className="flex flex-wrap gap-1.5 mt-1">
            <span className="text-[8.5px] font-bold px-2 py-0.5 bg-[#10a37f]/20 text-[#29e3b4] border border-[#10a37f]/35 rounded-md">ChatGPT Plus</span>
            <span className="text-[8.5px] font-bold px-2 py-0.5 bg-blue-500/25 text-blue-300 border border-blue-500/30 rounded-md">Gemini Adv</span>
            <span className="text-[8.5px] font-bold px-2 py-0.5 bg-slate-800/80 text-slate-200 border border-slate-700 rounded-md">Grok AI</span>
            <span className="text-[8.5px] font-bold px-2 py-0.5 bg-amber-500/20 text-amber-300 border border-amber-500/35 rounded-md">100% Secured</span>
          </div>

          {/* Action button */}
          <button
            onClick={onExplore}
            className="mt-2.5 w-full h-10 bg-gradient-to-r from-blue-600 to-indigo-600 active:from-blue-700 active:to-indigo-700 text-white font-black text-[11px] rounded-xl shadow-lg shadow-indigo-950/40 active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Compass size={13} />
            <span>Explore Accounts</span>
            <ArrowRight size={12} />
          </button>
        </div>
      </div>

      {/* Desktop & Tablet Premium Carousel */}
      <div 
        className="hidden sm:flex relative overflow-hidden rounded-[24px] mx-4 sm:mx-8 my-6 bg-white border border-slate-200/60 shadow-lg min-h-[300px] md:min-h-[420px] items-center transition-all duration-300"
        id="marketplace-hero"
      >
        {/* Background soft decorative orbs for layout richness */}
        <div className="absolute inset-0 z-0 overflow-hidden select-none pointer-events-none">
          <div className="absolute -top-[15%] -left-[10%] w-[55%] h-[55%] rounded-full bg-blue-400/5 blur-[90px]" />
          <div className="absolute bottom-[10%] -right-[15%] w-[60%] h-[60%] rounded-full bg-indigo-400/5 blur-[110px]" />
          {/* Fine grid overlay */}
          <div className="absolute inset-0 opacity-[0.02] bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:24px_24px]" />
        </div>

        {/* Slide Navigation Trigger Arrows */}
        <button 
          onClick={handlePrev}
          className="absolute left-4 z-30 w-10 h-10 rounded-full bg-white/90 hover:bg-white border border-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer"
          aria-label="Previous Slide"
        >
          <ChevronLeft size={20} />
        </button>
        <button 
          onClick={handleNext}
          className="absolute right-4 z-30 w-10 h-10 rounded-full bg-white/90 hover:bg-white border border-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer"
          aria-label="Next Slide"
        >
          <ChevronRight size={20} />
        </button>

        {/* Main Slide Holder with Custom Sliding and Fading Transition */}
        <div className="relative w-full z-10 px-8 py-10 sm:px-12 sm:py-10 md:px-16 md:py-14">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentSlide.id}
              custom={direction}
              variants={{
                enter: (dir: number) => ({
                  x: dir > 0 ? 100 : -100,
                  opacity: 0,
                }),
                center: {
                  x: 0,
                  opacity: 1,
                },
                exit: (dir: number) => ({
                  x: dir < 0 ? 100 : -100,
                  opacity: 0,
                }),
              }}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.35, ease: 'easeInOut' }}
              className="grid grid-cols-12 gap-8 items-center"
            >
              {/* Left Content Column */}
              <div className="col-span-12 md:col-span-7 flex flex-col items-start text-left">
                {/* Slide Category Badge */}
                <div 
                  className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border text-[11px] font-bold tracking-wider uppercase mb-5 shadow-sm ${currentSlide.badgeColor}`}
                  id={`hero-badge-${currentSlide.id}`}
                >
                  {currentSlide.id === 'slide-web' ? <Globe size={13} className="animate-pulse" /> : 
                   currentSlide.id === 'slide-ai' ? <Sparkles size={13} className="text-purple-600 animate-pulse" /> : 
                   <Tv size={13} className="text-rose-600 animate-pulse" />}
                  <span>{currentSlide.badge}</span>
                </div>

                {/* Slide Headline */}
                <h1 
                  className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 leading-tight tracking-tight mb-4"
                  id={`hero-title-${currentSlide.id}`}
                >
                  {currentSlide.title}
                </h1>

                {/* Slide Subtitle */}
                <p 
                  className="text-xs sm:text-sm text-slate-500 mb-6 max-w-xl leading-relaxed font-medium"
                  id={`hero-desc-${currentSlide.id}`}
                >
                  {currentSlide.subtitle}
                </p>

                {/* Inline Features Row for Slide 2 */}
                {currentSlide.id === 'slide-ai' && (
                  <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-7 w-full max-w-xl border-t border-slate-100 pt-5">
                    <div className="flex items-start gap-2">
                      <div className="w-8 h-8 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0 mt-0.5 shadow-sm">
                        <ShieldCheck size={14} className="text-indigo-600" />
                      </div>
                      <div>
                        <h4 className="text-[11px] font-black text-slate-800 leading-tight">100% Secure</h4>
                        <p className="text-[9.5px] text-slate-400 mt-0.5 leading-tight font-medium">Official accounts with full warranty</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-8 h-8 rounded-full bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 shrink-0 mt-0.5 shadow-sm">
                        <Zap size={14} className="text-purple-600 fill-purple-600/10" />
                      </div>
                      <div>
                        <h4 className="text-[11px] font-black text-slate-800 leading-tight">Instant Access</h4>
                        <p className="text-[9.5px] text-slate-400 mt-0.5 leading-tight font-medium">Get access in seconds after purchase</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-8 h-8 rounded-full bg-pink-50 border border-pink-100 flex items-center justify-center text-pink-600 shrink-0 mt-0.5 shadow-sm">
                        <Headphones size={14} className="text-pink-600" />
                      </div>
                      <div>
                        <h4 className="text-[11px] font-black text-slate-800 leading-tight">24/7 Support</h4>
                        <p className="text-[9.5px] text-slate-400 mt-0.5 leading-tight font-medium">We're here to help anytime</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Explore and Actions Trigger on top of the banner */}
                <div className="flex items-center gap-3 w-auto" id={`hero-buttons-${currentSlide.id}`}>
                  <button
                    onClick={onExplore}
                    className={`px-6 h-12 rounded-xl font-bold text-xs sm:text-sm shadow-md active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer ${currentSlide.accentColor}`}
                  >
                    <Compass size={15} />
                    <span>Explore Accounts</span>
                    <ArrowRight size={14} className="shrink-0" />
                  </button>

                  <button
                    onClick={onExplore}
                    className="px-5 h-12 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold text-xs sm:text-sm hover:border-slate-300 hover:bg-slate-50 active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <LayoutGrid size={15} className="text-slate-500 shrink-0" />
                    <span>{currentSlide.secondaryBtnText}</span>
                  </button>
                </div>
              </div>

              {/* Right Side: Premium Image Layout with Brand Overlay Badges */}
              {currentSlide.id === 'slide-ai' ? (
                /* Custom Premium Interactive AI Mockup Component matching the screenshot */
                <div className="hidden md:flex md:col-span-5 items-center justify-center relative select-none w-full py-2">
                  <div className="relative w-full max-w-[380px] h-[290px] flex items-center justify-end">
                    
                    {/* Background Stacked Platform Cards on the left */}
                    <div className="absolute left-0 top-[25px] flex flex-col gap-3.5 z-0">
                      {/* Grok AI Card */}
                      <div className="w-[165px] h-[54px] bg-white border border-slate-200/80 rounded-2xl shadow-md p-2 flex items-center gap-2.5 transform -translate-x-6 hover:-translate-x-4 transition-transform duration-300">
                        <div className="w-[34px] h-[34px] rounded-full bg-slate-950 flex items-center justify-center text-white shrink-0 shadow-sm">
                          <span className="font-sans font-black text-[13px] tracking-tighter">/ROK</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[10.5px] font-black text-slate-800 leading-none mb-0.5">Grok AI</span>
                          <span className="text-[8.5px] font-bold text-slate-400">Premium</span>
                        </div>
                      </div>

                      {/* Gemini Advanced Card */}
                      <div className="w-[165px] h-[54px] bg-white border border-slate-200/80 rounded-2xl shadow-md p-2 flex items-center gap-2.5 transform -translate-x-3 hover:-translate-x-1 transition-transform duration-300">
                        <div className="w-[34px] h-[34px] rounded-full bg-gradient-to-tr from-blue-50 to-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0 shadow-sm">
                          {/* 4-pointed star Gemini logo */}
                          <svg viewBox="0 0 24 24" className="w-5 h-5 fill-indigo-500 stroke-none">
                            <path d="M12 2c0 5.523-4.477 10-10 10 5.523 0 10 4.477 10 10 0-5.523 4.477-10 10-10-5.523 0-10-4.477-10-10z" />
                          </svg>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[10.5px] font-black text-slate-800 leading-none mb-0.5">Gemini</span>
                          <span className="text-[8.5px] font-bold text-slate-400">Advanced</span>
                        </div>
                      </div>
                    </div>

                    {/* Dominant Floating ChatGPT Plus Card overlapping them */}
                    <div className="relative w-[265px] bg-gradient-to-br from-[#3b3378] via-[#211b4c] to-[#120e2e] rounded-3xl border border-white/10 shadow-2xl p-4 flex flex-col justify-between z-10 text-white transform hover:scale-[1.02] transition-all duration-300">
                      
                      {/* Top Badges Header */}
                      <div className="flex items-center justify-between gap-1 mb-3">
                        {/* Secured tag */}
                        <div className="px-2 py-0.5 rounded-md bg-white/10 backdrop-blur-md border border-white/10 flex items-center gap-1 text-[7.5px] font-black text-white/95">
                          <ShieldCheck size={9} className="text-[#39df9f]" />
                          <span>SECURED BY DIGIMARKT</span>
                        </div>
                        {/* ChatGPT Plus Tag */}
                        <div className="px-2 py-0.5 rounded-full bg-[#10a37f]/20 border border-[#10a37f]/40 text-[#29e3b4] text-[8px] font-black tracking-wide">
                          ChatGPT Plus
                        </div>
                      </div>

                      {/* App Identity Row */}
                      <div className="flex items-center gap-2.5 mb-3.5">
                        {/* ChatGPT Logo Icon Box */}
                        <div className="w-[40px] h-[40px] rounded-xl bg-[#10a37f] flex items-center justify-center text-white shrink-0 shadow-lg shadow-[#10a37f]/20">
                          {/* Beautiful Spiral logo representing ChatGPT */}
                          <svg viewBox="0 0 24 24" className="w-6 h-6 stroke-white fill-none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                            <circle cx="12" cy="12" r="9" strokeWidth="1.2" />
                          </svg>
                        </div>
                        <div className="flex flex-col">
                          <h3 className="text-[13px] font-black tracking-tight text-white leading-none mb-1">ChatGPT Plus</h3>
                          <span className="text-[9px] text-slate-300 font-semibold">Official Premium Account</span>
                        </div>
                      </div>

                      {/* Features Checklist */}
                      <div className="flex flex-col gap-1.5 mb-3.5">
                        {[
                          'GPT-4o & GPT-4 Access',
                          'DALL-E 3 Image Generation',
                          'Advanced Data Analysis',
                          'Priority Access to New Features'
                        ].map((feature) => (
                          <div key={feature} className="flex items-center gap-2">
                            <div className="w-[13px] h-[13px] rounded-full bg-[#10a37f]/20 flex items-center justify-center text-[#29e3b4] shrink-0">
                              <svg viewBox="0 0 24 24" className="w-2 h-2 stroke-[#29e3b4] fill-none" strokeWidth="4">
                                <polyline points="20 6 9 17 4 12" />
                              </svg>
                            </div>
                            <span className="text-[10px] font-bold text-slate-200">{feature}</span>
                          </div>
                        ))}
                      </div>

                      {/* Footer Instant Delivery */}
                      <div className="w-full h-8 rounded-xl bg-slate-950/40 border border-white/5 flex items-center justify-center gap-1.5 text-[9px] font-black text-amber-300">
                        <Zap size={10} className="text-amber-300 fill-amber-300/20" />
                        <span>Instant Delivery</span>
                      </div>

                    </div>

                  </div>
                </div>
              ) : (
                /* Regular Slides right side */
                <div className="hidden md:flex md:col-span-5 items-center justify-center relative select-none">
                  {/* Glass container wrapping the curated image */}
                  <div className="relative w-full max-w-[340px] aspect-[4/3] rounded-2xl overflow-hidden border border-slate-200 shadow-xl bg-slate-50 group">
                    <img 
                      src={currentSlide.image} 
                      alt={currentSlide.title} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                    
                    {/* Visual ambient darkening overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent" />

                    {/* Secure Badge */}
                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-white/95 backdrop-blur-md border border-slate-200/80 shadow-md flex items-center gap-1 text-[9px] font-black text-slate-800">
                      <ShieldCheck size={11} className="text-emerald-500" />
                      <span>SECURED BY DIGIMARKT</span>
                    </div>
                    
                    <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-lg bg-slate-900/90 backdrop-blur-md border border-white/10 shadow-md text-[9px] font-bold text-white flex items-center gap-1">
                      <Zap size={11} className="text-yellow-400" />
                      <span>Instant Delivery</span>
                    </div>
                  </div>

                  {/* Dynamic Floating Brand Badges representing the contents */}
                  <div className="absolute inset-0 pointer-events-none">
                    {currentSlide.logos.map((logo, idx) => {
                      // Position layout beautifully around the center panel
                      const positions = [
                        'top-[-10px] right-[15%] transform hover:scale-105 transition-all duration-300',
                        'bottom-[-12px] left-[15%] transform hover:scale-105 transition-all duration-300',
                        'top-[40%] left-[-15px] transform hover:scale-105 transition-all duration-300',
                        'bottom-[35%] right-[-15px] transform hover:scale-105 transition-all duration-300'
                      ];
                      return (
                        <div 
                          key={logo.name}
                          className={`absolute px-3 py-1.5 rounded-xl border font-bold text-[10px] tracking-wide shadow-md backdrop-blur-md ${logo.color} ${positions[idx] || ''}`}
                        >
                          {logo.name}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Bottom Slider Indicators (Pagination Dots) */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5">
          {SLIDES.map((slide, idx) => (
            <button 
              key={slide.id}
              onClick={() => {
                setDirection(idx > currentIndex ? 1 : -1);
                setCurrentIndex(idx);
              }}
              className={`w-2 h-2 rounded-full transition-all duration-300 cursor-pointer ${currentIndex === idx ? 'bg-slate-900 w-5' : 'bg-slate-300 hover:bg-slate-400'}`}
              aria-label={`Go to Slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </>
  );
}
