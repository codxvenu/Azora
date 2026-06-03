import React, { useState, useEffect } from 'react';
import { useAuth } from '../lib/useAuth';
import { useNotification } from '../lib/useNotification';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, addDoc, onSnapshot, query, where, deleteDoc, doc } from 'firebase/firestore';
import { 
  Upload, 
  ShieldCheck, 
  TrendingUp, 
  Layers, 
  Trash2, 
  Sparkles,
  Database,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Submission } from '../types';

interface SellViewProps {
  onBack: () => void;
  isDark?: boolean;
}

const DEMO_PLACEHOLDER = `Example Template:
[Brand]: Amazon USA Gift Card
[Value]: $50.00
[Offering Discount]: 10% (You get: $45.00)
[Keys / Codes]:
AMZN-GIFT-4892-0192-3849
AMZN-GIFT-1830-2910-3840

---------------------------------------------------
[Brand]: Elden Ring: Shadow of the Erdtree Steam PC
[Value]: $40.00
[Offering Discount]: 15% (You get: $34.00)
[Keys / Codes]:
ELDEN-SHA-9281-WKER-9280`;

export const SellView = ({ onBack, isDark }: SellViewProps) => {
  const { user } = useAuth();
  const { showNotification } = useNotification();
  const [codes, setCodes] = useState('');
  const [brand, setBrand] = useState('Amazon USA Gift Card');
  const [faceValue, setFaceValue] = useState('50.00');
  const [discountPercent, setDiscountPercent] = useState('10');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mySubmissions, setMySubmissions] = useState<Submission[]>([]);
  const [isLoadingSubmissions, setIsLoadingSubmissions] = useState(true);

  // Fetch submitted listings
  useEffect(() => {
    if (!user) {
      setIsLoadingSubmissions(false);
      return;
    }

    const q = query(
      collection(db, 'submissions'),
      where('userId', '==', user.uid)
    );

    const unsub = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as unknown as Submission));
      // Sort newest first
      items.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      setMySubmissions(items);
      setIsLoadingSubmissions(false);
    }, (err) => {
      console.error(err);
      setIsLoadingSubmissions(false);
    });

    return () => unsub();
  }, [user]);

  const handleSubmit = async () => {
    if (!user) {
      showNotification('Please sign in to register as a seller.', 'error');
      return;
    }
    if (!codes.trim()) {
      showNotification('Please paste at least one valid key/code.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      // Calculate parsed values
      const val = parseFloat(faceValue) || 50;
      const disc = parseFloat(discountPercent) || 10;
      const payout = val * (1 - disc / 100);

      const codesArray = codes
        .split('\n')
        .map(c => c.trim())
        .filter(c => c.length > 0);

      await addDoc(collection(db, 'submissions'), {
        userId: user.uid,
        brandName: brand || 'Generic Voucher',
        faceValue: val,
        discountRate: disc,
        payoutValue: parseFloat(payout.toFixed(2)),
        fileName: 'Instant Digital Input',
        fileSize: codesArray.length,
        status: 'pending',
        timestamp: new Date().toISOString(),
        codes: codes
      });

      showNotification('Listing successfully created! Our ledger bots are verifying status.', 'success');
      setCodes('');
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'submissions');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteListing = async (listingId: string) => {
    try {
      await deleteDoc(doc(db, 'submissions', listingId));
      showNotification('Listing draft withdrawn successfully.', 'success');
    } catch (err) {
      showNotification('Failed to delete listing draft.', 'error');
    }
  };

  // Stock Analytics calculations
  const totalSubmissions = mySubmissions.length;
  const pendingCount = mySubmissions.filter(s => s.status === 'pending').length;
  const approvedCount = mySubmissions.filter(s => s.status === 'accepted' || s.status === 'checked').length;
  const totalCodesLive = mySubmissions.reduce((acc, curr) => acc + (curr.fileSize || 1), 0);
  
  // Calculate potential revenue
  const totalPayoutPending = mySubmissions
    .filter(s => s.status === 'pending')
    .reduce((acc, curr: any) => acc + (curr.estimatedValue || 0), 0);
  
  const totalEarnedApproved = mySubmissions
    .filter(s => s.status === 'accepted' || s.status === 'checked')
    .reduce((acc, curr: any) => acc + (curr.estimatedValue || 0), 0);

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      {/* Header Panel */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-xs font-mono font-bold uppercase tracking-wider text-amber-500">
          <Sparkles className="w-3.5 h-3.5 fill-amber-500/10" /> Authorized Merchant Hub
        </div>
        <h2 className="text-4xl sm:text-5xl font-display font-black tracking-tighter uppercase">Seller Dashboard</h2>
        <p className={`text-sm ${isDark ? 'text-zinc-500' : 'text-stone-500'}`}>
          Directly register digital licenses, vouchers, or keys onto AURA global pool standard.
        </p>
      </div>

      {/* Selling Form Card */}
      <div className={`rounded-[1.5rem] p-6 sm:p-8 border border-zinc-200/50 dark:border-zinc-800/40 space-y-6 shadow-2xl transition-all duration-300 ${
        isDark ? 'bg-zinc-950/40 border-zinc-900 shadow-black' : 'bg-white shadow-zinc-200/30'
      }`}>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1">
            <label className="text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-500">Asset / Brand Template</label>
            <input 
              type="text" 
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              placeholder="e.g. Steam Wallet Gift Card"
              className={`w-full p-3.5 rounded-xl outline-none font-medium text-sm border transition-colors ${
                isDark ? 'bg-zinc-900/60 border-zinc-800 focus:border-zinc-700 text-white' : 'bg-zinc-50/60 border-zinc-100 focus:border-zinc-300 text-zinc-900'
              }`}
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-500">Face Value ($)</label>
            <input 
              type="number" 
              value={faceValue}
              onChange={(e) => setFaceValue(e.target.value)}
              placeholder="50.00"
              className={`w-full p-3.5 rounded-xl outline-none font-medium text-sm border transition-colors ${
                isDark ? 'bg-zinc-900/60 border-zinc-800 focus:border-zinc-700 text-white' : 'bg-zinc-50/60 border-zinc-100 focus:border-zinc-300 text-zinc-900'
              }`}
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-500">Ask Discount (%)</label>
            <input 
              type="number" 
              value={discountPercent}
              onChange={(e) => setDiscountPercent(e.target.value)}
              placeholder="10"
              className={`w-full p-3.5 rounded-xl outline-none font-medium text-sm border transition-colors ${
                isDark ? 'bg-zinc-900/60 border-zinc-800 focus:border-zinc-700 text-white' : 'bg-zinc-50/60 border-zinc-100 focus:border-zinc-300 text-zinc-900'
              }`}
            />
          </div>
        </div>

        <div className="space-y-2 text-left">
          <div className="flex justify-between items-center">
            <label className="text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-500">
              Bulk Paste Activation codes
            </label>
            <span className="text-[8px] font-mono uppercase bg-amber-500/10 px-1.5 py-0.5 rounded text-amber-500 font-black">
              ONE KEY PER LINE
            </span>
          </div>
          <textarea 
            value={codes}
            onChange={(e) => setCodes(e.target.value)}
            placeholder={DEMO_PLACEHOLDER}
            className={`w-full h-64 p-5 rounded-2xl outline-none transition-all font-mono text-xs border leading-relaxed ${
              isDark 
                ? 'bg-zinc-900 border-zinc-850 text-amber-100 focus:ring-1 focus:ring-zinc-700 focus:bg-zinc-900/80' 
                : 'bg-[#fafafa] border-zinc-100 focus:ring-1 focus:ring-black focus:bg-white text-zinc-850'
            }`}
          />
        </div>

        {/* Form Footer info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className={`p-4 rounded-xl text-left flex items-start gap-3 transition-colors duration-300 ${isDark ? 'bg-zinc-900/40 text-zinc-400' : 'bg-zinc-100/30'}`}>
            <Upload className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" />
            <div>
              <p className="font-bold text-xs text-zinc-800 dark:text-zinc-200">Continuous Verification</p>
              <p className="text-[10px] leading-relaxed">Our smart validators parse, normalize, and match your license numbers instantly against official databases.</p>
            </div>
          </div>
          <div className={`p-4 rounded-xl text-left flex items-start gap-3 transition-colors duration-300 ${isDark ? 'bg-zinc-900/40 text-zinc-400' : 'bg-zinc-100/30'}`}>
            <ShieldCheck className="w-5 h-5 text-emerald-500 mt-0.5 shrink-0" />
            <div>
              <p className="font-bold text-xs text-zinc-800 dark:text-zinc-200">Merchant Safety escrow</p>
              <p className="text-[10px] leading-relaxed">Payments are credited directly to your digital ledger wallet immediately upon buyer checkout validation.</p>
            </div>
          </div>
        </div>

        <button 
          onClick={handleSubmit}
          disabled={isSubmitting || !codes.trim()}
          className={`w-full py-4.5 rounded-xl font-mono text-xs font-bold uppercase tracking-widest hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-30 ${
            isDark ? 'bg-white text-zinc-950 hover:bg-zinc-150' : 'bg-black text-white hover:bg-zinc-900'
          }`}
        >
          {isSubmitting ? 'Verifying codes...' : 'List in AURA Pool'}
        </button>
      </div>

      {/* Stock Statistics Dashboard */}
      <div className="space-y-6 pt-4 text-left">
        <div>
          <h3 className="text-xl font-display font-black tracking-tight uppercase flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-amber-500" /> Stock Volume Statistics
          </h3>
          <p className={`text-xs ${isDark ? 'text-zinc-500' : 'text-stone-500'}`}>Live status of your registered stock pool inventory & verification status.</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className={`p-5 rounded-2xl border ${isDark ? 'bg-zinc-950/20 border-zinc-900' : 'bg-white border-zinc-200/50'}`}>
            <p className="text-[10px] font-mono tracking-wider text-zinc-400 font-bold uppercase">Total Listings</p>
            <p className="text-2xl font-black font-mono tracking-tight mt-1">{totalSubmissions}</p>
            <p className="text-[8px] font-mono text-zinc-500 uppercase mt-1">Pool requests</p>
          </div>
          <div className={`p-5 rounded-2xl border ${isDark ? 'bg-zinc-950/20 border-zinc-900' : 'bg-white border-zinc-200/50'}`}>
            <p className="text-[10px] font-mono tracking-wider text-zinc-400 font-bold uppercase">Activation Keys</p>
            <p className="text-2xl font-black font-mono tracking-tight text-amber-500 mt-1">{totalCodesLive}</p>
            <p className="text-[8px] font-mono text-zinc-500 uppercase mt-1">Total items registered</p>
          </div>
          <div className={`p-5 rounded-2xl border ${isDark ? 'bg-zinc-950/20 border-zinc-900' : 'bg-white border-zinc-200/50'}`}>
            <p className="text-[10px] font-mono tracking-wider text-zinc-400 font-bold uppercase">Pending Escrow</p>
            <p className="text-2xl font-black font-mono tracking-tight mt-1">${totalPayoutPending.toFixed(2)}</p>
            <p className="text-[8px] font-mono text-amber-500 font-bold uppercase mt-1">{pendingCount} Awaiting verification</p>
          </div>
          <div className={`p-5 rounded-2xl border ${isDark ? 'bg-zinc-950/20 border-zinc-900' : 'bg-white border-zinc-200/50'}`}>
            <p className="text-[10px] font-mono tracking-wider text-zinc-400 font-bold uppercase">Total Earned</p>
            <p className="text-2xl font-black font-mono tracking-tight text-emerald-500 mt-1">${totalEarnedApproved.toFixed(2)}</p>
            <p className="text-[8px] font-mono text-emerald-500 font-bold uppercase mt-1">{approvedCount} Liquidated items</p>
          </div>
        </div>
      </div>

      {/* Stock & Added Items Manager */}
      <div className="space-y-6 pt-4 text-left">
        <h3 className="text-xl font-display font-black tracking-tight uppercase flex items-center gap-2">
          <Layers className="w-5 h-5 text-amber-500" /> Manage Added Items
        </h3>

        {isLoadingSubmissions ? (
          <div className="py-10 text-center text-zinc-500 font-mono text-xs">
            <span className="inline-block w-4 h-4 rounded-full border-2 border-t-transparent border-amber-500 animate-spin mr-2" />
            Loading registry ledger...
          </div>
        ) : !user ? (
          <div className={`py-12 text-center rounded-2xl border border-dashed ${
            isDark ? 'bg-zinc-950/10 border-zinc-900 text-zinc-500' : 'bg-zinc-50/50 border-zinc-200 text-zinc-400'
          }`}>
            <Database className="w-8 h-8 mx-auto text-zinc-500/40 mb-3" />
            <p className="text-sm font-bold">Seller session inactive</p>
            <p className="text-xs max-w-sm mx-auto mt-1">Please sign in to register as a merchant and manage your pool storage.</p>
          </div>
        ) : mySubmissions.length === 0 ? (
          <div className={`py-12 text-center rounded-2xl border border-dashed ${
            isDark ? 'bg-zinc-950/10 border-zinc-900 text-zinc-500' : 'bg-zinc-50/50 border-zinc-200 text-zinc-400'
          }`}>
            <Database className="w-8 h-8 mx-auto text-zinc-500/40 mb-3" />
            <p className="text-sm font-bold">No active stock listed</p>
            <p className="text-xs max-w-sm mx-auto mt-1">Enter codes above and click "List in AURA Pool" to see your inventory manifest here.</p>
          </div>
        ) : (
          <div className={`rounded-2xl border overflow-hidden ${
            isDark ? 'bg-zinc-950/10 border-zinc-900' : 'bg-white border-zinc-200/55'
          }`}>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse font-mono text-xs">
                <thead>
                  <tr className={`border-b font-mono font-black uppercase text-[9px] tracking-wider text-zinc-400 ${
                    isDark ? 'bg-zinc-900/30 border-zinc-900' : 'bg-zinc-50/60 border-zinc-200/40'
                  }`}>
                    <th className="p-4">Brand Asset</th>
                    <th className="p-4">Timestamp</th>
                    <th className="p-4 text-center">Codes</th>
                    <th className="p-4">Face Value</th>
                    <th className="p-4">Payout</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-center">Withdraw</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200/10 dark:divide-zinc-900/50 font-medium">
                  {mySubmissions.map((sub: any) => (
                    <tr key={sub.id} className={`hover:bg-zinc-500/5 transition-colors`}>
                      <td className="p-4">
                        <span className="font-bold text-zinc-900 dark:text-zinc-100">{sub.brandName || sub.fileName || 'Activation Key Listing'}</span>
                      </td>
                      <td className="p-4 text-zinc-500">
                        {new Date(sub.timestamp).toLocaleDateString()}
                      </td>
                      <td className="p-4 text-center font-bold text-amber-500">
                        x{sub.fileSize || 1}
                      </td>
                      <td className="p-4 text-zinc-500">
                        ${(sub.faceValue || 50).toFixed(2)}
                      </td>
                      <td className="p-4 font-bold text-zinc-900 dark:text-zinc-50">
                        ${(sub.payoutValue || sub.faceValue * 0.9 || 45).toFixed(2)}
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                          sub.status === 'pending'
                            ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                            : 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${sub.status === 'pending' ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'}`} />
                          {sub.status}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <button 
                          onClick={() => handleDeleteListing(sub.id)}
                          className={`p-1.5 rounded-lg border hover:bg-red-500/10 hover:border-red-500/30 text-zinc-500 hover:text-red-500 transition-colors ${
                            isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-zinc-50 border-zinc-200'
                          }`}
                          title="Withdraw Listing"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
