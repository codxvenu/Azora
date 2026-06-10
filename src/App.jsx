import React, {  useContext } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { NotificationProvider, useNotification } from './lib/useNotification';
import { ErrorBoundary } from './components/ErrorBoundary';
import { EditorialHowItWorks } from './components/EditorialHowItWorks';
import { FeaturedDealsShowcase } from './components/FeaturedDealsShowcase';

// Import newly modularized components
import { GiftCardItem } from './components/GiftCardItem';
import Navbar from './components/Navbar';
import AuthContext, { Auth } from '@/Utility/AuthContext.jsx';
import ThemeContext from '@/Utility/ThemeContext.jsx';

import Footer from './components/Footer';
import { Outlet } from 'react-router-dom';

const giftCards= [
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

 const { user } = useContext(Auth);

  // if (loading) {
  //   return (
  //     <div className="min-h-screen flex items-center justify-center bg-white">
  //       <motion.div 
  //         animate={{ scale: [1, 1.1, 1] }} 
  //         transition={{ repeat: Infinity, duration: 2 }}
  //         className="text-4xl font-display font-bold tracking-tighter"
  //       >
  //         AURA
  //       </motion.div>
  //     </div>
  //   );
  // }

  return (
    <div className="min-h-screen font-sans selection:bg-black selection:text-white transition-colors duration-500 bg-[#FAF9F6] text-zinc-900 dark:bg-[#0a0a0c] dark:text-zinc-100">
      {/* Navbar */}
     
    <Navbar user={user}/>
      {/* Mobile Menu
      <AnimatePresence>
        {true && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden fixed inset-0 z-40 bg-white pt-20 px-6"
          >
            <div className="flex flex-col gap-6 text-2xl font-display font-bold">
              <button
               
               >Browse</button>
              <button 
              
              >Sell</button>
              {true && <button 
              >Orders</button>}
              {true && <button >Admin</button>}
              {true && <button >Wallet ($0)</button>}
              {true ? (
                <button  className="text-red-600">Logout</button>
              ) : (
                <button >Sign In</button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence> */}
 <Outlet />
      {/* Main Content */}
      {/* Footer */}
     <Footer />
    </div>
  );

  // async function handleDepositSuccess(amount: number, method: string) {
  //   if (!user) return;
  //   try {
  //     await addDoc(collection(db, 'transactions'), {
  //       userId: user.uid,
  //       userEmail: user.email || 'Anonymous',
  //       amount: amount,
  //       type: 'deposit',
  //       method: method || 'Card',
  //       status: 'pending',
  //       timestamp: new Date().toISOString()
  //     });
  //     showNotification(`Deposit request of $${amount.toFixed(2)} submitted for review. Pending authorization.`, 'success');
  //   } catch (err) {
  //     handleFirestoreError(err, OperationType.WRITE, 'transactions');
  //   }
  // }

  // async function handleBuy(card: GiftCard, customAmount?: number) {
  //   if (!user || !profile) {
  //     login();
  //     return;
  //   }

  //   const priceToPay = customAmount !== undefined ? customAmount : card.finalPrice;

  //   if (profile.walletBalance < priceToPay) {
  //     showNotification('Insufficient balance. Please deposit funds to your wallet.', 'error');
  //     setCurrentView('wallet');
  //     return;
  //   }

  //   if (card.inventoryCount <= 0) {
  //     showNotification('This product is currently out of stock.', 'error');
  //     return;
  //   }

  //   try {
  //     // Pull real code if available in stock list
  //     let allocatedCode = 'AURA-' + Math.random().toString(36).substring(2, 10).toUpperCase();
  //     let updatedCodes = [...(card.codes || [])];
  //     let updatedCount = card.inventoryCount;

  //     if (updatedCodes.length > 0) {
  //       allocatedCode = updatedCodes.shift()!;
  //       updatedCount = updatedCodes.length;

  //       await updateDoc(doc(db, 'giftCards', card.id), {
  //         codes: updatedCodes,
  //         inventoryCount: updatedCount
  //       });
  //     } else {
  //       if (updatedCount > 0) {
  //         await updateDoc(doc(db, 'giftCards', card.id), {
  //           inventoryCount: increment(-1)
  //         });
  //       }
  //     }

  //     // 1. Create Order
  //     const orderData: Omit<Order, 'id'> = {
  //       userId: user.uid,
  //       giftCardId: card.id,
  //       amount: priceToPay,
  //       status: 'completed',
  //       timestamp: new Date().toISOString(),
  //       deliveryEmail: user.email || '',
  //       codes: [allocatedCode],
  //       productName: customAmount !== undefined ? `${card.brand} (Voucher Balance)` : card.brand,
  //       productImage: card.image
  //     };
      
  //     await addDoc(collection(db, 'orders'), orderData);

  //     // 2. Update Wallet
  //     const userRef = doc(db, 'users', user.uid);
  //     await updateDoc(userRef, {
  //       walletBalance: increment(-priceToPay)
  //     });

  //     // 3. Record Transaction
  //     const transactionData: Omit<Transaction, 'id'> = {
  //       userId: user.uid,
  //       amount: priceToPay,
  //       type: 'purchase',
  //       status: 'completed',
  //       timestamp: new Date().toISOString()
  //     };
  //     await addDoc(collection(db, 'transactions'), transactionData);

  //     showNotification('Purchase successful! Your digital key/code is available in your orders.', 'success');
  //     setCurrentView('orders');
  //   } catch (err) {
  //     handleFirestoreError(err, OperationType.WRITE, 'orders');
  //   }
  // }
};





const App = () => (
  
        <AppContent />
      
);

export default App;
