import { DigitalProduct } from '@/src/data/products';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { motion, AnimatePresence } from 'motion/react';
import { Trash2, AlertCircle, ShieldCheck, CreditCard, Wallet } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface CartSheetProps {
  items: DigitalProduct[];
  isOpen: boolean;
  onClose: () => void;
  onRemove: (id: string) => void;
  onCheckout: () => void;
}

export function CartSheet({ items, isOpen, onClose, onRemove, onCheckout }: CartSheetProps) {
  const subtotal = items.reduce((acc, item) => acc + item.price, 0);
  const discount = items.reduce((acc, item) => acc + (item.originalPrice - item.price), 0);
  const total = subtotal;

  const hasRegionWarning = items.some(item => item.region !== 'Global');

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="w-full sm:max-w-md p-0 flex flex-col border-none glass dark:bg-zinc-900/90">
        <SheetHeader className="p-6 border-b bg-white/50 dark:bg-zinc-900/50 backdrop-blur-xl border-gray-100 dark:border-white/10">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-2xl font-display font-bold dark:text-white">Your Bag</SheetTitle>
            <Badge variant="secondary" className="rounded-full px-3 dark:bg-zinc-800 dark:text-gray-300">
              {items.length} {items.length === 1 ? 'item' : 'items'}
            </Badge>
          </div>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          <AnimatePresence mode="popLayout">
            {items.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-full flex flex-col items-center justify-center space-y-4 text-center py-20"
              >
                <div className="w-20 h-20 bg-apple-gray dark:bg-zinc-800 rounded-full flex items-center justify-center">
                  <ShoppingBag className="w-10 h-10 text-gray-400" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-xl font-display font-bold dark:text-white">Your bag is empty</h3>
                  <p className="text-muted-foreground text-sm">Looks like you haven't added anything yet.</p>
                </div>
                <Button variant="outline" className="rounded-full px-8 dark:border-zinc-800" onClick={onClose}>
                  Start Shopping
                </Button>
              </motion.div>
            ) : (
              <div className="space-y-6">
                {items.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="flex gap-4 group"
                  >
                    <div className="w-20 h-20 rounded-2xl overflow-hidden shrink-0 apple-shadow">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex justify-between items-start">
                        <h4 className="font-bold text-sm line-clamp-2 leading-tight dark:text-white">{item.name}</h4>
                        <button 
                          onClick={() => onRemove(item.id)}
                          className="p-1 text-gray-300 hover:text-destructive transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-[10px] h-5 rounded-md border-gray-200 dark:border-zinc-800 dark:text-gray-400">
                          {item.platform}
                        </Badge>
                        <Badge variant="outline" className={`text-[10px] h-5 rounded-md ${item.region === 'Global' ? 'border-green-100 text-green-600 dark:border-green-900/30 dark:text-green-400' : 'border-amber-100 text-amber-600 dark:border-amber-900/30 dark:text-amber-400'}`}>
                          {item.region}
                        </Badge>
                      </div>
                      <p className="font-display font-bold text-base dark:text-white">${item.price.toFixed(2)}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </AnimatePresence>
        </div>

        {items.length > 0 && (
          <div className="p-6 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-xl border-t border-gray-100 dark:border-white/10 space-y-6">
            {hasRegionWarning && (
              <div className="flex gap-3 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-2xl border border-amber-100 dark:border-amber-900/30">
                <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
                <p className="text-xs text-amber-800 dark:text-amber-200 leading-relaxed">
                  Some items in your bag are region-locked. Please ensure they are compatible with your account location before purchasing.
                </p>
              </div>
            )}

            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium dark:text-white">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Discounts</span>
                <span className="text-apple-green font-medium">-${discount.toFixed(2)}</span>
              </div>
              <Separator className="opacity-50 dark:opacity-20" />
              <div className="flex justify-between items-end">
                <span className="text-lg font-display font-bold dark:text-white">Total</span>
                <span className="text-3xl font-display font-bold tracking-tight dark:text-white">${total.toFixed(2)}</span>
              </div>
            </div>

            <div className="space-y-3">
              <Button 
                className="w-full h-14 rounded-2xl text-lg font-bold bg-black dark:bg-white hover:bg-black/90 dark:hover:bg-white/90 text-white dark:text-black flex items-center justify-center gap-3 shadow-2xl shadow-black/20 dark:shadow-white/5"
                onClick={onCheckout}
              >
                <div className="w-7 h-7 bg-white dark:bg-black rounded-md flex items-center justify-center">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg" className="w-4 h-4 dark:invert" alt="Apple" />
                </div>
                Pay with Apple Pay
              </Button>
              <div className="flex items-center justify-center gap-2 text-[10px] text-muted-foreground uppercase tracking-widest font-bold">
                <ShieldCheck className="w-3 h-3" />
                <span>Secure Checkout & Instant Delivery</span>
              </div>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}

import { ShoppingBag } from 'lucide-react';
