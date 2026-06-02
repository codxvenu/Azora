import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, Flame, ArrowRight, ShieldCheck, Clock, Sparkles } from 'lucide-react';
import { GiftCard } from '../types';

interface FeaturedDealsShowcaseProps {
  products: GiftCard[];
  onSelectProduct: (product: GiftCard) => void;
  isDark: boolean;
}

interface PromoSlide {
  id: number;
  title: string;
  tagline: string;
  description: string;
  ctaText: string;
  categoryFilter: string;
  bgGradient: string;
  glowColor: string;
  highlightCategory: string;
  productKeywords: string[];
  bannerImage: string;
}

const SLIDES: PromoSlide[] = [
  {
    id: 1,
    title: "Gift Card Festival",
    tagline: "GLOBAL DIGITAL VALUE",
    description: "Unlock today's biggest promotion with verified digital vouchers, wallet top-ups, and shopping credits. Instant automated fulfillment to your secure wallet ledger.",
    ctaText: "Browse Gift Cards",
    categoryFilter: "Gift Cards",
    bgGradient: "from-amber-600/30 via-orange-900/40 to-zinc-950",
    glowColor: "rgba(245,158,11,0.15)",
    highlightCategory: "Gift Cards",
    productKeywords: ["binance", "apple", "steam", "google", "amazon", "playstation", "spotify", "netflix"],
    bannerImage: "https://images.unsplash.com/photo-1513151233558-d860c5398176?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: 2,
    title: "Windows License Week",
    tagline: "GENUINE ENTERPRISE CODES",
    description: "Equip your workspaces and gaming setups with official lifetime activation OEM keys. Up to 88% premium pricing discount with high security compliance.",
    ctaText: "View License Keys",
    categoryFilter: "Windows Keys",
    bgGradient: "from-blue-600/20 via-slate-900/40 to-zinc-950",
    glowColor: "rgba(59,130,246,0.15)",
    highlightCategory: "Windows Keys",
    productKeywords: ["win11", "office2021", "win10", "office365"],
    bannerImage: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: 3,
    title: "Gaming Top-Up Festival",
    tagline: "UNLIMITED CODES & TITLES",
    description: "Elevate your game. Top up instant credits, download full game credentials, and secure game currencies for PUBG, Valorant, Epic, Xbox, and more with zero delays.",
    ctaText: "Explore Gaming Deals",
    categoryFilter: "Games",
    bgGradient: "from-purple-600/20 via-pink-950/30 to-zinc-950",
    glowColor: "rgba(168,85,247,0.15)",
    highlightCategory: "Gaming & Subscriptions",
    productKeywords: ["xbox", "pubg", "valopoints", "elden", "minecraft", "cyberpunk"],
    bannerImage: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=800&auto=format&fit=crop"
  }
];

const getBgGradient = (id: number, isDark: boolean) => {
  if (isDark) {
    switch (id) {
      case 1:
        return "from-amber-950/20 via-zinc-900/40 to-zinc-950/90 border-amber-900/30";
      case 2:
        return "from-blue-950/25 via-zinc-900/40 to-zinc-950/90 border-blue-900/30";
      case 3:
        return "from-purple-950/20 via-zinc-900/40 to-zinc-950/90 border-purple-900/30";
      default:
        return "from-zinc-900/30 via-zinc-900/40 to-zinc-950/90 border-zinc-800";
    }
  } else {
    switch (id) {
      case 1:
        return "from-amber-50 via-orange-50/50 to-white border-amber-100";
      case 2:
        return "from-blue-50 via-indigo-50/40 to-white border-blue-100";
      case 3:
        return "from-purple-50 via-pink-50/40 to-white border-purple-100";
      default:
        return "from-zinc-50 via-zinc-100/50 to-white border-zinc-200";
    }
  }
};

export const FeaturedDealsShowcase = ({ products, onSelectProduct, isDark }: FeaturedDealsShowcaseProps) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState({ hours: 14, minutes: 32, seconds: 45 });

  // Custom countdown logic to simulate a premium ticking clock
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else {
          return { hours: 24, minutes: 0, seconds: 0 }; // Loop/reset daily
        }
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const slide = SLIDES[currentSlideIndex];

  // Dynamically filter all available products matching the slide keywords to populate the right compact grid
  const matchedProducts = products.filter(item => {
    const titleLower = item.brand.toLowerCase();
    const catLower = item.category.toLowerCase();
    return slide.productKeywords.some(keyword => 
      titleLower.includes(keyword) || catLower.includes(keyword)
    );
  }).slice(0, 7); // Show 6-7 items in a sleek, compact list

  // Fallback if database has no products matching keywords yet: use from basic
  const displayProducts = matchedProducts.length > 0 ? matchedProducts : products.slice(0, 6);

  const nextSlide = () => {
    setCurrentSlideIndex((prev) => (prev + 1) % SLIDES.length);
  };

  const prevSlide = () => {
    setCurrentSlideIndex((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
  };

  return (
    <section 
      id="featured-deals-showcase" 
      className={`rounded-3xl p-6 sm:p-8 transition-all duration-500 relative overflow-hidden border ${
        isDark 
          ? 'bg-[#0e0e12] border-zinc-900 shadow-2xl shadow-black/40' 
          : 'bg-white border-zinc-200 shadow-xl shadow-zinc-100/50'
      }`}
    >
      {/* Background Ambient Glow Circles */}
      <div 
        className="absolute -top-40 -left-40 w-96 h-96 rounded-full blur-[120px] transition-all duration-1000 pointer-events-none" 
        style={{ backgroundColor: isDark ? slide.glowColor : slide.glowColor.replace('0.15', '0.04') }} 
      />

      {/* Showcase Header with Slate details */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-red-500 fill-red-500 animate-pulse" />
            <span className={`font-mono text-xs font-bold uppercase tracking-widest ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>
              Featured Platform Core
            </span>
          </div>
          <h2 className={`text-2xl sm:text-4xl font-display font-black tracking-tight leading-none mt-1 ${isDark ? 'text-white' : 'text-zinc-950'}`}>
            Super Deals Showcase
          </h2>
        </div>

        {/* Previous / Next Slideshow Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <span className={`font-mono text-[10px] tracking-widest font-bold mr-2 ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>
            {slide.id} / {SLIDES.length}
          </span>
          <button 
            onClick={prevSlide}
            className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all ${
              isDark 
                ? 'border-zinc-800 bg-zinc-900/60 text-white hover:border-zinc-500 hover:bg-zinc-800' 
                : 'border-zinc-200 bg-zinc-50 text-zinc-700 hover:border-zinc-400 hover:bg-zinc-100'
            }`}
            title="Previous collection"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button 
            onClick={nextSlide}
            className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all ${
              isDark 
                ? 'border-zinc-800 bg-zinc-900/60 text-white hover:border-zinc-500 hover:bg-zinc-800' 
                : 'border-zinc-200 bg-zinc-50 text-zinc-700 hover:border-zinc-400 hover:bg-zinc-100'
            }`}
            title="Next collection"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 relative z-10">
        
        {/* Left Column (40% space on desk) - Large Promotional Campaign Card */}
        <div className="lg:col-span-5 flex">
          <AnimatePresence mode="wait">
            <motion.div
              key={slide.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.4 }}
              className={`w-full rounded-2xl relative overflow-hidden flex flex-col justify-between p-6 sm:p-8 shadow-inner group min-h-[400px] border bg-gradient-to-b transition-all duration-500 ${
                getBgGradient(slide.id, isDark)
              } ${isDark ? 'text-white' : 'text-zinc-900'}`}
            >
              {/* Image Underlay with cinematic overlay and hover zoom */}
              <div className={`absolute inset-0 z-0 pointer-events-none group-hover:scale-105 transition-transform duration-700 ${
                isDark ? 'opacity-30 mix-blend-overlay' : 'opacity-[0.05] mix-blend-multiply'
              }`}>
                <img 
                  referrerPolicy="no-referrer" 
                  src={slide.bannerImage} 
                  alt={slide.title} 
                  className="w-full h-full object-cover" 
                />
              </div>

              {/* Bottom Subtle Gradient over image to ensure readable text */}
              <div className={`absolute inset-0 pointer-events-none z-[1] bg-gradient-to-t ${
                isDark ? 'from-zinc-950 via-zinc-900/50 to-transparent' : 'from-white via-white/40 to-transparent'
              }`} />

              {/* Top Row: Promo Badge & Ticking Countdowns */}
              <div className="relative z-10 flex flex-wrap justify-between items-center gap-3">
                <div className="flex items-center gap-1.5 bg-red-600/90 text-[10px] font-mono tracking-widest font-black px-2.5 py-1 rounded-md shadow-lg shadow-red-600/20 uppercase text-white">
                  <Flame className="w-3.5 h-3.5 fill-current animate-pulse" />
                  HOT SALE
                </div>

                {/* Premium Live Countdown */}
                <div className="flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-3 py-1 rounded-lg border border-white/10 text-[11px] font-mono font-bold tracking-tight text-white/90">
                  <Clock className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '6s' }} />
                  ENDS: {timeLeft.hours.toString().padStart(2, '0')}h : {timeLeft.minutes.toString().padStart(2, '0')}m : {timeLeft.seconds.toString().padStart(2, '0')}s
                </div>
              </div>

              {/* Center decorative float particles or badge */}
              <div className="relative z-10 my-auto py-8 flex flex-col items-start gap-2">
                <span className={`text-[10px] font-mono tracking-widest font-black uppercase ${
                  isDark ? 'text-zinc-400 drop-shadow' : 'text-zinc-500'
                }`}>
                  {slide.tagline}
                </span>
                <h3 className={`text-3xl sm:text-4xl lg:text-5xl font-display font-black tracking-tight leading-none uppercase break-words ${
                  isDark ? 'text-white drop-shadow' : 'text-zinc-950'
                }`}>
                  {slide.title}
                </h3>
              </div>

              {/* Bottom Info Block */}
              <div className="relative z-10 space-y-6">
                <p className={`text-xs sm:text-sm leading-relaxed font-normal max-w-sm ${
                  isDark ? 'text-zinc-300' : 'text-zinc-600'
                }`}>
                  {slide.description}
                </p>

                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => {
                      const el = document.getElementById('marketplace-grid-anchor');
                      el?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className={`flex-1 sm:flex-none flex items-center justify-center gap-2 font-bold px-6 py-3.5 rounded-xl text-sm hover:scale-[1.02] active:scale-[0.98] transition-all shadow-md ${
                      isDark 
                        ? 'bg-white text-zinc-950 hover:bg-zinc-105 shadow-black/10' 
                        : 'bg-zinc-950 text-white hover:bg-zinc-800 shadow-zinc-200/50'
                    }`}
                  >
                    <span>{slide.ctaText}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <div className={`hidden sm:flex items-center gap-1 text-[10px] font-mono tracking-wider ${
                    isDark ? 'text-zinc-500' : 'text-zinc-400'
                  }`}>
                    <ShieldCheck className="w-4 h-4 text-green-500" />
                    SECURE ESCROWED
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Right Column (60% space on desk) - Product List Grid (Compact Steam-Style Rows in Columns) */}
        <div className="lg:col-span-7 flex flex-col justify-center">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[500px] overflow-y-auto pr-1 no-scrollbar">
            <AnimatePresence mode="popLayout">
              {displayProducts.map((product, idx) => (
                <motion.div
                  key={product.id + '-' + idx}
                  initial={{ opacity: 0, scale: 0.98, y: 8 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98, y: -8 }}
                  transition={{ duration: 0.2, delay: idx * 0.03 }}
                  onClick={() => onSelectProduct(product)}
                  className={`flex items-center justify-between gap-3 p-2.5 rounded-xl transition-all border cursor-pointer group ${
                    isDark 
                      ? 'border-zinc-900/10 bg-gradient-to-br from-zinc-900/35 to-zinc-950/50 hover:border-zinc-800 hover:from-zinc-900 hover:to-zinc-950 shadow-lg shadow-black/10' 
                      : 'border-zinc-100/20 bg-gradient-to-br from-zinc-50/50 to-zinc-100/30 hover:border-zinc-250 hover:from-white hover:to-zinc-50 shadow-sm'
                  }`}
                >
                  {/* Left: Thumbnail & Title + Shuffled Category */}
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className={`w-12 h-9 sm:w-14 sm:h-11 rounded overflow-hidden shrink-0 relative border ${
                      isDark ? 'bg-zinc-900 border-zinc-800/40' : 'bg-zinc-200 border-zinc-200/20'
                    }`}>
                      <img 
                        referrerPolicy="no-referrer" 
                        src={product.image} 
                        alt={product.brand} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                      />
                    </div>
                    <div className="min-w-0 space-y-0.5">
                      <h4 className={`font-bold text-xs truncate leading-snug ${isDark ? 'text-zinc-200 group-hover:text-amber-550' : 'text-zinc-800 group-hover:text-zinc-950'}`}>
                        {product.brand}
                      </h4>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className={`font-mono text-[8px] tracking-wider uppercase ${
                          isDark ? 'text-zinc-500' : 'text-zinc-400'
                        }`}>
                          {product.category}
                        </span>
                        {product.inventoryCount <= 40 && (
                          <span className="text-[8px] font-mono font-bold text-red-500/80 uppercase">
                            Low Stock
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right: Price & Discount badge */}
                  <div className="flex items-center gap-2 shrink-0">
                    {/* Discount percentage tag - neutral themed */}
                    {product.discount > 0 && (
                      <span className={`font-mono font-bold text-[9px] px-1 py-0.5 rounded ${
                        isDark ? 'bg-zinc-800 text-zinc-300' : 'bg-zinc-150 text-zinc-700'
                      }`}>
                        -{product.discount}%
                      </span>
                    )}

                    {/* Price structure - completely green-free */}
                    <div className="text-right">
                      <p className={`text-xs sm:text-sm font-display font-black leading-none ${isDark ? 'text-white' : 'text-zinc-950'}`}>
                        ${product.finalPrice.toFixed(2)}
                      </p>
                      {product.discount > 0 && (
                        <p className="text-[9px] text-zinc-450 line-through font-medium mt-0.5">${product.realPrice.toFixed(2)}</p>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

      </div>
    </section>
  );
};
