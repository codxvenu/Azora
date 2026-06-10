import React, { useState } from 'react'
import { format } from 'date-fns'
import { ShoppingBag, Check } from 'lucide-react';
import OrderCard from './OrderCard';
import { products } from '@/src/data/products';
const OrderMultiCard = ({order,show,setShow}) => {
    
  return (
          <div className={` rounded-b-none rounded-2xl border  flex flex-col items-center gap-6 text-left dark:bg-zinc-950 dark:border-zinc-900 dark:text-white bg-white border-zinc-200 text-zinc-900`} onClick={()=>setShow((prev)=>prev == order._id ? null : order._id)}>
    <div className={` rounded-b-none rounded-2xl border p-5 flex flex-col sm:flex-row items-center gap-6 text-left dark:bg-zinc-950 dark:border-zinc-900 dark:text-white bg-white border-zinc-200 text-zinc-900 w-full`}>
            <div className="w-24 h-16 rounded-lg overflow-hidden bg-zinc-900 shrink-0 border border-zinc-800">
              <img 
                referrerPolicy="no-referrer" 
                src={'https://picsum.photos/seed/card/200/120'} 
                alt="Card" 
                className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 space-y-0.5 text-center sm:text-left">
              <h3 className="font-bold text-base leading-snug">{"Muti Service Pack"}</h3>
              <p className={`text-[10px] font-mono uppercase tracking-widest dark:text-zinc-400 text-zinc-600 `}>
                {format(new Date(order.createdAt), 'MMMM dd, yyyy')}
              </p>
            </div>
           
            <div className="text-right flex flex-col items-center sm:items-end shrink-0">
              <p className="font-display font-black text-lg">${order.amount.toFixed(2)}</p>
              <div className={`flex items-center gap-1.5 dark:text-zinc-400 text-zinc-600`}>
                <Check className="w-3.5 h-3.5" />
                <span className="text-[9px] font-mono font-bold uppercase tracking-widest">Delivered</span>
              </div>
            </div>
          </div>
          {show === order._id && <div className='flex flex-col gap-2 -mt-6 w-full p-6'>
            {order.products.map((m,idx)=>(
            <OrderCard order={{...order,products : [products[idx]],amount : m.finalPrice}}/>
            ))}
            </div>}
          </div>
  )
}

export default OrderMultiCard
