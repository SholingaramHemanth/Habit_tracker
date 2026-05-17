import { useEffect, useState, useCallback } from 'react';
import { motion, useMotionValue, useSpring, AnimatePresence } from 'motion/react';

interface Shockwave {
  id: number;
  x: number;
  y: number;
}

let shockwaveCounter = 0;

export function MagicCursor() {
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [shockwaves, setShockwaves] = useState<Shockwave[]>([]);

  // Raw mouse coordinates
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Core dot spring (very responsive)
  const coreX = useSpring(mouseX, { stiffness: 2000, damping: 30, mass: 0.05 });
  const coreY = useSpring(mouseY, { stiffness: 2000, damping: 30, mass: 0.05 });

  // Orbit container spring (smoothly trails the core)
  const orbitX = useSpring(mouseX, { stiffness: 600, damping: 35, mass: 0.15 });
  const orbitY = useSpring(mouseY, { stiffness: 600, damping: 35, mass: 0.15 });

  useEffect(() => {
    const move = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    const over = (e: MouseEvent) => {
      const el = e.target as HTMLElement;
      setIsHovering(
        el.matches('button, a, input, [role="button"], select, textarea, label') ||
        !!el.closest('button, a, [role="button"]')
      );
    };

    window.addEventListener('mousemove', move, { passive: true });
    window.addEventListener('mouseover', over, { passive: true });
    
    return () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseover', over);
    };
  }, [mouseX, mouseY]);

  // Click shockwave effect
  const handleClick = useCallback((e: MouseEvent) => {
    setIsClicking(true);
    setTimeout(() => setIsClicking(false), 150);

    const newWave = { id: shockwaveCounter++, x: e.clientX, y: e.clientY };
    setShockwaves(prev => [...prev, newWave]);
    
    setTimeout(() => {
      setShockwaves(prev => prev.filter(w => w.id !== newWave.id));
    }, 800);
  }, []);

  useEffect(() => {
    window.addEventListener('click', handleClick, { passive: true });
    return () => window.removeEventListener('click', handleClick);
  }, [handleClick]);

  // We will place 3 crystals in a triangle
  const crystals = [0, 1, 2];

  return (
    <>
      <style>{`* { cursor: none !important; }`}</style>

      {/* Orbiting Crystals Container */}
      <motion.div
        className="fixed pointer-events-none z-[9997] flex items-center justify-center mix-blend-screen"
        style={{
          x: orbitX, y: orbitY,
          width: 60, height: 60,
          marginLeft: -30, marginTop: -30,
        }}
        animate={{
          rotate: isHovering ? 360 : 360,
          scale: isHovering ? 1.5 : isClicking ? 0.8 : 1,
        }}
        transition={{
          rotate: { duration: isHovering ? 2 : 6, repeat: Infinity, ease: 'linear' },
          scale: { type: 'spring', stiffness: 400, damping: 25 }
        }}
      >
        {crystals.map((i) => {
          // Angle in radians
          const angle = (i * 2 * Math.PI) / crystals.length;
          const radius = isHovering ? 24 : 16;
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;

          return (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full"
              style={{
                backgroundColor: '#ffd700',
                boxShadow: '0 0 10px rgba(212,175,55,0.8), 0 0 20px rgba(139,92,246,0.6)',
                x, y,
                clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)', // Diamond crystal shape
              }}
              animate={{
                rotate: -360, // Counter-rotate so they stay upright, or let them spin
              }}
              transition={{
                rotate: { duration: 4, repeat: Infinity, ease: 'linear' }
              }}
            />
          );
        })}
        
        {/* Connection lines between crystals (visible on hover) */}
        <motion.div 
          className="absolute inset-0 rounded-full border border-primary/30"
          animate={{ opacity: isHovering ? 1 : 0, scale: isHovering ? 1 : 0.5 }}
          transition={{ duration: 0.3 }}
        />
      </motion.div>

      {/* Primary Glowing Core */}
      <motion.div
        className="fixed pointer-events-none z-[9999] flex items-center justify-center rounded-full bg-white mix-blend-screen"
        style={{
          x: coreX, y: coreY,
          width: 8, height: 8,
          marginLeft: -4, marginTop: -4,
          boxShadow: '0 0 15px #ffd700, 0 0 30px rgba(212,175,55,0.8)'
        }}
        animate={{ 
          scale: isClicking ? 0.5 : isHovering ? 0.2 : 1,
          backgroundColor: isHovering ? '#fff8b0' : '#ffffff'
        }}
        transition={{ type: 'spring', stiffness: 800, damping: 15 }}
      />

      {/* Elaborate Arcane Shockwaves on Click */}
      <AnimatePresence>
        {shockwaves.map(wave => (
          <motion.div
            key={wave.id}
            className="fixed pointer-events-none z-[9996] rounded-full border border-[#ffd700] mix-blend-screen"
            style={{
              left: wave.x,
              top: wave.y,
              width: 100, height: 100,
              marginLeft: -50, marginTop: -50,
              boxShadow: '0 0 20px rgba(212,175,55,0.5), inset 0 0 20px rgba(212,175,55,0.3)'
            }}
            initial={{ scale: 0.1, opacity: 1, rotate: 0 }}
            animate={{ scale: 2, opacity: 0, rotate: 90 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        ))}
      </AnimatePresence>
    </>
  );
}
