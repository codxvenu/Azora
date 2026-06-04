import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Search, Sparkles, Flame, Percent, Grid } from 'lucide-react';
import { GiftCard } from '../types';
import { GiftCardItem } from './GiftCardItem';

interface CategoryDetailViewProps {
  categoryName: string;
  giftCards: GiftCard[];
  onBack: () => void;
  isDark?: boolean;
  onSelectCard: (card: GiftCard) => void;
}

export function CategoryDetailView({
  categoryName,
  giftCards,
  onBack,
  isDark,
  onSelectCard,
}: CategoryDetailViewProps) {
  const [searchQuery, setSearchQuery] = useState('');

  // Get all cards in this category
  const isAllCategory = categoryName.toLowerCase() === 'all' || categoryName.toLowerCase() === 'all categories';
  const categoryCards = isAllCategory
    ? giftCards
    : giftCards.filter(
        (card) => card.category.toLowerCase() === categoryName.toLowerCase()
      );

  // Filter these cards based on the search query
  const filteredCards = categoryCards.filter((card) =>
    card.brand.toLowerCase().includes(searchQuery.trim().toLowerCase())
  );

  // Split into Trending & Hot Offers
  // Trending: first 4 items in this category
  const trendingCards = categoryCards.slice(0, 4);

  // Hot Offers: items in this category with a discount, sorted by highest discount descending
  const hotOffers = [...categoryCards]
    .filter((card) => card.discount > 0)
    .sort((a, b) => b.discount - a.discount);

  return (
    <div className="space-y-12">
      {/* Header back bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-6 border-zinc-200/40 dark:border-zinc-800/40">
        <div className="space-y-2 text-left">
          <button
            onClick={onBack}
            className={`flex items-center gap-1 hover:opacity-85 font-mono text-xs uppercase tracking-wider ${
              isDark ? 'text-zinc-400 hover:text-white' : 'text-zinc-500 hover:text-black'
            }`}
          >
            <ArrowLeft className="w-4 h-4" /> Back to Categories
          </button>
          <div className="flex items-center gap-2.5">
            <h1 className="text-3xl sm:text-4xl font-display font-black tracking-tight uppercase text-zinc-900 dark:text-white">
              {isAllCategory ? 'All Products' : categoryName} <span className="text-zinc-400">LEDGER</span>
            </h1>
            <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold font-mono uppercase tracking-wider border ${
              isDark 
                ? 'bg-zinc-900 border-zinc-800 text-zinc-400' 
                : 'bg-zinc-100 border-zinc-250 text-zinc-600'
            }`}>
              {categoryCards.length} Keys
            </span>
          </div>
        </div>

        {/* Dynamic Category Search Bar */}
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
          <input
            type="text"
            placeholder={isAllCategory ? "Search all keys..." : `Search keys in ${categoryName}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full pl-11 pr-4 py-3 rounded-2xl outline-none border transition-all text-xs font-medium ${
              isDark
                ? 'bg-zinc-900 border-zinc-800 text-white placeholder-zinc-500 focus:border-zinc-650'
                : 'bg-white border-zinc-250 text-zinc-900 placeholder-zinc-450 focus:border-zinc-450 focus:border-zinc-400 shadow-sm'
            }`}
          />
        </div>
      </div>

      {searchQuery.trim() !== '' ? (
        /* If search text is typed, show full grid search results */
        <div className="space-y-6 text-left">
          <div className="flex items-center gap-2">
            <Grid className="w-4 h-4 text-zinc-500" />
            <h2 className="text-xl font-display font-medium tracking-tight text-zinc-900 dark:text-white">
              Search Results for "{searchQuery}" in <span className="text-zinc-400">{isAllCategory ? 'All Products' : categoryName}</span>
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {filteredCards.map((card) => (
              <GiftCardItem
                key={card.id}
                card={card}
                isDark={isDark}
                onClick={() => onSelectCard(card)}
              />
            ))}
            {filteredCards.length === 0 && (
              <div className="col-span-full py-20 text-center text-zinc-500 border border-dashed rounded-3xl border-zinc-200/40 dark:border-zinc-800/40">
                <p className="text-base font-medium text-zinc-900 dark:text-zinc-300">No direct keys found for "{searchQuery}".</p>
                <p className="text-xs text-zinc-400 mt-1">Try searching another term, or view trending keys below.</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Default category landing sections: Trending & Hot Offers */
        <div className="space-y-16 text-left">
          {/* Section 1: Trending Section inside Category */}
          {trendingCards.length > 0 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1 px-1.5 bg-amber-500/10 rounded-lg text-amber-500">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-display font-medium tracking-tight text-zinc-900 dark:text-white">
                      Trending keys {isAllCategory ? 'Overall' : `in ${categoryName}`}
                    </h2>
                    <p className={`text-xs ${isDark ? 'text-zinc-500' : 'text-stone-500'} mt-0.5`}>
                      Most demanded digital passes, licenses, and top-ups this hour.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {trendingCards.map((card) => (
                  <GiftCardItem
                    key={card.id}
                    card={card}
                    isDark={isDark}
                    onClick={() => onSelectCard(card)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Special Hot Offers visual banner */}
          <div className={`p-8 rounded-[1.5rem] border relative overflow-hidden flex flex-col md:flex-row justify-between items-center gap-6 transition-all duration-300 ${
            isDark 
              ? 'bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 text-white border-zinc-900' 
              : 'bg-gradient-to-r from-white via-zinc-50 to-white text-zinc-900 border-zinc-200/60 shadow-sm'
          }`}>
            <div className="space-y-3 z-10 text-left">
              <span className="text-[10px] font-mono font-bold tracking-widest text-emerald-500 uppercase bg-emerald-500/5 px-2 py-0.5 rounded border border-emerald-500/10">LEDGER DIRECT GUARANTEE</span>
              <h3 className="text-2xl sm:text-3xl font-display font-semibold tracking-tight leading-none text-zinc-900 dark:text-white">Need support or customization?</h3>
              <p className="text-zinc-500 dark:text-zinc-400 text-xs max-w-xl leading-relaxed">Our digital assets are sourced directly from validated suppliers. You get high discount margins and verified direct delivery for your favorite {isAllCategory ? 'e-commerce & tech' : categoryName} services.</p>
            </div>
            <div className="text-5xl font-mono font-black tracking-tighter opacity-15 select-none hidden sm:block text-zinc-400 dark:text-zinc-600">
              {isAllCategory ? 'LEDGER' : categoryName.toUpperCase()}
            </div>
          </div>

          {/* Section 2: Hot Offers inside Category */}
          {hotOffers.length > 0 && (
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <div className="p-1 px-1.5 bg-rose-500/10 rounded-lg text-rose-500">
                  <Flame className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-2xl font-display font-medium tracking-tight text-zinc-900 dark:text-white">
                    Hot Offers {isAllCategory ? 'Overall' : `in ${categoryName}`}
                  </h2>
                  <p className={`text-xs ${isDark ? 'text-zinc-500' : 'text-stone-500'} mt-0.5`}>
                    Instant keys with the highest active markdown savings.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {hotOffers.map((card) => (
                  <GiftCardItem
                    key={card.id}
                    card={card}
                    isDark={isDark}
                    onClick={() => onSelectCard(card)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
