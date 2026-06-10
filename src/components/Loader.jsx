import React from 'react'
import { motion } from 'motion/react'
const Loader = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <motion.div 
          animate={{ scale: [1, 1.1, 1] }} 
          transition={{ repeat: Infinity, duration: 2 }}
          className="text-4xl font-display font-bold tracking-tighter"
        >
          AURA
        </motion.div>
      </div>
  )
}

export default Loader
