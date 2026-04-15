import { motion, AnimatePresence } from 'motion/react';
import { GlassCard } from '@/src/components/ui/GlassCard';
import { Zap, Target, Trophy, Flame, ArrowRight, Sun, Moon } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { useTheme } from '@/src/context/ThemeContext';

interface LandingPageProps {
  onStart: () => void;
}

export function LandingPage({ onStart }: LandingPageProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex flex-col items-center justify-center p-6 transition-colors duration-700">
      {/* Theme Toggle in Header */}
      <div className="absolute top-8 right-8 z-50">
        <button 
          onClick={toggleTheme}
          className="p-4 bg-white/[0.03] border border-white/[0.08] rounded-2xl text-white/40 hover:text-white transition-all backdrop-blur-md group"
        >
          {theme === 'dark' ? (
            <Sun className="w-5 h-5 group-hover:rotate-90 transition-transform duration-500" />
          ) : (
            <Moon className="w-5 h-5 group-hover:-rotate-12 transition-transform duration-500 text-slate-900" />
          )}
        </button>
      </div>

      {/* Immersive Cinematic Forest Background */}
      <motion.div 
        animate={{ 
          scale: [1, 1.1, 1],
        }}
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 z-0"
      >
        <img 
          src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=2560&auto=format&fit=crop" 
          className={cn(
            "w-full h-full object-cover filter contrast-[1.1] saturate-[1.2] transition-all duration-700",
            theme === 'dark' ? "brightness-[0.3]" : "brightness-[0.8]"
          )}
          alt="Forest Canopy"
        />
      </motion.div>
      
      {/* Dynamic Overlays */}
      <div className={cn(
        "absolute inset-0 z-[1] transition-all duration-700",
        theme === 'dark' ? "bg-gradient-to-b from-black/60 via-transparent to-black" : "bg-gradient-to-b from-white/40 via-transparent to-white/80"
      )} />
      <div className="absolute inset-0 bg-mesh opacity-40 mix-blend-overlay z-[2]" />
      
      {/* Floating Light Rays (Simulation) */}
      <motion.div 
        animate={{ 
          opacity: [0.3, 0.6, 0.3],
          x: [-20, 20, -20],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-white/[0.02] to-transparent z-[3] pointer-events-none" 
      />

      <div className="relative z-10 max-w-6xl w-full text-center space-y-16">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="space-y-8"
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/[0.03] border border-white/[0.08] text-primary-light text-xs font-bold uppercase tracking-[0.2em] backdrop-blur-md"
          >
            <Zap className="w-3.5 h-3.5 fill-current" />
            <span>The New Standard in Discipline</span>
          </motion.div>
          
          <h1 className="text-7xl md:text-[10rem] font-black tracking-tighter leading-[0.85] text-foreground transition-colors duration-700">
            <span className="block text-gradient">UNLEASH</span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-accent animate-pulse">
              YOUR AURA
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-foreground/40 max-w-3xl mx-auto font-medium leading-relaxed transition-colors duration-700">
            The world's most addictive habit tracker. <br className="hidden md:block" />
            Gamified routines. Real-time feedback. Legendary results.
          </p>
        </motion.div>
... (rest of the file) ...

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="flex flex-col md:flex-row items-center justify-center gap-6"
        >
          <button 
            onClick={onStart}
            className="group relative px-12 py-5 bg-white text-black font-black text-lg rounded-2xl overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-[0_0_50px_-12px_rgba(255,255,255,0.5)]"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary via-secondary to-accent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <span className="relative z-10 flex items-center gap-3 group-hover:text-white transition-colors duration-300">
              START YOUR JOURNEY <ArrowRight className="w-6 h-6" />
            </span>
          </button>
          
          <button 
            onClick={onStart}
            className="px-12 py-5 bg-white/[0.03] text-white font-black text-lg rounded-2xl border border-white/[0.08] hover:bg-white/[0.08] transition-all backdrop-blur-md"
          >
            EXPLORE MISSIONS
          </button>
        </motion.div>

        {/* Feature Bento Grid Preview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-20">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.2 }}
            className="md:col-span-2"
          >
            <GlassCard className="h-full border-white/[0.05] p-8 text-left group" hover={true}>
              <div className="flex items-start justify-between mb-8">
                <div className="p-4 bg-primary/10 rounded-2xl">
                  <Flame className="w-8 h-8 text-primary" />
                </div>
                <div className="text-4xl font-black text-white/10 group-hover:text-primary/20 transition-colors">01</div>
              </div>
              <h3 className="text-2xl font-black text-white mb-2">STREAK MASTERY</h3>
              <p className="text-white/40 font-medium max-w-md">
                Our proprietary algorithm tracks your consistency and rewards you with legendary multipliers as you build momentum.
              </p>
            </GlassCard>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.4 }}
          >
            <GlassCard className="h-full border-white/[0.05] p-8 text-left group" hover={true}>
              <div className="flex items-start justify-between mb-8">
                <div className="p-4 bg-accent/10 rounded-2xl">
                  <Trophy className="w-8 h-8 text-accent" />
                </div>
                <div className="text-4xl font-black text-white/10 group-hover:text-accent/20 transition-colors">02</div>
              </div>
              <h3 className="text-2xl font-black text-white mb-2">REWARDS</h3>
              <p className="text-white/40 font-medium">
                Unlock exclusive digital assets and badges as you level up.
              </p>
            </GlassCard>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
