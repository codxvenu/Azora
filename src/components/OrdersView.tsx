import React, { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, onSnapshot, query, where, orderBy } from 'firebase/firestore';
import { Order } from '../types';
import { format } from 'date-fns';
import { ShoppingBag, Check, Copy } from 'lucide-react';
import { useAuth } from '../lib/useAuth';

interface OrdersViewProps {
  onBack: () => void;
  isDark?: boolean;
}

export const OrdersView = ({ onBack, isDark }: OrdersViewProps) => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    const q = query(
      collection(db, 'orders'), 
      where('userId', '==', user.uid), 
      orderBy('timestamp', 'desc')
    );
    const unsub = onSnapshot(q, (snapshot) => {
      setOrders(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order)));
    });
    return () => unsub();
  }, [user]);

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <div className="space-y-2 text-left">
        <h2 className="text-4xl font-display font-black tracking-tighter uppercase">YOUR ORDERS</h2>
        <p className={isDark ? 'text-zinc-400' : 'text-zinc-500'}>Access your purchased gift card activation codes instantly.</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {orders.map(order => (
          <div key={order.id} className={`rounded-2xl border p-5 flex flex-col sm:flex-row items-center gap-6 text-left ${
            isDark ? 'bg-zinc-950 border-zinc-900 text-white' : 'bg-white border-zinc-200 text-zinc-900'
          }`}>
            <div className="w-24 h-16 rounded-lg overflow-hidden bg-zinc-900 shrink-0 border border-zinc-800">
              <img 
                referrerPolicy="no-referrer" 
                src={order.productImage || 'https://picsum.photos/seed/card/200/120'} 
                alt="Card" 
                className="w-full h-full object-cover" 
              />
            </div>
            <div className="flex-1 space-y-2 text-center sm:text-left">
              <div className="space-y-0.5">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <h3 className="font-bold text-base leading-snug">{order.productName}</h3>
                  {order.codes && order.codes.length > 1 && (
                    <span className="bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-full font-mono uppercase tracking-wider">
                      {order.codes.length}x Items
                    </span>
                  )}
                </div>
                <p className={`text-[10px] font-mono uppercase tracking-widest ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
                  {format(new Date(order.timestamp), 'MMMM dd, yyyy')}
                </p>
              </div>
            </div>
            
            <div className="flex flex-col gap-1.5 w-full sm:w-auto shrink-0">
              {order.codes && order.codes.map((code, idx) => (
                <div 
                  key={idx} 
                  className={`px-4 py-2 rounded-xl border flex items-center justify-between gap-3 min-w-[200px] ${
                    isDark ? 'bg-zinc-900/60 border-zinc-850 text-white' : 'bg-zinc-50 border-zinc-200'
                  }`}
                >
                  <code className="font-mono font-bold text-xs tracking-wider">{code}</code>
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(code);
                      setCopiedCode(code);
                      setTimeout(() => setCopiedCode(null), 2000);
                    }}
                    className={`p-1 rounded hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors ${
                      isDark ? 'text-zinc-400' : 'text-zinc-600'
                    }`}
                    title="Copy code"
                  >
                    {copiedCode === code ? (
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                    ) : (
                      <Copy className="w-3.5 h-3.5 text-zinc-400" />
                    )}
                  </button>
                </div>
              ))}
              {(!order.codes || order.codes.length === 0) && (
                <div className={`px-4 py-2 rounded-xl border ${
                  isDark ? 'bg-zinc-900/60 border-zinc-850 text-zinc-500' : 'bg-zinc-50 border-zinc-200 text-zinc-400'
                }`}>
                  <code className="font-mono font-bold text-xs">AURA-PENDING</code>
                </div>
              )}
            </div>
            <div className="text-right flex flex-col items-center sm:items-end shrink-0">
              <p className="font-display font-black text-lg">${order.amount.toFixed(2)}</p>
              <div className={`flex items-center gap-1.5 ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
                <Check className="w-3.5 h-3.5" />
                <span className="text-[9px] font-mono font-bold uppercase tracking-widest">Delivered</span>
              </div>
            </div>
          </div>
        ))}
        {orders.length === 0 && (
          <div className="py-20 text-center space-y-4">
            <ShoppingBag className="w-12 h-12 text-zinc-400 mx-auto" />
            <p className="text-zinc-500 font-medium">You haven't purchased any items yet.</p>
            <button 
              onClick={onBack} 
              className={`font-mono text-xs font-bold uppercase tracking-widest underline underline-offset-4 ${
                isDark ? 'text-white' : 'text-black'
              }`}
            >
              Start Shopping
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
