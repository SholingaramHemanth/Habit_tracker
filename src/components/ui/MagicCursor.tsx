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

  // Raw mouse coordinates (no re-renders!)
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Ultra-responsive spring for the main core dot
  const coreX = useSpring(mouseX, { stiffness: 1500, damping: 40, mass: 0.05 });
  const coreY = useSpring(mouseY, { stiffness: 1500, damping: 40, mass: 0.05 });

  // Floating ambient aura (lags slightly behind for an ethereal feel)
  const auraX = useSpring(mouseX, { stiffness: 300, damping: 30, mass: 0.2 });
  const auraY = useSpring(mouseY, { stiffness: 300, damping: 30, mass: 0.2 });

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

  return (
    <>
      <style>{`* { cursor: none !important; }`}</style>

      {/* Floating Ambient Aura */}
      <motion.div
        className="fixed pointer-events-none z-[9998] rounded-full mix-blend-screen"
        style={{
          x: auraX, y: auraY,
          width: 60, height: 60,
          marginLeft: -30, marginTop: -30,
          background: isHovering 
            ? 'radial-gradient(circle, rgba(212,175,55,0.15) 0%, rgba(212,175,55,0) 70%)'
            : 'radial-gradient(circle, rgba(200,16,46,0.15) 0%, rgba(200,16,46,0) 70%)',
        }}
        animate={{
          scale: isHovering ? 1.5 : isClicking ? 0.8 : [1, 1.2, 1],
        }}
        transition={
          isHovering || isClicking 
            ? { type: 'spring', stiffness: 300, damping: 20 }
            : { duration: 2, repeat: Infinity, ease: 'easeInOut' }
        }
      />

      {/* Inner Glowing Core */}
      <motion.div
        className="fixed pointer-events-none z-[9999] rounded-full flex items-center justify-center"
        style={{
          x: coreX, y: coreY,
          width: 12, height: 12,
          marginLeft: -6, marginTop: -6,
          backgroundColor: isHovering ? '#d4af37' : '#c8102e',
          boxShadow: isHovering 
            ? '0 0 10px #d4af37, 0 0 20px #d4af37, 0 0 30px #f5d478' 
            : '0 0 10px #c8102e, 0 0 20px #c8102e, 0 0 30px #ff6b6b',
        }}
        animate={{ 
          scale: isClicking ? 0.5 : isHovering ? 0.8 : 1,
        }}
        transition={{ type: 'spring', stiffness: 500, damping: 15 }}
      >
        {/* Diamond rotation on hover */}
        <motion.div 
          className="absolute inset-0 bg-white"
          style={{ clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }}
          animate={{ 
            rotate: isHovering ? 180 : 0,
            opacity: isHovering ? 0.8 : 0 
          }}
          transition={{ duration: 0.3 }}
        />
      </motion.div>

      {/* Click Shockwaves */}
      <AnimatePresence>
        {shockwaves.map(wave => (
          <motion.div
            key={wave.id}
            className="fixed pointer-events-none z-[9997] rounded-full border-2"
            style={{
              left: wave.x,
              top: wave.y,
              width: 100,
              height: 100,
              marginLeft: -50,
              marginTop: -50,
              borderColor: isHovering ? 'rgba(212,175,55,0.8)' : 'rgba(200,16,46,0.8)',
              boxShadow: isHovering ? '0 0 20px rgba(212,175,55,0.5)' : '0 0 20px rgba(200,16,46,0.5)',
            }}
            initial={{ scale: 0.1, opacity: 1, borderWidth: '4px' }}
            animate={{ scale: 2, opacity: 0, borderWidth: '0px' }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        ))}
      </AnimatePresence>
    </>
  );
}
