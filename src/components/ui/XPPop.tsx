import { motion, AnimatePresence } from 'motion/react';
import { useEffect, useState } from 'react';

interface XPPopProps {
  trigger: number;
  amount?: number;
}

export function XPPop({ trigger, amount = 10 }: XPPopProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (trigger > 0) {
      setShow(true);
      const timer = setTimeout(() => setShow(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [trigger]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 0, scale: 0.5 }}
          animate={{ opacity: 1, y: -40, scale: 1.2 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="absolute pointer-events-none z-50 font-bold text-accent text-xl drop-shadow-[0_0_10px_rgba(16,185,129,0.5)]"
          style={{ left: '50%', transform: 'translateX(-50%)' }}
        >
          +{amount} XP
        </motion.div>
      )}
    </AnimatePresence>
  );
}
