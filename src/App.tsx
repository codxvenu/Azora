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
  Sun
} from 'lucide-react';
import { useAuth, AuthProvider } from './lib/useAuth';
import { NotificationProvider, useNotification } from './lib/useNotification';
import { ErrorBoundary } from './components/ErrorBoundary';
import { db, handleFirestoreError, OperationType } from './lib/firebase';
import { collection, onSnapshot, query, where, orderBy, addDoc, doc, updateDoc, increment, getDoc } from 'firebase/firestore';
import { GiftCard, Order, Submission, Withdrawal, Transaction } from './types';
import { format } from 'date-fns';

// Views
type View = 'browse' | 'sell' | 'wallet' | 'orders' | 'admin' | 'profile';

const AppContent = () => {
  const { user, profile, loading, login, logout } = useAuth();
  const { showNotification } = useNotification();
  const [currentView, setCurrentView] = useState<View>('browse');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [giftCards, setGiftCards] = useState<GiftCard[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [selectedCard, setSelectedCard] = useState<GiftCard | null>(null);
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);

  // Fetch Gift Cards
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'giftCards'), (snapshot) => {
      if (snapshot.empty && profile?.role === 'admin') {
        // Seed initial data
        const initialCards = [
          { brand: 'Apple', category: 'Music & Entertaiment', realPrice: 100, discount: 10, finalPrice: 90, image: 'https://picsum.photos/seed/apple/400/300', inventoryCount: 50, description: 'Apple Gift Card for everything Apple.' },
          { brand: 'Amazon', category: 'Shopping', realPrice: 50, discount: 5, finalPrice: 47.5, image: 'https://picsum.photos/seed/amazon/400/300', inventoryCount: 100, description: 'Shop millions of items on Amazon.' },
          { brand: 'PlayStation', category: 'Gaming', realPrice: 60, discount: 15, finalPrice: 51, image: 'https://picsum.photos/seed/ps5/400/300', inventoryCount: 30, description: 'Top up your PSN wallet.' },
          { brand: 'Netflix', category: 'Streaming', realPrice: 25, discount: 0, finalPrice: 25, image: 'https://picsum.photos/seed/netflix/400/300', inventoryCount: 80, description: 'Unlimited movies and TV shows.' }
        ];
        initialCards.forEach(card => addDoc(collection(db, 'giftCards'), card));
      }
      const cards = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as GiftCard));
      setGiftCards(cards);
    }, (err) => {
      console.error('Firestore Error:', err);
      // Don't throw here to avoid crash loop, just show notification
      showNotification('Failed to load gift cards. Please check your connection.', 'error');
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
    <div className="min-h-screen bg-[#FBFBFB] text-zinc-900 font-sans selection:bg-black selection:text-white">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-zinc-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-8">
              <button 
                onClick={() => setCurrentView('browse')}
                className="text-2xl font-display font-black tracking-tighter hover:opacity-80 transition-opacity"
              >
                AURA
              </button>
              
              <div className="hidden md:flex items-center gap-6">
                <NavButton active={currentView === 'browse'} onClick={() => setCurrentView('browse')}>Browse</NavButton>
                <NavButton active={currentView === 'sell'} onClick={() => setCurrentView('sell')}>Sell</NavButton>
                {user && <NavButton active={currentView === 'orders'} onClick={() => setCurrentView('orders')}>Orders</NavButton>}
                {profile?.role === 'admin' && <NavButton active={currentView === 'admin'} onClick={() => setCurrentView('admin')}>Admin</NavButton>}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <a 
                href={window.location.href} 
                target="_blank" 
                rel="noopener noreferrer"
                className="hidden lg:flex items-center gap-1 text-[10px] font-bold text-zinc-400 hover:text-black transition-colors uppercase tracking-widest"
              >
                Open in New Tab <ArrowRight className="w-3 h-3" />
              </a>

              {user ? (
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => setCurrentView('wallet')}
                    className="hidden sm:flex items-center gap-2 bg-zinc-50 hover:bg-zinc-100 px-4 py-2 rounded-full border border-zinc-200 transition-all group"
                  >
                    <Wallet className="w-4 h-4 text-zinc-500 group-hover:text-black" />
                    <span className="font-bold text-sm">${profile?.walletBalance.toFixed(2)}</span>
                  </button>
                  
                  <div className="relative group">
                    <button className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center border border-zinc-200 overflow-hidden">
                      {user.photoURL ? (
                        <img src={user.photoURL} alt="Avatar" className="w-full h-full object-cover" />
                      ) : (
                        <UserIcon className="w-5 h-5 text-zinc-500" />
                      )}
                    </button>
                    
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-zinc-100 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                      <button onClick={() => setCurrentView('profile')} className="w-full px-4 py-2 text-left text-sm hover:bg-zinc-50 flex items-center gap-2">
                        <UserIcon className="w-4 h-4" /> Profile
                      </button>
                      <button onClick={logout} className="w-full px-4 py-2 text-left text-sm hover:bg-zinc-50 text-red-600 flex items-center gap-2">
                        <LogOut className="w-4 h-4" /> Logout
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <button 
                  onClick={login}
                  className="bg-black text-white px-6 py-2 rounded-full font-bold text-sm hover:bg-zinc-800 transition-all"
                >
                  Sign In
                </button>
              )}
              
              <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
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
              <div className="bg-zinc-900 rounded-[3rem] p-8 sm:p-16 text-white relative overflow-hidden">
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
                    className="bg-white text-black px-8 py-4 rounded-full font-bold text-lg hover:scale-105 transition-transform flex items-center gap-2"
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
              <div id="marketplace" className="space-y-8">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                  <h2 className="text-3xl font-display font-bold tracking-tight">Featured Cards</h2>
                  
                  <div className="flex items-center gap-4 w-full sm:w-auto">
                    <motion.div 
                      initial={false}
                      animate={{ width: isSearchFocused || searchQuery ? (window.innerWidth < 640 ? '100%' : '320px') : '48px' }}
                      className="relative h-12 bg-white border border-zinc-200 rounded-full overflow-hidden transition-all duration-300"
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
                          className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all ${
                            selectedCategory === cat 
                              ? 'bg-black text-white' 
                              : 'bg-white text-zinc-500 border border-zinc-200 hover:border-zinc-400'
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                  {filteredCards.map(card => (
                    <GiftCardItem key={card.id} card={card} onClick={() => setSelectedCard(card)} />
                  ))}
                  {filteredCards.length === 0 && (
                    <div className="col-span-full py-20 text-center text-zinc-500">
                      <p className="text-xl font-medium">No gift cards found matching your search.</p>
                    </div>
                  )}
                </div>

                {/* Why Choose Us */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-20">
                  <div className="space-y-4 p-8 bg-white rounded-[2.5rem] border border-zinc-100">
                    <div className="w-12 h-12 bg-zinc-900 text-white rounded-2xl flex items-center justify-center">
                      <ShieldCheck className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold">Secure Escrow</h3>
                    <p className="text-zinc-500 text-sm leading-relaxed">Your funds are held in secure escrow until you verify the gift card code. 100% protection guaranteed.</p>
                  </div>
                  <div className="space-y-4 p-8 bg-white rounded-[2.5rem] border border-zinc-100">
                    <div className="w-12 h-12 bg-zinc-900 text-white rounded-2xl flex items-center justify-center">
                      <Plus className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold">Instant Delivery</h3>
                    <p className="text-zinc-500 text-sm leading-relaxed">No waiting. Get your codes delivered to your dashboard and email the second your payment is confirmed.</p>
                  </div>
                  <div className="space-y-4 p-8 bg-white rounded-[2.5rem] border border-zinc-100">
                    <div className="w-12 h-12 bg-zinc-900 text-white rounded-2xl flex items-center justify-center">
                      <History className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold">24/7 Support</h3>
                    <p className="text-zinc-500 text-sm leading-relaxed">Our dedicated support team is available around the clock to assist you with any issues or questions.</p>
                  </div>
                </div>

                {/* How it Works */}
                <div className="space-y-12 py-20">
                  <div className="text-center space-y-4">
                    <h2 className="text-4xl font-display font-black tracking-tighter">HOW IT WORKS</h2>
                    <p className="text-zinc-500">Three simple steps to start trading.</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    {[
                      { step: '01', title: 'Create Account', desc: 'Sign up in seconds with Google or email and secure your account.' },
                      { step: '02', title: 'Add Funds', desc: 'Deposit funds into your secure wallet using card or crypto.' },
                      { step: '03', title: 'Start Trading', desc: 'Buy gift cards at a discount or sell your unused codes for cash.' }
                    ].map((item, i) => (
                      <div key={i} className="relative space-y-4 text-center">
                        <span className="text-8xl font-display font-black text-zinc-100 absolute -top-10 left-1/2 -translate-x-1/2 -z-10">{item.step}</span>
                        <h3 className="text-xl font-bold pt-4">{item.title}</h3>
                        <p className="text-zinc-500 text-sm max-w-xs mx-auto">{item.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {currentView === 'sell' && <SellView onBack={() => setCurrentView('browse')} />}
          {currentView === 'wallet' && <WalletView profile={profile} onBack={() => setCurrentView('browse')} onDeposit={() => setIsDepositModalOpen(true)} />}
          {currentView === 'orders' && <OrdersView onBack={() => setCurrentView('browse')} />}
          {currentView === 'admin' && <AdminPanel onBack={() => setCurrentView('browse')} />}
          {currentView === 'profile' && <ProfileView profile={profile} onBack={() => setCurrentView('browse')} />}
        </AnimatePresence>

        {/* Product Detail Slide-up */}
        <AnimatePresence>
          {selectedCard && (
            <ProductDetailView 
              card={selectedCard} 
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
      <footer className="bg-white border-t border-zinc-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="space-y-4">
              <h3 className="text-xl font-display font-black tracking-tighter">AURA</h3>
              <p className="text-zinc-500 text-sm leading-relaxed">
                The world's most trusted digital marketplace for gift cards and game keys.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Marketplace</h4>
              <ul className="space-y-2 text-sm text-zinc-500">
                <li><button onClick={() => setCurrentView('browse')}>Browse Cards</button></li>
                <li><button onClick={() => setCurrentView('sell')}>Sell Codes</button></li>
                <li><button>Trending Deals</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-zinc-500">
                <li><button>Help Center</button></li>
                <li><button>Safety & Trust</button></li>
                <li><button>Contact Us</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-zinc-500">
                <li><button>Privacy Policy</button></li>
                <li><button>Terms of Service</button></li>
                <li><button>Refund Policy</button></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-zinc-100 flex flex-col sm:flex-row justify-between items-center gap-4 text-zinc-400 text-xs font-medium uppercase tracking-widest">
            <p>© 2024 AURA DIGITAL MARKETPLACE. ALL RIGHTS RESERVED.</p>
            <div className="flex gap-6">
              <button>Twitter</button>
              <button>Discord</button>
              <button>Instagram</button>
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

const NavButton = ({ children, active, onClick }: { children: React.ReactNode, active: boolean, onClick: () => void }) => (
  <button 
    onClick={onClick}
    className={`text-sm font-bold transition-all ${active ? 'text-black' : 'text-zinc-400 hover:text-zinc-600'}`}
  >
    {children}
  </button>
);

const Badge = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${className}`}>
    {children}
  </span>
);

const GiftCardItem = ({ card, onClick }: { card: GiftCard, onClick: () => void }) => (
  <motion.div 
    whileHover={{ y: -5 }}
    onClick={onClick}
    className="bg-white rounded-3xl border border-zinc-100 p-3 sm:p-5 space-y-3 sm:space-y-4 hover:shadow-2xl hover:shadow-zinc-200/50 transition-all group cursor-pointer"
  >
    <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-zinc-50 relative">
      <img src={card.image} alt={card.brand} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
      {card.discount > 0 && (
        <div className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-red-500 text-white text-[8px] sm:text-[10px] font-black px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-lg">
          -{card.discount}%
        </div>
      )}
    </div>
    
    <div className="space-y-1 sm:space-y-2">
      <p className="text-[8px] sm:text-[10px] font-bold text-zinc-400 uppercase tracking-widest truncate">{card.category}</p>
      <h3 className="font-bold text-sm sm:text-lg truncate">{card.brand}</h3>
      <div className="flex justify-between items-end">
        <div>
          <p className="text-base sm:text-xl font-display font-black">${card.finalPrice.toFixed(2)}</p>
          {card.discount > 0 && (
            <p className="text-[8px] sm:text-[10px] text-zinc-400 line-through font-bold">${card.realPrice.toFixed(2)}</p>
          )}
        </div>
        <button className="w-8 h-8 sm:w-10 sm:h-10 bg-zinc-50 rounded-full flex items-center justify-center group-hover:bg-black group-hover:text-white transition-colors">
          <Plus className="w-4 h-4" />
        </button>
      </div>
    </div>
  </motion.div>
);

const ProductDetailView = ({ card, onClose, onBuy }: { card: GiftCard, onClose: () => void, onBuy: () => void }) => (
  <div className="fixed inset-0 z-[100] flex items-end justify-center p-4 sm:p-6">
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="absolute inset-0 bg-black/40 backdrop-blur-sm"
    />
    <motion.div 
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="relative w-full max-w-2xl bg-white rounded-t-[3rem] p-8 sm:p-12 space-y-8 shadow-2xl"
    >
      <button onClick={onClose} className="absolute top-6 right-8 w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center hover:bg-zinc-200 transition-colors">
        <X className="w-5 h-5" />
      </button>

      <div className="flex flex-col sm:flex-row gap-8">
        <div className="w-full sm:w-1/2 aspect-[4/3] rounded-3xl overflow-hidden bg-zinc-50">
          <img src={card.image} alt={card.brand} className="w-full h-full object-cover" />
        </div>
        <div className="flex-1 space-y-6">
          <div className="space-y-2">
            <Badge className="bg-zinc-100 text-zinc-500 border-zinc-200">{card.category}</Badge>
            <h2 className="text-4xl font-display font-black tracking-tighter">{card.brand}</h2>
            <p className="text-zinc-500 text-sm leading-relaxed">{card.description}</p>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-end gap-3">
              <p className="text-4xl font-display font-black">${card.finalPrice.toFixed(2)}</p>
              {card.discount > 0 && (
                <p className="text-lg text-zinc-400 line-through font-bold pb-1">${card.realPrice.toFixed(2)}</p>
              )}
            </div>
            <div className="flex items-center gap-2 text-green-600 font-bold text-xs uppercase tracking-widest">
              <ShieldCheck className="w-4 h-4" /> Instant Delivery Guaranteed
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button 
          onClick={onBuy}
          className="bg-black text-white py-5 rounded-[2rem] font-bold text-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
        >
          Buy Now <ArrowRight className="w-6 h-6" />
        </button>
        <button className="bg-zinc-100 text-black py-5 rounded-[2rem] font-bold text-xl hover:bg-zinc-200 transition-all">
          Add to Cart
        </button>
      </div>
    </motion.div>
  </div>
);

const DepositModal = ({ onClose, onSuccess }: { onClose: () => void, onSuccess: (amount: number) => void }) => {
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState<'card' | 'crypto' | 'razorpay' | null>(null);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
      />
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="relative w-full max-w-lg bg-white rounded-[3rem] p-8 sm:p-12 space-y-8 shadow-2xl"
      >
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-display font-black tracking-tighter">DEPOSIT FUNDS</h2>
          <p className="text-zinc-500">Choose your preferred payment method.</p>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-zinc-400 px-2">Amount to Deposit ($)</label>
            <input 
              type="number" 
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="w-full p-6 rounded-3xl bg-zinc-50 border border-zinc-200 focus:ring-2 focus:ring-black outline-none transition-all font-display font-black text-3xl text-center"
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
                className={`p-5 rounded-2xl border flex items-center justify-between transition-all ${
                  method === m.id ? 'border-black bg-black text-white' : 'border-zinc-100 bg-zinc-50 hover:border-zinc-300'
                }`}
              >
                <div className="flex items-center gap-4">
                  <m.icon className={`w-6 h-6 ${method === m.id ? 'text-white' : 'text-zinc-400'}`} />
                  <span className="font-bold">{m.name}</span>
                </div>
                {method === m.id && <CheckCircle2 className="w-5 h-5" />}
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
          className="w-full bg-black text-white py-5 rounded-[2rem] font-bold text-xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
        >
          Proceed to Payment
        </button>
      </motion.div>
    </div>
  );
};

// Sub-Views (Simplified for brevity in this turn)
const SellView = ({ onBack }: { onBack: () => void }) => {
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
        <p className="text-zinc-500">Turn your unused gift cards into instant cash.</p>
      </div>

      <div className="bg-white rounded-[2.5rem] p-8 sm:p-12 border border-zinc-100 space-y-8 shadow-xl shadow-zinc-100">
        <div className="space-y-4">
          <label className="text-xs font-bold uppercase tracking-widest text-zinc-400">Paste your codes here</label>
          <textarea 
            value={codes}
            onChange={(e) => setCodes(e.target.value)}
            placeholder="Enter one code per line..."
            className="w-full h-64 p-6 rounded-3xl bg-zinc-50 border border-zinc-200 focus:ring-2 focus:ring-black outline-none transition-all font-mono text-sm"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="p-6 rounded-3xl bg-zinc-50 border border-zinc-100 space-y-2">
            <Upload className="w-6 h-6 text-zinc-400" />
            <p className="font-bold text-sm">Bulk Upload</p>
            <p className="text-xs text-zinc-500">Support for .txt, .csv, .json</p>
          </div>
          <div className="p-6 rounded-3xl bg-zinc-50 border border-zinc-100 space-y-2">
            <ShieldCheck className="w-6 h-6 text-zinc-400" />
            <p className="font-bold text-sm">Secure Verification</p>
            <p className="text-xs text-zinc-500">Codes are encrypted instantly</p>
          </div>
        </div>

        <button 
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="w-full bg-black text-white py-5 rounded-[2rem] font-bold text-xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
        >
          {isSubmitting ? 'Submitting...' : 'Submit for Review'}
        </button>
      </div>
    </div>
  );
};

const WalletView = ({ profile, onBack, onDeposit }: { profile: any, onBack: () => void, onDeposit: () => void }) => {
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
          <p className="text-zinc-500">Manage your funds and transactions.</p>
        </div>
        <div className="flex gap-4 w-full sm:w-auto">
          <button onClick={onDeposit} className="flex-1 sm:flex-none bg-black text-white px-8 py-3 rounded-full font-bold text-sm flex items-center justify-center gap-2">
            <Plus className="w-4 h-4" /> Deposit
          </button>
          <button className="flex-1 sm:flex-none bg-white border border-zinc-200 px-8 py-3 rounded-full font-bold text-sm flex items-center justify-center gap-2">
            Withdraw
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1 bg-black text-white p-8 rounded-[2.5rem] space-y-6 shadow-2xl shadow-black/20">
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

        <div className="md:col-span-2 bg-white rounded-[2.5rem] border border-zinc-100 p-8 space-y-6">
          <h3 className="font-bold text-lg flex items-center gap-2">
            <History className="w-5 h-5" /> Transaction History
          </h3>
          <div className="space-y-4">
            {transactions.map(tx => (
              <div key={tx.id} className="flex items-center justify-between py-4 border-b border-zinc-50 last:border-0">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    tx.type === 'deposit' ? 'bg-green-50 text-green-600' : 
                    tx.type === 'purchase' ? 'bg-red-50 text-red-600' : 'bg-zinc-50 text-zinc-600'
                  }`}>
                    {tx.type === 'deposit' ? <Plus className="w-4 h-4" /> : <ShoppingBag className="w-4 h-4" />}
                  </div>
                  <div>
                    <p className="font-bold text-sm capitalize">{tx.type}</p>
                    <p className="text-[10px] text-zinc-400 font-medium">{format(new Date(tx.timestamp), 'MMM dd, yyyy • HH:mm')}</p>
                  </div>
                </div>
                <p className={`font-bold ${tx.type === 'deposit' || tx.type === 'sale' ? 'text-green-600' : 'text-red-600'}`}>
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

const OrdersView = ({ onBack }: { onBack: () => void }) => {
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
        <p className="text-zinc-500">Access your purchased gift card codes.</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {orders.map(order => (
          <div key={order.id} className="bg-white rounded-3xl border border-zinc-100 p-6 flex flex-col sm:flex-row items-center gap-8">
            <div className="w-32 h-20 rounded-xl overflow-hidden bg-zinc-50 shrink-0">
              <img src={order.productImage || 'https://picsum.photos/seed/card/200/120'} alt="Card" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 space-y-1 text-center sm:text-left">
              <h3 className="font-bold text-lg">{order.productName}</h3>
              <p className="text-xs text-zinc-400 font-medium uppercase tracking-widest">{format(new Date(order.timestamp), 'MMMM dd, yyyy')}</p>
            </div>
            <div className="bg-zinc-50 px-6 py-4 rounded-2xl border border-zinc-100 flex items-center gap-4">
              <code className="font-mono font-bold text-lg tracking-widest">{order.codes[0]}</code>
              <button className="text-zinc-400 hover:text-black transition-colors">
                <History className="w-4 h-4" />
              </button>
            </div>
            <div className="text-right">
              <p className="font-display font-black text-xl">${order.amount.toFixed(2)}</p>
              <div className="flex items-center justify-end gap-1 text-green-600">
                <CheckCircle2 className="w-3 h-3" />
                <span className="text-[10px] font-bold uppercase tracking-widest">Delivered</span>
              </div>
            </div>
          </div>
        ))}
        {orders.length === 0 && (
          <div className="py-20 text-center space-y-4">
            <ShoppingBag className="w-12 h-12 text-zinc-200 mx-auto" />
            <p className="text-zinc-500 font-medium">You haven't purchased any gift cards yet.</p>
            <button onClick={onBack} className="text-black font-bold text-sm underline underline-offset-4">Start Shopping</button>
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
          <div className="flex gap-2 bg-zinc-100 p-1 rounded-full">
            <TabButton active={activeTab === 'submissions'} onClick={() => setActiveTab('submissions')}>Submissions</TabButton>
            <TabButton active={activeTab === 'inventory'} onClick={() => setActiveTab('inventory')}>Inventory</TabButton>
            <TabButton active={activeTab === 'orders'} onClick={() => setActiveTab('orders')}>Orders</TabButton>
          </div>
        </div>
      </div>

      {activeTab === 'submissions' && (
        <div className="bg-white rounded-[2.5rem] border border-zinc-100 overflow-hidden shadow-xl shadow-zinc-100">
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
          <button onClick={handleAddCard} className="bg-black text-white px-8 py-4 rounded-full font-bold text-sm flex items-center gap-2">
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
    className={`px-6 py-2 rounded-full text-xs font-bold transition-all ${active ? 'bg-white text-black shadow-sm' : 'text-zinc-400 hover:text-zinc-600'}`}
  >
    {children}
  </button>
);

const ProfileView = ({ profile, onBack }: { profile: any, onBack: () => void }) => {
  return (
    <div className="max-w-2xl mx-auto space-y-12">
      <div className="text-center space-y-4">
        <div className="w-24 h-24 bg-zinc-100 rounded-full mx-auto flex items-center justify-center border-4 border-white shadow-xl">
          <UserIcon className="w-10 h-10 text-zinc-400" />
        </div>
        <h2 className="text-4xl font-display font-black tracking-tighter">{profile?.displayName}</h2>
        <p className="text-zinc-500">{profile?.email}</p>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-zinc-100 p-8 space-y-8 shadow-xl shadow-zinc-100">
        <div className="flex items-center justify-between p-6 bg-zinc-50 rounded-3xl border border-zinc-100">
          <div className="flex items-center gap-4">
            <ShieldCheck className="w-6 h-6 text-zinc-400" />
            <div>
              <p className="font-bold text-sm">Two-Factor Authentication</p>
              <p className="text-xs text-zinc-500">Secure your account with 2FA</p>
            </div>
          </div>
          <button className={`px-4 py-2 rounded-full text-xs font-bold ${profile?.twoFactorEnabled ? 'bg-green-100 text-green-600' : 'bg-black text-white'}`}>
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
  <div className="flex justify-between items-center p-4 hover:bg-zinc-50 rounded-2xl transition-colors">
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
