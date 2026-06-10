import React from 'react'
import { format } from 'date-fns'
import { ShoppingBag, Check } from 'lucide-react';
const OrderCard = ({order}) => {
    console.log(order)
  return (
    <div className={`rounded-2xl border  p-5 flex flex-col sm:flex-row items-center gap-6 text-left dark:bg-zinc-950 dark:border-zinc-900 dark:text-white bg-white border-zinc-200 text-zinc-900`}>
                <div className="w-24 h-16 rounded-lg overflow-hidden bg-zinc-900 shrink-0 border border-zinc-800">
                  <img 
                    referrerPolicy="no-referrer" 
                    src={order.products[0].image || 'https://picsum.photos/seed/card/200/120'} 
                    alt="Card" 
                    className="w-full h-full object-cover" 
                  />
                </div>
                <div className="flex-1 space-y-0.5 text-center sm:text-left">
                  <h3 className="font-bold text-base leading-snug">{order.products[0].brand}</h3>
                  <p className={`text-[10px] font-mono uppercase tracking-widest dark:text-zinc-400 text-zinc-600 `}>
                    {format(new Date(order.createdAt), 'MMMM dd, yyyy')}
                  </p>
                </div>
                <div className={`px-5 py-3 rounded-xl border flex items-center gap-3 dark:bg-zinc-900/60 dark:border-zinc-800 dark:text-white bg-zinc-50 border-zinc-200
                `}>
                  <code className="font-mono font-bold text-sm tracking-wider">{order?.codes?.[0] || 'AURA-PENDING'}</code>
                </div>
                <div className="text-right flex flex-col items-center sm:items-end shrink-0">
                  <p className="font-display font-black text-lg">${order?.amount?.toFixed(2)}</p>
                  <div className={`flex items-center gap-1.5 dark:text-zinc-400 text-zinc-600`}>
                    <Check className="w-3.5 h-3.5" />
                    <span className="text-[9px] font-mono font-bold uppercase tracking-widest">Delivered</span>
                  </div>
                </div>
              </div>
  )
}

export default OrderCard
