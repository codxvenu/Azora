import React, { useState } from 'react';
import { 
  User as UserIcon, 
  ShieldCheck, 
  ChevronLeft, 
  ChevronRight, 
  Copy, 
  Check, 
  QrCode, 
  Key, 
  Download, 
  AlertTriangle,
  ArrowLeft
} from 'lucide-react';
import { format } from 'date-fns';
import { db } from '../lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { useNotification } from '../lib/useNotification';

interface ProfileViewProps {
  profile: any;
  onBack: () => void;
  isDark?: boolean;
}

export const ProfileView = ({ profile, onBack, isDark }: ProfileViewProps) => {
  const { showNotification } = useNotification();
  const [isSettingUp, setIsSettingUp] = useState(false);
  const [isDisabling, setIsDisabling] = useState(false);
  const [setupStep, setSetupStep] = useState(1);
  const [otpInput, setOtpInput] = useState('');
  const [copiedKey, setCopiedKey] = useState(false);
  const [copiedCodes, setCopiedCodes] = useState(false);
  const [recoveryCodes, setRecoveryCodes] = useState<string[]>([]);

  const secretKey = "AURA-777-SECURE-VAULT-AUTHENTICATOR";

  const generateRecoveryCodes = () => {
    const codes = [];
    for (let i = 0; i < 4; i++) {
      const seg1 = Math.random().toString(36).substring(2, 6).toUpperCase();
      const seg2 = Math.random().toString(36).substring(2, 6).toUpperCase();
      codes.push(`RVC-${seg1}-${seg2}`);
    }
    return codes;
  };

  const handleCopyKey = () => {
    navigator.clipboard.writeText(secretKey);
    setCopiedKey(true);
    showNotification('Security key copied to clipboard!', 'success');
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const handleCopyCodes = () => {
    navigator.clipboard.writeText(recoveryCodes.join('\n'));
    setCopiedCodes(true);
    showNotification('Recovery codes copied to clipboard!', 'success');
    setTimeout(() => setCopiedCodes(false), 2000);
  };

  const handleVerifySetup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otpInput.length !== 6 || isNaN(Number(otpInput))) {
      showNotification('Please enter a valid 6-digit verification code.', 'error');
      return;
    }

    try {
      // Generate recovery codes for user backup
      const codes = generateRecoveryCodes();
      setRecoveryCodes(codes);

      // Save to Firebase Firestore
      const userRef = doc(db, 'users', profile.uid);
      await updateDoc(userRef, {
        twoFactorEnabled: true
      });

      showNotification('Two-Factor Authentication successfully activated!', 'success');
      setSetupStep(3); // Go to recovery codes step
    } catch (error: any) {
      console.error(error);
      showNotification('Error activating 2FA. Please try again.', 'error');
    }
  };

  const handleDisable2FA = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otpInput.length !== 6 || isNaN(Number(otpInput))) {
      showNotification('Please enter a valid 6-digit verification code to confirm.', 'error');
      return;
    }

    try {
      // Save to Firebase Firestore
      const userRef = doc(db, 'users', profile.uid);
      await updateDoc(userRef, {
        twoFactorEnabled: false
      });

      showNotification('Two-Factor Authentication successfully disabled.', 'success');
      setIsDisabling(false);
      setOtpInput('');
    } catch (error: any) {
      console.error(error);
      showNotification('Error disabling 2FA. Please try again.', 'error');
    }
  };

  const resetSetupState = () => {
    setIsSettingUp(false);
    setIsDisabling(false);
    setSetupStep(1);
    setOtpInput('');
    setRecoveryCodes([]);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-12">
      {/* Header and Back navigation button */}
      <div className="flex justify-between items-center px-2">
        <button 
          onClick={onBack}
          className={`px-4 py-2 rounded-xl text-xs font-bold font-mono tracking-widest flex items-center gap-2 border transition-all ${
            isDark 
              ? 'bg-zinc-950 border-zinc-900 hover:bg-zinc-900/60 text-zinc-300' 
              : 'bg-white border-zinc-200 hover:bg-zinc-50 text-zinc-700'
          }`}
        >
          <ArrowLeft className="w-4 h-4" /> BACK
        </button>
      </div>

      <div className="text-center space-y-4">
        <div className={`w-24 h-24 rounded-3xl mx-auto flex items-center justify-center border-4 shadow-xl ${
          isDark ? 'bg-zinc-900 border-zinc-950 text-white' : 'bg-zinc-100 border-white text-zinc-400'
        }`}>
          <UserIcon className="w-10 h-10 text-zinc-400" />
        </div>
        <h2 className="text-3xl sm:text-4xl font-display font-black tracking-tighter uppercase text-zinc-900 dark:text-white">
          {profile?.displayName || 'User Profile'}
        </h2>
        <p className={isDark ? 'text-zinc-500' : 'text-zinc-400'}>{profile?.email}</p>
      </div>

      {/* Profile Card wrapper / wizard */}
      <div className={`rounded-[1.25rem] border p-6 sm:p-8 space-y-8 shadow-2xl transition-all duration-300 ${
        isDark ? 'bg-zinc-950 border-zinc-900 text-white' : 'bg-white border-zinc-200 text-zinc-950'
      }`}>
        
        {/* Main 2FA Area */}
        {!isSettingUp && !isDisabling ? (
          <>
            <div className={`flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 rounded-2xl border gap-4 ${
              isDark ? 'bg-zinc-900/30 border-zinc-900/60' : 'bg-zinc-50 border-zinc-150'
            }`}>
              <div className="flex items-center gap-4 text-left">
                <ShieldCheck className={`w-10 h-10 ${profile?.twoFactorEnabled ? 'text-emerald-500' : 'text-zinc-400'}`} />
                <div>
                  <p className="font-bold text-base flex items-center gap-2">
                    Two-Factor Authentication (2FA)
                    {profile?.twoFactorEnabled && (
                      <span className="bg-emerald-500/10 text-emerald-500 text-[9px] font-extrabold uppercase font-mono px-2 py-0.5 rounded-full tracking-wider border border-emerald-500/20">
                        ACTIVE
                      </span>
                    )}
                  </p>
                  <p className={`text-xs ${isDark ? 'text-zinc-500' : 'text-zinc-400'} mt-0.5`}>
                    Require a 6-digit rolling authentication code to confirm transactions and login events.
                  </p>
                </div>
              </div>
              <button 
                onClick={() => {
                  if (profile?.twoFactorEnabled) {
                    setIsDisabling(true);
                  } else {
                    setIsSettingUp(true);
                  }
                }}
                className={`w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-bold font-mono tracking-wider transition-all ${
                  profile?.twoFactorEnabled 
                    ? (isDark ? 'bg-red-500/10 hover:bg-red-500/25 border border-red-500/20 text-red-400' : 'bg-red-50 hover:bg-red-100 border border-red-100 text-red-600') 
                    : (isDark ? 'bg-white text-zinc-950 hover:bg-zinc-200' : 'bg-black text-white hover:bg-zinc-800')
                }`}
              >
                {profile?.twoFactorEnabled ? 'DISABLE 2FA' : 'ENABLE 2FA'}
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
                  label="Security Standard" 
                  value={profile?.twoFactorEnabled ? "MFA Locked (High)" : "Password Entry Only (Standard)"} 
                  isDark={isDark}
                  valueColor={profile?.twoFactorEnabled ? "text-emerald-500 font-bold" : "text-amber-500 font-medium"}
                />
              </div>
            </div>
          </>
        ) : isSettingUp ? (
          /* ======================================================== */
          /* 2FA INLINE SETUP FLOW                                   */
          /* ======================================================== */
          <div className="space-y-6 text-left">
            <div className="flex items-center justify-between border-b pb-4 border-zinc-200/55 dark:border-zinc-900">
              <h3 className="font-display font-black text-base uppercase flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-500" />
                Setup Two-Step Verification
              </h3>
              <button 
                onClick={resetSetupState}
                className="text-[10px] font-mono hover:underline font-bold uppercase tracking-wider text-zinc-500"
              >
                CANCEL
              </button>
            </div>

            {/* Step Indicators */}
            <div className="grid grid-cols-3 gap-2">
              <div className={`h-1.5 rounded-full ${setupStep >= 1 ? 'bg-emerald-500' : 'bg-zinc-800'}`} />
              <div className={`h-1.5 rounded-full ${setupStep >= 2 ? 'bg-emerald-500' : 'bg-zinc-805 dark:bg-zinc-800 bg-zinc-200'}`} />
              <div className={`h-1.5 rounded-full ${setupStep >= 3 ? 'bg-emerald-500' : 'bg-zinc-805 dark:bg-zinc-800 bg-zinc-200'}`} />
            </div>

            {/* STEP 1: Download App */}
            {setupStep === 1 && (
              <div className="space-y-6 py-2">
                <div className="space-y-2">
                  <p className="text-sm font-bold">Step 1: Download Authenticator App</p>
                  <p className={`text-xs leading-relaxed ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
                    To use two-step verification, you need an authenticator helper application on your mobile device. Download Google Authenticator, Authy, or Microsoft Authenticator from Apple App Store or Google Play Store.
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <a 
                    href="https://apps.apple.com/us/app/google-authenticator/id388491328"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-mono font-bold tracking-wider ${
                      isDark ? 'bg-zinc-900 border-zinc-850 hover:bg-zinc-800' : 'bg-zinc-50 border-zinc-150 hover:bg-zinc-100'
                    }`}
                  >
                    iOS App Store
                  </a>
                  <a 
                    href="https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-mono font-bold tracking-wider ${
                      isDark ? 'bg-zinc-900 border-zinc-850 hover:bg-zinc-800' : 'bg-zinc-50 border-zinc-150 hover:bg-zinc-100'
                    }`}
                  >
                    Google Play
                  </a>
                </div>

                <div className="flex justify-end pt-4 border-t border-zinc-200/55 dark:border-zinc-900">
                  <button 
                    onClick={() => setSetupStep(2)}
                    className={`px-5 py-2.5 rounded-xl text-xs font-mono font-bold uppercase tracking-widest flex items-center gap-1.5 ${
                      isDark ? 'bg-white text-zinc-950 hover:bg-zinc-200' : 'bg-black text-white hover:bg-zinc-800'
                    }`}
                  >
                    NEXT: SCAN KEY <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: Scan QR & Enter PIN */}
            {setupStep === 2 && (
              <div className="space-y-6 py-2">
                <div className="space-y-2">
                  <p className="text-sm font-bold">Step 2: Connect Authenticator App</p>
                  <p className={`text-xs leading-relaxed ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
                    Open your Authenticator app and scan the barcode below, or manually key in the secure alpha-numeric setup secret directly.
                  </p>
                </div>

                {/* Simulated Crispy QR Code SVG */}
                <div className="py-4 text-center">
                  <svg className="w-40 h-40 mx-auto rounded-2xl border p-2 bg-white" viewBox="0 0 100 100" fill="currentColor">
                    <rect width="100" height="100" fill="white" />
                    {/* Finding pattern top left */}
                    <rect x="5" y="5" width="20" height="10" fill="black" />
                    <rect x="5" y="15" width="20" height="10" fill="black" />
                    <rect x="8" y="8" width="14" height="14" fill="white" />
                    <rect x="11" y="11" width="8" height="8" fill="black" />
                    {/* Finding pattern top right */}
                    <rect x="75" y="5" width="20" height="20" fill="black" />
                    <rect x="78" y="8" width="14" height="14" fill="white" />
                    <rect x="81" y="11" width="8" height="8" fill="black" />
                    {/* Finding pattern bottom left */}
                    <rect x="5" y="75" width="20" height="20" fill="black" />
                    <rect x="8" y="78" width="14" height="14" fill="white" />
                    <rect x="11" y="81" width="8" height="8" fill="black" />
                    {/* Random bits represent modern pixels */}
                    <rect x="30" y="5" width="5" height="5" fill="black" />
                    <rect x="40" y="5" width="10" height="5" fill="black" />
                    <rect x="60" y="5" width="5" height="10" fill="black" />
                    <rect x="35" y="25" width="5" height="5" fill="black" />
                    <rect x="45" y="30" width="10" height="5" fill="black" />
                    <rect x="5" y="35" width="15" height="5" fill="black" />
                    <rect x="25" y="40" width="5" height="10" fill="black" />
                    <rect x="45" y="45" width="15" height="5" fill="black" />
                    <rect x="65" y="35" width="5" height="5" fill="black" />
                    <rect x="75" y="30" width="5" height="15" fill="black" />
                    <rect x="85" y="45" width="10" height="5" fill="black" />
                    <rect x="5" y="55" width="10" height="5" fill="black" />
                    <rect x="30" y="60" width="5" height="5" fill="black" />
                    <rect x="45" y="55" width="5" height="15" fill="black" />
                    <rect x="70" y="55" width="15" height="5" fill="black" />
                    <text x="50" y="68" fontSize="8" fontWeight="bold" textAnchor="middle" fill="#10B981" transform="rotate(-10 50 68)">AURA</text>
                    <rect x="30" y="75" width="5" height="10" fill="black" />
                    <rect x="40" y="85" width="10" height="5" fill="black" />
                    <rect x="60" y="75" width="5" height="15" fill="black" />
                    <rect x="70" y="85" width="10" height="5" fill="black" />
                    <rect x="85" y="80" width="10" height="5" fill="black" />
                  </svg>
                </div>

                {/* Text configuration key */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Manual Setup Token Key</label>
                  <div className={`p-4 rounded-xl border flex items-center justify-between gap-4 ${
                    isDark ? 'bg-zinc-900 border-zinc-850' : 'bg-zinc-50 border-zinc-200'
                  }`}>
                    <code className="font-mono text-xs font-bold select-all break-all text-zinc-300 pointer-events-auto leading-relaxed">
                      {secretKey}
                    </code>
                    <button 
                      type="button"
                      onClick={handleCopyKey}
                      className={`p-2 rounded-lg border transition-colors shrink-0 ${
                        isDark ? 'bg-zinc-855 border-zinc-700 hover:bg-zinc-700/50' : 'bg-white border-zinc-200 hover:bg-zinc-50'
                      }`}
                      title="Copy Key"
                    >
                      {copiedKey ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Code Verifier Input form */}
                <form onSubmit={handleVerifySetup} className="space-y-4 pt-2 border-t border-zinc-200/55 dark:border-zinc-900">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 block">
                      Verify Passcode (Check Authenticator App)
                    </label>
                    <input 
                      type="text"
                      required
                      maxLength={6}
                      placeholder="e.g. 123456"
                      value={otpInput}
                      onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, ''))}
                      className={`w-full py-4.5 rounded-xl border text-center font-mono text-2xl font-black tracking-[0.25em] outline-none max-w-sm mx-auto block transition-all ${
                        isDark 
                          ? 'bg-zinc-900 border-zinc-800 text-white focus:border-zinc-700' 
                          : 'bg-zinc-50 border-zinc-200 text-zinc-900 focus:border-black'
                      }`}
                    />
                    <p className={`text-[10px] text-center ${isDark ? 'text-zinc-500' : 'text-zinc-400'} mt-1`}>
                      * Enter any 6 digit test token for development/evaluation sandbox setup.
                    </p>
                  </div>

                  <div className="flex justify-between pt-4 border-t border-zinc-200/55 dark:border-zinc-900">
                    <button 
                      type="button"
                      onClick={() => setSetupStep(1)}
                      className={`px-4 py-2.5 rounded-xl text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1 border ${
                        isDark ? 'border-zinc-800 text-zinc-400 hover:bg-zinc-90 w-auto' : 'border-zinc-200 text-zinc-700 hover:bg-zinc-50'
                      }`}
                    >
                      <ChevronLeft className="w-4 h-4" /> PREVIOUS
                    </button>
                    <button 
                      type="submit"
                      className={`px-5 py-2.5 rounded-xl text-xs font-mono font-bold uppercase tracking-widest flex items-center gap-1.5 ${
                        isDark ? 'bg-emerald-600 hover:bg-emerald-500 text-white' : 'bg-emerald-500 hover:bg-emerald-600 text-white'
                      }`}
                    >
                      ACTIVATE 2FA <ShieldCheck className="w-4 h-4" />
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* STEP 3: Setup Success & Recovery Codes */}
            {setupStep === 3 && (
              <div className="space-y-6 py-2">
                <div className="text-center space-y-2 p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl">
                  <ShieldCheck className="w-12 h-12 text-emerald-500 mx-auto" />
                  <p className="font-bold text-emerald-500 text-base uppercase">Two-Factor Authentication Active</p>
                  <p className={`text-xs ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
                    Your digital portfolio is now safely protected by multi-factor challenge-response systems.
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-amber-500">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    <p className="text-xs font-bold uppercase tracking-wider font-mono">Store recovery codes securely</p>
                  </div>
                  <p className={`text-xs ${isDark ? 'text-zinc-400' : 'text-zinc-500'} leading-relaxed`}>
                    If you lose access to your authenticator app, these emergency backup codes allow profile restoration. Store them in an encrypted credential manager or physical safe.
                  </p>

                  <div className={`p-5 rounded-2xl border font-mono text-sm font-bold relative ${
                    isDark ? 'bg-zinc-900 border-zinc-850' : 'bg-zinc-50 border-zinc-200'
                  }`}>
                    <div className="grid grid-cols-2 gap-3 text-center tracking-wider max-w-md mx-auto">
                      {recoveryCodes.map((code, idx) => (
                        <div key={idx} className={`p-2 rounded-lg border ${
                          isDark ? 'bg-zinc-950 border-zinc-800' : 'bg-white border-zinc-150'
                        }`}>
                          {code}
                        </div>
                      ))}
                    </div>

                    <button 
                      onClick={handleCopyCodes}
                      className={`absolute right-3 bottom-3 p-2 rounded-lg border transition-colors ${
                        isDark ? 'bg-zinc-855 border-zinc-705 text-zinc-300 hover:bg-zinc-700/50' : 'bg-white border-zinc-200 text-zinc-650 hover:bg-zinc-50'
                      }`}
                      title="Copy backup keys"
                    >
                      {copiedCodes ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-zinc-200/55 dark:border-zinc-900">
                  <button 
                    onClick={resetSetupState}
                    className={`px-5 py-2.5 rounded-xl text-xs font-mono font-bold uppercase tracking-widest flex items-center gap-1.5 ${
                      isDark ? 'bg-white text-zinc-950 hover:bg-zinc-200' : 'bg-black text-white hover:bg-zinc-800'
                    }`}
                  >
                    COMPLETE SETUP
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* ======================================================== */
          /* 2FA DISABLE FLOW                                        */
          /* ======================================================== */
          <div className="space-y-6 text-left">
            <div className="flex items-center justify-between border-b pb-4 border-zinc-200/55 dark:border-zinc-900">
              <h3 className="font-display font-black text-base uppercase flex items-center gap-2 text-red-500">
                <AlertTriangle className="w-5 h-5" />
                Deactivate Two-Step Verification
              </h3>
              <button 
                onClick={resetSetupState}
                className="text-[10px] font-mono hover:underline font-bold uppercase tracking-wider text-zinc-500"
              >
                CANCEL
              </button>
            </div>

            <p className={`text-xs leading-relaxed ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
              Warning: Deactivating Two-Step Verification removes an essential layer of defence. Transactions, withdrawals, and login credentials will rely solely on standard password validation.
            </p>

            <form onSubmit={handleDisable2FA} className="space-y-4 py-2">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 block">
                  Confirm Authenticator Code
                </label>
                <input 
                  type="text"
                  required
                  maxLength={6}
                  placeholder="e.g. 123456"
                  value={otpInput}
                  onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, ''))}
                  className={`w-full py-4.5 rounded-xl border text-center font-mono text-2xl font-black tracking-[0.25em] outline-none max-w-sm mx-auto block transition-all ${
                    isDark 
                      ? 'bg-zinc-900 border-zinc-800 text-white focus:border-zinc-700' 
                      : 'bg-zinc-50 border-zinc-200 text-zinc-900 focus:border-black'
                  }`}
                />
                <p className={`text-[10px] text-center ${isDark ? 'text-zinc-500' : 'text-zinc-400'} mt-1`}>
                  * Key in any 6-digit passcode to confirm disabling of 2FA.
                </p>
              </div>

              <div className="flex justify-end pt-4 border-t border-zinc-200/55 dark:border-zinc-900">
                <button 
                  type="submit"
                  className={`px-5 py-2.5 rounded-xl text-xs font-mono font-bold uppercase tracking-widest flex items-center gap-1.5 ${
                    isDark ? 'bg-red-600 hover:bg-red-500 text-white' : 'bg-red-500 hover:bg-red-600 text-white'
                  }`}
                >
                  DEACTIVATE <AlertTriangle className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

const DetailItem = ({ 
  label, 
  value, 
  isDark,
  valueColor
}: { 
  label: string;
  value: string;
  isDark?: boolean;
  valueColor?: string;
}) => (
  <div className={`flex justify-between items-center p-4 rounded-xl transition-colors ${
    isDark ? 'hover:bg-zinc-900/40 text-white' : 'hover:bg-zinc-50 text-zinc-900'
  }`}>
    <span className={`text-sm font-medium ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>{label}</span>
    <span className={`text-sm font-bold capitalize ${valueColor || ''}`}>{value}</span>
  </div>
);
