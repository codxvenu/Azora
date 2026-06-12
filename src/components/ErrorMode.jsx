import React, { useState } from 'react';
import { 
  Home, 
  Search, 
  HelpCircle, 
  Ticket, 
  ArrowRight,
  ShieldCheck,
  ShoppingBag,
  Sparkles
} from 'lucide-react';
import { motion } from 'motion/react';
 const NotFoundView = ({ onBackToBrowse, onNavigate }) => {
  const [localSearch, setLocalSearch] = useState('');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (localSearch.trim()) {
      onBackToBrowse(localSearch.trim());
    } else {
      onBackToBrowse();
    }
  };

  const quickLinks = [
    {
      label: 'Home Storefront',
      desc: 'Browse trending gaming pins & gift cards',
      icon: Home,
      action: () => onBackToBrowse(),
      color: 'text-emerald-500 bg-emerald-500/5 border-emerald-500/10'
    },
    {
      label: 'Helpdesk Portal',
      desc: 'File an escrow dispute or support case',
      icon: HelpCircle,
      action: () => onNavigate('tickets'),
      color: 'text-purple-500 bg-purple-500/5 border-purple-500/10'
    },
    {
      label: 'Sell Digital Keys',
      desc: 'De-clutter activation gift keys for balance',
      icon: Sparkles,
      action: () => onNavigate('sell'),
      color: 'text-amber-500 bg-amber-500/5 border-amber-500/10'
    },
    {
      label: 'My Orders Drawer',
      desc: 'Retrieve codes & verify purchase logs',
      icon: ShoppingBag,
      action: () => onNavigate('orders'),
      color: 'text-blue-500 bg-blue-500/5 border-blue-500/10'
    }
  ];

  return (
    <div className="h-screen flex items-center justify-center px-4 py-8 md:py-16 dark:bg-black ">
      <div className="max-w-3xl w-full text-center space-y-12">
        
        {/* Animated Visual Core Indicator (Fluid Blob & Glow) */}
        <div className="relative flex justify-center items-center">
          {/* Main Backdrop Glow */}
          <div className="absolute w-72 h-72 rounded-full bg-gradient-to-r from-emerald-500/20 via-purple-500/10 to-transparent blur-3xl opacity-70 animate-pulse" />
          
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 100, damping: 15 }}
            className="relative"
          >
            {/* Visual keycard-void silhouette */}
            <div
  className="
    relative w-48 h-48 rounded-[2rem] border flex flex-col items-center justify-center
    backdrop-blur-md transition-all
    bg-white/80 border-zinc-200 shadow-xl
    dark:bg-zinc-950/80 dark:border-zinc-900 dark:shadow-2xl dark:shadow-zinc-950
  "
>
              
              {/* Spinning or pulsing inner ring */}
              <div className="absolute inset-4 rounded-2xl border border-dashed border-emerald-500/20 animate-[spin_40s_linear_infinite]" />
              
              <h1 className="text-7xl font-display font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-500 to-emerald-600 dark:from-emerald-300">
                404
              </h1>
              <p className="text-[10px] font-mono font-bold tracking-widest text-zinc-500 uppercase mt-1">
                KEY_VOID_EXCEPTION
              </p>
            </div>
            
            {/* Extra orbiting decorative elements */}
            <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center animate-bounce text-amber-500 text-xs">
              ✦
            </div>
            <div className="absolute -bottom-2 -left-2 w-6 h-6 rounded-full bg-teal-500/10 border border-teal-500/20 flex items-center justify-center animate-pulse text-teal-500 text-xs text-center">
              ●
            </div>
          </motion.div>
        </div>

        {/* Informative Content Block */}
        <div className="space-y-4 max-w-xl mx-auto">
          <h2 className="text-3xl font-display font-black tracking-tight capitalize text-zinc-900 dark:text-white">
            Little pig u are far away from home
          </h2>
          {/* <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400"> The digital voucher or interface resource you mapped does not reside in our catalog index structures. It has either decayed or was transferred post-redemption.
          </p> */}
        </div>

        {/* Interactive Deep Search Portal
        <div className="max-w-md mx-auto">
          <form onSubmit={handleSearchSubmit} className="relative group">
           <input
  type="text"
  placeholder="Direct search digital key inventory..."
  value={localSearch}
  onChange={(e) => setLocalSearch(e.target.value)}
  className="
    w-full pl-12 pr-28 py-4 rounded-2xl text-sm outline-none border transition-all
    bg-white border-zinc-200 text-zinc-950 focus:border-black
    dark:bg-zinc-950 dark:border-zinc-900 dark:text-white dark:focus:border-zinc-700
  "
/>
            <Search className="w-5 h-5 text-zinc-500 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-emerald-500 transition-colors" />
            
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1 transition-all"
            >
              SEARCH <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>
        </div> */}

        {/* Minimal Platform Status Health Check */}
  

      </div>
    </div>
  );
};
export default NotFoundView;