import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GlassCard } from '../ui/GlassCard';
import { Sparkles, Flame, Eye, Compass, Heart, ShieldAlert } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { playButtonClick, playAchievement } from '@/src/lib/sounds';

interface MoodScrollsProps {
  onReward: (xp: number, gold: number) => void;
}

const MOODS = [
  {
    id: 'focused',
    label: 'Focused',
    icon: '🔥',
    color: 'border-red-500/30 text-red-400 bg-red-500/5 hover:border-red-500/60 shadow-[0_0_15px_rgba(239,68,68,0.05)]',
    relicName: 'Warrior\'s Focus',
    quote: '"Your blades are sharp, your resolve unbreakable. Walk with absolute purpose today. Let no distraction breach your line of focus."',
    crystalColor: 'bg-red-500'
  },
  {
    id: 'stressed',
    label: 'Overwhelmed',
    icon: '🌿',
    color: 'border-emerald-500/30 text-emerald-400 bg-emerald-500/5 hover:border-emerald-500/60 shadow-[0_0_15px_rgba(16,185,129,0.05)]',
    relicName: 'Elven Sanctuary Whispers',
    quote: '"Breathe in the ancient wind of the Elven Forest. Let the storm rage outside, while peace resides within your core. You are secure."',
    crystalColor: 'bg-emerald-500'
  },
  {
    id: 'tired',
    label: 'Fatigued',
    icon: '💤',
    color: 'border-blue-500/30 text-blue-400 bg-blue-500/5 hover:border-blue-500/60 shadow-[0_0_15px_rgba(59,130,246,0.05)]',
    relicName: 'Dormant Phoenix',
    quote: '"Even the stars fade to dream. Rest your shield, brave hero. Recuperation is not weakness; the fire shall burn brighter tomorrow."',
    crystalColor: 'bg-blue-500'
  },
  {
    id: 'inspired',
    label: 'Inspired',
    icon: '✨',
    color: 'border-yellow-500/30 text-yellow-400 bg-yellow-500/5 hover:border-yellow-500/60 shadow-[0_0_15px_rgba(234,179,8,0.05)]',
    relicName: 'Arcane Leylines insight',
    quote: '"The ley lines hum with magical resonance. The portals of opportunity are wide open. Cast your intentions and shape reality today!"',
    crystalColor: 'bg-yellow-500'
  },
  {
    id: 'anxious',
    label: 'Anxious',
    icon: '🛡️',
    color: 'border-purple-500/30 text-purple-400 bg-purple-500/5 hover:border-purple-500/60 shadow-[0_0_15px_rgba(139,92,246,0.05)]',
    relicName: 'Aura Aegis Shield',
    quote: '"Your Aura is an impenetrable fortress. No dark magic or phantom fears can breach the sturdy walls of your mind. Stand firm."',
    crystalColor: 'bg-purple-500'
  }
];

export function MoodScrolls({ onReward }: MoodScrollsProps) {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [claimedReward, setClaimedReward] = useState(false);

  const selectMood = (id: string) => {
    playButtonClick();
    setSelectedMood(id);
    if (!claimedReward) {
      playAchievement();
      onReward(15, 10); // Reward +15 XP and +10 Gold for daily attunement!
      setClaimedReward(true);
    }
  };

  const activeMood = MOODS.find(m => m.id === selectedMood);

  return (
    <GlassCard className="p-8 border-card-border overflow-hidden relative group">
      {/* Background magic circle glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-secondary/5 blur-[100px] rounded-full pointer-events-none" />

      <div className="space-y-8 relative z-10">
        <div className="text-center md:text-left space-y-2">
          <h2 className="text-2xl font-black text-foreground uppercase tracking-widest flex items-center justify-center md:justify-start gap-2" style={{ fontFamily: 'Cinzel, serif' }}>
            📜 Scroll of Attunement
          </h2>
          <p className="text-[10px] text-foreground/40 font-bold uppercase tracking-[0.2em]">
            Tune your mind to an elemental frequency to receive ancient magical wisdom
          </p>
        </div>

        {/* Crystals Selector grid */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          {MOODS.map(mood => {
            const isActive = selectedMood === mood.id;
            return (
              <button
                key={mood.id}
                onClick={() => selectMood(mood.id)}
                className={cn(
                  "p-4 rounded-2xl border transition-all flex flex-col items-center gap-3 relative group/crystal overflow-hidden",
                  isActive
                    ? "border-secondary bg-secondary/15 shadow-[0_0_25px_rgba(212,175,55,0.2)]"
                    : mood.color
                )}
              >
                {/* Internal Crystal Core floating animation */}
                <motion.div 
                  className={cn("w-3 h-3 rounded-full blur-[2px] opacity-60", mood.crystalColor)}
                  animate={isActive ? { scale: [1, 1.8, 1], opacity: [0.6, 1, 0.6] } : { scale: 1 }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <span className="text-3xl filter drop-shadow-[0_0_8px_rgba(255,255,255,0.15)] group-hover/crystal:scale-110 transition-transform">
                  {mood.icon}
                </span>
                <span className={cn(
                  "text-[9px] font-black uppercase tracking-widest",
                  isActive ? "text-secondary" : "text-foreground/50 group-hover/crystal:text-foreground/80"
                )}>
                  {mood.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Parchment scroll container */}
        <AnimatePresence mode="wait">
          {activeMood && (
            <motion.div
              key={activeMood.id}
              initial={{ opacity: 0, y: 15, scaleY: 0.8 }}
              animate={{ opacity: 1, y: 0, scaleY: 1 }}
              exit={{ opacity: 0, y: -15, scaleY: 0.8 }}
              transition={{ type: 'spring', stiffness: 150, damping: 15 }}
              className="relative rounded-3xl p-6 md:p-8 bg-[#f4ebe1]/95 text-stone-900 border-2 border-[#d4af37] shadow-[0_20px_50px_rgba(0,0,0,0.4)] overflow-hidden"
            >
              {/* Parchment background grain/burn lines */}
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,#ebd7c0_90%)] pointer-events-none opacity-40" />
              <div className="absolute inset-x-0 top-0 h-4 bg-gradient-to-b from-[#ebd5b9] to-transparent" />
              
              {/* Attunement Magic Sigil */}
              <div className="flex flex-col items-center text-center space-y-4 relative z-10">
                <div className="px-3.5 py-1 bg-amber-950/10 border border-amber-950/20 rounded-full text-[9px] font-black text-amber-900 uppercase tracking-[0.25em]">
                  ⚔️ {activeMood.relicName}
                </div>
                <blockquote 
                  className="text-stone-800 text-sm md:text-base font-medium italic max-w-xl leading-relaxed"
                  style={{ fontFamily: 'Cinzel, serif' }}
                >
                  {activeMood.quote}
                </blockquote>
                
                {claimedReward && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-[9px] font-black uppercase tracking-[0.2em] text-amber-800 bg-amber-900/5 px-4 py-2 border border-amber-900/10 rounded-xl flex items-center gap-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-secondary animate-pulse" /> Attunement Resonance Claimed (+15 XP, +10 Gold)
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </GlassCard>
  );
}
