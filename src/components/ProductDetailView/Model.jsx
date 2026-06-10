import React, { useState } from 'react'
import { AnimatePresence,motion } from 'motion/react';
import { Star, X } from 'lucide-react';
const Model = ({isWriteReviewOpen,setIsWriteReviewOpen,setForm,Form}) => {

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


  return (
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
        className="w-full max-w-sm p-6 rounded-3xl border shadow-2xl bg-white border-stone-100 text-zinc-950 shadow-zinc-200/50 dark:bg-zinc-900 dark:border-zinc-800 dark:text-white dark:shadow-black/80"
      >
        <div className="flex justify-between items-center mb-5">
          <h3 className="font-display font-black text-xs uppercase tracking-wider font-mono text-zinc-950 dark:text-white">
            Submit Customer Review
          </h3>

          <button
            type="button"
            onClick={() => setIsWriteReviewOpen(false)}
            className="p-1.5 rounded-lg transition-colors hover:bg-zinc-100 text-stone-500 hover:text-black dark:hover:bg-zinc-800 dark:text-zinc-400 dark:hover:text-white"
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
              name='author'
              value={Form?.author}
              onChange={(e) => setForm((prev)=>({...prev,[e.target.name] : e.target.value }))}
              placeholder="e.g. John Doe"
              className="w-full px-4 py-2.5 rounded-xl border text-xs font-poppins outline-none font-medium transition-all bg-zinc-50 border-stone-100 focus:border-zinc-300 text-zinc-950 dark:bg-zinc-950 dark:border-zinc-800 dark:focus:border-zinc-700 dark:text-white"
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
                  name='rating'
                  onClick={(e) => setForm((prev)=>({...prev,[e.target.name] : starVal}))}
                  className="transition-transForm active:scale-90 hover:scale-115"
                >
                  <Star
                    className={`w-5 h-5 ${
                      starVal <= Form?.rating
                        ? "text-zinc-950 fill-zinc-950 dark:text-amber-500 dark:fill-amber-500"
                        : "text-zinc-300 dark:text-zinc-800"
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
              name='product'
              value={Form?.product}
              onChange={(e) => setForm((prev)=>({...prev,[e.target.name] : e.target.value }))}
              className="w-full px-4 py-2.5 rounded-xl border text-xs font-poppins outline-none font-medium transition-all bg-zinc-50 border-stone-100 focus:border-zinc-300 text-zinc-950 dark:bg-zinc-950 dark:border-zinc-800 dark:focus:border-zinc-700 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-[10px] font-poppins font-bold uppercase tracking-widest text-zinc-500 mb-1.5">
              Written Feedback
            </label>

            <textarea
              required
              rows={3}
              name='content'
              value={Form?.content}
              onChange={(e) => setForm((prev)=>({...prev,[e.target.name] : e.target.value }))}
              placeholder="Describe your digital checkout and activation experience..."
              className="w-full px-4 py-2.5 rounded-xl border text-xs font-poppins outline-none font-medium transition-all resize-none bg-zinc-50 border-stone-100 focus:border-zinc-300 text-zinc-950 dark:bg-zinc-950 dark:border-zinc-800 dark:focus:border-zinc-700 dark:text-white"
            />
          </div>

          <div className="pt-2 flex gap-3">
            <button
              type="button"
              onClick={() => setIsWriteReviewOpen(false)}
              className="flex-1 py-3 text-xs font-poppins font-bold uppercase rounded-xl transition-all border border-stone-100 hover:bg-stone-50 text-zinc-500 dark:border-zinc-800 dark:hover:bg-zinc-800 dark:text-zinc-400"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="flex-1 py-3 text-xs font-poppins font-bold uppercase rounded-xl transition-all bg-zinc-950 hover:bg-black text-white dark:bg-white dark:hover:bg-zinc-100 dark:text-zinc-950"
            >
              Submit
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>
  )
}

export default Model
