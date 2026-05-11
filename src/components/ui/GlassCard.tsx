import { ReactNode, useRef, useState } from 'react';
import { cn } from '@/src/lib/utils';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  tilt?: boolean;
  glow?: 'gold' | 'red' | 'purple' | 'green' | 'none';
  [key: string]: any;
}

const glowMap: Record<string, string> = {
  gold:   'rgba(212,175,55,0.35)',
  red:    'rgba(200,16,46,0.35)',
  purple: 'rgba(124,58,237,0.35)',
  green:  'rgba(16,185,129,0.35)',
  none:   'transparent',
};

export function GlassCard({ children, className, hover = true, tilt = false, glow = 'none', ...props }: GlassCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 140, damping: 20 });
  const springY = useSpring(y, { stiffness: 140, damping: 20 });
  const rotateX = useTransform(springY, [-0.5, 0.5], ['10deg', '-10deg']);
  const rotateY = useTransform(springX, [-0.5, 0.5], ['-10deg', '10deg']);
  
  // ══════ NEW: Mouse-tracking spotlight ══════
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const normalizedX = (e.clientX - rect.left) / rect.width;
    const normalizedY = (e.clientY - rect.top) / rect.height;
    
    // Update spotlight position
    setMousePos({ x: normalizedX * 100, y: normalizedY * 100 });
    
    if (tilt) {
      x.set(normalizedX - 0.5);
      y.set(normalizedY - 0.5);
    }
  };

  const handleMouseLeave = () => { 
    x.set(0); 
    y.set(0); 
    setMousePos({ x: 50, y: 50 });
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={tilt ? { rotateX, rotateY, transformStyle: 'preserve-3d', perspective: '800px' } : undefined}
      whileHover={hover && !tilt ? { y: -5, transition: { type: 'spring', stiffness: 300, damping: 22 } } : undefined}
      className={cn('glass rounded-xl relative overflow-hidden group/card fantasy-border', className)}
      {...props}
    >
      {/* Top inner highlight */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(212,175,55,0.3)] to-transparent pointer-events-none" />
      {/* Bottom inner shadow */}
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[rgba(200,16,46,0.15)] to-transparent pointer-events-none" />
      {/* Subtle grain overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-[rgba(212,175,55,0.03)] to-transparent pointer-events-none" />

      {/* ══════ NEW: Mouse-tracking spotlight ══════ */}
      {hover && (
        <div
          className="absolute inset-0 opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 pointer-events-none rounded-xl"
          style={{
            background: `radial-gradient(circle at ${mousePos.x}% ${mousePos.y}%, rgba(212,175,55,0.08) 0%, transparent 50%)`,
          }}
        />
      )}

      {/* Glow on hover */}
      {glow !== 'none' && (
        <div
          className="absolute inset-0 opacity-0 group-hover/card:opacity-100 transition-opacity duration-700 pointer-events-none rounded-xl"
          style={{ boxShadow: `0 0 50px ${glowMap[glow]}, 0 0 100px ${glowMap[glow].replace('0.35', '0.15')}` }}
        />
      )}

      {/* Shimmer sweep on hover */}
      {hover && (
        <div className="absolute inset-0 opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 pointer-events-none overflow-hidden rounded-xl">
          <motion.div
            className="absolute top-0 left-0 w-1/3 h-full"
            style={{ background: 'linear-gradient(105deg, transparent, rgba(212,175,55,0.08), transparent)' }}
            animate={{ x: ['-100%', '400%'] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear', repeatDelay: 1 }}
          />
        </div>
      )}

      {/* ══════ NEW: Corner accent dots ══════ */}
      {hover && (
        <>
          <div className="absolute top-2 left-2 w-1 h-1 rounded-full bg-[rgba(212,175,55,0.2)] opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 pointer-events-none" />
          <div className="absolute top-2 right-2 w-1 h-1 rounded-full bg-[rgba(212,175,55,0.2)] opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 pointer-events-none" />
          <div className="absolute bottom-2 left-2 w-1 h-1 rounded-full bg-[rgba(200,16,46,0.2)] opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 pointer-events-none" />
          <div className="absolute bottom-2 right-2 w-1 h-1 rounded-full bg-[rgba(200,16,46,0.2)] opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 pointer-events-none" />
        </>
      )}

      <div className="relative z-10" style={tilt ? { transform: 'translateZ(16px)' } : undefined}>
        {children}
      </div>
    </motion.div>
  );
}
