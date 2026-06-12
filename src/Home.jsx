import React, { useContext, useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react';
import HeroBanner from './components/Home/HeroBanner';
import EditorialBanner from './components/Home/EditorialBanner';
import { promoCards } from '@/Utility/Constants';
import Category from './components/Home/Category';
import { GiftCardItem } from './components/GiftCardItem';
import { FeaturedDealsShowcase } from './components/FeaturedDealsShowcase';
import { EditorialHowItWorks } from './components/EditorialHowItWorks';
import { Theme } from '@/Utility/ThemeContext';
import useApi from './lib/useFetch';
import { useNavigate } from 'react-router-dom';
const Home = ()=> {
  const api = useApi()
  const navigation = useNavigate();

  useEffect(()=>{
    const GetItems = async() =>{
      const data = await api.product.list();
      setItems(data?.products ?? []);
    }
    GetItems();
  },[])
  useEffect(() => {
  if (location.hash) {
    const el = document.querySelector(location.hash);
    el?.scrollIntoView({ behavior: 'smooth' });
  }
}, [location]);
  const [items,setItems] = useState([])
  return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <AnimatePresence mode="wait">
          {true && (
            <motion.div 
              // key={activeDetailCategory ? `category-${activeDetailCategory}` : "browse"}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-12"
            >
              {/* {true ? (
                <CategoryDetailView
                  categoryName={activeDetailCategory}
                  items={items}
                  
                  onBack={() => {
                    setActiveDetailCategory(null);
                    window.scrollTo({ top: 0, behavior: 'instant' });
                  }}
                  onSelectCard={(card) => setSelectedCard(card)}
                />
              ) : ( */}
                <>
                  {/* Hero */}

                 <HeroBanner/>
                  {/* Marketplace */}
                  <div id="marketplace" className="space-y-16">
                    {/* Marketplace Anchor */}
                    <div id="marketplace-grid-anchor" className="scroll-mt-24" />

                    {/* Swapped Section 1: Trending Products Section (Shown first) */}
                    <div id='trending' className="space-y-8 text-left">
                      <div>
                        <h2 className="text-3xl font-display font-medium tracking-tight">Trending Products</h2>
                        <p className={`text-xs text-stone-500 mt-1 dark:text-zinc-400`}>Highly requested digital software and activation kits updated live.</p>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                        {items?.slice(0, 4).map(card => (
                          <GiftCardItem key={card.id} card={card}  onClick={() => setSelectedCard(card)} />
                        ))}
                      </div>
                    </div>

                    {/* Editorial Banner 1 */}
                    
                      <EditorialBanner badge={promoCards[0].badge} title={promoCards[0].title} description={promoCards[0].description} buttonText={promoCards[0].buttonText} watermark={promoCards[0].watermark} darkBg={promoCards[0].darkBg} />
                  
                   
                     
                   

                    {/* Swapped Section 2: Choose Category Section (Replaced Browse All Deals) */}
                   <Category  giftCards={items}/>

                    {/* Steam-Style Featured Deals Showcase */}
                    {/* <FeaturedDealsShowcase
                      products={items} 
                      onSelectProduct={(product) => setSelectedCard(product)} 
                       
                    /> */}
                    
 <EditorialBanner badge={promoCards[1].badge} title={promoCards[1].title} description={promoCards[1].description} buttonText={promoCards[1].buttonText} watermark={promoCards[1].watermark} darkBg={promoCards[1].darkBg} />
                  
                    {/* How it Works */}
                    <EditorialHowItWorks  />
                  </div>
                </>
              {/* )} */}
            </motion.div>
          )}

          {/* {currentView === 'browse' && selectedCard && (
            <ProductDetailView 
              card={selectedCard} 
              
              onClose={() => setSelectedCard(null)} 
              onBuy={(amount) => {
                handleBuy(selectedCard, amount);
                setSelectedCard(null);
              }}
              onAddToCart={(card, qty) => {
                handleAddToCart(card, qty);
                setSelectedCard(null);
              }}
              allCards={items}
              onSelectCard={(c) => setSelectedCard(c)}
            />
          )}

          {currentView === 'checkout' && (
            <div className="w-full">
              <CheckoutView
                items={cartItems}
                
                walletBalance={profile?.walletBalance || 0}
                onBack={() => setCurrentView('browse')}
                onRemoveItem={(id) => {
                  const cleaned = cartitems?.filter(item => item.card.id !== id);
                  setCartItems(cleaned);
                  if (cleaned.length === 0) {
                    setCurrentView('browse');
                  }
                }}
                onUpdateQuantity={(id, qty) => setCartItems(prev => prev.map(item => item.card.id === id ? { ...item, quantity: qty } : item))}
                onSuccess={handleCheckoutSuccess}
              />
            </div>
          )} */}

          {/* {currentView === 'sell' && 
          <SellView onBack={() => { setSelectedCard(null); setCurrentView('browse'); }}  />}
          {currentView === 'wallet' &&
           <WalletView profile={profile} onBack={() => { setSelectedCard(null); setCurrentView('browse'); }} onDeposit={() => setIsDepositModalOpen(true)}  />}
          {currentView === 'orders' && <OrdersView onBack={() => { setSelectedCard(null); setCurrentView('browse'); }}  />}
          {currentView === 'admin' && <AdminPanel onBack={() => { setSelectedCard(null); setCurrentView('browse'); }} />}
          {currentView === 'profile' && <ProfileView profile={profile} onBack={() => { setSelectedCard(null); setCurrentView('browse'); }} />}
          {currentView === 'login' && <AuthView initialMode="login" onSuccess={() => setCurrentView('browse')} onBack={() => setCurrentView('browse')}  />}
          {currentView === 'register' && <AuthView initialMode="register" onSuccess={() => setCurrentView('browse')} onBack={() => setCurrentView('browse')}  />}
          {currentView === 'forgot' && <AuthView initialMode="forgot" onSuccess={() => setCurrentView('browse')} onBack={() => setCurrentView('browse')}  />} */}
        </AnimatePresence>

        {/* Deposit Modal */}
        {/* <AnimatePresence>
          {isDepositModalOpen && (
            <DepositModal 
              
              onClose={() => setIsDepositModalOpen(false)}
              onSuccess={(amount, method) => {
                handleDepositSuccess(amount, method);
                setIsDepositModalOpen(false);
              }}
            />
          )}
        </AnimatePresence> */}
      </main>

  )
}

export default Home
