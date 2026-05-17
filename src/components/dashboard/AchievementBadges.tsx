import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GlassCard } from '@/src/components/ui/GlassCard';
import { Trophy, Lock, X } from 'lucide-react';
import { playAchievement } from '@/src/lib/sounds';

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  tier: 'bronze' | 'silver' | 'gold' | 'legendary';
  unlocked: boolean;
  unlockedAt?: string;
}

const BADGES: Badge[] = [
  { id: '1', name: 'First Blood', description: 'Complete your first quest', icon: '⚔️', tier: 'bronze', unlocked: true, unlockedAt: '2 days ago' },
  { id: '2', name: 'Flame Keeper', description: 'Reach a 3-day streak', icon: '🔥', tier: 'bronze', unlocked: true, unlockedAt: '1 day ago' },
  { id: '3', name: 'Iron Will', description: 'Complete 5 quests in a day', icon: '🛡️', tier: 'silver', unlocked: true, unlockedAt: 'Today' },
  { id: '4', name: 'Dawn Warrior', description: 'Complete a quest before 7 AM', icon: '🌅', tier: 'silver', unlocked: false },
  { id: '5', name: 'Arcane Scholar', description: 'Reach Level 10', icon: '📖', tier: 'gold', unlocked: false },
  { id: '6', name: 'Dragon Slayer', description: 'Maintain a 30-day streak', icon: '🐉', tier: 'gold', unlocked: false },
  { id: '7', name: 'Void Walker', description: 'Complete 100 total quests', icon: '🌌', tier: 'legendary', unlocked: false },
  { id: '8', name: 'The Chosen One', description: 'Reach Level 50 & unlock all badges', icon: '👑', tier: 'legendary', unlocked: false },
];

const tierColors = {
  bronze: { bg: 'from-amber-700/20 to-amber-900/10', border: 'border-amber-700/40', glow: 'rgba(180,83,9,0.4)', text: 'text-amber-600' },
  silver: { bg: 'from-slate-300/20 to-slate-500/10', border: 'border-slate-400/40', glow: 'rgba(148,163,184,0.4)', text: 'text-slate-300' },
  gold: { bg: 'from-yellow-500/20 to-amber-500/10', border: 'border-yellow-500/50', glow: 'rgba(234,179,8,0.5)', text: 'text-yellow-500' },
  legendary: { bg: 'from-purple-500/20 to-fuchsia-500/10', border: 'border-purple-500/50', glow: 'rgba(168,85,247,0.5)', text: 'text-purple-400' },
};

export function AchievementBadges() {
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);
  const unlockedCount = BADGES.filter(b => b.unlocked).length;

  const handleBadgeClick = (badge: Badge) => {
    setSelectedBadge(badge);
    if (badge.unlocked) playAchievement();
  };

  return (
    <>
      <GlassCard className="p-8 border-card-border/50 space-y-6 overflow-hidden relative group">
        {/* Background glow */}
        <motion.div className="absolute -top-10 -right-10 w-40 h-40 bg-secondary/10 blur-[60px] rounded-full pointer-events-none"
          animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 6, repeat: Infinity }} />

        {/* Header */}
        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center gap-3">
            <motion.div className="p-2.5 bg-secondary/15 rounded-xl border border-secondary/20"
              animate={{ rotate: [0, 5, -5, 0] }} transition={{ duration: 4, repeat: Infinity }}>
              <Trophy className="w-5 h-5 text-secondary" />
            </motion.div>
            <div>
              <h3 className="text-sm font-black text-foreground tracking-tight uppercase" style={{ fontFamily: 'Cinzel, serif' }}>
                Achievement Vault
              </h3>
              <p className="text-[9px] text-foreground/30 font-bold uppercase tracking-widest">{unlockedCount}/{BADGES.length} Relics Unlocked</p>
            </div>
          </div>
          {/* Progress ring */}
          <div className="relative w-12 h-12">
            <svg className="w-12 h-12 -rotate-90">
              <circle cx="24" cy="24" r="20" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="3" />
              <motion.circle cx="24" cy="24" r="20" fill="none" stroke="url(#badgeGrad)" strokeWidth="3" strokeLinecap="round"
                strokeDasharray={126} initial={{ strokeDashoffset: 126 }}
                animate={{ strokeDashoffset: 126 - (126 * unlockedCount / BADGES.length) }}
                transition={{ duration: 1.5, ease: 'easeOut' }} />
              <defs>
                <linearGradient id="badgeGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#d4af37" />
                  <stop offset="100%" stopColor="#7c3aed" />
                </linearGradient>
              </defs>
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-[10px] font-black text-foreground">
              {Math.round((unlockedCount / BADGES.length) * 100)}%
            </span>
          </div>
        </div>

        {/* Badge Grid */}
        <div className="grid grid-cols-4 gap-3 relative z-10">
          {BADGES.map((badge, i) => {
            const tier = tierColors[badge.tier];
            return (
              <motion.button key={badge.id}
                onClick={() => handleBadgeClick(badge)}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.06, type: 'spring', stiffness: 300 }}
                whileHover={{ scale: 1.1, y: -4 }}
                whileTap={{ scale: 0.9 }}
                className={`p-4 rounded-2xl border bg-gradient-to-br relative overflow-hidden group/badge transition-all ${tier.bg} ${tier.border} ${badge.unlocked ? 'cursor-pointer' : 'opacity-40 cursor-default'}`}
                style={{ boxShadow: badge.unlocked ? `0 0 20px ${tier.glow}` : 'none' }}
              >
                {/* Shimmer on unlocked */}
                {badge.unlocked && (
                  <motion.div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                    animate={{ x: ['-200%', '200%'] }}
                    transition={{ duration: 3, repeat: Infinity, delay: i * 0.3 }} />
                )}
                <div className="relative z-10 text-center">
                  <div className="text-2xl mb-1">{badge.unlocked ? badge.icon : '🔒'}</div>
                  <div className="text-[7px] font-black uppercase tracking-wider text-foreground/60 truncate">{badge.name}</div>
                </div>
              </motion.button>
            );
          })}
        </div>
      </GlassCard>

      {/* Badge Detail Modal */}
      <AnimatePresence>
        {selectedBadge && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-xl p-6"
            onClick={() => setSelectedBadge(null)}>
            <motion.div initial={{ scale: 0.5, rotateY: 90 }} animate={{ scale: 1, rotateY: 0 }} exit={{ scale: 0.5, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 200 }}
              onClick={e => e.stopPropagation()} className="max-w-sm w-full">
              <GlassCard className="p-10 text-center space-y-6 border-secondary/30 relative overflow-hidden" hover={false}>
                {/* Animated border */}
                <motion.div className="absolute top-0 left-0 right-0 h-[2px]"
                  style={{ background: 'linear-gradient(90deg, transparent, #d4af37, #7c3aed, #d4af37, transparent)', backgroundSize: '200% 100%' }}
                  animate={{ backgroundPosition: ['0% 0%', '200% 0%'] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }} />
                
                <button onClick={() => setSelectedBadge(null)} className="absolute top-4 right-4 p-2 rounded-lg hover:bg-white/10 text-foreground/40 hover:text-foreground transition-all">
                  <X className="w-4 h-4" />
                </button>

                <motion.div className="text-6xl" animate={selectedBadge.unlocked ? { scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] } : {}}
                  transition={{ duration: 2, repeat: Infinity }}>
                  {selectedBadge.unlocked ? selectedBadge.icon : '🔒'}
                </motion.div>

                <div className="space-y-2">
                  <h3 className="text-xl font-black text-foreground uppercase tracking-tight" style={{ fontFamily: 'Cinzel, serif' }}>
                    {selectedBadge.name}
                  </h3>
                  <span className={`text-[9px] font-black uppercase tracking-[0.3em] ${tierColors[selectedBadge.tier].text}`}>
                    {selectedBadge.tier} Relic
                  </span>
                </div>

                <p className="text-sm text-foreground/60 font-medium">{selectedBadge.description}</p>

                {selectedBadge.unlocked ? (
                  <div className="flex items-center justify-center gap-2 text-[10px] font-black text-accent uppercase tracking-widest">
                    <Trophy className="w-3 h-3" />
                    Unlocked {selectedBadge.unlockedAt}
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2 text-[10px] font-black text-foreground/30 uppercase tracking-widest">
                    <Lock className="w-3 h-3" /> Locked
                  </div>
                )}
              </GlassCard>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
