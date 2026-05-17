import React from 'react';
import { motion } from 'motion/react';
import { GlassCard } from '../ui/GlassCard';
import { Mission } from '@/src/types';
import { ShieldAlert, Swords, Heart, Skull } from 'lucide-react';
import { cn } from '@/src/lib/utils';

interface BossBattleProps {
  boss: Mission;
}

export function BossBattle({ boss }: BossBattleProps) {
  if (boss.type !== 'boss' || !boss.bossHp || !boss.bossMaxHp) return null;

  const hpPercent = Math.max(0, Math.min(100, (boss.bossHp / boss.bossMaxHp) * 100));
  const isDefeated = boss.bossHp <= 0;

  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="mt-8">
      <GlassCard className="p-0 border-red-500/30 overflow-hidden relative" hover={false}>
        {/* Animated magma background */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/black-scales.png')] opacity-20 z-0" />
        <motion.div className="absolute -bottom-20 -left-20 w-64 h-64 bg-red-600/20 blur-[80px] rounded-full z-0"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }} transition={{ duration: 4, repeat: Infinity }} />
        
        <div className="relative z-10 p-8 flex flex-col md:flex-row items-center gap-8">
          {/* Boss Avatar */}
          <div className="relative w-32 h-32 shrink-0">
            <motion.div className="absolute inset-0 border-4 border-red-500/50 rounded-full border-dashed"
              animate={{ rotate: isDefeated ? 0 : 360 }} transition={{ duration: 10, repeat: Infinity, ease: 'linear' }} />
            <div className={cn("absolute inset-2 bg-gradient-to-br from-red-900 to-black rounded-full flex items-center justify-center text-5xl shadow-[0_0_30px_rgba(220,38,38,0.5)] transition-all duration-1000", isDefeated && "grayscale opacity-50 scale-90")}>
              {isDefeated ? '💀' : '🐉'}
            </div>
            {/* Hit effect overlay */}
            <motion.div className="absolute inset-0 bg-red-500 rounded-full mix-blend-overlay"
              initial={{ opacity: 0 }} whileTap={{ opacity: 1 }} />
          </div>

          <div className="flex-1 space-y-4 w-full">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-black uppercase tracking-widest text-red-500 flex items-center gap-2" style={{ fontFamily: 'Cinzel, serif', textShadow: '0 0 20px rgba(220,38,38,0.5)' }}>
                  <ShieldAlert className="w-6 h-6" /> {boss.description}
                </h3>
                <p className="text-xs text-red-400/60 font-bold uppercase tracking-widest mt-1">Epic Boss Encounter</p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-black text-white">{boss.bossHp} <span className="text-sm text-white/40 uppercase tracking-widest">/ {boss.bossMaxHp} HP</span></div>
              </div>
            </div>

            {/* HP Bar */}
            <div className="h-6 bg-black/60 rounded-full border border-red-500/30 overflow-hidden relative shadow-inner">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-30 z-10" />
              <motion.div 
                className="h-full relative"
                style={{ 
                  width: `${hpPercent}%`,
                  background: 'linear-gradient(90deg, #7f1d1d, #dc2626, #ef4444)'
                }}
                layout
                transition={{ type: 'spring', stiffness: 50 }}
              >
                {/* Flowing energy inside HP bar */}
                <motion.div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                  animate={{ x: ['-100%', '200%'] }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }} />
              </motion.div>
            </div>

            <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
              <span className="text-emerald-500 flex items-center gap-1"><Swords className="w-3 h-3" /> Complete habits to deal damage</span>
              <span className="text-red-500 flex items-center gap-1"><Heart className="w-3 h-3" /> Missed habits damage you</span>
            </div>
          </div>
        </div>

        {isDefeated && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 bg-black/80 backdrop-blur-sm z-20 flex flex-col items-center justify-center text-center p-8">
            <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Infinity }}>
              <Skull className="w-16 h-16 text-yellow-500 mb-4 drop-shadow-[0_0_20px_rgba(234,179,8,0.5)]" />
            </motion.div>
            <h2 className="text-4xl font-black text-liquid-gold uppercase tracking-widest mb-2" style={{ fontFamily: 'Cinzel, serif' }}>Boss Defeated!</h2>
            <p className="text-white/60 font-medium">+ {boss.rewardXp} XP & Legendary Relic Unlocked</p>
          </motion.div>
        )}
      </GlassCard>
    </motion.div>
  );
}
