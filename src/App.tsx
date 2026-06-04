import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShoppingBag, 
  Wallet, 
  Upload, 
  LayoutDashboard, 
  User as UserIcon, 
  LogOut, 
  Plus,
  Search,
  Filter,
  CreditCard,
  Bitcoin,
  History,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  ArrowRight,
  Menu,
  X,
  Moon,
  Sun,
  Heart,
  Share2,
  ShoppingCart
} from 'lucide-react';
import { useAuth, AuthProvider } from './lib/useAuth';
import { NotificationProvider, useNotification } from './lib/useNotification';
import { ErrorBoundary } from './components/ErrorBoundary';
import { db, handleFirestoreError, OperationType } from './lib/firebase';
import { collection, onSnapshot, query, where, orderBy, addDoc, doc, updateDoc, increment } from 'firebase/firestore';
import { GiftCard, Order, Submission, Transaction } from './types';
import { EditorialHowItWorks } from './components/EditorialHowItWorks';
import { FeaturedDealsShowcase } from './components/FeaturedDealsShowcase';

// Import newly modularized components
import { GiftCardItem } from './components/GiftCardItem';
import { ProductDetailView } from './components/ProductDetailView';
import { DepositModal } from './components/DepositModal';
import { SellView } from './components/SellView';
import { WalletView } from './components/WalletView';
import { OrdersView } from './components/OrdersView';
import { AdminPanel } from './components/AdminPanel';
import { ProfileView } from './components/ProfileView';
import { AuthView } from './components/AuthView';
import { CheckoutView } from './components/CheckoutView';
import { CategoryDetailView } from './components/CategoryDetailView';

// Views
type View = 'browse' | 'sell' | 'wallet' | 'orders' | 'admin' | 'profile' | 'login' | 'register' | 'forgot' | 'checkout';

const DEFAULT_CARDS: GiftCard[] = [
  {
    id: 'elden-ring',
    brand: 'Elden Ring: Shadow of the Erdtree Key',
    category: 'Games',
    realPrice: 59.99,
    discount: 15,
    finalPrice: 50.99,
    image: 'https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?q=80&w=800&auto=format&fit=crop',
    inventoryCount: 50,
    description: 'The highly anticipated expansion for the Game of the Year, Elden Ring, as steam activation key.'
  },
  {
    id: 'minecraft',
    brand: 'Minecraft Java & Bedrock Edition',
    category: 'Games',
    realPrice: 29.99,
    discount: 20,
    finalPrice: 23.99,
    image: 'https://images.unsplash.com/photo-1627856013091-fed6e4e30025?q=80&w=800&auto=format&fit=crop',
    inventoryCount: 80,
    description: 'Explore infinite worlds and build everything from simple homes to grand castles.'
  },
  {
    id: 'cyberpunk',
    brand: 'Cyberpunk 2077 Pack',
    category: 'Games',
    realPrice: 39.99,
    discount: 25,
    finalPrice: 29.99,
    image: 'https://images.unsplash.com/photo-1605898960710-9975f992323c?q=80&w=800&auto=format&fit=crop',
    inventoryCount: 40,
    description: 'A spy-thriller expansion for Cyberpunk 2077 with full game download.'
  },
  {
    id: 'win11',
    brand: 'Windows 11 Professional Retail Key',
    category: 'Windows Keys',
    realPrice: 99.00,
    discount: 85,
    finalPrice: 14.85,
    image: 'https://images.unsplash.com/photo-1626576622536-391f681aefbd?q=80&w=800&auto=format&fit=crop',
    inventoryCount: 500,
    description: 'Lifetime generic Retail activation key for Windows 11 Professional edition.'
  },
  {
    id: 'office2021',
    brand: 'Office 2021 Professional Plus Key',
    category: 'Windows Keys',
    realPrice: 149.00,
    discount: 80,
    finalPrice: 29.80,
    image: 'https://images.unsplash.com/photo-1633113088983-12fb3b2fe4ac?q=80&w=800&auto=format&fit=crop',
    inventoryCount: 300,
    description: 'Full productivity suite activation key including Microsoft Word, Excel, and PPT.'
  },
  {
    id: 'apple100',
    brand: 'Apple $100 Gift Card',
    category: 'Gift Cards',
    realPrice: 100,
    discount: 10,
    finalPrice: 90,
    image: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?q=80&w=800&auto=format&fit=crop',
    inventoryCount: 50,
    description: 'Apple Gift Card for hardware, apps, music, and iCloud additions.'
  },
  {
    id: 'amazon50',
    brand: 'Amazon $50 Gift Card',
    category: 'Gift Cards',
    realPrice: 50,
    discount: 5,
    finalPrice: 47.5,
    image: 'https://images.unsplash.com/photo-1523474253046-8cd2748b5fd2?q=80&w=800&auto=format&fit=crop',
    inventoryCount: 100,
    description: 'Shop millions of items on Amazon with instant ledger redemption.'
  },
  {
    id: 'playstation60',
    brand: 'PlayStation $60 Wallet Top-up',
    category: 'Gift Cards',
    realPrice: 60,
    discount: 15,
    finalPrice: 51,
    image: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=800&auto=format&fit=crop',
    inventoryCount: 30,
    description: 'Top up your PlayStation network wallet balance instantly.'
  },
  {
    id: 'xboxpass',
    brand: 'Xbox Game Pass Ultimate - 3 Months',
    category: 'Subscriptions',
    realPrice: 44.99,
    discount: 45,
    finalPrice: 24.74,
    image: 'https://images.unsplash.com/photo-1605902711622-cfb43c443ffb?q=80&w=800&auto=format&fit=crop',
    inventoryCount: 150,
    description: 'Full library download access to over 100 game titles on console and PC.'
  },
  {
    id: 'spotify12',
    brand: 'Spotify Premium - 12 Months',
    category: 'Subscriptions',
    realPrice: 99.99,
    discount: 40,
    finalPrice: 59.99,
    image: 'https://images.unsplash.com/photo-1614680376593-902f74fa0d41?q=80&w=800&auto=format&fit=crop',
    inventoryCount: 75,
    description: 'Unlimited ad-free music, fully compatible with high-end audio hardware.'
  },
  {
    id: 'netflix6',
    brand: 'Netflix Premium - 6 Months Duo',
    category: 'Subscriptions',
    realPrice: 100.00,
    discount: 10,
    finalPrice: 90.00,
    image: 'https://images.unsplash.com/photo-1574375927938-d5a98e8edd86?q=80&w=800&auto=format&fit=crop',
    inventoryCount: 80,
    description: 'Watch premium 4K streaming shows and films without ads or limits.'
  },
  {
    id: 'binance100',
    brand: 'Binance $100 Gift Card USDT',
    category: 'Gift Cards',
    realPrice: 105.00,
    discount: 5,
    finalPrice: 99.75,
    image: 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?q=80&w=800&auto=format&fit=crop',
    inventoryCount: 150,
    description: 'Instant Binance voucher code to top up your Binance account wallet with USDT.'
  },
  {
    id: 'google50',
    brand: 'Google Play $50 Gift Card',
    category: 'Gift Cards',
    realPrice: 50.00,
    discount: 8,
    finalPrice: 46.00,
    image: 'https://images.unsplash.com/photo-1557821314-4a50fd44fc82?q=80&w=800&auto=format&fit=crop',
    inventoryCount: 90,
    description: 'Purchase apps, games, books, or movies on the Google Play store instantly.'
  },
  {
    id: 'steam50',
    brand: 'Steam Wallet $50 Voucher',
    category: 'Gift Cards',
    realPrice: 50.00,
    discount: 10,
    finalPrice: 45.00,
    image: 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?q=80&w=800&auto=format&fit=crop',
    inventoryCount: 200,
    description: 'Redeem instantly on Steam to purchase and download your favorite PC games.'
  },
  {
    id: 'win10',
    brand: 'Windows 10 Professional Retail Key',
    category: 'Windows Keys',
    realPrice: 89.00,
    discount: 88,
    finalPrice: 10.68,
    image: 'https://images.unsplash.com/photo-1616440347437-b1c73416efc2?q=80&w=800&auto=format&fit=crop',
    inventoryCount: 600,
    description: 'Lifetime generic activation retail key for Windows 10 Professional.'
  },
  {
    id: 'office365',
    brand: 'Office 365 Annual Personal Subscription',
    category: 'Windows Keys',
    realPrice: 69.99,
    discount: 40,
    finalPrice: 41.99,
    image: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=800&auto=format&fit=crop',
    inventoryCount: 250,
    description: '1-Year Microsoft 365 Personal access key. Cloud storage & premium apps.'
  },
  {
    id: 'pubguc',
    brand: 'PUBG Mobile 660 UC Top-up',
    category: 'Gaming Top-ups',
    realPrice: 9.99,
    discount: 15,
    finalPrice: 8.49,
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=800&auto=format&fit=crop',
    inventoryCount: 1000,
    description: 'Instant Unknown Cash global voucher code for PUBG Mobile cosmetic items.'
  },
  {
    id: 'valopoints',
    brand: 'Valorant 1000 Points Key',
    category: 'Gaming Top-ups',
    realPrice: 10.00,
    discount: 12,
    finalPrice: 8.80,
    image: 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?q=80&w=800&auto=format&fit=crop',
    inventoryCount: 500,
    description: 'Riot Games pre-paid PIN code for Valorant game store unlocks.'
  }
];

const AppContent = () => {
  const { user, profile, loading, login, logout } = useAuth();
  const { showNotification } = useNotification();
  const [currentView, setCurrentView] = useState<View>('browse');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [giftCards, setGiftCards] = useState<GiftCard[]>(DEFAULT_CARDS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeDetailCategory, setActiveDetailCategory] = useState<string | null>(null);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [selectedCard, setSelectedCard] = useState<GiftCard | null>(null);
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [isDark, setIsDark] = useState<boolean>(() => localStorage.getItem('aura-theme') === 'dark');
  const [cartItems, setCartItems] = useState<{ card: GiftCard; quantity: number }[]>([]);

  const handleAddToCart = (card: GiftCard, qty: number = 1) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.card.id === card.id);
      if (existing) {
        return prev.map(item => item.card.id === card.id ? { ...item, quantity: item.quantity + qty } : item);
      }
      return [...prev, { card, quantity: qty }];
    });
    showNotification(`Added ${qty}x ${card.brand} to cart!`, 'success');
  };

  const handleCheckoutSuccess = async (orderId: string, itemsPaid: { card: GiftCard; quantity: number }[]) => {
    try {
      const uId = user?.uid || 'guest-user';
      const uEmail = user?.email || 'guest@example.com';
      
      // Add each item paid as an order in firestore
      for (const item of itemsPaid) {
        const orderData: Omit<Order, 'id'> = {
          userId: uId,
          giftCardId: item.card.id,
          amount: item.card.finalPrice * item.quantity,
          status: 'completed',
          timestamp: new Date().toISOString(),
          deliveryEmail: uEmail,
          codes: Array.from({ length: item.quantity }, () => 'AURA-' + Math.random().toString(36).substring(2, 10).toUpperCase()),
          productName: item.card.brand,
          productImage: item.card.image
        };
        await addDoc(collection(db, 'orders'), orderData);
        
        // Also record a transaction
        const transactionData: Omit<Transaction, 'id'> = {
          userId: uId,
          amount: item.card.finalPrice * item.quantity,
          type: 'purchase',
          status: 'completed',
          timestamp: new Date().toISOString()
        };
        await addDoc(collection(db, 'transactions'), transactionData);
      }
      
      showNotification('Payment successful! Your order digital keys have been delivered to your email/account ledger.', 'success');
      setCartItems([]);
      setCurrentView('orders');
    } catch (err) {
      console.error('Error recording successful checkout:', err);
      showNotification('Successfully paid, but error logging. Your keys are generated in session.', 'success');
      setCartItems([]);
      setCurrentView('browse');
    }
  };

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('aura-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('aura-theme', 'light');
    }
  }, [isDark]);

  // Fetch Gift Cards
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'giftCards'), (snapshot) => {
      if (snapshot.empty && profile?.role === 'admin') {
        // Seed initial data
        DEFAULT_CARDS.forEach(card => {
          const { id, ...cardData } = card;
          addDoc(collection(db, 'giftCards'), cardData);
        });
      }
      const cards = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as GiftCard));
      if (cards.length > 0) {
        setGiftCards(cards);
      } else {
        setGiftCards(DEFAULT_CARDS);
      }
    }, (err) => {
      console.error('Firestore Error:', err);
      // Fallback is already DEFAULT_CARDS
      setGiftCards(DEFAULT_CARDS);
    });
    return () => unsub();
  }, [profile]);

  const filteredCards = giftCards.filter(card => {
    const matchesSearch = card.brand.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || card.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ['All', ...Array.from(new Set(giftCards.map(c => c.category)))];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
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

  return (
    <div className={`min-h-screen font-sans selection:bg-black selection:text-white transition-colors duration-500 ${isDark ? 'bg-[#0a0a0c] text-zinc-100' : 'bg-[#FAF9F6] text-zinc-900'}`}>
      {/* Navbar */}
      <nav className={`sticky top-0 z-50 backdrop-blur-xl border-b transition-colors duration-500 ${isDark ? 'bg-zinc-950/80 border-zinc-900 text-white' : 'bg-white/80 border-zinc-100'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-8">
              <button 
                onClick={() => { setCurrentView('browse'); setActiveDetailCategory(null); }}
                className={`text-2xl font-display font-black tracking-tighter hover:opacity-80 transition-opacity ${isDark ? 'text-white' : 'text-zinc-950'}`}
              >
                AURA
              </button>
              
              <div className="hidden md:flex items-center gap-6">
                <NavButton active={currentView === 'browse'} isDark={isDark} onClick={() => { setCurrentView('browse'); setActiveDetailCategory(null); }}>Browse</NavButton>
                <NavButton active={currentView === 'sell'} isDark={isDark} onClick={() => setCurrentView('sell')}>Sell</NavButton>
                {user && <NavButton active={currentView === 'orders'} isDark={isDark} onClick={() => setCurrentView('orders')}>Orders</NavButton>}
                {profile?.role === 'admin' && <NavButton active={currentView === 'admin'} isDark={isDark} onClick={() => setCurrentView('admin')}>Admin</NavButton>}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <a 
                href={window.location.href} 
                target="_blank" 
                rel="noopener noreferrer"
                className={`hidden lg:flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest transition-colors ${isDark ? 'text-zinc-500 hover:text-white' : 'text-zinc-400 hover:text-black'}`}
              >
                Open in New Tab <ArrowRight className="w-3 h-3" />
              </a>

              {/* Cart Button */}
              <button 
                onClick={() => {
                  if (cartItems.length === 0) {
                    showNotification('Your cart is empty! Add game keys or gift cards to checkout.', 'info');
                  } else {
                    setSelectedCard(null);
                    setCurrentView('checkout');
                  }
                }}
                className={`p-2 rounded-xl border transition-all duration-300 flex items-center justify-center relative ${
                  isDark 
                    ? 'bg-zinc-900 border-zinc-800 text-white hover:border-zinc-700' 
                    : 'bg-zinc-50 border-zinc-200 text-zinc-500 hover:text-black hover:bg-zinc-100 hover:border-zinc-300'
                }`}
                title="Your Cart / Checkout"
              >
                <ShoppingCart className="w-4 h-4" />
                {cartItems.length > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white font-mono text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center animate-bounce">
                    {cartItems.reduce((sum, item) => sum + item.quantity, 0)}
                  </span>
                )}
              </button>

              {/* Day / Night Mode Toggler */}
              <button 
                onClick={() => setIsDark(!isDark)}
                className={`p-2 rounded-xl border transition-all duration-300 flex items-center justify-center ${
                  isDark 
                    ? 'bg-zinc-900 border-zinc-800 text-amber-400 hover:text-amber-300 hover:border-zinc-700' 
                    : 'bg-zinc-50 border-zinc-200 text-zinc-500 hover:text-black hover:bg-zinc-100 hover:border-zinc-300'
                }`}
                title={isDark ? "Switch to Day Mode" : "Switch to Night Mode"}
              >
                {isDark ? <Sun className="w-4 h-4 text-amber-400 fill-amber-400/20" /> : <Moon className="w-4 h-4 fill-zinc-200" />}
              </button>

              {user ? (
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => setCurrentView('wallet')}
                    className={`hidden sm:flex items-center gap-2 px-4 py-2 rounded-2xl border transition-all group ${
                      isDark 
                        ? 'bg-zinc-900 hover:bg-zinc-800 border-zinc-800 text-white' 
                        : 'bg-zinc-50 hover:bg-zinc-100 border-zinc-200'
                    }`}
                  >
                    <Wallet className={`w-4 h-4 transition-colors ${isDark ? 'text-zinc-400 group-hover:text-white' : 'text-zinc-500 group-hover:text-black'}`} />
                    <span className="font-bold text-sm">${profile?.walletBalance.toFixed(2)}</span>
                  </button>
                  
                  <div className="relative group">
                    <button className={`w-10 h-10 rounded-xl flex items-center justify-center border overflow-hidden transition-colors ${
                      isDark ? 'bg-zinc-900 border-zinc-805' : 'bg-zinc-100 border-zinc-205'
                    }`}>
                      {user.photoURL ? (
                        <img src={user.photoURL} alt="Avatar" className="w-full h-full object-cover" />
                      ) : (
                        <UserIcon className={`w-5 h-5 ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`} />
                      )}
                    </button>
                    
                    <div className={`absolute right-0 mt-2 w-48 rounded-2xl shadow-xl border py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all ${
                      isDark ? 'bg-zinc-950 border-zinc-900 shadow-black/80 text-white' : 'bg-white border-zinc-100'
                    }`}>
                      <button 
                        onClick={() => setCurrentView('profile')} 
                        className={`w-full px-4 py-2 text-left text-sm flex items-center gap-2 transition-colors ${isDark ? 'hover:bg-zinc-900 text-zinc-300' : 'hover:bg-zinc-50 text-zinc-700'}`}
                      >
                        <UserIcon className="w-4 h-4" /> Profile
                      </button>
                      <button 
                        onClick={logout} 
                        className={`w-full px-4 py-2 text-left text-sm flex items-center gap-2 text-red-600 transition-colors ${isDark ? 'hover:bg-zinc-900/60' : 'hover:bg-zinc-50'}`}
                      >
                        <LogOut className="w-4 h-4" /> Logout
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <button 
                  onClick={() => setCurrentView('login')}
                  className={`px-6 py-2 rounded-2xl font-bold text-sm transition-all ${
                    isDark ? 'bg-white text-zinc-950 hover:bg-zinc-200' : 'bg-black text-white hover:bg-zinc-850'
                  }`}
                >
                  Sign In
                </button>
              )}
              
              <button className={`md:hidden p-1 rounded-lg ${isDark ? 'text-white hover:bg-zinc-900' : 'text-zinc-950 hover:bg-zinc-100'}`} onClick={() => setIsMenuOpen(!isMenuOpen)}>
                {isMenuOpen ? <X /> : <Menu />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden fixed inset-0 z-40 bg-white pt-20 px-6"
          >
            <div className="flex flex-col gap-6 text-2xl font-display font-bold">
              <button onClick={() => { setCurrentView('browse'); setActiveDetailCategory(null); setIsMenuOpen(false); }}>Browse</button>
              <button onClick={() => { setCurrentView('sell'); setIsMenuOpen(false); }}>Sell</button>
              {user && <button onClick={() => { setCurrentView('orders'); setIsMenuOpen(false); }}>Orders</button>}
              {profile?.role === 'admin' && <button onClick={() => { setCurrentView('admin'); setIsMenuOpen(false); }}>Admin</button>}
              {user && <button onClick={() => { setCurrentView('wallet'); setIsMenuOpen(false); }}>Wallet (${profile?.walletBalance.toFixed(2)})</button>}
              {user ? (
                <button onClick={() => { logout(); setIsMenuOpen(false); }} className="text-red-600">Logout</button>
              ) : (
                <button onClick={() => { setCurrentView('login'); setIsMenuOpen(false); }}>Sign In</button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <AnimatePresence mode="wait">
          {currentView === 'browse' && !selectedCard && (
            <motion.div 
              key={activeDetailCategory ? `category-${activeDetailCategory}` : "browse"}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-12"
            >
              {activeDetailCategory ? (
                <CategoryDetailView
                  categoryName={activeDetailCategory}
                  giftCards={giftCards}
                  isDark={isDark}
                  onBack={() => {
                    setActiveDetailCategory(null);
                    window.scrollTo({ top: 0, behavior: 'instant' });
                  }}
                  onSelectCard={(card) => setSelectedCard(card)}
                />
              ) : (
                <>
                  {/* Hero */}
                  <div className="bg-zinc-900 rounded-[1.5rem] p-8 sm:p-16 text-white relative overflow-hidden">
                    <div className="relative z-10 max-w-2xl space-y-6">
                      <Badge className="bg-white/10 text-white border-white/20">Limited Time Offer</Badge>
                      <h1 className="text-5xl sm:text-7xl font-display font-black tracking-tighter leading-none text-left">
                        GET UP TO <span className="text-zinc-400">20% OFF</span> ON APPLE CARDS.
                      </h1>
                      <p className="text-zinc-400 text-lg sm:text-xl font-medium max-w-lg text-left">
                        Instantly buy and sell gift cards with zero fees and maximum security.
                      </p>
                    </div>
                    <div className="absolute top-0 right-0 w-1/2 h-full opacity-20 pointer-events-none">
                      <div className="absolute inset-0 bg-gradient-to-l from-zinc-900 to-transparent z-10" />
                      <img src="https://picsum.photos/seed/giftcard/800/800" alt="Hero" className="w-full h-full object-cover" />
                    </div>
                  </div>

                  {/* Marketplace */}
                  <div id="marketplace" className="space-y-16">
                    {/* Marketplace Anchor */}
                    <div id="marketplace-grid-anchor" className="scroll-mt-24" />

                    {/* Swapped Section 1: Trending Products Section (Shown first) */}
                    <div className="space-y-8 text-left">
                      <div>
                        <h2 className="text-3xl font-display font-medium tracking-tight">Trending Products</h2>
                        <p className={`text-xs ${isDark ? 'text-zinc-400' : 'text-stone-500'} mt-1`}>Highly requested digital software and activation kits updated live.</p>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                        {giftCards.slice(0, 4).map(card => (
                          <GiftCardItem key={card.id} card={card} isDark={isDark} onClick={() => setSelectedCard(card)} />
                        ))}
                      </div>
                    </div>

                    {/* Editorial Banner 1 */}
                    <div className={`rounded-[1.5rem] p-8 sm:p-12 relative overflow-hidden flex flex-col md:flex-row justify-between items-center gap-6 border transition-all duration-500 ${
                      isDark ? 'bg-zinc-950 text-white border-zinc-900' : 'bg-zinc-900 text-white'
                    }`}>
                      <div className="space-y-4 max-w-xl z-10 text-left">
                        <span className="text-[10px] font-mono font-bold tracking-widest text-zinc-400 uppercase">OFFICIAL OEM STANDARD</span>
                        <h3 className="text-3xl sm:text-4xl font-display font-bold tracking-tight leading-none text-white">Genuine Windows 11 & Office OEM Keys</h3>
                        <p className="text-zinc-400 text-sm leading-relaxed font-normal">Activate your systems instantly with genuine lifetime digital licenses. Global direct delivery with high security verification.</p>
                      </div>
                      <button 
                        onClick={() => {
                          setActiveDetailCategory('Windows Keys');
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className={`shrink-0 transition-colors font-bold text-sm px-6 py-3 rounded-xl z-10 ${
                          isDark ? 'bg-zinc-900 hover:bg-zinc-800 text-white border border-zinc-800' : 'bg-white text-zinc-900 hover:bg-zinc-100'
                        }`}
                      >
                        View Genuine Keys
                      </button>
                      <div className="absolute top-0 right-0 w-1/3 h-full pointer-events-none opacity-10 select-none hidden sm:block">
                        <div className="text-[12rem] font-black tracking-tighter text-white select-none translate-x-20 translate-y-10">OEM</div>
                      </div>
                    </div>

                    {/* Swapped Section 2: Choose Category Section (Replaced Browse All Deals) */}
                    <div className="space-y-6 text-left">
                      <div className="flex justify-between items-end">
                        <div>
                          <h2 className="text-3xl font-display font-medium tracking-tight">Explore Categories</h2>
                          <p className={`text-xs ${isDark ? 'text-zinc-500' : 'text-stone-500'} mt-1`}>Select a category to locate and purchase electronic licenses and key codes instantly.</p>
                        </div>
                        <button
                          onClick={() => {
                            setActiveDetailCategory('All');
                            window.scrollTo({ top: 0, behavior: 'instant' });
                          }}
                          className={`text-xs font-mono font-bold uppercase tracking-wider pb-1 transition-all border-b ${
                            isDark 
                              ? 'text-zinc-400 hover:text-white border-zinc-800 hover:border-white' 
                              : 'text-zinc-500 hover:text-zinc-900 border-zinc-300 hover:border-zinc-900'
                          }`}
                        >
                          Browse All
                        </button>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 pt-2">
                        {Array.from(new Set(giftCards.map(c => c.category))).map(catName => {
                          const firstCardInCat = giftCards.find(c => c.category === catName);
                          const catImage = firstCardInCat?.image || 'https://images.unsplash.com/photo-1557821314-4a50fd44fc82?q=80&w=800&auto=format&fit=crop';
                          
                          return (
                            <motion.div 
                              key={catName}
                              whileHover={{ y: -6 }}
                              onClick={() => {
                                setActiveDetailCategory(catName);
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                              }}
                              className={`p-1.5 pb-3 transition-all duration-300 group cursor-pointer relative flex flex-col justify-between h-full rounded-2xl ${
                                isDark 
                                  ? 'bg-transparent text-white border border-transparent hover:bg-zinc-900/30 hover:border-zinc-900/50 hover:shadow-2xl hover:shadow-black/20' 
                                  : 'bg-transparent text-zinc-950 border border-transparent hover:bg-white/80 hover:border-zinc-200/60 hover:shadow-xl hover:shadow-zinc-200/30'
                              }`}
                            >
                              <div className="space-y-3">
                                {/* Visual card representation */}
                                <div className={`aspect-[4/3] rounded-xl overflow-hidden relative border ${
                                  isDark ? 'bg-zinc-900/40 border-zinc-900/40' : 'bg-zinc-50/50 border-zinc-200/10'
                                }`}>
                                  <img 
                                    referrerPolicy="no-referrer" 
                                    src={catImage} 
                                    alt={catName} 
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                                  />
                                </div>
                                
                                {/* Metadata section */}
                                <div className="space-y-0.5 px-1.5 text-left">
                                  <p className={`text-[8px] sm:text-[9px] font-mono font-bold uppercase tracking-widest ${
                                    isDark ? 'text-zinc-500' : 'text-zinc-400'
                                  }`}>
                                    DIRECTORY
                                  </p>
                                  <h3 className={`font-bold text-sm sm:text-base group-hover:text-amber-500 transition-colors ${
                                    isDark ? 'text-zinc-200' : 'text-zinc-900'
                                  }`}>
                                    {catName}
                                  </h3>
                                </div>
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Steam-Style Featured Deals Showcase */}
                    <FeaturedDealsShowcase 
                      products={giftCards} 
                      onSelectProduct={(product) => setSelectedCard(product)} 
                      isDark={isDark} 
                    />

                    {/* Editorial Banner 2 */}
                    <div className={`rounded-[1.5rem] p-8 sm:p-12 relative overflow-hidden flex flex-col md:flex-row justify-between items-center gap-6 border transition-all duration-500 ${
                      isDark 
                        ? 'bg-zinc-950 text-white border-zinc-900' 
                        : 'bg-white text-zinc-900 border-zinc-200/60 shadow-sm'
                    }`}>
                      <div className="space-y-4 max-w-xl z-10 text-left">
                        <span className="text-[10px] font-mono font-bold tracking-widest text-zinc-500 uppercase">GAMING & CONSOLES</span>
                        <h3 className={`text-3xl sm:text-4xl font-display font-semibold tracking-tight leading-none ${isDark ? 'text-white' : 'text-zinc-900'}`}>Minecraft & Xbox Subscriptions</h3>
                        <p className={`text-sm leading-relaxed font-normal ${isDark ? 'text-zinc-400' : 'text-zinc-650'}`}>Unlock infinite game catalogs, online multiplayer, and premium entertainment codes delivered straight to your dashboard ledger.</p>
                      </div>
                      <button 
                        onClick={() => {
                          setActiveDetailCategory('Subscriptions');
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className={`shrink-0 transition-colors font-bold text-sm px-6 py-3 rounded-xl z-10 ${
                          isDark ? 'bg-zinc-900 hover:bg-zinc-800 text-white border border-zinc-805' : 'bg-black text-white hover:bg-zinc-800'
                        }`}
                      >
                        Explore Subscriptions
                      </button>
                      <div className="absolute top-0 right-0 w-1/3 h-full pointer-events-none opacity-[0.03] select-none hidden sm:block">
                        <div className="text-[12rem] font-black tracking-tighter text-black select-none translate-x-20 translate-y-10">PASS</div>
                      </div>
                    </div>

                    {/* How it Works */}
                    <EditorialHowItWorks isDark={isDark} onToggleDark={() => setIsDark(!isDark)} />
                  </div>
                </>
              )}
            </motion.div>
          )}

          {currentView === 'browse' && selectedCard && (
            <ProductDetailView 
              card={selectedCard} 
              isDark={isDark}
              onClose={() => setSelectedCard(null)} 
              onBuy={(amount) => {
                handleBuy(selectedCard, amount);
                setSelectedCard(null);
              }}
              onAddToCart={(card, qty) => {
                handleAddToCart(card, qty);
                setSelectedCard(null);
              }}
              allCards={giftCards}
              onSelectCard={(c) => setSelectedCard(c)}
            />
          )}

          {currentView === 'checkout' && (
            <div className="w-full">
              <CheckoutView
                items={cartItems}
                isDark={isDark}
                walletBalance={profile?.walletBalance || 0}
                onBack={() => setCurrentView('browse')}
                onRemoveItem={(id) => {
                  const cleaned = cartItems.filter(item => item.card.id !== id);
                  setCartItems(cleaned);
                  if (cleaned.length === 0) {
                    setCurrentView('browse');
                  }
                }}
                onUpdateQuantity={(id, qty) => setCartItems(prev => prev.map(item => item.card.id === id ? { ...item, quantity: qty } : item))}
                onSuccess={handleCheckoutSuccess}
              />
            </div>
          )}

          {currentView === 'sell' && <SellView onBack={() => { setSelectedCard(null); setCurrentView('browse'); }} isDark={isDark} />}
          {currentView === 'wallet' && <WalletView profile={profile} onBack={() => { setSelectedCard(null); setCurrentView('browse'); }} onDeposit={() => setIsDepositModalOpen(true)} isDark={isDark} />}
          {currentView === 'orders' && <OrdersView onBack={() => { setSelectedCard(null); setCurrentView('browse'); }} isDark={isDark} />}
          {currentView === 'admin' && <AdminPanel onBack={() => { setSelectedCard(null); setCurrentView('browse'); }} />}
          {currentView === 'profile' && <ProfileView profile={profile} onBack={() => { setSelectedCard(null); setCurrentView('browse'); }} />}
          {currentView === 'login' && <AuthView initialMode="login" onSuccess={() => setCurrentView('browse')} onBack={() => setCurrentView('browse')} isDark={isDark} />}
          {currentView === 'register' && <AuthView initialMode="register" onSuccess={() => setCurrentView('browse')} onBack={() => setCurrentView('browse')} isDark={isDark} />}
          {currentView === 'forgot' && <AuthView initialMode="forgot" onSuccess={() => setCurrentView('browse')} onBack={() => setCurrentView('browse')} isDark={isDark} />}
        </AnimatePresence>

        {/* Deposit Modal */}
        <AnimatePresence>
          {isDepositModalOpen && (
            <DepositModal 
              isDark={isDark}
              onClose={() => setIsDepositModalOpen(false)}
              onSuccess={(amount, method) => {
                handleDepositSuccess(amount, method);
                setIsDepositModalOpen(false);
              }}
            />
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className={`py-12 border-t transition-colors duration-500 ${
        isDark 
          ? 'bg-[#0a0a0c] border-zinc-900 text-zinc-400' 
          : 'bg-white border-zinc-100 text-zinc-950'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="space-y-4">
              <h3 className={`text-xl font-display font-black tracking-tighter ${isDark ? 'text-white' : 'text-zinc-950'}`}>AURA</h3>
              <p className={`text-sm leading-relaxed ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
                The world's most trusted digital marketplace for gift cards and game keys.
              </p>
            </div>
            <div>
              <h4 className={`font-bold mb-4 ${isDark ? 'text-zinc-200' : 'text-zinc-900'}`}>Marketplace</h4>
              <ul className={`space-y-2 text-sm ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
                <li><button onClick={() => setCurrentView('browse')} className={isDark ? 'hover:text-white transition-colors' : 'hover:text-black transition-colors'}>Browse Cards</button></li>
                <li><button onClick={() => setCurrentView('sell')} className={isDark ? 'hover:text-white transition-colors' : 'hover:text-black transition-colors'}>Sell Codes</button></li>
                <li><button className={isDark ? 'hover:text-white transition-colors' : 'hover:text-black transition-colors'}>Trending Deals</button></li>
              </ul>
            </div>
            <div>
              <h4 className={`font-bold mb-4 ${isDark ? 'text-zinc-200' : 'text-zinc-900'}`}>Support</h4>
              <ul className={`space-y-2 text-sm ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
                <li><button className={isDark ? 'hover:text-white transition-colors' : 'hover:text-black transition-colors'}>Help Center</button></li>
                <li><button className={isDark ? 'hover:text-white transition-colors' : 'hover:text-black transition-colors'}>Safety & Trust</button></li>
                <li><button className={isDark ? 'hover:text-white transition-colors' : 'hover:text-black transition-colors'}>Contact Us</button></li>
              </ul>
            </div>
            <div>
              <h4 className={`font-bold mb-4 ${isDark ? 'text-zinc-200' : 'text-zinc-900'}`}>Legal</h4>
              <ul className={`space-y-2 text-sm ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
                <li><button className={isDark ? 'hover:text-white transition-colors' : 'hover:text-black transition-colors'}>Privacy Policy</button></li>
                <li><button className={isDark ? 'hover:text-white transition-colors' : 'hover:text-black transition-colors'}>Terms of Service</button></li>
                <li><button className={isDark ? 'hover:text-white transition-colors' : 'hover:text-black transition-colors'}>Refund Policy</button></li>
              </ul>
            </div>
          </div>
          <div className={`mt-12 pt-8 border-t flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-medium uppercase tracking-widest ${
            isDark ? 'border-zinc-900 text-zinc-500' : 'border-zinc-100 text-zinc-400'
          }`}>
            <p>© 2024 AURA DIGITAL MARKETPLACE. ALL RIGHTS RESERVED.</p>
            <div className={`flex gap-6 ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>
              <button className={isDark ? 'hover:text-white transition-colors' : 'hover:text-black transition-colors'}>Twitter</button>
              <button className={isDark ? 'hover:text-white transition-colors' : 'hover:text-black transition-colors'}>Discord</button>
              <button className={isDark ? 'hover:text-white transition-colors' : 'hover:text-black transition-colors'}>Instagram</button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );

  async function handleDepositSuccess(amount: number, method: string) {
    if (!user) return;
    try {
      await addDoc(collection(db, 'transactions'), {
        userId: user.uid,
        userEmail: user.email || 'Anonymous',
        amount: amount,
        type: 'deposit',
        method: method || 'Card',
        status: 'pending',
        timestamp: new Date().toISOString()
      });
      showNotification(`Deposit request of $${amount.toFixed(2)} submitted for review. Pending authorization.`, 'success');
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'transactions');
    }
  }

  async function handleBuy(card: GiftCard, customAmount?: number) {
    if (!user || !profile) {
      login();
      return;
    }

    const priceToPay = customAmount !== undefined ? customAmount : card.finalPrice;

    if (profile.walletBalance < priceToPay) {
      showNotification('Insufficient balance. Please deposit funds to your wallet.', 'error');
      setCurrentView('wallet');
      return;
    }

    if (card.inventoryCount <= 0) {
      showNotification('This product is currently out of stock.', 'error');
      return;
    }

    try {
      // Pull real code if available in stock list
      let allocatedCode = 'AURA-' + Math.random().toString(36).substring(2, 10).toUpperCase();
      let updatedCodes = [...(card.codes || [])];
      let updatedCount = card.inventoryCount;

      if (updatedCodes.length > 0) {
        allocatedCode = updatedCodes.shift()!;
        updatedCount = updatedCodes.length;

        await updateDoc(doc(db, 'giftCards', card.id), {
          codes: updatedCodes,
          inventoryCount: updatedCount
        });
      } else {
        if (updatedCount > 0) {
          await updateDoc(doc(db, 'giftCards', card.id), {
            inventoryCount: increment(-1)
          });
        }
      }

      // 1. Create Order
      const orderData: Omit<Order, 'id'> = {
        userId: user.uid,
        giftCardId: card.id,
        amount: priceToPay,
        status: 'completed',
        timestamp: new Date().toISOString(),
        deliveryEmail: user.email || '',
        codes: [allocatedCode],
        productName: customAmount !== undefined ? `${card.brand} (Voucher Balance)` : card.brand,
        productImage: card.image
      };
      
      await addDoc(collection(db, 'orders'), orderData);

      // 2. Update Wallet
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        walletBalance: increment(-priceToPay)
      });

      // 3. Record Transaction
      const transactionData: Omit<Transaction, 'id'> = {
        userId: user.uid,
        amount: priceToPay,
        type: 'purchase',
        status: 'completed',
        timestamp: new Date().toISOString()
      };
      await addDoc(collection(db, 'transactions'), transactionData);

      showNotification('Purchase successful! Your digital key/code is available in your orders.', 'success');
      setCurrentView('orders');
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'orders');
    }
  }
};

const NavButton = ({ children, active, onClick, isDark }: { children: React.ReactNode, active: boolean, onClick: () => void, isDark?: boolean }) => (
  <button 
    onClick={onClick}
    className={`text-sm font-bold transition-all ${
      active 
        ? (isDark ? 'text-white' : 'text-black') 
        : (isDark ? 'text-zinc-500 hover:text-zinc-300' : 'text-zinc-400 hover:text-zinc-600')
    }`}
  >
    {children}
  </button>
);

const Badge = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${className}`}>
    {children}
  </span>
)

const App = () => (
  <ErrorBoundary>
    <NotificationProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </NotificationProvider>
  </ErrorBoundary>
);

export default App;
