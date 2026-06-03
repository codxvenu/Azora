import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  ShieldCheck, 
  ChevronDown, 
  ChevronUp, 
  Star, 
  CheckCircle2, 
  Info, 
  Zap, 
  CreditCard, 
  Lock, 
  Sparkles, 
  HelpCircle, 
  Globe, 
  AlertTriangle,
  Gift,
  Plus,
  Minus,
  MessageSquare
} from 'lucide-react';
import { GiftCard } from '../types';
import { GiftCardItem } from './GiftCardItem';
import { X } from 'lucide-react';

interface ProductDetailViewProps {
  card: GiftCard;
  isDark?: boolean;
  onClose: () => void;
  onBuy: (amount: number) => void;
  onAddToCart?: (card: GiftCard, quantity: number) => void;
  allCards: GiftCard[];
  onSelectCard: (card: GiftCard) => void;
}

export const ProductDetailView = ({ 
  card, 
  isDark, 
  onClose, 
  onBuy, 
  onAddToCart,
  allCards, 
  onSelectCard 
}: ProductDetailViewProps) => {
  // Determine if it is a customisable-value digital product vs fixed-price key
  const isGiftCardCategory = card.category.toLowerCase().includes('card') || card.brand.toLowerCase().includes('card') || card.brand.toLowerCase().includes('voucher');
  
  // Base values
  const defaultAmount = card.finalPrice;
  const discountRate = card.discount / 100;

  // Selected state
  const [currency, setCurrency] = useState<'USD' | 'INR'>('USD');
  const [selectedAmount, setSelectedAmount] = useState<number>(defaultAmount);
  const [customInputVal, setCustomInputVal] = useState<string>(defaultAmount.toString());
  const [quantity, setQuantity] = useState<number>(1);
  const [activeChip, setActiveChip] = useState<number | null>(null);

  // Accordion active state
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    overview: true,
    redemption: true,
    restrictions: false,
    terms: false,
    faq: false,
  });

  // Carousel ref
  const carouselRef = useRef<HTMLDivElement>(null);

  // Scroll to top on card change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setSelectedAmount(card.finalPrice);
    setCustomInputVal(card.finalPrice.toString());
    setQuantity(1);
    setActiveChip(null);
  }, [card]);

  // Update selection amount and chip logic
  const selectQuickValue = (val: number, isINR: boolean) => {
    if (isINR) {
      setCurrency('INR');
      // Convert standard INR to USD base for simulation (e.g. 1 USD = 80 INR for show)
      const convertedToUSD = Math.round((val / 80) * 100) / 100;
      setSelectedAmount(convertedToUSD);
      setCustomInputVal((val).toString());
    } else {
      setCurrency('USD');
      setSelectedAmount(val);
      setCustomInputVal(val.toString());
    }
  };

  const handleCustomInputChange = (val: string) => {
    setCustomInputVal(val);
    const num = parseFloat(val);
    if (!isNaN(num) && num > 0) {
      if (currency === 'INR') {
        const usdBase = Math.round((num / 80) * 100) / 100;
        setSelectedAmount(usdBase);
      } else {
        setSelectedAmount(num);
      }
      setActiveChip(null);
    }
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Pricing calculations
  const originalPriceCalculated = selectedAmount / (1 - discountRate);
  const finalPriceCalculated = selectedAmount * quantity;
  const discountAmount = (originalPriceCalculated - selectedAmount) * quantity;
  const originalTotal = originalPriceCalculated * quantity;

  // Render prices formatted nicely
  const formatCurrency = (amountInUSD: number) => {
    if (currency === 'INR') {
      const inINR = amountInUSD * 80;
      return `₹${inINR.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 1 })}`;
    }
    return `$${amountInUSD.toFixed(2)}`;
  };

  // Reviews state with fully interactive dynamic appending
  const [reviewsList, setReviewsList] = useState([
    {
      id: 1,
      author: 'Rahul Sharma',
      rating: 5,
      date: 'Purchased 2 Days Ago',
      badge: 'Verified Purchase',
      product: 'Windows 11 Pro',
      delivery: 'Delivered in 12 Seconds',
      flag: '🇮🇳',
      country: 'India',
      content: 'Activation worked instantly. Received my key immediately after payment. The process was smooth and professional.'
    },
    {
      id: 2,
      author: 'Chloe Laurent',
      rating: 5,
      date: 'Purchased 1 Day Ago',
      badge: 'Verified Purchase',
      product: 'Apple $100 Gift Card',
      delivery: 'Delivered in 4 Seconds',
      flag: '🇫🇷',
      country: 'France',
      content: 'Incredible design on this marketplace and lightning fast activation. Redirection with SSL ledger was completely secure. 5-stars!'
    },
    {
      id: 3,
      author: 'Kenji Sato',
      rating: 5,
      date: 'Purchased 5 Days Ago',
      badge: 'Verified Merchant',
      product: 'Steam $50 Wallet Top-up',
      delivery: 'Delivered in 8 Seconds',
      flag: '🇯🇵',
      country: 'Japan',
      content: 'Sourced gaming codes for our e-sports squad. Unbeatable rates, genuine keys and flawless support interface. Absolutely recommend.'
    },
    {
      id: 4,
      author: 'Marcus Sterling',
      rating: 5,
      date: 'Purchased 1 Week Ago',
      badge: 'Verified Purchase',
      product: 'Elden Ring Expansion Key',
      delivery: 'Delivered in 15 Seconds',
      flag: '🇺🇸',
      country: 'USA',
      content: 'Elden Ring activation was instant! Saved $10 compared to standard steam store rates. Absolute no-brainer.'
    },
    {
      id: 5,
      author: 'Alistair Vance',
      rating: 5,
      date: 'Purchased 3 Days Ago',
      badge: 'Verified Purchase',
      product: 'Xbox Game Pass Ultimate',
      delivery: 'Delivered in 6 Seconds',
      flag: '🇬🇧',
      country: 'UK',
      content: 'Cleanest payment gateway I have ever used. Literally typed code, saw success modal in 4 seconds. Future of keys.'
    }
  ]);

  const [activeReviewIndex, setActiveReviewIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  // Submit Review state
  const [isWriteReviewOpen, setIsWriteReviewOpen] = useState(false);
  const [newAuthor, setNewAuthor] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [newContent, setNewContent] = useState('');
  const [newProduct, setNewProduct] = useState(card.brand);

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAuthor.trim() || !newContent.trim()) return;

    const newRev = {
      id: Date.now(),
      author: newAuthor,
      rating: newRating,
      date: 'Purchased Just Now',
      badge: 'Verified Purchase',
      product: newProduct,
      delivery: 'Delivered in 3 Seconds',
      flag: '🌐',
      country: 'Verified User',
      content: newContent
    };

    setReviewsList(prev => [newRev, ...prev]);
    setIsWriteReviewOpen(false);
    setNewAuthor('');
    setNewRating(5);
    setNewContent('');
  };

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const getDiff = (index: number) => {
    let diff = index - activeReviewIndex;
    const len = reviewsList.length;
    if (diff < -len / 2) diff += len;
    if (diff > len / 2) diff -= len;
    return diff;
  };

  const getCardStyles = (idx: number) => {
    const diff = getDiff(idx);
    
    if (diff === 0) {
      return {
        x: 0,
        scale: 1.08,
        rotate: 0,
        opacity: 1,
        zIndex: 40,
        pointerEvents: 'auto' as const
      };
    } else if (diff === -1) {
      return {
        x: isMobile ? -50 : -200,
        scale: 0.9,
        rotate: -8,
        opacity: 0.45,
        zIndex: 20,
        pointerEvents: 'none' as const
      };
    } else if (diff === 1) {
      return {
        x: isMobile ? 50 : 200,
        scale: 0.9,
        rotate: 8,
        opacity: 0.45,
        zIndex: 20,
        pointerEvents: 'none' as const
      };
    } else {
      return {
        x: diff < 0 ? (isMobile ? -140 : -350) : (isMobile ? 140 : 350),
        scale: 0.8,
        rotate: 0,
        opacity: 0,
        zIndex: 10,
        pointerEvents: 'none' as const
      };
    }
  };

  const handleNext = () => {
    setActiveReviewIndex(prev => (prev + 1) % reviewsList.length);
  };
  
  const handlePrev = () => {
    setActiveReviewIndex(prev => (prev - 1 + reviewsList.length) % reviewsList.length);
  };

  const handleDragEnd = (event: any, info: any) => {
    const threshold = 50;
    if (info.offset.x < -threshold) {
      handleNext();
    } else if (info.offset.x > threshold) {
      handlePrev();
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeReviewIndex, reviewsList]);

  // Quick Amount chips depending on currency mode
  const quickChipsUSD = [10, 25, 50, 100, 200];
  const quickChipsINR = [500, 1000, 2000, 5000, 10000];

  // Horizontal scroll controls
  const scrollCarousel = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const { scrollLeft, clientWidth } = carouselRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - 300 : scrollLeft + 300;
      carouselRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  // Get related items
  const relatedCards = allCards
    .filter(c => c.id !== card.id && (c.category === card.category || Math.random() > 0.5))
    .slice(0, 6);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`w-full max-w-7xl mx-auto ${
        isDark ? 'text-zinc-100' : 'text-zinc-900'
      }`}
    >
      {/* Top Breadcrumb & Navbar Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 py-6 border-b transition-colors duration-300 mb-8 px-2 sm:px-0 border-zinc-200/60 dark:border-zinc-800/40">
        <div className="flex items-center gap-3 text-xs sm:text-sm font-medium">
          <button 
            onClick={onClose} 
            className={`flex items-center gap-2 hover:opacity-85 font-mono uppercase tracking-wider ${
              isDark ? 'text-zinc-400 hover:text-white' : 'text-zinc-500 hover:text-black'
            }`}
          >
            <ArrowLeft className="w-4 h-4" /> Back to Marketplace
          </button>
          <span className="opacity-30">/</span>
          <span className="opacity-60 font-mono tracking-wider">GIFT CARDS</span>
          <span className="opacity-30">/</span>
          <span className="font-bold truncate max-w-[120px] sm:max-w-[200px]">{card.brand}</span>
        </div>

        <div className="flex items-center gap-3">
          <span className={`text-[10px] sm:text-xs font-mono font-bold uppercase ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>
            ID: {card.id.toUpperCase()}
          </span>
        </div>
      </div>

      {/* Main Two-Column Structure */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* Left Column (65%) */}
        <div className="lg:col-span-8 space-y-12 text-left">
          
          {/* Product Header Block */}
          <div className="space-y-6">
            <div className="flex flex-wrap gap-2.5 items-center">
              <span className={`px-3 py-1 rounded-full text-[10px] font-mono font-bold tracking-widest uppercase border ${
                isDark 
                  ? 'bg-zinc-950 text-zinc-300 border-zinc-805' 
                  : 'bg-stone-100 text-stone-700 border-stone-200'
              }`}>
                {card.category}
              </span>
              <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono font-bold tracking-widest uppercase border ${
                isDark 
                  ? 'bg-amber-500/5 border-amber-500/30 text-amber-500' 
                  : 'bg-zinc-100 border-zinc-200 text-zinc-950 font-black'
              }`}>
                <Zap className="w-3" /> INSTANT DELIVERY
              </span>
              <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono font-bold tracking-widest uppercase border ${
                isDark ? 'bg-zinc-900/60 border-zinc-805 text-zinc-400' : 'bg-stone-100/40 border-stone-200 text-stone-600'
              }`}>
                <ShieldCheck className="w-3" /> SECURE CHECKOUT
              </span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-display font-black tracking-tighter uppercase leading-none max-w-3xl">
              {card.brand}
            </h1>

            <p className={`text-base sm:text-lg leading-relaxed max-w-xl font-normal ${
              isDark ? 'text-zinc-400' : 'text-zinc-500 font-sans'
            }`}>
              {card.description}
            </p>
          </div>

          {/* Accordion List */}
          <div className="space-y-4 border-t pt-8 border-zinc-200/60 dark:border-zinc-800/40">
            
            {/* Accordion 1: Product Overview */}
            <div className={`border-b transition-all ${isDark ? 'border-zinc-800/40' : 'border-zinc-200/60'} pb-5`}>
              <button 
                onClick={() => toggleSection('overview')}
                className="w-full flex justify-between items-center py-3 text-left focus:outline-none"
              >
                <span className="text-sm font-bold uppercase tracking-widest font-mono flex items-center gap-3">
                  <span className="opacity-30">01</span> Product Overview
                </span>
                {expandedSections.overview ? <ChevronUp className="w-4 h-4 opacity-50" /> : <ChevronDown className="w-4 h-4 opacity-50" />}
              </button>
              
              <AnimatePresence>
                {expandedSections.overview && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className={`pt-2 pb-4 text-sm leading-relaxed space-y-4 ${isDark ? 'text-zinc-400' : 'text-zinc-650 font-sans'}`}>
                      <p>
                        Generate custom value codes instantly with 4ura.cards technology. This digital product allows you to immediately redeem credits and licenses without waiting time. Authentic license codes are processed and validated live through our dynamic SSL ledger system.
                      </p>
                      <p>
                        Highly recommended for gaming, system upgrades, software license renewals, and direct cashout gifts. Purchases are backed by our global 100% money-back guarantee policy.
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Accordion 2: Redemption Guide  */}
            <div className={`border-b transition-all ${isDark ? 'border-zinc-800/40' : 'border-zinc-200/60'} pb-5`}>
              <button 
                onClick={() => toggleSection('redemption')}
                className="w-full flex justify-between items-center py-3 text-left focus:outline-none"
              >
                <span className="text-sm font-bold uppercase tracking-widest font-mono flex items-center gap-3">
                  <span className="opacity-30">02</span> Redemption Guide
                </span>
                {expandedSections.redemption ? <ChevronUp className="w-4 h-4 opacity-50" /> : <ChevronDown className="w-4 h-4 opacity-50" />}
              </button>

              <AnimatePresence>
                {expandedSections.redemption && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    {/* Numbered Timeline */}
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 pt-4 pb-4">
                      {[
                        { step: '01', title: 'Purchase Product', desc: 'Securely pay using your wallet, card, or crypto' },
                        { step: '02', title: 'Receive Instantly', desc: 'Get your activation code in the Orders tab within 5 seconds' },
                        { step: '03', title: 'Redeem Code', desc: 'Enter secure credentials on standard platforms' },
                        { step: '04', title: 'Enjoy Digital Value', desc: 'Your balance activates immediately worldwide' }
                      ].map((item, index) => (
                        <div key={index} className={`space-y-3 p-4 rounded-2xl border transition-colors ${
                          isDark ? 'bg-zinc-950/40 border-zinc-900' : 'bg-stone-50/50 border-zinc-200/40'
                        }`}>
                          <p className="text-xl font-display font-black tracking-tighter text-amber-500">{item.step}</p>
                          <h4 className="font-bold text-xs uppercase tracking-wider">{item.title}</h4>
                          <p className={`text-[11px] leading-relaxed ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>{item.desc}</p>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Accordion 3: Restrictions */}
            <div className={`border-b transition-all ${isDark ? 'border-zinc-800/40' : 'border-zinc-200/60'} pb-5`}>
              <button 
                onClick={() => toggleSection('restrictions')}
                className="w-full flex justify-between items-center py-3 text-left focus:outline-none"
              >
                <span className="text-sm font-bold uppercase tracking-widest font-mono flex items-center gap-3">
                  <span className="opacity-30">03</span> Important Restrictions
                </span>
                {expandedSections.restrictions ? <ChevronUp className="w-4 h-4 opacity-50" /> : <ChevronDown className="w-4 h-4 opacity-50" />}
              </button>

              <AnimatePresence>
                {expandedSections.restrictions && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className={`pt-2 pb-4 text-xs space-y-3 leading-relaxed flex flex-col gap-1 ${isDark ? 'text-zinc-400' : 'text-zinc-650'}`}>
                      <div className="flex gap-2.5 items-start bg-red-500/5 p-4 rounded-xl border border-red-500/20 text-red-500">
                        <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-bold uppercase tracking-wider text-[10px]">Verify Activation Country</p>
                          <p className="text-[11px]">This specific key is legally restricted in select regions: please double check global IP proxy and billing address settings before redeeming.</p>
                        </div>
                      </div>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Each activation voucher can be redeemed exactly once.</li>
                        <li>Non-refundable digital product after official delivery is complete.</li>
                        <li>Requires a valid account associated with the parent service platform (Steam, Apple, Windows Retail, etc.).</li>
                      </ul>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Accordion 4: Terms & Conditions */}
            <div className={`border-b transition-all ${isDark ? 'border-zinc-800/40' : 'border-zinc-200/60'} pb-5`}>
              <button 
                onClick={() => toggleSection('terms')}
                className="w-full flex justify-between items-center py-3 text-left focus:outline-none"
              >
                <span className="text-sm font-bold uppercase tracking-widest font-mono flex items-center gap-3">
                  <span className="opacity-30">04</span> Terms & Conditions
                </span>
                {expandedSections.terms ? <ChevronUp className="w-4 h-4 opacity-50" /> : <ChevronDown className="w-4 h-4 opacity-50" />}
              </button>

              <AnimatePresence>
                {expandedSections.terms && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className={`pt-2 pb-4 text-xs leading-relaxed space-y-3 ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>
                      <p>
                        By activating, selling, or acquiring digital items on 4ura.cards, you unconditionally agree to our structural digital delivery guidelines. All cards, keys, and subscriptions undergo strict anti-fraud verifications through algorithmic pattern checkers.
                      </p>
                      <p>
                        Users are strictly liable for the security of their generated passwords, API integrations, and two-factor system parameters. Unauthorized transfers or chargebacks are reported immediately to verification ledger databases.
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Accordion 5: FAQ */}
            <div className={`border-b transition-all ${isDark ? 'border-zinc-800/40' : 'border-zinc-200/60'} pb-5`}>
              <button 
                onClick={() => toggleSection('faq')}
                className="w-full flex justify-between items-center py-3 text-left focus:outline-none"
              >
                <span className="text-sm font-bold uppercase tracking-widest font-mono flex items-center gap-3">
                  <span className="opacity-30">05</span> Frequently Asked Questions (FAQ)
                </span>
                {expandedSections.faq ? <ChevronUp className="w-4 h-4 opacity-50" /> : <ChevronDown className="w-4 h-4 opacity-50" />}
              </button>

              <AnimatePresence>
                {expandedSections.faq && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="pt-2 pb-4 space-y-4 text-sm">
                      {[
                        { q: 'How fast is instant delivery?', a: 'Within 5 seconds! As soon as payment validation is completed by our processing nodes, your voucher is added securely to your orders history tab.' },
                        { q: 'What happens if a code fails to activate?', a: 'Every purchase is covered under our 4ura Integrity Shield. If the key code encounters technical difficulty, contact 24/7 client care live to inspect the activation register.' },
                        { q: 'Can I redeem my card balance in India?', a: 'Yes! Toggle the currency switcher in the purchasing sidebar to dynamically display standard INR estimates.' }
                      ].map((item, idx) => (
                        <div key={idx} className="space-y-1">
                          <p className="font-bold flex items-center gap-2 text-xs">
                            <HelpCircle className="w-3.5 h-3.5 text-amber-500 shrink-0" /> {item.q}
                          </p>
                          <p className={`text-[11px] leading-relaxed pl-5.5 ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>{item.a}</p>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </div>

          {/* Customer Reviews Session (Modern 3D Stacked Testimonial Carousel) */}
          <div className="space-y-8 pt-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b pb-4 border-stone-200/60 dark:border-zinc-800/40">
              <div className="space-y-1">
                <h3 className="text-lg font-display font-bold uppercase font-mono tracking-widest flex items-center gap-2.5">
                  <MessageSquare className="w-4 h-4 text-amber-500" /> Customer Reviews
                </h3>
                <p className={`text-xs ${isDark ? 'text-zinc-500' : 'text-stone-500'}`}>
                  Drag, swipe, or use keyboard arrows to explore verified global purchase reviews.
                </p>
              </div>
              <div className="flex items-center gap-2.5 pt-2 sm:pt-0">
                <div className="flex text-amber-500">
                  <Star className="w-3.5 h-3.5 fill-amber-500" />
                  <Star className="w-3.5 h-3.5 fill-amber-500" />
                  <Star className="w-3.5 h-3.5 fill-amber-500" />
                  <Star className="w-3.5 h-3.5 fill-amber-500" />
                  <Star className="w-3.5 h-3.5 fill-amber-500" />
                </div>
                <span className="text-xs font-bold font-mono">4.9 / 5.0</span>
              </div>
            </div>

            {/* 3D Stack Container */}
            <div className="relative min-h-[420px] sm:min-h-[400px] flex items-center justify-center overflow-visible py-6">
              <div className="relative w-full max-w-[420px] h-[340px] sm:h-[350px] flex items-center justify-center">
                <AnimatePresence initial={false}>
                  {reviewsList.map((review, idx) => {
                    const diff = getDiff(idx);
                    const isActive = diff === 0;
                    const isLeft = diff === -1;
                    const isRight = diff === 1;
                    const isVisible = Math.abs(diff) <= 1;

                    if (!isVisible) return null;

                    return (
                      <motion.div
                        key={review.id}
                        onClick={() => {
                          if (isLeft) handlePrev();
                          if (isRight) handleNext();
                        }}
                        style={{
                          transformOrigin: "center bottom",
                          cursor: isActive ? "grab" : "pointer",
                        }}
                        animate={getCardStyles(idx)}
                        whileTap={isActive ? { cursor: "grabbing" } : {}}
                        whileHover={isActive ? { y: -6, scale: 1.1 } : {}}
                        transition={{
                          type: "spring",
                          stiffness: 260,
                          damping: 26
                        }}
                        drag={isActive ? "x" : false}
                        dragConstraints={{ left: 0, right: 0 }}
                        dragElastic={0.4}
                        onDragEnd={handleDragEnd}
                        className={`absolute w-full h-full p-6 sm:p-7 rounded-3xl border text-left flex flex-col justify-between transition-shadow duration-300 ${
                          isActive
                            ? isDark
                              ? 'bg-zinc-950/90 border-zinc-800 shadow-[0_25px_60px_-15px_rgba(245,158,11,0.25),_0_0_50px_-12px_rgba(245,158,11,0.1)] backdrop-blur-xl'
                              : 'bg-white/95 border-amber-200/80 shadow-[0_20px_50px_rgba(245,158,11,0.15),_0_0_40px_-5px_rgba(245,158,11,0.06)] backdrop-blur-xl'
                            : isDark
                            ? 'bg-zinc-900/60 border-zinc-900/80 backdrop-blur-sm shadow-md'
                            : 'bg-stone-50 border-stone-200/40 backdrop-blur-sm shadow-sm'
                        }`}
                      >
                        {idx === 0 ? (
                          /* First Card (idx === 0): Dedicated Review Analytics Card */
                          <div className={`flex flex-col justify-between h-full w-full ${isActive ? 'opacity-100' : 'opacity-65'}`}>
                            {/* Customer Reviews subhead */}
                            <div className="flex justify-between items-center">
                              <h4 className="text-zinc-950 dark:text-zinc-50 font-display font-black text-xs uppercase tracking-widest flex items-center gap-2">
                                <MessageSquare className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                                Rating Report
                              </h4>
                              <span className="text-[9px] text-amber-500 font-mono font-bold tracking-wider px-1.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">LIVE STATS</span>
                            </div>

                            {/* Overall Rating & Count */}
                            <div className="space-y-0.5 mt-2">
                              <div className="flex items-center gap-2">
                                <span className="font-mono text-xs font-black text-zinc-950 dark:text-zinc-50">4.9 out of 5</span>
                                <div className="flex text-amber-500 scale-90 origin-left">
                                  <Star className="w-3 h-3 fill-amber-500" />
                                  <Star className="w-3 h-3 fill-amber-500" />
                                  <Star className="w-3 h-3 fill-amber-500" />
                                  <Star className="w-3 h-3 fill-amber-500" />
                                  <Star className="w-3 h-3 fill-amber-500" />
                                </div>
                              </div>
                              <p className={`text-[10px] font-mono leading-none ${isDark ? 'text-zinc-500' : 'text-stone-400'}`}>
                                From 12,847 verified purchases
                              </p>
                            </div>

                            {/* Star Rating Distribution Vertical Chart (growing bottom to top) */}
                            <div className="flex items-end justify-between gap-1 py-1.5 mt-2 flex-grow">
                              {[
                                { stars: 5, pct: 92 },
                                { stars: 4, pct: 5 },
                                { stars: 3, pct: 2 },
                                { stars: 2, pct: 1 },
                                { stars: 1, pct: 0 }
                              ].map((row) => (
                                <div key={row.stars} className="flex flex-col items-center gap-1 flex-1">
                                  {/* Percentage label */}
                                  <span className="text-[9px] font-mono font-bold text-amber-500">{row.pct}%</span>
                                  
                                  {/* Vertical Bar Container */}
                                  <div className="w-3 sm:w-4 h-16 sm:h-20 rounded-full bg-zinc-100 dark:bg-zinc-900 overflow-hidden relative flex items-end border border-zinc-200/50 dark:border-zinc-800/40">
                                    <motion.div
                                      initial={{ height: 0 }}
                                      animate={{ height: `${row.pct}%` }}
                                      transition={{ duration: 1, ease: "easeOut" }}
                                      className="w-full rounded-full bg-gradient-to-t from-amber-500 to-amber-400"
                                    />
                                  </div>
                                  
                                  {/* Star level label */}
                                  <span className="text-[9px] font-mono text-zinc-500 dark:text-zinc-400 font-bold">{row.stars}★</span>
                                </div>
                              ))}
                            </div>

                            {/* Submit Review Button */}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setIsWriteReviewOpen(true);
                              }}
                              className="w-full mt-2 py-2 rounded-xl font-mono text-[10px] font-bold uppercase tracking-wider transition-all border border-amber-500/20 bg-amber-500/10 hover:bg-amber-500 text-amber-500 hover:text-black hover:border-amber-500 active:scale-98 duration-200 animate-pulse"
                            >
                              Submit Review
                            </button>
                          </div>
                        ) : (
                          /* Subsequent Cards (idx > 0): Classic standard custom review display */
                          <div className={`flex flex-col justify-between h-full w-full ${isActive ? 'opacity-100' : 'opacity-60'}`}>
                            {/* Rating Stars and badges */}
                            <div className="space-y-3">
                              <div className="flex items-center justify-between">
                                <div className="flex gap-0.5 text-amber-500">
                                  {[...Array(review.rating)].map((_, i) => (
                                    <Star key={i} className="w-3" />
                                  ))}
                                </div>
                                <span className="text-[10px] font-mono opacity-50">{review.date}</span>
                              </div>

                              {/* Product & Time badges */}
                              <div className="flex flex-wrap gap-1.5 items-center">
                                <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold tracking-wider uppercase border whitespace-nowrap overflow-hidden text-ellipsis max-w-[120px] ${
                                  isDark ? 'bg-zinc-950 text-zinc-300 border-zinc-800' : 'bg-stone-100 text-stone-700 border-stone-200'
                                }`}>
                                  {review.product}
                                </span>
                                <span className="flex items-center gap-1 px-2 py-0.5 rounded text-[9px] font-mono font-bold text-amber-500 bg-amber-500/5 border border-amber-500/20">
                                  <Zap className="w-2.5 h-2.5" /> 5-10s
                                </span>
                                <span className="flex items-center gap-1 px-2 py-0.5 rounded text-[9px] font-mono font-bold text-emerald-500 bg-emerald-500/5 border border-emerald-500/20">
                                  <CheckCircle2 className="w-2.5 h-2.5" /> Verified
                                </span>
                              </div>

                              {/* Review Content text */}
                              <p className={`text-xs sm:text-xs leading-relaxed ${isDark ? 'text-zinc-350' : 'text-zinc-700 font-sans'} italic line-clamp-4`}>
                                "{review.content}"
                              </p>
                            </div>

                            {/* Customer / Region Metadata */}
                            <div className="flex items-center justify-between pt-3 border-t border-dashed border-zinc-200/10 dark:border-zinc-800">
                              <div>
                                <p className="font-bold text-xs">{review.author}</p>
                                <p className={`text-[10px] font-mono ${isDark ? 'text-zinc-500' : 'text-stone-400'}`}>Verified buyer</p>
                              </div>
                              <div className="flex items-center gap-1.5 shrink-0">
                                <span className="text-sm" role="img" aria-label={review.country}>{review.flag}</span>
                                <span className={`text-[10px] font-mono font-bold tracking-wider uppercase ${isDark ? 'text-zinc-400' : 'text-stone-500'}`}>
                                  {review.country}
                                </span>
                              </div>
                            </div>
                          </div>
                        )}
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            </div>

            {/* Navigation Buttons and dots indicator */}
            <div className="flex flex-col items-center gap-4">
              <div className="flex items-center gap-4">
                <button
                  onClick={handlePrev}
                  className={`p-2.5 rounded-xl border transition-all ${
                    isDark ? 'bg-zinc-900 border-zinc-800 hover:bg-zinc-800 text-white' : 'bg-white border-stone-200 hover:bg-stone-50 text-black'
                  }`}
                  title="Previous Review"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                
                {/* Micro Dots */}
                <div className="flex gap-2">
                  {reviewsList.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveReviewIndex(idx)}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        idx === activeReviewIndex
                          ? 'w-6 bg-amber-500'
                          : `w-1.5 ${isDark ? 'bg-zinc-800' : 'bg-stone-200 hover:bg-stone-300'}`
                      }`}
                      title={`Go to Review ${idx + 1}`}
                    />
                  ))}
                </div>

                <button
                  onClick={handleNext}
                  className={`p-2.5 rounded-xl border transition-all ${
                    isDark ? 'bg-zinc-900 border-zinc-800 hover:bg-zinc-800 text-white' : 'bg-white border-stone-200 hover:bg-stone-50 text-black'
                  }`}
                  title="Next Review"
                >
                  <ArrowLeft className="w-4 h-4 rotate-180" />
                </button>
              </div>

              {/* Active Review Detail Panel (Displays current index comments below dynamically) */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeReviewIndex}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="max-w-md mx-auto text-center px-6 py-2 bg-gradient-to-r from-zinc-500/5 to-transparent rounded-2xl border border-transparent dark:border-transparent mt-2"
                >
                  <p className={`text-xs sm:text-xs leading-relaxed italic ${isDark ? 'text-zinc-400' : 'text-zinc-650'}`}>
                    "{reviewsList[activeReviewIndex].content}"
                  </p>
                  <div className="flex items-center justify-center gap-2 mt-2 font-mono text-[9px]">
                    <span className="text-xs">{reviewsList[activeReviewIndex].flag}</span>
                    <p className="text-amber-500 font-bold uppercase tracking-wider">
                      — {reviewsList[activeReviewIndex].author} ({reviewsList[activeReviewIndex].country})
                    </p>
                    <span className={`px-2 py-0.5 rounded border ${
                      isDark ? 'bg-zinc-950 text-zinc-400 border-zinc-900/60' : 'bg-stone-50 text-stone-500 border-zinc-200/40'
                    }`}>
                      {reviewsList[activeReviewIndex].product}
                    </span>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Related Products Section */}
          <div className="space-y-6 pt-6">
            <div className="flex items-center justify-between border-b pb-4 border-zinc-200/60 dark:border-zinc-800/40">
              <div className="space-y-0.5">
                <h3 className="text-lg font-display font-bold uppercase font-mono tracking-widest flex items-center gap-2.5">
                  <Sparkles className="w-4 h-4 text-amber-500" /> You May Also Like
                </h3>
                <p className={`text-xs ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>Expand your digital assets library with related licenses.</p>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => scrollCarousel('left')}
                  className={`p-2 rounded-xl border transition-colors ${
                    isDark ? 'bg-zinc-900 border-zinc-805 hover:bg-zinc-800' : 'bg-white border-zinc-200 hover:bg-zinc-50'
                  }`}
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => scrollCarousel('right')}
                  className={`p-2 rounded-xl border transition-colors ${
                    isDark ? 'bg-zinc-900 border-zinc-805 hover:bg-zinc-800' : 'bg-white border-zinc-200 hover:bg-zinc-50'
                  }`}
                >
                  <ArrowLeft className="w-4 h-4 rotate-185" />
                </button>
              </div>
            </div>

            {/* Carousel list */}
            <div 
              ref={carouselRef}
              className="flex gap-5 overflow-x-auto pb-4 no-scrollbar snap-x scroll-smooth"
            >
              {relatedCards.map(rc => (
                <div key={rc.id} className="snap-start min-w-[220px] sm:min-w-[245px]">
                  <GiftCardItem card={rc} onClick={() => onSelectCard(rc)} isDark={isDark} />
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Sticky Purchase Panel (35%) */}
        <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-6">
          
          <div className={`rounded-3xl border p-6 sm:p-8 space-y-6 transition-all duration-300 ${
            isDark 
              ? 'bg-zinc-950 border-zinc-900 shadow-xl shadow-black/60' 
              : 'bg-white border-zinc-200/85 shadow-2xl shadow-zinc-200/50'
          }`}>
            
            {/* Visual Dynamic Card representation with smooth animations */}
            <div className="perspective-1000">
              <motion.div 
                whileHover={{ rotateY: 3, rotateX: -3 }}
                className={`aspect-[1.58/1] rounded-2xl w-full p-6 relative overflow-hidden flex flex-col justify-between shadow-lg text-white border select-none ${
                  card.category.toLowerCase().includes('games') || card.brand.toLowerCase().includes('key')
                    ? 'bg-gradient-to-br from-violet-600 via-indigo-700 to-zinc-950 border-violet-500/20'
                    : card.category.toLowerCase().includes('windows')
                    ? 'bg-gradient-to-br from-blue-600 via-indigo-600 to-slate-900 border-blue-500/20'
                    : card.category.toLowerCase().includes('subs')
                    ? 'bg-gradient-to-br from-rose-600 via-pink-700 to-zinc-900 border-rose-500/20'
                    : 'bg-gradient-to-br from-zinc-900 via-zinc-950 to-neutral-800 border-zinc-800'
                }`}
              >
                {/* Embedded Glass Glow reflection */}
                <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/10 pointer-events-none" />
                
                <div className="flex justify-between items-start z-10">
                  <div className="space-y-0.5">
                    <p className="text-[8px] font-mono font-bold tracking-widest opacity-60 uppercase">4URA DIGITAL KEY</p>
                    <p className="font-display font-black text-xs tracking-tighter max-w-[120px] truncate">{card.brand.split(':')[0]}</p>
                  </div>
                  <Gift className="w-5 h-5 text-white/50" />
                </div>

                <div className="flex justify-between items-end z-10 pt-8">
                  <div className="space-y-1">
                    <p className="text-[7px] font-mono font-black tracking-widest opacity-40 uppercase">ACTIVATION ESTIMATE</p>
                    <AnimatePresence mode="wait">
                      <motion.p 
                        key={selectedAmount + currency}
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 5 }}
                        className="text-2xl font-display font-black tracking-tighter"
                      >
                        {formatCurrency(selectedAmount)}
                      </motion.p>
                    </AnimatePresence>
                  </div>
                  <div className="w-10 h-6 rounded bg-white/15 backdrop-blur-md flex items-center justify-center text-[8px] font-mono font-black tracking-widest">
                    SSL
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Custom Amount Inputs if Refillable Card */}
            {isGiftCardCategory ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center px-1">
                  <label className={`text-[10px] font-mono font-bold uppercase tracking-widest ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>
                    Select Amount
                  </label>
                  
                  {/* Currency selector toggle */}
                  <div className="flex rounded-md p-0.5 bg-zinc-100 dark:bg-zinc-900 text-[9px] font-bold">
                    <button 
                      onClick={() => {
                        setCurrency('USD');
                        selectQuickValue(50, false);
                      }}
                      className={`px-2 py-0.5 rounded transition-all ${currency === 'USD' ? 'bg-white dark:bg-zinc-800 shadow-sm text-amber-500' : 'text-zinc-400'}`}
                    >
                      USD ($)
                    </button>
                    <button 
                      onClick={() => {
                        setCurrency('INR');
                        selectQuickValue(1000, true);
                      }}
                      className={`px-2 py-0.5 rounded transition-all ${currency === 'INR' ? 'bg-white dark:bg-zinc-800 shadow-sm text-amber-500' : 'text-zinc-400'}`}
                    >
                      INR (₹)
                    </button>
                  </div>
                </div>

                {/* Custom input with icon */}
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-bold opacity-40">
                    {currency === 'INR' ? '₹' : '$'}
                  </span>
                  <input 
                    type="number"
                    value={customInputVal}
                    onChange={(e) => handleCustomInputChange(e.target.value)}
                    placeholder="Enter amount..."
                    className={`w-full py-3.5 pl-9 pr-4 rounded-xl border outline-none font-bold text-sm ${
                      isDark 
                        ? 'bg-zinc-900 border-zinc-800 text-white focus:ring-1 focus:ring-amber-500/50' 
                        : 'bg-zinc-50 border-zinc-200 focus:ring-1 focus:ring-amber-550/50'
                    }`}
                  />
                </div>

                {/* Selection chips with dynamic transitions */}
                <div className="grid grid-cols-5 gap-1.5 pt-1">
                  {(currency === 'INR' ? quickChipsINR : quickChipsUSD).map((val, idx) => {
                    const isSelected = currency === 'INR' 
                      ? Math.round(selectedAmount * 80) === val 
                      : selectedAmount === val;
                    return (
                      <button
                        key={idx}
                        onClick={() => {
                          setSelectedAmount(currency === 'INR' ? val / 80 : val);
                          setCustomInputVal(val.toString());
                        }}
                        className={`py-2 rounded-lg text-[10px] font-bold font-mono transition-all ${
                          isSelected
                            ? 'bg-amber-500 border border-amber-500 text-white'
                            : isDark
                            ? 'bg-zinc-900 border border-zinc-805 hover:border-zinc-700 text-zinc-400'
                            : 'bg-zinc-50 border border-zinc-200 hover:border-zinc-350 text-zinc-700'
                        }`}
                      >
                        {currency === 'INR' ? '₹' : '$'}{val}
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              /* Quantities increment block if fixed-price key license */
              <div className="space-y-3">
                <div className="flex justify-between items-center px-1">
                  <label className={`text-[10px] font-mono font-bold uppercase tracking-widest ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>
                    Active License Key Price
                  </label>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-green-500 flex items-center gap-1">
                    ● IN STOCK
                  </span>
                </div>
                <div className={`flex justify-between items-center p-4 rounded-xl border ${isDark ? 'bg-zinc-900/60 border-zinc-900' : 'bg-zinc-50 border-zinc-200'}`}>
                  <span className="text-xl font-display font-black">{formatCurrency(defaultAmount)}</span>
                  <div className="flex items-center gap-3">
                    <button 
                      disabled={quantity <= 1}
                      onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                      className="w-8 h-8 rounded-lg bg-white dark:bg-zinc-800 flex items-center justify-center font-bold active:scale-90 border dark:border-zinc-700 transition"
                    >
                      <Minus className="w-3" />
                    </button>
                    <span className="font-bold text-sm w-4 text-center">{quantity}</span>
                    <button 
                      onClick={() => setQuantity(prev => prev + 1)}
                      className="w-8 h-8 rounded-lg bg-white dark:bg-zinc-800 flex items-center justify-center font-bold active:scale-90 border dark:border-zinc-700 transition"
                    >
                      <Plus className="w-3" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Price Order Summary */}
            <div className={`pt-5 border-t space-y-3 text-xs ${isDark ? 'border-zinc-900 text-zinc-400' : 'border-stone-200 text-zinc-600'}`}>
              <div className="flex justify-between">
                <span>Unit Price</span>
                <span className="font-mono">{formatCurrency(selectedAmount / (1 - discountRate))}</span>
              </div>
              <div className={`flex justify-between font-medium ${isDark ? 'text-amber-500' : 'text-zinc-500'}`}>
                <span>Voucher Discount ({card.discount}%)</span>
                <span className="font-mono">-{formatCurrency(discountAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span>Direct Fee</span>
                <span className={`font-bold uppercase ${isDark ? 'text-emerald-500' : 'text-zinc-950 font-black'}`}>FREE</span>
              </div>
              <div className={`pt-3 border-t text-sm font-bold flex justify-between items-end ${isDark ? 'border-zinc-900/60 text-white' : 'border-stone-150 text-zinc-900'}`}>
                <span>Total Due</span>
                <span className={`text-xl font-display font-black font-mono ${isDark ? 'text-amber-500' : 'text-zinc-950'}`}>
                  {formatCurrency(finalPriceCalculated)}
                </span>
              </div>
            </div>

            {/* Buying Action buttons */}
            <div className="space-y-3">
              <button 
                onClick={() => onBuy(finalPriceCalculated)}
                className={`w-full py-4.5 rounded-xl font-bold font-mono tracking-widest uppercase hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 ${
                  isDark ? 'bg-white text-zinc-950 hover:bg-zinc-100' : 'bg-black text-white hover:bg-zinc-900'
                }`}
              >
                Buy Now <ArrowLeft className="w-4 h-4 rotate-180" />
              </button>
              <button 
                onClick={() => {
                  if (onAddToCart) {
                    onAddToCart(card, quantity);
                  } else {
                    alert('Added to digital card. (Simulation)');
                  }
                }}
                className={`w-full py-3.5 rounded-xl text-xs font-bold font-mono uppercase transition-colors border ${
                  isDark 
                    ? 'hover:bg-zinc-900 border-zinc-800 text-zinc-300' 
                    : 'hover:bg-zinc-50 border-zinc-200 text-zinc-700'
                }`}
              >
                Add to Cart
              </button>
            </div>

            {/* Trust Factors Indicator list */}
            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-stone-200 dark:border-zinc-900/60">
              <div className="text-left space-y-0.5">
                <span className="text-[9px] font-mono font-bold block">🚀 DELIVERY</span>
                <p className={`text-[10px] ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>Authentic mail inbox ping inside 5s</p>
              </div>
              <div className="text-left space-y-0.5">
                <span className="text-[9px] font-mono font-bold block">🔒 PAYMENT</span>
                <p className={`text-[10px] ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>SSL keys with merchant encryption</p>
              </div>
            </div>

          </div>

          {/* Secure details logo strip */}
          <div className="flex justify-center items-center gap-6 opacity-30 select-none pointer-events-none py-1">
            <CreditCard className="w-5" />
            <span className="font-mono text-[9px] font-black tracking-widest">VISA</span>
            <span className="font-mono text-[9px] font-black tracking-widest">MASTERCARD</span>
            <Lock className="w-4" />
            <span className="font-mono text-[9px] font-black tracking-widest">AES-256</span>
          </div>

        </div>

      </div>

      {/* Interactive Write Review Modal */}
      <AnimatePresence>
        {isWriteReviewOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/40 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className={`w-full max-w-sm p-6 rounded-3xl border shadow-2xl ${
                isDark 
                  ? 'bg-zinc-900 border-zinc-800 text-white shadow-black/80' 
                  : 'bg-white border-stone-100 text-zinc-950 shadow-zinc-200/50'
              }`}
            >
              <div className="flex justify-between items-center mb-5">
                <h3 className="font-display font-black text-xs uppercase tracking-wider font-mono text-zinc-950 dark:text-white">
                  Submit Customer Review
                </h3>
                <button
                  type="button"
                  onClick={() => setIsWriteReviewOpen(false)}
                  className={`p-1.5 rounded-lg transition-colors ${
                    isDark ? 'hover:bg-zinc-800 text-zinc-400 hover:text-white' : 'hover:bg-zinc-100 text-stone-500 hover:text-black'
                  }`}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSubmitReview} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-poppins font-bold uppercase tracking-widest text-zinc-500 mb-1.5">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    value={newAuthor}
                    onChange={(e) => setNewAuthor(e.target.value)}
                    placeholder="e.g. John Doe"
                    className={`w-full px-4 py-2.5 rounded-xl border text-xs font-poppins outline-none font-medium transition-all ${
                      isDark 
                        ? 'bg-zinc-950 border-zinc-800 focus:border-zinc-700 text-white' 
                        : 'bg-zinc-50 border-stone-100 focus:border-zinc-300 text-zinc-950'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-poppins font-bold uppercase tracking-widest text-zinc-500 mb-1.5">
                    Rating Status
                  </label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((starVal) => (
                      <button
                        key={starVal}
                        type="button"
                        onClick={() => setNewRating(starVal)}
                        className="transition-transform active:scale-90 hover:scale-115"
                      >
                        <Star
                          className={`w-5 h-5 ${
                            starVal <= newRating
                              ? isDark ? 'text-amber-500 fill-amber-500' : 'text-zinc-950 fill-zinc-950'
                              : 'text-zinc-300 dark:text-zinc-800'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-poppins font-bold uppercase tracking-widest text-zinc-500 mb-1.5">
                    Item Category
                  </label>
                  <input
                    type="text"
                    required
                    value={newProduct}
                    onChange={(e) => setNewProduct(e.target.value)}
                    className={`w-full px-4 py-2.5 rounded-xl border text-xs font-poppins outline-none font-medium transition-all ${
                      isDark 
                        ? 'bg-zinc-950 border-zinc-800 focus:border-zinc-700 text-white' 
                        : 'bg-zinc-50 border-stone-100 focus:border-zinc-300 text-zinc-950'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-poppins font-bold uppercase tracking-widest text-zinc-500 mb-1.5">
                    Written Feedback
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                    placeholder="Describe your digital checkout and activation experience..."
                    className={`w-full px-4 py-2.5 rounded-xl border text-xs font-poppins outline-none font-medium transition-all resize-none ${
                      isDark 
                        ? 'bg-zinc-950 border-zinc-800 focus:border-zinc-700 text-white' 
                        : 'bg-zinc-50 border-stone-100 focus:border-zinc-300 text-zinc-950'
                    }`}
                  />
                </div>

                <div className="pt-2 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setIsWriteReviewOpen(false)}
                    className={`flex-1 py-3 text-xs font-poppins font-bold uppercase rounded-xl transition-all border ${
                      isDark 
                        ? 'border-zinc-800 hover:bg-zinc-800 text-zinc-450' 
                        : 'border-stone-100 hover:bg-stone-50 text-zinc-500'
                    }`}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className={`flex-1 py-3 text-xs font-poppins font-bold uppercase rounded-xl transition-all ${
                      isDark
                        ? 'bg-white hover:bg-zinc-100 text-zinc-955'
                        : 'bg-zinc-950 hover:bg-black text-white'
                    }`}
                  >
                    Submit
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </motion.div>
  );
};
