import { ArrowRight, CheckCircle2 } from 'lucide-react'
import React from 'react'
import { Link } from 'react-router-dom'

const ResetSuccess = () => {
  return (
    <div className={`rounded-[1.5rem] p-6 sm:p-8 border shadow-2xl transition-all duration-500 bg-white border-zinc-150 shadow-zinc-200/40 dark:bg-zinc-950/40 dark:border-zinc-900 dark:shadow-black`}>
        {/* Title */}
        <div className="space-y-2 mb-8">
          <h3 className="text-3xl font-display font-black tracking-tighter uppercase text-zinc-900 dark:text-white">
            {'Reset Complete'}
          </h3>
          <p className={`text-xs text-zinc-500 font-medium dark:text-zinc-400`}>
          
            {"Your password credentials have been updated."}
          </p>
        </div>
    <div className="space-y-6 text-center py-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto text-emerald-500 animate-bounce">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h4 className="font-bold text-lg">Credentials Repaired</h4>
              <p className={`text-xs text-zinc-400 dark:text-zinc-500`}>
                Your access password has been secure-updated. Please login with your updated token key.
              </p>
            </div>
            <Link to={"/auth/login"}>
            <button 
              
              className={`w-full py-3 rounded-xl font-mono text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 duration-200 bg-black text-white hover:bg-zinc-900 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200`}
            >
              Proceed to Sign In <ArrowRight className="w-4 h-4" />
            </button>
            </Link>
          </div>
      </div>
  )
}

export default ResetSuccess
