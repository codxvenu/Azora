import React, { useEffect, useState } from 'react'

import {
  ArrowLeft,
  Star,
  CheckCircle2,
  Zap
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import Model from './Model';

const ReviewCard = ({reviewsList,card}) => {

  const [isWriteReviewOpen, setIsWriteReviewOpen] = useState(false);
    const [activeReviewIndex, setActiveReviewIndex] = useState(0);
      const [isMobile, setIsMobile] = useState(false);
      const [Form, setForm] = useState({
        product : card?.category
      });

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
    

  return (
    <div className="space-y-8 pt-6">
            
   
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
                             damping: 26,
                           }}
                           drag={isActive ? "x" : false}
                           dragConstraints={{ left: 0, right: 0 }}
                           dragElastic={0.4}
                           onDragEnd={handleDragEnd}
                           className={`absolute w-full h-full p-6 sm:p-7 rounded-3xl border text-left flex flex-col justify-between transition-shadow duration-300 ${
  isActive
    ? "bg-white/95 border-amber-200/80 shadow-[0_20px_50px_rgba(245,158,11,0.15),_0_0_40px_-5px_rgba(245,158,11,0.06)] backdrop-blur-xl dark:bg-zinc-950/90 dark:border-zinc-800 dark:shadow-[0_25px_60px_-15px_rgba(245,158,11,0.25),_0_0_50px_-12px_rgba(245,158,11,0.1)]"
    : "bg-stone-50 border-stone-200/40 backdrop-blur-sm shadow-sm dark:bg-zinc-900/60 dark:border-zinc-900/80 dark:shadow-md"
}`}
                         >
                           {idx === 0 ? (
                             /* First Card (idx === 0): Dedicated Review Analytics Card */
                             <div
                               className={`flex flex-col justify-between h-full w-full ${isActive ? "opacity-100" : "opacity-65"}`}
                             >
                               {/* Customer Reviews subhead */}
                               <div className="flex justify-between items-center">
                                 <h4 className="text-zinc-950 dark:text-zinc-50 font-display font-black text-xs uppercase tracking-widest flex items-center gap-2">
                                   {/* <MessageSquare className="w-3.5 h-3.5 text-amber-500 shrink-0" /> */}
                                   Rating Report
                                 </h4>
                                 {/* <span className="text-[9px] text-amber-500 font-mono font-bold tracking-wider px-1.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">
                                   LIVE STATS
                                 </span> */}
                               </div>
   
                               {/* Overall Rating & Count */}
                               <div className='flex justify-between items-center'>
                               <div className="space-y-0.5 mt-2">
                                 <div className="flex items-center gap-2">
                                   <div className="flex text-amber-500 scale-90 origin-left">
                                     <Star className="w-3 h-3 fill-amber-500" />
                                     <Star className="w-3 h-3 fill-amber-500" />
                                     <Star className="w-3 h-3 fill-amber-500" />
                                     <Star className="w-3 h-3 fill-amber-500" />
                                     <Star className="w-3 h-3 fill-amber-500" />
                                   </div>
                                   <span className="font-mono text-xs font-black text-zinc-950 dark:text-zinc-50">
                                     4.9 out of 5
                                   </span>
                                 </div>
                                 <p
                                   className={`text-[10px] font-mono leading-none text-stone-400 dark:text-zinc-500`}
                                 >
                                   From 12,847 verified purchases
                                 </p>
                               </div>
                              {/* <span className="!text-xs text-gray-400">Submit a Review</span>   */}
                               </div>
   
                               {/* Star Rating Distribution Vertical Chart (growing bottom to top) */}
                               <div className="flex items-end justify-between gap-1 py-1.5 mt-2 flex-grow">
                                 {[
                                   { stars: 5, pct: 92 },
                                   { stars: 4, pct: 5 },
                                   { stars: 3, pct: 2 },
                                   { stars: 2, pct: 1 },
                                   { stars: 1, pct: 0 },
                                 ].map((row) => (
                                   <div
                                     key={row.stars}
                                     className="flex flex-col items-center gap-1 flex-1"
                                   >
                                     {/* Percentage label */}
                                     <span className="text-[9px] font-mono font-bold text-amber-500">
                                       {row.pct}%
                                     </span>
   
                                     {/* Vertical Bar Container */}
                                     <div className="!w-10 sm:w-4 h-32! sm:h-20 rounded-full bg-zinc-100 dark:bg-zinc-900 overflow-hidden relative flex items-end border border-zinc-200/50 dark:border-zinc-800/40">
                                       <motion.div
                                         initial={{ height: 0 }}
                                         animate={{ height: `${row.pct}%` }}
                                         transition={{
                                           duration: 1,
                                           ease: "easeOut",
                                         }}
                                         className="w-full rounded-full bg-gradient-to-t from-amber-500 to-amber-400"
                                       />
                                     </div>
   
                                     {/* Star level label */}
                                     <span className="text-[9px] font-mono text-zinc-500 dark:text-zinc-400 font-bold">
                                       {row.stars}★
                                     </span>
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
                             <div
                               className={`flex flex-col justify-between h-full w-full ${isActive ? "opacity-100" : "opacity-60"}`}
                             >
                               {/* Rating Stars and badges */}
                               <div className="space-y-3">
                                 <div className="flex items-center justify-between">
                                   <div className="flex gap-0.5 text-amber-500">
                                     {[...Array(review.rating)].map((_, i) => (
                                       <Star key={i} className="w-3" />
                                     ))}
                                   </div>
                                   <span className="text-[10px] font-mono opacity-50">
                                     {review.date}
                                   </span>
                                 </div>
   
                                 {/* Product & Time badges */}
                                 <div className="flex flex-wrap gap-1.5 items-center">
                                   <span
                                     className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold tracking-wider uppercase border whitespace-nowrap overflow-hidden text-ellipsis max-w-[120px] 
                                       
                                         dark:bg-zinc-950 dark:text-zinc-300 dark:border-zinc-800bg-stone-100 text-stone-700 border-stone-200
                                     }`}
                                   >
                                     {review.product}
                                   </span>
                                   <span className="flex items-center gap-1 px-2 py-0.5 rounded text-[9px] font-mono font-bold text-amber-500 bg-amber-500/5 border border-amber-500/20">
                                     <Zap className="w-2.5 h-2.5" /> 5-10s
                                   </span>
                                   <span className="flex items-center gap-1 px-2 py-0.5 rounded text-[9px] font-mono font-bold text-emerald-500 bg-emerald-500/5 border border-emerald-500/20">
                                     <CheckCircle2 className="w-2.5 h-2.5" />{" "}
                                     Verified
                                   </span>
                                 </div>
   
                                 {/* Review Content text */}
                                 <p
                                   className={`text-xs sm:text-xs leading-relaxed text-zinc-700 font-sans dark:text-zinc-350 italic line-clamp-4`}
                                 >
                                   "{review.content}"
                                 </p>
                               </div>
   
                               {/* Customer / Region Metadata */}
                               <div className="flex items-center justify-between pt-3 border-t border-dashed border-zinc-200/10 dark:border-zinc-800">
                                 <div>
                                   <p className="font-bold text-xs">
                                     {review.author}
                                   </p>
                                   <p
                                     className={`text-[10px] font-mono text-stone-400 dark:text-zinc-500`}
                                   >
                                     Verified buyer
                                   </p>
                                 </div>
                                 <div className="flex items-center gap-1.5 shrink-0">
                                   <span
                                     className="text-sm"
                                     role="img"
                                     aria-label={review.country}
                                   >
                                     {review.flag}
                                   </span>
                                   <span
                                     className={`text-[10px] font-mono font-bold tracking-wider uppercase text-stone-500 dark:text-zinc-400`}
                                   >
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
                     className={`p-2.5 rounded-xl border transition-all dark:bg-zinc-900 dark:border-zinc-800 dark:hover:bg-zinc-800 dark:text-white
                         bg-white border-stone-200 hover:bg-stone-50 text-black
                     `}
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
                             ? "w-6 bg-amber-500"
                             : `w-1.5 bg-stone-200 hover:bg-stone-300 dark:bg-zinc-800`
                         }`}
                         title={`Go to Review ${idx + 1}`}
                       />
                     ))}
                   </div>
   
                   <button
                     onClick={handleNext}
                     className={`p-2.5 rounded-xl border transition-all dark:bg-zinc-900 dark:border-zinc-800 dark:hover:bg-zinc-800 dark:text-white bg-white border-stone-200 hover:bg-stone-50 text-black
                     }`}
                     title="Next Review"
                   >
                     <ArrowLeft className="w-4 h-4 rotate-180" />
                   </button>
                 </div>

               </div>
               <Model isWriteReviewOpen={isWriteReviewOpen} setIsWriteReviewOpen={setIsWriteReviewOpen} Form={Form} setForm={setForm}/>
             </div>
  )
}

export default ReviewCard
