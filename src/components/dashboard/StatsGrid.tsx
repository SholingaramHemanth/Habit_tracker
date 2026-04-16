import { GlassCard } from '@/src/components/ui/GlassCard';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Mon', value: 4 },
  { name: 'Tue', value: 3 },
  { name: 'Wed', value: 5 },
  { name: 'Thu', value: 2 },
  { name: 'Fri', value: 6 },
  { name: 'Sat', value: 7 },
  { name: 'Sun', value: 5 },
];

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

  const monthData = Array.from({ length: 30 }, (_, i) => ({
    name: `D${i+1}`,
    value: isEmpty ? 0 : Math.floor(Math.random() * 10)
  }));

  const chartData = mode === 'month' ? monthData : weekData;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <GlassCard className="md:col-span-2 p-6 border-white/5">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-white tracking-tight uppercase">Activity Overview</h3>
          <div className="text-xs font-bold text-white/40 uppercase tracking-widest">
            {mode === 'month' ? 'Last 30 Days' : 'Last 7 Days'}
          </div>
        </div>
        <div className="h-64 w-full">
          <ResponsiveContainer width="99%" height={256}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10 }}
                dy={10}
                interval={mode === 'month' ? 4 : 0}
              />
              <YAxis hide />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(0,0,0,0.8)', 
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '12px',
                  color: '#fff'
                }}
                itemStyle={{ color: '#8b5cf6' }}
              />
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke="#8b5cf6" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorValue)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </GlassCard>

      <div className="space-y-6">
        <GlassCard className="p-6 border-white/5 bg-primary/5">
          <h4 className="text-xs font-bold text-white/40 uppercase tracking-widest mb-2">Total Completion</h4>
          <div className="text-4xl font-black text-white">{isEmpty ? '0%' : '84%'}</div>
          <div className="text-xs font-bold text-accent mt-2">{isEmpty ? 'Start your first habit!' : '+12% from last week'}</div>
        </GlassCard>
        
        <GlassCard className="p-6 border-white/5 bg-secondary/5">
          <h4 className="text-xs font-bold text-white/40 uppercase tracking-widest mb-2">Best Streak</h4>
          <div className="text-4xl font-black text-white">{isEmpty ? '0 Days' : '14 Days'}</div>
          <div className="text-xs font-bold text-secondary mt-2">{isEmpty ? 'Aura level: Novice' : 'Meditation Master'}</div>
        </GlassCard>
      </div>
    </div>
  );
}
