import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GlassCard } from '@/src/components/ui/GlassCard';
import { Mail, Lock, User, ArrowRight, Zap, Sun, Moon, Shield, Sparkles, Flame, Eye, EyeOff } from 'lucide-react';
import { useTheme } from '@/src/context/ThemeContext';
import { cn } from '@/src/lib/utils';

// Sigil points for the pentagram-style background
const SIGIL_POINTS = 5;
const ENERGY_LINES = Array.from({ length: 12 }, (_, i) => ({
  angle: (i * 30) * Math.PI / 180,
  length: 180 + Math.random() * 120,
  delay: i * 0.3,
  width: 1 + Math.random(),
}));

const EMBER_PARTICLES = Array.from({ length: 20 }, (_, i) => ({
  x: Math.random() * 100,
  size: 2 + Math.random() * 4,
  duration: 6 + Math.random() * 8,
  delay: Math.random() * 5,
  color: ['#d4af37', '#c8102e', '#ff6b35', '#ffd700'][i % 4],
}));

interface AuthPageProps {
  onLogin: () => void;
}

export function AuthPage({ onLogin }: AuthPageProps) {
  const { theme, toggleTheme } = useTheme();
  const [isLogin, setIsLogin] = useState(true);
  const [step, setStep] = useState<'auth' | 'otp'>('auth');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '']);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleInitialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const storedUsersStr = localStorage.getItem('aura_registered_users');
    const registeredUsers: string[] = storedUsersStr ? JSON.parse(storedUsersStr) : [];
    if (isLogin) {
      if (!registeredUsers.includes(email)) {
        setIsSubmitting(false);
        alert("You are not signed in! You have to sign up to continue.");
        setIsLogin(false);
        return;
      }
    } else {
      if (registeredUsers.includes(email)) {
        setIsSubmitting(false);
        alert("An account with this email already exists. Please sign in.");
        setIsLogin(true);
        return;
      }
      registeredUsers.push(email);
      localStorage.setItem('aura_registered_users', JSON.stringify(registeredUsers));
    }
    setTimeout(() => {
      setIsSubmitting(false);
      setStep('otp');
      alert(`A verification code has been sent to ${email || 'your email'}`);
    }, 800);
  };

  const handleOtpVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.join('') === '1234') {
      setIsSubmitting(true);
      setTimeout(() => onLogin(), 600);
    } else {
      alert("Invalid code. Please use 1234 for testing.");
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6 relative overflow-hidden transition-colors duration-700">
      {/* Theme Toggle */}
      <div className="absolute top-8 right-8 z-50">
        <motion.button onClick={toggleTheme} whileHover={{ scale: 1.1, rotate: 5 }} whileTap={{ scale: 0.9 }}
          className="p-4 bg-white/[0.03] border border-card-border rounded-2xl text-foreground/40 hover:text-foreground transition-all backdrop-blur-md energy-ring">
          {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </motion.button>
      </div>

      {/* Background Image */}
      <motion.div animate={{ scale: [1, 1.05, 1], y: [0, -20, 0] }} transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }} className="absolute inset-0 z-0">
        <img src="https://images.unsplash.com/photo-1439405326854-014607f694d7?q=80&w=2560&auto=format&fit=crop"
          className={cn("w-full h-full object-cover transition-all duration-700", theme === 'dark' ? "brightness-[0.4] saturate-[1.3]" : "brightness-[0.85]")} alt="bg" />
      </motion.div>

      {/* Atmospheric Overlays */}
      <div className={cn("absolute inset-0 z-[1] transition-all duration-700",
        theme === 'dark' ? "bg-gradient-to-t from-black via-transparent to-black/40" : "bg-gradient-to-t from-white/20 via-transparent to-white/10")} />

      {/* Rising Ember Particles */}
      <div className="absolute inset-0 z-[2] pointer-events-none overflow-hidden">
        {EMBER_PARTICLES.map((p, i) => (
          <motion.div key={i} className="absolute rounded-full"
            style={{ left: `${p.x}%`, bottom: '-10px', width: p.size, height: p.size, backgroundColor: p.color,
              boxShadow: `0 0 ${p.size * 3}px ${p.color}` }}
            animate={{ y: [0, -window.innerHeight - 50], x: [0, Math.sin(i) * 60, 0], opacity: [0, 0.8, 0.6, 0], scale: [0.5, 1.2, 0.3] }}
            transition={{ duration: p.duration, repeat: Infinity, delay: p.delay, ease: 'easeOut' }} />
        ))}
      </div>

      {/* Rotating Energy Sigil */}
      <div className="absolute z-[3] pointer-events-none flex items-center justify-center" style={{ width: 600, height: 600 }}>
        <motion.div className="absolute w-full h-full" animate={{ rotate: 360 }} transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}>
          {ENERGY_LINES.map((line, i) => (
            <motion.div key={i} className="absolute left-1/2 top-1/2 origin-left"
              style={{ width: line.length, height: line.width, transform: `rotate(${i * 30}deg)`,
                background: `linear-gradient(90deg, rgba(212,175,55,0.15), transparent)` }}
              animate={{ opacity: [0.1, 0.4, 0.1] }}
              transition={{ duration: 3, repeat: Infinity, delay: line.delay }} />
          ))}
        </motion.div>

        {/* Inner rotating ring */}
        <motion.div className="absolute w-[300px] h-[300px] rounded-full border border-dashed border-primary/20"
          animate={{ rotate: -360 }} transition={{ duration: 25, repeat: Infinity, ease: 'linear' }} />

        {/* Pulsing core */}
        <motion.div className="absolute w-[200px] h-[200px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(200,16,46,0.15), transparent)' }}
          animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 4, repeat: Infinity }} />

        {/* Orbiting Sigil Points */}
        <motion.div className="absolute w-[350px] h-[350px]" animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}>
          {Array.from({ length: SIGIL_POINTS }).map((_, i) => {
            const angle = (i * 2 * Math.PI) / SIGIL_POINTS - Math.PI / 2;
            return (
              <motion.div key={i} className="absolute w-3 h-3 rounded-full"
                style={{ left: `${50 + 45 * Math.cos(angle)}%`, top: `${50 + 45 * Math.sin(angle)}%`,
                  backgroundColor: '#d4af37', boxShadow: '0 0 15px rgba(212,175,55,0.8)', transform: 'translate(-50%, -50%)' }}
                animate={{ scale: [1, 1.8, 1], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity, delay: i * 0.4 }} />
            );
          })}
        </motion.div>
      </div>

      {/* Main Card */}
      <motion.div
        initial={{ opacity: 0, y: 60, scale: 0.9, rotateX: 15 }}
        animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md relative z-10 perspective-[1200px]"
      >
        <GlassCard className="p-10 space-y-8 border-card-border shadow-[0_0_60px_rgba(212,175,55,0.1)] relative overflow-hidden" hover={false}>
          {/* Animated border glow */}
          <motion.div className="absolute top-0 left-0 right-0 h-[2px]"
            style={{ background: 'linear-gradient(90deg, transparent, #d4af37, #c8102e, #d4af37, transparent)', backgroundSize: '200% 100%' }}
            animate={{ backgroundPosition: ['0% 0%', '200% 0%'] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'linear' }} />
          <motion.div className="absolute bottom-0 left-0 right-0 h-[2px]"
            style={{ background: 'linear-gradient(90deg, transparent, #c8102e, #d4af37, #c8102e, transparent)', backgroundSize: '200% 100%' }}
            animate={{ backgroundPosition: ['200% 0%', '0% 0%'] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'linear' }} />

          {/* Corner ornaments */}
          {['-top-px -left-px', '-top-px -right-px', '-bottom-px -left-px', '-bottom-px -right-px'].map((pos, i) => (
            <motion.div key={i} className={`absolute ${pos} w-4 h-4 border-secondary/40 ${
              i === 0 ? 'border-t-2 border-l-2 rounded-tl-lg' : i === 1 ? 'border-t-2 border-r-2 rounded-tr-lg' :
              i === 2 ? 'border-b-2 border-l-2 rounded-bl-lg' : 'border-b-2 border-r-2 rounded-br-lg'}`}
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 3, repeat: Infinity, delay: i * 0.5 }} />
          ))}

          <AnimatePresence mode="wait">
            {step === 'auth' ? (
              <motion.div key="auth" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30, filter: 'blur(10px)' }} transition={{ duration: 0.5 }} className="space-y-8">

                {/* Icon with flame effect */}
                <div className="text-center space-y-4">
                  <motion.div className="inline-flex items-center justify-center w-20 h-20 rounded-full relative"
                    initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}>
                    <motion.div className="absolute inset-0 rounded-full"
                      style={{ background: 'conic-gradient(from 0deg, #c8102e, #d4af37, #7c3aed, #c8102e)' }}
                      animate={{ rotate: 360 }} transition={{ duration: 6, repeat: Infinity, ease: 'linear' }} />
                    <div className="absolute inset-[2px] rounded-full bg-background/90 flex items-center justify-center">
                      <motion.div animate={{ y: [-2, 2, -2], scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity }}>
                        <Flame className="w-8 h-8 text-primary drop-shadow-[0_0_12px_rgba(200,16,46,0.8)]" />
                      </motion.div>
                    </div>
                  </motion.div>

                  <motion.h2 className="text-4xl font-black tracking-tighter uppercase italic text-liquid-gold"
                    initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    transition={{ delay: 0.3, duration: 0.8 }} style={{ fontFamily: 'Cinzel, serif' }}>
                    {isLogin ? 'Enter The Realm' : 'Forge Your Soul'}
                  </motion.h2>

                  <motion.p className="text-foreground/40 font-medium text-xs uppercase tracking-[0.3em]"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
                    {isLogin ? 'The ancient gates await your return' : 'Begin your legendary journey'}
                  </motion.p>
                </div>

                <form className="space-y-5" onSubmit={handleInitialSubmit}>
                  <AnimatePresence>
                    {!isLogin && (
                      <motion.div initial={{ opacity: 0, height: 0, y: -10 }} animate={{ opacity: 1, height: 'auto', y: 0 }}
                        exit={{ opacity: 0, height: 0, y: -10 }} transition={{ duration: 0.4 }} className="space-y-2 group/input">
                        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground/50 ml-1 flex items-center gap-2 group-focus-within/input:text-secondary transition-colors">
                          <User className="w-3 h-3" /> Warrior Name
                        </label>
                        <div className="relative">
                          <motion.div className="absolute inset-0 rounded-xl opacity-0 group-focus-within/input:opacity-100 transition-opacity duration-500"
                            style={{ boxShadow: '0 0 20px rgba(212,175,55,0.2), inset 0 0 20px rgba(212,175,55,0.05)' }} />
                          <User className={cn("absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors duration-300 z-20",
                            focusedField === 'name' ? 'text-secondary' : 'text-foreground/20')} />
                          <input type="text" placeholder="e.g. Shadow Knight" value={name} onChange={(e) => setName(e.target.value)}
                            onFocus={() => setFocusedField('name')} onBlur={() => setFocusedField(null)} required
                            className="w-full bg-foreground/[0.03] border border-foreground/10 rounded-xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:border-secondary/50 transition-all font-medium placeholder:text-foreground/15 relative z-10 focus:bg-foreground/[0.06]" />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4, duration: 0.5 }}
                    className="space-y-2 group/input">
                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground/50 ml-1 flex items-center gap-2 group-focus-within/input:text-secondary transition-colors">
                      <Mail className="w-3 h-3" /> Soul Frequency
                    </label>
                    <div className="relative">
                      <motion.div className="absolute inset-0 rounded-xl opacity-0 group-focus-within/input:opacity-100 transition-opacity duration-500"
                        style={{ boxShadow: '0 0 20px rgba(212,175,55,0.2), inset 0 0 20px rgba(212,175,55,0.05)' }} />
                      <Mail className={cn("absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors duration-300 z-20",
                        focusedField === 'email' ? 'text-secondary' : 'text-foreground/20')} />
                      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@essence.com"
                        onFocus={() => setFocusedField('email')} onBlur={() => setFocusedField(null)} required
                        className="w-full bg-foreground/[0.03] border border-foreground/10 rounded-xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:border-secondary/50 transition-all font-medium placeholder:text-foreground/15 relative z-10 focus:bg-foreground/[0.06]" />
                    </div>
                  </motion.div>

                  <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5, duration: 0.5 }}
                    className="space-y-2 group/input">
                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground/50 ml-1 flex items-center gap-2 group-focus-within/input:text-secondary transition-colors">
                      <Lock className="w-3 h-3" /> Secret Rune
                    </label>
                    <div className="relative">
                      <motion.div className="absolute inset-0 rounded-xl opacity-0 group-focus-within/input:opacity-100 transition-opacity duration-500"
                        style={{ boxShadow: '0 0 20px rgba(212,175,55,0.2), inset 0 0 20px rgba(212,175,55,0.05)' }} />
                      <Lock className={cn("absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors duration-300 z-20",
                        focusedField === 'password' ? 'text-secondary' : 'text-foreground/20')} />
                      <input type={showPassword ? 'text' : 'password'} placeholder="••••••••" required
                        onFocus={() => setFocusedField('password')} onBlur={() => setFocusedField(null)}
                        className="w-full bg-foreground/[0.03] border border-foreground/10 rounded-xl py-4 pl-12 pr-12 text-sm focus:outline-none focus:border-secondary/50 transition-all font-medium placeholder:text-foreground/15 relative z-10 focus:bg-foreground/[0.06]" />
                      <button type="button" onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 text-foreground/20 hover:text-foreground/60 transition-colors">
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </motion.div>

                  <motion.button type="submit" disabled={isSubmitting}
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
                    whileHover={{ scale: 1.02, boxShadow: '0 0 40px rgba(200,16,46,0.3)' }} whileTap={{ scale: 0.98 }}
                    className="w-full py-5 bg-gradient-to-r from-primary to-primary-light text-white font-black rounded-2xl flex items-center justify-center gap-3 shadow-xl relative overflow-hidden disabled:opacity-70 mt-2">
                    <motion.div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent"
                      animate={{ x: ['-200%', '200%'] }} transition={{ duration: 3, repeat: Infinity, ease: 'linear' }} />
                    <span className="relative z-10 flex items-center gap-3 uppercase tracking-widest text-sm">
                      {isSubmitting ? (
                        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
                          <Sparkles className="w-5 h-5" />
                        </motion.div>
                      ) : (
                        <>{isLogin ? 'Open The Gates' : 'Forge Account'} <ArrowRight className="w-5 h-5" /></>
                      )}
                    </span>
                  </motion.button>
                </form>

                {/* Divider */}
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-px bg-gradient-to-r from-transparent to-foreground/10" />
                  <motion.div className="w-1.5 h-1.5 rotate-45 bg-secondary/40" animate={{ rotate: [45, 225, 405] }}
                    transition={{ duration: 6, repeat: Infinity, ease: 'linear' }} />
                  <div className="flex-1 h-px bg-gradient-to-l from-transparent to-foreground/10" />
                </div>

                <motion.button onClick={() => setIsLogin(!isLogin)} whileHover={{ scale: 1.02 }}
                  className="w-full text-xs font-bold text-foreground/25 hover:text-foreground/70 uppercase tracking-[0.2em] transition-all">
                  {isLogin ? "New Hero? Create Account" : "Already a Legend? Sign In"}
                </motion.button>
              </motion.div>
            ) : (
              <motion.div key="otp" initial={{ opacity: 0, scale: 0.95, rotateY: 10 }}
                animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.6 }} className="space-y-8">

                <div className="text-center space-y-4">
                  <motion.div className="inline-flex items-center justify-center w-20 h-20 rounded-full relative"
                    initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}>
                    <motion.div className="absolute inset-0 rounded-full border-2 border-dashed border-accent/40"
                      animate={{ rotate: 360 }} transition={{ duration: 8, repeat: Infinity, ease: 'linear' }} />
                    <div className="absolute inset-[4px] rounded-full bg-background/90 flex items-center justify-center">
                      <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Infinity }}>
                        <Shield className="w-8 h-8 text-accent drop-shadow-[0_0_12px_rgba(124,58,237,0.8)]" />
                      </motion.div>
                    </div>
                  </motion.div>

                  <h2 className="text-3xl font-black tracking-tighter text-foreground uppercase italic" style={{ fontFamily: 'Cinzel, serif' }}>
                    Verify Aura
                  </h2>
                  <p className="text-foreground/40 font-medium text-xs uppercase leading-relaxed">
                    Code sent to <span className="text-primary font-bold">{email}</span>
                  </p>
                </div>

                <form className="space-y-8" onSubmit={handleOtpVerify}>
                  <div className="flex justify-between gap-4">
                    {otp.map((digit, idx) => (
                      <motion.div key={idx} initial={{ opacity: 0, y: 30, rotateX: 40 }}
                        animate={{ opacity: 1, y: 0, rotateX: 0 }}
                        transition={{ delay: 0.2 + idx * 0.12, type: 'spring', stiffness: 200 }}>
                        <input id={`otp-${idx}`} type="text" maxLength={1} value={digit}
                          onChange={(e) => {
                            const val = e.target.value;
                            if (/^\d?$/.test(val)) {
                              const newOtp = [...otp];
                              newOtp[idx] = val;
                              setOtp(newOtp);
                              if (val && idx < 3) document.getElementById(`otp-${idx + 1}`)?.focus();
                            }
                          }}
                          className={cn("w-16 h-20 bg-foreground/[0.03] border rounded-2xl text-3xl font-black text-center text-foreground focus:outline-none transition-all duration-300",
                            digit ? "border-secondary/50 shadow-[0_0_20px_rgba(212,175,55,0.15)]" : "border-foreground/10",
                            "focus:border-primary focus:shadow-[0_0_25px_rgba(200,16,46,0.2)]")} />
                      </motion.div>
                    ))}
                  </div>

                  <div className="space-y-4">
                    <motion.button type="submit" disabled={isSubmitting}
                      whileHover={{ scale: 1.02, boxShadow: '0 0 40px rgba(200,16,46,0.3)' }} whileTap={{ scale: 0.98 }}
                      className="w-full py-5 bg-gradient-to-r from-primary to-accent text-white font-black rounded-2xl flex items-center justify-center gap-3 shadow-xl relative overflow-hidden disabled:opacity-70">
                      <motion.div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                        animate={{ x: ['-200%', '200%'] }} transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }} />
                      <span className="relative z-10 flex items-center gap-3 uppercase tracking-widest text-sm">
                        {isSubmitting ? (
                          <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
                            <Sparkles className="w-5 h-5" />
                          </motion.div>
                        ) : (<>Verify & Enter <Zap className="w-5 h-5 fill-current" /></>)}
                      </span>
                    </motion.button>
                    <button type="button" onClick={() => setStep('auth')}
                      className="w-full text-xs font-bold text-foreground/20 hover:text-foreground uppercase tracking-widest transition-all">
                      Change Email Address
                    </button>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </GlassCard>
      </motion.div>
    </div>
  );
}
