import { motion } from 'motion/react';
import { useState, useEffect } from 'react';

export function SplashScreen({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 600);
    const t2 = setTimeout(() => setPhase(2), 1800);
    const t3 = setTimeout(() => onComplete(), 3200);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-[200] bg-[#060409] flex items-center justify-center overflow-hidden"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      {/* Radial pulse rings */}
      {[0, 1, 2].map(i => (
        <motion.div key={i} className="absolute w-64 h-64 rounded-full border border-primary/20"
          initial={{ scale: 0, opacity: 0.8 }}
          animate={{ scale: [0, 4], opacity: [0.6, 0] }}
          transition={{ duration: 2.5, delay: 0.3 * i, repeat: Infinity, ease: 'easeOut' }} />
      ))}

      {/* Background energy beams */}
      <motion.div className="absolute w-full h-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}>
        {Array.from({ length: 8 }).map((_, i) => (
          <motion.div key={i} className="absolute left-1/2 top-1/2 origin-left h-px"
            style={{ width: 600, transform: `rotate(${i * 45}deg)`,
              background: 'linear-gradient(90deg, rgba(200,16,46,0.3), transparent)' }}
            initial={{ opacity: 0 }} animate={{ opacity: [0, 0.5, 0] }}
            transition={{ duration: 2, delay: i * 0.2, repeat: Infinity }} />
        ))}
      </motion.div>

      {/* Main logo container */}
      <div className="relative flex flex-col items-center gap-8 z-10">
        {/* Sword/Shield icon */}
        <motion.div className="relative w-24 h-24"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: phase >= 0 ? 1 : 0, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}>
          {/* Conic gradient ring */}
          <motion.div className="absolute inset-0 rounded-full"
            style={{ background: 'conic-gradient(from 0deg, #c8102e, #d4af37, #7c3aed, #c8102e)' }}
            animate={{ rotate: 360 }}
            transition={{ duration: 4, repeat: Infinity, ease: 'linear' }} />
          <div className="absolute inset-[3px] rounded-full bg-[#060409] flex items-center justify-center">
            <motion.span className="text-4xl"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}>
              ⚔️
            </motion.span>
          </div>
        </motion.div>

        {/* Title text */}
        <motion.div className="text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: phase >= 1 ? 1 : 0, y: phase >= 1 ? 0 : 30 }}
          transition={{ duration: 0.8 }}>
          <h1 className="text-5xl font-black tracking-[0.5em] uppercase text-transparent bg-clip-text"
            style={{
              fontFamily: 'Cinzel, serif',
              backgroundImage: 'linear-gradient(to right, #b8960c, #ffd700, #fff8b0, #ffd700, #b8960c)',
              backgroundSize: '200% auto',
              animation: 'shine-gold 3s linear infinite',
            }}>
            AURA
          </h1>
          <motion.p className="text-[10px] font-black uppercase tracking-[0.6em] text-foreground/30 mt-2"
            initial={{ opacity: 0 }} animate={{ opacity: phase >= 1 ? 1 : 0 }}
            transition={{ delay: 0.3 }}>
            The Legend Begins
          </motion.p>
        </motion.div>

        {/* Loading bar */}
        <motion.div className="w-48 h-[2px] bg-foreground/10 rounded-full overflow-hidden"
          initial={{ opacity: 0 }} animate={{ opacity: phase >= 1 ? 1 : 0 }}>
          <motion.div className="h-full bg-gradient-to-r from-primary via-secondary to-accent rounded-full"
            initial={{ width: '0%' }}
            animate={{ width: phase >= 2 ? '100%' : phase >= 1 ? '60%' : '0%' }}
            transition={{ duration: phase >= 2 ? 0.8 : 1.2, ease: 'easeOut' }} />
        </motion.div>

        {/* Loading text */}
        <motion.p className="text-[9px] font-black uppercase tracking-[0.4em] text-foreground/20"
          initial={{ opacity: 0 }} animate={{ opacity: phase >= 1 ? 1 : 0 }}>
          {phase >= 2 ? 'Entering the Realm...' : 'Channeling Energy...'}
        </motion.p>
      </div>

      {/* Floating embers */}
      {Array.from({ length: 15 }).map((_, i) => (
        <motion.div key={`ember-${i}`} className="absolute rounded-full"
          style={{
            width: 2 + Math.random() * 3, height: 2 + Math.random() * 3,
            left: `${Math.random() * 100}%`, bottom: '-5px',
            backgroundColor: ['#d4af37', '#c8102e', '#ff6b35'][i % 3],
            boxShadow: `0 0 8px ${['#d4af37', '#c8102e', '#ff6b35'][i % 3]}`,
          }}
          animate={{ y: [0, -window.innerHeight], opacity: [0, 0.8, 0] }}
          transition={{ duration: 3 + Math.random() * 4, repeat: Infinity, delay: Math.random() * 2 }} />
      ))}
    </motion.div>
  );
}
