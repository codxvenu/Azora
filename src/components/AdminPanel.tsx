import React, { useState, useEffect } from 'react';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, onSnapshot, doc, updateDoc, addDoc } from 'firebase/firestore';
import { Submission } from '../types';
import { format } from 'date-fns';
import { Plus } from 'lucide-react';
import { useNotification } from '../lib/useNotification';

interface AdminPanelProps {
  onBack: () => void;
  isDark?: boolean;
}

export const AdminPanel = ({ onBack, isDark }: AdminPanelProps) => {
  const { showNotification } = useNotification();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [activeTab, setActiveTab] = useState<'submissions' | 'inventory' | 'orders'>('submissions');

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'submissions'), (snapshot) => {
      setSubmissions(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Submission)));
    });
    return () => unsub();
  }, []);

  const handleReview = async (sub: Submission) => {
    const valid = prompt('Enter valid percentage (0-100):', '100');
    const value = prompt('Enter estimated value ($):', '50');
    if (valid === null || value === null) return;

    try {
      await updateDoc(doc(db, 'submissions', sub.id), {
        status: 'checked',
        validPercentage: Number(valid),
        estimatedValue: Number(value)
      });
      showNotification('Submission updated.', 'success');
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, 'submissions');
    }
  };

  const handleAddCard = async () => {
    const brand = prompt('Brand Name:');
    const price = prompt('Real Price ($):');
    const discount = prompt('Discount (%):');
    const category = prompt('Category:');
    if (!brand || !price || !discount || !category) return;

    const finalPrice = Number(price) * (1 - Number(discount) / 100);

    try {
      await addDoc(collection(db, 'giftCards'), {
        brand,
        realPrice: Number(price),
        discount: Number(discount),
        finalPrice,
        category,
        image: `https://picsum.photos/seed/${brand}/400/300`,
        inventoryCount: 100,
        description: `Premium ${brand} gift card.`
      });
      showNotification('Gift card added.', 'success');
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'giftCards');
    }
  };

  const handleSeedDemoData = async () => {
    try {
      const extraCards = [
        { brand: 'Steam', category: 'Gaming', realPrice: 50, discount: 10, finalPrice: 45, image: 'https://picsum.photos/seed/steam/400/300', inventoryCount: 100, description: 'Steam Wallet funds.' },
        { brand: 'Spotify', category: 'Music', realPrice: 30, discount: 0, finalPrice: 30, image: 'https://picsum.photos/seed/spotify/400/300', inventoryCount: 50, description: 'Spotify Premium subscription.' },
        { brand: 'Xbox', category: 'Gaming', realPrice: 25, discount: 20, finalPrice: 20, image: 'https://picsum.photos/seed/xbox/400/300', inventoryCount: 40, description: 'Xbox Live and Game Pass.' }
      ];
      for (const card of extraCards) {
        await addDoc(collection(db, 'giftCards'), card);
      }

      const mockSubmissions = [
        { userId: 'demo-user-1', fileName: 'codes_batch_01.txt', fileSize: 1024, status: 'pending', timestamp: new Date().toISOString(), codes: 'ABC-123\nDEF-456' },
        { userId: 'demo-user-2', fileName: 'amazon_cards.csv', fileSize: 2048, status: 'checked', validPercentage: 85, estimatedValue: 120, timestamp: new Date().toISOString(), codes: 'GHI-789' }
      ];
      for (const sub of mockSubmissions) {
        await addDoc(collection(db, 'submissions'), sub);
      }

      showNotification('Demo data seeded successfully!', 'success');
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'demo-seeding');
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-2 text-left">
          <h2 className="text-4xl font-display font-black tracking-tighter">ADMIN PANEL</h2>
          <p className={isDark ? 'text-zinc-400' : 'text-zinc-500'}>Manage marketplace operations and inventory.</p>
        </div>
        <div className="flex items-center gap-4 flex-wrap">
          <button 
            onClick={handleSeedDemoData}
            className={`text-xs font-bold font-mono uppercase tracking-wider transition-colors ${
              isDark ? 'text-zinc-500 hover:text-white' : 'text-zinc-400 hover:text-black'
            }`}
          >
            Seed Demo Data
          </button>
          <div className={`flex gap-2 p-1.5 rounded-xl border ${isDark ? 'bg-zinc-950 border-zinc-900' : 'bg-zinc-100/50 border-zinc-200'}`}>
            <TabButton active={activeTab === 'submissions'} onClick={() => setActiveTab('submissions')} isDark={isDark}>Submissions</TabButton>
            <TabButton active={activeTab === 'inventory'} onClick={() => setActiveTab('inventory')} isDark={isDark}>Inventory</TabButton>
            <TabButton active={activeTab === 'orders'} onClick={() => setActiveTab('orders')} isDark={isDark}>Orders</TabButton>
          </div>
        </div>
      </div>

      {activeTab === 'submissions' && (
        <div className={`rounded-[1.25rem] border overflow-hidden shadow-2xl ${
          isDark ? 'bg-zinc-950 border-zinc-900 shadow-black/40' : 'bg-white border-zinc-100 shadow-zinc-100/50'
        }`}>
          <table className="w-full text-left">
            <thead className={isDark ? 'bg-zinc-900/40 border-b border-zinc-900' : 'bg-zinc-50 border-b border-zinc-100'}>
              <tr>
                <th className={`px-8 py-4 text-[10px] font-mono tracking-wider font-bold uppercase ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>User</th>
                <th className={`px-8 py-4 text-[10px] font-mono tracking-wider font-bold uppercase ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>File/Type</th>
                <th className={`px-8 py-4 text-[10px] font-mono tracking-wider font-bold uppercase ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>Status</th>
                <th className={`px-8 py-4 text-[10px] font-mono tracking-wider font-bold uppercase ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>Date</th>
                <th className={`px-8 py-4 text-[10px] font-mono tracking-wider font-bold uppercase ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>Action</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isDark ? 'divide-zinc-900/60' : 'divide-zinc-50'}`}>
              {submissions.map(sub => (
                <tr key={sub.id} className={isDark ? 'hover:bg-zinc-900/20' : 'hover:bg-zinc-50/50'}>
                  <td className="px-8 py-6 font-bold text-sm">{sub.userId.substring(0, 8)}...</td>
                  <td className="px-8 py-6">
                    <p className="font-bold text-sm">{sub.fileName}</p>
                    <p className={`text-[10px] font-mono ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>{(sub.fileSize / 1024).toFixed(2)} KB</p>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                      sub.status === 'pending' 
                        ? (isDark ? 'bg-amber-950/20 text-amber-400 border-amber-900/30' : 'bg-amber-50 text-amber-600 border-amber-100')
                        : (isDark ? 'bg-zinc-900 text-zinc-400 border-zinc-800' : 'bg-zinc-105 text-zinc-650 border-zinc-200')
                    }`}>
                      {sub.status}
                    </span>
                  </td>
                  <td className={`px-8 py-6 text-xs ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>{format(new Date(sub.timestamp), 'MMM dd')}</td>
                  <td className="px-8 py-6">
                    <button 
                      onClick={() => handleReview(sub)}
                      className="text-amber-500 font-bold text-xs hover:underline"
                    >
                      Review
                    </button>
                  </td>
                </tr>
              ))}
              {submissions.length === 0 && (
                <tr>
                  <td colSpan={5} className={`text-center py-12 text-sm ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>No submissions to display.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'inventory' && (
        <div className="space-y-6 text-left">
          <button 
            onClick={handleAddCard} 
            className={`px-8 py-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:scale-105 transition-all ${
              isDark ? 'bg-white text-zinc-950 hover:bg-zinc-100' : 'bg-zinc-950 text-white hover:bg-zinc-850'
            }`}
          >
            <Plus className="w-4 h-4" /> Add New Gift Card
          </button>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <p className={isDark ? 'text-zinc-500 italic text-sm' : 'text-zinc-400 italic text-sm'}>Inventory management list is active (use prompt shortcut above to append dynamic items directly to live database).</p>
          </div>
        </div>
      )}

      {activeTab === 'orders' && (
        <div className={`p-8 rounded-[1.25rem] text-center italic text-sm border ${
          isDark ? 'bg-zinc-950 text-zinc-500 border-zinc-900' : 'bg-white text-zinc-400 border-zinc-100'
        }`}>
          Live administration ledger is monitored under the Main Orders database viewport.
        </div>
      )}
    </div>
  );
};

const TabButton = ({ children, active, onClick, isDark }: { children: React.ReactNode, active: boolean, onClick: () => void, isDark?: boolean }) => (
  <button 
    onClick={onClick}
    className={`px-6 py-2 rounded-xl text-xs font-bold transition-all ${
      active 
        ? (isDark ? 'bg-zinc-900 text-white shadow-lg' : 'bg-white text-black shadow-sm') 
        : (isDark ? 'text-zinc-500 hover:text-zinc-300' : 'text-zinc-400 hover:text-zinc-600')
    }`}
  >
    {children}
  </button>
);
