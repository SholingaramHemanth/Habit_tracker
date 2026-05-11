import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GlassCard } from '@/src/components/ui/GlassCard';
import { Mail, Lock, User, ArrowRight, Zap, Sun, Moon, Shield, Sparkles } from 'lucide-react';
import { useTheme } from '@/src/context/ThemeContext';
import { cn } from '@/src/lib/utils';

const RUNE_CHARS = ['ᚠ', 'ᚢ', 'ᚦ', 'ᚨ', 'ᚱ', 'ᚲ', 'ᚷ', 'ᚹ', 'ᚺ', 'ᚾ', 'ᛁ', 'ᛃ'];

interface AuthPageProps {
  onLogin: () => void;
}

export function AuthPage({ onLogin }: AuthPageProps) {
  const { theme, toggleTheme } = useTheme();
  const [isLogin, setIsLogin] = useState(true);
  const [step, setStep] = useState<'auth' | 'otp'>('auth');
  const [email, setEmail] = useState('');
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
        setIsLogin(false); // switch to sign up
        return;
      }
    } else {
      if (registeredUsers.includes(email)) {
        setIsSubmitting(false);
        alert("An account with this email already exists. Please sign in.");
        setIsLogin(true); // switch to login
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
      {/* Theme Toggle in Header */}
      <div className="absolute top-8 right-8 z-50">
        <motion.button 
          onClick={toggleTheme}
          whileHover={{ scale: 1.1, rotate: 5 }}
          whileTap={{ scale: 0.9 }}
          className="p-4 bg-white/[0.03] border border-card-border rounded-2xl text-foreground/40 hover:text-foreground transition-all backdrop-blur-md group energy-ring"
        >
          {theme === 'dark' ? (
            <Sun className="w-5 h-5 group-hover:rotate-90 transition-transform duration-500" />
          ) : (
            <Moon className="w-5 h-5 group-hover:-rotate-12 transition-transform duration-500" />
          )}
        </motion.button>
      </div>

      {/* Cinematic Animated Ocean Wave Background */}
      <motion.div 
        animate={{ 
          scale: [1, 1.05, 1],
          y: [0, -20, 0]
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-0 z-0"
      >
        <img 
          src="https://images.unsplash.com/photo-1439405326854-014607f694d7?q=80&w=2560&auto=format&fit=crop" 
          className={cn(
            "w-full h-full object-cover transition-all duration-700",
            theme === 'dark' ? "brightness-[0.4] saturate-[1.3]" : "brightness-[0.8] saturate-[1.1]"
          )}
          alt="Ocean Wave Sunset"
        />
      </motion.div>
      
      {/* Atmospheric Overlays */}
      <div className={cn(
        "absolute inset-0 z-[1] transition-all duration-700",
        theme === 'dark' ? "bg-gradient-to-t from-black via-transparent to-black/40" : "bg-gradient-to-t from-white/40 via-transparent to-white/10"
      )} />
      <div className="absolute inset-0 bg-mesh opacity-30 mix-blend-overlay z-[2]" />

      {/* ══════ NEW: Floating Rune Characters ══════ */}
      <div className="absolute inset-0 z-[3] pointer-events-none overflow-hidden">
        {RUNE_CHARS.map((rune, i) => (
          <motion.div
            key={i}
            className="absolute text-lg md:text-2xl select-none"
            style={{
              left: `${5 + (i * 8) % 90}%`,
              top: `${10 + (i * 13) % 80}%`,
              color: 'rgba(212,175,55,0.06)',
              fontFamily: 'serif',
            }}
            animate={{
              y: [0, -40, 0],
              rotate: [0, 20, -20, 0],
              opacity: [0.03, 0.1, 0.03],
            }}
            transition={{
              duration: 10 + i * 1.5,
              repeat: Infinity,
              delay: i * 0.5,
              ease: 'easeInOut',
            }}
          >
            {rune}
          </motion.div>
        ))}
      </div>

      {/* ══════ NEW: Arcane Circle behind the form ══════ */}
      <div className="absolute z-[4] pointer-events-none" style={{ width: '500px', height: '500px' }}>
        <motion.div
          className="absolute inset-0 rounded-full border border-[rgba(212,175,55,0.06)]"
          animate={{ rotate: 360 }}
          transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
          style={{ borderStyle: 'dashed' }}
        />
        <motion.div
          className="absolute inset-[30px] rounded-full border border-[rgba(200,16,46,0.05)]"
          animate={{ rotate: -360 }}
          transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
          style={{ borderStyle: 'dotted' }}
        />
        <motion.div
          className="absolute inset-[60px] rounded-full border border-[rgba(124,58,237,0.04)]"
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        />
        {/* Orbiting dots */}
        {[0, 1, 2, 3].map((i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full top-1/2 left-1/2"
            style={{ 
              backgroundColor: ['#d4af37', '#c8102e', '#7c3aed', '#e8d5b0'][i],
              boxShadow: `0 0 8px ${['#d4af37', '#c8102e', '#7c3aed', '#e8d5b0'][i]}`,
              opacity: 0.4,
            }}
            animate={{
              rotate: 360,
            }}
            transition={{
              duration: 8 + i * 3,
              repeat: Infinity,
              ease: 'linear',
            }}
            // Offset from center
            initial={{ x: -1, y: -1 }}
          >
            <motion.div
              className="absolute w-2 h-2 rounded-full"
              style={{ 
                backgroundColor: ['#d4af37', '#c8102e', '#7c3aed', '#e8d5b0'][i],
                left: `${120 + i * 30}px`,
                top: '0px',
              }}
            />
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md relative z-10"
      >
        <GlassCard className="p-10 space-y-10 border-card-border shadow-2xl" hover={false}>
          {/* ══════ NEW: Animated top accent line ══════ */}
          <motion.div
            className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-secondary to-transparent"
            animate={{ opacity: [0.3, 0.8, 0.3] }}
            transition={{ duration: 3, repeat: Infinity }}
          />

          <AnimatePresence mode="wait">
            {step === 'auth' ? (
              <motion.div
                key="auth"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-10"
              >
                <div className="text-center space-y-3">
                  {/* ══════ NEW: Animated icon above title ══════ */}
                  <motion.div
                    className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4"
                    style={{
                      background: 'linear-gradient(135deg, rgba(200,16,46,0.15), rgba(212,175,55,0.1))',
                      border: '1px solid rgba(212,175,55,0.2)',
                    }}
                    animate={{ 
                      rotate: [0, 5, -5, 0],
                      scale: [1, 1.05, 1],
                    }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    <Shield className="w-7 h-7 text-secondary" />
                  </motion.div>

                  <motion.h2 
                    className="text-4xl font-black tracking-tighter text-foreground uppercase italic transition-colors"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    {isLogin ? 'Enter The Void' : 'Join Aura'}
                  </motion.h2>
                  <motion.p 
                    className="text-foreground/40 font-medium text-xs uppercase tracking-widest transition-colors"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    {isLogin ? 'Synchronize your energy' : 'Initialize your soul frequency'}
                  </motion.p>
                </div>

                <form className="space-y-6" onSubmit={handleInitialSubmit}>
                  {!isLogin && (
                    <motion.div 
                      className="space-y-2"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      <label className="text-[10px] font-black text-foreground/30 uppercase tracking-[0.2em] ml-1 transition-colors">Full Name</label>
                      <div className="relative group">
                        <User className={cn(
                          "absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors duration-300",
                          focusedField === 'name' ? 'text-secondary' : 'text-foreground/20'
                        )} />
                        <input 
                          type="text" 
                          placeholder="Alex Hunter"
                          onFocus={() => setFocusedField('name')}
                          onBlur={() => setFocusedField(null)}
                          className="w-full bg-white/[0.03] border border-card-border rounded-2xl py-4 pl-12 pr-4 text-foreground placeholder:text-foreground/10 focus:outline-none focus:border-secondary/50 focus:shadow-[0_0_20px_rgba(212,175,55,0.1)] transition-all"
                        />
                      </div>
                    </motion.div>
                  )}
                  
                  <motion.div 
                    className="space-y-2"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <label className="text-[10px] font-black text-foreground/30 uppercase tracking-[0.2em] ml-1 transition-colors">Email Address</label>
                    <div className="relative group">
                      <Mail className={cn(
                        "absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors duration-300",
                        focusedField === 'email' ? 'text-secondary' : 'text-foreground/20'
                      )} />
                      <input 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onFocus={() => setFocusedField('email')}
                        onBlur={() => setFocusedField(null)}
                        placeholder="alex@aura.io"
                        required
                        className="w-full bg-white/[0.03] border border-card-border rounded-2xl py-4 pl-12 pr-4 text-foreground placeholder:text-foreground/10 focus:outline-none focus:border-secondary/50 focus:shadow-[0_0_20px_rgba(212,175,55,0.1)] transition-all"
                      />
                    </div>
                  </motion.div>

                  <motion.div 
                    className="space-y-2"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <label className="text-[10px] font-black text-foreground/30 uppercase tracking-[0.2em] ml-1 transition-colors">Password</label>
                    <div className="relative group">
                      <Lock className={cn(
                        "absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors duration-300",
                        focusedField === 'password' ? 'text-secondary' : 'text-foreground/20'
                      )} />
                      <input 
                        type="password" 
                        placeholder="••••••••"
                        required
                        onFocus={() => setFocusedField('password')}
                        onBlur={() => setFocusedField(null)}
                        className="w-full bg-white/[0.03] border border-card-border rounded-2xl py-4 pl-12 pr-4 text-foreground placeholder:text-foreground/10 focus:outline-none focus:border-secondary/50 focus:shadow-[0_0_20px_rgba(212,175,55,0.1)] transition-all"
                      />
                    </div>
                  </motion.div>

                  <motion.button 
                    type="submit"
                    disabled={isSubmitting}
                    whileHover={{ scale: 1.02, boxShadow: '0 0 40px rgba(212,175,55,0.2)' }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-5 bg-foreground text-background font-black rounded-2xl flex items-center justify-center gap-3 transition-all shadow-xl relative overflow-hidden ripple-button disabled:opacity-70"
                  >
                    {/* ══════ NEW: Sweeping shimmer on button ══════ */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                      animate={{ x: ['-200%', '200%'] }}
                      transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                    />
                    <span className="relative z-10 flex items-center gap-3">
                      {isSubmitting ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        >
                          <Sparkles className="w-5 h-5" />
                        </motion.div>
                      ) : (
                        <>{isLogin ? 'SEND OTP' : 'CREATE ACCOUNT'} <ArrowRight className="w-5 h-5" /></>
                      )}
                    </span>
                  </motion.button>
                </form>

                <motion.button 
                  onClick={() => setIsLogin(!isLogin)}
                  whileHover={{ scale: 1.02 }}
                  className="w-full text-xs font-bold text-foreground/20 hover:text-foreground uppercase tracking-widest transition-all animated-underline"
                >
                  {isLogin ? "New to Aura? Create Account" : "Back to Sign In"}
                </motion.button>
              </motion.div>
            ) : (
              <motion.div
                key="otp"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-10"
              >
                <div className="text-center space-y-3">
                  {/* ══════ NEW: Animated lock icon ══════ */}
                  <motion.div
                    className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4"
                    style={{
                      background: 'linear-gradient(135deg, rgba(124,58,237,0.15), rgba(200,16,46,0.1))',
                      border: '1px solid rgba(124,58,237,0.2)',
                    }}
                    animate={{ 
                      scale: [1, 1.1, 1],
                      rotate: [0, 3, -3, 0],
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    <Lock className="w-7 h-7 text-accent" />
                  </motion.div>

                  <h2 className="text-4xl font-black tracking-tighter text-foreground uppercase italic transition-colors">Verify Aura</h2>
                  <p className="text-foreground/40 font-medium text-xs uppercase text-center leading-relaxed transition-colors">
                    We sent a 4-digit code to <br/> <span className="text-primary font-bold">{email}</span>
                  </p>
                </div>

                <form className="space-y-8" onSubmit={handleOtpVerify}>
                  <div className="flex justify-between gap-4">
                    {otp.map((digit, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 20, scale: 0.8 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ delay: 0.1 + idx * 0.1, type: 'spring', stiffness: 200 }}
                      >
                        <input
                          id={`otp-${idx}`}
                          type="text"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => {
                            const val = e.target.value;
                            if (/^\d?$/.test(val)) {
                              const newOtp = [...otp];
                              newOtp[idx] = val;
                              setOtp(newOtp);
                              if (val && idx < 3) {
                                document.getElementById(`otp-${idx + 1}`)?.focus();
                              }
                            }
                          }}
                          className={cn(
                            "w-16 h-20 bg-white/[0.03] border rounded-2xl text-3xl font-black text-center text-foreground focus:outline-none transition-all duration-300",
                            digit ? "border-secondary/50 shadow-[0_0_20px_rgba(212,175,55,0.15)]" : "border-card-border",
                            "focus:border-primary focus:shadow-[0_0_25px_rgba(200,16,46,0.2)]"
                          )}
                        />
                      </motion.div>
                    ))}
                  </div>

                  <div className="space-y-4">
                    <motion.button 
                      type="submit"
                      disabled={isSubmitting}
                      whileHover={{ scale: 1.02, boxShadow: '0 0 40px rgba(200,16,46,0.3)' }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full py-5 bg-primary text-white font-black rounded-2xl flex items-center justify-center gap-3 shadow-glow-purple transition-all relative overflow-hidden ripple-button disabled:opacity-70"
                    >
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                        animate={{ x: ['-200%', '200%'] }}
                        transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }}
                      />
                      <span className="relative z-10 flex items-center gap-3">
                        {isSubmitting ? (
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                          >
                            <Sparkles className="w-5 h-5" />
                          </motion.div>
                        ) : (
                          <>VERIFY & ENTER <Zap className="w-5 h-5 fill-current" /></>
                        )}
                      </span>
                    </motion.button>
                    <button 
                      type="button"
                      onClick={() => setStep('auth')}
                      className="w-full text-xs font-bold text-foreground/20 hover:text-foreground uppercase tracking-widest transition-all"
                    >
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
