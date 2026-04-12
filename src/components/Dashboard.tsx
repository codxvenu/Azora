import { motion } from 'motion/react';
import { 
  Key, ShoppingBag, RotateCcw, User, 
  ChevronRight, Copy, Check, ExternalLink,
  ShieldCheck, Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { products } from '@/src/data/products';
import { useState } from 'react';

export function Dashboard() {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const mockOrders = [
    {
      id: 'ORD-88291',
      product: products[0],
      date: 'Apr 10, 2026',
      key: 'AAAA-BBBB-CCCC-DDDD',
      status: 'Delivered'
    },
    {
      id: 'ORD-77210',
      product: products[2],
      date: 'Mar 15, 2026',
      key: '1234-5678-9012-3456',
      status: 'Delivered'
    }
  ];

  const handleCopy = (key: string, id: string) => {
    navigator.clipboard.writeText(key);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-12 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-display font-bold tracking-tight dark:text-white">Your Dashboard</h1>
          <p className="text-muted-foreground font-medium">Manage your digital library and order history.</p>
        </div>
        <div className="flex gap-3">
          <div className="bg-white dark:bg-zinc-900 px-6 py-3 rounded-2xl apple-shadow border border-gray-100 dark:border-zinc-800 text-center">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Wallet</p>
            <p className="text-xl font-display font-bold dark:text-white">$42.50</p>
          </div>
          <div className="bg-white dark:bg-zinc-900 px-6 py-3 rounded-2xl apple-shadow border border-gray-100 dark:border-zinc-800 text-center">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Aura Points</p>
            <p className="text-xl font-display font-bold dark:text-white">1,250</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left: Navigation */}
        <div className="lg:col-span-3 space-y-2">
          {[
            { icon: Key, label: 'My Keys', active: true },
            { icon: ShoppingBag, label: 'Order History', active: false },
            { icon: RotateCcw, label: 'Refunds', active: false },
            { icon: User, label: 'Profile Settings', active: false },
          ].map((item) => (
            <button
              key={item.label}
              className={`w-full flex items-center justify-between p-4 rounded-2xl smooth-transition ${
                item.active 
                  ? 'bg-black dark:bg-white text-white dark:text-black shadow-xl shadow-black/10' 
                  : 'hover:bg-white dark:hover:bg-zinc-900 hover:apple-shadow text-gray-500 hover:text-black dark:hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <item.icon className="w-5 h-5" />
                <span className="font-bold text-sm">{item.label}</span>
              </div>
              <ChevronRight className={`w-4 h-4 ${item.active ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`} />
            </button>
          ))}
        </div>

        {/* Right: Content */}
        <div className="lg:col-span-9 space-y-8">
          <div className="bg-white dark:bg-zinc-900 rounded-[2.5rem] p-8 apple-shadow space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-display font-bold dark:text-white">Recent Keys</h2>
              <Button variant="ghost" className="text-apple-blue font-bold text-sm">View All</Button>
            </div>

            <div className="space-y-6">
              {mockOrders.map((order) => (
                <div key={order.id} className="group space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-6">
                    <div className="w-24 h-16 rounded-xl overflow-hidden shrink-0 apple-shadow">
                      <img src={order.product.image} alt={order.product.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-[10px] h-5 rounded-md border-gray-200 dark:border-zinc-800">
                          {order.product.platform}
                        </Badge>
                        <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">{order.date}</span>
                      </div>
                      <h3 className="font-bold text-base truncate dark:text-white">{order.product.name}</h3>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="bg-apple-gray dark:bg-zinc-800 px-4 py-3 rounded-xl flex items-center gap-4 border border-gray-100 dark:border-zinc-700">
                        <code className="font-mono font-bold text-sm tracking-wider dark:text-white">{order.key}</code>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 hover:bg-white dark:hover:bg-zinc-700"
                          onClick={() => handleCopy(order.key, order.id)}
                        >
                          {copiedId === order.id ? <Check className="w-4 h-4 text-apple-green" /> : <Copy className="w-4 h-4 dark:text-gray-400" />}
                        </Button>
                      </div>
                      <Button variant="outline" size="icon" className="h-11 w-11 rounded-xl dark:border-zinc-800">
                        <ExternalLink className="w-4 h-4 dark:text-gray-400" />
                      </Button>
                    </div>
                  </div>
                  <Separator className="opacity-50 dark:opacity-20" />
                </div>
              ))}
            </div>

            <div className="flex items-center gap-3 p-4 bg-apple-blue/5 rounded-2xl border border-apple-blue/10">
              <ShieldCheck className="w-5 h-5 text-apple-blue shrink-0" />
              <p className="text-xs text-apple-blue font-medium leading-relaxed">
                Your keys are encrypted and stored securely. Always ensure you are on the official Aura domain before revealing your keys.
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-zinc-900 rounded-[2.5rem] p-8 apple-shadow space-y-6">
            <h2 className="text-2xl font-display font-bold dark:text-white">Security Status</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-4 p-4 rounded-2xl border border-gray-100 dark:border-zinc-800">
                <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-sm font-bold dark:text-white">Two-Factor Auth</p>
                  <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest">Enabled via Authenticator</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 rounded-2xl border border-gray-100 dark:border-zinc-800">
                <div className="w-10 h-10 bg-apple-gray dark:bg-zinc-800 rounded-full flex items-center justify-center">
                  <Clock className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </div>
                <div>
                  <p className="text-sm font-bold dark:text-white">Last Login</p>
                  <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest">Today, 08:42 AM from London, UK</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
