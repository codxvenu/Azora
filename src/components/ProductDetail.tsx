import { DigitalProduct } from '@/src/data/products';
import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Star, Globe, Monitor, ShieldCheck, Zap, 
  History, TrendingDown, ArrowLeft, ShoppingBag,
  CheckCircle2, Info
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ProductDetailProps {
  product: DigitalProduct;
  onBack: () => void;
  onAddToCart: (product: DigitalProduct) => void;
}

export function ProductDetail({ product, onBack, onAddToCart }: ProductDetailProps) {
  const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-10 pb-20"
    >
      <Button 
        variant="ghost" 
        className="rounded-full gap-2 -ml-4 hover:bg-white/50 dark:hover:bg-zinc-800 dark:text-white"
        onClick={onBack}
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Marketplace
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left: Visuals */}
        <div className="lg:col-span-7 space-y-8">
          <div className="relative aspect-video rounded-[2.5rem] overflow-hidden apple-shadow-lg">
            <img 
              src={product.image} 
              alt={product.name} 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            <div className="absolute bottom-8 left-8 flex gap-3">
              <Badge className="bg-white/20 backdrop-blur-md text-white border-none px-4 py-1.5 text-xs uppercase tracking-wider">
                {product.platform}
              </Badge>
              <Badge className="bg-white/20 backdrop-blur-md text-white border-none px-4 py-1.5 text-xs uppercase tracking-wider">
                {product.region}
              </Badge>
            </div>
          </div>

          <div className="hidden md:block bg-white dark:bg-zinc-900 rounded-[2rem] p-8 apple-shadow space-y-6">
            <div className="flex items-center gap-3">
              <History className="w-5 h-5 text-apple-blue" />
              <h3 className="text-xl font-display font-bold dark:text-white">Price History</h3>
            </div>
            <div className="h-[240px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={product.priceHistory}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="date" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 12, fill: '#999' }}
                    dy={10}
                  />
                  <YAxis 
                    hide 
                    domain={['dataMin - 5', 'dataMax + 5']} 
                  />
                  <Tooltip 
                    contentStyle={{ 
                      borderRadius: '16px', 
                      border: 'none', 
                      boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                      fontFamily: 'Inter',
                      backgroundColor: '#18181b',
                      color: '#fff'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="price" 
                    stroke="#0071e3" 
                    strokeWidth={4} 
                    dot={{ r: 6, fill: '#0071e3', strokeWidth: 0 }}
                    activeDot={{ r: 8, strokeWidth: 0 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center gap-2 text-sm text-apple-green font-semibold bg-apple-green/5 p-4 rounded-2xl">
              <TrendingDown className="w-4 h-4" />
              <span>Current price is at its lowest in 3 months</span>
            </div>
          </div>
        </div>

        {/* Right: Info & Purchase */}
        <div className="lg:col-span-5 space-y-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-widest">
              <span>{product.brand}</span>
              <span className="w-1 h-1 bg-gray-300 rounded-full" />
              <span>{product.category}</span>
            </div>
            <h1 className="text-4xl font-display font-bold leading-tight tracking-tight dark:text-white">
              {product.name}
            </h1>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className={`w-4 h-4 ${s <= Math.floor(product.seller.rating) ? 'text-yellow-500 fill-yellow-500' : 'text-gray-200'}`} />
                ))}
                <span className="ml-2 text-sm font-bold dark:text-white">{product.seller.rating}</span>
              </div>
              <span className="text-xs text-muted-foreground font-medium">({product.seller.totalSales.toLocaleString()} sales)</span>
            </div>
          </div>

          <div className="bg-white dark:bg-zinc-900 rounded-[2.5rem] p-8 apple-shadow space-y-8">
            <div className="flex items-end justify-between">
              <div className="space-y-1">
                <span className="text-sm text-muted-foreground font-medium">Best Price</span>
                <div className="flex items-center gap-3">
                  <span className="text-4xl font-display font-bold tracking-tight dark:text-white">${product.price.toFixed(2)}</span>
                  {discount > 0 && (
                    <Badge className="bg-apple-green text-white border-none px-3 py-1 rounded-full text-xs font-bold">
                      -{discount}%
                    </Badge>
                  )}
                </div>
                {discount > 0 && (
                  <p className="text-xs text-muted-foreground line-through decoration-gray-400">
                    Was ${product.originalPrice.toFixed(2)}
                  </p>
                )}
              </div>
              <div className="text-right space-y-1">
                <div className="flex items-center justify-end gap-1 text-apple-green">
                  <ShieldCheck className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-wider">In Stock</span>
                </div>
                <p className="text-[10px] text-muted-foreground font-medium">Instant Digital Delivery</p>
              </div>
            </div>

            <div className="space-y-4">
              <Button 
                className="w-full h-16 rounded-2xl text-xl font-bold bg-apple-blue hover:bg-apple-blue/90 text-white shadow-xl shadow-apple-blue/20 gap-3"
                onClick={() => onAddToCart(product)}
              >
                <ShoppingBag className="w-6 h-6" />
                Add to Bag
              </Button>
              <Button variant="outline" className="w-full h-14 rounded-2xl font-bold border-gray-200 dark:border-zinc-800 dark:text-white">
                Buy as a Gift
              </Button>
            </div>

            <Separator className="opacity-50 dark:opacity-20" />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-apple-gray dark:bg-zinc-800 rounded-full flex items-center justify-center font-bold text-sm dark:text-white">
                    {product.seller.name[0]}
                  </div>
                  <div>
                    <p className="text-sm font-bold flex items-center gap-1 dark:text-white">
                      {product.seller.name}
                      {product.seller.isVerified && <CheckCircle2 className="w-3 h-3 text-apple-blue" />}
                    </p>
                    <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Top Rated Seller</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="text-apple-blue font-bold text-xs">View Profile</Button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-5 rounded-3xl bg-white dark:bg-zinc-900 apple-shadow border border-gray-50 dark:border-zinc-800 space-y-2">
              <Zap className="w-5 h-5 text-yellow-500" />
              <p className="text-xs font-bold uppercase tracking-wider dark:text-white">Instant</p>
              <p className="text-[10px] text-muted-foreground leading-relaxed">Key delivered to your dashboard immediately after payment.</p>
            </div>
            <div className="p-5 rounded-3xl bg-white dark:bg-zinc-900 apple-shadow border border-gray-50 dark:border-zinc-800 space-y-2">
              <ShieldCheck className="w-5 h-5 text-apple-green" />
              <p className="text-xs font-bold uppercase tracking-wider dark:text-white">Protected</p>
              <p className="text-[10px] text-muted-foreground leading-relaxed">100% Money-back guarantee if the key doesn't work.</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

import { Separator } from '@/components/ui/separator';
