import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { 
  Users, Layers, Settings2, CreditCard, ChevronRight, CheckCircle, XCircle, 
  Trash2, Plus, Sparkles, RefreshCw, Search, Code, Key, ChevronDown, Check,
  AlertCircle, DollarSign, HelpCircle, Save, Shield, UserMinus, UserCheck, Inbox,
  ChevronLeft
} from 'lucide-react';
import { useNotification } from '../lib/useNotification';
import useApi from '../lib/useFetch';

export const AdminPanel = ({ onBack, isDark }) => {
  const { showNotification } = useNotification();
  const api = useApi();
  // Tab control
  const [activeTab, setActiveTab] = useState('users');

  // Firestore DB states
  const [users, setUsers] = useState([]);
  const [pendingDeposits, setPendingDeposists] = useState([]);
  const [giftCards, setGiftCards] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  
  // Search & Filters
  const [userQuery, setUserQuery] = useState('');
  const [productQuery, setProductQuery] = useState('');

  // Selected details for modal or sub-manager
  const [editingCardId, setEditingCardId] = useState(null);
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
  useEffect(()=>{
    const handleDashboard = async() =>{
      const [dataUser,dataPayment,dataDeposit,dataCards] = await Promise.all([api.admin.getUsers(),api.admin.getPaymentDetails(),api.admin.getPendingDeposits(),api.product.list()]);
      setUsers(dataUser?.users);
      setPendingDeposists(dataDeposit?.deposits);
      setPaymentsConfig(dataPayment?.paymentDetails);
      setGiftCards(dataCards?.products ?? []);
    }
     handleDashboard(users,pendingDeposits,paymentsConfig)
  },[])
  const handleAdjustBalance = async (targetUser) => {
    const amountStr = prompt(`Adjust ${targetUser.displayName || targetUser.email}'s balance. Enter positive count to add, negative to deduct:`, '100');
    if (amountStr === null) return;
    const delta = parseFloat(amountStr);
    if (isNaN(delta)) {
      showNotification('Please enter a valid numeric value.', 'error');
      return;
    }
      const data = await api.admin.updateBalance(JSON.stringify({balance : amountStr,id : targetUser._id}));
      if(!data?.status) return
      setUsers((prev)=>prev.map((u)=>u._id == targetUser._id ? {...u , balance : u.balance + Number(amountStr)} : u));
  };
  const handleToggleRole = async (targetUser) => {
    const role = targetUser.role === "admin" ? "user" : "admin"
      const data = await api.admin.updateRole(JSON.stringify({role,id : targetUser._id}));
      if(!data?.status) return
      setUsers((prev)=>prev.map((u)=>u._id == targetUser._id ? {...u , role} : u));
  };

  // ==========================================
  // DEPOSITS (ACCEPT/DECLINE) QUEUE
  // ==========================================
  const handleDeposit = async (tx,action) => {
     await api.admin.updateBalance(JSON.stringify({balance : Number(tx.amount),id : tx.userId._id}));
      await api.admin.updateDeposit(JSON.stringify({id : tx._id,action}));
      setPendingDeposists((prev)=>prev.filter((m)=>m._id !== tx._id ))
   };
  // ==========================================
  // ITEMS LIST / CODES AUTO-GENERATOR
  // ==========================================
  const handleCreateProduct = async (e) => {
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
      inventoryCount: 0
    };
    await api.admin.addProduct(JSON.stringify({cardData}));
    setGiftCards((prev)=>[cardData,...prev])
  };

  // const handleDeleteProduct = async (cardId, brand) => {
  //   if (!confirm(`Are you absolutely sure you want to permanently delete "${brand}"?`)) return;
  //   try {
  //     await deleteDoc(doc(db, 'giftCards', cardId));
  //     showNotification(`Product "${brand}" deleted from global registry.`, 'success');
  //     if (editingCardId === cardId) setEditingCardId(null);
  //   } catch (err) {
  //     handleFirestoreError(err, OperationType.DELETE, `giftCards/${cardId}`);
  //   }
  // };

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

    const generated= [];
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

  // const saveCodesToDatabase = async () => {
  //   if (!editingCardId) return;
  //   const codes = bulkCodeInput
  //     .split('\n')
  //     .map(line => line.trim())
  //     .filter(line => line.length > 0);

  //   try {
  //     await updateDoc(doc(db, 'giftCards', editingCardId), {
  //       codes: codes,
  //       inventoryCount: codes.length
  //     });
  //     showNotification(`Cryptographic key registry updated! Current stock: ${codes.length} keys`, 'success');
  //     setEditingCardId(null);
  //   } catch (err) {
  //     handleFirestoreError(err, OperationType.UPDATE, `giftCards/${editingCardId}`);
  //   }
  // };

  // ==========================================
  // PAYMENT SETTINGS WRITE
  // ==========================================
  const handleSavePayments = async (e) => {
    e.preventDefault();
     await api.admin.updatePaymentMethod(JSON.stringify({paymentsConfig}));
  };

  // ==========================================
  // ORIGINAL SUBMISSION AUDIT
  // ==========================================
  // const handleSubmissionReview = async (sub) => {
  //   const valid = prompt('Enter valid percentage (0-100):', '100');
  //   const value = prompt('Enter estimated value ($):', '50');
  //   if (valid === null || value === null) return;

  //   try {
  //     await updateDoc(doc(db, 'submissions', sub.id), {
  //       status: 'checked',
  //       validPercentage: Number(valid),
  //       estimatedValue: Number(value)
  //     });
  //     showNotification('Seller stock submission reviewed and updated.', 'success');
  //   } catch (err) {
  //     handleFirestoreError(err, OperationType.UPDATE, 'submissions');
  //   }
  // };

  // Seed demo initial keys helper
  // const handleSeedProductKeys = async (cardId) => {
  //   try {
  //     const demoKeys = [
  //       'AURA-A746-FD8E-3294',
  //       'AURA-BC63-91A2-K95P',
  //       'AURA-W48B-L928-H30I',
  //       'AURA-P492-X204-Q75U',
  //       'AURA-H39N-K94H-S84Y'
  //     ];
  //     await updateDoc(doc(db, 'giftCards', cardId), {
  //       codes: demoKeys,
  //       inventoryCount: demoKeys.length
  //     });
  //     showNotification('Demo key matrix seeded successfully.', 'success');
  //   } catch (err) {
  //     handleFirestoreError(err, OperationType.UPDATE, `giftCards/${cardId}`);
  //   }
  // };

  // Filter lists
  const filteredUsers = users?.filter(u => 
    u?.email?.toLowerCase().includes(userQuery?.toLowerCase()) || 
    u?.displayName?.toLowerCase().includes(userQuery?.toLowerCase()) ||
    u?.uid?.toLowerCase().includes(userQuery?.toLowerCase())
  );

  const filteredProducts = giftCards?.filter(p =>
    p.brand.toLowerCase().includes(productQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(productQuery.toLowerCase())
  );

  const [curr,setCurr] = useState(0);
  const [start,setStart] = useState(0);
  const [end,setEnd] = useState(0);
  const perPage = 10;
  const totalPages = Math.round(filteredProducts?.length / perPage)
  // const pendingDeposits = transactions?.filter(t => t.type === 'deposit' && t.status === 'pending');

  return (
    <div className="max-w-7xl mx-auto space-y-10 my-8">
      
      {/* Header Panel */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-zinc-100 dark:border-zinc-900 pb-8">
        <div className="space-y-2 text-left">
          <div className="inline-flex items-center gap-1 bg-zinc-100 dark:bg-zinc-900 px-3 py-1 rounded-full text-[10px] font-bold font-mono uppercase tracking-wider text-zinc-500 dark:text-zinc-400 border border-zinc-200/50 dark:border-zinc-800/50">
            <Shield className="w-3.5 h-3.5 text-emerald-500" /> Secure Admin Zone
          </div>
          <h2 className="text-4xl sm:text-5xl font-display font-black tracking-tighter uppercase text-zinc-900 dark:text-white">
            Root Terminal
          </h2>
          <p className={`text-sm text-zinc-500 dark:text-zinc-400`}>
            Global supervisor suite for users, token products, codes generation, and capital audits.
          </p>
        </div>
        <button 
          onClick={onBack}
          className={`px-6 py-3 rounded-xl border text-xs font-bold uppercase tracking-wider font-mono transition-all bg-white border-zinc-100 text-zinc-900 hover:bg-zinc-50 dark:bg-zinc-900 dark:border-zinc-800 dark:hover:border-zinc-700 dark:text-white dark:hover:text-zinc-900`}
          id="btn-admin-close"
        >
          Back to Exchange
        </button>
      </div>

      {/* Navigation Sub-Menu */}
      <div className="flex flex-wrap md:flex-nowrap gap-2 p-1.5 rounded-2xl border bg-zinc-50/50 dark:bg-zinc-950/40 border-zinc-100 dark:border-zinc-900 w-full overflow-x-auto">
        <TabButton active={activeTab === 'users'} onClick={() => setActiveTab('users')}  id="btn-admin-tab-users">
          <Users className="w-3.5 h-3.5" /> Users ({users.length})
        </TabButton>
        <TabButton active={activeTab === 'products'} onClick={() => setActiveTab('products')}  id="btn-admin-tab-products">
          <Layers className="w-3.5 h-3.5" /> Items Inventory ({giftCards.length})
        </TabButton>
        <TabButton active={activeTab === 'deposits'} onClick={() => setActiveTab('deposits')}  id="btn-admin-tab-deposits">
          <CreditCard className="w-3.5 h-3.5 text-amber-500" /> Pending Deposits ({pendingDeposits?.length})
        </TabButton>
        <TabButton active={activeTab === 'payments'} onClick={() => setActiveTab('payments')}  id="btn-admin-tab-payments">
          <Settings2 className="w-3.5 h-3.5" /> Payment Options
        </TabButton>
        {/* <TabButton active={activeTab === 'submissions'} onClick={() => setActiveTab('submissions')}  id="btn-admin-tab-submissions">
          <Inbox className="w-3.5 h-3.5" /> Seller Submissions ({submissions.length})
        </TabButton> */}
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
                className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-xs outline-none border transition-all bg-white border-zinc-100 text-zinc-900 focus:border-zinc-200 dark:bg-zinc-900 dark:border-zinc-800 dark:text-white dark:focus:border-zinc-800`}
              />
            </div>
          </div>

          <div className={`rounded-2xl border overflow-hidden shadow-xl bg-white border-zinc-100 dark:bg-zinc-950 dark:border-zinc-900/50`}>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className={'dark:bg-zinc-900/20  dark:border-zinc-900/50 bg-zinc-50 border-b border-zinc-100'}>
                  <tr>
                    <th className="px-6 py-4 text-[10px] font-mono tracking-wider font-bold uppercase text-zinc-400 dark:text-zinc-500">Member</th>
                    <th className="px-6 py-4 text-[10px] font-mono tracking-wider font-bold uppercase text-zinc-400 dark:text-zinc-500">Security / Role</th>
                    <th className="px-6 py-4 text-[10px] font-mono tracking-wider font-bold uppercase text-zinc-400 dark:text-zinc-500">Balance</th>
                    <th className="px-6 py-4 text-[10px] font-mono tracking-wider font-bold uppercase text-zinc-400 dark:text-zinc-500 text-right">Moderator Hooks</th>
                  </tr>
                </thead>
                <tbody className={`divide-y divide-zinc-100 dark:divide-zinc-900/35`}>
                  {filteredUsers.map(u => (
                    <tr key={u._id} className={`hover:bg-zinc-50/50 dark:hover:bg-zinc-900/10`}>
                      <td className="px-6 py-5">
                        <p className="font-bold text-sm text-zinc-900 dark:text-white">{u.fullName || 'Unset Name'}</p>
                        <p className={`text-xs font-mono mt-0.5 text-zinc-500 dark:text-zinc-400`}>{u.email}</p>
                        <p className="text-[10px] text-zinc-500 font-mono mt-0.5">ID: {u._id.substring(0, 16)}...</p>
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
                          ${u?.balance?.toFixed(2) ?? '0.00'}
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
            <div className={`p-6 rounded-2xl border shadow-xl bg-white dark:bg-zinc-950 border-zinc-100 dark:border-zinc-900/50`}>
              <h3 className="text-xl font-display font-black uppercase tracking-tight flex items-center gap-2 text-zinc-900 dark:text-white">
                <Plus className="w-5 h-5 text-emerald-500" /> New Product Card
              </h3>
              <p className="text-xs text-zinc-400 mt-1 pb-4 border-b border-zinc-100 dark:border-zinc-800/40">
                Register a new digital brand or voucher package.
              </p>

              <form className="space-y-4 pt-4">
                <div className="space-y-1">
                  <label className="text-[9px] font-bold uppercase tracking-widest text-zinc-500">Brand / Name</label>
                  <input 
                    type="text"
                    value={newCard.brand}
                    onChange={(e) => setNewCard(prev => ({ ...prev, brand: e.target.value }))}
                    placeholder="e.g. PlayStation Network"
                    className="w-full p-3 rounded-xl text-xs outline-none border bg-zinc-50 dark:bg-zinc-900 border-zinc-100 dark:border-zinc-800 text-zinc-900 dark:text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold uppercase tracking-widest text-zinc-500">Category</label>
                    <select
                      value={newCard.category}
                      onChange={(e) => setNewCard(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full p-2.5 rounded-xl text-xs outline-none border bg-zinc-50 dark:bg-zinc-900 border-zinc-100 dark:border-zinc-800 text-zinc-900 dark:text-white"
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
                      className="w-full p-2.5 rounded-xl text-xs outline-none border bg-zinc-50 dark:bg-zinc-900 border-zinc-100 dark:border-zinc-800 text-zinc-900 dark:text-white"
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
                    className={`w-full p-3 rounded-xl text-xs outline-none border dark:bg-zinc-900 dark:border-zinc-800 dark:text-white bg-zinc-50 border-zinc-100 text-zinc-900
                    `}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-bold uppercase tracking-widest text-zinc-500">Description</label>
                  <textarea 
                    value={newCard.description}
                    onChange={(e) => setNewCard(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe item delivery specifications..."
                    rows={3}
                    className="w-full p-3 rounded-xl text-xs outline-none border resize-none bg-zinc-50 dark:bg-zinc-900 border-zinc-100 dark:border-zinc-800 text-zinc-900 dark:text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-bold uppercase tracking-widest text-zinc-500">Image Source (Optional)</label>
                  <input 
                    type="text" 
                    value={newCard.image}
                    onChange={(e) => setNewCard(prev => ({ ...prev, image: e.target.value }))}
                    placeholder="https://..."
                    className={`w-full p-3 rounded-xl text-xs outline-none border dark:bg-zinc-900 dark:border-zinc-800 dark:text-white bg-zinc-50 border-zinc-100 text-zinc-900
                    `}
                  />
                </div>

                <button 
                  type="button"
                  onClick={()=>handleCreateProduct()}
                  className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-mono font-bold text-xs uppercase tracking-widest transition-colors flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/10"
                  id="btn-admin-add-product"
                >
                  <Plus className="w-4 h-4" /> Create Product Listing
                </button>
              </form>
            </div>
             {/* KEY GENERATOR DRAWER FOR ACTIVE SELECTION */}
            {editingCardId && (
              <div className="p-6 rounded-2xl border text-left space-y-6 shadow-2xl animate-slideDown bg-emerald-50/20 dark:bg-zinc-950 border-emerald-500/20 dark:border-emerald-500/30">
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
                <div className="p-5 rounded-xl border space-y-4 bg-white dark:bg-zinc-900 border-zinc-100 dark:border-zinc-800">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-emerald-500" />
                    <p className="font-bold text-xs uppercase tracking-wider font-mono">Format Stock Keys Auto-Generator</p>
                  </div>

                  <div className="grid gap-4">
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">Code Format / Layout</label>
                      <input 
                        type="text" 
                        value={genFormat}
                        onChange={(e) => setGenFormat(e.target.value)}
                        placeholder="XXXX-XXXX-XXXX"
                        className="w-full p-2 rounded text-xs outline-none border font-mono bg-zinc-50 dark:bg-zinc-950 border-zinc-100 dark:border-zinc-800 text-zinc-900 dark:text-white"
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
                        className="w-full p-2 rounded text-xs outline-none border font-mono uppercase bg-zinc-50 dark:bg-zinc-950 border-zinc-100 dark:border-zinc-800 text-zinc-900 dark:text-white"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">Quantity to Inject</label>
                      <input 
                        type="number" 
                        value={genQuantity}
                        onChange={(e) => setGenQuantity(e.target.value)}
                        placeholder="10"
                        className="w-full p-2 rounded text-xs outline-none border font-mono bg-zinc-50 dark:bg-zinc-950 border-zinc-100 dark:border-zinc-800 text-zinc-900 dark:text-white"
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
                    className="w-full p-4 rounded-xl text-xs outline-none border font-mono bg-white dark:bg-zinc-900 border-zinc-100 dark:border-zinc-800 text-zinc-900 dark:text-zinc-300 focus:border-zinc-200 dark:focus:border-zinc-805"
                  />
                </div>

                <div className="flex gap-3 justify-end pt-2">
                  <button 
                    onClick={() => setEditingCardId(null)}
                    className="px-4 py-2 rounded-lg text-xs font-bold font-mono uppercase border bg-zinc-100 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border-zinc-100 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  >
                    Cancel
                  </button>
                  <button 
                    // onClick={saveCodesToDatabase}
                    className="px-6 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold font-mono uppercase tracking-wider shadow-md flex items-center gap-1.5"
                    id="btn-save-key-pool"
                  >
                    <Save className="w-4 h-4" /> Save Key Pool
                  </button>
                </div>
              </div>
            )}
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
                  className={`w-full pl-9 pr-3 py-2 rounded-lg text-xs outline-none border bg-white dark:bg-zinc-900 border-zinc-100 dark:border-zinc-800 text-zinc-900 dark:text-white focus:border-zinc-200 dark:focus:border-zinc-800`}
                />
              </div>
            </div>

            {/* PRODUCT CARD GRID LIST */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredProducts.slice(curr*perPage,curr*perPage+perPage).map(card => {
                const isSelected = editingCardId === card.id;
                return (
                  <div key={card.id} className={`p-5 rounded-2xl border transition-all relative ${
                    isSelected 
                      ? 'bg-zinc-100 dark:bg-zinc-950 border-neutral-50 dark:border-zinc-900/50'
                      : 'border-zinc-100 dark:hover:border-zinc-800 shadow-md'
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
                          className="p-2 rounded-lg border transition-colors bg-zinc-50 dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 border-zinc-100 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300"
                          title="Generate or edit codes"
                        >
                          <Key className="w-3.5 h-3.5" />
                        </button>
                        <button 
                          onClick={() => handleDeleteProduct(card.id, card.brand)}
                          className="p-2 rounded-lg border hover:bg-red-500/15 text-red-500 transition-colors bg-zinc-50 dark:bg-zinc-900 border-zinc-100 dark:border-zinc-800"
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

            <ul className='mt-12 mx-auto w-full h-fit flex gap-2 justify-center'>
            <li className='p-2 bg-gray-100 w-fit rounded-md' onClick={()=>setCurr(prev=>prev > 0 ? prev-1 : prev)}>
              <ChevronLeft className="w-4 h-4"/>
              </li>
            {[...Array(totalPages)].map((i,idx)=>(
              <button key={i} onClick={()=>setCurr(idx)}>
              <li className={`p-2 bg-gray-50 w-fit rounded-md text-neutral-600 text-xs ${curr == idx && "text-black font-bold text-lg"}`}>{idx}</li>
            </button>
            ))
          }
          <li className='p-2 bg-gray-100 w-fit rounded-md' onClick={()=>setCurr(prev=>prev < totalPages -1 ? prev+1 : prev)} ><ChevronRight className="w-4 h-4"/></li>
          </ul>
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

          <div className="rounded-2xl border overflow-hidden shadow-xl bg-white dark:bg-zinc-950 border-zinc-100 dark:border-zinc-900/50">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className={"dark:bg-zinc-900/20  dark:border-zinc-900/50 bg-zinc-50 border-b border-zinc-100"}>
                  <tr>
                    <th className="px-6 py-4 text-[10px] font-mono tracking-wider font-bold uppercase text-zinc-400 dark:text-zinc-500">Receipt ID / User</th>
                    <th className="px-6 py-4 text-[10px] font-mono tracking-wider font-bold uppercase text-zinc-400 dark:text-zinc-500">Method</th>
                    <th className="px-6 py-4 text-[10px] font-mono tracking-wider font-bold uppercase text-zinc-400 dark:text-zinc-500">Amount Request</th>
                    <th className="px-6 py-4 text-[10px] font-mono tracking-wider font-bold uppercase text-zinc-400 dark:text-zinc-500">Status</th>
                    <th className="px-6 py-4 text-[10px] font-mono tracking-wider font-bold uppercase text-zinc-400 dark:text-zinc-500 text-right">Review Hooks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100/80 dark:divide-zinc-900/35">
                  {pendingDeposits?.map(tx => (
                    <tr key={tx.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/10">
                      <td className="px-6 py-5">
                        <p className="font-bold text-sm text-zinc-900 dark:text-white">{tx.userId.email || 'Client ID: ' + tx.userId._id.substring(0, 8)}</p>
                        <p className="text-[10px] text-zinc-400 font-mono mt-0.5">Tx ID: {tx.trxid}</p>
                        <p className="text-[9px] text-zinc-500 mt-0.5">{tx.createdAt ? format(new Date(tx.createdAt), 'MMM dd, yyyy HH:mm') : ''}</p>
                      </td>
                      <td className="px-6 py-5">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold uppercase font-mono border
                          bg-amber-500/10 border-amber-500/20 text-amber-500
                        `}>
                          Crypto
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
                              onClick={() => handleDeposit(tx,"completed")}
                              className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-mono font-bold text-[10px] uppercase tracking-wider transition-all shadow-md inline-flex items-center gap-1"
                              id={`btn-approve-tx-${tx.id}`}
                            >
                              <CheckCircle className="w-3.5 h-3.5" /> Authorize
                            </button>
                            <button
                              onClick={() => handleDeposit(tx,rejected)}
                              className="px-3.5 py-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-mono font-bold text-[10px] uppercase tracking-wider inline-flex items-center gap-1"
                              id={`btn-decline-tx-${tx._id}`}
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

          <form onSubmit={handleSavePayments} className={`p-8 rounded-2xl border space-y-6 shadow-xl dark:bg-zinc-950 dark:border-zinc-900/50 bg-white border-zinc-100
          `}>
            

            {/* Crypto USDT/BTC Routing */}
            <div className="space-y-4 pb-6 border-b border-zinc-100 dark:border-zinc-900/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-500 font-black font-mono text-xs">B</div>
                  <div>
                    <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">Gateway Option</h4>
                    <p className="text-[10px] text-zinc-500 font-mono">Decentralized Blockchain Payments</p>
                  </div>
                </div>
               
              </div>
              {paymentsConfig.map((p)=>(
                <div className="grid grid-cols-1 gap-3 pl-10">
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold uppercase tracking-widest text-zinc-500">{p?.network}</label>
  
                  </div>
                  <div className="space-y-1">
                    {/* <label className="text-[9px] font-bold uppercase tracking-widest text-zinc-500">Network Wallet Address (USDT TRC20/ERC20/BTC)</label> */}
                    <input 
                      type="text" 
                      value={p.address}
                      onChange={(e) => setPaymentsConfig(prev => prev.map((m)=>m.network === p.network ? {...m , address : e.target.value } : m))}
                      className={`w-full p-2.5 rounded-xl text-xs font-mono outline-none border ${
                        isDark ? 'bg-zinc-900 border-zinc-800 text-emerald-400' : 'bg-zinc-50 border-zinc-100 text-emerald-700'
                      }`}
                    />
                  </div>
                </div>
              ))}
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
              <thead className="bg-zinc-50 dark:bg-zinc-900/20 border-b border-zinc-100 dark:border-zinc-101">
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
                  <tr key={sub.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/10">
                    <td className="px-6 py-5 font-bold font-mono text-xs">{sub.userId ? sub.userId.substring(0, 16) + '...' : 'System'}</td>
                    <td className="px-6 py-5">
                      <p className="font-bold text-sm text-zinc-900 dark:text-white">{sub.fileName || 'Virtual Transfer Raw'}</p>
                      <p className="text-[10px] font-mono text-zinc-405 dark:text-zinc-500">{(sub.fileSize / 1024).toFixed(2)} KB</p>
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
                    <td className="px-6 py-5 text-xs font-mono text-zinc-500 dark:text-zinc-400">
                      {sub.timestamp ? format(new Date(sub.timestamp), 'MMM dd, yyyy HH:mm') : 'Unset'}
                    </td>
                    <td className="px-6 py-5 text-right">
                      <button 
                        onClick={() => handleSubmissionReview(sub)}
                        className="px-3 py-1.5 rounded-lg text-xs font-mono font-bold uppercase border hover:bg-zinc-800/10 text-amber-600 dark:text-amber-500 border-zinc-100 dark:border-zinc-800"
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
const TabButton = ({ children, active, onClick, isDark, id }) => (
  <button 
    onClick={onClick}
    id={id}
    className={`px-5 py-3 rounded-xl text-xs font-extrabold uppercase tracking-widest flex items-center gap-2 transition-all shrink-0 font-sans ${
      active 
        ? 'bg-white dark:bg-zinc-900 text-black dark:text-white border border-zinc-100 dark:border-zinc-800 shadow-sm dark:shadow-md'
        : 'text-zinc-400 dark:text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-350'
    }`}
  >
    {children}
  </button>
);
