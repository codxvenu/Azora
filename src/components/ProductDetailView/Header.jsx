import { ArrowLeft } from 'lucide-react'
import React from 'react'
import { Link } from 'react-router-dom'
const Header = ({card}) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 py-6 border-b transition-colors duration-300 mb-8 px-2 sm:px-0 border-zinc-200/60 dark:border-zinc-800/40">
            <div className="flex items-center gap-3 text-xs sm:text-sm font-medium">
             <Link to="/">
              <button
                className="flex items-center gap-2 hover:opacity-85 font-mono uppercase tracking-wider text-zinc-500 hover:text-black dark:text-zinc-400 dark:hover:text-white"
              >
                <ArrowLeft className="w-4 h-4" /> Back to Marketplace
              </button>
             </Link>
              <span className="opacity-30">/</span>
              <span className="opacity-60 font-mono tracking-wider">
                GIFT CARDS
              </span>
              <span className="opacity-30">/</span>
              <span className="font-bold truncate max-w-[120px] sm:max-w-[200px]">
                {card.brand}
              </span>
            </div>
    
            <div className="flex items-center gap-3">
              <span
                className="text-[10px] sm:text-xs font-mono font-bold uppercase text-zinc-400 dark:text-zinc-500"
              >
                ID: {card.id.toUpperCase()}
              </span>
            </div>
          </div>
  )
}

export default Header
