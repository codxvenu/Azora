import { Auth } from '@/Utility/AuthContext';
import { Theme } from '@/Utility/ThemeContext';
import { ArrowRight, LogOut, Menu, Moon, ShoppingCart, Sun, UserIcon, Wallet, X } from 'lucide-react';
import React, { useContext } from 'react'
import { Link , useNavigate} from 'react-router-dom';
import useApi from '../lib/useFetch';

const NavButton = ({ children, active, onClick ,to}) => (
  <Link to={to}>
  <button 
    onClick={onClick}
    className={`text-sm font-bold transition-all ${
      active 
        ?  "dark:text-white text-black" 
        : "dark:text-zinc-500 dark:hover:text-zinc-300 text-zinc-400 hover:text-zinc-600"
    }`}
  >
    {children}
  </button>
  </Link>
);
const Navbar = () => {
    const {isDark,setIsDark} = useContext(Theme);
    const {user,setUser} = useContext(Auth);
    const navigator = useNavigate()
    const api = useApi();
    const handleLogout = async() =>{
      await api.auth.logout();
      setUser(null);
      navigator("/");
    }
  return (
     <nav className={`sticky top-0 z-50 backdrop-blur-xl border-b transition-colors duration-500 dark:bg-zinc-950/80 dark:border-zinc-900 dark:text-white bg-white/80 border-zinc-100`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between h-16 items-center">
                <div className="flex items-center gap-8">
                  <button 
                    className={`text-2xl font-display font-black tracking-tighter hover:opacity-80 transition-opacity dark:text-white text-zinc-950`}
                  >
                    AURA
                  </button>
                  
                  <div className="hidden md:flex items-center gap-6">
                    <NavButton active={window.location.href.includes("/")} to={"/"}>Browse</NavButton>
                    <NavButton active={window.location.href.includes("/orders")} to={"/orders"}>Orders</NavButton>
                    {user?.role === "admin" && <NavButton active={window.location.href.includes("/seller")}>Sell</NavButton>}
                    {user?.role === "admin" && <NavButton active={window.location.href.includes("/admin")} >Admin</NavButton>}
                  </div>
                </div>
    
                <div className="flex items-center gap-4">
                 
    
                  {/* Cart Button */}
                 {!!user &&
                 <Link to={"/cart"}>
                 <button 
                   
                    className={`p-2 rounded-xl border transition-all duration-300 flex items-center justify-center relative dark:bg-zinc-900 dark:border-zinc-800 dark:text-white dark:hover:border-zinc-700 bg-zinc-50 border-zinc-200 text-zinc-500 hover:text-black hover:bg-zinc-100 hover:border-zinc-300 `}
                    title="Your Cart / Checkout"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    {
                    user?.cart?.length > 0 && (
                      <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white font-mono text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center animate-bounce">
                        {user?.cart?.reduce((sum, item) => sum + item?.quantity, 0)}
                      </span>
                    )}
                  </button>
                 </Link> 
                  }
    
                  {/* Day / Night Mode Toggler */}
                  <button 
                    onClick={() => setIsDark(!isDark)}
                    className={`p-2 rounded-xl border  flex items-center justify-center
                     dark:bg-zinc-900 dark:border-zinc-800 dark:text-amber-400 dark:hover:text-amber-300 dark:hover:border-zinc-700 bg-zinc-50 border-zinc-200 text-zinc-500 hover:text-black hover:bg-zinc-100 hover:border-zinc-300
                    `}
                    
                  >
                    <Sun className="w-4 h-4 text-amber-400 fill-amber-400/20 dark:block hidden" /> 
                     <Moon className="w-4 h-4 fill-zinc-200 dark:hidden" />
                  </button>
    
                  {!!user ? (
    
                    <div className="flex items-center gap-4">
                      <Link to="wallet">
                      <button 
                       
                        className={`hidden sm:flex items-center gap-2 px-4 py-2 rounded-2xl border transition-all group
                          dark:bg-zinc-900 dark:hover:bg-zinc-800 dark:border-zinc-800 dark:text-white
                            bg-zinc-50 hover:bg-zinc-100 border-zinc-200
                        ` }>
                        <Wallet className={`w-4 h-4 transition-colors dark:text-zinc-400 dark:group-hover:text-white text-zinc-500 group-hover:text-black`} />
                        <span className="font-bold text-sm">${user?.balance?.toFixed(2) ?? 0}</span>
                      </button>
                      </Link>
                      <div className="relative group">
                        <button className={`w-10 h-10 rounded-xl flex items-center justify-center border border-zinc-200 overflow-hidden transition-colors dark:bg-zinc-900 dark:border-zinc-800 bg-zinc-50 border-zinc-200
                        `}>
                          {user.img ? (
                            <img src={true} alt="Avatar" className="w-full h-full object-cover" />
                          ) : (
                            <UserIcon className={`w-5 h-5 dark:text-zinc-400 text-zinc-500`} />
                          )}
                        </button>
                        <div className={`absolute right-0 mt-2 w-48 rounded-2xl shadow-xl border py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all dark:bg-zinc-950 dark:border-zinc-900 dark:shadow-black/80 dark:text-white bg-white border-zinc-100
                        `}>
                          <Link to={"/profile"}>
                          <button 
                            className={`w-full px-4 py-2 text-left text-sm flex items-center gap-2 transition-colors dark:hover:bg-zinc-900 dark:text-zinc-300 hover:bg-zinc-50 text-zinc-700`}
                          >
                            <UserIcon className="w-4 h-4" /> Profile
                          </button>
                          </Link>
                          <button 
                            onClick={()=>handleLogout()}
                            className={`w-full px-4 py-2 text-left text-sm flex items-center gap-2 text-red-600 transition-colors dark:hover:bg-zinc-900/60 hover:bg-zinc-50'}`}
                          >
                            <LogOut className="w-4 h-4" /> Logout
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <Link to="/auth/login">

                    <button 
                     
                      className={`px-6 py-2 rounded-2xl font-bold text-sm transition-all dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200 bg-black text-white hover:bg-zinc-850 `}
                    >
                      Sign In
                    </button>
                    </Link>
                  )}
                  
                  <button className={`md:hidden p-1 rounded-lg dark:text-white dark:hover:bg-zinc-900 text-zinc-950 hover:bg-zinc-100`} onClick={() => setIsMenuOpen(!isMenuOpen)}>
                    {true ? <X /> : <Menu />}
                  </button>
                </div>
              </div>
            </div>
          </nav>
  )
}

export default Navbar
