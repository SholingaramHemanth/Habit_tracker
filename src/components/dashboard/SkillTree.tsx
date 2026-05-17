import React from 'react';
import { motion } from 'motion/react';
import { GlassCard } from '../ui/GlassCard';
import { User } from '@/src/types';
import { Sword, Wand2, Star, Lock, Check } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { playAchievement, playButtonClick } from '@/src/lib/sounds';

interface SkillTreeProps {
  user: User;
  onUnlockPerk: (perkId: string) => void;
}

const PERKS = {
  warrior: [
    { id: 'w1', name: 'Iron Resolve', description: 'Streaks give 10% more XP', cost: 1, row: 0, col: 1 },
    { id: 'w2', name: 'Second Wind', description: 'Once per week, restore a broken streak', cost: 2, row: 1, col: 0 },
    { id: 'w3', name: 'Berserker', description: 'Double damage to Bosses', cost: 2, row: 1, col: 2 },
    { id: 'w4', name: 'Warlord', description: 'Unlock Legendary Warrior Avatar', cost: 3, row: 2, col: 1 },
  ],
  sorceress: [
    { id: 's1', name: 'Arcane Focus', description: 'Habits completed before 9AM give +5 XP', cost: 1, row: 0, col: 1 },
    { id: 's2', name: 'Time Warp', description: 'Snoozing a habit costs no penalty', cost: 2, row: 1, col: 0 },
    { id: 's3', name: 'Mana Shield', description: 'Immune to XP loss from missed habits on weekends', cost: 2, row: 1, col: 2 },
    { id: 's4', name: 'Archmage', description: 'Unlock Legendary Sorceress Avatar', cost: 3, row: 2, col: 1 },
  ],
  mystic: [
    { id: 'm1', name: 'Astral Link', description: 'All habits gain +2 base XP', cost: 1, row: 0, col: 1 },
    { id: 'm2', name: 'Fate Weaver', description: 'Reroll Daily Bounties once per day', cost: 2, row: 1, col: 0 },
    { id: 'm3', name: 'Aura Bloom', description: 'Gold drops from habits increased by 20%', cost: 2, row: 1, col: 2 },
    { id: 'm4', name: 'Grand Mystic', description: 'Unlock Legendary Mystic Avatar', cost: 3, row: 2, col: 1 },
  ]
};

export function SkillTree({ user, onUnlockPerk }: SkillTreeProps) {
  const rpgClass = user.rpgClass || 'warrior';
  const classPerks = PERKS[rpgClass];
  
  const iconMap = { warrior: Sword, sorceress: Wand2, mystic: Star };
  const ClassIcon = iconMap[rpgClass] || Sword;

  const handleUnlock = (perkId: string, cost: number) => {
    if (user.skillPoints >= cost && !user.unlockedPerks.includes(perkId)) {
      onUnlockPerk(perkId);
      playAchievement();
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black uppercase tracking-widest text-aura-gradient" style={{ fontFamily: 'Cinzel, serif' }}>
            {rpgClass} Mastery
          </h2>
          <p className="text-xs font-bold text-foreground/40 uppercase tracking-widest mt-1">Unlock your true potential</p>
        </div>
        <div className="flex items-center gap-3 px-4 py-2 bg-primary/10 border border-primary/30 rounded-xl">
          <Star className="w-5 h-5 text-primary animate-pulse" />
          <div className="text-sm font-black text-foreground">
            {user.skillPoints} <span className="text-foreground/50 uppercase text-[10px] tracking-widest">Skill Points</span>
          </div>
        </div>
      </div>

      <GlassCard className="p-8 border-primary/20 relative overflow-hidden" hover={false}>
        {/* Background ambient light */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/10 blur-[100px] rounded-full pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center justify-center min-h-[400px]">
          {/* Base Node (Class Origin) */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20">
            <div className="w-16 h-16 rounded-full border-2 border-primary bg-background/80 flex items-center justify-center shadow-[0_0_30px_rgba(200,16,46,0.5)]">
              <ClassIcon className="w-8 h-8 text-primary" />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-12 pt-24 relative w-full max-w-2xl mx-auto">
            {/* Draw connection lines behind nodes */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none -z-10" style={{ top: '80px' }}>
              <path d="M 50% 0 L 50% 80" stroke="rgba(200,16,46,0.3)" strokeWidth="4" fill="none" />
              <path d="M 50% 120 L 16.66% 200" stroke="rgba(200,16,46,0.3)" strokeWidth="4" fill="none" />
              <path d="M 50% 120 L 83.33% 200" stroke="rgba(200,16,46,0.3)" strokeWidth="4" fill="none" />
              <path d="M 16.66% 240 L 50% 320" stroke="rgba(200,16,46,0.3)" strokeWidth="4" fill="none" />
              <path d="M 83.33% 240 L 50% 320" stroke="rgba(200,16,46,0.3)" strokeWidth="4" fill="none" />
            </svg>

            {classPerks.map((perk) => {
              const isUnlocked = user.unlockedPerks.includes(perk.id);
              const canAfford = user.skillPoints >= perk.cost;
              // Simple check: row 0 is always available, row 1 needs row 0 unlocked, row 2 needs both row 1s unlocked
              let isAvailable = false;
              if (perk.row === 0) isAvailable = true;
              if (perk.row === 1 && user.unlockedPerks.some(p => classPerks.find(cp => cp.id === p)?.row === 0)) isAvailable = true;
              if (perk.row === 2 && user.unlockedPerks.filter(p => classPerks.find(cp => cp.id === p)?.row === 1).length === 2) isAvailable = true;

              return (
                <div key={perk.id} className={cn("flex flex-col items-center gap-4 relative", `col-start-${perk.col + 1}`)}>
                  <motion.button
                    onClick={() => { if (isAvailable && canAfford && !isUnlocked) handleUnlock(perk.id, perk.cost); playButtonClick(); }}
                    whileHover={isAvailable && !isUnlocked ? { scale: 1.1 } : {}}
                    whileTap={isAvailable && !isUnlocked ? { scale: 0.95 } : {}}
                    className={cn(
                      "w-20 h-20 rounded-full flex flex-col items-center justify-center border-2 transition-all relative group z-10",
                      isUnlocked 
                        ? "bg-secondary/20 border-secondary shadow-[0_0_30px_rgba(212,175,55,0.4)]" 
                        : isAvailable 
                          ? canAfford ? "bg-primary/10 border-primary/50 hover:border-primary hover:bg-primary/20 cursor-pointer" : "bg-white/5 border-white/20 cursor-not-allowed"
                          : "bg-black/50 border-white/10 opacity-50 cursor-not-allowed grayscale"
                    )}
                  >
                    {isUnlocked ? <Check className="w-8 h-8 text-secondary" /> : <Lock className={cn("w-6 h-6", isAvailable ? "text-white/50" : "text-white/20")} />}
                    <span className="absolute -bottom-2 bg-background border px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest"
                      style={{ borderColor: isUnlocked ? '#d4af37' : 'rgba(255,255,255,0.2)' }}>
                      {perk.cost} SP
                    </span>
                  </motion.button>
                  <div className="text-center w-40">
                    <h4 className={cn("text-xs font-black uppercase tracking-widest", isUnlocked ? "text-secondary" : "text-foreground")}>{perk.name}</h4>
                    <p className="text-[9px] text-foreground/50 font-bold leading-snug mt-1">{perk.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
}
