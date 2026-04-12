import { DigitalProduct } from '@/src/data/products';
import { motion } from 'motion/react';
import { Badge } from '@/components/ui/badge';
import { Star, Globe, Monitor } from 'lucide-react';

interface ProductCardProps {
  product: DigitalProduct;
  onClick: (product: DigitalProduct) => void;
  key?: string | number;
}

export function ProductCard({ product, onClick }: ProductCardProps) {
  const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);

  return (
    <motion.div
      layoutId={`product-${product.id}`}
      onClick={() => onClick(product)}
      className="group cursor-pointer bg-white dark:bg-zinc-900 rounded-2xl md:rounded-3xl overflow-hidden apple-shadow smooth-transition hover:apple-shadow-lg hover:-translate-y-1 flex md:flex-col"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="relative w-1/3 md:w-full aspect-square md:aspect-[16/10] overflow-hidden shrink-0">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover smooth-transition group-hover:scale-105"
          referrerPolicy="no-referrer"
        />
        <div className="absolute top-2 left-2 md:top-3 md:left-3 flex flex-col gap-1 md:gap-2">
          <Badge className="bg-black/60 backdrop-blur-md text-white border-none px-1.5 py-0 md:px-2 md:py-0.5 text-[8px] md:text-[10px] uppercase tracking-wider">
            {product.platform}
          </Badge>
          {discount > 0 && (
            <Badge className="bg-apple-green text-white border-none px-1.5 py-0 md:px-2 md:py-0.5 text-[8px] md:text-[10px] font-bold">
              -{discount}%
            </Badge>
          )}
        </div>
      </div>
      
      <div className="p-3 md:p-5 flex flex-col justify-between flex-1 min-w-0">
        <div className="space-y-1">
          <div className="flex items-center gap-1 md:gap-2 text-[8px] md:text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
            <span className="truncate">{product.brand}</span>
            <span className="w-1 h-1 bg-gray-300 rounded-full shrink-0" />
            <div className="flex items-center gap-1 shrink-0">
              <Globe className="w-2.5 h-2.5 md:w-3 md:h-3" />
              <span>{product.region}</span>
            </div>
          </div>
          <h3 className="font-display font-bold text-sm md:text-base leading-tight line-clamp-2 md:min-h-[2.5rem] dark:text-white">
            {product.name}
          </h3>
        </div>

        <div className="flex items-end justify-between mt-2 md:mt-0">
          <div className="flex flex-col">
            {discount > 0 && (
              <span className="text-[10px] md:text-xs text-muted-foreground line-through decoration-gray-400">
                ${product.originalPrice.toFixed(2)}
              </span>
            )}
            <span className="text-base md:text-xl font-display font-bold tracking-tight dark:text-white">
              ${product.price.toFixed(2)}
            </span>
          </div>
          <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-apple-gray dark:bg-zinc-800 flex items-center justify-center smooth-transition group-hover:bg-black group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-black">
            <PlusCircle className="w-4 h-4 md:w-5 md:h-5" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

import { PlusCircle } from 'lucide-react';
