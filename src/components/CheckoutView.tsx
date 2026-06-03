import React, { useState, useEffect } from 'react';
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
  Info
} from 'lucide-react';
import { GiftCard } from '../types';

interface CheckoutViewProps {
  items: { card: GiftCard; quantity: number }[];
  isDark?: boolean;
  onBack: () => void;
  onRemoveItem: (id: string) => void;
  onUpdateQuantity: (id: string, qty: number) => void;
  onSuccess: (orderId: string, itemsPaid: { card: GiftCard; quantity: number }[]) => void;
  walletBalance?: number;
}

const AVAILABLE_COUPONS: Record<string, number> = {
  'AURA15': 15,
  'WELCOME20': 20,
  'CRYPTO5': 5,
};

type PaymentMethod = 'card' | 'crypto';

export const CheckoutView = ({
  items,
  isDark,
  onBack,
  onRemoveItem,
  onUpdateQuantity,
  onSuccess,
  walletBalance = 0,
}: CheckoutViewProps) => {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  const [couponCode, setCouponCode] = useState('');
  const [activeCoupon, setActiveCoupon] = useState<{ code: string; percent: number } | null>(null);
  const [couponError, setCouponError] = useState('');
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [cryptoCurrency, setCryptoCurrency] = useState<'BTC' | 'ETH' | 'USDT' | 'SOL'>('USDT');

  // Card details state
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardBrand, setCardBrand] = useState<'visa' | 'mastercard' | 'amex' | 'generic'>('generic');

  // Loading states
  const [isProcessing, setIsProcessing] = useState(false);
  const [cryptoStatus, setCryptoStatus] = useState<'awaiting' | 'verifying' | 'confirmed'>('awaiting');
  const [cryptoTimer, setCryptoTimer] = useState(900); // 15 mins

  // Subtotal, Discount, & Total Calculations
  const subtotal = items.reduce((sum, item) => sum + (item.card.finalPrice * item.quantity), 0);
  const originalSubtotal = items.reduce((sum, item) => sum + (item.card.realPrice * item.quantity), 0);
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

  const getCryptoRates = () => {
    switch (cryptoCurrency) {
      case 'BTC': return (finalTotal / 95000).toFixed(6);
      case 'ETH': return (finalTotal / 3200).toFixed(5);
      case 'SOL': return (finalTotal / 185).toFixed(3);
      default: return finalTotal.toFixed(2);
    }
  };

  // Card number formatter and brand detector
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 16) value = value.slice(0, 16);
    
    // Detect Brand
    if (value.startsWith('4')) {
      setCardBrand('visa');
    } else if (/^5[1-5]/.test(value)) {
      setCardBrand('mastercard');
    } else if (/^3[47]/.test(value)) {
      setCardBrand('amex');
    } else {
      setCardBrand('generic');
    }

    const formatted = value.match(/.{1,4}/g)?.join(' ') || value;
    setCardNumber(formatted);
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 4) value = value.slice(0, 4);
    if (value.length >= 2) {
      value = value.slice(0, 2) + '/' + value.slice(2);
    }
    setExpiryDate(value);
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, cardNumber.startsWith('37') ? 4 : 3);
    setCvv(value);
  };

  // Handle Coupon Apply
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

  // Crypto Timer tick
  useEffect(() => {
    if (paymentMethod !== 'crypto') return;
    const interval = setInterval(() => {
      setCryptoTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [paymentMethod]);

  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Copy Crypto Address
  const copyAddress = () => {
    navigator.clipboard.writeText(cryptoAddresses[cryptoCurrency]);
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 2000);
  };

  // Handle Crypto Live Checkout Simulation States
  useEffect(() => {
    if (paymentMethod === 'crypto' && cryptoStatus === 'awaiting') {
      const waitTimer = setTimeout(() => {
        setCryptoStatus('verifying');
        const confirmTimer = setTimeout(() => {
          setCryptoStatus('confirmed');
          const successTimer = setTimeout(() => {
            const mockOrderId = 'AURA-' + Math.random().toString(36).substring(2, 10).toUpperCase();
            onSuccess(mockOrderId, items);
          }, 1500);
          return () => clearTimeout(successTimer);
        }, 3000);
        return () => clearTimeout(confirmTimer);
      }, 8000); // wait 8 seconds before verifying
      return () => clearTimeout(waitTimer);
    }
  }, [paymentMethod, cryptoStatus]);

  // Handle Pay Form Submission
  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;
    
    // Credit card check
    if (paymentMethod === 'card') {
      if (cardNumber.replace(/\s/g, '').length < 16) return;
      if (expiryDate.length < 5) return;
      if (cvv.length < 3) return;
      if (!cardHolder.trim()) return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      const mockOrderId = 'AURA-' + Math.random().toString(36).substring(2, 10).toUpperCase();
      onSuccess(mockOrderId, items);
    }, 2500);
  };

  // Border card styles wrapper
  // "light border in light mode and no border for card style"
  const sectionClass = `rounded-3xl p-6 sm:p-8 space-y-6 transition-all duration-300 ${
    isDark 
      ? 'bg-zinc-950 border-none shadow-none text-white' 
      : 'bg-white border border-zinc-200/80 shadow-sm text-zinc-900'
  }`;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Back Header */}
      <div className="flex items-center justify-between border-b pb-4 border-zinc-200/60 dark:border-zinc-800/40">
        <button 
          onClick={onBack}
          className={`flex items-center gap-2 hover:opacity-85 font-mono text-xs uppercase tracking-wider ${
            isDark ? 'text-zinc-400 hover:text-white' : 'text-zinc-500 hover:text-black'
          }`}
        >
          <ArrowLeft className="w-4 h-4" /> Return to Cart / Browse
        </button>
        <span className="text-xs font-bold font-mono text-zinc-500">SECURE BILLING LEDGER</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left billing & payment section (7 cols) */}
        <div className="lg:col-span-7 space-y-6 text-left">
          
          {/* Card Section 1: Payment Method Selection */}
          <div className={sectionClass}>
            <div>
              <h3 className="text-xl font-display font-medium tracking-tight">Payment Methods</h3>
              <p className={`text-xs ${isDark ? 'text-zinc-500' : 'text-stone-500'} mt-1`}>
                Choose your preferred mechanism to settle ledger dues.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Credit/Debit Card Selection */}
              <button
                onClick={() => setPaymentMethod('card')}
                className={`py-4 px-6 rounded-2xl border-2 flex flex-col items-center gap-2.5 transition-all text-center ${
                  paymentMethod === 'card'
                    ? (isDark ? 'border-white bg-white/5 text-white' : 'border-black bg-zinc-50 text-black')
                    : (isDark ? 'border-zinc-850 hover:border-zinc-800 text-zinc-400 bg-transparent' : 'border-zinc-200 hover:border-zinc-300 text-zinc-500 bg-transparent')
                }`}
              >
                <CreditCard className="w-6 h-6" />
                <div className="text-sm font-bold">Credit/Debit Card</div>
              </button>

              {/* Cryptocurrency Selection */}
              <button
                onClick={() => {
                  setPaymentMethod('crypto');
                  setCryptoStatus('awaiting');
                  setCryptoTimer(900);
                }}
                className={`py-4 px-6 rounded-2xl border-2 flex flex-col items-center gap-2.5 transition-all text-center ${
                  paymentMethod === 'crypto'
                    ? (isDark ? 'border-white bg-white/5 text-white' : 'border-black bg-zinc-50 text-black')
                    : (isDark ? 'border-zinc-850 hover:border-zinc-800 text-zinc-400 bg-transparent' : 'border-zinc-200 hover:border-zinc-300 text-zinc-500 bg-transparent')
                }`}
              >
                <Bitcoin className="w-6 h-6" />
                <div className="text-sm font-bold">Cryptocurrency</div>
              </button>
            </div>
          </div>

          {/* Card Section 2: Form Input depending on Choice */}
          {paymentMethod === 'card' ? (
            <form onSubmit={handleCheckoutSubmit} className={sectionClass}>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-display font-medium tracking-tight">Card Information</h3>
                  <p className={`text-xs ${isDark ? 'text-zinc-500' : 'text-stone-500'} mt-1`}>
                    Encrypted through high-security AES-256 standard protocols.
                  </p>
                </div>
                <div className="flex gap-1.5 opacity-60">
                  <CreditCard className="w-4 h-4" />
                  <Lock className="w-4 h-4" />
                </div>
              </div>

              {/* Live Interactive Card Preview */}
              <div className="relative w-full aspect-[1.58/1] max-w-sm mx-auto overflow-hidden rounded-3xl bg-gradient-to-br from-zinc-800 via-zinc-900 to-black text-white p-6 justify-between flex flex-col shadow-xl border border-zinc-800 select-none">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <span className="text-[9px] font-mono font-bold tracking-widest text-zinc-500">CARD LEDGER</span>
                    <h4 className="font-display font-bold tracking-tight text-sm">AURA EXCLUSIVE</h4>
                  </div>
                  {cardBrand === 'visa' && <span className="font-mono text-lg italic font-black text-blue-400">VISA</span>}
                  {cardBrand === 'mastercard' && <span className="font-mono text-lg italic font-black text-rose-500">MC</span>}
                  {cardBrand === 'amex' && <span className="font-mono text-lg italic font-black text-emerald-400">AMEX</span>}
                  {cardBrand === 'generic' && <div className="w-6 h-6 rounded-full border border-zinc-600 flex items-center justify-center">●</div>}
                </div>

                <div className="space-y-4">
                  {/* Card Number display */}
                  <div className="font-mono text-lg sm:text-xl tracking-[0.25em] text-zinc-100 font-bold">
                    {cardNumber || '•••• •••• •••• ••••'}
                  </div>

                  <div className="flex justify-between items-end">
                    <div className="space-y-0.5">
                      <span className="text-[8px] font-mono text-zinc-500 block uppercase">Card Holder</span>
                      <p className="text-xs uppercase font-bold tracking-wider truncate max-w-[150px]">
                        {cardHolder || 'Your Name'}
                      </p>
                    </div>
                    <div className="flex gap-4">
                      <div className="space-y-0.5">
                        <span className="text-[8px] font-mono text-zinc-500 block uppercase">Expires</span>
                        <p className="font-mono text-xs font-bold">{expiryDate || 'MM/YY'}</p>
                      </div>
                      <div className="space-y-0.5">
                        <span className="text-[8px] font-mono text-zinc-500 block uppercase">CVV</span>
                        <p className="font-mono text-xs font-bold">{'•'.repeat(cvv.length) || '•••'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Form Input Fields */}
              <div className="space-y-4 pt-2">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 block mb-1">Cardholder Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Marcus Sterling"
                    value={cardHolder}
                    onChange={(e) => setCardHolder(e.target.value)}
                    className={`w-full px-4 py-3 rounded-2xl outline-none border text-sm font-medium transition-all ${
                      isDark 
                        ? 'bg-zinc-900 border-zinc-800 text-white focus:border-zinc-650 font-mono' 
                        : 'bg-white border-zinc-200 text-zinc-900 focus:border-zinc-400 font-sans shadow-sm'
                    }`}
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 block mb-1">Card Number</label>
                  <input
                    type="text"
                    required
                    placeholder="4000 1234 5678 9010"
                    value={cardNumber}
                    onChange={handleCardNumberChange}
                    className={`w-full px-4 py-3 rounded-2xl outline-none border text-sm font-medium transition-all ${
                      isDark 
                        ? 'bg-zinc-900 border-zinc-800 text-white focus:border-zinc-650 font-mono' 
                        : 'bg-white border-zinc-200 text-zinc-900 focus:border-zinc-400 font-sans shadow-sm'
                    }`}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 block mb-1">Expiration Date</label>
                    <input
                      type="text"
                      required
                      placeholder="MM/YY"
                      value={expiryDate}
                      onChange={handleExpiryChange}
                      className={`w-full px-4 py-3 rounded-2xl outline-none border text-sm font-medium transition-all text-center ${
                        isDark 
                          ? 'bg-zinc-900 border-zinc-800 text-white focus:border-zinc-650 font-mono' 
                          : 'bg-white border-zinc-200 text-zinc-900 focus:border-zinc-400 font-sans shadow-sm'
                      }`}
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 block mb-1">CVV / CVC</label>
                    <input
                      type="password"
                      required
                      placeholder="•••"
                      value={cvv}
                      onChange={handleCvvChange}
                      className={`w-full px-4 py-3 rounded-2xl outline-none border text-sm font-medium transition-all text-center ${
                        isDark 
                          ? 'bg-zinc-900 border-zinc-800 text-white focus:border-zinc-650 font-mono' 
                          : 'bg-white border-zinc-200 text-zinc-900 focus:border-zinc-400 font-sans shadow-sm'
                      }`}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isProcessing || items.length === 0}
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
            </form>
          ) : (
            <div className={sectionClass}>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-display font-medium tracking-tight">Send Crypto Payment</h3>
                    <p className={`text-xs ${isDark ? 'text-zinc-500' : 'text-stone-500'} mt-1`}>
                      Generate a dynamic single-use addresses to fulfill your order.
                    </p>
                  </div>
                  <Badge variant="emerald" className="animate-pulse">DYNAMIC ADDR</Badge>
                </div>

                {/* Currency Switcher */}
                <div className="flex gap-2 p-1 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/40 dark:border-zinc-800">
                  {(['USDT', 'BTC', 'ETH', 'SOL'] as const).map((curr) => (
                    <button
                      key={curr}
                      onClick={() => {
                        setCryptoCurrency(curr);
                        setCryptoStatus('awaiting');
                      }}
                      className={`flex-1 py-2 text-xs font-bold font-mono uppercase tracking-wider rounded-lg transition-all ${
                        cryptoCurrency === curr
                          ? (isDark ? 'bg-zinc-800 text-amber-400 border border-zinc-700/50' : 'bg-white text-black shadow-sm border border-zinc-200/50')
                          : (isDark ? 'text-zinc-500 hover:text-zinc-300' : 'text-zinc-400 hover:text-zinc-600')
                      }`}
                    >
                      {curr}
                    </button>
                  ))}
                </div>

                {/* Address representation and QR Code Column */}
                <div className={`p-6 rounded-2xl border flex flex-col md:flex-row items-center gap-6 justify-between ${
                  isDark ? 'bg-zinc-950/50 border-zinc-900' : 'bg-stone-50 border-zinc-200/60'
                }`}>
                  <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-white shrink-0 border border-stone-200">
                    <QrCode className="w-24 h-24 text-black" />
                  </div>

                  <div className="flex-1 min-w-0 space-y-4 w-full">
                    <div>
                      <span className="text-[10px] font-mono font-bold text-zinc-400 uppercase">DEPOSIT AMOUNT</span>
                      <p className="text-2xl font-display font-black tracking-tight text-amber-500 font-mono">
                        {getCryptoRates()} {cryptoCurrency}
                      </p>
                      <p className={`text-xs ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>
                        Equivalent to ${finalTotal.toFixed(2)} USD
                      </p>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] font-mono font-bold text-zinc-400 uppercase">COPY ADDRESS</span>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          readOnly
                          value={cryptoAddresses[cryptoCurrency]}
                          className={`flex-1 font-mono text-xs p-2.5 rounded-xl border truncate select-all ${
                            isDark 
                              ? 'bg-zinc-900 border-zinc-805 text-zinc-300' 
                              : 'bg-white border-zinc-250 text-zinc-700'
                          }`}
                        />
                        <button
                          onClick={copyAddress}
                          className={`p-2.5 rounded-xl border transition-colors shrink-0 ${
                            isDark ? 'bg-zinc-900 hover:bg-zinc-850 border-zinc-800 text-white' : 'bg-white hover:bg-zinc-50 border-zinc-200'
                          }`}
                        >
                          {copiedAddress ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tracking status bar */}
                <div className="space-y-3 pt-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-zinc-500 font-mono font-bold">LEDGER VERIFICATION STATE:</span>
                    <span className={`font-mono font-bold uppercase flex items-center gap-1.5 ${
                      cryptoStatus === 'confirmed' ? 'text-emerald-500' : cryptoStatus === 'verifying' ? 'text-amber-500' : 'text-zinc-400'
                    }`}>
                      {cryptoStatus === 'verifying' && <div className="w-2 h-2 rounded-full border border-current border-t-transparent animate-spin" />}
                      {cryptoStatus === 'confirmed' && <CheckCircle2 className="w-3.5 h-3.5" />}
                      {cryptoStatus === 'awaiting' ? 'Awaiting Payment...' : cryptoStatus === 'verifying' ? 'Verifying payment...' : 'Confirmed!'}
                    </span>
                  </div>

                  <div className="h-1.5 w-full rounded-full bg-zinc-100 dark:bg-zinc-900 overflow-hidden relative">
                    <motion.div
                      layout
                      initial={{ width: '10%' }}
                      animate={{ width: cryptoStatus === 'confirmed' ? '100%' : cryptoStatus === 'verifying' ? '65%' : '15%' }}
                      transition={{ duration: 0.5 }}
                      className={`h-full rounded-full ${
                        cryptoStatus === 'confirmed' ? 'bg-emerald-500' : cryptoStatus === 'verifying' ? 'bg-amber-500 animate-pulse' : 'bg-zinc-400'
                      }`}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-zinc-500 pt-1">
                    <div className="flex items-center gap-1.5">
                      <AlertCircle className="w-3.5 h-3.5 text-zinc-400" />
                      <span>Single-use address valid for {formatTimer(cryptoTimer)}</span>
                    </div>
                    <span className="font-mono text-[9px] uppercase tracking-wider text-emerald-500 font-bold bg-emerald-500/5 px-2 py-0.5 rounded border border-emerald-500/10">免 ZERO GAS FEE</span>
                  </div>
                </div>

              </div>
            </div>
          )}
        </div>

        {/* Right Cart Summary & Coupon Section (5 cols) */}
        <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-6">
          <div className={sectionClass}>
            <div>
              <h3 className="text-xl font-display font-medium tracking-tight">Order Summary</h3>
              <p className={`text-xs ${isDark ? 'text-zinc-500' : 'text-stone-500'} mt-1`}>
                Verify items and apply coupon discounts before payment.
              </p>
            </div>

            {/* Cart Items List */}
            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1 no-scrollbar border-b border-zinc-200/40 dark:border-zinc-900 pb-5">
              {items.map((item) => (
                <div key={item.card.id} className="flex gap-4">
                  <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-zinc-200/50 dark:border-zinc-800">
                    <img src={item.card.image} alt={item.card.brand} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                  <div className="flex-1 min-w-0 space-y-0.5">
                    <div className="flex justify-between items-start gap-2">
                      <h4 className="font-bold text-xs line-clamp-2 leading-tight">{item.card.brand}</h4>
                      <button 
                        onClick={() => onRemoveItem(item.card.id)}
                        className="p-1 text-zinc-400 hover:text-red-500 transition-colors shrink-0"
                        title="Remove Item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <p className={`text-[10px] font-mono font-bold uppercase tracking-wide opacity-50`}>
                      {item.card.category}
                    </p>
                    <div className="flex justify-between items-center pt-1.5">
                      <div className="flex items-center gap-2 border border-zinc-200/60 dark:border-zinc-800 rounded-md py-0.5 px-1.5">
                        <button 
                          onClick={() => onUpdateQuantity(item.card.id, Math.max(1, item.quantity - 1))}
                          className="text-zinc-400 hover:text-black dark:hover:text-white"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-mono font-bold px-1 min-w-[12px] text-center">
                          {item.quantity}
                        </span>
                        <button 
                          onClick={() => onUpdateQuantity(item.card.id, item.quantity + 1)}
                          className="text-zinc-400 hover:text-black dark:hover:text-white"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <p className="font-mono text-xs font-bold text-black dark:text-white">
                        ${(item.card.finalPrice * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}

              {items.length === 0 && (
                <div className="text-center py-10 text-zinc-500 text-sm">
                  Your cart is currently empty.
                </div>
              )}
            </div>

            {/* Coupon Application Card Area */}
            <div className="space-y-3 pt-2">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 block">Apply Promo Coupon</span>

              {activeCoupon ? (
                <div className="flex items-center justify-between p-3.5 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 text-emerald-500">
                  <div className="flex items-center gap-2 text-xs">
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
                      className={`w-full pl-10 pr-4 py-3 rounded-2xl outline-none border text-xs font-medium transition-all ${
                        isDark 
                          ? 'bg-zinc-900 border-zinc-808 text-white focus:border-zinc-650 font-mono uppercase' 
                          : 'bg-white border-zinc-250 text-zinc-900 focus:border-zinc-400 shadow-sm uppercase'
                      }`}
                    />
                  </div>
                  <button
                    onClick={applyCoupon}
                    className={`px-5 py-3 rounded-2xl text-xs font-bold font-mono uppercase border transition-colors ${
                      isDark ? 'bg-zinc-900 hover:bg-zinc-850 border-zinc-800 text-white' : 'bg-black text-white hover:bg-zinc-800'
                    }`}
                  >
                    Apply
                  </button>
                </div>
              )}

              {couponError && (
                <p className="text-[10px] text-rose-500 font-mono flex items-center gap-1">
                  <AlertCircle className="w-3 h-3 shrink-0" /> {couponError}
                </p>
              )}
            </div>

            {/* Total Balance Sheet */}
            <div className="space-y-3 pt-4 border-t border-dashed border-zinc-200/15 dark:border-zinc-850">
              <div className="flex justify-between text-xs">
                <span className="text-zinc-500">Retail Amount</span>
                <span className="font-mono text-zinc-400 line-through">${originalSubtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-zinc-500">Shop Discount</span>
                <span className="font-mono text-emerald-500 font-bold">-${shopDiscount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-zinc-500">Ledger Subtotal</span>
                <span className="font-mono font-bold">${subtotal.toFixed(2)}</span>
              </div>

              {activeCoupon && (
                <div className="flex justify-between text-xs text-emerald-500 font-medium">
                  <span>Coupon Discount ({activeCoupon.percent}%)</span>
                  <span className="font-mono font-bold">-${couponDiscount.toFixed(2)}</span>
                </div>
              )}

              {/* Net total */}
              <div className="border-t pt-3 flex justify-between items-end">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 block mb-0.5">NET TOTAL</span>
                  <span className="text-2xl font-display font-black tracking-tighter text-black dark:text-white leading-none">
                    ${finalTotal.toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-[10px] text-emerald-500 font-bold bg-emerald-500/5 px-2 py-0.5 rounded border border-emerald-500/10">
                  <ShieldCheck className="w-3 h-3" />
                  <span>SECURED</span>
                </div>
              </div>
            </div>

          </div>

          {/* Secure strip logo factors */}
          <div className="flex justify-center items-center gap-4 opacity-35 select-none pointer-events-none text-[9px] font-mono font-bold">
            <Lock className="w-3.5 h-3.5" />
            <span>AES-256 BANK-GRADE ENCRYPTION</span>
          </div>

        </div>

      </div>
    </div>
  );
};

const Badge = ({ children, variant = 'primary', className }: { children: React.ReactNode, variant?: 'primary' | 'emerald', className?: string }) => (
  <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border ${
    variant === 'emerald'
      ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-500'
      : 'bg-zinc-100 border-zinc-200 text-zinc-800 dark:bg-zinc-900 dark:border-zinc-805 dark:text-zinc-400'
  } ${className}`}>
    {children}
  </span>
);
