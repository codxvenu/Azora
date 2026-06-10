import React, { useContext, useState } from 'react'
import { Link } from 'react-router-dom'
import { 
  Mail,
  User as UserIcon, 
  ArrowRight, 
 
} from 'lucide-react';
import useApi from '@/src/lib/useFetch';
import { Auth } from '@/Utility/AuthContext';
import { useNavigate } from "react-router-dom";
const Register = ({isLoading=false}) => {
    const navigate = useNavigate()
    const [agreeTerms,setAgreeTerms] = useState(false);
    const [Form,setForm] = useState({fullname : "",email : "",password : "",confirmPassword : ""});
    const { setUser } = useContext(Auth);
      const api = useApi();
       const handleRegister = async()=>{
          const data = await api.auth.register(JSON.stringify({user : Form}));
          if(data?.status) navigate("/auth/login")
       }
  return (
    <div className={`rounded-[1.5rem] p-6 sm:p-8 border shadow-2xl transition-all duration-500 bg-white border-zinc-150 shadow-zinc-200/40 dark:bg-zinc-950/40 dark:border-zinc-900 dark:shadow-black`}>
        {/* Title */}
        <div className="space-y-2 mb-8">
          <h3 className="text-3xl font-display font-black tracking-tighter uppercase text-zinc-900 dark:text-white">
            
            { 'New Account'}
           
          </h3>
          <p className={`text-xs text-zinc-500 font-medium dark:text-zinc-400`}>
           
            {"Create an aura identity and trade instantly."}
          </p>
        </div>
    <form className="space-y-4 text-left">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Full Name</label>
              <div className="relative">
                <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input 
                  type="text"
                  required
                  placeholder="Alex Mercer"
                  name='fullname'
                  value={Form?.fullname}
                  onChange={(e) => setForm((prev)=>({...prev, [e.target.name] : e.target.value}))}
                  className={`w-full pl-11 pr-4 py-3 rounded-xl text-sm font-medium outline-none border transition-all dark:bg-zinc-900 dark:border-zinc-800 dark:text-white dark:focus:border-zinc-700 bg-zinc-50 border-zinc-200 text-zinc-900 focus:border-black'
                  `}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input 
                  type="email"
                  required
                  placeholder="name@domain.com"
                   name='email'
                  value={Form?.email}
                  onChange={(e) => setForm((prev)=>({...prev, [e.target.name] : e.target.value}))}
                  className={`w-full pl-11 pr-4 py-3 rounded-xl text-sm font-medium outline-none border transition-all dark:bg-zinc-900 dark:border-zinc-800 dark:text-white dark:focus:border-zinc-700 bg-zinc-50 border-zinc-200 text-zinc-900 focus:border-black'
                  `}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Password</label>
                <input 
                  type="password"
                  required
                  placeholder="••••••••"
                   name='password'
                  value={Form?.password}
                  onChange={(e) => setForm((prev)=>({...prev, [e.target.name] : e.target.value}))}
                  className={`w-full px-4 py-3 rounded-xl text-sm font-medium outline-none border transition-all dark:bg-zinc-900 dark:border-zinc-800 dark:text-white dark;focus:border-zinc-700 bg-zinc-50 border-zinc-200 text-zinc-900 focus:border-black'
                  `}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Confirm</label>
                <input 
                  type="password"
                  required
                  placeholder="••••••••"
                  name='confirmPassword'
                  value={Form?.confirmPassword}
                  onChange={(e) => setForm((prev)=>({...prev, [e.target.name] : e.target.value}))}
                  className={`w-full px-4 py-3 rounded-xl text-sm font-medium outline-none border transition-all dark:bg-zinc-900 dark:border-zinc-800 dark:text-white dark:focus:border-zinc-700 bg-zinc-50 border-zinc-200 text-zinc-900 focus:border-black'
                  `}
                />
              </div>
            </div>

            <div className="flex items-start gap-2 pt-2">
              <input 
                id="agree"
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="mt-1 accent-zinc-900 dark:accent-zinc-100"
              />
              <label htmlFor="agree" className="text-[11px] text-zinc-600 dark:text-zinc-400 cursor-pointer">
                I hereby consent to setup virtual ledger and bind to the AURA Marketplace transaction safety agreements.
              </label>
            </div>

            <button 
              type="button"
              disabled={isLoading}
              onClick={()=>handleRegister()}
              className="w-full py-3.5 mt-2 rounded-xl font-mono text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 duration-350 transition-all bg-black text-white dark:bg-white dark:text-zinc-950 hover:bg-zinc-900 dark:hover:bg-zinc-200 shadow-md shadow-black/10 dark:shadow-lg dark:shadow-white/5"
            >
              {isLoading ? 'Creating Core...' : 'Create Account'} <ArrowRight className="w-4 h-4" />
            </button>

            <div className="text-center pt-4 border-t border-zinc-100 dark:border-zinc-900">
              <p className="text-xs text-zinc-500">
                Already registered?{' '}
                <Link to={"/auth/login"}>
                <button 
                  type="button"
                  className="text-zinc-900 dark:text-zinc-200 font-bold hover:underline transition-colors"
                >
                  Sign In
                </button>
                </Link>
              </p>
            </div>
          </form>
      </div>
  )
}

export default Register
