import { motion, AnimatePresence } from 'motion/react';
import { LayoutDashboard, CheckSquare, BarChart2, User, Settings, LogOut, Zap, Sword } from 'lucide-react';
import { cn } from '@/src/lib/utils';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onLogout: () => void;
}

const menuItems = [
  { id: 'dashboard', icon: LayoutDashboard, label: 'SANCTUM',   sub: 'Home Base' },
  { id: 'habits',    icon: CheckSquare,    label: 'QUESTS',     sub: 'Daily Rites' },
  { id: 'treasury',  icon: Sword,          label: 'TREASURY',   sub: 'Upgrades' },
  { id: 'stats',     icon: BarChart2,      label: 'CHRONICLES', sub: 'Your Legend' },
  { id: 'profile',   icon: User,           label: 'CHARACTER',  sub: 'Your Soul' },
  { id: 'settings',  icon: Settings,       label: 'ARCANA',     sub: 'Configure' },
];

const SIDEBAR_PARTICLES = Array.from({ length: 8 }, (_, i) => ({
  x: 20 + Math.random() * 200,
  delay: i * 1.5,
  duration: 8 + Math.random() * 6,
  size: 1 + Math.random() * 2,
}));

const FLOATING_RUNES = Array.from({ length: 5 }, (_, i) => ({
  x: 10 + Math.random() * 220,
  char: ['✧', '✦', '⚝', '✶', '✵'][i % 5],
  delay: i * 2,
  duration: 15 + Math.random() * 10,
  size: 14 + Math.random() * 8,
}));

export function Sidebar({ activeTab, onTabChange, onLogout }: SidebarProps) {
  return (
    <div className="w-64 h-screen flex flex-col p-6 fixed left-0 top-0 z-40 overflow-hidden glass-dark">
      {/* Dragon watermark bg */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 dot-grid opacity-40" />
        {/* Animated red ember orb top */}
        <motion.div
          className="absolute -top-16 -left-16 w-48 h-48 rounded-full blur-[80px]"
          style={{ background: 'radial-gradient(circle, rgba(200,16,46,0.25), transparent)' }}
          animate={{ scale: [1, 1.4, 1], opacity: [0.4, 0.9, 0.4] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        />
        {/* Gold orb bottom */}
        <motion.div
          className="absolute -bottom-16 -right-16 w-48 h-48 rounded-full blur-[80px]"
          style={{ background: 'radial-gradient(circle, rgba(212,175,55,0.2), transparent)' }}
          animate={{ scale: [1.3, 1, 1.3], opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        />
        {/* ══════ NEW: Purple accent orb center ══════ */}
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full blur-[60px]"
          style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.12), transparent)' }}
          animate={{ scale: [1, 1.6, 1], opacity: [0.1, 0.3, 0.1] }}
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* ══════ NEW: Floating micro particles ══════ */}
        {SIDEBAR_PARTICLES.map((p, i) => (
          <motion.div
            key={`p-${i}`}
            className="absolute rounded-full"
            style={{
              width: p.size,
              height: p.size,
              left: p.x,
              bottom: '-5px',
              backgroundColor: i % 2 === 0 ? '#d4af37' : '#c8102e',
              boxShadow: `0 0 ${p.size * 3}px ${i % 2 === 0 ? '#d4af37' : '#c8102e'}`,
            }}
            animate={{
              y: [0, -700],
              opacity: [0, 0.6, 0],
              x: [0, Math.sin(i) * 20],
            }}
            transition={{
              duration: p.duration,
              repeat: Infinity,
              delay: p.delay,
              ease: 'easeOut',
            }}
          />
        ))}

        {/* ══════ NEW: Floating Runes ══════ */}
        {FLOATING_RUNES.map((r, i) => (
          <motion.div
            key={`r-${i}`}
            className="absolute font-black pointer-events-none mix-blend-screen"
            style={{
              fontSize: r.size,
              left: r.x,
              bottom: '-20px',
              color: '#ffd700',
              textShadow: '0 0 10px rgba(212,175,55,0.6)',
              fontFamily: 'Cinzel, serif',
            }}
            animate={{
              y: [0, -800],
              opacity: [0, 0.3, 0],
              rotate: [0, 180, 360],
              x: [0, Math.cos(i) * 30],
            }}
            transition={{
              duration: r.duration,
              repeat: Infinity,
              delay: r.delay,
              ease: 'linear',
            }}
          >
            {r.char}
          </motion.div>
        ))}

        {/* Vertical gold divider line */}
        <div className="absolute top-0 right-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[rgba(212,175,55,0.3)] to-transparent" />
        {/* ══════ NEW: Breathing glow on the right border ══════ */}
        <motion.div
          className="absolute top-0 right-0 bottom-0 w-[2px]"
          style={{ background: 'linear-gradient(to bottom, transparent, rgba(212,175,55,0.4), transparent)' }}
          animate={{ opacity: [0.2, 0.6, 0.2] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      {/* ── Logo ── */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, type: 'spring' }}
        className="relative z-10 flex flex-col items-center gap-3 mb-10 pt-2"
      >
        {/* Rune ring logo */}
        <div className="relative w-16 h-16 flex items-center justify-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 14, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-0 rounded-full border border-[rgba(212,175,55,0.3)]"
            style={{ borderStyle: 'dashed' }}
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-[6px] rounded-full border border-[rgba(200,16,46,0.4)]"
            style={{ borderStyle: 'dotted' }}
          />
          {/* ══════ NEW: Third ring ══════ */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-[-6px] rounded-full border border-[rgba(124,58,237,0.15)]"
          />
          <motion.div
            className="relative w-10 h-10 rounded-full flex items-center justify-center z-10"
            style={{
              background: 'linear-gradient(135deg, #c8102e, #8b0000)',
              boxShadow: '0 0 20px rgba(200,16,46,0.6), inset 0 1px 0 rgba(255,255,255,0.1)'
            }}
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Sword className="w-5 h-5 text-[#d4af37]" />
          </motion.div>
          {/* ══════ NEW: Pulse ring behind logo ══════ */}
          <motion.div
            className="absolute inset-[-2px] rounded-full border-2 border-[rgba(200,16,46,0.4)]"
            animate={{ scale: [1, 1.8], opacity: [0.5, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
          />
        </div>

        <div className="text-center relative">
          <motion.div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-8 bg-secondary/20 blur-xl rounded-full pointer-events-none" animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0.8, 0.5] }} transition={{ duration: 3, repeat: Infinity }} />
          <motion.div
            className="text-2xl font-black tracking-[0.4em] uppercase relative z-10"
            style={{ fontFamily: 'Cinzel, serif', backgroundImage: 'linear-gradient(to right, #b8960c, #ffd700, #fff8b0)', WebkitBackgroundClip: 'text', color: 'transparent' }}
            animate={{ textShadow: ['0 0 20px rgba(212,175,55,0.4)', '0 0 40px rgba(212,175,55,0.8)', '0 0 20px rgba(212,175,55,0.4)'] }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            AURA
          </motion.div>
          <div className="text-[8px] tracking-[0.4em] uppercase text-foreground/40 mt-0.5"
               style={{ fontFamily: 'Cinzel, serif' }}>
            The Legend Begins
          </div>
        </div>

        {/* Gold divider with diamonds */}
        <div className="flex items-center gap-2 w-full px-2">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent to-[rgba(212,175,55,0.4)]" />
          <motion.div 
            className="w-1.5 h-1.5 rotate-45 bg-[rgba(212,175,55,0.5)]"
            animate={{ scale: [1, 1.4, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <div className="flex-1 h-px bg-gradient-to-l from-transparent to-[rgba(212,175,55,0.4)]" />
        </div>
      </motion.div>

      {/* ── Nav ── */}
      <nav className="flex-1 space-y-1 relative z-10">
        {menuItems.map((item, index) => {
          const isActive = activeTab === item.id;
          return (
            <motion.button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 + index * 0.08, type: 'spring', stiffness: 180 }}
              whileHover={{ x: 6 }}
              whileTap={{ scale: 0.97 }}
              className={cn(
                'w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 group relative overflow-hidden text-left',
                isActive ? 'text-secondary' : 'text-foreground/40 hover:text-foreground/80'
              )}
            >
              {/* Active bg */}
              {isActive && (
                <motion.div
                  layoutId="active-fantasy-tab"
                  className="absolute inset-0 rounded-xl"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  style={{
                    background: 'linear-gradient(135deg, rgba(200,16,46,0.18), rgba(212,175,55,0.06))',
                    borderLeft: '2px solid #c8102e',
                    boxShadow: 'inset 0 0 20px rgba(200,16,46,0.08)'
                  }}
                />
              )}

              {/* Hover sweep */}
              <motion.div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 rounded-xl transition-opacity duration-300"
                style={{ background: 'linear-gradient(90deg, transparent, rgba(212,175,55,0.04), transparent)' }}
              />

              {/* ══════ NEW: Hover shimmer sweep ══════ */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none overflow-hidden rounded-xl">
                <motion.div
                  className="absolute top-0 left-0 w-1/2 h-full"
                  style={{ background: 'linear-gradient(90deg, transparent, rgba(212,175,55,0.06), transparent)' }}
                  animate={{ x: ['-100%', '300%'] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear', repeatDelay: 1 }}
                />
              </div>

              {/* Icon */}
              <div className="relative z-10 flex-shrink-0">
                <motion.div
                  animate={isActive ? { scale: [1, 1.15, 1] } : {}}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <item.icon
                    className={cn('w-4 h-4 transition-all', isActive ? 'text-[#c8102e]' : '')}
                  />
                </motion.div>
                {isActive && (
                  <motion.div
                    className="absolute inset-0 blur-md"
                    style={{ backgroundColor: '#c8102e', opacity: 0.5 }}
                    animate={{ opacity: [0.3, 0.7, 0.3] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                )}
              </div>

              {/* Labels */}
              <div className="relative z-10 flex-1">
                <div
                  className="text-[10px] font-black tracking-[0.25em] block"
                  style={{ fontFamily: 'Cinzel, serif' }}
                >
                  {item.label}
                </div>
                <div className="text-[8px] tracking-widest opacity-40 mt-0.5 uppercase">
                  {item.sub}
                </div>
              </div>

              {/* Active indicator */}
              {isActive && (
                <motion.div
                  className="w-1 h-1 rotate-45 relative z-10 flex-shrink-0"
                  style={{ backgroundColor: '#d4af37' }}
                  animate={{ opacity: [1, 0.3, 1], scale: [1, 1.5, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              )}
            </motion.button>
          );
        })}
      </nav>

      {/* ── Divider ── */}
      <div className="flex items-center gap-2 px-2 mb-3 relative z-10">
        <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(212,175,55,0.2))' }} />
        <motion.div 
          className="w-1 h-1 rotate-45 bg-[rgba(212,175,55,0.3)]"
          animate={{ rotate: [45, 225, 45] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
        />
        <div className="flex-1 h-px" style={{ background: 'linear-gradient(270deg, transparent, rgba(212,175,55,0.2))' }} />
      </div>

      {/* ── Logout ── */}
      <motion.button
        onClick={onLogout}
        whileHover={{ x: -4, backgroundColor: 'rgba(200,16,46,0.05)' }}
        whileTap={{ scale: 0.97 }}
        className="relative z-10 w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all group text-primary/40 hover:text-primary"
      >
        <LogOut className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span className="text-[10px] font-black tracking-[0.25em] uppercase" style={{ fontFamily: 'Cinzel, serif' }}>
          Retreat
        </span>
        {/* ══════ NEW: Hover glow for logout ══════ */}
        <motion.div
          className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{ boxShadow: 'inset 0 0 20px rgba(200,16,46,0.08)' }}
        />
      </motion.button>
    </div>
  );
}
