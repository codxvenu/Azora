import React from 'react';
import { motion } from 'motion/react';
import { Heart, Share2, ShoppingCart } from 'lucide-react';
import { GiftCard } from '../types';

interface GiftCardItemProps {
  card: GiftCard;
  onClick: () => void;
  isDark?: boolean;
}

export const GiftCardItem = ({ card, onClick, isDark }: GiftCardItemProps) => {
  return (
    <motion.div 
      whileHover={{ y: -6 }}
      onClick={onClick}
      className={`p-1.5 pb-2.5 transition-all duration-300 group cursor-pointer relative flex flex-col justify-between h-full rounded-2xl ${
        isDark 
          ? 'bg-transparent text-white border border-transparent hover:bg-zinc-900/30 hover:border-zinc-900/50 hover:shadow-2xl hover:shadow-black/20' 
          : 'bg-transparent text-zinc-950 border border-transparent hover:bg-white/80 hover:border-zinc-200/60 hover:shadow-xl hover:shadow-zinc-200/30'
      }`}
    >
      <div className="space-y-2.5">
        {/* Visual card representation */}
        <div className={`aspect-[4/3] rounded-xl overflow-hidden relative border ${
          isDark ? 'bg-zinc-900/40 border-zinc-900/40' : 'bg-zinc-50/50 border-zinc-200/10'
        }`}>
          <img 
            referrerPolicy="no-referrer" 
            src={card.image} 
            alt={card.brand} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
          />
          {card.discount > 0 && (
            <div className="absolute top-2 right-2 bg-zinc-950/80 backdrop-blur-md text-white text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border border-white/10">
              -{card.discount}%
            </div>
          )}
        </div>
        
        {/* Metadata section */}
        <div className="space-y-0.5 px-1.5">
          <p className={`text-[8px] sm:text-[9px] font-mono font-bold uppercase tracking-widest truncate ${
            isDark ? 'text-zinc-500' : 'text-zinc-400'
          }`}>
            {card.category}
          </p>
          <h3 className={`font-bold text-xs sm:text-sm truncate group-hover:text-amber-500 transition-colors ${
            isDark ? 'text-zinc-200' : 'text-zinc-900'
          }`}>
            {card.brand}
          </h3>
        </div>
      </div>

      <div className="px-1.5 mt-auto">
        {/* Pricing side-by-side with grey cut and brand-friendly labels */}
        <div className="flex items-center gap-1.5 pt-2 pb-1.5 border-b border-transparent">
          <span className={`text-sm sm:text-base font-display font-black tracking-tight ${
            isDark ? 'text-white' : 'text-zinc-950'
          }`}>
            ${card.finalPrice.toFixed(2)}
          </span>
          {card.discount > 0 && (
            <span className={`text-[10px] line-through font-medium ${
              isDark ? 'text-zinc-500' : 'text-zinc-400'
            }`}>
              ${card.realPrice.toFixed(2)}
            </span>
          )}
        </div>

        {/* Action Bar revealing at absolute bottom of card on Hover */}
        <div className="overflow-hidden max-h-0 opacity-0 group-hover:max-h-12 group-hover:opacity-100 transition-all duration-300 ease-in-out">
          <div className={`flex items-center justify-between pt-2 border-t mt-1 ${
            isDark ? 'border-zinc-900/60' : 'border-zinc-100'
          }`}>
            <button 
              type="button"
              onClick={(e) => {
                e.stopPropagation();
              }}
              className={`flex-1 py-1.5 flex items-center justify-center rounded-lg transition-colors ${
                isDark ? 'text-zinc-500 hover:text-white hover:bg-zinc-900' : 'text-zinc-400 hover:text-black hover:bg-zinc-50'
              }`}
              title="Add to Favorites"
            >
              <Heart className="w-3.5 h-3.5" />
            </button>
            <button 
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (navigator.share) {
                  navigator.share({
                    title: card.brand,
                    text: `Check out this digital deal on AURA for ${card.brand}`,
                    url: window.location.href
                  }).catch(() => {});
                }
              }}
              className={`flex-1 py-1.5 flex items-center justify-center rounded-lg transition-colors ${
                isDark ? 'text-zinc-500 hover:text-white hover:bg-zinc-900' : 'text-zinc-400 hover:text-black hover:bg-zinc-50'
              }`}
              title="Share Deal"
            >
              <Share2 className="w-3.5 h-3.5" />
            </button>
            <button 
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onClick();
              }}
              className={`flex-1 py-1.5 flex items-center justify-center rounded-lg transition-colors ${
                isDark ? 'text-zinc-500 hover:text-amber-500 hover:bg-zinc-900' : 'text-zinc-400 hover:text-amber-600 hover:bg-zinc-50'
              }`}
              title="Add to Cart / Buy"
            >
              <ShoppingCart className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
