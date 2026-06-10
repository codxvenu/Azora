import React from 'react'

const Footer = ({ setCurrentView }) => {
  return (
   <footer className="py-12 border-t transition-colors duration-500 bg-white border-zinc-100 text-zinc-950 dark:bg-[#0a0a0c] dark:border-zinc-900 dark:text-zinc-400">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
      <div className="space-y-4">
        <h3 className="text-xl font-display font-black tracking-tighter text-zinc-950 dark:text-white">
          AURA
        </h3>
        <p className="text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
          The world's most trusted digital marketplace for gift cards and game
          keys.
        </p>
      </div>

      <div>
        <h4 className="font-bold mb-4 text-zinc-900 dark:text-zinc-200">
          Marketplace
        </h4>
        <ul className="space-y-2 text-sm text-zinc-500 dark:text-zinc-400">
          <li>
            <button
              onClick={() => setCurrentView("browse")}
              className="transition-colors hover:text-black dark:hover:text-white"
            >
              Browse Cards
            </button>
          </li>
          <li>
            <button
              onClick={() => setCurrentView("sell")}
              className="transition-colors hover:text-black dark:hover:text-white"
            >
              Sell Codes
            </button>
          </li>
          <li>
            <button className="transition-colors hover:text-black dark:hover:text-white">
              Trending Deals
            </button>
          </li>
        </ul>
      </div>

      <div>
        <h4 className="font-bold mb-4 text-zinc-900 dark:text-zinc-200">
          Support
        </h4>
        <ul className="space-y-2 text-sm text-zinc-500 dark:text-zinc-400">
          <li>
            <button className="transition-colors hover:text-black dark:hover:text-white">
              Help Center
            </button>
          </li>
          <li>
            <button className="transition-colors hover:text-black dark:hover:text-white">
              Safety & Trust
            </button>
          </li>
          <li>
            <button className="transition-colors hover:text-black dark:hover:text-white">
              Contact Us
            </button>
          </li>
        </ul>
      </div>

      <div>
        <h4 className="font-bold mb-4 text-zinc-900 dark:text-zinc-200">
          Legal
        </h4>
        <ul className="space-y-2 text-sm text-zinc-500 dark:text-zinc-400">
          <li>
            <button className="transition-colors hover:text-black dark:hover:text-white">
              Privacy Policy
            </button>
          </li>
          <li>
            <button className="transition-colors hover:text-black dark:hover:text-white">
              Terms of Service
            </button>
          </li>
          <li>
            <button className="transition-colors hover:text-black dark:hover:text-white">
              Refund Policy
            </button>
          </li>
        </ul>
      </div>
    </div>

    <div className="mt-12 pt-8 border-t flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-medium uppercase tracking-widest border-zinc-100 text-zinc-400 dark:border-zinc-900 dark:text-zinc-500">
      <p>© 2024 AURA DIGITAL MARKETPLACE. ALL RIGHTS RESERVED.</p>

      <div className="flex gap-6 text-zinc-400 dark:text-zinc-500">
        <button className="transition-colors hover:text-black dark:hover:text-white">
          Twitter
        </button>
        <button className="transition-colors hover:text-black dark:hover:text-white">
          Discord
        </button>
        <button className="transition-colors hover:text-black dark:hover:text-white">
          Instagram
        </button>
      </div>
    </div>
  </div>
</footer>
  )
}

export default Footer
