import { Lock, ShieldCheck, Smartphone } from 'lucide-react'
import React from 'react'

const ResetPass = ({handleVerifyOtp,isLoading,setForm,Form}) => {
  return (
    <div className={`rounded-[1.5rem] p-6 sm:p-8 border shadow-2xl transition-all duration-500 bg-white border-zinc-150 shadow-zinc-200/40 dark:bg-zinc-950/40 dark:border-zinc-900 dark:shadow-black`}>
        {/* Title */}
        <div className="space-y-2 mb-8">
          <h3 className="text-3xl font-display font-black tracking-tighter uppercase text-zinc-900 dark:text-white">
            
            {'Verify Identity'}
          </h3>
          <p className={`text-xs text-zinc-500 font-medium dark:text-zinc-400`}>
           
            {"Key in the 6-digit passcode sent to your mail inbox."}
          </p>
        </div>
     <form onSubmit={handleVerifyOtp} className="space-y-4 text-left">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Security verification passcode</label>
              <div className="relative">
                <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input 
                  type="text"
                  required
                  maxLength={6}
                  placeholder="Enter 6-digit OTP"
                  value={Form?.enteredOtp}
                  name='enteredOtp'
                  onChange={(e) => setForm((prev)=>({...prev, [e.target.name] : e.target.value}))}
                  className={`w-full pl-11 pr-4 py-3 rounded-xl text-center font-mono text-lg font-black tracking-widest outline-none border transition-all bg-zinc-50 border-zinc-200 text-zinc-900 focus:border-black dark:bg-zinc-900 dark:border-zinc-800 dark:text-white dark:focus:border-zinc-700`}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">New Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input 
                  type="password"
                  required
                  placeholder="Set New Password"
                  value={Form?.newPassword}
                  name='newPassword'
                  onChange={(e) => setForm((prev)=>({...prev, [e.target.name] : e.target.value}))}
                  className={`w-full pl-11 pr-4 py-3 rounded-xl text-sm font-medium outline-none border transition-all dark:bg-zinc-900 dark:border-zinc-800 dark:text-white dark:focus:border-zinc-700 bg-zinc-50 border-zinc-200 text-zinc-900 focus:border-black
                  `}
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 mt-2 rounded-xl font-mono text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 duration-250 transition-all bg-black text-white dark:bg-white dark:text-zinc-950 hover:bg-zinc-900 dark:hover:bg-zinc-200"
            >
              Verify & Save Password <ShieldCheck className="w-4 h-4" />
            </button>
          </form>
      </div>
  )
}

export default ResetPass
