import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { products, DigitalProduct } from './data/products';
import { ProductCard } from './components/ProductCard';
import { ProductDetail } from './components/ProductDetail';
import { CartSheet } from './components/CartSheet';
import { Dashboard } from './components/Dashboard';
import { 
  Search, ShoppingBag, User, Sparkles, 
  Filter, X, TrendingUp, Zap, ShieldCheck,
  ChevronRight, Globe, Monitor, Gamepad2,
  Moon, Sun
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

type View = 'marketplace' | 'detail' | 'dashboard';

export default function App() {
  const [activeView, setActiveView] = useState<View>('marketplace');
  const [selectedProduct, setSelectedProduct] = useState<DigitalProduct | null>(null);
  const [cartItems, setCartItems] = useState<DigitalProduct[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           p.brand.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  const trendingProducts = useMemo(() => products.slice(0, 4), []);
  const newArrivals = useMemo(() => products.slice(2, 6), []);

  const handleProductClick = (product: DigitalProduct) => {
    setSelectedProduct(product);
    setActiveView('detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const addToCart = (product: DigitalProduct) => {
    if (!cartItems.find(item => item.id === product.id)) {
      setCartItems([...cartItems, product]);
    }
    setIsCartOpen(true);
  };

  const removeFromCart = (id: string) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  return (
    <div className="min-h-screen bg-[#fbfbfd] dark:bg-black text-[#1d1d1f] dark:text-[#f5f5f7] font-sans selection:bg-apple-blue/10 selection:text-apple-blue overflow-x-hidden">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 glass border-b border-gray-200/50 dark:border-white/10">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div 
            className="flex items-center gap-2 cursor-pointer group" 
            onClick={() => setActiveView('marketplace')}
          >
            <div className="w-8 h-8 bg-black dark:bg-white rounded-lg flex items-center justify-center smooth-transition group-hover:scale-110">
              <Sparkles className="w-5 h-5 text-white dark:text-black" />
            </div>
            <span className="font-display font-bold text-xl tracking-tight hidden sm:block">Aura</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-500 dark:text-gray-400">
            <button 
              onClick={() => setActiveView('marketplace')}
              className={`smooth-transition ${activeView === 'marketplace' ? 'text-black dark:text-white' : 'hover:text-black dark:hover:text-white'}`}
            >
              Marketplace
            </button>
            <button className="hover:text-black dark:hover:text-white transition-colors">Trending</button>
            <button className="hover:text-black dark:hover:text-white transition-colors">Software</button>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input 
                placeholder="Search products..." 
                className="pl-9 h-10 w-48 lg:w-64 rounded-full bg-apple-gray dark:bg-zinc-900 border-none focus-visible:ring-2 focus-visible:ring-apple-blue"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <button 
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full smooth-transition"
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            <button 
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full smooth-transition"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartItems.length > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-apple-blue text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {cartItems.length}
                </span>
              )}
            </button>
            <button 
              onClick={() => setActiveView('dashboard')}
              className={`p-2 rounded-full smooth-transition ${activeView === 'dashboard' ? 'bg-black dark:bg-white text-white dark:text-black' : 'hover:bg-gray-100 dark:hover:bg-zinc-800'}`}
            >
              <User className="w-5 h-5" />
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-6 md:py-8">
        <AnimatePresence mode="wait">
          {activeView === 'marketplace' && (
            <motion.div
              key="marketplace"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-12 md:space-y-20"
            >
              {/* Hero Banner */}
              <section className="relative h-[300px] md:h-[460px] rounded-[2rem] md:rounded-[3rem] overflow-hidden apple-shadow-lg group">
                <img 
                  src="https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1920&auto=format&fit=crop" 
                  className="absolute inset-0 w-full h-full object-cover smooth-transition group-hover:scale-105"
                  alt="Hero"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-transparent flex flex-col justify-center p-6 md:p-16 space-y-4 md:space-y-8">
                  <div className="flex items-center gap-3">
                    <Badge className="bg-apple-blue text-white border-none px-3 py-1 md:px-4 md:py-1.5 text-[10px] md:text-xs font-bold rounded-full">
                      New Arrival
                    </Badge>
                    <div className="flex items-center gap-1 text-white/60 text-[10px] md:text-xs font-bold uppercase tracking-widest">
                      <Zap className="w-3 h-3" />
                      <span>Instant Delivery</span>
                    </div>
                  </div>
                  <h1 className="text-3xl md:text-6xl lg:text-8xl font-display font-bold text-white leading-tight md:leading-[0.9] tracking-tighter max-w-3xl">
                    Level up your <br className="hidden md:block" />
                    <span className="text-white/40">digital library.</span>
                  </h1>
                  <p className="text-white/70 text-sm md:text-xl max-w-md font-medium leading-relaxed hidden sm:block">
                    Premium game keys, software, and subscriptions at unbeatable prices. High trust, zero clutter.
                  </p>
                  <div className="flex items-center gap-3 md:gap-4">
                    <Button className="h-10 md:h-14 px-6 md:px-8 rounded-xl md:rounded-2xl bg-white text-black hover:bg-white/90 text-sm md:text-lg font-bold shadow-2xl shadow-white/10">
                      Shop Now
                    </Button>
                    <Button variant="ghost" className="h-10 md:h-14 px-6 md:px-8 rounded-xl md:rounded-2xl text-white hover:bg-white/10 text-sm md:text-lg font-bold">
                      View Deals
                    </Button>
                  </div>
                </div>
              </section>

              {/* Trending Section */}
              <section className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-apple-blue" />
                    <h2 className="text-xl md:text-2xl font-display font-bold tracking-tight">Trending Now</h2>
                  </div>
                  <Button variant="ghost" size="sm" className="text-apple-blue font-bold">View All</Button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
                  {trendingProducts.map((product) => (
                    <ProductCard 
                      key={product.id} 
                      product={product} 
                      onClick={handleProductClick}
                    />
                  ))}
                </div>
              </section>

              {/* Browse Section */}
              <section className="space-y-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="space-y-1">
                    <h2 className="text-xl md:text-3xl font-display font-bold tracking-tight">Marketplace</h2>
                    <p className="text-muted-foreground text-xs md:text-sm font-medium">Explore thousands of verified digital products.</p>
                  </div>
                  <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-2 md:pb-0">
                    <Button variant="outline" className="rounded-full gap-2 border-gray-200 dark:border-zinc-800 shrink-0">
                      <Filter className="w-4 h-4" />
                      Filters
                    </Button>
                    <div className="h-8 w-[1px] bg-gray-200 dark:bg-zinc-800 mx-1 shrink-0" />
                    <div className="flex gap-2">
                      {['All', 'Games', 'Software', 'Subscriptions'].map((cat) => (
                        <button
                          key={cat}
                          onClick={() => setSelectedCategory(cat)}
                          className={`px-4 md:px-6 py-2 md:py-2.5 rounded-full border smooth-transition font-medium text-xs md:text-sm shrink-0 ${
                            selectedCategory === cat 
                              ? 'bg-black dark:bg-white text-white dark:text-black border-black dark:border-white shadow-lg shadow-black/10' 
                              : 'bg-white dark:bg-zinc-900 text-gray-500 border-gray-200 dark:border-zinc-800 hover:border-black dark:hover:border-white hover:text-black dark:hover:text-white'
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Product Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-8">
                  <AnimatePresence mode="popLayout">
                    {filteredProducts.map((product) => (
                      <ProductCard 
                        key={product.id} 
                        product={product} 
                        onClick={handleProductClick}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              </section>

              {/* Trust Section */}
              <section className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 pt-12">
                {[
                  { icon: ShieldCheck, title: "Aura Protection", desc: "100% money-back guarantee." },
                  { icon: Zap, title: "Instant Access", desc: "Delivered instantly to you." },
                  { icon: Globe, title: "Global Reach", desc: "Every region and platform." },
                  { icon: User, title: "Verified Sellers", desc: "Only the most trusted sellers." }
                ].map((item, i) => (
                  <div key={i} className="p-4 md:p-8 rounded-2xl md:rounded-[2.5rem] bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 apple-shadow space-y-2 md:space-y-4">
                    <div className="w-8 h-8 md:w-12 md:h-12 bg-apple-gray dark:bg-zinc-800 rounded-xl md:rounded-2xl flex items-center justify-center">
                      <item.icon className="w-4 h-4 md:w-6 md:h-6 text-black dark:text-white" />
                    </div>
                    <h3 className="text-sm md:text-lg font-display font-bold">{item.title}</h3>
                    <p className="text-[10px] md:text-xs text-muted-foreground leading-relaxed font-medium">{item.desc}</p>
                  </div>
                ))}
              </section>
            </motion.div>
          )}

          {activeView === 'detail' && selectedProduct && (
            <ProductDetail 
              product={selectedProduct} 
              onBack={() => setActiveView('marketplace')}
              onAddToCart={addToCart}
            />
          )}

          {activeView === 'dashboard' && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <Dashboard />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="bg-white dark:bg-black border-t border-gray-200 dark:border-white/10 mt-20 py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-black dark:bg-white rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white dark:text-black" />
              </div>
              <span className="font-display font-bold text-xl tracking-tight">Aura</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed font-medium">
              The world's most trusted digital marketplace. Reimagined for speed, clarity, and confidence.
            </p>
          </div>
          <div className="space-y-6 hidden sm:block">
            <h4 className="font-bold text-sm uppercase tracking-widest text-gray-400">Marketplace</h4>
            <ul className="space-y-4 text-sm font-medium text-gray-500">
              <li><a href="#" className="hover:text-black dark:hover:text-white transition-colors">Trending Games</a></li>
              <li><a href="#" className="hover:text-black dark:hover:text-white transition-colors">Software Keys</a></li>
              <li><a href="#" className="hover:text-black dark:hover:text-white transition-colors">Subscriptions</a></li>
            </ul>
          </div>
          <div className="space-y-6 hidden sm:block">
            <h4 className="font-bold text-sm uppercase tracking-widest text-gray-400">Support</h4>
            <ul className="space-y-4 text-sm font-medium text-gray-500">
              <li><a href="#" className="hover:text-black dark:hover:text-white transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-black dark:hover:text-white transition-colors">Aura Protection</a></li>
              <li><a href="#" className="hover:text-black dark:hover:text-white transition-colors">Refund Policy</a></li>
            </ul>
          </div>
          <div className="space-y-6">
            <h4 className="font-bold text-sm uppercase tracking-widest text-gray-400">Newsletter</h4>
            <p className="text-xs text-muted-foreground font-medium">Get the best deals delivered to your inbox.</p>
            <div className="flex gap-2">
              <Input placeholder="Email address" className="rounded-xl bg-apple-gray dark:bg-zinc-900 border-none h-11" />
              <Button className="rounded-xl h-11 px-4 bg-black dark:bg-white text-white dark:text-black">Join</Button>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 mt-16 pt-8 border-t border-gray-100 dark:border-white/10 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-xs text-gray-400 font-medium">© 2026 Aura Marketplace. All rights reserved.</p>
          <div className="flex gap-8 text-xs font-bold uppercase tracking-widest text-gray-400">
            <a href="#" className="hover:text-black dark:hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-black dark:hover:text-white transition-colors">Terms</a>
          </div>
        </div>
      </footer>

      <CartSheet 
        items={cartItems} 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)}
        onRemove={removeFromCart}
        onCheckout={() => {
          setIsCartOpen(false);
          setActiveView('dashboard');
        }}
      />
    </div>
  );
}
