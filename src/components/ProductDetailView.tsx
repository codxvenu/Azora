import React from 'react';
import { motion } from 'motion/react';
import { X, ShieldCheck, ArrowRight } from 'lucide-react';
import { GiftCard } from '../types';

interface ProductDetailViewProps {
  card: GiftCard;
  onClose: () => void;
  onBuy: () => void;
  isDark?: boolean;
}

export const ProductDetailView = ({ card, onClose, onBuy, isDark }: ProductDetailViewProps) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center p-4 sm:p-6">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />
      <motion.div 
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className={`relative w-full max-w-2xl rounded-t-[1.5rem] p-8 sm:p-10 space-y-8 shadow-2xl border-t text-left ${
          isDark ? 'bg-zinc-950 text-white border-zinc-900 shadow-black' : 'bg-white text-zinc-950 border-zinc-200 shadow-zinc-200/50'
        }`}
      >
        <button 
          onClick={onClose} 
          className={`absolute top-6 right-8 w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
            isDark ? 'bg-zinc-900 text-zinc-300 hover:bg-zinc-800' : 'bg-zinc-105 text-zinc-700 hover:bg-zinc-200'
          }`}
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col sm:flex-row gap-8">
          <div className={`w-full sm:w-1/2 aspect-[4/3] rounded-xl overflow-hidden border shrink-0 ${
            isDark ? 'bg-zinc-900 border-zinc-900' : 'bg-zinc-50 border-zinc-200/50'
          }`}>
            <img 
              referrerPolicy="no-referrer" 
              src={card.image} 
              alt={card.brand} 
              className="w-full h-full object-cover" 
            />
          </div>
          <div className="flex-1 space-y-6">
            <div className="space-y-2">
              <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-mono tracking-widest uppercase border font-bold ${
                isDark ? 'bg-zinc-900 text-zinc-400 border-zinc-800' : 'bg-zinc-100 text-zinc-500 border-zinc-200'
              }`}>
                {card.category}
              </span>
              <h2 className="text-2xl sm:text-3xl font-display font-black tracking-tighter leading-tight">
                {card.brand}
              </h2>
              <p className={`text-xs sm:text-sm leading-relaxed ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
                {card.description}
              </p>
            </div>
            
            <div className="space-y-3 pt-2">
              <div className="flex items-end gap-3">
                <p className="text-3xl sm:text-4xl font-display font-black">
                  ${card.finalPrice.toFixed(2)}
                </p>
                {card.discount > 0 && (
                  <p className={`text-base line-through font-bold pb-0.5 ${
                    isDark ? 'text-zinc-500' : 'text-zinc-400'
                  }`}>
                    ${card.realPrice.toFixed(2)}
                  </p>
                )}
              </div>
              <div className={`flex items-center gap-2 font-mono font-bold text-[10px] uppercase tracking-wider ${
                isDark ? 'text-zinc-400' : 'text-zinc-700'
              }`}>
                <ShieldCheck className="w-4 h-4 text-amber-500" /> Instant Delivery Guaranteed
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button 
            onClick={onBuy}
            className={`py-4 px-6 rounded-xl font-bold text-base hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 ${
              isDark ? 'bg-white text-zinc-950 hover:bg-zinc-100' : 'bg-zinc-950 text-white hover:bg-zinc-850'
            }`}
          >
            Buy Now <ArrowRight className="w-5 h-5" />
          </button>
          <button className={`py-4 px-6 rounded-xl font-bold text-base transition-all ${
            isDark ? 'bg-zinc-900 text-white hover:bg-zinc-850 border border-zinc-800' : 'bg-zinc-100 text-black hover:bg-zinc-200'
          }`}>
            Add to Cart
          </button>
        </div>
      </motion.div>
    </div>
  );
};
