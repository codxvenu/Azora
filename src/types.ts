export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  walletBalance: number;
  role: 'user' | 'admin';
  twoFactorEnabled: boolean;
  createdAt: string;
}

export interface GiftCard {
  id: string;
  brand: string;
  category: string;
  realPrice: number;
  discount: number;
  finalPrice: number;
  description: string;
  image: string;
  inventoryCount: number;
}

export interface Order {
  id: string;
  userId: string;
  giftCardId: string;
  amount: number;
  status: 'completed' | 'refunded';
  timestamp: string;
  deliveryEmail: string;
  codes: string[];
  productName?: string;
  productImage?: string;
}

export interface Submission {
  id: string;
  userId: string;
  fileName: string;
  fileSize: number;
  status: 'pending' | 'checked' | 'accepted';
  validPercentage?: number;
  estimatedValue?: number;
  timestamp: string;
  codes: string;
}

export interface Withdrawal {
  id: string;
  userId: string;
  amount: number;
  method: 'bank' | 'crypto';
  details: string;
  status: 'pending' | 'approved' | 'rejected';
  timestamp: string;
}

export interface Transaction {
  id: string;
  userId: string;
  amount: number;
  type: 'deposit' | 'withdrawal' | 'purchase' | 'sale';
  status: string;
  timestamp: string;
}
