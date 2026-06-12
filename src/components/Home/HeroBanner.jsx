import React from 'react'
import Badge from '../Badge'
const HeroBanner = () => {
  return (
    <div className="bg-zinc-900 rounded-[1.5rem] p-8 sm:p-16 text-white relative overflow-hidden">
                    <div className="relative z-10 max-w-2xl space-y-6">
                      <Badge className="bg-white/10 text-white border-white/20">Limited Time Offer</Badge>
                      <h1 className="text-5xl sm:text-7xl font-display font-black tracking-tighter leading-none text-left">
                        GET UP TO <span className="text-zinc-400">20% OFF</span> ON APPLE CARDS.
                      </h1>
                      <p className="text-zinc-400 text-lg sm:text-xl font-medium max-w-lg text-left">
                        Instantly buy and sell gift cards with zero fees and maximum security.
                      </p>
                    </div>
                    <div className="absolute top-0 right-0 w-1/2 h-full opacity-20 pointer-events-none">
                      <div className="absolute inset-0 bg-gradient-to-l from-zinc-900 to-transparent z-10" />
                      <img src="https://picsum.photos/seed/giftcard/800/800" alt="Hero" className="w-full h-full object-cover" />
                    </div>
                    <span id='trend'></span>
                  </div>
  )
}

export default HeroBanner
