import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GlassCard } from '@/src/components/ui/GlassCard';
import { Mail, Lock, User, ArrowRight, Zap, Sun, Moon } from 'lucide-react';
import { useTheme } from '@/src/context/ThemeContext';
import { cn } from '@/src/lib/utils';

interface AuthPageProps {
  onLogin: () => void;
}

export function AuthPage({ onLogin }: AuthPageProps) {
  const { theme, toggleTheme } = useTheme();
  const [isLogin, setIsLogin] = useState(true);
  const [step, setStep] = useState<'auth' | 'otp'>('auth');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '']);

  const handleInitialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('otp');
    alert(`A verification code has been sent to ${email || 'your email'}`);
  };

  const handleOtpVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.join('') === '1234') {
      onLogin();
    } else {
      alert("Invalid code. Please use 1234 for testing.");
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6 relative overflow-hidden transition-colors duration-700">
      {/* Theme Toggle in Header */}
      <div className="absolute top-8 right-8 z-50">
        <button 
          onClick={toggleTheme}
          className="p-4 bg-white/[0.03] border border-card-border rounded-2xl text-foreground/40 hover:text-foreground transition-all backdrop-blur-md group"
        >
          {theme === 'dark' ? (
            <Sun className="w-5 h-5 group-hover:rotate-90 transition-transform duration-500" />
          ) : (
            <Moon className="w-5 h-5 group-hover:-rotate-12 transition-transform duration-500" />
          )}
        </button>
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

      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md relative z-10"
      >
        <GlassCard className="p-10 space-y-10 border-card-border shadow-2xl" hover={false}>
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
                  <h2 className="text-4xl font-black tracking-tighter text-foreground uppercase italic transition-colors">
                    {isLogin ? 'Enter The Void' : 'Join Aura'}
                  </h2>
                  <p className="text-foreground/40 font-medium text-xs uppercase tracking-widest transition-colors">
                    {isLogin ? 'Synchronize your energy' : 'Initialize your soul frequency'}
                  </p>
                </div>

                <form className="space-y-6" onSubmit={handleInitialSubmit}>
                  {!isLogin && (
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-foreground/30 uppercase tracking-[0.2em] ml-1 transition-colors">Full Name</label>
                      <div className="relative group">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/20 group-focus-within:text-primary transition-colors" />
                        <input 
                          type="text" 
                          placeholder="Alex Hunter"
                          className="w-full bg-white/[0.03] border border-card-border rounded-2xl py-4 pl-12 pr-4 text-foreground placeholder:text-foreground/10 focus:outline-none focus:border-primary/50 transition-all"
                        />
                      </div>
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-foreground/30 uppercase tracking-[0.2em] ml-1 transition-colors">Email Address</label>
                    <div className="relative group">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/20 group-focus-within:text-primary transition-colors" />
                      <input 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="alex@aura.io"
                        required
                        className="w-full bg-white/[0.03] border border-card-border rounded-2xl py-4 pl-12 pr-4 text-foreground placeholder:text-foreground/10 focus:outline-none focus:border-primary/50 transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-foreground/30 uppercase tracking-[0.2em] ml-1 transition-colors">Password</label>
                    <div className="relative group">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/20 group-focus-within:text-primary transition-colors" />
                      <input 
                        type="password" 
                        placeholder="••••••••"
                        required
                        className="w-full bg-white/[0.03] border border-card-border rounded-2xl py-4 pl-12 pr-4 text-foreground placeholder:text-foreground/10 focus:outline-none focus:border-primary/50 transition-all"
                      />
                    </div>
                  </div>

                  <button 
                    type="submit"
                    className="w-full py-5 bg-foreground text-background font-black rounded-2xl flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl"
                  >
                    {isLogin ? 'SEND OTP' : 'CREATE ACCOUNT'} <ArrowRight className="w-5 h-5" />
                  </button>
                </form>

                <button 
                  onClick={() => setIsLogin(!isLogin)}
                  className="w-full text-xs font-bold text-foreground/20 hover:text-foreground uppercase tracking-widest transition-all"
                >
                  {isLogin ? "New to Aura? Create Account" : "Back to Sign In"}
                </button>
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
                  <h2 className="text-4xl font-black tracking-tighter text-foreground uppercase italic transition-colors">Verify Aura</h2>
                  <p className="text-foreground/40 font-medium text-xs uppercase text-center leading-relaxed transition-colors">
                    We sent a 4-digit code to <br/> <span className="text-primary font-bold">{email}</span>
                  </p>
                </div>

                <form className="space-y-8" onSubmit={handleOtpVerify}>
                  <div className="flex justify-between gap-4">
                    {otp.map((digit, idx) => (
                      <input
                        key={idx}
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
                        className="w-16 h-20 bg-white/[0.03] border border-card-border rounded-2xl text-3xl font-black text-center text-foreground focus:outline-none focus:border-primary shadow-lg transition-colors"
                      />
                    ))}
                  </div>

                  <div className="space-y-4">
                    <button 
                      type="submit"
                      className="w-full py-5 bg-primary text-white font-black rounded-2xl flex items-center justify-center gap-3 hover:scale-[1.02] shadow-glow-purple transition-all"
                    >
                      VERIFY & ENTER <Zap className="w-5 h-5 fill-current" />
                    </button>
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
