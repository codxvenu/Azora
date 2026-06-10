import { createContext, useEffect, useState } from "react";
import useApi from "@/src/lib/useFetch";
import { motion } from "motion/react";
export const Auth = createContext();
const AuthContext = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const api = useApi();
  useEffect(() => {
    if(user) return
    const handleMe = async () => {
      setLoading(true);
      const data = await api.auth.me();
      const cart = await api.cart.list();
      if(!cart || !data) {
        setLoading(false);
        return 
      }
      setUser({...data?.user,cart : cart?.cart} ?? null);
      setTimeout(() => {
        setLoading(false);
      }, 3000);
    };
    handleMe();
  }, []);

   if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <motion.div 
          animate={{ scale: [1, 1.1, 1] }} 
          transition={{ repeat: Infinity, duration: 2 }}
          className="text-4xl font-display font-bold tracking-tighter"
        >
          AURA
        </motion.div>
      </div>
    );
  }
  return <Auth.Provider value={{ user, setUser }}>{children}</Auth.Provider>;
};
export default AuthContext;
