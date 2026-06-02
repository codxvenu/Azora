import React from 'react';
import { User as UserIcon, ShieldCheck } from 'lucide-react';
import { format } from 'date-fns';

interface ProfileViewProps {
  profile: any;
  onBack: () => void;
  isDark?: boolean;
}

export const ProfileView = ({ profile, onBack, isDark }: ProfileViewProps) => {
  return (
    <div className="max-w-2xl mx-auto space-y-12">
      <div className="text-center space-y-4">
        <div className={`w-24 h-24 rounded-3xl mx-auto flex items-center justify-center border-4 shadow-xl ${
          isDark ? 'bg-zinc-900 border-zinc-950 text-white' : 'bg-zinc-100 border-white text-zinc-400'
        }`}>
          <UserIcon className="w-10 h-10 text-zinc-400" />
        </div>
        <h2 className="text-3xl sm:text-4xl font-display font-black tracking-tighter uppercase">
          {profile?.displayName || 'User Profile'}
        </h2>
        <p className={isDark ? 'text-zinc-500' : 'text-zinc-400'}>{profile?.email}</p>
      </div>

      <div className={`rounded-[1.25rem] border p-6 sm:p-8 space-y-8 shadow-2xl transition-all duration-300 ${
        isDark ? 'bg-zinc-950 border-zinc-900 text-white' : 'bg-white border-zinc-200 text-zinc-950'
      }`}>
        <div className={`flex items-center justify-between p-5 rounded-2xl border ${
          isDark ? 'bg-zinc-900/30 border-zinc-900/60' : 'bg-zinc-50 border-zinc-150'
        }`}>
          <div className="flex items-center gap-4 text-left">
            <ShieldCheck className="w-6 h-6 text-zinc-400" />
            <div>
              <p className="font-bold text-sm">Two-Factor Authentication</p>
              <p className={`text-xs ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>Secure your balance and orders</p>
            </div>
          </div>
          <button className={`px-4 py-2 rounded-xl text-xs font-bold font-mono transition-all ${
            profile?.twoFactorEnabled 
              ? (isDark ? 'bg-zinc-805 text-zinc-300 border border-zinc-700' : 'bg-zinc-100 text-zinc-800 border border-zinc-200') 
              : (isDark ? 'bg-white text-zinc-950 hover:bg-zinc-200' : 'bg-black text-white hover:bg-zinc-800')
          }`}>
            {profile?.twoFactorEnabled ? 'ENABLED' : 'ENABLE'}
          </button>
        </div>

        <div className="space-y-4 text-left">
          <h3 className={`text-[10px] font-mono font-bold uppercase tracking-widest ${
            isDark ? 'text-zinc-500' : 'text-zinc-400'
          } px-2`}>
            Account Details
          </h3>
          <div className="space-y-1">
            <DetailItem 
              label="Member Since" 
              value={format(new Date(profile?.createdAt || Date.now()), 'MMMM yyyy')} 
              isDark={isDark}
            />
            <DetailItem 
              label="Account Role" 
              value={profile?.role || 'User'} 
              isDark={isDark}
            />
            <DetailItem 
              label="Total Transactions" 
              value="12" 
              isDark={isDark}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const DetailItem = ({ label, value, isDark }: { label: string, value: string, isDark?: boolean }) => (
  <div className={`flex justify-between items-center p-4 rounded-xl transition-colors ${
    isDark ? 'hover:bg-zinc-900/40 text-white' : 'hover:bg-zinc-50 text-zinc-900'
  }`}>
    <span className={`text-sm font-medium ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>{label}</span>
    <span className="text-sm font-bold capitalize">{value}</span>
  </div>
);
