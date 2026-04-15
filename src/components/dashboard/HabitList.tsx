import { motion } from 'motion/react';
import { GlassCard } from '@/src/components/ui/GlassCard';
import { Habit } from '@/src/types';
import { Flame, Check, Plus } from 'lucide-react';
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

  const handleToggle = (id: string, completed: boolean) => {
    if (!completed) {
      setXpTrigger(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
    }
    onToggle(id);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-black text-white tracking-tighter uppercase italic">Daily Quest</h2>
          <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">Complete your routines to gain XP</p>
        </div>
        <button 
          onClick={onAdd}
          className="group relative p-3 bg-white text-black rounded-xl hover:scale-110 active:scale-90 transition-all shadow-glow-purple"
        >
          <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {habits.map((habit) => (
          <GlassCard 
            key={habit.id} 
            className={cn(
              "p-6 flex items-center gap-6 transition-all duration-500 border-white/[0.05]",
              habit.completedToday ? "bg-accent/[0.03] border-accent/20" : "hover:bg-white/[0.05]"
            )}
          >
            <div className={cn(
              "w-16 h-16 rounded-2xl flex items-center justify-center text-3xl transition-all duration-500 shadow-2xl",
              habit.completedToday ? "bg-accent/20 scale-110 rotate-3" : "bg-white/[0.03] border border-white/[0.08]"
            )}>
              {habit.icon}
            </div>

            <div className="flex-1 space-y-1">
              <h3 className={cn(
                "font-black text-xl tracking-tight transition-colors",
                habit.completedToday ? "text-accent" : "text-white"
              )}>
                {habit.name}
              </h3>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/[0.03] border border-white/[0.05]">
                  <Flame className={cn("w-3.5 h-3.5", habit.streak > 0 ? "text-orange-500 fill-orange-500" : "text-white/10")} />
                  <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">{habit.streak} DAY STREAK</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <XPPop trigger={xpTrigger[habit.id] || 0} />
              <button
                onClick={() => handleToggle(habit.id, habit.completedToday)}
                className={cn(
                  "w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 border-2",
                  habit.completedToday 
                    ? "bg-accent border-accent text-white scale-110 shadow-[0_0_30px_rgba(16,185,129,0.3)]" 
                    : "bg-transparent border-white/[0.08] text-white/10 hover:border-white/20 hover:text-white/40"
                )}
              >
                <motion.div
                  animate={habit.completedToday ? { scale: [1, 1.5, 1], rotate: [0, 15, 0] } : {}}
                >
                  <Check className={cn("w-7 h-7", habit.completedToday ? "stroke-[4px]" : "stroke-[2px]")} />
                </motion.div>
              </button>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
