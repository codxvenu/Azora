import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  FileText, 
  RotateCcw, 
  ArrowLeft, 
  Clock, 
  Globe, 
  ChevronRight, 
  CheckCircle,
  HelpCircle,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useParams } from 'react-router-dom';


export const Privacy = ({ onBack, isDark }) => {
    const {type} = useParams();
    const initialTab = type ?? "privacy"
    const [activeTab, setActiveTab] = useState(initialTab);
  useEffect(() => {
    setActiveTab(initialTab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [initialTab]);

  const tabs = [
    {
      id: 'privacy' ,
      label: 'Privacy Policy',
      icon: Shield,
      description: 'How we collect, protect, and use your credentials and trading data.'
    },
    {
      id: 'terms' ,
      label: 'Terms of Service',
      icon: FileText,
      description: 'The operational rules governing your purchase and delivery of cards and software keys.'
    },
    {
      id: 'refund' ,
      label: 'Refund Policy',
      icon: RotateCcw,
      description: 'Our strict structural delivery regulations and digital refund criteria.'
    }
  ];

  return (
   <div className="max-w-6xl mx-auto px-4 py-6 md:py-12 space-y-10">

  {/* Structural Minimal Breadcrumb / Back button */}
  {/* <div className="flex justify-between items-center px-1">
    <button
      onClick={onBack}
      className="px-4 py-2 rounded-xl text-xs font-bold font-mono tracking-widest flex items-center gap-2 border transition-all bg-white border-zinc-200 hover:bg-zinc-50 text-zinc-700 dark:bg-zinc-950 dark:border-zinc-900 dark:hover:bg-zinc-900/60 dark:text-zinc-300"
      id="legal-back-button"
    >
      <ArrowLeft className="w-4 h-4" /> BACK TO BROWSE
    </button>

    <div className="flex items-center gap-2 font-mono text-[10px] text-zinc-500 font-bold uppercase tracking-wider">
      <Globe className="w-3.5 h-3.5" /> GLOBAL STANDARD REVISED: 2026
    </div>
  </div> */}

  {/* Header section with sophisticated branding */}
  <div className="space-y-4 text-center sm:text-left">
    <h1 className="text-4xl sm:text-5xl font-display font-black tracking-tighter uppercase text-zinc-900 dark:text-white">
      Legal Directory
    </h1>

    <p className="text-sm max-w-xl leading-relaxed text-zinc-650 dark:text-zinc-400">
      Welcome to the AURA regulatory index. Our policies protect integrity, escrow security, and lightning-fast direct digital distribution transparently.
    </p>
  </div>

  {/* Two Column Layout: Navigation & Content */}
  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

    {/* Left Column: Navigation Cards */}
    <aside className="lg:col-span-4 space-y-3 lg:sticky lg:top-8">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`w-full p-4.5 rounded-2xl border text-left transition-all duration-350 relative overflow-hidden group flex items-start gap-4 ${
              isActive
                ? 'border-emerald-500 bg-emerald-500/[0.03] shadow-lg shadow-emerald-500/5'
                : 'bg-white border-zinc-150 hover:bg-zinc-50/50 dark:bg-zinc-950 dark:border-zinc-900 dark:hover:border-zinc-800'
            }`}
            id={`tab-select-${tab.id}`}
          >
            {/* Active Indicator bar */}
            {isActive && (
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500" />
            )}

            <div
              className={`p-2.5 rounded-xl border shrink-0 transition-colors ${
                isActive
                  ? 'bg-emerald-500 text-white border-emerald-500'
                  : 'bg-zinc-50 border-zinc-100 text-zinc-500 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-400'
              }`}
            >
              <Icon className="w-5 h-5" />
            </div>

            <div className="space-y-1">
              <h3
                className={`font-bold text-sm tracking-tight flex items-center gap-1.5 ${
                  isActive
                    ? 'text-emerald-500 dark:text-emerald-400'
                    : 'text-zinc-900 dark:text-white'
                }`}
              >
                {tab.label}
                <ChevronRight
                  className={`w-3.5 h-3.5 transition-transform duration-300 ${
                    isActive
                      ? 'translate-x-0.5'
                      : 'opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 text-zinc-400'
                  }`}
                />
              </h3>

              <p className="text-xs leading-relaxed text-zinc-500 dark:text-zinc-550">
                {tab.description}
              </p>
            </div>
          </button>
        );
      })}

      <div className="p-5 rounded-2xl border bg-zinc-50 border-zinc-150 dark:bg-zinc-950/40 dark:border-zinc-900/60">
        <h4 className="font-mono text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-2 flex items-center gap-1.5">
          <HelpCircle className="w-3.5 h-3.5 text-emerald-500" /> Need Assistance?
        </h4>

        <p className="text-xs leading-relaxed mb-3 text-zinc-500">
          For custom escrow disputes, enterprise legal inquiries, or verification help.
        </p>

        <a
          href="mailto:support@4ura.cards"
          className="text-xs font-mono font-bold text-emerald-500 dark:text-emerald-400 hover:underline flex items-center gap-1"
        >
          support@4ura.cards
        </a>
      </div>
    </aside>

    {/* Right Column: Dynamic Legal Document Content */}
    <main className="lg:col-span-8">
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.3 }}
          className="rounded-3xl border p-6 sm:p-10 shadow-2xl transition-all duration-300 bg-white border-zinc-150 text-zinc-700 dark:bg-zinc-950 dark:border-zinc-900 dark:text-zinc-300"
        >
          {activeTab === 'privacy' && <PrivacyPolicyContent isDark={isDark} />}
          {activeTab === 'terms' && <TermsOfServiceContent isDark={isDark} />}
          {activeTab === 'refund' && <RefundPolicyContent isDark={isDark} />}
        </motion.div>
      </AnimatePresence>
    </main>

  </div>
</div>
  );
};

/* ========================================================================= */
/* LEGAL CONTENT CHUNKS                                                      */
/* ========================================================================= */

const PrivacyPolicyContent = ({ isDark }) => (
    <div className="space-y-8 text-left">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-6 border-zinc-200/55 dark:border-zinc-900 gap-4">
        <div className="space-y-1">
            <h2 className="font-display font-black text-2xl uppercase text-zinc-950 dark:text-white">
            Privacy Policy
            </h2>
            <p className="text-xs font-mono font-bold text-emerald-500 dark:text-emerald-400 uppercase tracking-widest">
            AURA Digital Encryption Protocol
            </p>
        </div>
        <div className="flex items-center gap-2 font-mono text-[10px] text-zinc-400 bg-zinc-100 dark:bg-zinc-900 px-3 py-1.5 rounded-lg border border-zinc-200/20">
            <Clock className="w-3.5 h-3.5 text-zinc-500" /> STATUS: AMENDED JUN 2026
        </div>
        </div>

        <div className="space-y-6 text-sm leading-relaxed">
        
        <section className="space-y-3">
            <h3 className="font-bold text-base text-zinc-950 dark:text-white flex items-center gap-2">
            <span className="text-xs font-mono font-black border border-emerald-500/20 px-2 py-0.5 rounded text-emerald-500 bg-emerald-500/5">1.0</span>
            Scope of Data Governance
            </h3>
            <p>
            At AURA Digital Marketplace ("AURA", "we", "us", or "our"), user privacy is a foundational pillar of trust. This Privacy Policy details the storage, transmission, and safeguards applied to your personal identity registration parameters, dynamic wallet balances, local cache nodes, and transaction ledgers.
            </p>
            <p>
            By creating an AURA security identity and authorizing Google Account OAuth vaults, you consent to the secure database schemas documented herein.
            </p>
        </section>

        <section className="space-y-3">
           <h3 className="font-bold text-base text-zinc-950 dark:text-white flex items-center gap-2">
            <span className="text-xs font-mono font-black border border-emerald-500/20 px-2 py-0.5 rounded text-emerald-500 bg-emerald-500/5">2.0</span>
            Categories of Collected Information
            </h3>
            <p>
            We collect and evaluate the minimum structural dimensions required to facilitate high-speed digital gift card swaps and escrow transfers:
            </p>
            <ul className="list-disc list-inside pl-2 space-y-2 text-xs font-medium">
            <li><span className="text-zinc-950 dark:text-white">Identity Verification Vectors:</span> Google account profile metadata, email addresses, and voluntary multi-factor device seeds.</li>
            <li><span className="text-zinc-950 dark:text-white">Financial Telemetry:</span> Deposited funds, balance ledgers, currency types, and third-party transaction hashes.</li>
            <li><span className="text-zinc-950 dark:text-white">Inventory Code Records:</span> Alphanumeric codes, activation pins, and game license logs submitted by sellers.</li>
            </ul>
        </section>

        <section className="space-y-3">
           <h3 className="font-bold text-base text-zinc-950 dark:text-white flex items-center gap-2">
            <span className="text-xs font-mono font-black border border-emerald-500/20 px-2 py-0.5 rounded text-emerald-500 bg-emerald-500/5">3.0</span>
            Storage and Zero-Knowledge Security Protocols
            </h3>
            <p>
            All collected codes, private profiles, and billing histories are stored in enterprise cloud databases optimized for instant secure lookup. All transaction indexes are locked with active encryption layers:
            </p>
           <div className="p-4.5 rounded-2xl border text-xs leading-relaxed space-y-2 font-mono bg-zinc-50 border-zinc-150 dark:bg-zinc-900 dark:border-zinc-850">
            <div className="flex items-center gap-2 text-emerald-500 font-bold uppercase tracking-wider">
                <CheckCircle className="w-4 h-4 shrink-0" /> End-to-End Delivery Escrow
            </div>
            <p className="text-zinc-650 dark:text-zinc-400">
                License keys are completely scrambled inside the database and only decrypted post-payment validation. Once a buyer claims a purchased gift card code from their order drawer, that code is archived securely within their encrypted profile and shielded permanently from public search index structures.
            </p>
            </div>
        </section>

        <section className="space-y-3">
           <h3 className="font-bold text-base text-zinc-950 dark:text-white flex items-center gap-2"><span className="text-xs font-mono font-black border border-emerald-500/20 px-2 py-0.5 rounded text-emerald-500 bg-emerald-500/5">4.0</span>
            Third-Party Integrity & Disclosures
            </h3>
            <p>
            AURA does not sell, trade, or distribute your email records or virtual card assets to third-party ad brokers. We interface with Firestore database components, Google Auth servers, and fraud checker algorithms exclusively to achieve transaction compliance and enforce user rights.
            </p>
        </section>

        </div>
    </div>
);

const TermsOfServiceContent = () => (
 <div className="space-y-8 text-left">

  <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-6 border-zinc-200/55 dark:border-zinc-900 gap-4">
    <div className="space-y-1">
      <h2 className="font-display font-black text-2xl uppercase text-zinc-950 dark:text-white">
        Terms of Service
      </h2>

      <p className="text-xs font-mono font-bold text-emerald-500 dark:text-emerald-400 uppercase tracking-widest">
        AURA Digital Exchange Protocol Agreement
      </p>
    </div>

    <div className="flex items-center gap-2 font-mono text-[10px] text-zinc-400 bg-zinc-100 dark:bg-zinc-900 px-3 py-1.5 rounded-lg border border-zinc-200/20">
      <Clock className="w-3.5 h-3.5 text-zinc-500" /> STATUS: AMENDED JUN 2026
    </div>
  </div>

  <div className="space-y-6 text-sm leading-relaxed">

    <section className="space-y-3">
      <h3 className="font-bold text-base text-zinc-950 dark:text-white flex items-center gap-2">
        <span className="text-xs font-mono font-black border border-emerald-500/20 px-2 py-0.5 rounded text-emerald-500 bg-emerald-500/5">
          1.0
        </span>
        Contractual Acceptance Framework
      </h3>

      <p>
        By downloading credentials, uploading gift cards, placing deposit requests, or browsing digital key inventories on 4ura.cards, you unconditionally bind your operations to these Terms of Service. If you disagree with any portion of these regulations, your access rights to the digital core registry are immediately terminated.
      </p>
    </section>

    <section className="space-y-3">
      <h3 className="font-bold text-base text-zinc-950 dark:text-white flex items-center gap-2">
        <span className="text-xs font-mono font-black border border-emerald-500/20 px-2 py-0.5 rounded text-emerald-500 bg-emerald-500/5">
          2.0
        </span>
        Licensing, Escrow & Digital Swapping Rules
      </h3>

      <p>
        AURA operates as a decentralised peer-to-peer security escrow for gift card vouchers and software activation pins:
      </p>

      <ul className="list-disc list-inside pl-2 space-y-2 text-xs font-medium">
        <li>
          <span className="text-zinc-950 dark:text-white">
            Seller Liabilities:
          </span>{' '}
          By selling codes, you represent and warrant that the input licenses are completely valid, authentic, acquired through legitimate channels, and loaded with the exact monetary value declared. Selling fraudulent, used, or revoked codes results in permanent pool forfeitures.
        </li>

        <li>
          <span className="text-zinc-950 dark:text-white">
            Buyer Obligations:
          </span>{' '}
          Buyers must have sufficient sandbox wallet balance before executing payments. Purchased codes are issued in real-time and must be verified or activated and integrated immediately.
        </li>
      </ul>
    </section>

    <section className="space-y-3">
      <h3 className="font-bold text-base text-zinc-950 dark:text-white flex items-center gap-2">
        <span className="text-xs font-mono font-black border border-emerald-500/20 px-2 py-0.5 rounded text-emerald-500 bg-emerald-500/5">
          3.0
        </span>
        Regulatory Verification Measures
      </h3>

      <div className="p-4.5 rounded-2xl border text-xs leading-relaxed space-y-2 bg-zinc-50 border-zinc-150 dark:bg-zinc-900 dark:border-zinc-850">
        <p className="font-bold flex items-center gap-2 text-amber-500 font-mono text-[10px] uppercase">
          <AlertCircle className="w-4 h-4 shrink-0" /> SECURITY VERIFICATION PROTOCOL
        </p>

        <p>
          Users are strictly responsible for maintaining individual credential parameters, API configurations, and multi-factor authenticator setup. AURA reserves the right to freeze accounts showing high velocity, pattern disruptions, or unrecognized regional activities without prior consent.
        </p>
      </div>
    </section>

    <section className="space-y-3">
      <h3 className="font-bold text-base text-zinc-950 dark:text-white flex items-center gap-2">
        <span className="text-xs font-mono font-black border border-emerald-500/20 px-2 py-0.5 rounded text-emerald-500 bg-emerald-500/5">
          4.0
        </span>
        Alterations to Infrastructure and Terms
      </h3>

      <p>
        We reserve maximum autonomy to amend digital fee parameters, discount rates, inventory policies, and general system frameworks. Continued utilization of AURA post-revision establishes binding acceptance of amended terms.
      </p>
    </section>

  </div>
</div>
);

const RefundPolicyContent = ({ isDark }) => (
 <div className="space-y-8 text-left">

  <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-6 border-zinc-200/55 dark:border-zinc-900 gap-4">
    <div className="space-y-1">
      <h2 className="font-display font-black text-2xl uppercase text-zinc-950 dark:text-white">
        Refund Policy
      </h2>

      <p className="text-xs font-mono font-bold text-emerald-500 dark:text-emerald-400 uppercase tracking-widest">
        AURA Delivery & Refund Regulation Indexes
      </p>
    </div>

    <div className="flex items-center gap-2 font-mono text-[10px] text-zinc-400 bg-zinc-100 dark:bg-zinc-900 px-3 py-1.5 rounded-lg border border-zinc-200/20">
      <Clock className="w-3.5 h-3.5 text-zinc-500" /> STATUS: AMENDED JUN 2026
    </div>
  </div>

  <div className="space-y-6 text-sm leading-relaxed">

    <section className="space-y-3">
      <h3 className="font-bold text-base text-zinc-950 dark:text-white flex items-center gap-2">
        <span className="text-xs font-mono font-black border border-emerald-500/20 px-2 py-0.5 rounded text-emerald-500 bg-emerald-500/5">
          1.0
        </span>
        Structural Digital Delivery Policy
      </h3>

      <p>
        Due to the instantaneous, unrecoverable nature of digital activation keys, gift cards, and virtual subscriptions,
        <span className="font-bold text-emerald-500 dark:text-emerald-400">
          {" "}all completed transactions on are standardly non-refundable.
        </span>
        {" "}Once a secure digital key has been revealed, generated, or copied from our server vaults, we cannot re-verify its validity or secure its status logic.
      </p>
    </section>

    <section className="space-y-3">
      <h3 className="font-bold text-base text-zinc-950 dark:text-white flex items-center gap-2">
        <span className="text-xs font-mono font-black border border-emerald-500/20 px-2 py-0.5 rounded text-emerald-500 bg-emerald-500/5">
          2.0
        </span>
        Qualifying Exceptions & Escrow Holds
      </h3>

      <p>
        We implement exceptions in specific structured scenarios to protect structural fairness:
      </p>

      <ul className="list-disc list-inside pl-2 space-y-2 text-xs font-medium">
        <li>
          <span className="text-zinc-950 dark:text-white">
            Code Malfunction:
          </span>
          {" "}If the issued license is proven to be invalid or deactivated PRIOR to delivery, and our inspection reports match this assertion, of which support is informed within 48 hours.
        </li>

        <li>
          <span className="text-zinc-950 dark:text-white">
            Unrevealed Voucher Keys:
          </span>
          {" "}If the transaction is completed, but the security seed passcode has NOT been revealed, rendered, or clicked in the drawer.
        </li>
      </ul>
    </section>

    <section className="space-y-3">
      <h3 className="font-bold text-base text-zinc-950 dark:text-white flex items-center gap-2">
        <span className="text-xs font-mono font-black border border-emerald-500/20 px-2 py-0.5 rounded text-emerald-500 bg-emerald-500/5">
          3.0
        </span>
        Dispute Resolution Framework
      </h3>

      <p>
        Before filing payment disputes, users must open an escrow dispute case by communicating with AURA. Attempting unauthorized credit chargebacks or claiming digital assets are not delivered while having unlocked keys leads to automated account flagging and permanent blacklist.
      </p>

      <div className="p-4.5 rounded-2xl border text-xs leading-relaxed space-y-1.5 bg-zinc-50 border-zinc-150 dark:bg-zinc-900 dark:border-zinc-850">
        <span className="font-bold block uppercase text-emerald-500 text-[10px] tracking-wider">
          Dispute Timeline:
        </span>

        <p>
          Case reviews are processed by the billing validation staff within 3 to 5 business days. Approved balances are credited directly back to the AURA wallet ecosystem in full.
        </p>
      </div>
    </section>

  </div>
</div>
);
