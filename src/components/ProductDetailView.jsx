import React, { useState, useEffect, useRef, useContext } from "react";
import { motion, AnimatePresence } from "motion/react";
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
  MessageSquare,
} from "lucide-react";
import { GiftCardItem } from "./GiftCardItem";
import { X } from "lucide-react";
import { Link, useParams,useNavigate } from "react-router-dom";
import { reviews } from "@/Utility/Constants";
import { Theme } from "@/Utility/ThemeContext";
import ReviewCard from "./ProductDetailView/ReviewCard";
import AccordionList from "./ProductDetailView/AccordionList";
import Header from "./ProductDetailView/Header";
import useApi from "../lib/useFetch";
import { Auth } from "@/Utility/AuthContext";

 const ProductDetailView = ({
}) => {
  const {id} = useParams();
    const api = useApi();
    const navigate = useNavigate()
    const {user,setUser} = useContext(Auth)
     const [loading, setLoading] = useState(true);
    const [item,setItem] = useState(null);
      useEffect(()=>{
        const GetItem = async() =>{
          const data = await api.product.item(id);
          setItem(data ?? []);
          setLoading(false);  
        }
        GetItem();
        
      },[id]);
       const addCart = async()=>{
        if(!user) return navigate("/auth/login")
    const data = await api.cart.add(JSON.stringify({itemId : id}));
    setUser((prev)=>({...prev,cart : data?.cart ?? prev.cart}));
  }
  const card = item?.product;
  // Determine if it is a customisable-value digital product vs fixed-price key
  const isGiftCardCategory = false;
    // card?.category.toLowerCase().includes("card") ||
    // card?.brand.toLowerCase().includes("card") ||
    // card?.brand.toLowerCase().includes("voucher");

  // Base values
  const defaultAmount = card?.finalPrice ?? 0;
  const discountRate = card?.discount ?? 0 / 100;

  // Selected state
  const [currency, setCurrency] = useState("USD");

  const [selectedAmount, setSelectedAmount] = useState(defaultAmount);
  const [customInputVal, setCustomInputVal] = useState();
  const [quantity, setQuantity] = useState(1);
  const [activeChip, setActiveChip] = useState(null);

  // Accordion active state


  // Carousel ref
  const carouselRef = useRef(null);

  // Scroll to top on card change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setSelectedAmount(card?.finalPrice ?? "");
    setCustomInputVal(card?.finalPrice?.toString() ?? "");
    setQuantity(1);
    setActiveChip(null);
  }, [card]);

  // Update selection amount and chip logic
  const selectQuickValue = (val, isINR) => {
    if (isINR) {
      setCurrency("INR");
      // Convert standard INR to USD base for simulation (e.g. 1 USD = 80 INR for show)
      const convertedToUSD = Math.round((val / 80) * 100) / 100;
      setSelectedAmount(convertedToUSD);
      setCustomInputVal(val.toString());
    } else {
      setCurrency("USD");
      setSelectedAmount(val);
      setCustomInputVal(val.toString());
    }
  };

  const handleCustomInputChange = (val) => {
    setCustomInputVal(val);
    const num = parseFloat(val);
    if (!isNaN(num) && num > 0) {
      if (currency === "INR") {
        const usdBase = Math.round((num / 80) * 100) / 100;
        setSelectedAmount(usdBase);
      } else {
        setSelectedAmount(num);
      }
      setActiveChip(null);
    }
  };

 

  // Pricing calculations
  const originalPriceCalculated = selectedAmount / (1 - discountRate);
  const finalPriceCalculated = selectedAmount * quantity;
  const discountAmount = (originalPriceCalculated - selectedAmount) * quantity;
  const originalTotal = originalPriceCalculated * quantity;

  // Render prices formatted nicely
  const formatCurrency = (amountInUSD) => {
    if(!amountInUSD) return
    if (currency === "INR") {
      const inINR = amountInUSD * 80;
      return `₹${inINR.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 1 })}`;
    }
    return `$${amountInUSD?.toFixed(2)}`;
  };

  // Reviews state with fully interactive dynamic appending
  const [reviewsList, setReviewsList] = useState(reviews);

  const [activeReviewIndex, setActiveReviewIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  // Submit Review state

  const [newAuthor, setNewAuthor] = useState("");
  const [newRating, setNewRating] = useState(5);
  const [newContent, setNewContent] = useState("");
  const [newProduct, setNewProduct] = useState(card?.brand ?? "");

  const handleSubmitReview = (e) => {
    e.preventDefault();
    if (!newAuthor.trim() || !newContent.trim()) return;

    const newRev = {
      id: Date.now(),
      author: newAuthor,
      rating: newRating,
      date: "Purchased Just Now",
      badge: "Verified Purchase",
      product: newProduct,
      delivery: "Delivered in 3 Seconds",
      flag: "🌐",
      country: "Verified User",
      content: newContent,
    };

    setReviewsList((prev) => [newRev, ...prev]);
    setIsWriteReviewOpen(false);
    setNewAuthor("");
    setNewRating(5);
    setNewContent("");
  };

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const getDiff = (index) => {
    let diff = index - activeReviewIndex;
    const len = reviewsList.length;
    if (diff < -len / 2) diff += len;
    if (diff > len / 2) diff -= len;
    return diff;
  };

  const getCardStyles = (idx) => {
    const diff = getDiff(idx);

    if (diff === 0) {
      return {
        x: 0,
        scale: 1.08,
        rotate: 0,
        opacity: 1,
        zIndex: 40,
        pointerEvents: "auto",
      };
    } else if (diff === -1) {
      return {
        x: isMobile ? -50 : -200,
        scale: 0.9,
        rotate: -8,
        opacity: 0.45,
        zIndex: 20,
        pointerEvents: "none",
      };
    } else if (diff === 1) {
      return {
        x: isMobile ? 50 : 200,
        scale: 0.9,
        rotate: 8,
        opacity: 0.45,
        zIndex: 20,
        pointerEvents: "none",
      };
    } else {
      return {
        x: diff < 0 ? (isMobile ? -140 : -350) : isMobile ? 140 : 350,
        scale: 0.8,
        rotate: 0,
        opacity: 0,
        zIndex: 10,
        pointerEvents: "none",
      };
    }
  };

  const handleNext = () => {
    setActiveReviewIndex((prev) => (prev + 1) % reviewsList.length);
  };

  const handlePrev = () => {
    setActiveReviewIndex(
      (prev) => (prev - 1 + reviewsList.length) % reviewsList.length,
    );
  };

  const handleDragEnd = (event, info) => {
    const threshold = 50;
    if (info.offset.x < -threshold) {
      handleNext();
    } else if (info.offset.x > threshold) {
      handlePrev();
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowLeft") {
        handlePrev();
      } else if (e.key === "ArrowRight") {
        handleNext();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeReviewIndex, reviewsList]);

  // Quick Amount chips depending on currency mode
  const quickChipsUSD = [10, 25, 50, 100, 200];
  const quickChipsINR = [500, 1000, 2000, 5000, 10000];

  // Horizontal scroll controls
  const scrollCarousel = (direction) => {
    if (carouselRef.current) {
      const { scrollLeft, clientWidth } = carouselRef.current;
      const scrollTo =
        direction === "left" ? scrollLeft - 300 : scrollLeft + 300;
      carouselRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
    }
  };

  // Get related items
  const relatedCards = item?.relatedProducts
    ?.filter(
      (c) =>
        c.id !== card.id &&
        (c.category === card.category || Math.random() > 0.5),
    )
    .slice(0, 6);

 
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <motion.div 
          animate={{ scale: [1, 1.1, 1] }} 
          transition={{ repeat: Infinity, duration: 2 }}
          className="text-4xl font-display font-bold tracking-tighter"
        >
          AURA
        </motion.div>
      </div>
    );
  }
  if (!card) {
  return <p>Product not found</p>;
}
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full max-w-7xl mx-auto text-zinc-900 dark:text-zinc-100"
    >
      {/* Top Breadcrumb & Navbar Actions */}
      
<Header card={card}/>
      {/* Main Two-Column Structure */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Column (65%) */}
        <div className="lg:col-span-8 space-y-12 text-left">
          {/* Product Header Block */}
          <div className="space-y-6">
            <div className="flex flex-wrap gap-2.5 items-center">
              <span
                className="px-3 py-1 rounded-full text-[10px] font-mono font-bold tracking-widest uppercase border bg-stone-100 text-stone-700 border-stone-200 dark:bg-zinc-950 dark:text-zinc-300 dark:border-zinc-805"
              >
                {card?.category}
              </span>
              <span
                className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono font-bold tracking-widest uppercase border bg-zinc-100 border-zinc-200 text-zinc-950 font-black dark:bg-amber-500/5 dark:border-amber-500/30 dark:text-amber-500"
              >
                <Zap className="w-3" /> INSTANT DELIVERY
              </span>
              <span
                className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono font-bold tracking-widest uppercase border bg-stone-100/40 border-stone-200 text-stone-600 dark:bg-zinc-900/60 dark:border-zinc-805 dark:text-zinc-400"
              >
                <ShieldCheck className="w-3" /> SECURE CHECKOUT
              </span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-display font-black tracking-tighter uppercase leading-none max-w-3xl">
              {card?.brand}
            </h1>

            <p
              className="text-base sm:text-lg leading-relaxed max-w-xl font-normal text-zinc-500 font-sans dark:text-zinc-400"
            >
              {card?.description}
            </p>
          </div>

          {/* Accordion List */}
         
         <AccordionList/>

          {/* Customer Reviews Session (Modern 3D Stacked Testimonial Carousel) */}
         <ReviewCard reviewsList={reviewsList} card={card}/>
          {/* Related Products Section */}
          <div className="space-y-6 pt-6">
            <div className="flex items-center justify-between border-b pb-4 border-zinc-200/60 dark:border-zinc-800/40">
              <div className="space-y-0.5">
                <h3 className="text-lg font-display font-bold uppercase font-mono tracking-widest flex items-center gap-2.5">
                  <Sparkles className="w-4 h-4 text-amber-500" /> You May Also
                  Like
                </h3>
                <p
                  className="text-xs text-zinc-400 dark:text-zinc-500"
                >
                  Expand your digital assets library with related licenses.
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => scrollCarousel("left")}
                  className={`p-2 rounded-xl border transition-colors dark:bg-zinc-900 dark:border-zinc-800 dark:hover:bg-zinc-800 bg-white border-zinc-200 hover:bg-zinc-50
                  `}
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => scrollCarousel("right")}
                  className={`p-2 rounded-xl border transition-colors dark:bg-zinc-900 dark:border-zinc-800 dark:hover:bg-zinc-800 bg-white border-zinc-200 hover:bg-zinc-50`}
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
              {relatedCards?.map((rc) => (
                <div
                  key={rc.id}
                  className="snap-start min-w-[220px] sm:min-w-[245px]"
                >
                  <GiftCardItem
                    card={rc}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Sticky Purchase Panel (35%) */}
        <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-6">
          <div
            className="rounded-3xl border p-6 sm:p-8 space-y-6 transition-all duration-300 bg-white border-zinc-200/85 shadow-2xl shadow-zinc-200/50 dark:bg-zinc-950 dark:border-zinc-900 dark:shadow-xl dark:shadow-black/60"
          >
            {/* Visual Dynamic Card representation with smooth animations */}
            <div className="perspective-1000">
              <motion.div
                whileHover={{ rotateY: 3, rotateX: -3 }}
                className={`aspect-[1.58/1] rounded-2xl w-full p-6 relative overflow-hidden flex flex-col justify-between shadow-lg text-white border select-none ${
                  card.category.toLowerCase().includes("games") ||
                  card.brand.toLowerCase().includes("key")
                    ? "bg-gradient-to-br from-violet-600 via-indigo-700 to-zinc-950 border-violet-500/20"
                    : card.category.toLowerCase().includes("windows")
                      ? "bg-gradient-to-br from-blue-600 via-indigo-600 to-slate-900 border-blue-500/20"
                      : card.category.toLowerCase().includes("subs")
                        ? "bg-gradient-to-br from-rose-600 via-pink-700 to-zinc-900 border-rose-500/20"
                        : "bg-gradient-to-br from-zinc-900 via-zinc-950 to-neutral-800 border-zinc-800"
                }`}
              >
                {/* Embedded Glass Glow reflection */}
                <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/10 pointer-events-none" />

                <div className="flex justify-between items-start z-10">
                  <div className="space-y-0.5">
                    <p className="text-[8px] font-mono font-bold tracking-widest opacity-60 uppercase">
                      4URA DIGITAL KEY
                    </p>
                    <p className="font-display font-black text-xs tracking-tighter max-w-[120px] truncate">
                      {card.brand.split(":")[0]}
                    </p>
                  </div>
                  <Gift className="w-5 h-5 text-white/50" />
                </div>

                <div className="flex justify-between items-end z-10 pt-8">
                  <div className="space-y-1">
                    <p className="text-[7px] font-mono font-black tracking-widest opacity-40 uppercase">
                      ACTIVATION ESTIMATE
                    </p>
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
                  <label
                    className="text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500"
                  >
                    Select Amount
                  </label>

                  {/* Currency selector toggle */}
                  <div className="flex rounded-md p-0.5 bg-zinc-100 dark:bg-zinc-900 text-[9px] font-bold">
                    <button
                      onClick={() => {
                        setCurrency("USD");
                        selectQuickValue(50, false);
                      }}
                      className={`px-2 py-0.5 rounded transition-all ${currency === "USD" ? "bg-white dark:bg-zinc-800 shadow-sm text-amber-500" : "text-zinc-400"}`}
                    >
                      USD ($)
                    </button>
                    <button
                      onClick={() => {
                        setCurrency("INR");
                        selectQuickValue(1000, true);
                      }}
                      className={`px-2 py-0.5 rounded transition-all ${currency === "INR" ? "bg-white dark:bg-zinc-800 shadow-sm text-amber-500" : "text-zinc-400"}`}
                    >
                      INR (₹)
                    </button>
                  </div>
                </div>

                {/* Custom input with icon */}
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-bold opacity-40">
                    {currency === "INR" ? "₹" : "$"}
                  </span>
                  <input
                    type="number"
                    value={customInputVal}
                    onChange={(e) => handleCustomInputChange(e.target.value)}
                    placeholder="Enter amount..."
                    className={`w-full py-3.5 pl-9 pr-4 rounded-xl border outline-none font-bold text-sm bg-zinc-50 border-zinc-200 focus:ring-1 focus:ring-amber-550/50 dark:bg-zinc-900 dark:border-zinc-800 dark:text-white dark:focus:ring-1 dark:focus:ring-amber-500/50`}
                  />
                </div>

                {/* Selection chips with dynamic transitions */}
                <div className="grid grid-cols-5 gap-1.5 pt-1">
                  {(currency === "INR" ? quickChipsINR : quickChipsUSD).map(
                    (val, idx) => {
                      const isSelected =
                        currency === "INR"
                          ? Math.round(selectedAmount * 80) === val
                          : selectedAmount === val;
                      return (
                        <button
                          key={idx}
                          onClick={() => {
                            setSelectedAmount(
                              currency === "INR" ? val / 80 : val,
                            );
                            setCustomInputVal(val.toString());
                          }}
                          className={`py-2 rounded-lg text-[10px] font-bold font-mono transition-all ${
                            isSelected
                              ? "bg-amber-500 border border-amber-500 text-white"
                              : "bg-zinc-50 border border-zinc-200 hover:border-zinc-350 text-zinc-700 dark:bg-zinc-900 dark:border-zinc-805 dark:hover:border-zinc-700 dark:text-zinc-400"
                          }`}
                        >
                          {currency === "INR" ? "₹" : "$"}
                          {val}
                        </button>
                      );
                    },
                  )}
                </div>
              </div>
            ) : (
              /* Quantities increment block if fixed-price key license */
              <div className="space-y-3">
                <div className="flex justify-between items-center px-1">
                  <label
                    className="text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500"
                  >
                    Active License Key Price
                  </label>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-green-500 flex items-center gap-1">
                    ● IN STOCK
                  </span>
                </div>
                <div
                  className={`flex justify-between items-center p-4 rounded-xl border bg-zinc-50 border-zinc-200 dark:bg-zinc-900/60 dark:border-zinc-900`}
                >
                  <span className="text-xl font-display font-black">
                    {formatCurrency(defaultAmount)}
                  </span>
                  <div className="flex items-center gap-3">
                    <button
                      disabled={quantity <= 1}
                      onClick={() =>
                        setQuantity((prev) => Math.max(1, prev - 1))
                      }
                      className="w-8 h-8 rounded-lg bg-white dark:bg-zinc-800 flex items-center justify-center font-bold active:scale-90 border dark:border-zinc-700 transition"
                    >
                      <Minus className="w-3" />
                    </button>
                    <span className="font-bold text-sm w-4 text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity((prev) => prev + 1)}
                      className="w-8 h-8 rounded-lg bg-white dark:bg-zinc-800 flex items-center justify-center font-bold active:scale-90 border dark:border-zinc-700 transition"
                    >
                      <Plus className="w-3" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Price Order Summary */}
            <div
              className="pt-5 border-t space-y-3 text-xs border-stone-200 text-zinc-600 dark:border-zinc-900 dark:text-zinc-400"
            >
              <div className="flex justify-between">
                <span>Unit Price</span>
                <span className="font-mono">
                  {formatCurrency(selectedAmount / (1 - discountRate))}
                </span>
              </div>
              <div
                className={`flex justify-between font-medium text-zinc-500 dark:text-amber-500`}
              >
                <span>Voucher Discount ({card.discount}%)</span>
                <span className="font-mono">
                  -{formatCurrency(discountAmount)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Direct Fee</span>
                <span
                  className={`font-bold uppercase text-zinc-950 font-black dark:text-emerald-500`}
                >
                  FREE
                </span>
              </div>
              <div
                className={`pt-3 border-t text-sm font-bold flex justify-between items-end border-stone-150 text-zinc-900 dark:border-zinc-900/60 dark:text-white`}
              >
                <span>Total Due</span>
                <span
                  className={`text-xl font-display font-black font-mono text-zinc-950 dark:text-amber-500`}
                >
                  {formatCurrency(finalPriceCalculated)}
                </span>
              </div>
            </div>

            {/* Buying Action buttons */}
            <div className="space-y-3">
              <Link to={"/cart"}>

              <button
                className={`w-full py-4.5 rounded-xl font-bold font-mono tracking-widest uppercase hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-100 bg-black text-white hover:bg-zinc-900`}
              >
                Buy Now <ArrowLeft className="w-4 h-4 rotate-180" />
              </button>
                            </Link>
              <button
                onClick={() => addCart()}
                className={`w-full py-3.5 rounded-xl text-xs font-bold font-mono uppercase transition-colors border hover:bg-zinc-50 border-zinc-200 text-zinc-700 dark:hover:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-300`}
              >
                Add to Cart
              </button>
            </div>

            {/* Trust Factors Indicator list */}
            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-stone-200 dark:border-zinc-900/60">
              <div className="text-left space-y-0.5">
                <span className="text-[9px] font-mono font-bold block">
                  🚀 DELIVERY
                </span>
                <p
                  className={`text-[10px] text-zinc-400 dark:text-zinc-500`}
                >
                  Authentic mail inbox ping inside 5s
                </p>
              </div>
              <div className="text-left space-y-0.5">
                <span className="text-[9px] font-mono font-bold block">
                  🔒 PAYMENT
                </span>
                <p
                  className={`text-[10px] text-zinc-400 dark:text-zinc-500`}
                >
                  SSL keys with merchant encryption
                </p>
              </div>
            </div>
          </div>

          {/* Secure details logo strip */}
          <div className="flex justify-center items-center gap-6 opacity-30 select-none pointer-events-none py-1">
            <CreditCard className="w-5" />
            <span className="font-mono text-[9px] font-black tracking-widest">
              VISA
            </span>
            <span className="font-mono text-[9px] font-black tracking-widest">
              MASTERCARD
            </span>
            <Lock className="w-4" />
            <span className="font-mono text-[9px] font-black tracking-widest">
              AES-256
            </span>
          </div>
        </div>
      </div>

      {/* Interactive Write Review Modal */}
  
    </motion.div>
  );
};
export default ProductDetailView;