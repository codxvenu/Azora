import {
  ChevronDown,
  ChevronUp,
  HelpCircle,
  AlertTriangle,
} from "lucide-react";
import { AnimatePresence,motion } from "motion/react";
import React, { useState } from 'react'

const AccordionList = () => {
      const [expandedSections, setExpandedSections] = useState({
        overview: true,
        redemption: false,
        restrictions: false,
        terms: false,
        faq: false,
      });
     const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };
  return (
     <div className="space-y-4 border-t pt-8 border-zinc-200/60 dark:border-zinc-800/40">
                {/* Accordion 1: Product Overview */}
                <div
                  className="border-b border-zinc-200/60 dark:border-zinc-800/40 transition-all pb-5"
                >
                  <button
                    onClick={() => toggleSection("overview")}
                    className="w-full flex justify-between items-center py-3 text-left focus:outline-none"
                  >
                    <span className="text-sm font-bold uppercase tracking-widest font-mono flex items-center gap-3">
                      <span className="opacity-30">01</span> Product Overview
                    </span>
                    {expandedSections.overview ? (
                      <ChevronUp className="w-4 h-4 opacity-50" />
                    ) : (
                      <ChevronDown className="w-4 h-4 opacity-50" />
                    )}
                  </button>
    
                  <AnimatePresence>
                    {expandedSections.overview && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div
                          className="pt-2 pb-4 text-sm leading-relaxed space-y-4 text-zinc-650 font-sans dark:text-zinc-400"
                        >
                          <p>
                            Generate custom value codes instantly with 4ura.cards
                            technology. This digital product allows you to
                            immediately redeem credits and licenses without waiting
                            time. Authentic license codes are processed and
                            validated live through our dynamic SSL ledger system.
                          </p>
                          <p>
                            Highly recommended for gaming, system upgrades, software
                            license renewals, and direct cashout gifts. Purchases
                            are backed by our global 100% money-back guarantee
                            policy.
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
    
                {/* Accordion 2: Redemption Guide  */}
                <div
                  className="border-b border-zinc-200/60 dark:border-zinc-800/40 transition-all pb-5"
                >
                  <button
                    onClick={() => toggleSection("redemption")}
                    className="w-full flex justify-between items-center py-3 text-left focus:outline-none"
                  >
                    <span className="text-sm font-bold uppercase tracking-widest font-mono flex items-center gap-3">
                      <span className="opacity-30">02</span> Redemption Guide
                    </span>
                    {expandedSections.redemption ? (
                      <ChevronUp className="w-4 h-4 opacity-50" />
                    ) : (
                      <ChevronDown className="w-4 h-4 opacity-50" />
                    )}
                  </button>
    
                  <AnimatePresence>
                    {expandedSections.redemption && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        {/* Numbered Timeline */}
                        <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 pt-4 pb-4">
                          {[
                            {
                              step: "01",
                              title: "Purchase Product",
                              desc: "Securely pay using your wallet, card, or crypto",
                            },
                            {
                              step: "02",
                              title: "Receive Instantly",
                              desc: "Get your activation code in the Orders tab within 5 seconds",
                            },
                            {
                              step: "03",
                              title: "Redeem Code",
                              desc: "Enter secure credentials on standard platforms",
                            },
                            {
                              step: "04",
                              title: "Enjoy Digital Value",
                              desc: "Your balance activates immediately worldwide",
                            },
                          ].map((item, index) => (
                            <div
                              key={index}
                              className={`space-y-3 p-4 rounded-2xl border transition-colors bg-stone-50/50 border-zinc-200/40 dark:bg-zinc-950/40 dark:border-zinc-900`}
                            >
                              <p className="text-xl font-display font-black tracking-tighter text-amber-500">
                                {item.step}
                              </p>
                              <h4 className="font-bold text-xs uppercase tracking-wider">
                                {item.title}
                              </h4>
                              <p
                                className={`text-[11px] leading-relaxed text-zinc-400 dark:text-zinc-500`}
                              >
                                {item.desc}
                              </p>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
    
                {/* Accordion 3: Restrictions */}
                <div
                  className="border-b border-zinc-200/60 dark:border-zinc-800/40 transition-all pb-5"
                >
                  <button
                    onClick={() => toggleSection("restrictions")}
                    className="w-full flex justify-between items-center py-3 text-left focus:outline-none"
                  >
                    <span className="text-sm font-bold uppercase tracking-widest font-mono flex items-center gap-3">
                      <span className="opacity-30">03</span> Important Restrictions
                    </span>
                    {expandedSections.restrictions ? (
                      <ChevronUp className="w-4 h-4 opacity-50" />
                    ) : (
                      <ChevronDown className="w-4 h-4 opacity-50" />
                    )}
                  </button>
    
                  <AnimatePresence>
                    {expandedSections.restrictions && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div
                          className="pt-2 pb-4 text-xs space-y-3 leading-relaxed flex flex-col gap-1 text-zinc-650 dark:text-zinc-400"
                        >
                          <div className="flex gap-2.5 items-start bg-red-500/5 p-4 rounded-xl border border-red-500/20 text-red-500">
                            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                            <div>
                              <p className="font-bold uppercase tracking-wider text-[10px]">
                                Verify Activation Country
                              </p>
                              <p className="text-[11px]">
                                This specific key is legally restricted in select
                                regions: please double check global IP proxy and
                                billing address settings before redeeming.
                              </p>
                            </div>
                          </div>
                          <ul className="list-disc pl-5 space-y-1">
                            <li>
                              Each activation voucher can be redeemed exactly once.
                            </li>
                            <li>
                              Non-refundable digital product after official delivery
                              is complete.
                            </li>
                            <li>
                              Requires a valid account associated with the parent
                              service platform (Steam, Apple, Windows Retail, etc.).
                            </li>
                          </ul>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
    
                {/* Accordion 4: Terms & Conditions */}
                <div
                  className="border-b border-zinc-200/60 dark:border-zinc-800/40 transition-all pb-5"
                >
                  <button
                    onClick={() => toggleSection("terms")}
                    className="w-full flex justify-between items-center py-3 text-left focus:outline-none"
                  >
                    <span className="text-sm font-bold uppercase tracking-widest font-mono flex items-center gap-3">
                      <span className="opacity-30">04</span> Terms & Conditions
                    </span>
                    {expandedSections.terms ? (
                      <ChevronUp className="w-4 h-4 opacity-50" />
                    ) : (
                      <ChevronDown className="w-4 h-4 opacity-50" />
                    )}
                  </button>
    
                  <AnimatePresence>
                    {expandedSections.terms && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div
                          className="pt-2 pb-4 text-xs leading-relaxed space-y-3 text-zinc-400 dark:text-zinc-500"
                        >
                          <p>
                            By activating, selling, or acquiring digital items on
                            4ura.cards, you unconditionally agree to our structural
                            digital delivery guidelines. All cards, keys, and
                            subscriptions undergo strict anti-fraud verifications
                            through algorithmic pattern checkers.
                          </p>
                          <p>
                            Users are strictly liable for the security of their
                            generated passwords, API integrations, and two-factor
                            system parameters. Unauthorized transfers or chargebacks
                            are reported immediately to verification ledger
                            databases.
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
    
                {/* Accordion 5: FAQ */}
                <div
                  className="border-b border-zinc-200/60 dark:border-zinc-800/40 transition-all pb-5"
                >
                  <button
                    onClick={() => toggleSection("faq")}
                    className="w-full flex justify-between items-center py-3 text-left focus:outline-none"
                  >
                    <span className="text-sm font-bold uppercase tracking-widest font-mono flex items-center gap-3">
                      <span className="opacity-30">05</span> Frequently Asked
                      Questions (FAQ)
                    </span>
                    {expandedSections.faq ? (
                      <ChevronUp className="w-4 h-4 opacity-50" />
                    ) : (
                      <ChevronDown className="w-4 h-4 opacity-50" />
                    )}
                  </button>
    
                  <AnimatePresence>
                    {expandedSections.faq && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="pt-2 pb-4 space-y-4 text-sm">
                          {[
                            {
                              q: "How fast is instant delivery?",
                              a: "Within 5 seconds! As soon as payment validation is completed by our processing nodes, your voucher is added securely to your orders history tab.",
                            },
                            {
                              q: "What happens if a code fails to activate?",
                              a: "Every purchase is covered under our 4ura Integrity Shield. If the key code encounters technical difficulty, contact 24/7 client care live to inspect the activation register.",
                            },
                            {
                              q: "Can I redeem my card balance in India?",
                              a: "Yes! Toggle the currency switcher in the purchasing sidebar to dynamically display standard INR estimates.",
                            },
                          ].map((item, idx) => (
                            <div key={idx} className="space-y-1">
                              <p className="font-bold flex items-center gap-2 text-xs">
                                <HelpCircle className="w-3.5 h-3.5 text-amber-500 shrink-0" />{" "}
                                {item.q}
                              </p>
                              <p className="text-[11px] leading-relaxed pl-5.5 text-zinc-600 dark:text-zinc-400" >
                                {item.a}
                              </p>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
  )
}

export default AccordionList
