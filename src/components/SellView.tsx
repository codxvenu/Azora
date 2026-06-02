import React, { useState } from 'react';
import { useAuth } from '../lib/useAuth';
import { useNotification } from '../lib/useNotification';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { Upload, ShieldCheck } from 'lucide-react';

interface SellViewProps {
  onBack: () => void;
  isDark?: boolean;
}

export const SellView = ({ onBack, isDark }: SellViewProps) => {
  const { user } = useAuth();
  const { showNotification } = useNotification();
  const [codes, setCodes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!user) {
      showNotification('Please login to sell your codes.', 'error');
      return;
    }
    if (!codes.trim()) return;
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'submissions'), {
        userId: user.uid,
        fileName: 'Manual Paste',
        fileSize: codes.length,
        status: 'pending',
        timestamp: new Date().toISOString(),
        codes: codes
      });
      showNotification('Submission successful! Admin will review your codes shortly.', 'success');
      setCodes('');
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'submissions');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-12">
      <div className="text-center space-y-4">
        <h2 className="text-4xl sm:text-5xl font-display font-black tracking-tighter uppercase">SELL YOUR CODES</h2>
        <p className={isDark ? 'text-zinc-400' : 'text-zinc-500'}>Turn your unused gift cards into instant cash.</p>
      </div>

      <div className={`rounded-[1.25rem] p-6 sm:p-10 border space-y-8 shadow-2xl transition-all duration-300 ${
        isDark ? 'bg-zinc-950/60 border-zinc-900 shadow-black' : 'bg-white border-zinc-200 shadow-zinc-200/50'
      }`}>
        <div className="space-y-4 text-left">
          <label className={`text-xs font-bold uppercase tracking-widest ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>
            Paste your codes here
          </label>
          <textarea 
            value={codes}
            onChange={(e) => setCodes(e.target.value)}
            placeholder="Enter one code per line..."
            className={`w-full h-56 p-5 rounded-2xl outline-none transition-all font-mono text-sm border ${
              isDark 
                ? 'bg-zinc-900 border-zinc-800 text-white focus:ring-2 focus:ring-zinc-700' 
                : 'bg-zinc-50 border-zinc-200 focus:ring-2 focus:ring-black'
            }`}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className={`p-5 rounded-2xl border text-left space-y-2 ${isDark ? 'bg-zinc-900/40 border-zinc-900' : 'bg-zinc-50 border-zinc-150'}`}>
            <Upload className="w-5 h-5 text-zinc-400" />
            <p className="font-bold text-sm">Bulk Upload</p>
            <p className={`text-xs ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>Support for .txt, .csv, .json files</p>
          </div>
          <div className={`p-5 rounded-2xl border text-left space-y-2 ${isDark ? 'bg-zinc-900/40 border-zinc-900' : 'bg-zinc-50 border-zinc-150'}`}>
            <ShieldCheck className="w-5 h-5 text-zinc-400" />
            <p className="font-bold text-sm">Secure Verification</p>
            <p className={`text-xs ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>All entries are encrypted in transit</p>
          </div>
        </div>

        <button 
          onClick={handleSubmit}
          disabled={isSubmitting || !codes.trim()}
          className={`w-full py-4.5 rounded-xl font-bold text-lg hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-40 ${
            isDark ? 'bg-white text-zinc-950 hover:bg-zinc-100' : 'bg-black text-white hover:bg-zinc-850'
          }`}
        >
          {isSubmitting ? 'Submitting...' : 'Submit for Review'}
        </button>
      </div>
    </div>
  );
};
