import { motion, AnimatePresence } from 'motion/react';
import { useEffect, useState } from 'react';
import { Sparkles } from 'lucide-react';

interface XPPopProps {
  trigger: number;
  amount?: number;
}

export function XPPop({ trigger, amount = 10 }: XPPopProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (trigger > 0) {
      setShow(true);
      const timer = setTimeout(() => setShow(false), 1500);
      return () => clearTimeout(timer);
    }
  }, [trigger]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 0, scale: 0.2, rotateX: 90 }}
          animate={{ opacity: 1, y: -60, scale: 1.5, rotateX: 0 }}
          exit={{ opacity: 0, y: -100, scale: 0.8, filter: 'blur(10px)' }}
          transition={{ type: "spring", stiffness: 200, damping: 12 }}
          className="absolute pointer-events-none z-50 flex items-center justify-center gap-2"
          style={{ left: '50%', transform: 'translateX(-50%)' }}
        >
          {/* Arcane burst behind the text */}
          <motion.div 
            className="absolute inset-0 bg-accent/20 rounded-full blur-[20px]"
            animate={{ scale: [1, 3, 1], opacity: [0.8, 0, 0.8] }}
            transition={{ duration: 1 }}
          />
          <motion.div 
            className="absolute w-24 h-24 border border-accent/50 rounded-full"
            animate={{ scale: [0.5, 2.5], opacity: [1, 0] }}
            transition={{ duration: 0.8 }}
          />
          <Sparkles className="w-6 h-6 text-accent drop-shadow-[0_0_15px_rgba(212,175,55,0.9)]" />
          <span className="font-black text-3xl tracking-tighter text-transparent bg-clip-text bg-gradient-to-t from-[#b38b22] via-[#ffd700] to-[#fff8b0] drop-shadow-[0_0_20px_rgba(212,175,55,0.8)]" style={{ fontFamily: 'Cinzel, serif' }}>
            +{amount} XP
          </span>
          <Sparkles className="w-6 h-6 text-accent drop-shadow-[0_0_15px_rgba(212,175,55,0.9)]" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
