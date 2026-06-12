import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, CreditCard, Bitcoin, ShieldCheck, Copy, Check } from 'lucide-react';
import useApi from '../lib/useFetch';

export const DepositModal = ({onClose, addDeposit,setFile }) => {
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState(null);
  const [trxid, setTrxid] = useState("");
  const [copied, setCopied] = useState(false);
  const api = useApi()
  const [payConfig, setPayConfig] = useState({
    crypto_title: 'Crypto (USDT/BTC)',
    crypto_enabled: true,
    crypto_address: [],
  });

  const handlePaymentConfig = async() =>{
    const config = await api.wallet.configList();
    const wallet = config.wallet.map((w)=>{
      const currW = w.address.split("\n");
      if(currW.length > 1 && !!currW.at(-1)){
        return {...w,address : currW}
      }else{
        return w
      }
    });
    setPayConfig((prev)=>({...prev,crypto_address : wallet}));
    setTrxid(getRandomMethod(wallet[0].address));
  }
  useEffect(()=>{
    handlePaymentConfig()
  },[])

  const handleCopy = () => {
    navigator.clipboard.writeText(trxid);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  const getRandomMethod = (address)=>{
    if(!Array.isArray(address)) return address
    return address[Math.floor(Math.random()*address.length)]
  }
  const paymentMethods = [
    { id: 'crypto', name: payConfig.crypto_title, icon: Bitcoin, enabled: payConfig.crypto_enabled },
    // { id: 'card', name: payConfig.stripe_title, icon: ShieldCheck, enabled: payConfig.stripe_enabled }
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
        className="relative w-full max-w-lg rounded-[1.5rem] p-8 sm:p-10 space-y-6 shadow-2xl border bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-900 text-zinc-950 dark:text-white shadow-zinc-200/50 dark:shadow-black/80"
      >
        <button 
          onClick={onClose} 
          className="absolute top-6 right-8 w-8 h-8 rounded-xl flex items-center justify-center transition-colors bg-zinc-100 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-800"
          id="btn-close-deposit-modal"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="text-center space-y-2 pt-2">
          <h2 className="text-2xl sm:text-3xl font-display font-black tracking-tighter uppercase">DEPOSIT FUNDS</h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Choose your preferred payment method.</p>
        </div>

        <div className="space-y-4">
          <div className="space-y-2 text-left">
            <label className="text-[10px] font-bold uppercase tracking-widest px-2 text-zinc-400 dark:text-zinc-500">
              Amount to Deposit ($)
            </label>
            <input 
              type="number" 
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="w-full p-5 rounded-2xl outline-none transition-all font-display font-black text-2xl text-center border bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white focus:ring-2 focus:ring-black/20 dark:focus:ring-zinc-700"
            />
          </div>

          <div className="grid grid-cols-1 gap-2.5">
            {paymentMethods.map((m) => (
              <button
                key={m.id}
                onClick={() => setMethod(m.id)}
                className={`p-4 rounded-xl border flex items-center justify-between transition-all ${
                  method === m.id 
                    ? 'border-zinc-950 dark:border-zinc-300 bg-zinc-950 dark:bg-zinc-900 text-white dark:text-white font-black shadow-sm dark:shadow-md' 
                    : 'border-zinc-100 dark:border-zinc-900 bg-zinc-50 dark:bg-zinc-900/40 text-zinc-750 dark:text-zinc-400 hover:border-zinc-300 dark:hover:border-zinc-805'
                }`}
                id={`btn-payment-${m.id}`}
              >
                <div className="flex items-center gap-3">
                  <m.icon className={`w-5 h-5 ${method === m.id ? 'text-emerald-500' : 'text-zinc-400'}`} />
                  <span className="font-bold text-sm">{m.name}</span>
                </div>
                {method === m.id && (
                  <span className="w-2 h-2 rounded-full bg-zinc-950 dark:bg-emerald-400" />
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
                className="overflow-hidden rounded-2xl p-4 border text-left space-y-3 bg-zinc-50 dark:bg-zinc-900/40 border-zinc-200 dark:border-zinc-800"
              >
                <p className="text-[10px] font-mono uppercase tracking-wider font-bold text-zinc-500 dark:text-zinc-400">
                  Direct Wallet Transfer:
                </p>
                <div className="flex items-center justify-between gap-3 bg-zinc-950/20 dark:bg-zinc-950/60 p-3 rounded-xl border border-zinc-200/50 dark:border-zinc-900">
                  <select className="bg-transparent text-sm font-mono font-bold tracking-wider text-zinc-600 dark:text-zinc-400 w-full outline-0 " onChange={(e)=>setTrxid(e.target.value)}>
                   
                   {payConfig["crypto_address"]?.map((p)=>(
                     <option value={getRandomMethod(p.address)}>{p.network}</option>
            )) 
                   }
                  </select>
                </div>
                <div className="flex items-center justify-between gap-3 bg-zinc-950/20 dark:bg-zinc-950/60 p-3 rounded-xl border border-zinc-200/50 dark:border-zinc-900">
                
                  <span className="font-mono text-xs break-all select-all text-zinc-650 dark:text-zinc-300">
                    {trxid}
                  </span>
                  <button
                    onClick={handleCopy}
                    className="p-2 rounded-lg shrink-0 transition-colors bg-white dark:bg-zinc-900 border-0 dark:border-0 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
                    id="btn-copy-address"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
                <div className="flex items-center justify-between gap-3 bg-zinc-950/20 dark:bg-zinc-950/60 p-3 rounded-xl border border-zinc-200/50 dark:border-zinc-900">
                
                 <input type='file' onChange={(e)=>setFile(e.target.files)}/>
                </div>
                <p className="text-[10px] text-zinc-500">
                  Please send equivalent amount to this address, then click proceed. The administrator will verify the hash block.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <button 
          onClick={() =>{addDeposit(amount); onClose()}}
          disabled={!amount || !method}
          className="w-full py-4.5 rounded-xl font-bold text-base hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-40 bg-black dark:bg-white text-white dark:text-zinc-950 hover:bg-[#111] dark:hover:bg-zinc-100 shadow-md shadow-black/10 dark:shadow-white/5"
          id="btn-proceed-deposit"
        >
          Submit Deposit Request
        </button>
      </motion.div>
    </div>
  );
};
