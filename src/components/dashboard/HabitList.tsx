import { motion, AnimatePresence, useMotionValue, useTransform } from 'motion/react';
import { GlassCard } from '@/src/components/ui/GlassCard';
import { Habit } from '@/src/types';
import { Flame, Check, Plus, Sword, Trash2, Edit3, X } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { XPPop } from '@/src/components/ui/XPPop';
import { useState } from 'react';
import { playHabitComplete, playXPGain, playDelete, playButtonClick } from '@/src/lib/sounds';

interface HabitListProps {
  habits: Habit[];
  onToggle: (id: string) => void;
  onAdd: () => void;
  onDelete?: (id: string) => void;
  onEdit?: (id: string, newName: string) => void;
}

export function HabitList({ habits, onToggle, onAdd, onDelete, onEdit }: HabitListProps) {
  const [xpTrigger, setXpTrigger] = useState<Record<string, number>>({});
  const [justCompleted, setJustCompleted] = useState<Record<string, boolean>>({});
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [swipedId, setSwipedId] = useState<string | null>(null);

  const handleToggle = (id: string, completed: boolean) => {
    if (!completed) {
      setXpTrigger(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
      setJustCompleted(prev => ({ ...prev, [id]: true }));
      setTimeout(() => setJustCompleted(prev => ({ ...prev, [id]: false })), 800);
      playHabitComplete();
      setTimeout(() => playXPGain(), 300);
    }
    onToggle(id);
  };

  const handleDelete = (id: string) => {
    playDelete();
    onDelete?.(id);
    setSwipedId(null);
  };

  const handleEditStart = (habit: Habit) => {
    playButtonClick();
    setEditingId(habit.id);
    setEditName(habit.name);
  };

  const handleEditSave = () => {
    if (editingId && editName.trim()) {
      onEdit?.(editingId, editName.trim());
      playButtonClick();
    }
    setEditingId(null);
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

            {/* Combo Counter */}
            {habits.filter(h => h.completedToday).length > 0 && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl ml-2"
                style={{
                  background: 'linear-gradient(135deg, rgba(200,16,46,0.2), rgba(212,175,55,0.1))',
                  border: '1px solid rgba(212,175,55,0.3)',
                }}
              >
                <motion.span animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 1, repeat: Infinity }}
                  className="text-sm">🔥</motion.span>
                <span className="text-[10px] font-black uppercase tracking-widest"
                  style={{ color: '#ffd700', textShadow: '0 0 8px rgba(212,175,55,0.6)' }}>
                  {habits.filter(h => h.completedToday).length}x Combo
                </span>
              </motion.div>
            )}
          </div>
          <p className="text-[9px] font-bold uppercase tracking-[0.35em]"
             style={{ color: 'rgba(232,213,176,0.3)', fontFamily: 'Cinzel, serif' }}>
            Complete rites · Forge your legend · {habits.filter(h => h.completedToday).length}/{habits.length} cleared
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
              whileHover={{ y: -8, scale: 1.03, rotateX: 8, rotateY: -3 }}
              style={{ perspective: '1200px' }}
              className="relative z-10"
            >
              <GlassCard
                tilt
                glow={habit.completedToday ? 'gold' : 'red'}
                hover={true}
                className={cn(
                  'p-6 flex items-center gap-6 transition-all duration-700 relative overflow-hidden group/habit',
                  habit.completedToday ? 'border-[rgba(212,175,55,0.6)] shadow-[0_0_40px_rgba(212,175,55,0.2)]' : 'border-[rgba(212,175,55,0.15)] shadow-[0_10px_30px_rgba(0,0,0,0.5)]'
                )}
              >
                {/* Mystic inner glow for uncompleted */}
                {!habit.completedToday && (
                  <div className="absolute inset-0 bg-gradient-to-br from-red-900/10 to-transparent opacity-0 group-hover/habit:opacity-100 transition-opacity duration-700 pointer-events-none" />
                )}

                {/* Elaborate Completed Background */}
                {habit.completedToday && (
                  <>
                    <div className="absolute inset-0 pointer-events-none"
                         style={{ background: 'linear-gradient(135deg, rgba(212,175,55,0.15), rgba(212,175,55,0.02))' }} />
                    <motion.div 
                      className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 pointer-events-none"
                      animate={{ backgroundPosition: ['0px 0px', '100px 100px'] }}
                      transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                    />
                    <motion.div 
                      className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-[50px] rounded-full pointer-events-none"
                      animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 4, repeat: Infinity }}
                    />
                  </>
                )}

                {/* Animated Sweeping Border */}
                <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent scale-x-0 group-hover/habit:scale-x-100 transition-transform duration-700 origin-left" />

                {/* Icon Container - Premium Bevel */}
                <motion.div
                  animate={habit.completedToday ? { scale: [1, 1.15, 1], rotate: [0, 5, -5, 0] } : {}}
                  transition={{ duration: 0.5 }}
                  className={cn(
                    'w-16 h-16 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0 relative z-10',
                  )}
                  style={{
                    background: habit.completedToday
                      ? 'linear-gradient(135deg, rgba(212,175,55,0.4), rgba(212,175,55,0.1))'
                      : 'linear-gradient(135deg, rgba(255,255,255,0.05), rgba(0,0,0,0.5))',
                    border: habit.completedToday
                      ? '2px solid rgba(212,175,55,0.8)'
                      : '1px solid rgba(212,175,55,0.2)',
                    boxShadow: habit.completedToday 
                      ? '0 0 30px rgba(212,175,55,0.5), inset 0 0 15px rgba(255,255,255,0.4)' 
                      : 'inset 0 2px 10px rgba(255,255,255,0.05)',
                  }}
                >
                  <span className="drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">{habit.icon}</span>
                  {habit.completedToday && (
                    <motion.div
                      className="absolute inset-[-4px] rounded-2xl border-2"
                      style={{ borderColor: 'rgba(212,175,55,0.5)' }}
                      animate={{ scale: [1, 1.4], opacity: [0.8, 0], rotate: [0, 10] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  )}
                </motion.div>

                {/* Info */}
                <div className="flex-1 space-y-3 min-w-0 relative z-10">
                  <div className="flex items-center gap-2">
                    {editingId === habit.id ? (
                      <div className="flex items-center gap-2 flex-1">
                        <input type="text" value={editName} onChange={e => setEditName(e.target.value)}
                          onKeyDown={e => { if (e.key === 'Enter') handleEditSave(); if (e.key === 'Escape') setEditingId(null); }}
                          autoFocus
                          className="flex-1 bg-black/50 border border-primary/50 rounded-lg px-3 py-1.5 text-lg font-black focus:outline-none focus:ring-2 focus:ring-primary/30"
                          style={{ fontFamily: 'Cinzel, serif', color: '#ffd700' }} />
                        <motion.button onClick={handleEditSave} whileTap={{ scale: 0.9 }}
                          className="p-1.5 bg-accent/20 rounded-lg border border-accent/30 text-accent hover:bg-accent/30 transition-all">
                          <Check className="w-4 h-4" />
                        </motion.button>
                        <motion.button onClick={() => setEditingId(null)} whileTap={{ scale: 0.9 }}
                          className="p-1.5 bg-red-500/10 rounded-lg border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-all">
                          <X className="w-4 h-4" />
                        </motion.button>
                      </div>
                    ) : (
                      <>
                        <h3
                          className="font-black text-xl tracking-tight truncate transition-colors duration-500 flex-1"
                          style={{
                            fontFamily: 'Cinzel, serif',
                            color: habit.completedToday ? '#ffd700' : 'rgba(232,213,176,0.95)',
                            textShadow: habit.completedToday ? '0 0 20px rgba(212,175,55,0.6)' : '0 2px 4px rgba(0,0,0,0.8)',
                          }}
                        >
                          {habit.name}
                        </h3>
                        {/* Edit/Delete actions */}
                        <div className="flex items-center gap-1 opacity-0 group-hover/habit:opacity-100 transition-opacity duration-300">
                          {onEdit && (
                            <motion.button onClick={(e) => { e.stopPropagation(); handleEditStart(habit); }}
                              whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.85 }}
                              className="p-1.5 rounded-lg hover:bg-white/10 transition-all" title="Edit quest">
                              <Edit3 className="w-3.5 h-3.5" style={{ color: 'rgba(212,175,55,0.5)' }} />
                            </motion.button>
                          )}
                          {onDelete && (
                            <motion.button onClick={(e) => { e.stopPropagation(); handleDelete(habit.id); }}
                              whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.85 }}
                              className="p-1.5 rounded-lg hover:bg-red-500/10 transition-all" title="Delete quest">
                              <Trash2 className="w-3.5 h-3.5 text-red-500/40 hover:text-red-400" />
                            </motion.button>
                          )}
                        </div>
                      </>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 px-3 py-1 rounded-xl shadow-inner transition-all duration-500"
                         style={{ 
                           background: habit.streak > 0 ? 'rgba(200,16,46,0.1)' : 'rgba(255,255,255,0.03)', 
                           border: habit.streak > 0 ? '1px solid rgba(200,16,46,0.3)' : '1px solid rgba(212,175,55,0.08)' 
                         }}>
                      <Flame className={cn('w-4 h-4 transition-all duration-500', habit.streak > 0 ? 'text-orange-500 fill-orange-500 drop-shadow-[0_0_8px_rgba(249,115,22,0.8)] animate-pulse' : 'opacity-30')} />
                      <span className="text-[10px] font-black uppercase tracking-widest"
                            style={{ color: habit.streak > 0 ? '#fca5a5' : 'rgba(232,213,176,0.4)' }}>
                        {habit.streak} day streak
                      </span>
                    </div>
                  </div>

                  {/* Enhanced XP bar */}
                  <div className="h-1.5 rounded-full overflow-hidden shadow-inner border border-white/5 relative" style={{ background: 'rgba(0,0,0,0.5)' }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: habit.completedToday ? '100%' : `${Math.min(80, habit.streak * 14)}%` }}
                      transition={{ duration: 1.5, ease: 'easeOut', type: 'spring' }}
                      className="h-full rounded-full relative overflow-hidden"
                      style={{
                        background: habit.completedToday
                          ? 'linear-gradient(90deg, #b8960c, #ffd700, #fff8b0)'
                          : 'linear-gradient(90deg, #7f1d1d, #dc2626, #ef4444)',
                        boxShadow: habit.completedToday ? '0 0 10px rgba(212,175,55,0.8)' : '0 0 10px rgba(220,38,38,0.8)',
                      }}
                    >
                      <motion.div 
                        className="absolute inset-0 bg-white/30"
                        animate={{ x: ['-100%', '200%'] }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                      />
                    </motion.div>
                  </div>
                </div>

                {/* Toggle - Premium Seal */}
                <div className="relative flex-shrink-0 z-20">
                  <XPPop trigger={xpTrigger[habit.id] || 0} />

                  {/* Explosive Burst particles */}
                  <AnimatePresence>
                    {justCompleted[habit.id] && [...Array(12)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute top-1/2 left-1/2 w-2 h-2 rounded-full"
                        style={{ backgroundColor: i % 2 === 0 ? '#ffd700' : '#ffffff', boxShadow: '0 0 10px #ffd700' }}
                        initial={{ x: 0, y: 0, scale: 1, opacity: 1 }}
                        animate={{
                          x: Math.cos((i / 12) * Math.PI * 2) * 60,
                          y: Math.sin((i / 12) * Math.PI * 2) * 60,
                          scale: 0, opacity: 0,
                        }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                      />
                    ))}
                  </AnimatePresence>

                  <motion.button
                    onClick={() => handleToggle(habit.id, habit.completedToday)}
                    whileHover={{ scale: 1.15, rotate: 5 }}
                    whileTap={{ scale: 0.85, rotate: -15 }}
                    className="w-16 h-16 rounded-2xl flex items-center justify-center relative overflow-hidden shadow-2xl group/btn"
                    style={{
                      background: habit.completedToday
                        ? 'linear-gradient(135deg, #ffd700, #b8960c)'
                        : 'linear-gradient(135deg, rgba(30,20,25,0.8), rgba(15,8,20,0.9))',
                      border: habit.completedToday
                        ? '2px solid rgba(255,255,255,0.8)'
                        : '2px solid rgba(212,175,55,0.3)',
                      boxShadow: habit.completedToday 
                        ? '0 0 40px rgba(212,175,55,0.8), inset 0 0 20px rgba(255,255,255,0.5)' 
                        : 'inset 0 0 20px rgba(0,0,0,0.8)',
                    }}
                  >
                    {!habit.completedToday && (
                      <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />
                    )}
                    {habit.completedToday && (
                      <motion.div
                        className="absolute inset-0"
                        style={{ background: 'linear-gradient(45deg, transparent, rgba(255,255,255,0.6), transparent)' }}
                        animate={{ x: ['-200%', '200%'] }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                      />
                    )}
                    <motion.div
                      animate={habit.completedToday ? { scale: [0, 1.4, 1], rotate: [-45, 0] } : {}}
                      transition={{ duration: 0.6, type: 'spring' }}
                      className="relative z-10"
                    >
                      {habit.completedToday
                        ? <Check className="w-8 h-8 text-black stroke-[4px] drop-shadow-md" />
                        : <Sword className="w-6 h-6 group-hover/btn:scale-125 transition-transform duration-300" style={{ color: 'rgba(212,175,55,0.6)', filter: 'drop-shadow(0 0 5px rgba(212,175,55,0.4))' }} />
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
