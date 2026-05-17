import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GlassCard } from '../ui/GlassCard';
import { Mission } from '@/src/types';
import { Scroll, CheckCircle2, Clock, Sparkles } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { playHabitComplete, playXPGain } from '@/src/lib/sounds';

interface DailyBountiesProps {
  bounties: Mission[];
  onCompleteBounty: (id: string) => void;
}

export function DailyBounties({ bounties, onCompleteBounty }: DailyBountiesProps) {
  const activeBounties = bounties.filter(b => b.type === 'bounty');
  if (activeBounties.length === 0) return null;

  return (
    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4 mt-8">
      <div className="flex items-center gap-3 mb-4">
        <Scroll className="w-5 h-5 text-secondary" />
        <h3 className="text-sm font-black uppercase tracking-widest text-foreground" style={{ fontFamily: 'Cinzel, serif' }}>Daily Bounties</h3>
        <span className="px-2 py-0.5 bg-secondary/10 border border-secondary/30 rounded-full text-[8px] font-black text-secondary uppercase tracking-widest">Resets at Midnight</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {activeBounties.map((bounty, i) => (
          <motion.div key={bounty.id} 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
          >
            <GlassCard 
              className={cn("p-5 border flex flex-col justify-between min-h-[120px] relative overflow-hidden group cursor-pointer transition-all",
                bounty.completed ? "border-emerald-500/30 bg-emerald-500/5" : "border-secondary/20 hover:border-secondary/50 bg-background/40"
              )}
              hover={!bounty.completed}
              onClick={() => { if (!bounty.completed) { playHabitComplete(); setTimeout(playXPGain, 300); onCompleteBounty(bounty.id); } }}
            >
              {/* Shimmer effect */}
              {!bounty.completed && (
                <motion.div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
              )}
              
              <div className="relative z-10 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <h4 className={cn("text-xs font-bold leading-snug", bounty.completed ? "text-emerald-500/50 line-through" : "text-foreground")}>
                    {bounty.description}
                  </h4>
                  {bounty.completed && <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />}
                </div>
              </div>

              <div className="relative z-10 flex items-center justify-between mt-4 pt-3 border-t border-white/5">
                <div className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-secondary">
                  <Sparkles className="w-3 h-3" /> +{bounty.rewardXp} XP
                </div>
                {!bounty.completed && (
                  <div className="text-[8px] font-bold text-foreground/40 uppercase tracking-widest flex items-center gap-1">
                    <Clock className="w-3 h-3" /> 14h left
                  </div>
                )}
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
