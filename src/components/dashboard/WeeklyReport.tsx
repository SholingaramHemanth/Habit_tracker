import { motion } from 'motion/react';
import { GlassCard } from '@/src/components/ui/GlassCard';
import { TrendingUp, TrendingDown, Minus, Calendar, Flame, Target, Zap } from 'lucide-react';

interface WeeklyReportProps {
  habits: { name: string; icon: string; streak: number; completedToday: boolean }[];
}

export function WeeklyReport({ habits }: WeeklyReportProps) {
  // Generate mock weekly data
  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const completionRates = [65, 80, 72, 90, 85, 60, 75]; // simulated
  const avgRate = Math.round(completionRates.reduce((a, b) => a + b, 0) / completionRates.length);
  const prevAvgRate = 68;
  const trend = avgRate - prevAvgRate;
  const bestDay = weekDays[completionRates.indexOf(Math.max(...completionRates))];
  const totalCompleted = habits.filter(h => h.completedToday).length;
  const bestStreak = Math.max(...habits.map(h => h.streak), 0);

  return (
    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3, type: 'spring' }} style={{ willChange: 'transform, opacity' }}>
      <GlassCard className="p-8 border-card-border/50 overflow-hidden relative group">
        {/* Ambient glow */}
        <motion.div className="absolute -top-16 -left-16 w-48 h-48 bg-primary/8 blur-[80px] rounded-full pointer-events-none"
          animate={{ scale: [1, 1.4, 1] }} transition={{ duration: 8, repeat: Infinity }} />
        <motion.div className="absolute -bottom-16 -right-16 w-48 h-48 bg-secondary/8 blur-[80px] rounded-full pointer-events-none"
          animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 6, repeat: Infinity }} />

        {/* Header */}
        <div className="flex items-center justify-between mb-8 relative z-10">
          <div className="flex items-center gap-3">
            <motion.div className="p-2.5 bg-primary/10 rounded-xl border border-primary/20"
              animate={{ rotate: [0, 5, -5, 0] }} transition={{ duration: 5, repeat: Infinity }}>
              <Calendar className="w-5 h-5 text-primary" />
            </motion.div>
            <div>
              <h3 className="text-sm font-black text-foreground tracking-tight uppercase" style={{ fontFamily: 'Cinzel, serif' }}>
                Weekly Chronicle
              </h3>
              <p className="text-[9px] text-foreground/30 font-bold uppercase tracking-widest">7-Day Performance Summary</p>
            </div>
          </div>
          <motion.div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${trend > 0 ? 'bg-accent/10 text-accent border border-accent/20' : trend < 0 ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-foreground/5 text-foreground/40 border border-card-border'}`}
            initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.5, type: 'spring' }}>
            {trend > 0 ? <TrendingUp className="w-3 h-3" /> : trend < 0 ? <TrendingDown className="w-3 h-3" /> : <Minus className="w-3 h-3" />}
            {trend > 0 ? '+' : ''}{trend}% vs last week
          </motion.div>
        </div>

        {/* Day-by-day chart */}
        <div className="flex items-end gap-2 h-32 mb-8 relative z-10">
          {weekDays.map((day, i) => (
            <div key={day} className="flex-1 flex flex-col items-center gap-2">
              <motion.div className="w-full rounded-xl relative overflow-hidden"
                style={{ height: `${completionRates[i]}%`, minHeight: 8,
                  background: completionRates[i] >= 80 ? 'linear-gradient(to top, rgba(212,175,55,0.3), rgba(212,175,55,0.6))' :
                    completionRates[i] >= 60 ? 'linear-gradient(to top, rgba(139,92,246,0.2), rgba(139,92,246,0.5))' :
                    'linear-gradient(to top, rgba(255,255,255,0.05), rgba(255,255,255,0.15))',
                  boxShadow: completionRates[i] >= 80 ? '0 0 12px rgba(212,175,55,0.3)' : 'none',
                  border: `1px solid ${completionRates[i] >= 80 ? 'rgba(212,175,55,0.4)' : completionRates[i] >= 60 ? 'rgba(139,92,246,0.3)' : 'rgba(255,255,255,0.08)'}` }}
                initial={{ height: 0 }} animate={{ height: `${completionRates[i]}%` }}
                transition={{ delay: 0.3 + i * 0.08, duration: 0.8, ease: 'easeOut' }}>
                {/* Shimmer */}
                {completionRates[i] >= 80 && (
                  <motion.div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/10 to-transparent"
                    animate={{ y: ['100%', '-100%'] }}
                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }} />
                )}
              </motion.div>
              <span className="text-[9px] font-black text-foreground/30 uppercase">{day}</span>
            </div>
          ))}
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-4 gap-3 relative z-10">
          {[
            { label: 'Avg Rate', value: `${avgRate}%`, icon: Target, color: 'text-primary' },
            { label: 'Best Day', value: bestDay, icon: Calendar, color: 'text-secondary' },
            { label: 'Top Streak', value: `${bestStreak}d`, icon: Flame, color: 'text-orange-500' },
            { label: 'Today', value: `${totalCompleted}/${habits.length}`, icon: Zap, color: 'text-accent' },
          ].map((stat, i) => (
            <motion.div key={i} className="p-4 rounded-xl bg-foreground/[0.02] border border-card-border text-center group/stat hover:bg-foreground/[0.05] transition-all"
              initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 + i * 0.1 }} whileHover={{ y: -2 }}>
              <stat.icon className={`w-4 h-4 mx-auto mb-2 ${stat.color} group-hover/stat:scale-110 transition-transform`} />
              <div className="text-lg font-black text-foreground">{stat.value}</div>
              <div className="text-[7px] font-black text-foreground/30 uppercase tracking-widest mt-1">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Motivational insight */}
        <motion.div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-primary/5 to-secondary/5 border border-primary/10 relative z-10"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}>
          <p className="text-[11px] text-foreground/60 font-medium leading-relaxed">
            <span className="text-primary font-black">🔮 Insight:</span> Your {bestDay} performance peaks at {Math.max(...completionRates)}%. 
            {trend > 0 ? ' Great momentum — keep pushing forward, warrior!' : ' Focus on consistency to unlock your next level.'}
          </p>
        </motion.div>
      </GlassCard>
    </motion.div>
  );
}
