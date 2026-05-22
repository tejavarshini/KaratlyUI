import React from 'react';
import { motion } from 'framer-motion';

export function SuccessAnimation({ text }: { text?: string }) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        className="w-32 h-32 rounded-full bg-accent/20 flex items-center justify-center relative mb-6"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 15 }}
          className="w-24 h-24 rounded-full bg-accent text-accent-foreground flex items-center justify-center shadow-[0_0_40px_rgba(212,175,55,0.6)]"
        >
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </motion.div>
        
        {/* Simple particle effects */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 1, scale: 0, x: 0, y: 0 }}
            animate={{ 
              opacity: 0,
              scale: Math.random() * 1 + 0.5,
              x: (Math.random() - 0.5) * 200,
              y: (Math.random() - 0.5) * 200
            }}
            transition={{ duration: 1, delay: 0.1, ease: "easeOut" }}
            className="absolute w-3 h-3 bg-accent rounded-full"
            style={{ 
              top: '50%', left: '50%',
              marginTop: '-6px', marginLeft: '-6px'
            }}
          />
        ))}
      </motion.div>
      
      {text && (
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="font-serif text-2xl font-semibold text-foreground"
        >
          {text}
        </motion.h2>
      )}
    </div>
  );
}
