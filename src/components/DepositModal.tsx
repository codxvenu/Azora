import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, CreditCard, Bitcoin, ShieldCheck, Copy, Check } from 'lucide-react';
import { db } from '../lib/firebase';
import { doc, onSnapshot } from 'firebase/firestore';

interface DepositModalProps {
  onClose: () => void;
  onSuccess: (amount: number, method: string) => void;
  isDark?: boolean;
}

export const DepositModal = ({ onClose, onSuccess, isDark }: DepositModalProps) => {
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState<'card' | 'crypto' | 'razorpay' | null>(null);
  const [copied, setCopied] = useState(false);

  const [payConfig, setPayConfig] = useState({
    razorpay_title: 'Razorpay / Card',
    razorpay_enabled: true,
    crypto_title: 'Crypto (USDT/BTC)',
    crypto_enabled: true,
    crypto_address: 'TTRxX9s7YhdDk9PqmzL28sLdkWqq893kS',
    stripe_title: 'Stripe / Global Card',
    stripe_enabled: true
  });

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'settings', 'payments'), (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        setPayConfig(prev => ({
          ...prev,
          ...data
        }));
      }
    });
    return () => unsub();
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(payConfig.crypto_address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const paymentMethods = [
    { id: 'razorpay', name: payConfig.razorpay_title, icon: CreditCard, enabled: payConfig.razorpay_enabled },
    { id: 'crypto', name: payConfig.crypto_title, icon: Bitcoin, enabled: payConfig.crypto_enabled },
    { id: 'card', name: payConfig.stripe_title, icon: ShieldCheck, enabled: payConfig.stripe_enabled }
  ].filter(m => m.enabled !== false);

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
          id="btn-close-deposit-modal"
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
                  ? 'bg-zinc-900 border-zinc-800 focus:ring-2 focus:ring-zinc-700 text-white' 
                  : 'bg-zinc-50 border-zinc-200 focus:ring-2 focus:ring-black/20'
              }`}
            />
          </div>

          <div className="grid grid-cols-1 gap-2.5">
            {paymentMethods.map((m) => (
              <button
                key={m.id}
                onClick={() => setMethod(m.id as any)}
                className={`p-4 rounded-xl border flex items-center justify-between transition-all ${
                  method === m.id 
                    ? (isDark ? 'border-zinc-300 bg-zinc-900 text-white font-black shadow-md' : 'border-zinc-950 bg-zinc-950 text-white font-black shadow-sm') 
                    : (isDark ? 'border-zinc-900 bg-zinc-900/40 hover:border-zinc-805 text-zinc-400' : 'border-zinc-100 bg-zinc-50 hover:border-zinc-300 text-zinc-750')
                }`}
                id={`btn-payment-${m.id}`}
              >
                <div className="flex items-center gap-3">
                  <m.icon className={`w-5 h-5 ${method === m.id ? 'text-emerald-500' : 'text-zinc-400'}`} />
                  <span className="font-bold text-sm">{m.name}</span>
                </div>
                {method === m.id && (
                  <span className={`w-2 h-2 rounded-full ${isDark ? 'bg-emerald-400' : 'bg-zinc-950'}`} />
                )}
              </button>
            ))}
          </div>

          <AnimatePresence>
            {method === 'crypto' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className={`overflow-hidden rounded-2xl p-4 border text-left space-y-3 ${
                  isDark ? 'bg-zinc-900/40 border-zinc-800' : 'bg-zinc-50 border-zinc-200'
                }`}
              >
                <p className={`text-[10px] font-mono uppercase tracking-wider font-bold ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
                  Direct Wallet Transfer:
                </p>
                <div className="flex items-center justify-between gap-3 bg-zinc-950/20 dark:bg-zinc-950/60 p-3 rounded-xl border border-zinc-200/50 dark:border-zinc-900">
                  <span className="font-mono text-xs break-all select-all text-zinc-650 dark:text-zinc-300">
                    {payConfig.crypto_address}
                  </span>
                  <button
                    onClick={handleCopy}
                    className={`p-2 rounded-lg shrink-0 transition-colors ${
                      isDark ? 'bg-zinc-900 hover:bg-zinc-800 text-zinc-400' : 'bg-white border hover:bg-zinc-50 text-zinc-600'
                    }`}
                    id="btn-copy-address"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
                <p className="text-[10px] text-zinc-500">
                  Please send equivalent amount to this address, then click proceed. The administrator will verify the hash block.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <button 
          onClick={() => {
            if (!amount || !method) return;
            onSuccess(Number(amount), method);
          }}
          disabled={!amount || !method}
          className={`w-full py-4.5 rounded-xl font-bold text-base hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-40 ${
            isDark ? 'bg-white text-zinc-950 hover:bg-zinc-100 shadow-md shadow-white/5' : 'bg-black text-white hover:bg-[#111] shadow-md shadow-black/10'
          }`}
          id="btn-proceed-deposit"
        >
          Submit Deposit Request
        </button>
      </motion.div>
    </div>
  );
};
