import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, ArrowRight, Sun, Moon } from 'lucide-react';

interface Step {
  id: string;
  tag: string;
  title: string;
  desc: string;
  detail: string[];
}

const steps: Step[] = [
  {
    id: "01",
    tag: "DISCOVER",
    title: "Browse the curated exchange",
    desc: "Browse games, gift cards, software keys and gaming top-ups from curated collections.",
    detail: [
      "Access 10,000+ verified active products",
      "Handpicked and custom-authenticated licenses",
      "Updated instantly in real-time"
    ]
  },
  {
    id: "02",
    tag: "TRANSACT",
    title: "Frictionless checkout gateway",
    desc: "Add products to cart and complete checkout using crypto or card payments.",
    detail: [
      "Secured by industry-standard visual escrow",
      "Flexible payment: BTC, USDT, ETH or VISA",
      "Zero hidden fee transparency structure"
    ]
  },
  {
    id: "03",
    tag: "RECEIVE",
    title: "Instant premium delivery",
    desc: "Receive your keys, codes or digital products instantly after payment confirmation.",
    detail: [
      "Average automated delivery below 1.2 seconds",
      "Direct secure deposit to dashboard & email copy",
      "No manual waiting period or validation lag"
    ]
  },
  {
    id: "04",
    tag: "PORTFOLIO",
    title: "Permanent digital vault",
    desc: "Access your purchases anytime from your account dashboard.",
    detail: [
      "Encrypted permanent license cloud storage",
      "One-click swift redemption and code copy",
      "Full digital transaction ledger history"
    ]
  }
];

export const EditorialHowItWorks = ({ isDark = false, onToggleDark }: { isDark?: boolean; onToggleDark?: () => void }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Parallax mouse position hooks
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Handle active slide time rotation
  useEffect(() => {
    if (!isPlaying) {
      setProgress(0);
      return;
    }

    const intervalTime = 60; // Tick every 60ms for smooth progress bar
    const totalDuration = 7000; // 7 seconds per slide
    const increment = (intervalTime / totalDuration) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          nextSlide();
          return 0;
        }
        return prev + increment;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [activeIndex, isPlaying]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const { left, top, width, height } = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - left) / width - 0.5; // range -0.5 to 0.5
    const y = (e.clientY - top) / height - 0.5;
    setMousePos({ x, y });
  };

  const handleMouseLeave = () => {
    setMousePos({ x: 0, y: 0 });
  };

  const nextSlide = () => {
    setProgress(0);
    setActiveIndex((prev) => (prev + 1) % steps.length);
  };

  const prevSlide = () => {
    setProgress(0);
    setActiveIndex((prev) => (prev - 1 + steps.length) % steps.length);
  };

  const selectSlide = (index: number) => {
    setProgress(0);
    setActiveIndex(index);
  };

  // Parallax calc offsets for creative agency feel
  const bgNumberOffset = {
    transform: `translate(${mousePos.x * -40}px, ${mousePos.y * -40}px)`,
    transition: 'transform 0.4s cubic-bezier(0.25, 1, 0.5, 1)',
  };

  const textOffset = {
    transform: `translate(${mousePos.x * 12}px, ${mousePos.y * 12}px)`,
    transition: 'transform 0.4s cubic-bezier(0.25, 1, 0.5, 1)',
  };

  return (
    <section 
      id="how-it-works-editorial"
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative w-full min-h-screen lg:h-screen flex items-center justify-center overflow-hidden font-sans select-none py-12 lg:py-0 transition-all duration-700 ease-in-out ${isDark ? 'bg-[#0a0a0c] text-zinc-100' : 'bg-[#FAF9F6] text-zinc-900'}`}
    >
      {/* Dynamic ambient texture/grain or editorial touch */}
      <div className={`absolute inset-0 pointer-events-none transition-opacity duration-700 ${isDark ? 'opacity-[0.045] bg-[radial-gradient(#fff_1.2px,transparent_1.2px)]' : 'opacity-[0.015] bg-[radial-gradient(#000_1px,transparent_1px)]'} [background-size:16px_16px]`} />

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 relative">
        
        {/* Left Column - Sticky Meta */}
        <div className="lg:col-span-5 flex flex-col justify-between lg:min-h-[450px] z-10">
          <div className="space-y-8 lg:space-y-12">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className={`text-[10px] sm:text-xs font-mono font-semibold tracking-widest uppercase block mb-3 sm:mb-4 transition-colors duration-500 ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>
                  ENGINE DIRECTIVE / PROCESS
                </span>
                <h2 className={`font-display font-bold text-5xl sm:text-7xl tracking-tighter leading-none transition-colors duration-500 ${isDark ? 'text-white' : 'text-zinc-900'}`}>
                  How it works
                </h2>
              </div>

              {/* Luxury Day/Night Toggle Switch */}
              <button 
                onClick={onToggleDark}
                className={`relative p-2 rounded-xl transition-all duration-300 border flex items-center gap-2 group overflow-hidden shrink-0 mt-1 ${
                  isDark 
                    ? 'bg-zinc-900/80 border-zinc-800 text-yellow-400 hover:text-white' 
                    : 'bg-white border-zinc-200 text-zinc-400 hover:text-black hover:border-zinc-400'
                }`}
                title="Toggle visual mode for instructions"
              >
                <div className="relative w-4 h-4 overflow-hidden">
                  <motion.div
                    animate={{ y: isDark ? -18 : 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="absolute inset-0 flex flex-col justify-between h-9"
                  >
                    <Sun className="w-4 h-4 text-amber-500" />
                    <Moon className="w-4 h-4 text-indigo-400" />
                  </motion.div>
                </div>
                <span className={`font-mono text-[9px] tracking-wider uppercase font-bold pr-1 hidden sm:inline transition-colors duration-500 ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
                  {isDark ? 'NIGHT' : 'DAY'}
                </span>
              </button>
            </div>

            <p className={`font-sans text-base sm:text-lg max-w-sm leading-relaxed tracking-normal font-medium transition-colors duration-500 ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
              Purchase digital products in seconds. No waiting, no manual delivery, no complicated checkout process.
            </p>
          </div>

          {/* Luxury Step Navigators (Desktop Sticky Bottom Indicator) */}
          <div className="mt-12 sm:mt-16 lg:mt-0 space-y-6">
            {/* Pagination Grid */}
            <div className="grid grid-cols-4 gap-4 max-w-sm">
              {steps.map((step, idx) => {
                const isActive = activeIndex === idx;
                return (
                  <button
                    key={step.id}
                    onClick={() => selectSlide(idx)}
                    className="group text-left focus:outline-none py-2 transition-colors duration-500"
                  >
                    <div className={`font-mono text-[10px] tracking-widest mb-1 transition-colors duration-500 ${isDark ? 'text-zinc-500 group-hover:text-zinc-300' : 'text-zinc-400 group-hover:text-zinc-600'}`}>
                      {step.id}
                    </div>
                    {/* Linear Step Bar */}
                    <div className={`h-1 rounded-full relative overflow-hidden mt-2 transition-colors duration-500 ${isDark ? 'bg-zinc-900' : 'bg-zinc-100'}`}>
                      {isActive && (
                        <motion.div 
                          className={`absolute inset-y-0 left-0 ${isDark ? 'bg-white' : 'bg-zinc-900'}`}
                          initial={{ width: '0%' }}
                          animate={{ width: isPlaying ? `${progress}%` : '100%' }}
                          transition={isPlaying ? { duration: 0.08, ease: "linear" } : { duration: 0.2 }}
                        />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column - Oversized Active Step Container */}
        <div className="lg:col-span-7 flex flex-col justify-center min-h-[380px] sm:min-h-[450px] relative z-10 lg:pl-10">
          
          {/* Animated Large Step Number Backdrops */}
          <div className="absolute top-0 right-0 sm:right-6 select-none pointer-events-none overflow-hidden h-full w-full flex items-center justify-end z-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                style={bgNumberOffset}
                initial={{ opacity: 0, scale: 0.8, rotate: -4 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                exit={{ opacity: 0, scale: 1.1, rotate: 4 }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                className={`font-display font-extrabold text-[12rem] sm:text-[18rem] md:text-[23rem] tracking-tighter leading-none mb-12 select-none transition-colors duration-500 ${isDark ? 'text-white/[0.025]' : 'text-zinc-900/[0.035]'}`}
              >
                {steps[activeIndex].id}
              </motion.div>
            </AnimatePresence>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              style={textOffset}
              initial={{ opacity: 0, x: 25 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -25 }}
              transition={{ duration: 0.6, ease: [0.215, 0.61, 0.355, 1] }}
              className="space-y-6 sm:space-y-8 z-10"
            >
              {/* Monospace Indicator Tag */}
              <div className="flex items-center gap-3">
                <span className={`font-mono text-[10px] sm:text-xs font-bold border px-2.5 py-0.5 rounded tracking-wider transition-colors duration-500 ${isDark ? 'border-zinc-800 bg-zinc-900 text-white' : 'border-black/10 bg-zinc-100 text-black'}`}>
                  STEP {steps[activeIndex].id}
                </span>
                <span className={`font-mono text-xs tracking-widest uppercase transition-colors duration-500 ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>
                  {steps[activeIndex].tag}
                </span>
              </div>

              {/* Step Display Title */}
              <h3 className={`font-display font-bold text-4xl sm:text-6xl tracking-tight leading-tight transition-colors duration-500 ${isDark ? 'text-white' : 'text-zinc-900'}`}>
                {steps[activeIndex].title}
              </h3>

              {/* Core Description */}
              <p className={`font-sans text-lg sm:text-xl leading-relaxed font-normal max-w-xl transition-colors duration-500 ${isDark ? 'text-zinc-300' : 'text-zinc-600'}`}>
                {steps[activeIndex].desc}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Interaction Arrow Buttons (Right Sticky bottom controls) */}
          <div className="flex items-center gap-4 mt-12 sm:mt-16 z-20">
            <button 
              onClick={prevSlide}
              className={`w-12 h-12 rounded-full border flex items-center justify-center transition-colors ${
                isDark 
                  ? 'border-zinc-800 hover:border-zinc-400 bg-zinc-900 text-white hover:bg-white hover:text-black' 
                  : 'border-zinc-200 hover:border-zinc-800 bg-white hover:bg-zinc-900 hover:text-white'
              }`}
              title="Previous item"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <button 
              onClick={nextSlide}
              className={`w-12 h-12 rounded-full border flex items-center justify-center transition-colors ${
                isDark 
                  ? 'border-zinc-800 hover:border-zinc-400 bg-zinc-900 text-white hover:bg-white hover:text-black' 
                  : 'border-zinc-200 hover:border-zinc-800 bg-white hover:bg-zinc-900 hover:text-white'
              }`}
              title="Next item"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

        </div>

      </div>
    </section>
  );
};
