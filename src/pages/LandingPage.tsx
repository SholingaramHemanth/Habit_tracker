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
            className={cn("w-full h-full object-cover", theme === 'dark' ? "brightness-[0.25]" : "brightness-[0.75]")} alt="bg" fetchPriority="high" />
        </motion.div>
      </motion.div>
      <div className={cn("fixed inset-0 z-[1]", theme === 'dark' ? "bg-gradient-to-b from-black/50 via-transparent to-black" : "bg-gradient-to-b from-white/40 via-transparent to-white/80")} />

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
      <motion.section className="relative z-10 min-h-screen flex flex-col items-center justify-center p-6 text-center" style={{ opacity: heroOpacity }}>
        <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }} className="space-y-8">
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5 }}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/[0.03] border border-white/[0.08] text-primary-light text-xs font-bold uppercase tracking-[0.2em] backdrop-blur-md breathing-border">
            <motion.div animate={{ rotate: 360, scale: [1, 1.3, 1] }} transition={{ rotate: { duration: 3, repeat: Infinity, ease: 'linear' }, scale: { duration: 1.5, repeat: Infinity } }}>
              <Zap className="w-3.5 h-3.5 fill-current" />
            </motion.div>
            <span>The New Standard in Discipline</span>
          </motion.div>

          <h1 className="text-7xl md:text-[10rem] font-black tracking-tighter leading-[0.85] text-foreground">
            <motion.span className="block text-gradient neon-gold" initial={{ opacity: 0, y: 80, rotateX: 40 }} animate={{ opacity: 1, y: 0, rotateX: 0 }} transition={{ delay: 0.3, duration: 1, ease: [0.22, 1, 0.36, 1] }}>
              UNLEASH
            </motion.span>
            <motion.span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-accent"
              initial={{ opacity: 0, y: 80, rotateX: 40 }} animate={{ opacity: 1, y: 0, rotateX: 0 }} transition={{ delay: 0.6, duration: 1, ease: [0.22, 1, 0.36, 1] }}>
              YOUR AURA
            </motion.span>
          </h1>

          <div className="h-10 overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div key={activeWord} initial={{ y: 40, opacity: 0, filter: 'blur(8px)' }} animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }} exit={{ y: -40, opacity: 0, filter: 'blur(8px)' }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="text-xl md:text-2xl font-black uppercase tracking-[0.5em] text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-accent">
                {words[activeWord]}
              </motion.div>
            </AnimatePresence>
          </div>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}
            className="text-xl md:text-2xl text-foreground/40 max-w-3xl mx-auto font-medium leading-relaxed">
            The world's most addictive habit tracker. <br className="hidden md:block" />
            Gamified routines. Real-time feedback. Legendary results.
          </motion.p>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div className="absolute bottom-12 left-1/2 flex flex-col items-center gap-3" animate={{ y: [0, 12, 0], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}>
          <span className="text-[10px] font-bold text-foreground/30 uppercase tracking-[0.3em]">Scroll to Enter</span>
          <ChevronDown className="w-6 h-6 text-secondary/60" />
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
                <GlassCard className="h-full p-8 text-left group hover-lift" hover={true}>
                  <div className="flex items-start justify-between mb-6">
                    <motion.div className={`p-4 bg-${f.color}/10 rounded-2xl`} animate={{ rotate: [0, 5, -5, 0] }} transition={{ duration: 4, repeat: Infinity, delay: i * 0.5 }}>
                      <f.icon className={`w-8 h-8 text-${f.color}`} />
                    </motion.div>
                    <div className="text-4xl font-black text-white/10 group-hover:text-white/20 transition-colors">{f.num}</div>
                  </div>
                  <h3 className="text-xl font-black text-foreground mb-2 animated-underline">{f.title}</h3>
                  <p className="text-foreground/40 font-medium">{f.desc}</p>
                  <div className="mt-6 h-1 rounded-full bg-white/5 overflow-hidden">
                    <motion.div className="h-full bg-gradient-to-r from-primary via-secondary to-primary rounded-full"
                      initial={{ width: '0%' }} whileInView={{ width: `${60 + i * 15}%` }} transition={{ delay: 0.5, duration: 1.5, ease: 'easeOut' }}
                      viewport={{ once: true }} />
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
            <h2 className="text-4xl md:text-5xl font-black text-foreground neon-gold tracking-tight">ENTER THE VOID</h2>
            <div className="mt-3 h-[2px] w-32 mx-auto bg-gradient-to-r from-transparent via-secondary to-transparent" />
          </motion.div>

          <GlassCard className="p-10 space-y-10 border-card-border shadow-2xl animate-portal-pulse" hover={false}>
            <motion.div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-secondary to-transparent" animate={{ opacity: [0.3, 0.8, 0.3] }} transition={{ duration: 3, repeat: Infinity }} />

            <AnimatePresence mode="wait">
              {step === 'auth' ? (
                <motion.div key="auth" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-8">
                  <div className="text-center space-y-3">
                    <motion.div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4"
                      style={{ background: 'linear-gradient(135deg, rgba(200,16,46,0.15), rgba(212,175,55,0.1))', border: '1px solid rgba(212,175,55,0.2)' }}
                      animate={{ rotate: [0, 5, -5, 0], scale: [1, 1.05, 1] }} transition={{ duration: 4, repeat: Infinity }}>
                      <Shield className="w-7 h-7 text-secondary" />
                    </motion.div>
                    <h3 className="text-3xl font-black tracking-tighter text-foreground uppercase italic">{isLogin ? 'Sign In' : 'Join Aura'}</h3>
                    <p className="text-foreground/40 text-xs uppercase tracking-widest">{isLogin ? 'Synchronize your energy' : 'Initialize your soul frequency'}</p>
                  </div>

                  <form className="space-y-5" onSubmit={handleSubmit}>
                    {!isLogin && (
                      <motion.div className="space-y-2" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                        <label className="text-[10px] font-black text-foreground/30 uppercase tracking-[0.2em] ml-1">Full Name</label>
                        <div className="relative">
                          <User className={cn("absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors", focusedField === 'name' ? 'text-secondary' : 'text-foreground/20')} />
                          <input type="text" placeholder="Alex Hunter" onFocus={() => setFocusedField('name')} onBlur={() => setFocusedField(null)}
                            className="w-full bg-white/[0.03] border border-card-border rounded-2xl py-4 pl-12 pr-4 text-foreground placeholder:text-foreground/10 focus:outline-none focus:border-secondary/50 focus:shadow-[0_0_20px_rgba(212,175,55,0.1)] transition-all" />
                        </div>
                      </motion.div>
                    )}
                    <motion.div className="space-y-2" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
                      <label className="text-[10px] font-black text-foreground/30 uppercase tracking-[0.2em] ml-1">Email</label>
                      <div className="relative">
                        <Mail className={cn("absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors", focusedField === 'email' ? 'text-secondary' : 'text-foreground/20')} />
                        <input type="email" value={email} onChange={e => setEmail(e.target.value)} onFocus={() => setFocusedField('email')} onBlur={() => setFocusedField(null)}
                          placeholder="alex@aura.io" required
                          className="w-full bg-white/[0.03] border border-card-border rounded-2xl py-4 pl-12 pr-4 text-foreground placeholder:text-foreground/10 focus:outline-none focus:border-secondary/50 focus:shadow-[0_0_20px_rgba(212,175,55,0.1)] transition-all" />
                      </div>
                    </motion.div>
                    <motion.div className="space-y-2" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
                      <label className="text-[10px] font-black text-foreground/30 uppercase tracking-[0.2em] ml-1">Password</label>
                      <div className="relative">
                        <Lock className={cn("absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors", focusedField === 'pw' ? 'text-secondary' : 'text-foreground/20')} />
                        <input type="password" placeholder="••••••••" required onFocus={() => setFocusedField('pw')} onBlur={() => setFocusedField(null)}
                          className="w-full bg-white/[0.03] border border-card-border rounded-2xl py-4 pl-12 pr-4 text-foreground placeholder:text-foreground/10 focus:outline-none focus:border-secondary/50 focus:shadow-[0_0_20px_rgba(212,175,55,0.1)] transition-all" />
                      </div>
                    </motion.div>
                    <motion.button type="submit" disabled={isSubmitting} whileHover={{ scale: 1.02, boxShadow: '0 0 40px rgba(212,175,55,0.2)' }} whileTap={{ scale: 0.98 }}
                      className="w-full py-5 bg-foreground text-background font-black rounded-2xl flex items-center justify-center gap-3 relative overflow-hidden ripple-button disabled:opacity-70">
                      <motion.div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent" animate={{ x: ['-200%', '200%'] }} transition={{ duration: 3, repeat: Infinity, ease: 'linear' }} />
                      <span className="relative z-10 flex items-center gap-3">
                        {isSubmitting ? <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}><Sparkles className="w-5 h-5" /></motion.div>
                          : <>{isLogin ? 'SEND OTP' : 'CREATE ACCOUNT'} <ArrowRight className="w-5 h-5" /></>}
                      </span>
                    </motion.button>
                  </form>
                  <motion.button onClick={() => setIsLogin(!isLogin)} whileHover={{ scale: 1.02 }}
                    className="w-full text-xs font-bold text-foreground/20 hover:text-foreground uppercase tracking-widest transition-all animated-underline">
                    {isLogin ? "New to Aura? Create Account" : "Back to Sign In"}
                  </motion.button>
                </motion.div>
              ) : (
                <motion.div key="otp" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                  <div className="text-center space-y-3">
                    <motion.div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4"
                      style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.15), rgba(200,16,46,0.1))', border: '1px solid rgba(124,58,237,0.2)' }}
                      animate={{ scale: [1, 1.1, 1], rotate: [0, 3, -3, 0] }} transition={{ duration: 3, repeat: Infinity }}>
                      <Lock className="w-7 h-7 text-accent" />
                    </motion.div>
                    <h3 className="text-3xl font-black tracking-tighter text-foreground uppercase italic">Verify Aura</h3>
                    <p className="text-foreground/40 text-xs uppercase leading-relaxed">Code sent to <span className="text-primary font-bold">{email}</span></p>
                  </div>
                  <form className="space-y-8" onSubmit={handleOtp}>
                    <div className="flex justify-between gap-4">
                      {otp.map((d, idx) => (
                        <motion.div key={idx} initial={{ opacity: 0, y: 20, scale: 0.8 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ delay: 0.1 + idx * 0.1, type: 'spring', stiffness: 200 }}>
                          <input id={`otp-${idx}`} type="text" maxLength={1} value={d}
                            onChange={e => { const v = e.target.value; if (/^\d?$/.test(v)) { const n = [...otp]; n[idx] = v; setOtp(n); if (v && idx < 3) document.getElementById(`otp-${idx+1}`)?.focus(); } }}
                            className={cn("w-16 h-20 bg-white/[0.03] border rounded-2xl text-3xl font-black text-center text-foreground focus:outline-none transition-all",
                              d ? "border-secondary/50 shadow-[0_0_20px_rgba(212,175,55,0.15)]" : "border-card-border", "focus:border-primary focus:shadow-[0_0_25px_rgba(200,16,46,0.2)]")} />
                        </motion.div>
                      ))}
                    </div>
                    <motion.button type="submit" disabled={isSubmitting} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                      className="w-full py-5 bg-primary text-white font-black rounded-2xl flex items-center justify-center gap-3 relative overflow-hidden ripple-button disabled:opacity-70">
                      <motion.div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent" animate={{ x: ['-200%', '200%'] }} transition={{ duration: 2.5, repeat: Infinity }} />
                      <span className="relative z-10 flex items-center gap-3">
                        {isSubmitting ? <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}><Sparkles className="w-5 h-5" /></motion.div>
                          : <>VERIFY & ENTER <Zap className="w-5 h-5 fill-current" /></>}
                      </span>
                    </motion.button>
                    <button type="button" onClick={() => setStep('auth')} className="w-full text-xs font-bold text-foreground/20 hover:text-foreground uppercase tracking-widest transition-all">Change Email</button>
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
