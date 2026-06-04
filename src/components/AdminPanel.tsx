import React, { useState, useEffect } from 'react';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { 
  collection, onSnapshot, doc, updateDoc, addDoc, deleteDoc, increment 
} from 'firebase/firestore';
import { Submission, GiftCard, UserProfile, Transaction } from '../types';
import { format } from 'date-fns';
import { 
  Users, Layers, Settings2, CreditCard, ChevronRight, CheckCircle, XCircle, 
  Trash2, Plus, Sparkles, RefreshCw, Search, Code, Key, ChevronDown, Check,
  AlertCircle, DollarSign, HelpCircle, Save, Shield, UserMinus, UserCheck, Inbox
} from 'lucide-react';
import { useNotification } from '../lib/useNotification';

interface AdminPanelProps {
  onBack: () => void;
  isDark?: boolean;
}

export const AdminPanel = ({ onBack, isDark }: AdminPanelProps) => {
  const { showNotification } = useNotification();
  
  // Tab control
  const [activeTab, setActiveTab] = useState<'users' | 'products' | 'deposits' | 'payments' | 'submissions'>('users');

  // Firestore DB states
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [giftCards, setGiftCards] = useState<GiftCard[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);

  // Search & Filters
  const [userQuery, setUserQuery] = useState('');
  const [productQuery, setProductQuery] = useState('');

  // Selected details for modal or sub-manager
  const [editingCardId, setEditingCardId] = useState<string | null>(null);
  const [bulkCodeInput, setBulkCodeInput] = useState('');
  const [genFormat, setGenFormat] = useState('XXXX-XXXX-XXXX-XXXX');
  const [genQuantity, setGenQuantity] = useState('10');
  const [genPrefix, setGenPrefix] = useState('');

  // New product card model
  const [newCard, setNewCard] = useState({
    brand: '',
    category: 'Gaming',
    realPrice: '',
    discount: '',
    description: '',
    image: ''
  });

  // Payment portal config settings
  const [paymentsConfig, setPaymentsConfig] = useState({
    razorpay_title: 'Razorpay / Card',
    razorpay_enabled: true,
    crypto_title: 'Crypto (USDT/BTC)',
    crypto_enabled: true,
    crypto_address: 'TTRxX9s7YhdDk9PqmzL28sLdkWqq893kS',
    stripe_title: 'Stripe / Global Card',
    stripe_enabled: true
  });

  // Live Listener Subscriptions
  useEffect(() => {
    const unsubUsers = onSnapshot(collection(db, 'users'), (snapshot) => {
      setUsers(snapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() } as UserProfile)));
    });

    const unsubCards = onSnapshot(collection(db, 'giftCards'), (snapshot) => {
      setGiftCards(snapshot.docs.map(doc => {
        const data = doc.data();
        return { 
          id: doc.id, 
          ...data,
          codes: data.codes || []
        } as GiftCard;
      }));
    });

    const unsubTransactions = onSnapshot(collection(db, 'transactions'), (snapshot) => {
      setTransactions(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as any)));
    });

    const unsubSubmissions = onSnapshot(collection(db, 'submissions'), (snapshot) => {
      setSubmissions(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Submission)));
    });

    // Load payments configuration
    const unsubPayments = onSnapshot(doc(db, 'settings', 'payments'), (snapshot) => {
      if (snapshot.exists()) {
        setPaymentsConfig(prev => ({
          ...prev,
          ...snapshot.data()
        }));
      }
    });

    return () => {
      unsubUsers();
      unsubCards();
      unsubTransactions();
      unsubSubmissions();
      unsubPayments();
    };
  }, []);

  // Set codes text area when editing a card changed
  useEffect(() => {
    if (editingCardId) {
      const card = giftCards.find(c => c.id === editingCardId);
      if (card) {
        setBulkCodeInput((card.codes || []).join('\n'));
      }
    } else {
      setBulkCodeInput('');
    }
  }, [editingCardId, giftCards]);

  // ==========================================
  // USERS MANAGEMENT ACTIONS
  // ==========================================
  const handleToggleRole = async (targetUser: UserProfile) => {
    const newRole = targetUser.role === 'admin' ? 'user' : 'admin';
    try {
      await updateDoc(doc(db, 'users', targetUser.uid), { role: newRole });
      showNotification(`Successfully updated ${targetUser.email} role to ${newRole.toUpperCase()}.`, 'success');
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `users/${targetUser.uid}`);
    }
  };

  const handleAdjustBalance = async (targetUser: UserProfile) => {
    const amountStr = prompt(`Adjust ${targetUser.displayName || targetUser.email}'s balance. Enter positive count to add, negative to deduct:`, '100');
    if (amountStr === null) return;
    const delta = parseFloat(amountStr);
    if (isNaN(delta)) {
      showNotification('Please enter a valid numeric value.', 'error');
      return;
    }

    try {
      await updateDoc(doc(db, 'users', targetUser.uid), {
        walletBalance: increment(delta)
      });
      // Register balance adjustment transaction
      await addDoc(collection(db, 'transactions'), {
        userId: targetUser.uid,
        userEmail: targetUser.email || '',
        amount: Math.abs(delta),
        type: 'deposit',
        method: 'Admin Correction',
        status: 'completed',
        timestamp: new Date().toISOString()
      });
      showNotification(`Balance adjusted successfully by $${delta.toFixed(2)}.`, 'success');
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `users/${targetUser.uid}`);
    }
  };

  // ==========================================
  // DEPOSITS (ACCEPT/DECLINE) QUEUE
  // ==========================================
  const handleApproveDeposit = async (tx: any) => {
    try {
      // 1. Increment User's wallet balance
      const targetUserRef = doc(db, 'users', tx.userId);
      await updateDoc(targetUserRef, {
        walletBalance: increment(tx.amount)
      });

      // 2. Set Transaction status to completed
      await updateDoc(doc(db, 'transactions', tx.id), {
        status: 'completed'
      });

      showNotification(`Approved deposit of $${tx.amount.toFixed(2)} for user: ${tx.userEmail || tx.userId.substring(0, 8)}`, 'success');
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `transactions/${tx.id}`);
    }
  };

  const handleDeclineDeposit = async (tx: any) => {
    try {
      await updateDoc(doc(db, 'transactions', tx.id), {
        status: 'declined'
      });
      showNotification(`Declined deposit request of $${tx.amount.toFixed(2)}.`, 'success');
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `transactions/${tx.id}`);
    }
  };

  // ==========================================
  // ITEMS LIST / CODES AUTO-GENERATOR
  // ==========================================
  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const { brand, category, realPrice, discount, description, image } = newCard;
    if (!brand || !realPrice) {
      showNotification('Please fill out at least Brand name and Real Price.', 'error');
      return;
    }

    const priceVal = parseFloat(realPrice);
    const discVal = parseFloat(discount || '0');
    const finalVal = priceVal * (1 - discVal / 100);

    const cardData = {
      brand,
      category,
      realPrice: priceVal,
      discount: discVal,
      finalPrice: finalVal,
      description: description || `Premium ${brand} verification licenses.`,
      image: image || `https://picsum.photos/seed/${encodeURIComponent(brand)}/400/300`,
      inventoryCount: 0,
      codes: []
    };

    try {
      await addDoc(collection(db, 'giftCards'), cardData);
      showNotification(`Product listing "${brand}" registered successfully.`, 'success');
      setNewCard({
        brand: '',
        category: 'Gaming',
        realPrice: '',
        discount: '',
        description: '',
        image: ''
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'giftCards');
    }
  };

  const handleDeleteProduct = async (cardId: string, brand: string) => {
    if (!confirm(`Are you absolutely sure you want to permanently delete "${brand}"?`)) return;
    try {
      await deleteDoc(doc(db, 'giftCards', cardId));
      showNotification(`Product "${brand}" deleted from global registry.`, 'success');
      if (editingCardId === cardId) setEditingCardId(null);
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `giftCards/${cardId}`);
    }
  };

  // Bulk / Auto-generation execution
  const executeCodeGenerator = () => {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const digits = '0123456789';
    const alpha = letters + digits;

    const count = parseInt(genQuantity || '10');
    if (isNaN(count) || count <= 0) {
      showNotification('Please enter a valid count of keys to generate.', 'error');
      return;
    }

    const generated: string[] = [];
    for (let c = 0; c < count; c++) {
      let code = '';
      if (genPrefix) {
        code += genPrefix.trim().toUpperCase() + '-';
      }

      // Parse pattern
      if (genFormat) {
        for (let i = 0; i < genFormat.length; i++) {
          const char = genFormat[i];
          if (char === 'X' || char === 'x') {
            code += alpha[Math.floor(Math.random() * alpha.length)];
          } else if (char === '#') {
            code += digits[Math.floor(Math.random() * digits.length)];
          } else {
            code += char;
          }
        }
      } else {
        code += Math.random().toString(36).substring(2, 10).toUpperCase();
      }
      generated.push(code.toUpperCase());
    }

    // Append to textarea list
    const currentList = bulkCodeInput.trim() ? bulkCodeInput.trim().split('\n') : [];
    const combined = [...currentList, ...generated];
    setBulkCodeInput(combined.join('\n'));
    showNotification(`Generated ${count} activation codes in preview pool!`, 'success');
  };

  const saveCodesToDatabase = async () => {
    if (!editingCardId) return;
    const codes = bulkCodeInput
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);

    try {
      await updateDoc(doc(db, 'giftCards', editingCardId), {
        codes: codes,
        inventoryCount: codes.length
      });
      showNotification(`Cryptographic key registry updated! Current stock: ${codes.length} keys`, 'success');
      setEditingCardId(null);
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `giftCards/${editingCardId}`);
    }
  };

  // ==========================================
  // PAYMENT SETTINGS WRITE
  // ==========================================
  const handleSavePayments = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateDoc(doc(db, 'settings', 'payments'), paymentsConfig);
      showNotification('Payment options configured globally.', 'success');
    } catch (err) {
      // If document settings/payments doesn't exist yet, we write it using addDoc/setDoc logic
      try {
        const { doc, setDoc } = await import('firebase/firestore');
        await setDoc(doc(db, 'settings', 'payments'), paymentsConfig);
        showNotification('Payment options bootstrapped and saved.', 'success');
      } catch (innerErr) {
        handleFirestoreError(innerErr, OperationType.WRITE, 'settings/payments');
      }
    }
  };

  // ==========================================
  // ORIGINAL SUBMISSION AUDIT
  // ==========================================
  const handleSubmissionReview = async (sub: Submission) => {
    const valid = prompt('Enter valid percentage (0-100):', '100');
    const value = prompt('Enter estimated value ($):', '50');
    if (valid === null || value === null) return;

    try {
      await updateDoc(doc(db, 'submissions', sub.id), {
        status: 'checked',
        validPercentage: Number(valid),
        estimatedValue: Number(value)
      });
      showNotification('Seller stock submission reviewed and updated.', 'success');
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, 'submissions');
    }
  };

  // Seed demo initial keys helper
  const handleSeedProductKeys = async (cardId: string) => {
    try {
      const demoKeys = [
        'AURA-A746-FD8E-3294',
        'AURA-BC63-91A2-K95P',
        'AURA-W48B-L928-H30I',
        'AURA-P492-X204-Q75U',
        'AURA-H39N-K94H-S84Y'
      ];
      await updateDoc(doc(db, 'giftCards', cardId), {
        codes: demoKeys,
        inventoryCount: demoKeys.length
      });
      showNotification('Demo key matrix seeded successfully.', 'success');
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `giftCards/${cardId}`);
    }
  };

  // Filter lists
  const filteredUsers = users.filter(u => 
    u.email?.toLowerCase().includes(userQuery.toLowerCase()) || 
    u.displayName?.toLowerCase().includes(userQuery.toLowerCase()) ||
    u.uid.toLowerCase().includes(userQuery.toLowerCase())
  );

  const filteredProducts = giftCards.filter(p =>
    p.brand.toLowerCase().includes(productQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(productQuery.toLowerCase())
  );

  const pendingDeposits = transactions.filter(t => t.type === 'deposit' && t.status === 'pending');

  return (
    <div className="max-w-7xl mx-auto space-y-10">
      
      {/* Header Panel */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-zinc-100 dark:border-zinc-900 pb-8">
        <div className="space-y-2 text-left">
          <div className="inline-flex items-center gap-1 bg-zinc-100 dark:bg-zinc-900 px-3 py-1 rounded-full text-[10px] font-bold font-mono uppercase tracking-wider text-zinc-500 dark:text-zinc-400 border border-zinc-200/50 dark:border-zinc-800/50">
            <Shield className="w-3.5 h-3.5 text-emerald-500" /> Secure Admin Zone
          </div>
          <h2 className="text-4xl sm:text-5xl font-display font-black tracking-tighter uppercase text-zinc-900 dark:text-white">
            Root Terminal
          </h2>
          <p className={`text-sm ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
            Global supervisor suite for users, token products, codes generation, and capital audits.
          </p>
        </div>
        <button 
          onClick={onBack}
          className={`px-6 py-3 rounded-xl border text-xs font-bold uppercase tracking-wider font-mono transition-all ${
            isDark 
              ? 'bg-zinc-900 border-zinc-800 hover:border-zinc-700 text-white' 
              : 'bg-white border-zinc-100 text-zinc-900 hover:bg-zinc-50'
          }`}
          id="btn-admin-close"
        >
          Back to Exchange
        </button>
      </div>

      {/* Navigation Sub-Menu */}
      <div className="flex flex-wrap md:flex-nowrap gap-2 p-1.5 rounded-2xl border bg-zinc-50/50 dark:bg-zinc-950/40 border-zinc-100 dark:border-zinc-900 w-full overflow-x-auto">
        <TabButton active={activeTab === 'users'} onClick={() => setActiveTab('users')} isDark={isDark} id="btn-admin-tab-users">
          <Users className="w-3.5 h-3.5" /> Users ({users.length})
        </TabButton>
        <TabButton active={activeTab === 'products'} onClick={() => setActiveTab('products')} isDark={isDark} id="btn-admin-tab-products">
          <Layers className="w-3.5 h-3.5" /> Items Inventory ({giftCards.length})
        </TabButton>
        <TabButton active={activeTab === 'deposits'} onClick={() => setActiveTab('deposits')} isDark={isDark} id="btn-admin-tab-deposits">
          <CreditCard className="w-3.5 h-3.5 text-amber-500" /> Pending Deposits ({pendingDeposits.length})
        </TabButton>
        <TabButton active={activeTab === 'payments'} onClick={() => setActiveTab('payments')} isDark={isDark} id="btn-admin-tab-payments">
          <Settings2 className="w-3.5 h-3.5" /> Payment Options
        </TabButton>
        <TabButton active={activeTab === 'submissions'} onClick={() => setActiveTab('submissions')} isDark={isDark} id="btn-admin-tab-submissions">
          <Inbox className="w-3.5 h-3.5" /> Seller Submissions ({submissions.length})
        </TabButton>
      </div>

      {/* ---------------------------------------------------- */}
      {/* 1. USERS MANAGER */}
      {/* ---------------------------------------------------- */}
      {activeTab === 'users' && (
        <div className="space-y-6 text-left animate-fadeIn">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="space-y-1">
              <h3 className="text-2xl font-display font-bold tracking-tight text-zinc-900 dark:text-white uppercase">User Registrations</h3>
              <p className="text-zinc-500 dark:text-zinc-400 text-xs">Verify credentials, switch roles, and audit account ledgers.</p>
            </div>
            
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input 
                type="text" 
                placeholder="Search email, name or UID..."
                value={userQuery}
                onChange={(e) => setUserQuery(e.target.value)}
                className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-xs outline-none border transition-all ${
                  isDark 
                    ? 'bg-zinc-900 border-zinc-800 text-white focus:border-zinc-800' 
                    : 'bg-white border-zinc-100 text-zinc-900 focus:border-zinc-200'
                }`}
              />
            </div>
          </div>

          <div className={`rounded-2xl border overflow-hidden shadow-xl ${
            isDark ? 'bg-zinc-950 border-zinc-900/50' : 'bg-white border-zinc-100'
          }`}>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className={isDark ? 'bg-zinc-900/20 border-b border-zinc-900/50' : 'bg-zinc-50 border-b border-zinc-100'}>
                  <tr>
                    <th className="px-6 py-4 text-[10px] font-mono tracking-wider font-bold uppercase text-zinc-400 dark:text-zinc-500">Member</th>
                    <th className="px-6 py-4 text-[10px] font-mono tracking-wider font-bold uppercase text-zinc-400 dark:text-zinc-500">Security / Role</th>
                    <th className="px-6 py-4 text-[10px] font-mono tracking-wider font-bold uppercase text-zinc-400 dark:text-zinc-500">Balance</th>
                    <th className="px-6 py-4 text-[10px] font-mono tracking-wider font-bold uppercase text-zinc-400 dark:text-zinc-500 text-right">Moderator Hooks</th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${isDark ? 'divide-zinc-900/35' : 'divide-zinc-101'}`}>
                  {filteredUsers.map(u => (
                    <tr key={u.uid} className={isDark ? 'hover:bg-zinc-900/10' : 'hover:bg-zinc-50/50'}>
                      <td className="px-6 py-5">
                        <p className="font-bold text-sm text-zinc-900 dark:text-white">{u.displayName || 'Unset Name'}</p>
                        <p className={`text-xs font-mono mt-0.5 ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>{u.email}</p>
                        <p className="text-[10px] text-zinc-500 font-mono mt-0.5">ID: {u.uid.substring(0, 16)}...</p>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2">
                          <span className={`px-2.5 py-1 rounded-xl text-[10px] font-bold uppercase tracking-wider border ${
                            u.role === 'admin' 
                              ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20' 
                              : 'bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border-zinc-100 dark:border-zinc-800'
                          }`}>
                            {u.role.toUpperCase()}
                          </span>
                          {u.twoFactorEnabled && (
                            <span className="bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-1.5 py-0.5 rounded text-[8px] font-mono font-bold">2FA</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <p className="font-mono font-black text-sm text-zinc-900 dark:text-zinc-100">
                          ${u.walletBalance?.toFixed(2) || '0.00'}
                        </p>
                      </td>
                      <td className="px-6 py-5 text-right space-x-2">
                        <button 
                          onClick={() => handleAdjustBalance(u)}
                          className={`px-3 py-1.5 rounded-lg text-[10px] font-bold font-mono uppercase inline-flex items-center gap-1 transition-colors border ${
                            isDark 
                              ? 'bg-zinc-900 border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:bg-zinc-800' 
                              : 'bg-white border-zinc-100 hover:border-zinc-200 text-zinc-700 hover:bg-zinc-50'
                          }`}
                        >
                          <DollarSign className="w-3 h-3 text-emerald-500" /> Adjust Wallet
                        </button>
                        <button 
                          onClick={() => handleToggleRole(u)}
                          className={`px-3 py-1.5 rounded-lg text-[10px] font-bold font-mono uppercase inline-flex items-center gap-1 transition-all ${
                            u.role === 'admin'
                              ? 'bg-purple-500/10 hover:bg-purple-500/25 text-purple-500 border border-purple-500/20'
                              : 'bg-zinc-105 dark:bg-zinc-900 hover:opacity-80 text-zinc-700 dark:text-zinc-300 border border-zinc-100 dark:border-zinc-800'
                          }`}
                        >
                          {u.role === 'admin' ? <UserMinus className="w-3 h-3" /> : <UserCheck className="w-3 h-3" />}
                          Role Toggle
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredUsers.length === 0 && (
                    <tr>
                      <td colSpan={4} className="text-center py-16 text-sm text-zinc-500">
                        No user account found matching "{userQuery}".
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* 2. ITEMS INVENTORY & Stock Auto-Generator */}
      {/* ---------------------------------------------------- */}
      {activeTab === 'products' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-left animate-fadeIn">
          
          {/* Create Product Form Card (Left Column) */}
          <div className="lg:col-span-1 space-y-6">
            <div className={`p-6 rounded-2xl border shadow-xl ${
              isDark ? 'bg-zinc-950 border-zinc-900/50' : 'bg-white border-zinc-100'
            }`}>
              <h3 className="text-xl font-display font-black uppercase tracking-tight flex items-center gap-2 text-zinc-900 dark:text-white">
                <Plus className="w-5 h-5 text-emerald-500" /> New Product Card
              </h3>
              <p className="text-xs text-zinc-400 mt-1 pb-4 border-b border-zinc-100 dark:border-zinc-800/40">
                Register a new digital brand or voucher package.
              </p>

              <form onSubmit={handleCreateProduct} className="space-y-4 pt-4">
                <div className="space-y-1">
                  <label className="text-[9px] font-bold uppercase tracking-widest text-zinc-500">Brand / Name</label>
                  <input 
                    type="text" 
                    value={newCard.brand}
                    onChange={(e) => setNewCard(prev => ({ ...prev, brand: e.target.value }))}
                    placeholder="e.g. PlayStation Network"
                    className={`w-full p-3 rounded-xl text-xs outline-none border ${
                      isDark ? 'bg-zinc-900 border-zinc-800 text-white' : 'bg-zinc-50 border-zinc-100 text-zinc-900'
                    }`}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold uppercase tracking-widest text-zinc-500">Category</label>
                    <select
                      value={newCard.category}
                      onChange={(e) => setNewCard(prev => ({ ...prev, category: e.target.value }))}
                      className={`w-full p-2.5 rounded-xl text-xs outline-none border ${
                        isDark ? 'bg-zinc-900 border-zinc-850 text-white' : 'bg-zinc-50 border-zinc-100 text-zinc-900'
                      }`}
                    >
                      <option value="Gaming">Gaming</option>
                      <option value="Music">Music</option>
                      <option value="Streaming">Streaming</option>
                      <option value="E-commerce">E-commerce</option>
                      <option value="Software">Software</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold uppercase tracking-widest text-zinc-500">Real Price ($)</label>
                    <input 
                      type="number" 
                      value={newCard.realPrice}
                      onChange={(e) => setNewCard(prev => ({ ...prev, realPrice: e.target.value }))}
                      placeholder="100"
                      className={`w-full p-2.5 rounded-xl text-xs outline-none border ${
                        isDark ? 'bg-zinc-900 border-zinc-850 text-white' : 'bg-zinc-50 border-zinc-101 text-zinc-900'
                      }`}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-bold uppercase tracking-widest text-zinc-500">Discount Percentage (%)</label>
                  <input 
                    type="number" 
                    value={newCard.discount}
                    onChange={(e) => setNewCard(prev => ({ ...prev, discount: e.target.value }))}
                    placeholder="10"
                    className={`w-full p-3 rounded-xl text-xs outline-none border ${
                      isDark ? 'bg-zinc-900 border-zinc-850 text-white' : 'bg-zinc-50 border-zinc-101 text-zinc-900'
                    }`}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-bold uppercase tracking-widest text-zinc-500">Description</label>
                  <textarea 
                    value={newCard.description}
                    onChange={(e) => setNewCard(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe item delivery specifications..."
                    rows={3}
                    className={`w-full p-3 rounded-xl text-xs outline-none border resize-none ${
                      isDark ? 'bg-zinc-900 border-zinc-850 text-white' : 'bg-zinc-50 border-zinc-101 text-zinc-900'
                    }`}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-bold uppercase tracking-widest text-zinc-500">Image Source (Optional)</label>
                  <input 
                    type="text" 
                    value={newCard.image}
                    onChange={(e) => setNewCard(prev => ({ ...prev, image: e.target.value }))}
                    placeholder="https://..."
                    className={`w-full p-3 rounded-xl text-xs outline-none border ${
                      isDark ? 'bg-zinc-900 border-zinc-850 text-white' : 'bg-zinc-50 border-zinc-101 text-zinc-900'
                    }`}
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-mono font-bold text-xs uppercase tracking-widest transition-colors flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/10"
                  id="btn-admin-add-product"
                >
                  <Plus className="w-4 h-4" /> Create Product Listing
                </button>
              </form>
            </div>
          </div>

          {/* Product Listing & Active Stock Control (Right Columns) */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* SEARCH PRODUCTS BLOCK */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="space-y-0.5">
                <h3 className="text-2xl font-display font-medium tracking-tight text-zinc-900 dark:text-white uppercase">Product Catalog</h3>
                <p className="text-zinc-500 text-xs">Configure license key inventories and stock generators.</p>
              </div>
              <div className="relative w-full sm:w-60">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400" />
                <input 
                  type="text" 
                  placeholder="Filter brands..."
                  value={productQuery}
                  onChange={(e) => setProductQuery(e.target.value)}
                  className={`w-full pl-9 pr-3 py-2 rounded-lg text-xs outline-none border ${
                    isDark 
                      ? 'bg-zinc-900 border-zinc-800 text-white focus:border-zinc-800' 
                      : 'bg-white border-zinc-101 text-zinc-900 focus:border-zinc-200'
                  }`}
                />
              </div>
            </div>

            {/* PRODUCT CARD GRID LIST */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredProducts.map(card => {
                const isSelected = editingCardId === card.id;
                return (
                  <div key={card.id} className={`p-5 rounded-2xl border transition-all relative ${
                    isSelected 
                      ? 'border-emerald-500 bg-emerald-500/5 shadow-emerald-500/10 shadow-xl scale-[1.01]' 
                      : (isDark ? 'bg-zinc-950 border-zinc-900/50 hover:border-zinc-850 shadow-md' : 'bg-white border-zinc-100 hover:border-zinc-200 shadow-md')
                  }`}>
                    
                    {/* Brand Banner */}
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[9px] font-mono font-bold tracking-widest text-zinc-400 uppercase">{card.category}</span>
                        <h4 className="text-lg font-black tracking-tight text-zinc-900 dark:text-white uppercase leading-none mt-0.5">{card.brand}</h4>
                        <p className="text-xs font-mono font-semibold text-emerald-500 mt-1">${card.finalPrice.toFixed(2)} <span className="text-[10px] text-zinc-400 font-normal line-through">${card.realPrice.toFixed(2)}</span></p>
                      </div>
                      <div className="flex gap-1">
                        <button 
                          onClick={() => setEditingCardId(isSelected ? null : card.id)}
                          className={`p-2 rounded-lg border transition-colors ${
                            isSelected 
                              ? 'bg-emerald-500 text-white border-emerald-500' 
                              : (isDark ? 'bg-zinc-900 hover:bg-zinc-800 border-zinc-850 text-zinc-300' : 'bg-zinc-50 hover:bg-zinc-100 border-zinc-100 text-zinc-700')
                          }`}
                          title="Generate or edit codes"
                        >
                          <Key className="w-3.5 h-3.5" />
                        </button>
                        <button 
                          onClick={() => handleDeleteProduct(card.id, card.brand)}
                          className={`p-2 rounded-lg border hover:bg-red-500/15 text-red-500 transition-colors ${
                            isDark ? 'bg-zinc-900 border-zinc-850' : 'bg-zinc-50 border-zinc-100'
                          }`}
                          title="Delete card"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Stock indicator info */}
                    <div className="mt-4 pt-3 border-t border-zinc-100/60 dark:border-zinc-900 flex justify-between items-center">
                      <div className="space-y-0.5">
                        <p className="text-[9px] font-mono uppercase text-zinc-500 font-bold">Active Inventory Stock</p>
                        <p className="text-base font-black font-mono flex items-center gap-1.5 text-zinc-900 dark:text-white">
                          <Code className="w-4 h-4 text-zinc-400" /> {card.codes?.length || 0} keys <span className="text-[11px] font-normal font-sans text-zinc-400">({card.inventoryCount} live)</span>
                        </p>
                      </div>
                      {(card.codes?.length || 0) === 0 && (
                        <button 
                          onClick={() => handleSeedProductKeys(card.id)}
                          className="px-2.5 py-1 rounded bg-amber-500/10 border border-amber-500/20 text-amber-500 font-mono text-[9px] font-black uppercase hover:bg-amber-500/25"
                        >
                          Quick Seed Demo Keys
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* KEY GENERATOR DRAWER FOR ACTIVE SELECTION */}
            {editingCardId && (
              <div className={`p-6 rounded-2xl border text-left space-y-6 shadow-2xl animate-slideDown ${
                isDark ? 'bg-zinc-950 border-emerald-500/30' : 'bg-emerald-50/20 border-emerald-500/20'
              }`}>
                <div className="flex justify-between items-center pb-4 border-b border-zinc-100 dark:border-zinc-800">
                  <div>
                    <h4 className="font-display font-black text-xl text-zinc-900 dark:text-white uppercase">
                      Code Management Room
                    </h4>
                    <p className="text-xs text-zinc-400 mt-1">
                      Generating codes for product ID: <span className="font-mono text-emerald-500">{giftCards.find(c => c.id === editingCardId)?.brand}</span>
                    </p>
                  </div>
                  <button 
                    onClick={() => setEditingCardId(null)}
                    className="p-1 rounded-lg border border-zinc-100 dark:border-zinc-800 text-zinc-400 hover:text-zinc-650"
                  >
                    <XCircle className="w-5 h-5" />
                  </button>
                </div>

                {/* AUTO-GENERATOR CONTROLS */}
                <div className={`p-5 rounded-xl border space-y-4 ${
                  isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-100'
                }`}>
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-emerald-500" />
                    <p className="font-bold text-xs uppercase tracking-wider font-mono">Format Stock Keys Auto-Generator</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">Code Format / Layout</label>
                      <input 
                        type="text" 
                        value={genFormat}
                        onChange={(e) => setGenFormat(e.target.value)}
                        placeholder="XXXX-XXXX-XXXX"
                        className={`w-full p-2 rounded text-xs outline-none border font-mono ${
                          isDark ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-zinc-50 border-zinc-101 text-zinc-900'
                        }`}
                      />
                      <p className="text-[8px] text-zinc-500">X = Alpha/Num, # = Digit, - = dash</p>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">Optional Prefix</label>
                      <input 
                        type="text" 
                        value={genPrefix}
                        onChange={(e) => setGenPrefix(e.target.value)}
                        placeholder="e.g. AMZN"
                        className={`w-full p-2 rounded text-xs outline-none border font-mono uppercase ${
                          isDark ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-zinc-50 border-zinc-101 text-zinc-900'
                        }`}
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">Quantity to Inject</label>
                      <input 
                        type="number" 
                        value={genQuantity}
                        onChange={(e) => setGenQuantity(e.target.value)}
                        placeholder="10"
                        className={`w-full p-2 rounded text-xs outline-none border font-mono ${
                          isDark ? 'bg-zinc-955 border-zinc-800 text-white' : 'bg-zinc-55 border-zinc-200 text-zinc-900'
                        }`}
                      />
                    </div>
                  </div>

                  <button
                    onClick={executeCodeGenerator}
                    className="px-5 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-mono font-bold text-xs uppercase tracking-wider transition-colors flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" /> Generate Batch Preview
                  </button>
                </div>

                {/* TEXT AREA CODES PREVIEW */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-500 flex justify-between">
                    <span>Keys Registry List (one per line)</span>
                    <span className="text-emerald-500">{bulkCodeInput.split('\n').filter(Boolean).length} keys currently in pool</span>
                  </label>
                  <textarea
                    value={bulkCodeInput}
                    onChange={(e) => setBulkCodeInput(e.target.value)}
                    placeholder="Paste your activation keys or write them here..."
                    rows={8}
                    className={`w-full p-4 rounded-xl text-xs outline-none border font-mono ${
                      isDark 
                        ? 'bg-zinc-900 border-zinc-800 text-zinc-300 focus:border-zinc-805' 
                        : 'bg-white border-zinc-100 text-zinc-900 focus:border-zinc-200'
                    }`}
                  />
                </div>

                <div className="flex gap-3 justify-end pt-2">
                  <button 
                    onClick={() => setEditingCardId(null)}
                    className={`px-4 py-2 rounded-lg text-xs font-bold font-mono uppercase border ${
                      isDark ? 'bg-zinc-900 text-zinc-300 border-zinc-800 hover:bg-zinc-800' : 'bg-zinc-100 text-zinc-700 border-zinc-100 hover:bg-zinc-100'
                    }`}
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={saveCodesToDatabase}
                    className="px-6 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold font-mono uppercase tracking-wider shadow-md flex items-center gap-1.5"
                    id="btn-save-key-pool"
                  >
                    <Save className="w-4 h-4" /> Save Key Pool
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* 3. DEPOSIT REQUESTS REVIEW QUEUE */}
      {/* ---------------------------------------------------- */}
      {activeTab === 'deposits' && (
        <div className="space-y-6 text-left animate-fadeIn">
          <div className="space-y-1">
            <h3 className="text-2xl font-display font-black tracking-tight text-zinc-900 dark:text-white uppercase">Capital Deposit Review Queue</h3>
            <p className="text-xs text-zinc-400">Accept or decline user deposits. Once accepted, user balances are credited atomically in database.</p>
          </div>

          <div className={`rounded-2xl border overflow-hidden shadow-xl ${
            isDark ? 'bg-zinc-950 border-zinc-900/50' : 'bg-white border-zinc-101'
          }`}>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className={isDark ? 'bg-zinc-900/20 border-b border-zinc-900/50' : 'bg-zinc-50 border-b border-zinc-100'}>
                  <tr>
                    <th className="px-6 py-4 text-[10px] font-mono tracking-wider font-bold uppercase text-zinc-400 dark:text-zinc-500">Receipt ID / User</th>
                    <th className="px-6 py-4 text-[10px] font-mono tracking-wider font-bold uppercase text-zinc-400 dark:text-zinc-500">Method</th>
                    <th className="px-6 py-4 text-[10px] font-mono tracking-wider font-bold uppercase text-zinc-400 dark:text-zinc-500">Amount Request</th>
                    <th className="px-6 py-4 text-[10px] font-mono tracking-wider font-bold uppercase text-zinc-400 dark:text-zinc-500">Status</th>
                    <th className="px-6 py-4 text-[10px] font-mono tracking-wider font-bold uppercase text-zinc-400 dark:text-zinc-500 text-right">Review Hooks</th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${isDark ? 'divide-zinc-900/35' : 'divide-zinc-100/80'}`}>
                  {transactions.map(tx => (
                    <tr key={tx.id} className={isDark ? 'hover:bg-zinc-900/10' : 'hover:bg-zinc-50/50'}>
                      <td className="px-6 py-5">
                        <p className="font-bold text-sm text-zinc-900 dark:text-white">{tx.userEmail || 'Client ID: ' + tx.userId.substring(0, 8)}</p>
                        <p className="text-[10px] text-zinc-400 font-mono mt-0.5">Tx ID: {tx.id}</p>
                        <p className="text-[9px] text-zinc-500 mt-0.5">{tx.timestamp ? format(new Date(tx.timestamp), 'MMM dd, yyyy HH:mm') : ''}</p>
                      </td>
                      <td className="px-6 py-5">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold uppercase font-mono border ${
                          tx.method?.includes('Crypto') 
                            ? 'bg-amber-500/10 border-amber-500/20 text-amber-500' 
                            : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500'
                        }`}>
                          {tx.method || 'General Card'}
                        </span>
                      </td>
                      <td className="px-6 py-5 font-mono font-black text-sm text-zinc-900 dark:text-zinc-100">
                        ${tx.amount?.toFixed(2) || '0.00'}
                      </td>
                      <td className="px-6 py-5">
                        <span className={`px-2.5 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider border ${
                          tx.status === 'completed' 
                            ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/25'
                            : tx.status === 'pending'
                            ? 'bg-amber-500/10 text-amber-500 border border-amber-500/25 animate-pulse'
                            : 'bg-red-500/10 text-red-500 border border-red-500/25'
                        }`}>
                          {tx.status}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-right space-x-2">
                        {tx.status === 'pending' ? (
                          <>
                            <button
                              onClick={() => handleApproveDeposit(tx)}
                              className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-mono font-bold text-[10px] uppercase tracking-wider transition-all shadow-md inline-flex items-center gap-1"
                              id={`btn-approve-tx-${tx.id}`}
                            >
                              <CheckCircle className="w-3.5 h-3.5" /> Authorize
                            </button>
                            <button
                              onClick={() => handleDeclineDeposit(tx)}
                              className="px-3.5 py-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-mono font-bold text-[10px] uppercase tracking-wider inline-flex items-center gap-1"
                              id={`btn-decline-tx-${tx.id}`}
                            >
                              <XCircle className="w-3.5 h-3.5 text-red-500" /> Reject
                            </button>
                          </>
                        ) : (
                          <span className="text-[10px] font-mono text-zinc-500 uppercase font-black">Reviewed</span>
                        )}
                      </td>
                    </tr>
                  ))}
                  {transactions.length === 0 && (
                    <tr>
                      <td colSpan={5} className="text-center py-16 text-sm text-zinc-500">
                        No financial deposit actions detected in general ledger.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* 4. MERCHANT SETTINGS (PAYMENTS ROUTING) */}
      {/* ---------------------------------------------------- */}
      {activeTab === 'payments' && (
        <div className="max-w-2xl mx-auto text-left animate-fadeIn space-y-6">
          <div className="space-y-1">
            <h3 className="text-2xl font-display font-black tracking-tight text-zinc-900 dark:text-white uppercase flex items-center gap-2">
              <Settings2 className="w-6 h-6 text-emerald-500" /> Payment Options Supervisor
            </h3>
            <p className="text-xs text-zinc-400">Update available wallet payment gateways and crypto networks exposed globally to clients.</p>
          </div>

          <form onSubmit={handleSavePayments} className={`p-8 rounded-2xl border space-y-6 shadow-xl ${
            isDark ? 'bg-zinc-950 border-zinc-900/50' : 'bg-white border-zinc-101'
          }`}>
            
            {/* Razorpay Gateway */}
            <div className="space-y-4 pb-6 border-b border-zinc-100 dark:border-zinc-900/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500 font-black font-mono text-xs">A</div>
                  <div>
                    <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">Gateway Option A</h4>
                    <p className="text-[10px] text-zinc-500 font-mono">Domestic Indian Cards / Card Integration</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={paymentsConfig.razorpay_enabled} 
                    onChange={(e) => setPaymentsConfig(prev => ({ ...prev, razorpay_enabled: e.target.checked }))}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-zinc-300 dark:bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
                </label>
              </div>
              {paymentsConfig.razorpay_enabled && (
                <div className="grid grid-cols-1 gap-2.5 pl-10">
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold uppercase tracking-widest text-zinc-500">Custom Option Display Label</label>
                    <input 
                      type="text" 
                      value={paymentsConfig.razorpay_title}
                      onChange={(e) => setPaymentsConfig(prev => ({ ...prev, razorpay_title: e.target.value }))}
                      className={`w-full p-2.5 rounded-xl text-xs outline-none border ${
                        isDark ? 'bg-zinc-900 border-zinc-800 text-white' : 'bg-zinc-50 border-zinc-100 text-zinc-900'
                      }`}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Crypto USDT/BTC Routing */}
            <div className="space-y-4 pb-6 border-b border-zinc-100 dark:border-zinc-900/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-500 font-black font-mono text-xs">B</div>
                  <div>
                    <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">Gateway Option B</h4>
                    <p className="text-[10px] text-zinc-500 font-mono">Decentralized Blockchain Payments</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={paymentsConfig.crypto_enabled} 
                    onChange={(e) => setPaymentsConfig(prev => ({ ...prev, crypto_enabled: e.target.checked }))}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-zinc-300 dark:bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-350 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
                </label>
              </div>
              {paymentsConfig.crypto_enabled && (
                <div className="grid grid-cols-1 gap-3 pl-10">
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold uppercase tracking-widest text-zinc-500">Custom Option Display Label</label>
                    <input 
                      type="text" 
                      value={paymentsConfig.crypto_title}
                      onChange={(e) => setPaymentsConfig(prev => ({ ...prev, crypto_title: e.target.value }))}
                      className={`w-full p-2.5 rounded-xl text-xs outline-none border ${
                        isDark ? 'bg-zinc-900 border-zinc-800 text-white' : 'bg-zinc-50 border-zinc-100 text-zinc-900'
                      }`}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold uppercase tracking-widest text-zinc-500">Network Wallet Address (USDT TRC20/ERC20/BTC)</label>
                    <input 
                      type="text" 
                      value={paymentsConfig.crypto_address}
                      onChange={(e) => setPaymentsConfig(prev => ({ ...prev, crypto_address: e.target.value }))}
                      className={`w-full p-2.5 rounded-xl text-xs font-mono outline-none border ${
                        isDark ? 'bg-zinc-900 border-zinc-800 text-emerald-400' : 'bg-zinc-50 border-zinc-100 text-emerald-700'
                      }`}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Stripe International Gateway */}
            <div className="space-y-4 pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500 font-black font-mono text-xs">C</div>
                  <div>
                    <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">Gateway Option C</h4>
                    <p className="text-[10px] text-zinc-500 font-mono">Global Credit Cards & Merchant Accounts</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={paymentsConfig.stripe_enabled} 
                    onChange={(e) => setPaymentsConfig(prev => ({ ...prev, stripe_enabled: e.target.checked }))}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-zinc-300 dark:bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-350 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
                </label>
              </div>
              {paymentsConfig.stripe_enabled && (
                <div className="grid grid-cols-1 gap-2.5 pl-10">
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold uppercase tracking-widest text-zinc-500">Custom Option Display Label</label>
                    <input 
                      type="text" 
                      value={paymentsConfig.stripe_title}
                      onChange={(e) => setPaymentsConfig(prev => ({ ...prev, stripe_title: e.target.value }))}
                      className={`w-full p-2.5 rounded-xl text-xs outline-none border ${
                        isDark ? 'bg-zinc-900 border-zinc-800 text-white' : 'bg-zinc-50 border-zinc-101 text-zinc-900'
                      }`}
                    />
                  </div>
                </div>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-4.5 rounded-xl bg-black dark:bg-white text-white dark:text-zinc-950 font-mono font-bold text-xs uppercase tracking-widest hover:opacity-90 transition-all flex items-center justify-center gap-2"
              id="btn-admin-save-payments"
            >
              <Save className="w-4 h-4 text-emerald-500" /> Apply Global Configurations
            </button>
          </form>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* 5. ORIGINAL SELLER SUBMISSIONS */}
      {/* ---------------------------------------------------- */}
      {activeTab === 'submissions' && (
        <div className="space-y-6 text-left animate-fadeIn">
          <div className="space-y-1">
            <h3 className="text-2xl font-display font-medium tracking-tight text-zinc-900 dark:text-white uppercase">Seller Submissions Ledger</h3>
            <p className="text-xs text-zinc-500">Review codes package uploaded under the Merchant Hub directly by suppliers.</p>
          </div>

          <div className={`rounded-xl border overflow-hidden shadow-xl ${
            isDark ? 'bg-zinc-950 border-zinc-900/50' : 'bg-white border-zinc-101'
          }`}>
            <table className="w-full text-left border-collapse">
              <thead className={isDark ? 'bg-zinc-900/20 border-b border-zinc-900/50' : 'bg-zinc-50 border-b border-zinc-101'}>
                <tr>
                  <th className="px-6 py-4 text-[10px] font-mono tracking-wider font-bold uppercase text-zinc-400 dark:text-zinc-500">Supplier Account ID</th>
                  <th className="px-6 py-4 text-[10px] font-mono tracking-wider font-bold uppercase text-zinc-400 dark:text-zinc-500">Codes / Size</th>
                  <th className="px-6 py-4 text-[10px] font-mono tracking-wider font-bold uppercase text-zinc-400 dark:text-zinc-500">Status</th>
                  <th className="px-6 py-4 text-[10px] font-mono tracking-wider font-bold uppercase text-zinc-400 dark:text-zinc-500">Timestamp</th>
                  <th className="px-6 py-4 text-[10px] font-mono tracking-wider font-bold uppercase text-zinc-400 dark:text-zinc-500 text-right">Moderator Hooks</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isDark ? 'divide-zinc-900/35' : 'divide-zinc-100/80'}`}>
                {submissions.map(sub => (
                  <tr key={sub.id} className={isDark ? 'hover:bg-zinc-900/10' : 'hover:bg-zinc-50/50'}>
                    <td className="px-6 py-5 font-bold font-mono text-xs">{sub.userId ? sub.userId.substring(0, 16) + '...' : 'System'}</td>
                    <td className="px-6 py-5">
                      <p className="font-bold text-sm text-zinc-900 dark:text-white">{sub.fileName || 'Virtual Transfer Raw'}</p>
                      <p className={`text-[10px] font-mono ${isDark ? 'text-zinc-500' : 'text-zinc-405'}`}>{(sub.fileSize / 1024).toFixed(2)} KB</p>
                    </td>
                    <td className="px-6 py-5">
                      <span className={`px-2.5 py-1 rounded-xl text-[10px] font-bold uppercase tracking-wider border ${
                        sub.status === 'pending' 
                          ? 'bg-amber-500/10 text-amber-500 border border-amber-500/25'
                          : 'bg-zinc-100 dark:bg-zinc-900 text-zinc-500 dark:text-zinc-400 border border-zinc-101 dark:border-zinc-800'
                      }`}>
                        {sub.status}
                      </span>
                    </td>
                    <td className={`px-6 py-5 text-xs font-mono ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
                      {sub.timestamp ? format(new Date(sub.timestamp), 'MMM dd, yyyy HH:mm') : 'Unset'}
                    </td>
                    <td className="px-6 py-5 text-right">
                      <button 
                        onClick={() => handleSubmissionReview(sub)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold uppercase border hover:bg-zinc-800/10 ${
                          isDark ? 'text-amber-500 border-zinc-800' : 'text-amber-600 border-zinc-101'
                        }`}
                      >
                        Launch Review
                      </button>
                    </td>
                  </tr>
                ))}
                {submissions.length === 0 && (
                  <tr>
                    <td colSpan={5} className="text-center py-16 text-sm text-zinc-500">
                      No merchant submissions recorded in supply database.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

// Reusable elegant Tab Button
const TabButton = ({ children, active, onClick, isDark, id }: { children: React.ReactNode, active: boolean, onClick: () => void, isDark?: boolean, id?: string }) => (
  <button 
    onClick={onClick}
    id={id}
    className={`px-5 py-3 rounded-xl text-xs font-extrabold uppercase tracking-widest flex items-center gap-2 transition-all shrink-0 font-sans ${
      active 
        ? (isDark ? 'bg-zinc-900 text-white border border-zinc-800 shadow-md' : 'bg-white text-black border border-zinc-100 shadow-sm') 
        : (isDark ? 'text-zinc-500 hover:text-zinc-350' : 'text-zinc-400 hover:text-zinc-600')
    }`}
  >
    {children}
  </button>
);
