import React, { useContext, useEffect, useState } from 'react'
import { 
  Mail, 
  Lock, 
  User as UserIcon, 
  ArrowRight, 
  Eye, 
  EyeOff, 
 
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

const Login = ({isLoading=false,handleGoogleLogin}) => {
  const [Form,setForm] = useState({email : "",password : ""});
  const api = useApi();
  const { setUser } = useContext(Auth);
const navigator = useNavigate();
   const handleLogin = async()=>{
      const data = await api.auth.login(JSON.stringify({user : Form}));
      if(data?.status){
        const cart = await api.cart.list();
        if(data?.user?.twoFactorEnabled){
          setUser({id : data.user._id})
          navigator("/auth/2fa")
          return
        }
        setUser({...data?.user,cart : cart?.cart} ?? {});
        navigator("/");
      }
   }
    const[showPassword,setShowPassword] = useState(false);
  
    return (
    <div className={`rounded-[1.5rem] p-6 sm:p-8 border shadow-2xl transition-all duration-500 bg-white border-zinc-150 shadow-zinc-200/40 dark:bg-zinc-950/40 dark:border-zinc-900 dark:shadow-black`}>
        {/* Title */}
        <div className="space-y-2 mb-8">
          <h3 className="text-3xl font-display font-black tracking-tighter uppercase text-zinc-900 dark:text-white">
            {'Identity Access'}
          </h3>
          <p className={`text-xs text-zinc-500 font-medium dark:text-zinc-400`}>
            {"Sign in to access your digital aura dashboard."}
          </p>
        </div>
    <form  className="space-y-4 text-left">
               <div className="space-y-1.5">
                 <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Email Address</label>
                 <div className="relative">
                   <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                   <input 
                     type="email"
                     required
                     placeholder="name@domain.com"
                     value={Form?.email}
                     onChange={(e) => setForm((prev)=>({...prev, [e.target.type] : e.target.value}))}
                     className={`w-full pl-11 pr-4 py-3 rounded-xl text-sm font-medium outline-none border transition-all dark:bg-zinc-900 dark:border-zinc-800 dark:text-white dark:focus:border-zinc-700 bg-zinc-50 border-zinc-200 text-zinc-900 focus:border-black `}
                   />
                 </div>
               </div>
   
               <div className="space-y-1.5">
                 <div className="flex justify-between items-center">
                   <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Password</label>
                   <Link to={"/auth/forgotpass"}>
                   <button 
                     type="button"
                     className="text-[10px] font-sans font-bold uppercase text-zinc-500 hover:text-black dark:text-zinc-400 dark:hover:text-white transition-colors"
                   >
                     Forgot Key?
                   </button>
                   </Link>
                 </div>
                 <div className="relative">
                   <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                   <input 
                     type={showPassword ? 'text' : 'password'}
                     required
                     placeholder="••••••••"
                     value={Form?.password}
                     onChange={(e) => setForm((prev)=>({...prev, [e.target.type] : e.target.value}))}
                     className={`w-full pl-11 pr-12 py-3 rounded-xl text-sm font-medium outline-none border transition-all bg-zinc-50 border-zinc-200 text-zinc-900 focus:border-black dark:bg-zinc-900 dark:border-zinc-800 dark:text-white dark:focus:border-zinc-700`}
                   />
                   <button
                     type="button"
                     onClick={() => setShowPassword(!showPassword)}
                     className="absolute right-4 top-1/2 -translate-y-1/2 p-0.5 text-zinc-500 hover:text-zinc-350"
                   >
                     {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                   </button>
                 </div>
               </div>
   
               <button 
                 type="button"
                 disabled={isLoading}
                 onClick={()=>handleLogin()}
                 className="w-full py-3.5 mt-2 rounded-xl font-mono text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 duration-350 transition-all bg-black text-white dark:bg-white dark:text-zinc-950 hover:bg-zinc-900 dark:hover:bg-zinc-200 shadow-md shadow-black/10 dark:shadow-lg dark:shadow-white/5"
               >
                 Log In <ArrowRight className="w-4 h-4" />
               </button>
   
               {/* Google Authentication Row */}
               <div className="relative flex py-2 items-center">
                 <span className="flex-grow border-t border-zinc-100 dark:border-zinc-900"></span>
                 <span className="flex-shrink mx-4 text-[9px] font-mono uppercase tracking-widest text-zinc-400">Or continue with</span>
                 <span className="flex-grow border-t border-zinc-100 dark:border-zinc-900"></span>
               </div>
   
               <button 
                 type="button"
                 onClick={handleGoogleLogin}
                 disabled={isLoading}
                 className={`w-full py-3.5 rounded-xl text-xs font-bold font-mono uppercase flex items-center justify-center gap-2 transition-all duration-300 border bg-white border-zinc-200 text-zinc-900 hover:bg-zinc-50 hover:border-zinc-300 shadow-sm dark:bg-zinc-900/50 dark:border-zinc-800 dark:hover:border-zinc-700 dark:text-white dark:hover:bg-zinc-900 dark:shadow-md`}
               >
                 <GoogleIcon /> Sign In with Google
               </button>
   
               <div className="text-center pt-4 border-t border-zinc-100 dark:border-zinc-900">
                 <p className="text-xs text-zinc-500">
                   Don't have an identity yet?{' '}
                  <Link to={"/auth/register"}>
                  <button 
                     type="button"
                     className="text-zinc-900 dark:text-zinc-200 font-bold hover:underline transition-all"
                   >
                     Register Here
                   </button>
                  </Link> 
                 </p>
               </div>
             </form>
      </div>
  )
}

export default Login
