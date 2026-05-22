import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface PopupModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  autoCloseMs?: number;
}

export function PopupModal({ isOpen, onClose, title, children, autoCloseMs }: PopupModalProps) {
  useEffect(() => {
    if (isOpen && autoCloseMs) {
      const timer = setTimeout(() => {
        onClose();
      }, autoCloseMs);
      return () => clearTimeout(timer);
    }
  }, [isOpen, autoCloseMs, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 right-0 z-[70] bg-popover border-t border-popover-border rounded-t-3xl shadow-2xl max-h-[90vh] overflow-y-auto"
            style={{ maxWidth: '390px', margin: '0 auto' }}
          >
            <div className="w-12 h-1.5 bg-muted rounded-full mx-auto my-3" />
            
            <div className="px-6 pb-6">
              <div className="flex justify-between items-center mb-4">
                {title && <h2 className="font-serif text-xl font-semibold text-foreground">{title}</h2>}
                <button 
                  onClick={onClose}
                  className="w-8 h-8 rounded-full bg-muted/50 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors ml-auto"
                >
                  <X size={18} />
                </button>
              </div>
              
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
