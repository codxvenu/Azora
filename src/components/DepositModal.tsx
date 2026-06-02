import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, CreditCard, Bitcoin, ShieldCheck } from 'lucide-react';

interface DepositModalProps {
  onClose: () => void;
  onSuccess: (amount: number) => void;
  isDark?: boolean;
}

export const DepositModal = ({ onClose, onSuccess, isDark }: DepositModalProps) => {
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState<'card' | 'crypto' | 'razorpay' | null>(null);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className={`relative w-full max-w-lg rounded-[1.5rem] p-8 sm:p-10 space-y-6 shadow-2xl border ${
          isDark ? 'bg-zinc-950 border-zinc-900 text-white shadow-black/80' : 'bg-white border-zinc-200 text-zinc-950 shadow-zinc-200/50'
        }`}
      >
        <button 
          onClick={onClose} 
          className={`absolute top-6 right-8 w-8 h-8 rounded-xl flex items-center justify-center transition-colors ${
            isDark ? 'bg-zinc-900 text-zinc-300 hover:bg-zinc-800' : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
          }`}
        >
          <X className="w-4 h-4" />
        </button>

        <div className="text-center space-y-2 pt-2">
          <h2 className="text-2xl sm:text-3xl font-display font-black tracking-tighter uppercase">DEPOSIT FUNDS</h2>
          <p className={`text-sm ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>Choose your preferred payment method.</p>
        </div>

        <div className="space-y-4">
          <div className="space-y-2 text-left">
            <label className={`text-[10px] font-bold uppercase tracking-widest px-2 ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>
              Amount to Deposit ($)
            </label>
            <input 
              type="number" 
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className={`w-full p-5 rounded-2xl outline-none transition-all font-display font-black text-2xl text-center border ${
                isDark 
                  ? 'bg-zinc-900 border-zinc-805 focus:ring-2 focus:ring-zinc-750 text-white' 
                  : 'bg-zinc-50 border-zinc-200 focus:ring-2 focus:ring-black'
              }`}
            />
          </div>

          <div className="grid grid-cols-1 gap-2.5">
            {[
              { id: 'razorpay', name: 'Razorpay / Card', icon: CreditCard },
              { id: 'crypto', name: 'Crypto (USDT/BTC)', icon: Bitcoin },
              { id: 'card', name: 'Stripe / Global Card', icon: ShieldCheck }
            ].map((m) => (
              <button
                key={m.id}
                onClick={() => setMethod(m.id as any)}
                className={`p-4 rounded-xl border flex items-center justify-between transition-all ${
                  method === m.id 
                    ? (isDark ? 'border-zinc-300 bg-zinc-900 text-white font-black' : 'border-zinc-950 bg-zinc-950 text-white font-black') 
                    : (isDark ? 'border-zinc-900 bg-zinc-900/40 hover:border-zinc-800 text-zinc-400' : 'border-zinc-100 bg-zinc-50 hover:border-zinc-300 text-zinc-700')
                }`}
              >
                <div className="flex items-center gap-3">
                  <m.icon className={`w-5 h-5 ${method === m.id ? 'text-amber-500' : 'text-zinc-400'}`} />
                  <span className="font-bold text-sm">{m.name}</span>
                </div>
                {method === m.id && (
                  <span className={`w-2 h-2 rounded-full ${isDark ? 'bg-amber-400' : 'bg-zinc-950'}`} />
                )}
              </button>
            ))}
          </div>
        </div>

        <button 
          onClick={() => {
            if (!amount || !method) return;
            onSuccess(Number(amount));
          }}
          disabled={!amount || !method}
          className={`w-full py-4.5 rounded-xl font-bold text-base hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-40 ${
            isDark ? 'bg-white text-zinc-950 hover:bg-zinc-100' : 'bg-black text-white hover:bg-zinc-850'
          }`}
        >
          Proceed to Payment
        </button>
      </motion.div>
    </div>
  );
};
