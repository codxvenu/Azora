import React, { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  CreditCard, 
  Bitcoin, 
  ShieldCheck, 
  CheckCircle2, 
  Lock, 
  Copy, 
  Check, 
  Trash2, 
  Plus, 
  Minus, 
  Gift, 
  AlertCircle,
  QrCode,
  Sparkles,
  Info,
  ShoppingBag
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Auth } from '@/Utility/AuthContext';
import useApi from '../lib/useFetch';
import { useNotification } from '../lib/useNotification';

const AVAILABLE_COUPONS = {
  'AURA15': 15,
  'WELCOME20': 20,
  'CRYPTO5': 5,
};


 const CheckoutView = ({
  isDark,
  onBack,
  onRemoveItem,
  onUpdateQuantity,
  onSuccess,
  walletBalance = 0,
}) => {

 const {user,setUser} = useContext(Auth);
 const api = useApi();
 const giftCards = [];
 const { showNotification } = useNotification()
 const navigate = useNavigate()
  const handledelete = async(id) =>{
    await api.cart.delete(id)
    setUser((prev)=>({...prev,cart : prev.cart.filter((f)=>f.productId._id !== id) ?? []}));
  }
  const handleQuantityInc = async(id)=>{
    await api.cart.quantityInc(id);
    setUser((prev)=>({...prev,cart : prev.cart.map(itm=>itm.productId._id == id ? {...itm,quantity : itm.quantity + 1} : itm)}))
  }
  const handleQuantityDec = async(id)=>{
    const itm = user?.cart?.find(f=>f.productId._id == id);
    console.log(itm)
    await api.cart.quantityDec(id);
     (itm?.quantity == 1) 
      ? setUser((prev)=>({...prev,cart : prev.cart.filter(f=>f.productId._id !== id) ?? []})) 
      : 
    setUser((prev)=>({...prev,cart : prev.cart.map(itm=>itm.productId._id == id ? {...itm,quantity : itm.quantity - 1} : itm)}));
  }
   const handleOrder = async () => {
        if(user?.balance - finalTotal < 0) return showNotification("Low Balance","info");
        setIsProcessing(true);
        const ids = user?.cart?.map(o=>o.productId._id);
        const orderKeys = user?.cart?.map(o=>o.productId.demo);
        const order = await api.order.add(JSON.stringify({productIds : ids , finalTotal,orderKeys}));
        if(!order?.status) return
        setUser((prev)=>({...prev,balance : prev.balance - finalTotal,cart : []}))
        setIsProcessing(false);
        navigate("/orders")
    };
      const applyCoupon = () => {
    const cleanCode = couponCode.trim().toUpperCase();
    if (cleanCode in AVAILABLE_COUPONS) {
      setActiveCoupon({
        code: cleanCode,
        percent: AVAILABLE_COUPONS[cleanCode]
      });
      setCouponError('');
      setCouponCode('');
    } else {
      setCouponError('Invalid coupon code. Try WELCOME20 or AURA15!');
    }
  };

  const removeCoupon = () => {
    setActiveCoupon(null);
  };
  const [couponCode, setCouponCode] = useState('');
  const [activeCoupon, setActiveCoupon] = useState();
  const [couponError, setCouponError] = useState('');
  // Loading states
  const [isProcessing, setIsProcessing] = useState(false);
  const [cryptoStatus, setCryptoStatus] = useState('awaiting');
  const [cryptoTimer, setCryptoTimer] = useState(900); // 15 mins

  // Subtotal, Discount, & Total Calculations
  const subtotal = user?.cart?.reduce((sum, item) => sum + (item?.productId?.finalPrice * item.quantity), 0);
  const originalSubtotal = user?.cart?.reduce((sum, item) => sum + (item?.productId?.realPrice * item.quantity), 0);
  const shopDiscount = originalSubtotal - subtotal;
  
  let couponDiscount = 0;
  if (activeCoupon) {
    couponDiscount = (subtotal * activeCoupon.percent) / 100;
  }
  
  const finalTotal = Math.max(0, subtotal - couponDiscount);

  // Address lookup map for mockup QR Addresses
  const cryptoAddresses = {
    USDT: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
    BTC: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
    ETH: '0xDe9F3Be63640b1ea47b1940E9D5AAf118E13AcA3',
    SOL: 'GvT9zK1A1B4fC5D6E7fG8hI9jK0lMnoPqRstUvwXyz',
  };

  // Border card styles wrapper
  // "light border in light mode and no border for card style"
  const sectionClass = `rounded-3xl p-6 sm:p-8 space-y-6 transition-all duration-300 dark:bg-zinc-950 dark:border-none dark:shadow-none dark:text-white bg-white border border-zinc-200/80 shadow-sm text-zinc-900'
  `;

  return (
    <div className="max-w-6xl mx-auto space-y-8 my-8">
      {/* Back Header */}
      <div className="flex giftCards-center justify-between border-b pb-4 border-zinc-200/60 dark:border-zinc-800/40">
       <Link to={"/"}>
       
        <button 
          onClick={onBack}
          className="flex giftCards-center gap-2 hover:opacity-85 font-mono text-xs uppercase tracking-wider text-zinc-500 dark:text-zinc-400 hover:text-black dark:hover:text-white"
        >
          <ArrowLeft className="w-4 h-4" /> Return to Browse
        </button>
        </Link>
        <span className="text-xs font-bold font-mono text-zinc-500">SECURE BILLING LEDGER</span>
      </div>

    {!!user?.cart?.length &&  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 giftCards-start ">
        {/* Left billing & payment section (7 cols) */}
        <div className="lg:col-span-7 space-y-6 text-left overflow-y-scroll scroll-thin  h-[70vh] ">
         {user?.cart?.map((item) => (
                <div key={item.productId.id} className="flex gap-4  backdrop-blur-2xl">
                  <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-zinc-200/50 dark:border-zinc-800">
                    <img src={item.productId.image} alt={item.productId.brand} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                  <div className="flex-1 min-w-0 space-y-0.5">
                    <div className="flex justify-between giftCards-start gap-2">
                      <h4 className="font-bold text-xs line-clamp-2 leading-tight">{item.productId.brand}</h4>
                      <button 
                        onClick={() => handledelete(item.productId._id)}
                        className="p-1 text-zinc-400 hover:text-red-500 transition-colors shrink-0"
                        title="Remove Item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <p className={`text-[10px] font-mono font-bold uppercase tracking-wide opacity-50`}>
                      {item.productId.category}
                    </p>
                    <div className="flex justify-between giftCards-center pt-1.5">
                      <div className="flex giftCards-center gap-2 border border-zinc-200/60 dark:border-zinc-800 rounded-md py-0.5 px-1.5">
                        <button 
                          onClick={() => handleQuantityDec(item.productId._id)}
                          className="text-zinc-400 hover:text-black dark:hover:text-white"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-mono font-bold px-1 min-w-[12px] text-center">
                          {item.quantity}
                        </span>
                        <button 
                          onClick={() => handleQuantityInc(item.productId._id)}
                          className="text-zinc-400 hover:text-black dark:hover:text-white"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <p className="font-mono text-xs font-bold text-black dark:text-white">
                        ${(item.productId.finalPrice * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
        </div>

        {/* Right Cart Summary & Coupon Section (5 cols) */}
        <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-6">
          <div className={sectionClass}>
            <div>
              <h3 className="text-xl font-display font-medium tracking-tight">Order Summary</h3>
              <p className="text-xs text-stone-500 dark:text-zinc-500 mt-1">
                Verify giftCards and apply coupon discounts before payment.
              </p>
            </div>

          

            {/* Coupon Application Card Area */}
            <div className="space-y-3 pt-2">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 block">Apply Promo Coupon</span>

              {activeCoupon ? (
                <div className="flex giftCards-center justify-between p-3.5 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 text-emerald-500">
                  <div className="flex giftCards-center gap-2 text-xs">
                    <Gift className="w-4 h-4 shrink-0" />
                    <div>
                      <p className="font-bold tracking-wider uppercase">{activeCoupon.code}</p>
                      <p className="text-[10px] text-emerald-600 dark:text-emerald-400">Additional {activeCoupon.percent}% Off Activated!</p>
                    </div>
                  </div>
                  <button 
                    onClick={removeCoupon}
                    className="text-xs font-mono font-bold hover:underline opacity-80"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Gift className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
                    <input
                      type="text"
                      placeholder="e.g. WELCOME20"
                      value={couponCode}
                      onChange={(e) => {
                        setCouponCode(e.target.value);
                        setCouponError('');
                      }}
                      className={`w-full pl-10 pr-4 py-3 rounded-2xl outline-none border text-xs font-medium transition-all dark:bg-zinc-900 dark:border-zinc-800 dark:text-white dark:focus:border-zinc-600 dark:font-mono dark:uppercase bg-white border-zinc-250 text-zinc-900 focus:border-zinc-400 shadow-sm uppercase
                      `}
                    />
                  </div>
                  <button
                    onClick={applyCoupon}
                    className="px-5 py-3 rounded-2xl text-xs font-bold font-mono uppercase border transition-colors bg-black dark:bg-zinc-900 text-white dark:text-white hover:bg-zinc-800 dark:hover:bg-zinc-850 border-0 dark:border-zinc-800"
                  >
                    Apply
                  </button>
                </div>
              )}

              {couponError && (
                <p className="text-[10px] text-rose-500 font-mono flex giftCards-center gap-1">
                  <AlertCircle className="w-3 h-3 shrink-0" /> {couponError}
                </p>
              )}
            </div>

            {/* Total Balance Sheet */}
            <div className="space-y-3 pt-4 border-t border-dashed border-zinc-200/15 dark:border-zinc-850">
              <div className="flex justify-between text-xs">
                <span className="text-zinc-500">Retail Amount</span>
                <span className="font-mono text-zinc-400 line-through">${originalSubtotal?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-zinc-500">Shop Discount</span>
                <span className="font-mono text-emerald-500 font-bold">-${shopDiscount?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-zinc-500">Ledger Subtotal</span>
                <span className="font-mono font-bold">${subtotal?.toFixed(2)}</span>
              </div>

              {activeCoupon && (
                <div className="flex justify-between text-xs text-emerald-500 font-medium">
                  <span>Coupon Discount ({activeCoupon.percent}%)</span>
                  <span className="font-mono font-bold">-${couponDiscount?.toFixed(2)}</span>
                </div>
              )}

              {/* Net total */}
              <div className="border-t pt-3 flex justify-between giftCards-end items-center">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 block mb-0.5">NET TOTAL</span>
                  <span className="text-2xl font-display font-black tracking-wide text-black dark:text-white leading-none">
                    ${finalTotal?.toFixed(2)}
                  </span>
                </div>
                <div className="flex giftCards-center h-fit gap-1 text-[10px] text-emerald-500 font-bold bg-emerald-500/5 px-2 py-0.5 rounded border border-emerald-500/10">
                  <ShieldCheck className="w-3 h-3" />
                  <span>SECURED</span>
                </div>
              </div>
            </div>
  <button
                  type="button"
                  onClick={()=>handleOrder()}
                  disabled={isProcessing || user?.cart?.length === 0}
                  className="w-full mt-4 py-4 rounded-2xl font-bold text-sm transition-all focus:scale-98 flex items-center justify-center gap-2 bg-black dark:bg-white text-white dark:text-black hover:opacity-90 disabled:opacity-50 shadow-lg"
                >
                  {isProcessing ? (
                    <>
                      <div className="w-5 h-5 rounded-full border-2 border-current border-t-transparent animate-spin mr-1" />
                      Validating Payment Credentials...
                    </>
                  ) : (
                    <>Pay ${finalTotal.toFixed(2)} Instantly</>
                  )}
                </button>
          </div>

          {/* Secure strip logo factors */}
          <div className="flex justify-center giftCards-center gap-4 opacity-35 select-none pointer-events-none text-[9px] font-mono font-bold">
            <Lock className="w-3.5 h-3.5" />
            <span>AES-256 BANK-GRADE ENCRYPTION</span>
          </div>

        </div>

      </div>}
      {!user?.cart?.length &&  <div className="py-20 text-center space-y-4">
                  <ShoppingBag className="w-12 h-12 text-zinc-400 mx-auto" />
                  <p className="text-zinc-500 font-medium">You haven't added any item yet.</p>
                  <Link to="/">
                    <button 
                      className={`font-mono text-xs font-bold uppercase tracking-widest underline underline-offset-4 dark:text-white text-black
                      `}
                    >
                      Browse
                    </button>
                  </Link>
                </div>}
    </div>
  );
};

const Badge = ({ children, variant = 'primary', className }) => (
  <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border ${
    variant === 'emerald'
      ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-500'
      : 'bg-zinc-100 border-zinc-200 text-zinc-800 dark:bg-zinc-900 dark:border-zinc-805 dark:text-zinc-400'
  } ${className}`}>
    {children}
  </span>
);
 export default CheckoutView;