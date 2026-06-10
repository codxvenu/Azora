import React, { useContext, useEffect, useState } from 'react'
import { 
  Mail, 
  Lock, 
  User as UserIcon, 
  ArrowRight, 
  Eye, 
  EyeOff,
  Smartphone,
  ShieldCheck,
  ChevronLeft, 
 
} from 'lucide-react';
import { Link } from 'react-router-dom';
import useApi from '@/src/lib/useFetch';
import { Auth } from '@/Utility/AuthContext';
  import { useNavigate } from "react-router-dom";


const GoogleIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
  </svg>
);

const twofa = ({isLoading=false}) => {
  const [Form,setForm] = useState({email : "",password : ""});
  const api = useApi();
  const { user,setUser } = useContext(Auth);
const navigator = useNavigate();
    const[twoFactorPin,setTwoFactorPin] = useState("");
  const handleVerifySetup = async (e) => {
    e.preventDefault();
    if (twoFactorPin.length !== 6 || isNaN(Number(twoFactorPin))) {
      showNotification('Please enter a valid 6-digit verification code.', 'error');
      return;
    }
      const data = await api.auth.twofalogin(JSON.stringify({token : twoFactorPin,userId : user?.id}));
      if(!data?.success) return
      const cart = await api.cart.list();
      setUser({...data?.user,cart : cart?.cart} ?? {});
      navigator("/")
  }
    return (
    <div className={`rounded-[1.5rem] p-6 sm:p-8 border shadow-2xl transition-all duration-500 bg-white border-zinc-100 shadow-zinc-200/40 dark:bg-zinc-950/40 dark:border-zinc-900 dark:shadow-black`}>
        {/* Title */}
        <div className="space-y-2 mb-8">
          <h3 className="text-3xl font-display font-black tracking-tighter uppercase text-zinc-900 dark:text-white">
             { 'MFA CHALLENGE'}
          </h3>
          <p className={`text-xs text-zinc-500 font-medium dark:text-zinc-400`}>
           {"Please input the 6-digit passcode from your secure mobile Authenticator app."}
          </p>
        </div>
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              if (twoFactorPin.length !== 6 || isNaN(Number(twoFactorPin))) {
                showNotification('Please enter a valid 6-digit security code.', 'error');
                return;
              }
              showNotification('MFA verification successful! Access granted.', 'success');
              onSuccess();
            }} 
            className="space-y-6 text-left"
          >
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Security Verification PIN</label>
              <div className="relative">
                <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input 
                  type="text"
                  required
                  maxLength={6}
                  placeholder="Enter 6-digit Code"
                  value={twoFactorPin}
                  onChange={(e) => setTwoFactorPin(e.target.value.replace(/\D/g, ''))}
                  className={`w-full pl-11 pr-4 py-3.5 rounded-xl text-center font-mono text-2xl font-black tracking-[0.2em] outline-none border transition-all
                     dark:bg-zinc-900 dark:border-zinc-800 dark:text-white dark:focus:border-zinc-700
                      bg-zinc-50 border-zinc-200 text-zinc-900 focus:border-black
                  `}
                />
              </div>
              <p className={`text-[10px] text-center dark:text-zinc-500 text-zinc-400 mt-1`}>
                * Feed in any 6-digit code to complete verification for testing.
              </p>
            </div>

            <button 
              type="button"
              onClick={handleVerifySetup}
              className={`w-full py-3.5 mt-2 rounded-xl font-mono text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 duration-250 transition-all
                dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200 bg-black text-white hover:bg-zinc-900
              `}
            >
              Verify Secure Access <ShieldCheck className="w-4 h-4" />
            </button>

            <div className="text-center pt-2">
              <button 
                type="button"
                onClick={() => handleVerifySetup()}
                className="text-xs text-zinc-400 hover:text-white flex items-center gap-1.5 mx-auto font-bold uppercase font-mono tracking-widest"
              >
                <ChevronLeft className="w-4 h-4" /> Use different profile session
              </button>
            </div>
          </form>
      </div>
  )
}

export default twofa
