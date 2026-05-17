import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GlassCard } from '../ui/GlassCard';
import { Sparkles, BookOpen, Compass, ShieldAlert, Award, Star, Flame, Coins, Shield } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { playButtonClick, playAchievement, playLevelUp } from '@/src/lib/sounds';

interface GrimoireProps {
  gold: number;
  onReward: (xp: number, gold: number) => void;
  onRestoreCompanion: () => void;
}

interface JournalEntry {
  date: string;
  rune: string;
  runeIcon: string;
  content: string;
}

const RUNES = [
  { id: 'intellect', label: 'Rune of Intellect', icon: '🌀', desc: 'Focuses mental clarity and deep wisdom.' },
  { id: 'healing', label: 'Rune of Healing', icon: '💚', desc: 'Soothes daily stress and anxious minds.' },
  { id: 'swiftness', label: 'Rune of Swiftness', icon: '⚡', desc: 'Accelerates momentum and prompt action.' },
  { id: 'abundance', label: 'Rune of Abundance', icon: '🪙', desc: 'Siphons fortune and golden outcomes.' }
];

export function Grimoire({ gold, onReward, onRestoreCompanion }: GrimoireProps) {
  const [selectedRune, setSelectedRune] = useState<string>('intellect');
  const [reflectionText, setReflectionText] = useState('');
  const [crystals, setCrystals] = useState<number>(() => {
    return Number(localStorage.getItem('aura_rune_crystals') || '0');
  });
  const [entries, setEntries] = useState<JournalEntry[]>(() => {
    const saved = localStorage.getItem('aura_journal_entries');
    return saved ? JSON.parse(saved) : [];
  });
  const [spellCastActive, setSpellCastActive] = useState<string | null>(null);

  const saveReflection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reflectionText.trim()) return;

    playAchievement();
    const runeObj = RUNES.find(r => r.id === selectedRune) || RUNES[0];
    const newEntry: JournalEntry = {
      date: new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }),
      rune: runeObj.label,
      runeIcon: runeObj.icon,
      content: reflectionText
    };

    const updatedEntries = [newEntry, ...entries];
    setEntries(updatedEntries);
    localStorage.setItem('aura_journal_entries', JSON.stringify(updatedEntries));

    // Grant Reward
    const newCrystals = Math.min(3, crystals + 1);
    setCrystals(newCrystals);
    localStorage.setItem('aura_rune_crystals', newCrystals.toString());

    onReward(50, 20); // Journaling grants +50 XP and +20 Gold!
    setReflectionText('');
  };

  const castSpell = (spellType: string) => {
    if (crystals < 3) return;
    playLevelUp();
    setSpellCastActive(spellType);

    // Deduct Crystals
    setCrystals(0);
    localStorage.setItem('aura_rune_crystals', '0');

    // Trigger Spell Effects
    if (spellType === 'midas') {
      onReward(0, 150); // Midas Touch grants 150 Gold!
    } else if (spellType === 'vigor') {
      onRestoreCompanion(); // Restore companion hunger/energy
    }

    setTimeout(() => {
      setSpellCastActive(null);
    }, 4000);
  };

  const activeRune = RUNES.find(r => r.id === selectedRune) || RUNES[0];

  return (
    <GlassCard className="p-8 border-card-border overflow-hidden relative group">
      {/* Dynamic spellbook particle background */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/5 blur-[100px] rounded-full pointer-events-none" />

      <div className="space-y-8 relative z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="text-center md:text-left space-y-2">
            <h2 className="text-2xl font-black text-foreground uppercase tracking-widest flex items-center justify-center md:justify-start gap-2" style={{ fontFamily: 'Cinzel, serif' }}>
              📖 The Archmage's Grimoire
            </h2>
            <p className="text-[10px] text-foreground/40 font-bold uppercase tracking-[0.2em]">
              Record your daily reflections, collect runes, and cast high-level spells
            </p>
          </div>

          {/* Rune Crystals Indicator */}
          <div className="flex items-center gap-3 self-center md:self-auto px-4 py-2 bg-purple-500/10 border border-purple-500/30 rounded-xl shadow-[0_0_20px_rgba(139,92,246,0.2)]">
            <Sparkles className="w-4 h-4 text-purple-400 animate-pulse" />
            <div className="text-xs font-black text-purple-400 uppercase tracking-widest">
              Rune Crystals: {crystals}/3
            </div>
          </div>
        </div>

        {/* Casting overlay */}
        <AnimatePresence>
          {spellCastActive && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-50 bg-black/95 flex flex-col items-center justify-center text-center p-8 backdrop-blur-md"
            >
              <motion.div 
                className="text-8xl mb-6"
                animate={{ rotate: 360, scale: [1, 1.2, 1] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
              >
                ✨
              </motion.div>
              <h3 className="text-2xl font-black text-purple-400 uppercase tracking-widest" style={{ fontFamily: 'Cinzel, serif' }}>
                Casting {spellCastActive === 'midas' ? 'Midas Touch' : spellCastActive === 'vigor' ? 'Elixir of Vigor' : 'Aura Aegis Shield'}...
              </h3>
              <p className="text-xs text-foreground/50 max-w-sm uppercase tracking-wider font-bold mt-4 leading-relaxed">
                {spellCastActive === 'midas' && 'Channeling absolute fortune! Golden particles infuse your vault with +150 Gold!'}
                {spellCastActive === 'vigor' && 'Brewing divine elixir. Your companion is fully energized, ready to grant passive perks!'}
                {spellCastActive === 'shield' && 'Creating protective field. Your streaks are secured under a 3-day Aura Aegis Shield!'}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Reflection Journal entry card */}
          <GlassCard className="p-6 border-white/5 bg-black/40">
            <h3 className="text-xs font-black uppercase tracking-widest mb-6 flex items-center gap-2 text-secondary">
              <BookOpen className="w-4 h-4" /> Daily Chronicle
            </h3>
            
            <form onSubmit={saveReflection} className="space-y-6">
              {/* Rune Selector Grid */}
              <div className="space-y-3">
                <label className="text-[8px] font-black uppercase tracking-widest text-foreground/40">Select Daily Focus Rune</label>
                <div className="grid grid-cols-4 gap-2">
                  {RUNES.map(rune => (
                    <button
                      key={rune.id}
                      type="button"
                      onClick={() => { playButtonClick(); setSelectedRune(rune.id); }}
                      className={cn(
                        "p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all",
                        selectedRune === rune.id
                          ? "border-purple-500 bg-purple-500/10 shadow-[0_0_15px_rgba(139,92,246,0.15)]"
                          : "border-white/5 bg-foreground/[0.02] hover:border-white/20"
                      )}
                    >
                      <span className="text-xl">{rune.icon}</span>
                      <span className="text-[7px] font-black uppercase tracking-wider truncate max-w-full">{rune.label.split(' ')[2]}</span>
                    </button>
                  ))}
                </div>
                <p className="text-[8px] text-foreground/30 font-bold uppercase tracking-wider pl-1">{activeRune.desc}</p>
              </div>

              {/* Reflection text area */}
              <div className="space-y-2">
                <label className="text-[8px] font-black uppercase tracking-widest text-foreground/40">Chronicle Reflections</label>
                <textarea
                  required
                  placeholder="Record your deeds, targets, or inner thoughts today..."
                  value={reflectionText}
                  onChange={(e) => setReflectionText(e.target.value)}
                  className="w-full h-32 bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-purple-500/50 resize-none font-sans leading-relaxed"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-purple-600 hover:bg-purple-500 shadow-[0_4px_20px_rgba(124,58,237,0.3)] text-white text-[9px] font-black uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 animate-pulse" /> Scribe Reflections (+50 XP, +20 Gold)
              </button>
            </form>
          </GlassCard>

          {/* Spellcasting & History Column */}
          <div className="space-y-6">
            {/* Spells Panel */}
            <GlassCard className="p-6 border-white/5 bg-black/40">
              <h3 className="text-xs font-black uppercase tracking-widest mb-6 flex items-center gap-2 text-purple-400">
                <Flame className="w-4 h-4" /> Spell Casting Circle
              </h3>

              <div className="space-y-3">
                {/* Spell 1: Midas Touch */}
                <div className="flex items-center justify-between p-3.5 bg-white/5 border border-white/15 rounded-xl hover:bg-white/10 transition-colors">
                  <div>
                    <div className="text-xs font-black uppercase tracking-widest text-foreground flex items-center gap-1.5">
                      🪙 Midas Touch
                    </div>
                    <div className="text-[8px] font-bold text-foreground/40 uppercase tracking-widest mt-1">Transmutes crystals to +150 Gold</div>
                  </div>
                  <button
                    disabled={crystals < 3}
                    onClick={() => castSpell('midas')}
                    className={cn(
                      "px-4 py-2.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all",
                      crystals >= 3
                        ? "bg-purple-500 text-white hover:scale-105 shadow-md shadow-purple-500/20"
                        : "bg-black/50 text-white/30 cursor-not-allowed border border-white/5"
                    )}
                  >
                    Cast Spell
                  </button>
                </div>

                {/* Spell 2: Elixir of Vigor */}
                <div className="flex items-center justify-between p-3.5 bg-white/5 border border-white/15 rounded-xl hover:bg-white/10 transition-colors">
                  <div>
                    <div className="text-xs font-black uppercase tracking-widest text-foreground flex items-center gap-1.5">
                      🧪 Elixir of Vigor
                    </div>
                    <div className="text-[8px] font-bold text-foreground/40 uppercase tracking-widest mt-1">Restores Companion Energy to 100%</div>
                  </div>
                  <button
                    disabled={crystals < 3}
                    onClick={() => castSpell('vigor')}
                    className={cn(
                      "px-4 py-2.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all",
                      crystals >= 3
                        ? "bg-purple-500 text-white hover:scale-105 shadow-md shadow-purple-500/20"
                        : "bg-black/50 text-white/30 cursor-not-allowed border border-white/5"
                    )}
                  >
                    Cast Spell
                  </button>
                </div>

                {/* Spell 3: Aura Aegis Shield */}
                <div className="flex items-center justify-between p-3.5 bg-white/5 border border-white/15 rounded-xl hover:bg-white/10 transition-colors">
                  <div>
                    <div className="text-xs font-black uppercase tracking-widest text-foreground flex items-center gap-1.5">
                      🛡️ Aura Aegis Shield
                    </div>
                    <div className="text-[8px] font-bold text-foreground/40 uppercase tracking-widest mt-1">Streaks protected from misses for 3 days</div>
                  </div>
                  <button
                    disabled={crystals < 3}
                    onClick={() => castSpell('shield')}
                    className={cn(
                      "px-4 py-2.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all",
                      crystals >= 3
                        ? "bg-purple-500 text-white hover:scale-105 shadow-md shadow-purple-500/20"
                        : "bg-black/50 text-white/30 cursor-not-allowed border border-white/5"
                    )}
                  >
                    Cast Spell
                  </button>
                </div>
              </div>
            </GlassCard>

            {/* History logs */}
            <GlassCard className="p-6 border-white/5 bg-black/40 flex-1 flex flex-col">
              <h3 className="text-xs font-black uppercase tracking-widest mb-4 flex items-center gap-2 text-foreground/40">
                📜 Chronology logs
              </h3>
              
              <div className="space-y-4 max-h-[160px] overflow-y-auto custom-scrollbar flex-1">
                {entries.length > 0 ? entries.map((entry, idx) => (
                  <div key={idx} className="p-3 bg-white/[0.02] border border-white/5 rounded-xl space-y-2">
                    <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest">
                      <span className="text-purple-400 flex items-center gap-1">
                        {entry.runeIcon} {entry.rune}
                      </span>
                      <span className="text-foreground/30">{entry.date}</span>
                    </div>
                    <p className="text-[10px] text-foreground/60 leading-relaxed font-sans">{entry.content}</p>
                  </div>
                )) : (
                  <div className="py-8 text-center bg-foreground/[0.01] border border-dashed border-white/5 rounded-xl">
                    <p className="text-[9px] font-black text-foreground/20 uppercase tracking-[0.2em]">Grimoire logs are empty</p>
                  </div>
                )}
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </GlassCard>
  );
}
