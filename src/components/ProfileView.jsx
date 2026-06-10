import React, { useContext, useEffect, useState } from 'react';
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
import { useNotification } from '../lib/useNotification';
import { Auth } from '@/Utility/AuthContext';
import useApi from '../lib/useFetch';



  const ProfileView = () => {
  const { showNotification } = useNotification();
  const api = useApi()
  const [isSettingUp, setIsSettingUp] = useState(false);
  const [isDisabling, setIsDisabling] = useState(false);
  const [secret, setSecret] = useState("");
  const [setupStep, setSetupStep] = useState(1);
  const [otpInput, setOtpInput] = useState('');
  const [copiedKey, setCopiedKey] = useState(false);
  const [copiedCodes, setCopiedCodes] = useState(false);
  
  const [recoveryCodes, setRecoveryCodes] = useState([]);
   const {user, setUser} = useContext(Auth);
  // const secret = "AURA-777-SECURE-VAULT-AUTHENTICATOR";

useEffect(()=>{
  if(setupStep !== 1) return
  handleGenSecret();
},[setupStep])

const handleGenSecret = async()=>{
  const data = await api.auth.authenticator();
  setSecret(data ?? "")
}

  const handleCopyKey = () => {
    navigator.clipboard.writeText(secret);
    setCopiedKey(true);
    showNotification('Security key copied to clipboard!', 'success');
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const handleVerifySetup = async (e) => {
    e.preventDefault();
    if (otpInput.length !== 6 || isNaN(Number(otpInput))) {
      showNotification('Please enter a valid 6-digit verification code.', 'error');
      return;
    }
      const data = await api.auth.authenticatorVerify(JSON.stringify({token : otpInput,secret : secret?.secret}));
      if(!data?.success) return
      setUser((prev)=>({...prev,twoFactorEnabled : true}));
      showNotification('Two-Factor Authentication successfully activated!', 'success');
      setSetupStep(3); 
  }
  const handleDisable2FA = async (e) => {
    e.preventDefault();
    if (otpInput.length !== 6 || isNaN(Number(otpInput))) {
      showNotification('Please enter a valid 6-digit verification code to confirm.', 'error');
      return;
    }
   const data = await api.auth.authenticatorDeactivate(JSON.stringify({token : otpInput}));
      if(!data?.success) return
      setUser((prev)=>({...prev,twoFactorEnabled : false}))
      showNotification('Two-Factor Authentication successfully disabled.', 'success');
      setIsDisabling(false);
      setOtpInput('');
  };

  const resetSetupState = () => {
    setIsSettingUp(false);
    setIsDisabling(false);
    setSetupStep(1);
    setOtpInput('');
    setUser((prev)=>({...prev,twoFactorEnabled : true}))
  };
  return (
    <div className="max-w-2xl mx-auto space-y-12 my-6">
      {/* Header and Back navigation button */}
   

      <div className="text-center space-y-4">
  <div className="w-24 h-24 rounded-3xl mx-auto flex items-center justify-center border-4 shadow-xl bg-zinc-100 border-white text-zinc-400 dark:bg-zinc-900 dark:border-zinc-950 dark:text-white">
    <UserIcon className="w-10 h-10 text-zinc-400" />
  </div>

  <h2 className="text-3xl sm:text-4xl font-display font-black tracking-tighter uppercase text-zinc-900 dark:text-white">
    {user?.displayName || "User user"}
  </h2>

  <p className="text-zinc-400 dark:text-zinc-500">
    {user?.email}
  </p>
</div>

      {/* user Card wrapper / wizard */}
      <div className={`rounded-[1.25rem] border p-6 sm:p-8 space-y-8 shadow-2xl transition-all duration-300 dark:bg-zinc-950 dark:border-zinc-900 dark:text-white bg-white border-zinc-200 text-zinc-950
      `}>
        
        {/* Main 2FA Area */}
        {!isSettingUp && !isDisabling ? (
          <>
  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 rounded-2xl border gap-4 bg-zinc-50 border-zinc-200 dark:bg-zinc-900/30 dark:border-zinc-900/60">
    <div className="flex items-center gap-4 text-left">
      <ShieldCheck
        className={`w-10 h-10 ${
          user?.twoFactorEnabled ? "text-emerald-500" : "text-zinc-400"
        }`}
      />

      <div>
        <p className="font-bold text-base flex items-center gap-2">
          Two-Factor Authentication (2FA)

          {user?.twoFactorEnabled && (
            <span className="bg-emerald-500/10 text-emerald-500 text-[9px] font-extrabold uppercase font-mono px-2 py-0.5 rounded-full tracking-wider border border-emerald-500/20">
              ACTIVE
            </span>
          )}
        </p>

        <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5">
          Secure your balance and orders
        </p>
      </div>
    </div>

    <button
      onClick={() => {
        if (user?.twoFactorEnabled) {
          setIsDisabling(true);
        } else {
          setIsSettingUp(true);
        }
      }}
      className={`w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-bold font-mono tracking-wider transition-all ${
        user?.twoFactorEnabled
          ? "bg-red-50 hover:bg-red-100 border border-red-100 text-red-600 dark:bg-red-500/10 dark:hover:bg-red-500/25 dark:border-red-500/20 dark:text-red-400"
          : "bg-black text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200"
      }`}
    >
      {user?.twoFactorEnabled ? "DISABLE" : "ENABLE"}
    </button>
  </div>

  <div className="space-y-4 text-left">
    <h3 className="text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500 px-2">
      Account Details
    </h3>

    <div className="space-y-1">
      <DetailItem
        label="Account Email"
        value={user?.email || "email"}
      />
      <DetailItem
        label="Member Since"
        value={format(
          new Date(user?.createdAt || Date.now()),
          "MMMM yyyy"
        )}
      />

      <DetailItem
        label="Account Role"
        value={user?.role || "User"}
      />

      <DetailItem
        label="Security Standard"
        value={
          user?.twoFactorEnabled
            ? "MFA Locked (High)"
            : "Password Entry Only (Standard)"
        }
        valueColor={
          user?.twoFactorEnabled
            ? "text-emerald-500 font-bold"
            : "text-amber-500 font-medium"
        }
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
      <p className="text-sm font-bold">
        Step 1: Download Authenticator App
      </p>

      <p className="text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
        To use two-step verification, you need an authenticator helper
        application on your mobile device. Download Google Authenticator,
        Authy, or Microsoft Authenticator from Apple App Store or Google Play
        Store.
      </p>
    </div>

    <div className="flex flex-wrap gap-3">
      <a
        href="https://apps.apple.com/us/app/google-authenticator/id388491328"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-mono font-bold tracking-wider bg-zinc-50 border-zinc-200 hover:bg-zinc-100 dark:bg-zinc-900 dark:border-zinc-800 dark:hover:bg-zinc-800"
      >
        iOS App Store
      </a>

      <a
        href="https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-mono font-bold tracking-wider bg-zinc-50 border-zinc-200 hover:bg-zinc-100 dark:bg-zinc-900 dark:border-zinc-800 dark:hover:bg-zinc-800"
      >
        Google Play
      </a>
    </div>

    <div className="flex justify-end pt-4 border-t border-zinc-200/55 dark:border-zinc-900">
      <button
        onClick={() => setSetupStep(2)}
        className="px-5 py-2.5 rounded-xl text-xs font-mono font-bold uppercase tracking-widest flex items-center gap-1.5 bg-black text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200"
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
                 <p className="text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
  Open your Authenticator app and scan the barcode below, or manually
  key in the secure alpha-numeric setup secret directly.
</p>
                </div>

                {/* Simulated Crispy QR Code SVG */}
                <div className="py-4 text-center">
                 <img src={secret?.qrCode} className="w-40 h-40 mx-auto rounded-2xl border p-2 bg-white"/>
                </div>

                {/* Text configuration key */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Manual Setup Token Key</label>
                <div className="p-4 rounded-xl border flex items-center justify-between gap-4 bg-zinc-50 border-zinc-200 dark:bg-zinc-900 dark:border-zinc-800">
  <code className="font-mono text-xs font-bold select-all break-all text-zinc-700 dark:text-zinc-300 pointer-events-auto leading-relaxed">
    {secret?.secret}
  </code>

  <button
    type="button"
    onClick={handleCopyKey}
    className="p-2 rounded-lg border transition-colors shrink-0 bg-white border-zinc-200 hover:bg-zinc-50 dark:bg-zinc-800 dark:border-zinc-700 dark:hover:bg-zinc-700/50"
    title="Copy Key"
  >
    {copiedKey ? (
      <Check className="w-4 h-4 text-emerald-500" />
    ) : (
      <Copy className="w-4 h-4" />
    )}
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
  onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, ""))}
  className="w-full py-4 rounded-xl border text-center font-mono text-2xl font-black tracking-[0.25em] outline-none max-w-sm mx-auto block transition-all bg-zinc-50 border-zinc-200 text-zinc-900 focus:border-black dark:bg-zinc-900 dark:border-zinc-800 dark:text-white dark:focus:border-zinc-700"
/>
                    <p className="text-[10px] text-center text-zinc-400 dark:text-zinc-500 mt-1">
  * Enter any 6 digit test token for development/evaluation sandbox setup.
</p>
                  </div>

                  <div className="flex justify-between pt-4 border-t border-zinc-200/55 dark:border-zinc-900">
                    <button
  type="button"
  onClick={() => setSetupStep(1)}
  className="px-4 py-2.5 rounded-xl text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1 border border-zinc-200 text-zinc-700 hover:bg-zinc-50 dark:border-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-900 w-auto"
>
  <ChevronLeft className="w-4 h-4" />
  PREVIOUS
</button>
                    <button
  type="submit"
  className="px-5 py-2.5 rounded-xl text-xs font-mono font-bold uppercase tracking-widest flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-600 text-white dark:bg-emerald-600 dark:hover:bg-emerald-500"
>
  ACTIVATE 2FA
  <ShieldCheck className="w-4 h-4" />
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

      <p className="font-bold text-emerald-500 text-base uppercase">
        Two-Factor Authentication Active
      </p>

      <p className="text-xs text-zinc-500 dark:text-zinc-400">
        Your digital portfolio is now safely protected by multi-factor
        challenge-response systems.
      </p>
    </div>

    <div className="flex justify-end pt-4 border-t border-zinc-200/55 dark:border-zinc-900">
      <button
        onClick={resetSetupState}
        className="px-5 py-2.5 rounded-xl text-xs font-mono font-bold uppercase tracking-widest flex items-center gap-1.5 bg-black text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200"
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

  <p className="text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
    Warning: Deactivating Two-Step Verification removes an essential layer
    of defence. Transactions, withdrawals, and login credentials will rely
    solely on standard password validation.
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
        onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, ""))}
        className="w-full py-4 rounded-xl border text-center font-mono text-2xl font-black tracking-[0.25em] outline-none max-w-sm mx-auto block transition-all bg-zinc-50 border-zinc-200 text-zinc-900 focus:border-black dark:bg-zinc-900 dark:border-zinc-800 dark:text-white dark:focus:border-zinc-700"
      />

      <p className="text-[10px] text-center text-zinc-400 dark:text-zinc-500 mt-1">
        * Key in any 6-digit passcode to confirm disabling of 2FA.
      </p>
    </div>

    <div className="flex justify-end pt-4 border-t border-zinc-200/55 dark:border-zinc-900">
      <button
        type="submit"
        className="px-5 py-2.5 rounded-xl text-xs font-mono font-bold uppercase tracking-widest flex items-center gap-1.5 bg-red-500 hover:bg-red-600 text-white dark:bg-red-600 dark:hover:bg-red-500"
      >
        DEACTIVATE
        <AlertTriangle className="w-4 h-4" />
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
  valueColor
}) => (
  <div className="flex justify-between items-center p-4 rounded-xl transition-colors text-zinc-900 hover:bg-zinc-50 dark:text-white dark:hover:bg-zinc-900/40">
  <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
    {label}
  </span>

  <span className={`text-sm font-bold capitalize ${valueColor || ""}`}>
    {value}
  </span>
</div>
); 
export default ProfileView;