import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GlassCard } from '../ui/GlassCard';
import { Curse, Habit } from '@/src/types';
import { ShieldAlert, Skull, Sparkles, Coins, HelpCircle, Plus } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { playButtonClick, playError, playLevelUp } from '@/src/lib/sounds';

interface CursesTrackerProps {
  curses: Curse[];
  habits: Habit[];
  gold: number;
  onUpdateCurses: (curses: Curse[]) => void;
  onSpendGold: (amount: number) => void;
  onReward: (xp: number, gold: number) => void;
}

const CURSE_TEMPLATES = [
  {
    type: 'sloth' as const,
    name: 'Spectre of Screen Time',
    description: 'Triggered by mindless social media scrolling. Causes lethargy.',
    icon: '📱',
    penaltyGold: 20,
    penaltyXp: 30,
    color: 'from-purple-900/50 via-slate-900 to-black',
    glow: 'rgba(139,92,246,0.3)'
  },
  {
    type: 'gluttony' as const,
    name: 'Sugar Goblin Spores',
    description: 'Triggered by eating processed sweets/junk food. Siphons vigor.',
    icon: '🍰',
    penaltyGold: 15,
    penaltyXp: 25,
    color: 'from-pink-950/50 via-slate-900 to-black',
    glow: 'rgba(236,72,153,0.3)'
  },
  {
    type: 'distraction' as const,
    name: 'Procrastination Wight',
    description: 'Triggered by delaying your key focus task. Shatters momentum.',
    icon: '⏰',
    penaltyGold: 25,
    penaltyXp: 35,
    color: 'from-amber-950/50 via-slate-900 to-black',
    glow: 'rgba(245,158,11,0.3)'
  }
];

export function CursesTracker({ curses, habits, gold, onUpdateCurses, onSpendGold, onReward }: CursesTrackerProps) {
  const [bindingCurse, setBindingCurse] = useState<typeof CURSE_TEMPLATES[number] | null>(null);
  const [selectedHabitId, setSelectedHabitId] = useState<string>('');
  const [customName, setCustomName] = useState('');
  const [customDesc, setCustomDesc] = useState('');

  const bindCurse = (template: typeof CURSE_TEMPLATES[number]) => {
    if (!selectedHabitId) return;
    playButtonClick();

    const newCurse: Curse = {
      id: Date.now().toString(),
      name: template.name,
      description: template.description,
      type: template.type,
      active: true, // Curse starts active, complete cleansing ritual to suppress it!
      cleansingHabitId: selectedHabitId,
      penaltyGold: template.penaltyGold,
      penaltyXp: template.penaltyXp
    };

    onUpdateCurses([...curses, newCurse]);
    setBindingCurse(null);
    setSelectedHabitId('');
  };

  const payToLift = (curseId: string) => {
    if (gold < 80) {
      playError();
      return;
    }
    playButtonClick();
    onSpendGold(80);
    // Remove the curse upon pay
    onUpdateCurses(curses.filter(c => c.id !== curseId));
    playLevelUp();
  };

  const suppressCurse = (curseId: string) => {
    playButtonClick();
    // Complete the cleansing ritual
    onUpdateCurses(curses.map(c => {
      if (c.id === curseId) {
        onReward(20, 15); // Reward for cleansing!
        return { ...c, active: false };
      }
      return c;
    }));
  };

  return (
    <GlassCard className="p-8 border-card-border overflow-hidden relative group">
      {/* Background shadow glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-red-500/5 blur-[100px] rounded-full pointer-events-none" />

      <div className="space-y-8 relative z-10">
        <div className="text-center md:text-left space-y-2">
          <h2 className="text-2xl font-black text-foreground uppercase tracking-widest flex items-center justify-center md:justify-start gap-2" style={{ fontFamily: 'Cinzel, serif' }}>
            💀 Curses & Doom Tracker
          </h2>
          <p className="text-[10px] text-foreground/40 font-bold uppercase tracking-[0.2em]">
            Bind and break negative habits through sacred Cleansing Rituals
          </p>
        </div>

        {curses.length === 0 && !bindingCurse && (
          <div className="text-center py-10 space-y-6">
            <div className="text-6xl text-foreground/20 animate-pulse">🛡️</div>
            <div>
              <h3 className="text-sm font-black uppercase tracking-widest text-foreground">Your Soul is Cleansed</h3>
              <p className="text-[10px] text-foreground/40 font-bold uppercase tracking-wider mt-2">
                No active curses are siphoning your aura. Bind a curse to start tracking bad habits!
              </p>
            </div>
            <button
              onClick={() => { playButtonClick(); setBindingCurse(CURSE_TEMPLATES[0]); }}
              className="py-3 px-6 bg-red-500/10 border border-red-500/30 text-red-500 hover:bg-red-500/20 text-[9px] font-black uppercase tracking-widest rounded-xl transition-all"
            >
              Bind First Curse
            </button>
          </div>
        )}

        {/* List of active curses */}
        {curses.length > 0 && !bindingCurse && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {curses.map(curse => {
              const ritualHabit = habits.find(h => h.id === curse.cleansingHabitId);
              const template = CURSE_TEMPLATES.find(t => t.type === curse.type) || CURSE_TEMPLATES[0];
              
              return (
                <GlassCard
                  key={curse.id}
                  className={cn(
                    "p-6 border-red-500/10 flex flex-col justify-between relative overflow-hidden group/curse",
                    curse.active 
                      ? "bg-red-950/10 border-red-500/30 shadow-[0_0_30px_rgba(239,68,68,0.08)]"
                      : "bg-emerald-950/10 border-emerald-500/30 shadow-[0_0_30px_rgba(16,185,129,0.08)]"
                  )}
                >
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        <div className="text-4xl">{template.icon}</div>
                        <div>
                          <h4 className="text-xs font-black uppercase tracking-widest text-foreground">{curse.name}</h4>
                          <span className={cn(
                            "text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full mt-1.5 inline-block",
                            curse.active ? "bg-red-500/10 text-red-400 border border-red-500/20" : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          )}>
                            {curse.active ? '💀 Active Doom' : '✨ Cleansed'}
                          </span>
                        </div>
                      </div>
                      
                      {curse.active && (
                        <button
                          onClick={() => payToLift(curse.id)}
                          className={cn(
                            "text-[8px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg transition-all",
                            gold >= 80
                              ? "bg-yellow-500/20 text-yellow-500 border border-yellow-500/30 hover:bg-yellow-500/30"
                              : "bg-foreground/5 text-foreground/20 cursor-not-allowed border border-white/5"
                          )}
                        >
                          Lift Curse <span className="text-[7px] px-1 bg-black/40 rounded text-yellow-500 ml-1">80 Gold</span>
                        </button>
                      )}
                    </div>

                    <p className="text-[9px] text-foreground/50 leading-relaxed font-semibold">{curse.description}</p>
                    
                    <div className="pt-4 border-t border-white/5 flex items-center justify-between text-[9px] font-black uppercase tracking-widest">
                      <span className="text-foreground/40">Cleansing Ritual:</span>
                      <span className="text-secondary">{ritualHabit ? ritualHabit.name : 'Unknown Ritual'}</span>
                    </div>

                    {curse.active && ritualHabit && (
                      <button
                        onClick={() => suppressCurse(curse.id)}
                        className="w-full py-2.5 mt-2 bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-400 hover:text-emerald-300 text-[9px] font-black uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-1.5"
                      >
                        <Sparkles className="w-3.5 h-3.5" /> Perform Cleansing Ritual
                      </button>
                    )}
                  </div>
                </GlassCard>
              );
            })}

            {/* Bind another curse button */}
            <GlassCard
              onClick={() => { playButtonClick(); setBindingCurse(CURSE_TEMPLATES[0]); }}
              className="p-6 border-dashed border-red-500/20 hover:border-red-500/50 bg-red-500/5 hover:bg-red-500/10 flex flex-col justify-center items-center gap-3 cursor-pointer group/add"
            >
              <Skull className="w-8 h-8 text-red-500/40 group-hover/add:scale-110 duration-300 transition-all" />
              <span className="text-[9px] font-black uppercase tracking-widest text-red-500/60 group-hover/add:text-red-500">
                Bind Another Curse
              </span>
            </GlassCard>
          </div>
        )}

        {/* Binding Portal Modal */}
        <AnimatePresence>
          {bindingCurse && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6 max-w-lg mx-auto">
              <div className="text-center space-y-2">
                <h3 className="text-lg font-black text-foreground uppercase tracking-widest">Select Curse Template</h3>
                <p className="text-[9px] text-foreground/40 font-bold uppercase tracking-wider">Choose a negative force to bind to your sanctum</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {CURSE_TEMPLATES.map(temp => (
                  <button
                    key={temp.type}
                    onClick={() => { playButtonClick(); setBindingCurse(temp); }}
                    className={cn(
                      "p-4 rounded-2xl border text-center flex flex-col items-center gap-3 transition-all",
                      bindingCurse.type === temp.type
                        ? "border-red-500 bg-red-500/15 shadow-[0_0_20px_rgba(239,68,68,0.2)]"
                        : "bg-background/40 border-white/5 hover:border-white/20"
                    )}
                  >
                    <span className="text-4xl">{temp.icon}</span>
                    <span className="text-[9px] font-black uppercase tracking-widest text-foreground">{temp.name}</span>
                  </button>
                ))}
              </div>

              <div className="space-y-4 pt-4 border-t border-white/5">
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-widest text-foreground/40">Select Cleansing Ritual (Habit)</label>
                  <select
                    value={selectedHabitId}
                    onChange={(e) => setSelectedHabitId(e.target.value)}
                    className="w-full bg-background border border-card-border focus:border-red-500/50 rounded-xl py-3 px-4 text-foreground font-sans focus:outline-none text-xs"
                  >
                    <option value="">-- Choose Ritual --</option>
                    {habits.map(h => (
                      <option key={h.id} value={h.id}>{h.name}</option>
                    ))}
                  </select>
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    onClick={() => setBindingCurse(null)}
                    className="flex-1 py-3 bg-foreground/5 hover:bg-foreground/10 border border-white/10 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => bindCurse(bindingCurse)}
                    disabled={!selectedHabitId}
                    className={cn(
                      "flex-1 py-3 text-white rounded-xl text-[9px] font-black uppercase tracking-widest shadow-lg transition-all",
                      selectedHabitId 
                        ? "bg-red-600 hover:bg-red-500 hover:shadow-red-600/30 cursor-pointer"
                        : "bg-foreground/5 text-foreground/20 border border-white/5 cursor-not-allowed"
                    )}
                  >
                    Bind Curse
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </GlassCard>
  );
}
