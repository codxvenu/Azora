import React, { useState, useEffect, useContext } from 'react';
import { format } from 'date-fns';
import { Plus, History, ShoppingBag } from 'lucide-react';
import { AnimatePresence } from 'motion/react';
import { DepositModal } from './DepositModal';
import useApi from '../lib/useFetch';
import { Auth } from '@/Utility/AuthContext';



 const WalletView = ({ profile, onBack, onDeposit, isDark }) => {
  const [transactions, setTransactions] = useState([]);
  const [isDeposit, setIsDeposit] = useState(false);
  const {user} = useContext(Auth);
  const api = useApi();
  useEffect(()=>{
    const getTrnx = async()=>{
      const trxns = await api.wallet.list();
      setTransactions(trxns?.trnx ?? []);
    }
    getTrnx()
  },[])
  const addDeposit = async(amount)=>{
    const deposit = await api.wallet.add(JSON.stringify({amount,type : "deposit"}));
    setTransactions((prev)=>([deposit?.deposit,...prev]))
  }

  return (
   <div className="max-w-4xl mx-auto space-y-12 my-12">
  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6">
    <div className="space-y-2 text-left">
      <h2 className="text-4xl font-display font-black tracking-tighter uppercase">
        WALLET
      </h2>

      <p className="text-zinc-500 dark:text-zinc-400">
        Manage your funds and transactions securely.
      </p>
    </div>

    <div className="flex gap-4 w-full sm:w-auto">
      <button
        onClick={() => setIsDeposit(true)}
        className="flex-1 sm:flex-none px-8 py-3.5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 hover:scale-105 transition-transform bg-black text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-100"
      >
        <Plus className="w-4 h-4" />
        Deposit
      </button>

      {/* <button className="flex-1 sm:flex-none border px-8 py-3.5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-colors bg-white border-zinc-200 text-black hover:bg-zinc-50 dark:bg-zinc-900 dark:border-zinc-800 dark:hover:bg-zinc-800 dark:text-white">
        Withdraw
      </button> */}
    </div>
  </div>

  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
    <div className="md:col-span-1 h-fit p-8 rounded-[1.25rem] space-y-6 shadow-2xl bg-zinc-900 text-white shadow-zinc-900/10 dark:bg-zinc-950 dark:border dark:border-zinc-900 dark:shadow-black">
      <p className="text-xs font-bold uppercase tracking-widest text-zinc-400">
        Available Balance
      </p>

      <p className="text-5xl font-display font-black tracking-tighter">
        ${user?.balance.toFixed(2)}
      </p>

      <div className="pt-6 border-t space-y-4 border-white/10 dark:border-zinc-900">
        <div className="flex justify-between text-xs">
          <span className="opacity-60">Total Spent</span>
          <span className="font-bold">$1,240.00</span>
        </div>

        <div className="flex justify-between text-xs">
          <span className="opacity-60">Total Earned</span>
          <span className="font-bold">$450.00</span>
        </div>
      </div>
    </div>

    <div className="md:col-span-2 rounded-[1.25rem] border p-8 space-y-6 bg-white border-zinc-200 dark:bg-zinc-950/40 dark:border-zinc-900">
      <h3 className="font-bold text-lg flex items-center gap-2">
        <History className="w-5 h-5 text-zinc-400" />
        Transaction History
      </h3>
<div className='overflow-y-scroll scroll-thin h-[50vh] pr-4'>
      <div className="space-y-4 h-max">
        {transactions?.map((tx) => (
          <div
            key={tx.id}
            className="flex items-center justify-between py-4 border-b last:border-0 border-zinc-50 dark:border-zinc-900/40"
          >
            <div className="flex items-center gap-4">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  tx.type === "deposit"
                    ? "bg-zinc-800 text-white"
                    : "bg-zinc-100 text-zinc-800"
                }`}
              >
                {tx.type === "deposit" ? (
                  <Plus className="w-4 h-4" />
                ) : (
                  <ShoppingBag className="w-4 h-4" />
                )}
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <p className="font-bold text-sm capitalize">
                    {tx.type}
                  </p>

                  {tx.status && tx.status !== "completed" && (
                    <span
                      className={`px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-widest font-mono ${
                        tx.status === "pending"
                          ? "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                          : "bg-red-500/10 text-red-500 border border-red-500/20"
                      }`}
                    >
                      {tx.status}
                    </span>
                  )}
                </div>

                <p className="text-[10px] font-mono text-zinc-600 font-medium dark:text-zinc-400">
                  {format(
                    new Date(tx.createdAt),
                    "MMM dd, yyyy • HH:mm"
                  )}
                </p>
              </div>
            </div>

            <p
              className={`font-mono font-bold text-sm ${
                (tx.type === "deposit" || tx.type === "sale") &&
                tx.status === "completed"
                  ? "text-emerald-700 dark:text-emerald-400"
                  : "text-zinc-600 dark:text-zinc-400"
              }`}
            >
              {tx.type === "deposit" || tx.type === "sale" ? "+" : "-"}$
              {tx.amount.toFixed(2)}
            </p>
          </div>
        ))}

        {transactions.length === 0 && (
          <p className="text-center py-12 text-sm text-zinc-600 font-medium dark:text-zinc-500">
            No transactions yet.
          </p>
        )}
      </div>
</div>
    </div>
  </div>
  <AnimatePresence>
          {isDeposit && (
            <DepositModal 
              addDeposit={addDeposit}
              onClose={() => setIsDeposit(false)}
            />
          )}
        </AnimatePresence>
</div>
  );
};
export default WalletView;