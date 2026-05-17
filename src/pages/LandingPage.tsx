import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useInView } from 'motion/react';
import { GlassCard } from '@/src/components/ui/GlassCard';
import { Zap, Target, Trophy, Flame, ArrowRight, Sun, Moon, Shield, Sparkles, Swords, Mail, Lock, User, ChevronDown } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { useTheme } from '@/src/context/ThemeContext';

const PARTICLES = Array.from({ length: 10 }, (_, i) => ({
  x: Math.random() * 100, y: Math.random() * 100,
  size: 1 + Math.random() * 3, dur: 5 + Math.random() * 10, delay: Math.random() * 5,
  color: ['#d4af37', '#c8102e', '#7c3aed', '#e8d5b0'][i % 4],
}));

interface LandingPageProps { onLogin: () => void; }

const ScrollReveal: React.FC<{ children: React.ReactNode; className?: string; delay?: number }> = ({ children, className = '', delay = 0 }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.div ref={ref} className={className}
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </motion.div>
  );
}

export function LandingPage({ onLogin }: LandingPageProps) {
  const { theme, toggleTheme } = useTheme();
  const [activeWord, setActiveWord] = useState(0);
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '']);
  const [step, setStep] = useState<'auth' | 'otp'>('auth');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const words = ['DISCIPLINE', 'STRENGTH', 'MASTERY', 'LEGEND'];
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);

  useEffect(() => {
    const iv = setInterval(() => setActiveWord(p => (p + 1) % words.length), 2500);
    return () => clearInterval(iv);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const stored = localStorage.getItem('aura_registered_users');
    const users: string[] = stored ? JSON.parse(stored) : [];
    if (isLogin) {
      if (!users.includes(email)) { setIsSubmitting(false); alert("You need to sign up first!"); setIsLogin(false); return; }
    } else {
      if (users.includes(email)) { setIsSubmitting(false); alert("Account exists. Please sign in."); setIsLogin(true); return; }
      users.push(email); localStorage.setItem('aura_registered_users', JSON.stringify(users));
    }
    setTimeout(() => { setIsSubmitting(false); setStep('otp'); alert(`Verification code sent to ${email}`); }, 800);
  };

  const handleOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.join('') === '1234') { setIsSubmitting(true); setTimeout(onLogin, 600); }
    else alert("Invalid code. Use 1234 for testing.");
  };

  return (
    <div ref={containerRef} className="relative bg-background transition-colors duration-700">
      {/* BG Image */}
      <motion.div className="fixed inset-0 z-0">
        <motion.div animate={{ scale: [1, 1.08, 1] }} transition={{ duration: 30, repeat: Infinity, ease: "linear" }} className="w-full h-full" style={{ willChange: 'transform' }}>
          <img src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=1920&auto=format&fit=crop"
            className={cn("w-full h-full object-cover", theme === 'dark' ? "brightness-[0.25]" : "brightness-[0.85]")} alt="bg" fetchPriority="high" />
        </motion.div>
      </motion.div>
      <div className={cn("fixed inset-0 z-[1]", theme === 'dark' ? "bg-gradient-to-b from-black/50 via-transparent to-black" : "bg-gradient-to-b from-white/20 via-transparent to-white/70")} />

      {/* Particles */}
      <div className="fixed inset-0 z-[2] pointer-events-none overflow-hidden">
        {PARTICLES.map((p, i) => (
          <motion.div key={i} className="absolute rounded-full"
            style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size, backgroundColor: p.color, boxShadow: `0 0 ${p.size * 2}px ${p.color}`, willChange: 'transform, opacity' }}
            animate={{ y: [0, -100, 0], x: [0, Math.sin(i) * 40, 0], opacity: [0, 0.5, 0], scale: [0.8, 1.5, 0.8] }}
            transition={{ duration: p.dur, repeat: Infinity, delay: p.delay, ease: 'linear' }} />
        ))}
      </div>

      {/* Theme Toggle */}
      <div className="fixed top-8 right-8 z-50">
        <motion.button onClick={toggleTheme} whileHover={{ scale: 1.1, rotate: 5 }} whileTap={{ scale: 0.9 }}
          className="p-4 bg-white/[0.03] border border-white/[0.08] rounded-2xl text-foreground/40 hover:text-foreground transition-all backdrop-blur-md energy-ring">
          {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </motion.button>
      </div>

      {/* ═══ SECTION 1: HERO ═══ */}
      <motion.section className="relative z-10 min-h-screen flex flex-col items-center justify-center p-6 text-center perspective-[1000px]" style={{ opacity: heroOpacity }}>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30 animate-parallax-slow pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/20 blur-[120px] rounded-full pointer-events-none" />
        
        <motion.div initial={{ opacity: 0, y: 80, rotateX: 20 }} animate={{ opacity: 1, y: 0, rotateX: 0 }} transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }} className="space-y-10 relative z-10">
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.8, duration: 1 }}
            className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full bg-black/40 border border-primary/30 text-primary-light text-xs font-black uppercase tracking-[0.3em] backdrop-blur-xl shadow-[0_0_30px_rgba(139,92,246,0.3)]">
            <motion.div animate={{ rotate: 360, scale: [1, 1.4, 1] }} transition={{ rotate: { duration: 4, repeat: Infinity, ease: 'linear' }, scale: { duration: 2, repeat: Infinity } }}>
              <Zap className="w-4 h-4 text-[#d4af37] drop-shadow-[0_0_8px_rgba(212,175,55,0.8)]" />
            </motion.div>
            <span className="text-liquid-gold">The Zenith of Discipline</span>
            <motion.div animate={{ rotate: -360, scale: [1, 1.4, 1] }} transition={{ rotate: { duration: 4, repeat: Infinity, ease: 'linear' }, scale: { duration: 2, repeat: Infinity } }}>
              <Zap className="w-4 h-4 text-[#d4af37] drop-shadow-[0_0_8px_rgba(212,175,55,0.8)]" />
            </motion.div>
          </motion.div>

          <h1 className="text-7xl md:text-[12rem] font-black tracking-tighter leading-[0.85] text-foreground relative">
            <motion.span className={cn("block text-liquid-gold", theme === 'dark' ? "drop-shadow-[0_10px_40px_rgba(212,175,55,0.4)]" : "drop-shadow-[0_4px_15px_rgba(255,255,255,0.9)]")} initial={{ opacity: 0, y: 100, rotateX: 40 }} animate={{ opacity: 1, y: 0, rotateX: 0 }} transition={{ delay: 0.4, duration: 1.2, ease: [0.22, 1, 0.36, 1] }} style={{ fontFamily: 'Cinzel, serif' }}>
              UNLEASH
            </motion.span>
            <motion.span className={cn("block text-aura-gradient", theme === 'dark' ? "drop-shadow-[0_10px_40px_rgba(139,92,246,0.5)]" : "drop-shadow-[0_4px_15px_rgba(255,255,255,0.9)]")}
              initial={{ opacity: 0, y: 100, rotateX: -40 }} animate={{ opacity: 1, y: 0, rotateX: 0 }} transition={{ delay: 0.7, duration: 1.2, ease: [0.22, 1, 0.36, 1] }} style={{ fontFamily: 'Inter, sans-serif' }}>
              YOUR AURA
            </motion.span>
          </h1>

          <div className="h-12 overflow-hidden relative">
            <AnimatePresence mode="wait">
              <motion.div key={activeWord} initial={{ y: 50, opacity: 0, filter: 'blur(10px)', scale: 1.2 }} animate={{ y: 0, opacity: 1, filter: 'blur(0px)', scale: 1 }} exit={{ y: -50, opacity: 0, filter: 'blur(10px)', scale: 0.8 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className={cn("text-2xl md:text-3xl font-black uppercase tracking-[0.6em] text-aura-gradient", theme === 'dark' ? "drop-shadow-[0_0_15px_rgba(139,92,246,0.8)]" : "drop-shadow-[0_4px_15px_rgba(255,255,255,0.9)]")}>
                {words[activeWord]}
              </motion.div>
            </AnimatePresence>
          </div>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2, duration: 1 }}
            className="text-xl md:text-2xl text-foreground/50 max-w-4xl mx-auto font-medium leading-relaxed drop-shadow-md">
            The world's most immersive habit tracker. <br className="hidden md:block" />
            <span className="text-foreground/80">Gamified routines. Real-time feedback. Legendary results.</span>
          </motion.p>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 z-20" animate={{ y: [0, 15, 0], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}>
          <div className="w-px h-16 bg-gradient-to-b from-transparent via-secondary to-transparent" />
          <span className="text-[10px] font-black text-secondary uppercase tracking-[0.4em] drop-shadow-[0_0_10px_rgba(6,182,212,0.8)]">Descend</span>
          <ChevronDown className="w-8 h-8 text-secondary drop-shadow-[0_0_15px_rgba(6,182,212,0.8)]" />
        </motion.div>
      </motion.section>

      {/* ═══ SECTION 2: FEATURES ═══ */}
      <section className="relative z-10 py-32 px-6">
        <div className="max-w-6xl mx-auto space-y-16">
          <ScrollReveal className="text-center">
            <h2 className="text-4xl md:text-6xl font-black text-foreground neon-gold tracking-tight">WHY WARRIORS CHOOSE AURA</h2>
            <div className="mt-4 h-[2px] w-40 mx-auto bg-gradient-to-r from-transparent via-secondary to-transparent animate-line-reveal" />
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Flame, title: 'STREAK MASTERY', desc: 'Proprietary algorithm tracks consistency and rewards you with legendary multipliers.', color: 'primary', num: '01' },
              { icon: Trophy, title: 'EPIC REWARDS', desc: 'Unlock exclusive digital assets and badges as you level up your discipline.', color: 'accent', num: '02' },
              { icon: Target, title: 'PRECISION GOALS', desc: 'Set surgical targets and watch as your habits compound into unstoppable momentum.', color: 'secondary', num: '03' },
            ].map((f, i) => (
              <ScrollReveal key={f.title} delay={i * 0.15}>
                <GlassCard className="h-full p-8 text-left group hover-lift relative overflow-hidden" hover={true} glow="gold">
                  {/* Magical Parchment Overlay */}
                  <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/aged-paper.png')] opacity-[0.03] mix-blend-overlay pointer-events-none" />
                  <div className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br from-primary/20 to-transparent rounded-full blur-[40px] group-hover:scale-150 transition-transform duration-700" />
                  <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-700" />
                  
                  <div className="flex items-start justify-between mb-6 relative z-10">
                    <motion.div 
                      className={`p-4 bg-${f.color}/10 rounded-2xl border border-${f.color}/20 shadow-[0_0_20px_rgba(var(--${f.color}),0.2)]`} 
                      animate={{ rotate: [0, 5, -5, 0], scale: [1, 1.05, 1] }} 
                      transition={{ duration: 4, repeat: Infinity, delay: i * 0.5 }}
                    >
                      <f.icon className={`w-8 h-8 text-${f.color} drop-shadow-[0_0_8px_currentColor]`} />
                    </motion.div>
                    <div className="text-5xl font-black text-white/5 group-hover:text-primary/20 transition-colors" style={{ fontFamily: 'Cinzel, serif' }}>{f.num}</div>
                  </div>
                  <h3 className="text-xl font-black text-foreground mb-3 text-liquid-gold" style={{ fontFamily: 'Cinzel, serif' }}>{f.title}</h3>
                  <p className="text-foreground/50 font-medium leading-relaxed relative z-10">{f.desc}</p>
                  
                  <div className="mt-8 h-1.5 rounded-full bg-white/5 overflow-hidden relative border border-white/5">
                    <motion.div className="h-full bg-gradient-to-r from-primary via-secondary to-primary rounded-full relative"
                      initial={{ width: '0%' }} whileInView={{ width: `${60 + i * 15}%` }} transition={{ delay: 0.5, duration: 1.5, ease: 'easeOut' }}
                      viewport={{ once: true }}>
                      <div className="absolute inset-0 bg-white/30 animate-pulse" />
                    </motion.div>
                  </div>
                </GlassCard>
              </ScrollReveal>
            ))}
          </div>

          {/* Stats */}
          <div className="flex justify-center gap-12 md:gap-20 pt-8">
            {[
              { value: '10K+', label: 'Active Warriors', icon: Shield },
              { value: '1M+', label: 'Quests Completed', icon: Swords },
              { value: '99%', label: 'Satisfaction', icon: Sparkles },
            ].map((s, i) => (
              <ScrollReveal key={s.label} delay={i * 0.1}>
                <motion.div whileHover={{ y: -5, scale: 1.1 }} className="text-center cursor-default group">
                  <s.icon className="w-5 h-5 mx-auto text-secondary/50 group-hover:text-secondary transition-colors mb-2" />
                  <div className="text-2xl md:text-3xl font-black text-foreground neon-gold">{s.value}</div>
                  <div className="text-[8px] font-bold text-foreground/20 uppercase tracking-[0.3em]">{s.label}</div>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ SECTION 3: AUTH PORTAL ═══ */}
      <section className="relative z-10 min-h-screen flex flex-col items-center justify-center py-32 px-6">
        {/* Arcane circles */}
        <div className="absolute pointer-events-none" style={{ width: 500, height: 500 }}>
          <motion.div className="absolute inset-0 rounded-full border border-[rgba(212,175,55,0.06)]" animate={{ rotate: 360 }} transition={{ duration: 30, repeat: Infinity, ease: 'linear' }} style={{ borderStyle: 'dashed' }} />
          <motion.div className="absolute inset-[30px] rounded-full border border-[rgba(200,16,46,0.05)]" animate={{ rotate: -360 }} transition={{ duration: 25, repeat: Infinity, ease: 'linear' }} style={{ borderStyle: 'dotted' }} />
          <motion.div className="absolute inset-[60px] rounded-full border border-[rgba(124,58,237,0.04)]" animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: 'linear' }} />
        </div>

        <ScrollReveal className="w-full max-w-md">
          <motion.div className="text-center mb-10" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 1 }} viewport={{ once: true }}>
            <motion.div 
              className="inline-flex items-center justify-center p-3 rounded-full mb-4 bg-primary/10 border border-primary/20"
              animate={{ y: [0, -10, 0] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            >
              <Lock className="w-8 h-8 text-primary drop-shadow-[0_0_15px_rgba(200,16,46,0.8)]" />
            </motion.div>
            <h2 className="text-4xl md:text-5xl font-black text-liquid-gold tracking-tighter" style={{ fontFamily: 'Cinzel, serif', textShadow: '0 0 20px rgba(212,175,55,0.4)' }}>THE GRIMOIRE</h2>
            <p className="mt-3 text-[10px] font-bold text-foreground/40 uppercase tracking-[0.4em]">Unlock your destiny</p>
            <div className="mt-4 h-[2px] w-32 mx-auto bg-gradient-to-r from-transparent via-secondary to-transparent" />
          </motion.div>

          <GlassCard className="p-10 md:p-12 space-y-10 shadow-2xl animate-portal-pulse" hover={false} glow="gold">
            {/* Ornate corner accents */}
            <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-secondary/60 rounded-tl-xl pointer-events-none" />
            <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-secondary/60 rounded-tr-xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-secondary/60 rounded-bl-xl pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-secondary/60 rounded-br-xl pointer-events-none" />

            <motion.div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-secondary to-transparent" animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 3, repeat: Infinity }} />

            <AnimatePresence mode="wait">
              {step === 'auth' ? (
                <motion.div key="auth" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.05 }} className="space-y-8">
                  <div className="text-center space-y-4">
                    <motion.div className="mx-auto w-16 h-16 relative flex items-center justify-center mb-6"
                      animate={{ y: [0, -5, 0] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}>
                      <motion.div className="absolute inset-0 border border-secondary/30 rotate-45 rounded-lg" animate={{ rotate: [45, 225] }} transition={{ duration: 15, repeat: Infinity, ease: "linear" }} />
                      <motion.div className="absolute inset-2 border border-primary/30 rotate-12 rounded-lg" animate={{ rotate: [12, -168] }} transition={{ duration: 10, repeat: Infinity, ease: "linear" }} />
                      <div className="absolute inset-0 bg-gradient-to-br from-secondary/20 to-primary/20 blur-md rounded-full" />
                      <Shield className="w-6 h-6 text-secondary relative z-10 drop-shadow-[0_0_10px_rgba(212,175,55,0.8)]" />
                    </motion.div>
                    <h3 className="text-2xl font-black tracking-widest text-foreground uppercase" style={{ fontFamily: 'Cinzel, serif' }}>{isLogin ? 'Enter The Realm' : 'Forge Your Soul'}</h3>
                    <p className="text-foreground/40 text-[10px] uppercase tracking-[0.3em]">{isLogin ? 'Synchronize your energy' : 'Initialize your frequency'}</p>
                  </div>

                  <form className="space-y-6" onSubmit={handleSubmit}>
                    {!isLogin && (
                      <motion.div className="relative group" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                        <User className={cn("absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-all z-10", focusedField === 'name' ? 'text-secondary drop-shadow-[0_0_8px_rgba(212,175,55,0.8)]' : 'text-foreground/20')} />
                        <input type="text" id="name" required={!isLogin} onFocus={() => setFocusedField('name')} onBlur={() => setFocusedField(null)}
                          className="peer w-full bg-black/40 border border-white/5 rounded-xl py-4 pl-12 pr-4 text-foreground placeholder-transparent focus:outline-none focus:bg-black/60 transition-all shadow-inner" placeholder="Full Name" />
                        <label htmlFor="name" className="absolute left-12 top-1/2 -translate-y-1/2 text-[10px] font-black uppercase tracking-[0.2em] text-foreground/30 transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:text-foreground/30 peer-placeholder-shown:top-1/2 peer-focus:top-3 peer-focus:text-[10px] peer-focus:text-secondary pointer-events-none">
                          Full Name
                        </label>
                        <div className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-transparent via-secondary to-transparent w-full scale-x-0 peer-focus:scale-x-100 transition-transform duration-500 origin-left" />
                      </motion.div>
                    )}
                    <motion.div className="relative group" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                      <Mail className={cn("absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-all z-10", focusedField === 'email' ? 'text-secondary drop-shadow-[0_0_8px_rgba(212,175,55,0.8)]' : 'text-foreground/20')} />
                      <input type="email" id="email" value={email} onChange={e => setEmail(e.target.value)} onFocus={() => setFocusedField('email')} onBlur={() => setFocusedField(null)} required
                        className="peer w-full bg-black/40 border border-white/5 rounded-xl py-4 pl-12 pr-4 text-foreground placeholder-transparent focus:outline-none focus:bg-black/60 transition-all shadow-inner" placeholder="Email Address" />
                      <label htmlFor="email" className="absolute left-12 top-1/2 -translate-y-1/2 text-[10px] font-black uppercase tracking-[0.2em] text-foreground/30 transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:text-foreground/30 peer-placeholder-shown:top-1/2 peer-focus:top-3 peer-focus:text-[10px] peer-focus:text-secondary pointer-events-none">
                        Email Address
                      </label>
                      <div className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-transparent via-secondary to-transparent w-full scale-x-0 peer-focus:scale-x-100 transition-transform duration-500 origin-left" />
                    </motion.div>
                    <motion.div className="relative group" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                      <Lock className={cn("absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-all z-10", focusedField === 'pw' ? 'text-secondary drop-shadow-[0_0_8px_rgba(212,175,55,0.8)]' : 'text-foreground/20')} />
                      <input type="password" id="password" required onFocus={() => setFocusedField('pw')} onBlur={() => setFocusedField(null)}
                        className="peer w-full bg-black/40 border border-white/5 rounded-xl py-4 pl-12 pr-4 text-foreground placeholder-transparent focus:outline-none focus:bg-black/60 transition-all shadow-inner" placeholder="Password" />
                      <label htmlFor="password" className="absolute left-12 top-1/2 -translate-y-1/2 text-[10px] font-black uppercase tracking-[0.2em] text-foreground/30 transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:text-foreground/30 peer-placeholder-shown:top-1/2 peer-focus:top-3 peer-focus:text-[10px] peer-focus:text-secondary pointer-events-none">
                        Password
                      </label>
                      <div className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-transparent via-secondary to-transparent w-full scale-x-0 peer-focus:scale-x-100 transition-transform duration-500 origin-left" />
                    </motion.div>
                    
                    <motion.button type="submit" disabled={isSubmitting} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                      className="dnd-button w-full py-4 mt-2 rounded-xl flex items-center justify-center gap-3 relative overflow-hidden ripple-button disabled:opacity-70 group">
                      <motion.div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent" animate={{ x: ['-200%', '200%'] }} transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }} />
                      <span className="relative z-10 flex items-center gap-3 font-black tracking-widest text-sm">
                        {isSubmitting ? <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}><Sparkles className="w-5 h-5" /></motion.div>
                          : <>{isLogin ? 'INVOKE' : 'AWAKEN'} <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" /></>}
                      </span>
                    </motion.button>
                  </form>
                  <div className="text-center">
                    <motion.button onClick={() => setIsLogin(!isLogin)} whileHover={{ scale: 1.05 }}
                      className="text-[10px] font-bold text-foreground/40 hover:text-secondary uppercase tracking-[0.2em] transition-colors animated-underline py-1">
                      {isLogin ? "New to Aura? Forge an Account" : "Return to the Void (Sign In)"}
                    </motion.button>
                  </div>
                </motion.div>
              ) : (
                <motion.div key="otp" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.05 }} className="space-y-8">
                  <div className="text-center space-y-4">
                    <motion.div className="mx-auto w-16 h-16 relative flex items-center justify-center mb-6"
                      animate={{ y: [0, -5, 0] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}>
                      <motion.div className="absolute inset-0 border border-primary/30 rotate-45 rounded-lg" animate={{ rotate: [-45, -225] }} transition={{ duration: 15, repeat: Infinity, ease: "linear" }} />
                      <motion.div className="absolute inset-2 border border-accent/30 rotate-12 rounded-lg" animate={{ rotate: [-12, 168] }} transition={{ duration: 10, repeat: Infinity, ease: "linear" }} />
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 blur-md rounded-full" />
                      <Lock className="w-6 h-6 text-primary relative z-10 drop-shadow-[0_0_10px_rgba(200,16,46,0.8)]" />
                    </motion.div>
                    <h3 className="text-2xl font-black tracking-widest text-foreground uppercase" style={{ fontFamily: 'Cinzel, serif' }}>Verify Seal</h3>
                    <p className="text-foreground/40 text-[10px] uppercase tracking-[0.2em] leading-relaxed">Scroll sent to <br/><span className="text-secondary font-bold tracking-widest">{email}</span></p>
                  </div>
                  <form className="space-y-8" onSubmit={handleOtp}>
                    <div className="flex justify-center gap-3 sm:gap-4">
                      {otp.map((d, idx) => (
                        <motion.div key={idx} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + idx * 0.1, type: 'spring' }}>
                          <input id={`otp-${idx}`} type="text" maxLength={1} value={d}
                            onChange={e => { const v = e.target.value; if (/^\d?$/.test(v)) { const n = [...otp]; n[idx] = v; setOtp(n); if (v && idx < 3) document.getElementById(`otp-${idx+1}`)?.focus(); } }}
                            className={cn("w-14 h-16 sm:w-16 sm:h-20 bg-black/40 border-b-2 rounded-t-xl text-3xl font-black text-center text-foreground focus:outline-none transition-all shadow-inner",
                              d ? "border-secondary text-secondary drop-shadow-[0_0_10px_rgba(212,175,55,0.5)] bg-secondary/5" : "border-white/10", "focus:border-primary focus:bg-primary/5 focus:drop-shadow-[0_0_15px_rgba(200,16,46,0.5)]")} />
                        </motion.div>
                      ))}
                    </div>
                    <motion.button type="submit" disabled={isSubmitting} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                      className="dnd-button w-full py-4 rounded-xl flex items-center justify-center gap-3 relative overflow-hidden ripple-button disabled:opacity-70 group">
                      <motion.div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent" animate={{ x: ['-200%', '200%'] }} transition={{ duration: 2.5, repeat: Infinity }} />
                      <span className="relative z-10 flex items-center gap-3 font-black tracking-widest text-sm">
                        {isSubmitting ? <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}><Sparkles className="w-5 h-5" /></motion.div>
                          : <>BREAK SEAL <Zap className="w-5 h-5 fill-current group-hover:scale-110 transition-transform" /></>}
                      </span>
                    </motion.button>
                    <div className="text-center">
                      <button type="button" onClick={() => setStep('auth')} className="text-[10px] font-bold text-foreground/40 hover:text-primary uppercase tracking-[0.2em] transition-colors animated-underline py-1">Rewrite Scroll (Change Email)</button>
                    </div>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </GlassCard>
        </ScrollReveal>
      </section>

      {/* Scrolling Tips Footer */}
      <div className="relative z-20 py-4 bg-black/40 backdrop-blur-md border-t border-white/10 overflow-hidden flex whitespace-nowrap">
        <motion.div animate={{ x: [0, -2000] }} transition={{ duration: 30, repeat: Infinity, ease: "linear" }} className="flex gap-16 items-center pl-16">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex gap-16 items-center">
              {["Build your streak to unlock legendary multipliers!", "Hydrate early morning to boost daily momentum.", "Use analytics to find your peak hours.", "Gamify your life and conquer goals!"].map((tip, j) => (
                <span key={j} className="text-white/70 text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-3">
                  <Zap className="w-4 h-4 text-primary fill-primary/20" /> {tip}
                </span>
              ))}
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
