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
import { collection, onSnapshot, query, where, orderBy, addDoc, doc, updateDoc, increment, getDoc } from 'firebase/firestore';
import { GiftCard, Order, Submission, Withdrawal, Transaction } from './types';
import { format } from 'date-fns';
import { EditorialHowItWorks } from './components/EditorialHowItWorks';
import { FeaturedDealsShowcase } from './components/FeaturedDealsShowcase';

// Views
type View = 'browse' | 'sell' | 'wallet' | 'orders' | 'admin' | 'profile';

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
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [selectedCard, setSelectedCard] = useState<GiftCard | null>(null);
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [isDark, setIsDark] = useState<boolean>(() => localStorage.getItem('aura-theme') === 'dark');

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
                onClick={() => setCurrentView('browse')}
                className={`text-2xl font-display font-black tracking-tighter hover:opacity-80 transition-opacity ${isDark ? 'text-white' : 'text-zinc-950'}`}
              >
                AURA
              </button>
              
              <div className="hidden md:flex items-center gap-6">
                <NavButton active={currentView === 'browse'} isDark={isDark} onClick={() => setCurrentView('browse')}>Browse</NavButton>
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
                      isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-zinc-100 border-zinc-200'
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
                  onClick={login}
                  className={`px-6 py-2 rounded-2xl font-bold text-sm transition-all ${
                    isDark ? 'bg-white text-zinc-950 hover:bg-zinc-200' : 'bg-black text-white hover:bg-zinc-800'
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
              <button onClick={() => { setCurrentView('browse'); setIsMenuOpen(false); }}>Browse</button>
              <button onClick={() => { setCurrentView('sell'); setIsMenuOpen(false); }}>Sell</button>
              {user && <button onClick={() => { setCurrentView('orders'); setIsMenuOpen(false); }}>Orders</button>}
              {profile?.role === 'admin' && <button onClick={() => { setCurrentView('admin'); setIsMenuOpen(false); }}>Admin</button>}
              {user && <button onClick={() => { setCurrentView('wallet'); setIsMenuOpen(false); }}>Wallet (${profile?.walletBalance.toFixed(2)})</button>}
              {user ? (
                <button onClick={() => { logout(); setIsMenuOpen(false); }} className="text-red-600">Logout</button>
              ) : (
                <button onClick={() => { login(); setIsMenuOpen(false); }}>Sign In</button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <AnimatePresence mode="wait">
          {currentView === 'browse' && (
            <motion.div 
              key="browse"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-12"
            >
              {/* Hero */}
              <div className="bg-zinc-900 rounded-[1.5rem] p-8 sm:p-16 text-white relative overflow-hidden">
                <div className="relative z-10 max-w-2xl space-y-6">
                  <Badge className="bg-white/10 text-white border-white/20">Limited Time Offer</Badge>
                  <h1 className="text-5xl sm:text-7xl font-display font-black tracking-tighter leading-none">
                    GET UP TO <span className="text-zinc-400">20% OFF</span> ON APPLE CARDS.
                  </h1>
                  <p className="text-zinc-400 text-lg sm:text-xl font-medium max-w-lg">
                    Instantly buy and sell gift cards with zero fees and maximum security.
                  </p>
                  <button 
                    onClick={() => {
                      const el = document.getElementById('marketplace');
                      el?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="bg-white text-black px-8 py-4 rounded-2xl font-bold text-lg hover:scale-105 transition-transform flex items-center gap-2"
                  >
                    Shop Now <ArrowRight className="w-5 h-5" />
                  </button>
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

                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                    <h2 className="text-3xl font-display font-medium tracking-tight">Browse All Deals</h2>
                    
                    <div className="flex items-center gap-4 w-full sm:w-auto">
                      <motion.div 
                        initial={false}
                        animate={{ width: isSearchFocused || searchQuery ? (window.innerWidth < 640 ? '100%' : '320px') : '48px' }}
                        className={`relative h-12 rounded-2xl overflow-hidden transition-all duration-300 border ${isDark ? 'bg-zinc-900 border-zinc-805 text-white' : 'bg-white border-zinc-200'}`}
                      >
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
                        <input 
                          type="text" 
                          placeholder={isSearchFocused ? "Search brands..." : ""}
                          value={searchQuery}
                          onFocus={() => setIsSearchFocused(true)}
                          onBlur={() => setIsSearchFocused(false)}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className={`w-full h-full pl-11 pr-4 py-2.5 bg-transparent focus:ring-0 transition-all outline-none font-medium text-sm ${!isSearchFocused && !searchQuery ? 'opacity-0 cursor-pointer' : 'opacity-100'}`}
                        />
                      </motion.div>
                      <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0 no-scrollbar">
                        {categories.map(cat => (
                          <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${
                              selectedCategory === cat 
                                ? (isDark ? 'bg-white text-zinc-950 shadow-lg shadow-white/5' : 'bg-black text-white') 
                                : (isDark ? 'bg-zinc-900 text-zinc-400 border border-zinc-800 hover:text-white hover:border-zinc-750' : 'bg-white text-zinc-500 border border-zinc-200 hover:border-zinc-400')
                            }`}
                          >
                            {cat}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 pt-4">
                    {filteredCards.slice(0, 4).map(card => (
                      <GiftCardItem key={card.id} card={card} isDark={isDark} onClick={() => setSelectedCard(card)} />
                    ))}
                    {filteredCards.length === 0 && (
                      <div className="col-span-full py-20 text-center text-zinc-500">
                        <p className="text-xl font-medium">No products found matching your search.</p>
                      </div>
                    )}
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
                      setSelectedCategory('Windows Keys');
                      const el = document.getElementById('marketplace');
                      el?.scrollIntoView({ behavior: 'smooth' });
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

                {/* Trending Section */}
                {filteredCards.length > 4 && (
                  <div className="space-y-8">
                    <div>
                      <h2 className="text-3xl font-display font-bold tracking-tight">Trending Products</h2>
                      <p className="text-zinc-400 text-sm mt-1">Highly requested digital software and activation kits updated live.</p>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                      {filteredCards.slice(4, 8).map(card => (
                        <GiftCardItem key={card.id} card={card} isDark={isDark} onClick={() => setSelectedCard(card)} />
                      ))}
                    </div>
                  </div>
                )}

                {/* Hot Deals Section */}
                {filteredCards.length > 0 && (
                  <div className="space-y-8">
                    <div>
                      <h2 className="text-3xl font-display font-bold tracking-tight">Hot Deals</h2>
                      <p className="text-zinc-400 text-sm mt-1">Exceptional discount promotions available for a limited duration window.</p>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                      {[...filteredCards]
                        .sort((a, b) => b.discount - a.discount)
                        .slice(0, 4)
                        .map(card => (
                          <GiftCardItem key={card.id} card={card} isDark={isDark} onClick={() => setSelectedCard(card)} />
                        ))
                      }
                    </div>
                  </div>
                )}

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
                    <p className={`text-sm leading-relaxed font-normal ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>Unlock infinite game catalogs, online multiplayer, and premium entertainment codes delivered straight to your dashboard ledger.</p>
                  </div>
                  <button 
                    onClick={() => {
                      setSelectedCategory('Subscriptions');
                      const el = document.getElementById('marketplace');
                      el?.scrollIntoView({ behavior: 'smooth' });
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
            </motion.div>
          )}

          {currentView === 'sell' && <SellView onBack={() => setCurrentView('browse')} isDark={isDark} />}
          {currentView === 'wallet' && <WalletView profile={profile} onBack={() => setCurrentView('browse')} onDeposit={() => setIsDepositModalOpen(true)} isDark={isDark} />}
          {currentView === 'orders' && <OrdersView onBack={() => setCurrentView('browse')} isDark={isDark} />}
          {currentView === 'admin' && <AdminPanel onBack={() => setCurrentView('browse')} />}
          {currentView === 'profile' && <ProfileView profile={profile} onBack={() => setCurrentView('browse')} />}
        </AnimatePresence>

        {/* Product Detail Slide-up */}
        <AnimatePresence>
          {selectedCard && (
            <ProductDetailView 
              card={selectedCard} 
              isDark={isDark}
              onClose={() => setSelectedCard(null)} 
              onBuy={() => {
                handleBuy(selectedCard);
                setSelectedCard(null);
              }}
            />
          )}
        </AnimatePresence>

        {/* Deposit Modal */}
        <AnimatePresence>
          {isDepositModalOpen && (
            <DepositModal 
              isDark={isDark}
              onClose={() => setIsDepositModalOpen(false)}
              onSuccess={(amount) => {
                handleDepositSuccess(amount);
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

  async function handleDepositSuccess(amount: number) {
    if (!user) return;
    try {
      await updateDoc(doc(db, 'users', user.uid), {
        walletBalance: increment(amount)
      });
      await addDoc(collection(db, 'transactions'), {
        userId: user.uid,
        amount: amount,
        type: 'deposit',
        status: 'completed',
        timestamp: new Date().toISOString()
      });
      showNotification(`Successfully deposited $${amount.toFixed(2)}`, 'success');
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'users');
    }
  }

  async function handleBuy(card: GiftCard) {
    if (!user || !profile) {
      login();
      return;
    }

    if (profile.walletBalance < card.finalPrice) {
      showNotification('Insufficient balance. Please deposit funds to your wallet.', 'error');
      setCurrentView('wallet');
      return;
    }

    try {
      // 1. Create Order
      const orderData: Omit<Order, 'id'> = {
        userId: user.uid,
        giftCardId: card.id,
        amount: card.finalPrice,
        status: 'completed',
        timestamp: new Date().toISOString(),
        deliveryEmail: user.email || '',
        codes: ['AURA-' + Math.random().toString(36).substring(2, 10).toUpperCase()],
        productName: card.brand,
        productImage: card.image
      };
      
      await addDoc(collection(db, 'orders'), orderData);

      // 2. Update Wallet
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        walletBalance: increment(-card.finalPrice)
      });

      // 3. Record Transaction
      const transactionData: Omit<Transaction, 'id'> = {
        userId: user.uid,
        amount: card.finalPrice,
        type: 'purchase',
        status: 'completed',
        timestamp: new Date().toISOString()
      };
      await addDoc(collection(db, 'transactions'), transactionData);

      showNotification('Purchase successful! Your gift card code is available in your orders.', 'success');
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
);

const GiftCardItem = ({ card, onClick, isDark }: { card: GiftCard, onClick: () => void, isDark?: boolean }) => (
  <motion.div 
    whileHover={{ y: -4 }}
    onClick={onClick}
    className={`p-2 transition-all duration-300 group cursor-pointer relative flex flex-col justify-between h-full rounded-2xl ${
      isDark 
        ? 'bg-transparent text-white border border-transparent hover:bg-zinc-900/40 hover:border-zinc-850' 
        : 'bg-transparent text-zinc-950 border border-transparent hover:bg-zinc-50/50 hover:border-zinc-200'
    }`}
  >
    <div className="space-y-3">
      {/* Visual representation card */}
      <div className={`aspect-[4/3] rounded-xl overflow-hidden relative border ${isDark ? 'bg-zinc-900/40 border-zinc-900/40' : 'bg-zinc-50/50 border-zinc-200/10'}`}>
        <img referrerPolicy="no-referrer" src={card.image} alt={card.brand} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
        
        {/* Horizontal Action Bar on Hover */}
        <div className="absolute inset-0 bg-black/45 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all duration-350 flex items-center justify-center gap-2.5 z-10">
          <button 
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              // Standard toggle feedback
            }}
            className="w-9 h-9 rounded-full bg-white text-zinc-900 hover:bg-zinc-100 hover:scale-110 active:scale-95 transition-all flex items-center justify-center shadow-lg"
            title="Favorite"
          >
            <Heart className="w-4 h-4 text-zinc-900" />
          </button>
          <button 
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              if (navigator.share) {
                navigator.share({ title: card.brand, text: `Check out AURA deal for ${card.brand}`, url: window.location.href }).catch(() => {});
              }
            }}
            className="w-9 h-9 rounded-full bg-white text-zinc-900 hover:bg-zinc-100 hover:scale-110 active:scale-95 transition-all flex items-center justify-center shadow-lg"
            title="Share"
          >
            <Share2 className="w-4 h-4 text-zinc-900" />
          </button>
          <button 
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onClick();
            }}
            className="w-9 h-9 rounded-full bg-white text-zinc-900 hover:bg-zinc-100 hover:scale-110 active:scale-95 transition-all flex items-center justify-center shadow-lg"
            title="Order"
          >
            <ShoppingCart className="w-4 h-4 text-zinc-900" />
          </button>
        </div>
      </div>
      
      <div className="space-y-0.5 px-1">
        <p className={`text-[8px] sm:text-[9px] font-mono font-bold uppercase tracking-widest truncate ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>{card.category}</p>
        <h3 className={`font-bold text-xs sm:text-sm truncate group-hover:text-amber-500 transition-colors ${isDark ? 'text-zinc-205' : 'text-zinc-900'}`}>{card.brand}</h3>
      </div>
    </div>

    {/* Price Details near each other & Offer tag right near it */}
    <div className="flex items-center gap-2 px-1 pt-2 pb-0.5 mt-auto flex-wrap sm:flex-nowrap">
      <span className={`text-base font-display font-medium ${isDark ? 'text-white' : 'text-zinc-950'}`}>
        ${card.finalPrice.toFixed(2)}
      </span>
      {card.discount > 0 && (
        <div className="flex items-center gap-1.5">
          <span className={`text-[10px] line-through font-medium ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>
            ${card.realPrice.toFixed(2)}
          </span>
          <span className={`text-[9px] font-mono font-bold px-1 py-0.5 rounded ${
            isDark ? 'bg-zinc-800 text-zinc-300' : 'bg-zinc-100 text-zinc-700'
          }`}>
            -{card.discount}%
          </span>
        </div>
      )}
    </div>
  </motion.div>
);

const ProductDetailView = ({ card, onClose, onBuy, isDark }: { card: GiftCard, onClose: () => void, onBuy: () => void, isDark?: boolean }) => (
  <div className="fixed inset-0 z-[100] flex items-end justify-center p-4 sm:p-6">
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="absolute inset-0 bg-black/60 backdrop-blur-sm"
    />
    <motion.div 
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className={`relative w-full max-w-2xl rounded-t-[1.5rem] p-8 sm:p-12 space-y-8 shadow-2xl border-t ${
        isDark ? 'bg-zinc-950 text-white border-zinc-900 shadow-black' : 'bg-white text-zinc-950 border-zinc-100'
      }`}
    >
      <button onClick={onClose} className={`absolute top-6 right-8 w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
        isDark ? 'bg-zinc-900 text-zinc-300 hover:bg-zinc-805' : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
      }`}>
        <X className="w-5 h-5" />
      </button>

      <div className="flex flex-col sm:flex-row gap-8">
        <div className={`w-full sm:w-1/2 aspect-[4/3] rounded-xl overflow-hidden border ${isDark ? 'bg-zinc-900 border-zinc-900' : 'bg-zinc-50 border-zinc-100'}`}>
          <img referrerPolicy="no-referrer" src={card.image} alt={card.brand} className="w-full h-full object-cover" />
        </div>
        <div className="flex-1 space-y-6">
          <div className="space-y-2">
            <Badge className={isDark ? 'bg-zinc-900 text-zinc-400 border-zinc-800' : 'bg-zinc-100 text-zinc-500 border-zinc-200'}>{card.category}</Badge>
            <h2 className="text-3xl sm:text-4xl font-display font-black tracking-tighter leading-tight">{card.brand}</h2>
            <p className={`text-sm leading-relaxed ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>{card.description}</p>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-end gap-3">
              <p className="text-4xl font-display font-black">${card.finalPrice.toFixed(2)}</p>
              {card.discount > 0 && (
                <p className="text-lg text-zinc-400 line-through font-bold pb-1">${card.realPrice.toFixed(2)}</p>
              )}
            </div>
            <div className={`flex items-center gap-2 font-bold text-xs uppercase tracking-widest ${isDark ? 'text-green-400' : 'text-green-600'}`}>
              <ShieldCheck className="w-4 h-4" /> Instant Delivery Guaranteed
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button 
          onClick={onBuy}
          className={`py-5 rounded-[1rem] font-bold text-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 ${
            isDark ? 'bg-white text-zinc-950 hover:bg-zinc-150' : 'bg-black text-white hover:bg-zinc-800'
          }`}
        >
          Buy Now <ArrowRight className="w-6 h-6" />
        </button>
        <button className={`py-5 rounded-[1rem] font-bold text-xl transition-all ${
          isDark ? 'bg-zinc-900 text-white hover:bg-zinc-800 border border-zinc-800' : 'bg-zinc-100 text-black hover:bg-zinc-200'
        }`}>
          Add to Cart
        </button>
      </div>
    </motion.div>
  </div>
);

const DepositModal = ({ onClose, onSuccess, isDark }: { onClose: () => void, onSuccess: (amount: number) => void, isDark?: boolean }) => {
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState<'card' | 'crypto' | 'razorpay' | null>(null);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className={`relative w-full max-w-lg rounded-[1.5rem] p-8 sm:p-12 space-y-8 shadow-2xl border ${
          isDark ? 'bg-zinc-950 border-zinc-900 text-white shadow-black' : 'bg-white border-zinc-100'
        }`}
      >
        <button onClick={onClose} className={`absolute top-6 right-8 w-8 h-8 rounded-xl flex items-center justify-center transition-colors ${
          isDark ? 'bg-zinc-900 text-zinc-300 hover:bg-zinc-805' : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
        }`}>
          <X className="w-4 h-4" />
        </button>

        <div className="text-center space-y-2 pt-2">
          <h2 className="text-3xl font-display font-black tracking-tighter">DEPOSIT FUNDS</h2>
          <p className={isDark ? 'text-zinc-400' : 'text-zinc-500'}>Choose your preferred payment method.</p>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className={`text-xs font-bold uppercase tracking-widest px-2 ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>Amount to Deposit ($)</label>
            <input 
              type="number" 
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className={`w-full p-6 rounded-2xl outline-none transition-all font-display font-black text-3xl text-center border ${
                isDark 
                  ? 'bg-zinc-900 border-zinc-805 focus:ring-2 focus:ring-zinc-700 text-white' 
                  : 'bg-zinc-50 border-zinc-200 focus:ring-2 focus:ring-black'
              }`}
            />
          </div>

          <div className="grid grid-cols-1 gap-3">
            {[
              { id: 'razorpay', name: 'Razorpay / Card', icon: CreditCard },
              { id: 'crypto', name: 'Crypto (USDT/BTC)', icon: Bitcoin },
              { id: 'card', name: 'Stripe / Global Card', icon: ShieldCheck }
            ].map((m) => (
              <button
                key={m.id}
                onClick={() => setMethod(m.id as any)}
                className={`p-5 rounded-xl border flex items-center justify-between transition-all ${
                  method === m.id 
                    ? (isDark ? 'border-white bg-white text-zinc-950 font-black' : 'border-black bg-black text-white font-black') 
                    : (isDark ? 'border-zinc-805 bg-zinc-900 hover:border-zinc-700 text-zinc-305' : 'border-zinc-100 bg-zinc-50 hover:border-zinc-300 text-zinc-900')
                }`}
              >
                <div className="flex items-center gap-4">
                  <m.icon className={`w-6 h-6 ${method === m.id ? (isDark ? 'text-zinc-950' : 'text-white') : 'text-zinc-400'}`} />
                  <span className="font-bold">{m.name}</span>
                </div>
                {method === m.id && <CheckCircle2 className={`w-5 h-5 ${isDark ? 'text-zinc-950' : 'text-white'}`} />}
              </button>
            ))}
          </div>
        </div>

        <button 
          onClick={() => {
            if (!amount || !method) return;
            onSuccess(Number(amount));
          }}
          disabled={!amount || !method}
          className={`w-full py-5 rounded-[1rem] font-bold text-xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 ${
            isDark ? 'bg-white text-zinc-950 hover:bg-zinc-200 text-black' : 'bg-black text-white hover:bg-zinc-800'
          }`}
        >
          Proceed to Payment
        </button>
      </motion.div>
    </div>
  );
};

// Sub-Views (Simplified for brevity in this turn)
const SellView = ({ onBack, isDark }: { onBack: () => void, isDark?: boolean }) => {
  const { user } = useAuth();
  const { showNotification } = useNotification();
  const [codes, setCodes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!user) return;
    if (!codes.trim()) return;
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'submissions'), {
        userId: user.uid,
        fileName: 'Manual Paste',
        fileSize: codes.length,
        status: 'pending',
        timestamp: new Date().toISOString(),
        codes: codes
      });
      showNotification('Submission successful! Admin will review your codes shortly.', 'success');
      setCodes('');
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'submissions');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-12">
      <div className="text-center space-y-4">
        <h2 className="text-5xl font-display font-black tracking-tighter">SELL YOUR CODES</h2>
        <p className={isDark ? 'text-zinc-400' : 'text-zinc-500'}>Turn your unused gift cards into instant cash.</p>
      </div>

      <div className={`rounded-[1.25rem] p-8 sm:p-12 border space-y-8 shadow-xl transition-colors duration-500 ${
        isDark ? 'bg-zinc-950 border-zinc-900 shadow-black' : 'bg-white border-zinc-100 shadow-zinc-100'
      }`}>
        <div className="space-y-4">
          <label className={`text-xs font-bold uppercase tracking-widest ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>Paste your codes here</label>
          <textarea 
            value={codes}
            onChange={(e) => setCodes(e.target.value)}
            placeholder="Enter one code per line..."
            className={`w-full h-64 p-6 rounded-2xl outline-none transition-all font-mono text-sm border ${
              isDark 
                ? 'bg-zinc-900 border-zinc-800 text-white focus:ring-2 focus:ring-zinc-700' 
                : 'bg-zinc-50 border-zinc-200 focus:ring-2 focus:ring-black'
            }`}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className={`p-6 rounded-2xl border space-y-2 ${isDark ? 'bg-zinc-900/40 border-zinc-900' : 'bg-zinc-50 border-zinc-100'}`}>
            <Upload className="w-6 h-6 text-zinc-400" />
            <p className="font-bold text-sm">Bulk Upload</p>
            <p className={isDark ? 'text-xs text-zinc-400' : 'text-xs text-zinc-500'}>Support for .txt, .csv, .json</p>
          </div>
          <div className={`p-6 rounded-2xl border space-y-2 ${isDark ? 'bg-zinc-900/40 border-zinc-900' : 'bg-zinc-50 border-zinc-100'}`}>
            <ShieldCheck className="w-6 h-6 text-zinc-400" />
            <p className="font-bold text-sm">Secure Verification</p>
            <p className={isDark ? 'text-xs text-zinc-400' : 'text-xs text-zinc-500'}>Codes are encrypted instantly</p>
          </div>
        </div>

        <button 
          onClick={handleSubmit}
          disabled={isSubmitting}
          className={`w-full py-5 rounded-[1rem] font-bold text-xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 ${
            isDark ? 'bg-white text-zinc-950 hover:bg-zinc-200' : 'bg-black text-white hover:bg-zinc-800'
          }`}
        >
          {isSubmitting ? 'Submitting...' : 'Submit for Review'}
        </button>
      </div>
    </div>
  );
};

const WalletView = ({ profile, onBack, onDeposit, isDark }: { profile: any, onBack: () => void, onDeposit: () => void, isDark?: boolean }) => {
  const { user } = useAuth();
  const { showNotification } = useNotification();
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, 'transactions'), where('userId', '==', user.uid), orderBy('timestamp', 'desc'));
    const unsub = onSnapshot(q, (snapshot) => {
      setTransactions(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Transaction)));
    });
    return () => unsub();
  }, [user]);

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6">
        <div className="space-y-2">
          <h2 className="text-4xl font-display font-black tracking-tighter">WALLET</h2>
          <p className={isDark ? 'text-zinc-400' : 'text-zinc-500'}>Manage your funds and transactions.</p>
        </div>
        <div className="flex gap-4 w-full sm:w-auto">
          <button 
            onClick={onDeposit} 
            className={`flex-1 sm:flex-none px-8 py-3 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 hover:scale-105 transition-transform ${
              isDark ? 'bg-white text-zinc-950 hover:bg-zinc-200' : 'bg-black text-white hover:bg-zinc-800'
            }`}
          >
            <Plus className="w-4 h-4" /> Deposit
          </button>
          <button className={`flex-1 sm:flex-none border px-8 py-3 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-colors ${
            isDark ? 'bg-zinc-900 border-zinc-800 hover:bg-zinc-805 text-white' : 'bg-white border-zinc-200 text-black hover:bg-zinc-100'
          }`}>
            Withdraw
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1 bg-black text-white p-8 rounded-[1.25rem] space-y-6 shadow-2xl shadow-black/20">
          <p className="text-xs font-bold uppercase tracking-widest opacity-50">Available Balance</p>
          <p className="text-5xl font-display font-black tracking-tighter">${profile?.walletBalance.toFixed(2)}</p>
          <div className="pt-6 border-t border-white/10 space-y-4">
            <div className="flex justify-between text-xs">
              <span className="opacity-50">Total Spent</span>
              <span className="font-bold">$1,240.00</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="opacity-50">Total Earned</span>
              <span className="font-bold">$450.00</span>
            </div>
          </div>
        </div>

        <div className={`md:col-span-2 rounded-[1.25rem] border p-8 space-y-6 ${
          isDark ? 'bg-zinc-950 border-zinc-900' : 'bg-white border-zinc-100'
        }`}>
          <h3 className="font-bold text-lg flex items-center gap-2">
            <History className="w-5 h-5" /> Transaction History
          </h3>
          <div className="space-y-4">
            {transactions.map(tx => (
              <div key={tx.id} className={`flex items-center justify-between py-4 border-b last:border-0 ${isDark ? 'border-zinc-900/60' : 'border-zinc-50'}`}>
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    tx.type === 'deposit' ? 'bg-green-500/10 text-green-400' : 
                    tx.type === 'purchase' ? 'bg-red-500/10 text-red-400' : 'bg-zinc-500/10 text-zinc-400'
                  }`}>
                    {tx.type === 'deposit' ? <Plus className="w-4 h-4" /> : <ShoppingBag className="w-4 h-4" />}
                  </div>
                  <div>
                    <p className="font-bold text-sm capitalize">{tx.type}</p>
                    <p className="text-[10px] text-zinc-400 font-medium">{format(new Date(tx.timestamp), 'MMM dd, yyyy • HH:mm')}</p>
                  </div>
                </div>
                <p className={`font-bold ${tx.type === 'deposit' || tx.type === 'sale' ? 'text-green-500' : 'text-red-550'}`}>
                  {tx.type === 'deposit' || tx.type === 'sale' ? '+' : '-'}${tx.amount.toFixed(2)}
                </p>
              </div>
            ))}
            {transactions.length === 0 && <p className="text-center py-12 text-zinc-400 text-sm">No transactions yet.</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

const OrdersView = ({ onBack, isDark }: { onBack: () => void, isDark?: boolean }) => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, 'orders'), where('userId', '==', user.uid), orderBy('timestamp', 'desc'));
    const unsub = onSnapshot(q, (snapshot) => {
      setOrders(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order)));
    });
    return () => unsub();
  }, [user]);

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <div className="space-y-2">
        <h2 className="text-4xl font-display font-black tracking-tighter">YOUR ORDERS</h2>
        <p className={isDark ? 'text-zinc-400' : 'text-zinc-500'}>Access your purchased gift card codes.</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {orders.map(order => (
          <div key={order.id} className={`rounded-2xl border p-6 flex flex-col sm:flex-row items-center gap-8 ${
            isDark ? 'bg-zinc-950 border-zinc-900 text-white' : 'bg-white border-zinc-100 text-zinc-900'
          }`}>
            <div className="w-32 h-20 rounded-lg overflow-hidden bg-zinc-900 shrink-0 border border-zinc-800">
              <img referrerPolicy="no-referrer" src={order.productImage || 'https://picsum.photos/seed/card/200/120'} alt="Card" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 space-y-1 text-center sm:text-left">
              <h3 className="font-bold text-lg">{order.productName}</h3>
              <p className="text-xs text-zinc-400 font-medium uppercase tracking-widest">{format(new Date(order.timestamp), 'MMMM dd, yyyy')}</p>
            </div>
            <div className={`px-6 py-4 rounded-xl border flex items-center gap-4 ${
              isDark ? 'bg-zinc-900 border-zinc-800 text-white' : 'bg-zinc-50 border-zinc-100'
            }`}>
              <code className="font-mono font-bold text-lg tracking-widest">{order.codes[0]}</code>
              <button className="text-zinc-400 hover:text-white transition-colors">
                <History className="w-4 h-4" />
              </button>
            </div>
            <div className="text-right">
              <p className="font-display font-black text-xl">${order.amount.toFixed(2)}</p>
              <div className="flex items-center justify-end gap-1 text-green-500">
                <CheckCircle2 className="w-3 h-3" />
                <span className="text-[10px] font-bold uppercase tracking-widest">Delivered</span>
              </div>
            </div>
          </div>
        ))}
        {orders.length === 0 && (
          <div className="py-20 text-center space-y-4">
            <ShoppingBag className="w-12 h-12 text-zinc-400 mx-auto" />
            <p className="text-zinc-500 font-medium">You haven't purchased any gift cards yet.</p>
            <button onClick={onBack} className={`font-bold text-sm underline underline-offset-4 ${isDark ? 'text-white' : 'text-black'}`}>Start Shopping</button>
          </div>
        )}
      </div>
    </div>
  );
};

const AdminPanel = ({ onBack }: { onBack: () => void }) => {
  const { showNotification } = useNotification();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [activeTab, setActiveTab] = useState<'submissions' | 'inventory' | 'orders'>('submissions');

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'submissions'), (snapshot) => {
      setSubmissions(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Submission)));
    });
    return () => unsub();
  }, []);

  const handleReview = async (sub: Submission) => {
    const valid = prompt('Enter valid percentage (0-100):', '100');
    const value = prompt('Enter estimated value ($):', '50');
    if (valid === null || value === null) return;

    try {
      await updateDoc(doc(db, 'submissions', sub.id), {
        status: 'checked',
        validPercentage: Number(valid),
        estimatedValue: Number(value)
      });
      showNotification('Submission updated.', 'success');
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, 'submissions');
    }
  };

  const handleAddCard = async () => {
    const brand = prompt('Brand Name:');
    const price = prompt('Real Price ($):');
    const discount = prompt('Discount (%):');
    const category = prompt('Category:');
    if (!brand || !price || !discount || !category) return;

    const finalPrice = Number(price) * (1 - Number(discount) / 100);

    try {
      await addDoc(collection(db, 'giftCards'), {
        brand,
        realPrice: Number(price),
        discount: Number(discount),
        finalPrice,
        category,
        image: `https://picsum.photos/seed/${brand}/400/300`,
        inventoryCount: 100,
        description: `Premium ${brand} gift card.`
      });
      showNotification('Gift card added.', 'success');
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'giftCards');
    }
  };

  const handleSeedDemoData = async () => {
    try {
      // 1. Add more Gift Cards
      const extraCards = [
        { brand: 'Steam', category: 'Gaming', realPrice: 50, discount: 10, finalPrice: 45, image: 'https://picsum.photos/seed/steam/400/300', inventoryCount: 100, description: 'Steam Wallet funds.' },
        { brand: 'Spotify', category: 'Music', realPrice: 30, discount: 0, finalPrice: 30, image: 'https://picsum.photos/seed/spotify/400/300', inventoryCount: 50, description: 'Spotify Premium subscription.' },
        { brand: 'Xbox', category: 'Gaming', realPrice: 25, discount: 20, finalPrice: 20, image: 'https://picsum.photos/seed/xbox/400/300', inventoryCount: 40, description: 'Xbox Live and Game Pass.' }
      ];
      for (const card of extraCards) {
        await addDoc(collection(db, 'giftCards'), card);
      }

      // 2. Add Mock Submissions
      const mockSubmissions = [
        { userId: 'demo-user-1', fileName: 'codes_batch_01.txt', fileSize: 1024, status: 'pending', timestamp: new Date().toISOString(), codes: 'ABC-123\nDEF-456' },
        { userId: 'demo-user-2', fileName: 'amazon_cards.csv', fileSize: 2048, status: 'checked', validPercentage: 85, estimatedValue: 120, timestamp: new Date().toISOString(), codes: 'GHI-789' }
      ];
      for (const sub of mockSubmissions) {
        await addDoc(collection(db, 'submissions'), sub);
      }

      showNotification('Demo data seeded successfully!', 'success');
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'demo-seeding');
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12">
      <div className="flex justify-between items-end">
        <div className="space-y-2">
          <h2 className="text-4xl font-display font-black tracking-tighter">ADMIN PANEL</h2>
          <p className="text-zinc-500">Manage marketplace operations and inventory.</p>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={handleSeedDemoData}
            className="text-xs font-bold text-zinc-400 hover:text-black transition-colors"
          >
            Seed Demo Data
          </button>
          <div className="flex gap-2 bg-zinc-100 p-1 rounded-xl">
            <TabButton active={activeTab === 'submissions'} onClick={() => setActiveTab('submissions')}>Submissions</TabButton>
            <TabButton active={activeTab === 'inventory'} onClick={() => setActiveTab('inventory')}>Inventory</TabButton>
            <TabButton active={activeTab === 'orders'} onClick={() => setActiveTab('orders')}>Orders</TabButton>
          </div>
        </div>
      </div>

      {activeTab === 'submissions' && (
        <div className="bg-white rounded-[1.25rem] border border-zinc-100 overflow-hidden shadow-xl shadow-zinc-100">
          <table className="w-full text-left">
            <thead className="bg-zinc-50 border-b border-zinc-100">
              <tr>
                <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-zinc-400">User</th>
                <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-zinc-400">File/Type</th>
                <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-zinc-400">Status</th>
                <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-zinc-400">Date</th>
                <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-zinc-400">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-50">
              {submissions.map(sub => (
                <tr key={sub.id} className="hover:bg-zinc-50/50 transition-colors">
                  <td className="px-8 py-6 font-bold text-sm">{sub.userId.substring(0, 8)}...</td>
                  <td className="px-8 py-6">
                    <p className="font-bold text-sm">{sub.fileName}</p>
                    <p className="text-[10px] text-zinc-400">{(sub.fileSize / 1024).toFixed(2)} KB</p>
                  </td>
                  <td className="px-8 py-6">
                    <Badge className={
                      sub.status === 'pending' ? 'bg-amber-50 text-amber-600 border-amber-100' : 
                      'bg-green-50 text-green-600 border-green-100'
                    }>
                      {sub.status}
                    </Badge>
                  </td>
                  <td className="px-8 py-6 text-xs text-zinc-500">{format(new Date(sub.timestamp), 'MMM dd')}</td>
                  <td className="px-8 py-6">
                    <button 
                      onClick={() => handleReview(sub)}
                      className="text-apple-blue font-bold text-xs hover:underline"
                    >
                      Review
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'inventory' && (
        <div className="space-y-6">
          <button onClick={handleAddCard} className="bg-black text-white px-8 py-4 rounded-xl font-bold text-sm flex items-center gap-2">
            <Plus className="w-4 h-4" /> Add New Gift Card
          </button>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Inventory list would go here */}
            <p className="text-zinc-400 italic">Inventory management view active.</p>
          </div>
        </div>
      )}
    </div>
  );
};

const TabButton = ({ children, active, onClick }: { children: React.ReactNode, active: boolean, onClick: () => void }) => (
  <button 
    onClick={onClick}
    className={`px-6 py-2 rounded-xl text-xs font-bold transition-all ${active ? 'bg-white text-black shadow-sm' : 'text-zinc-400 hover:text-zinc-600'}`}
  >
    {children}
  </button>
);

const ProfileView = ({ profile, onBack }: { profile: any, onBack: () => void }) => {
  return (
    <div className="max-w-2xl mx-auto space-y-12">
      <div className="text-center space-y-4">
        <div className="w-24 h-24 bg-zinc-100 rounded-3xl mx-auto flex items-center justify-center border-4 border-white shadow-xl">
          <UserIcon className="w-10 h-10 text-zinc-400" />
        </div>
        <h2 className="text-4xl font-display font-black tracking-tighter">{profile?.displayName}</h2>
        <p className="text-zinc-500">{profile?.email}</p>
      </div>

      <div className="bg-white rounded-[1.25rem] border border-zinc-100 p-8 space-y-8 shadow-xl shadow-zinc-100">
        <div className="flex items-center justify-between p-6 bg-zinc-50 rounded-2xl border border-zinc-100">
          <div className="flex items-center gap-4">
            <ShieldCheck className="w-6 h-6 text-zinc-400" />
            <div>
              <p className="font-bold text-sm">Two-Factor Authentication</p>
              <p className="text-xs text-zinc-500">Secure your account with 2FA</p>
            </div>
          </div>
          <button className={`px-4 py-2 rounded-xl text-xs font-bold ${profile?.twoFactorEnabled ? 'bg-green-100 text-green-600' : 'bg-black text-white'}`}>
            {profile?.twoFactorEnabled ? 'Enabled' : 'Enable'}
          </button>
        </div>

        <div className="space-y-4">
          <h3 className="font-bold text-sm uppercase tracking-widest text-zinc-400 px-2">Account Details</h3>
          <div className="space-y-2">
            <DetailItem label="Member Since" value={format(new Date(profile?.createdAt || Date.now()), 'MMMM yyyy')} />
            <DetailItem label="Account Role" value={profile?.role} />
            <DetailItem label="Total Transactions" value="12" />
          </div>
        </div>
      </div>
    </div>
  );
};

const DetailItem = ({ label, value }: { label: string, value: string }) => (
  <div className="flex justify-between items-center p-4 hover:bg-zinc-50 rounded-xl transition-colors">
    <span className="text-sm text-zinc-500 font-medium">{label}</span>
    <span className="text-sm font-bold capitalize">{value}</span>
  </div>
);

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
