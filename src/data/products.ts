export interface Seller {
  id: string;
  name: string;
  rating: number;
  totalSales: number;
  isVerified: boolean;
}

export interface PricePoint {
  date: string;
  price: number;
}

export interface DigitalProduct {
  id: string;
  name: string;
  brand: string;
  category: 'Games' | 'Software' | 'Subscriptions';
  platform: 'Steam' | 'Epic' | 'Origin' | 'Xbox' | 'PlayStation' | 'PC' | 'Mac';
  region: 'Global' | 'US' | 'EU' | 'Asia';
  price: number;
  originalPrice: number;
  image: string;
  description: string;
  seller: Seller;
  priceHistory: PricePoint[];
  tags: string[];
}

export const products: DigitalProduct[] = [
  {
    id: 'elden-ring',
    name: 'Elden Ring: Shadow of the Erdtree',
    brand: 'Bandai Namco',
    category: 'Games',
    platform: 'Steam',
    region: 'Global',
    price: 34.99,
    originalPrice: 39.99,
    image: 'https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?q=80&w=800&auto=format&fit=crop',
    description: 'The highly anticipated expansion for the Game of the Year, Elden Ring.',
    seller: { id: 's1', name: 'EliteKeys', rating: 4.9, totalSales: 150000, isVerified: true },
    priceHistory: [
      { date: 'Jan', price: 39.99 },
      { date: 'Feb', price: 37.99 },
      { date: 'Mar', price: 34.99 },
    ],
    tags: ['RPG', 'Open World', 'Souls-like']
  },
  {
    id: 'adobe-creative-cloud',
    name: 'Adobe Creative Cloud 1 Year',
    brand: 'Adobe',
    category: 'Software',
    platform: 'PC',
    region: 'Global',
    price: 299.99,
    originalPrice: 599.99,
    image: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?q=80&w=800&auto=format&fit=crop',
    description: 'Full access to 20+ creative apps including Photoshop, Illustrator, and Premiere Pro.',
    seller: { id: 's2', name: 'SoftStore', rating: 4.8, totalSales: 85000, isVerified: true },
    priceHistory: [
      { date: 'Jan', price: 599.99 },
      { date: 'Feb', price: 450.00 },
      { date: 'Mar', price: 299.99 },
    ],
    tags: ['Design', 'Video', 'Photography']
  },
  {
    id: 'xbox-game-pass',
    name: 'Xbox Game Pass Ultimate - 3 Months',
    brand: 'Microsoft',
    category: 'Subscriptions',
    platform: 'Xbox',
    region: 'US',
    price: 24.99,
    originalPrice: 44.99,
    image: 'https://images.unsplash.com/photo-1605902711622-cfb43c443ffb?q=80&w=800&auto=format&fit=crop',
    description: 'Includes Xbox Live Gold and over 100 high-quality games.',
    seller: { id: 's3', name: 'GamePassDirect', rating: 4.7, totalSales: 200000, isVerified: true },
    priceHistory: [
      { date: 'Jan', price: 44.99 },
      { date: 'Feb', price: 34.99 },
      { date: 'Mar', price: 24.99 },
    ],
    tags: ['Gaming', 'Subscription', 'Xbox']
  },
  {
    id: 'cyberpunk-2077',
    name: 'Cyberpunk 2077: Phantom Liberty',
    brand: 'CD Projekt Red',
    category: 'Games',
    platform: 'Steam',
    region: 'Global',
    price: 25.50,
    originalPrice: 29.99,
    image: 'https://images.unsplash.com/photo-1605898960710-9975f992323c?q=80&w=800&auto=format&fit=crop',
    description: 'A spy-thriller expansion for Cyberpunk 2077.',
    seller: { id: 's1', name: 'EliteKeys', rating: 4.9, totalSales: 150000, isVerified: true },
    priceHistory: [
      { date: 'Jan', price: 29.99 },
      { date: 'Feb', price: 28.00 },
      { date: 'Mar', price: 25.50 },
    ],
    tags: ['RPG', 'Sci-fi', 'Action']
  },
  {
    id: 'office-365',
    name: 'Microsoft Office 365 Personal',
    brand: 'Microsoft',
    category: 'Software',
    platform: 'PC',
    region: 'Global',
    price: 45.00,
    originalPrice: 69.99,
    image: 'https://images.unsplash.com/photo-1633113088983-12fb3b2fe4ac?q=80&w=800&auto=format&fit=crop',
    description: 'Premium Office apps, 1 TB of cloud storage, and advanced security.',
    seller: { id: 's4', name: 'OfficeHub', rating: 4.6, totalSales: 50000, isVerified: false },
    priceHistory: [
      { date: 'Jan', price: 69.99 },
      { date: 'Feb', price: 55.00 },
      { date: 'Mar', price: 45.00 },
    ],
    tags: ['Productivity', 'Cloud', 'Office']
  }
];
