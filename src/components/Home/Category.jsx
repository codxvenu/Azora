import React from 'react'
import { motion, AnimatePresence } from 'motion/react';
import {Link} from "react-router-dom"
const Category = ({giftCards}) => {
  return (
     <div className="space-y-6 text-left">
                          <div className="flex justify-between items-end">
                            <div>
                              <h2 className="text-3xl font-display font-medium tracking-tight">Explore Categories</h2>
                              <p className={`text-xs dark:text-zinc-500 text-stone-500 mt-1`}>Select a category to locate and purchase electronic licenses and key codes instantly.</p>
                            </div>
                            <button
                              onClick={() => {
                                // setActiveDetailCategory('All');
                                window.scrollTo({ top: 0, behavior: 'instant' });
                              }}
                              className={`text-xs font-mono font-bold uppercase tracking-wider pb-1 transition-all border-b dark:text-zinc-400 dark:hover:text-white dark:border-zinc-800 dark:hover:border-white text-zinc-500 hover:text-zinc-900 border-zinc-300 hover:border-zinc-900`}
                            >
                              Browse All
                            </button>
                          </div>
    
                          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 pt-2">
                            {Array.from(new Set(giftCards?.map(c => c.category))).map(catName => {
                              const firstCardInCat = giftCards.find(c => c.category === catName);
                              const catImage = firstCardInCat?.image || 'https://images.unsplash.com/photo-1557821314-4a50fd44fc82?q=80&w=800&auto=format&fit=crop';
                              
                              return (
                                  <Link to={`/Category/${catName}`}   key={catName}>
                                <motion.div 
                                
                                  whileHover={{ y: -6 }}
                                  onClick={() => {
                                    // setActiveDetailCategory(catName);
                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                  }}
                                  className={`p-1.5 pb-3 transition-all duration-300 group cursor-pointer relative flex flex-col justify-between h-full rounded-2xl dark:bg-transparent dark:text-white dark:border dark:border-transparent dark:hover:bg-zinc-900/30 dark:hover:border-zinc-900/50 dark:hover:shadow-2xl dark:hover:shadow-black/20 bg-transparent text-zinc-950 border border-transparent hover:bg-white/80 hover:border-zinc-200/60 hover:shadow-xl hover:shadow-zinc-200/30`}
                                >
                                  <div className="space-y-3">
                                    {/* Visual card representation */}
                                    <div className={`aspect-[4/3] rounded-xl overflow-hidden relative border dark:bg-zinc-900/40 dark:border-zinc-900/40 bg-zinc-50/50 border-zinc-200/10`}>
                                      <img 
                                        referrerPolicy="no-referrer" 
                                        src={catImage} 
                                        alt={catName} 
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                                      />
                                    </div>
                                    
                                    {/* Metadata section */}
                                    <div className="space-y-0.5 px-1.5 text-left">
                                      <p className={`text-[8px] sm:text-[9px] font-mono font-bold uppercase tracking-widest
                                        dark:text-zinc-500 text-zinc-400
                                      `}>
                                        DIRECTORY
                                      </p>
                                      <h3 className={`font-bold text-sm sm:text-base group-hover:text-amber-500 transition-colors dark:text-zinc-200 text-zinc-900
                                      `}>
                                        {catName}
                                      </h3>
                                    </div>
                                  </div>
                                </motion.div>
                                    </Link>
                              );
                            })}
                          </div>
                        </div>
  )
}

export default Category
