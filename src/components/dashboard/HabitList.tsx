import { motion, AnimatePresence } from 'motion/react';
import { GlassCard } from '@/src/components/ui/GlassCard';
import { Habit } from '@/src/types';
import { Flame, Check, Plus, Sword } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { XPPop } from '@/src/components/ui/XPPop';
import { useState } from 'react';

interface HabitListProps {
  habits: Habit[];
  onToggle: (id: string) => void;
  onAdd: () => void;
}

export function HabitList({ habits, onToggle, onAdd }: HabitListProps) {
  const [xpTrigger, setXpTrigger] = useState<Record<string, number>>({});
  const [justCompleted, setJustCompleted] = useState<Record<string, boolean>>({});

  const handleToggle = (id: string, completed: boolean) => {
    if (!completed) {
      setXpTrigger(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
      setJustCompleted(prev => ({ ...prev, [id]: true }));
      setTimeout(() => setJustCompleted(prev => ({ ...prev, [id]: false })), 800);
    }
    onToggle(id);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
              className="w-1.5 h-1.5 rotate-45"
              style={{ backgroundColor: '#d4af37', boxShadow: '0 0 8px rgba(212,175,55,0.8)' }}
            />
            <h2
              className="text-xl font-black uppercase tracking-[0.2em]"
              style={{ fontFamily: 'Cinzel, serif', color: '#d4af37', textShadow: '0 0 20px rgba(212,175,55,0.4)' }}
            >
              Daily Quests
            </h2>
            <motion.div
              animate={{ rotate: [0, -360] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
              className="w-1.5 h-1.5 rotate-45"
              style={{ backgroundColor: '#d4af37', boxShadow: '0 0 8px rgba(212,175,55,0.8)' }}
            />
          </div>
          <p className="text-[9px] font-bold uppercase tracking-[0.35em]"
             style={{ color: 'rgba(232,213,176,0.3)', fontFamily: 'Cinzel, serif' }}>
            Complete rites · Forge your legend
          </p>
        </div>

        <motion.button
          onClick={onAdd}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.9 }}
          className="relative group flex items-center gap-2 px-5 py-3 rounded-xl overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(200,16,46,0.25), rgba(139,0,0,0.35))',
            border: '1px solid rgba(212,175,55,0.35)',
            color: '#d4af37',
            fontFamily: 'Cinzel, serif',
            fontSize: '10px',
            fontWeight: 700,
            letterSpacing: '0.2em',
          }}
        >
          {/* Sweep */}
          <motion.div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(212,175,55,0.08), transparent)' }}
            animate={{ x: ['-100%', '200%'] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          />
          <Plus className="w-4 h-4 relative z-10" />
          <span className="relative z-10">Add Quest</span>
        </motion.button>
      </div>

      {/* Gold divider */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(212,175,55,0.25))' }} />
        <div className="w-1.5 h-1.5 rotate-45" style={{ backgroundColor: 'rgba(212,175,55,0.4)' }} />
        <div className="flex-1 h-px" style={{ background: 'linear-gradient(270deg, transparent, rgba(212,175,55,0.25))' }} />
      </div>

      {/* Habit Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <AnimatePresence>
          {habits.map((habit, index) => (
            <motion.div
              key={habit.id}
              layout
              initial={{ opacity: 0, y: 60, scale: 0.8, rotateX: -30 }}
              animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: -40, rotateX: 20 }}
              transition={{ duration: 0.8, delay: index * 0.1, type: 'spring', stiffness: 150, damping: 15, bounce: 0.4 }}
              whileHover={{ y: -5, scale: 1.02, rotateX: 5 }}
              style={{ perspective: '800px' }}
            >
              <GlassCard
                tilt
                glow={habit.completedToday ? 'gold' : 'red'}
                hover={false}
                className={cn(
                  'p-5 flex items-center gap-5 transition-all duration-500',
                  habit.completedToday ? 'border-[rgba(212,175,55,0.3)]' : 'border-[rgba(212,175,55,0.08)]'
                )}
              >
                {/* Completed glow bg */}
                {habit.completedToday && (
                  <div className="absolute inset-0 rounded-xl pointer-events-none"
                       style={{ background: 'linear-gradient(135deg, rgba(212,175,55,0.06), transparent)' }} />
                )}

                {/* Icon */}
                <motion.div
                  animate={habit.completedToday ? { scale: [1, 1.15, 1] } : {}}
                  transition={{ duration: 0.5 }}
                  className={cn(
                    'w-14 h-14 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 relative',
                  )}
                  style={{
                    background: habit.completedToday
                      ? 'linear-gradient(135deg, rgba(212,175,55,0.25), rgba(212,175,55,0.1))'
                      : 'rgba(255,255,255,0.03)',
                    border: habit.completedToday
                      ? '1px solid rgba(212,175,55,0.4)'
                      : '1px solid rgba(212,175,55,0.08)',
                    boxShadow: habit.completedToday ? '0 0 20px rgba(212,175,55,0.3)' : 'none',
                  }}
                >
                  {habit.icon}
                  {habit.completedToday && (
                    <motion.div
                      className="absolute inset-0 rounded-xl border"
                      style={{ borderColor: 'rgba(212,175,55,0.5)' }}
                      animate={{ scale: [1, 1.3], opacity: [0.6, 0] }}
                      transition={{ duration: 1.8, repeat: Infinity }}
                    />
                  )}
                </motion.div>

                {/* Info */}
                <div className="flex-1 space-y-2 min-w-0">
                  <h3
                    className="font-black text-base tracking-tight truncate"
                    style={{
                      fontFamily: 'Cinzel, serif',
                      color: habit.completedToday ? '#d4af37' : 'rgba(232,213,176,0.9)',
                      textShadow: habit.completedToday ? '0 0 15px rgba(212,175,55,0.4)' : 'none',
                    }}
                  >
                    {habit.name}
                  </h3>

                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-lg"
                         style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(212,175,55,0.08)' }}>
                      <Flame className={cn('w-3 h-3', habit.streak > 0 ? 'text-orange-400 fill-orange-400' : 'opacity-20')} />
                      <span className="text-[9px] font-black uppercase tracking-widest"
                            style={{ color: 'rgba(232,213,176,0.35)' }}>
                        {habit.streak} day streak
                      </span>
                    </div>
                  </div>

                  {/* XP bar */}
                  <div className="h-0.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: habit.completedToday ? '100%' : `${Math.min(80, habit.streak * 14)}%` }}
                      transition={{ duration: 1, ease: 'easeOut' }}
                      className="h-full rounded-full"
                      style={{
                        background: habit.completedToday
                          ? 'linear-gradient(90deg, #d4af37, #f5d478)'
                          : 'linear-gradient(90deg, #c8102e, #e8213f)',
                        boxShadow: habit.completedToday ? '0 0 6px rgba(212,175,55,0.6)' : '0 0 6px rgba(200,16,46,0.6)',
                      }}
                    />
                  </div>
                </div>

                {/* Toggle */}
                <div className="relative flex-shrink-0">
                  <XPPop trigger={xpTrigger[habit.id] || 0} />

                  {/* Burst particles */}
                  <AnimatePresence>
                    {justCompleted[habit.id] && [...Array(6)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute top-1/2 left-1/2 w-1.5 h-1.5 rounded-full"
                        style={{ backgroundColor: '#d4af37' }}
                        initial={{ x: 0, y: 0, scale: 1, opacity: 1 }}
                        animate={{
                          x: Math.cos((i / 6) * Math.PI * 2) * 36,
                          y: Math.sin((i / 6) * Math.PI * 2) * 36,
                          scale: 0, opacity: 0,
                        }}
                        transition={{ duration: 0.6, ease: 'easeOut' }}
                      />
                    ))}
                  </AnimatePresence>

                  <motion.button
                    onClick={() => handleToggle(habit.id, habit.completedToday)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.85, rotate: 8 }}
                    className="w-13 h-13 w-[52px] h-[52px] rounded-xl flex items-center justify-center relative overflow-hidden"
                    style={{
                      background: habit.completedToday
                        ? 'linear-gradient(135deg, #d4af37, #b8960c)'
                        : 'rgba(255,255,255,0.03)',
                      border: habit.completedToday
                        ? '1px solid rgba(212,175,55,0.6)'
                        : '1px solid rgba(212,175,55,0.12)',
                      boxShadow: habit.completedToday ? '0 0 25px rgba(212,175,55,0.5)' : 'none',
                    }}
                  >
                    {habit.completedToday && (
                      <motion.div
                        className="absolute inset-0"
                        style={{ background: 'rgba(255,255,255,0.2)' }}
                        initial={{ scale: 0, opacity: 1 }}
                        animate={{ scale: 2, opacity: 0 }}
                        transition={{ duration: 0.4 }}
                      />
                    )}
                    <motion.div
                      animate={habit.completedToday ? { scale: [1, 1.3, 1], rotate: [0, 15, 0] } : {}}
                      transition={{ duration: 0.5 }}
                    >
                      {habit.completedToday
                        ? <Check className="w-6 h-6 text-black stroke-[3px]" />
                        : <Sword className="w-4 h-4" style={{ color: 'rgba(212,175,55,0.4)' }} />
                      }
                    </motion.div>
                  </motion.button>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Empty state */}
      {habits.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-20 space-y-4"
        >
          <motion.div
            animate={{ y: [0, -10, 0], rotate: [0, 5, -5, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            className="text-5xl"
          >
            ⚔️
          </motion.div>
          <p className="text-[9px] font-black uppercase tracking-[0.35em]"
             style={{ color: 'rgba(232,213,176,0.2)', fontFamily: 'Cinzel, serif' }}>
            Your legend has yet to be written
          </p>
        </motion.div>
      )}
    </div>
  );
}
