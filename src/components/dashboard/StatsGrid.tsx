import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { GlassCard } from '@/src/components/ui/GlassCard';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Flame, Target, Zap } from 'lucide-react';

function AnimatedCounter({ target, suffix = '' }: { target: string; suffix?: string }) {
  const [display, setDisplay] = useState('0');
  
  useEffect(() => {
    const numTarget = parseInt(target);
    if (isNaN(numTarget)) { setDisplay(target); return; }
    let current = 0;
    const step = Math.max(1, Math.floor(numTarget / 30));
    const interval = setInterval(() => {
      current += step;
      if (current >= numTarget) { setDisplay(target); clearInterval(interval); }
      else setDisplay(String(current));
    }, 30);
    return () => clearInterval(interval);
  }, [target]);
  
  return <>{display}{suffix}</>;
}

interface StatsGridProps {
  mode: 'week' | 'month';
  isEmpty: boolean;
}

export function StatsGrid({ mode, isEmpty }: StatsGridProps) {
  const weekData = [
    { name: 'Mon', value: isEmpty ? 0 : 4 },
    { name: 'Tue', value: isEmpty ? 0 : 3 },
    { name: 'Wed', value: isEmpty ? 0 : 5 },
    { name: 'Thu', value: isEmpty ? 0 : 2 },
    { name: 'Fri', value: isEmpty ? 0 : 6 },
    { name: 'Sat', value: isEmpty ? 0 : 7 },
    { name: 'Sun', value: isEmpty ? 0 : 5 },
  ];
  const monthData = Array.from({ length: 30 }, (_, i) => ({ name: `D${i+1}`, value: isEmpty ? 0 : Math.floor(Math.random() * 10) }));
  const chartData = mode === 'month' ? monthData : weekData;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Chart Card */}
      <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, type: 'spring', bounce: 0.2 }} className="md:col-span-2 relative group" style={{ willChange: 'transform, opacity' }}>
        <GlassCard className="h-full p-8 border-card-border/40 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          <motion.div className="absolute inset-0 pointer-events-none morph-gradient opacity-0 group-hover:opacity-30 transition-opacity duration-700" />
          
          <div className="flex items-center justify-between mb-8 relative z-10">
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <motion.div className="p-2 bg-primary/10 rounded-xl border border-primary/20"
                  animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 3, repeat: Infinity }}>
                  <TrendingUp className="w-5 h-5 text-primary" />
                </motion.div>
                <h3 className="text-xl font-black text-foreground tracking-tight uppercase" style={{ fontFamily: 'Cinzel, serif' }}>Activity Engine</h3>
              </div>
              <p className="text-[10px] font-bold text-foreground/30 uppercase tracking-[0.2em]">Neural Feedback Loop</p>
            </div>
            <motion.div className="px-4 py-2 bg-foreground/[0.03] rounded-xl border border-card-border text-[9px] font-black text-foreground/40 uppercase tracking-widest"
              whileHover={{ scale: 1.05, borderColor: 'rgba(212,175,55,0.3)' }}>
              {mode === 'month' ? '30-Day Cycle' : '7-Day Cycle'}
            </motion.div>
          </div>

          <div className="h-64 w-full relative z-10">
            <ResponsiveContainer width="99%" height={256}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.5}/>
                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="strokeGrad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="var(--primary)" />
                    <stop offset="50%" stopColor="var(--secondary)" />
                    <stop offset="100%" stopColor="var(--accent)" />
                  </linearGradient>
                  <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="5" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false}
                  tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10, fontWeight: 'bold' }}
                  dy={10} interval={mode === 'month' ? 4 : 0} />
                <YAxis hide />
                <Tooltip contentStyle={{ backgroundColor: 'rgba(10,10,10,0.95)', border: '1px solid rgba(212,175,55,0.2)',
                  borderRadius: '16px', color: '#fff', boxShadow: '0 0 30px rgba(212,175,55,0.15)', backdropFilter: 'blur(10px)', fontWeight: 'bold' }}
                  itemStyle={{ color: 'var(--secondary)', fontWeight: 'bold' }}
                  cursor={{ stroke: 'rgba(212,175,55,0.2)', strokeWidth: 2, strokeDasharray: '5 5' }} />
                <Area type="monotone" dataKey="value" stroke="url(#strokeGrad)" strokeWidth={3}
                  fillOpacity={1} fill="url(#colorValue)"
                  activeDot={{ r: 7, strokeWidth: 3, stroke: '#000', fill: 'var(--secondary)', filter: 'url(#glow)' }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </motion.div>

      {/* Stat Cards */}
      <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.1, type: 'spring', bounce: 0.2 }} className="space-y-6" style={{ willChange: 'transform, opacity' }}>
        {/* Total Resonance */}
        <GlassCard className="p-8 border-primary/20 bg-primary/[0.03] relative overflow-hidden group hover:border-primary/40 transition-colors">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-[40px] rounded-full group-hover:bg-primary/20 transition-colors duration-500" />
          <motion.div className="absolute top-4 right-4" animate={{ scale: [1, 1.3, 1], rotate: [0, 15, 0] }} transition={{ duration: 3, repeat: Infinity }}>
            <Target className="w-5 h-5 text-primary/30" />
          </motion.div>
          <h4 className="text-[10px] font-black text-foreground/30 uppercase tracking-[0.2em] mb-3 relative z-10">Total Resonance</h4>
          <motion.div className="text-5xl font-black text-foreground tracking-tighter relative z-10"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.6 }}>
            {isEmpty ? '0%' : <AnimatedCounter target="84" suffix="%" />}
          </motion.div>
          <div className="flex items-center gap-2 mt-3 relative z-10">
            {!isEmpty && <motion.div animate={{ y: [0, -3, 0] }} transition={{ duration: 1.5, repeat: Infinity }}><TrendingUp className="w-3 h-3 text-primary" /></motion.div>}
            <div className="text-xs font-bold text-primary uppercase tracking-widest">{isEmpty ? 'Awaiting Data' : '+12% from last cycle'}</div>
          </div>
          {/* Animated sparkline */}
          <div className="mt-4 flex gap-1 relative z-10">
            {[40, 60, 35, 80, 55, 90, 70].map((v, i) => (
              <motion.div key={i} className="flex-1 rounded-full bg-primary/20 overflow-hidden" style={{ height: '4px' }}>
                <motion.div className="h-full bg-gradient-to-r from-primary to-primary-light rounded-full"
                  initial={{ width: '0%' }} animate={{ width: `${v}%` }}
                  transition={{ delay: 0.5 + i * 0.1, duration: 0.8, ease: 'easeOut' }} />
              </motion.div>
            ))}
          </div>
        </GlassCard>
        
        {/* Peak Momentum */}
        <GlassCard className="p-8 border-secondary/20 bg-secondary/[0.03] relative overflow-hidden group hover:border-secondary/40 transition-colors">
          <div className="absolute top-0 left-0 w-32 h-32 bg-secondary/10 blur-[40px] rounded-full group-hover:bg-secondary/20 transition-colors duration-500" />
          <motion.div className="absolute top-4 right-4" animate={{ scale: [1, 1.4, 1], rotate: [0, 10, -10, 0] }} transition={{ duration: 2, repeat: Infinity }}>
            <Flame className="w-5 h-5 text-secondary/40" />
          </motion.div>
          <h4 className="text-[10px] font-black text-foreground/30 uppercase tracking-[0.2em] mb-3 relative z-10">Peak Momentum</h4>
          <motion.div className="text-5xl font-black text-foreground tracking-tighter relative z-10"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.6 }}>
            {isEmpty ? '0' : <AnimatedCounter target="14" />} <span className="text-xl text-foreground/40">Days</span>
          </motion.div>
          <div className="text-xs font-bold text-secondary mt-3 relative z-10 uppercase tracking-widest">{isEmpty ? 'Aura Level: Dormant' : 'Meditation Master'}</div>
          {/* Animated streak dots */}
          <div className="flex gap-1.5 mt-4 relative z-10">
            {Array.from({ length: 14 }).map((_, i) => (
              <motion.div key={i} className="w-2 h-2 rounded-full"
                style={{ backgroundColor: i < (isEmpty ? 0 : 14) ? '#d4af37' : 'rgba(255,255,255,0.05)',
                  boxShadow: i < (isEmpty ? 0 : 14) ? '0 0 6px rgba(212,175,55,0.6)' : 'none' }}
                initial={{ scale: 0 }} animate={{ scale: 1 }}
                transition={{ delay: 0.8 + i * 0.05, type: 'spring', stiffness: 300 }} />
            ))}
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
}
