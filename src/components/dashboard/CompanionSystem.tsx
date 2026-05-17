import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GlassCard } from '../ui/GlassCard';
import { Companion, User } from '@/src/types';
import { Heart, Flame, Sparkles, Shield, RefreshCw, Trophy } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { playButtonClick, playLevelUp } from '@/src/lib/sounds';

interface CompanionSystemProps {
  user: User;
  onUpdateCompanion: (companion: Companion | undefined) => void;
  onSpendGold: (amount: number) => void;
}

const PET_TYPES = [
  {
    type: 'dragon' as const,
    name: 'Ember Hatchling',
    icon: '🐉',
    perk: 'Dwarven Might (+5% Boss Damage)',
    desc: 'Born from molten core, this fire hatchling breathes courage into your spirit.',
    color: 'from-orange-500 via-red-500 to-yellow-500',
    shadow: 'rgba(239,68,68,0.4)'
  },
  {
    type: 'phoenix' as const,
    name: 'Solar Chick',
    icon: '🐤',
    perk: 'Rebirth (10% Chance to save streak)',
    desc: 'A celestial bird that grows radiant with each ritual completed. Cannot be extinguished.',
    color: 'from-amber-400 via-orange-500 to-rose-500',
    shadow: 'rgba(245,158,11,0.4)'
  },
  {
    type: 'wolf' as const,
    name: 'Astral Pup',
    icon: '🐺',
    perk: 'Cosmic Path (+10% Gold from tasks)',
    desc: 'An ethereal hunter who wanders the void pathways. Guides your focus.',
    color: 'from-indigo-500 via-purple-500 to-pink-500',
    shadow: 'rgba(139,92,246,0.4)'
  }
];

export function CompanionSystem({ user, onUpdateCompanion, onSpendGold }: CompanionSystemProps) {
  const [namingPet, setNamingPet] = useState<typeof PET_TYPES[number] | null>(null);
  const [petNameInput, setPetNameInput] = useState('');

  const adoptCompanion = (pet: typeof PET_TYPES[number]) => {
    if (!petNameInput.trim()) return;
    playButtonClick();
    
    const newCompanion: Companion = {
      id: Date.now().toString(),
      name: petNameInput.trim(),
      type: pet.type,
      level: 1,
      xp: 0,
      xpToNextLevel: 100,
      hunger: 100,
      activePerk: pet.perk
    };
    onUpdateCompanion(newCompanion);
    setNamingPet(null);
    setPetNameInput('');
  };

  const feedCompanion = () => {
    if (!user.companion || user.gold < 15) return;
    playButtonClick();
    onSpendGold(15);
    
    let newXp = user.companion.xp + 30;
    let newLevel = user.companion.level;
    let levelUp = false;

    if (newXp >= user.companion.xpToNextLevel) {
      newLevel += 1;
      newXp = newXp - user.companion.xpToNextLevel;
      levelUp = true;
      playLevelUp();
    }

    onUpdateCompanion({
      ...user.companion,
      level: newLevel,
      xp: newXp,
      hunger: Math.min(100, user.companion.hunger + 25)
    });
  };

  const releaseCompanion = () => {
    if (confirm("Are you sure you want to release your faithful companion back into the wild?")) {
      playButtonClick();
      onUpdateCompanion(undefined);
    }
  };

  return (
    <GlassCard className="p-8 border-card-border overflow-hidden relative group">
      {/* Dynamic Realm Light */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-primary/5 blur-[100px] rounded-full pointer-events-none" />

      {!user.companion ? (
        <div className="space-y-8 relative z-10">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-black text-foreground uppercase tracking-widest" style={{ fontFamily: 'Cinzel, serif' }}>
              🐾 Beastmaster Sanctuary
            </h2>
            <p className="text-[10px] text-foreground/40 font-bold uppercase tracking-[0.2em]">
              Adopt a mythical soul companion to aid you in your battles
            </p>
          </div>

          {!namingPet ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {PET_TYPES.map(pet => (
                <GlassCard 
                  key={pet.type}
                  className="p-6 border-white/5 hover:border-primary/40 bg-background/30 flex flex-col justify-between items-center text-center gap-5 cursor-pointer group/pet"
                  hover
                  onClick={() => { playButtonClick(); setNamingPet(pet); }}
                >
                  <div className="text-5xl group-hover/pet:scale-125 group-hover/pet:rotate-6 transition-all duration-500 filter drop-shadow-[0_0_15px_rgba(255,255,255,0.15)]">
                    {pet.icon}
                  </div>
                  <div>
                    <h3 className="text-sm font-black uppercase tracking-widest text-foreground group-hover/pet:text-primary transition-colors">{pet.name}</h3>
                    <p className="text-[9px] text-foreground/40 font-semibold mt-2 leading-relaxed">{pet.desc}</p>
                  </div>
                  <div className="w-full pt-4 border-t border-white/5 text-[9px] font-black uppercase tracking-widest text-secondary flex items-center justify-center gap-1">
                    <Sparkles className="w-3 h-3" /> {pet.perk}
                  </div>
                </GlassCard>
              ))}
            </div>
          ) : (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-md mx-auto space-y-6 text-center">
              <div className="text-6xl">{namingPet.icon}</div>
              <h3 className="text-lg font-black text-foreground uppercase tracking-widest">Name your {namingPet.name}</h3>
              <div className="relative group/input">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-secondary rounded-2xl blur opacity-30 group-hover/input:opacity-50 transition" />
                <input 
                  type="text"
                  maxLength={15}
                  value={petNameInput}
                  onChange={(e) => setPetNameInput(e.target.value)}
                  placeholder="Enter custom name..."
                  className="w-full relative bg-background border border-card-border focus:border-primary/50 rounded-2xl py-4 px-6 text-foreground font-sans focus:outline-none"
                />
              </div>
              <div className="flex gap-4">
                <button 
                  onClick={() => setNamingPet(null)}
                  className="flex-1 py-3 bg-foreground/5 hover:bg-foreground/10 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => adoptCompanion(namingPet)}
                  className="flex-1 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg hover:shadow-primary/30 transition-all"
                >
                  Adopt Companion
                </button>
              </div>
            </motion.div>
          )}
        </div>
      ) : (
        // Active Companion UI
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
          {/* Animated Pet Representation */}
          <div className="relative shrink-0 flex flex-col items-center gap-4">
            <div className="relative w-44 h-44 rounded-full flex items-center justify-center">
              {/* Elemental halo */}
              <motion.div 
                className={cn("absolute inset-0 rounded-full border-4 border-dashed opacity-40")}
                style={{ borderColor: 'var(--primary)' }}
                animate={{ rotate: 360 }}
                transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
              />
              {/* Soft colorful breathing radial aura */}
              <motion.div 
                className={cn("absolute inset-4 rounded-full bg-gradient-to-br opacity-25 blur-xl", PET_TYPES.find(p => p.type === user.companion?.type)?.color)}
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              />
              {/* Pet emoji floating */}
              <motion.div 
                className="text-7xl z-10 filter drop-shadow-[0_0_20px_rgba(255,255,255,0.3)] select-none cursor-pointer"
                animate={{ y: [0, -12, 0], rotate: [0, 2, -2, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              >
                {PET_TYPES.find(p => p.type === user.companion?.type)?.icon}
              </motion.div>
            </div>
            
            {/* Level Badge */}
            <div className="px-4 py-1 bg-secondary/15 border border-secondary/30 rounded-full text-[9px] font-black text-secondary uppercase tracking-[0.2em]">
              Level {user.companion.level} Companion
            </div>
          </div>

          {/* Details & Actions */}
          <div className="flex-1 space-y-6 w-full">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-3">
                  <h3 className="text-2xl font-black text-foreground uppercase tracking-widest" style={{ fontFamily: 'Cinzel, serif' }}>
                    {user.companion.name}
                  </h3>
                  <span className="text-xs uppercase text-foreground/40 font-bold tracking-wider">
                    ({PET_TYPES.find(p => p.type === user.companion?.type)?.name})
                  </span>
                </div>
                <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest mt-1 flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5" /> Active Buff: {user.companion.activePerk}
                </p>
              </div>
              <button 
                onClick={releaseCompanion}
                className="text-[8px] font-black uppercase tracking-widest text-red-500/60 hover:text-red-500 border border-red-500/20 hover:border-red-500/50 bg-red-500/5 hover:bg-red-500/10 px-3 py-1.5 rounded-lg transition-all"
              >
                Release Companion
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-white/5">
              {/* XP Progress */}
              <div className="space-y-2">
                <div className="flex justify-between text-[9px] font-black uppercase tracking-widest text-foreground/40">
                  <span>Companion Affinity (XP)</span>
                  <span className="text-foreground">{user.companion.xp} / {user.companion.xpToNextLevel}</span>
                </div>
                <div className="h-3 bg-black/40 rounded-full border border-card-border overflow-hidden relative shadow-inner">
                  <motion.div 
                    className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
                    style={{ width: `${(user.companion.xp / user.companion.xpToNextLevel) * 100}%` }}
                    layout
                  />
                </div>
              </div>

              {/* Hunger Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-[9px] font-black uppercase tracking-widest text-foreground/40">
                  <span>Energy & Hunger</span>
                  <span className="text-foreground">{user.companion.hunger}%</span>
                </div>
                <div className="h-3 bg-black/40 rounded-full border border-card-border overflow-hidden relative shadow-inner">
                  <motion.div 
                    className={cn("h-full rounded-full transition-all duration-500", 
                      user.companion.hunger > 50 ? "bg-emerald-500" : user.companion.hunger > 20 ? "bg-yellow-500" : "bg-red-500"
                    )}
                    style={{ width: `${user.companion.hunger}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-white/5">
              <div className="text-[9px] text-foreground/40 font-bold uppercase tracking-wider">
                💡 Feed your companion to restore Energy and increase Affinity (XP).
              </div>
              <button
                onClick={feedCompanion}
                disabled={user.gold < 15}
                className={cn(
                  "py-3.5 px-6 rounded-2xl text-[9px] font-black uppercase tracking-widest flex items-center gap-2 transition-all shadow-lg",
                  user.gold >= 15 
                    ? "bg-secondary text-white hover:bg-secondary-light hover:shadow-secondary/20 cursor-pointer"
                    : "bg-foreground/5 text-foreground/20 border border-white/5 cursor-not-allowed"
                )}
              >
                <Flame className="w-3.5 h-3.5" /> Feed Companion <span className="px-1.5 py-0.5 bg-black/35 rounded-md text-[8px] font-black text-secondary ml-1">15 Gold</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </GlassCard>
  );
}
