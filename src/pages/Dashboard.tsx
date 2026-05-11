import { useState, useEffect, useMemo } from 'react';
import { Sidebar } from '@/src/components/dashboard/Sidebar';
import { HabitList } from '@/src/components/dashboard/HabitList';
import { StatsGrid } from '@/src/components/dashboard/StatsGrid';
import { SettingsView } from '@/src/components/dashboard/SettingsView';
import { NotificationPanel } from '@/src/components/dashboard/NotificationPanel';
import { ProgressBar } from '@/src/components/ui/ProgressBar';
import { GlassCard } from '@/src/components/ui/GlassCard';
import { Habit, User, Mission, Notification } from '@/src/types';
import { Bell, Search, Trophy, Star, Zap, BellOff, Shield, BookOpen, Clock, Activity, Hexagon } from 'lucide-react';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'motion/react';
import { cn } from '@/src/lib/utils';
import confetti from 'canvas-confetti';

const EMBER_COLORS = ['#d4af37', '#c8102e', '#ff8c42', '#d4af37', '#e8d5b0'];
const EMBER_PARTICLES = Array.from({ length: 20 }, (_, i) => ({
  size:     1.5 + ((i * 37) % 30) / 10,
  left:     (i * 53) % 100,
  color:    EMBER_COLORS[i % EMBER_COLORS.length],
  glow:     4 + ((i * 17) % 60) / 10,
  drift:    ((i * 41) % 120) - 60,
  duration: 6 + ((i * 29) % 80) / 10,
  delay:    (i * 23) % 8,
}));

const BACKGROUND_IMAGES = [
  // Elegant High-Res Nature
  'https://images.unsplash.com/photo-1542224566-6e85f2e6772f?q=80&w=2500&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=2500&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=2500&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?q=80&w=2500&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1470071131384-001b85755536?q=80&w=2500&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1426604966848-d7adac402bff?q=80&w=2500&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1505820013142-f86a3439c5b2?q=80&w=2500&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1475924156734-496f6cac6ec1?q=80&w=2500&auto=format&fit=crop'
];

const INITIAL_HABITS: Habit[] = [];

const HABIT_TEMPLATES = [
  { name: 'Morning Yoga', icon: '🧘', color: 'bg-emerald-500' },
  { name: 'Deep Work', icon: '💻', color: 'bg-indigo-500' },
  { name: 'Hydrate', icon: '🚰', color: 'bg-sky-500' },
  { name: 'Journaling', icon: '✍️', color: 'bg-amber-500' },
  { name: 'Read 20 Pages', icon: '📚', color: 'bg-purple-500' },
  { name: 'Meditation', icon: '🧠', color: 'bg-teal-500' },
  { name: 'Cold Shower', icon: '🚿', color: 'bg-blue-500' },
  { name: 'Walk 10k Steps', icon: '🚶‍♂️', color: 'bg-lime-500' },
  { name: 'Coding Practice', icon: '⌨️', color: 'bg-zinc-800' },
  { name: 'No Sugar', icon: '🚫', color: 'bg-red-500' },
  { name: 'Sleep 8 Hours', icon: '🛌', color: 'bg-indigo-400' },
  { name: 'Stretching', icon: '🤸', color: 'bg-orange-500' },
  { name: 'Call Family', icon: '📞', color: 'bg-pink-500' },
  { name: 'Learn Language', icon: '🌍', color: 'bg-cyan-500' },
  { name: 'Workout', icon: '🏋️', color: 'bg-rose-500' },
  { name: 'Gratitude', icon: '🙏', color: 'bg-yellow-500' },
  { name: 'Vitamins', icon: '💊', color: 'bg-fuchsia-500' },
  { name: 'Clean Workspace', icon: '🧹', color: 'bg-stone-500' },
  { name: 'Financial Review', icon: '📈', color: 'bg-emerald-600' },
  { name: 'Read News', icon: '📰', color: 'bg-slate-500' },
  { name: 'Digital Detox', icon: '📵', color: 'bg-rose-700' },
  { name: 'Review Goals', icon: '🎯', color: 'bg-red-600' }
];

const MISSIONS: Mission[] = [
  { id: 'm1', description: 'Complete 3 habits today', rewardXp: 50, completed: false },
  { id: 'm2', description: 'Maintain a 7-day streak', rewardXp: 100, completed: false },
];

const maleAvatars = Array.from({ length: 15 }, (_, i) => `https://api.dicebear.com/7.x/avataaars/svg?seed=male_${i}&backgroundColor=transparent`);
const femaleAvatars = Array.from({ length: 15 }, (_, i) => `https://api.dicebear.com/7.x/avataaars/svg?seed=female_${i}&backgroundColor=transparent`);

interface DashboardProps {
  onLogout: () => void;
  onNavigateSettings?: () => void;
}

const INITIAL_USER: User = {
  name: 'New Soul',
  level: 1,
  xp: 0,
  xpToNextLevel: 100,
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=new_soul&baseColor=transparent',
  goal: 'Unleash full potential',
  settings: {
    theme: 'dark',
    accentColor: '#8b5cf6',
    weekStart: 'monday',
    language: 'English',
    reminders: {
      enabled: true,
      times: ['09:00', '21:00'],
      repeatDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      smartReminders: true,
      snooze: true,
      mute: false,
      streakAlerts: true,
      sound: true,
      vibration: true,
      dnd: false,
      missedAlerts: true,
      aiTiming: true,
      tone: 'Default',
    },
    gamification: {
      showXp: true,
      showLevels: true,
      showRewards: true,
    }, 
    habits: {
      resetRule: '1miss',
      units: {
        distance: 'km',
        water: 'liters',
      },
    },
    privacy: {
      biometrics: false,
      privateMode: false,
      lockScreenPrivacy: false,
    },
    advanced: {
      aiSuggestions: true,
      soundEffects: true,
      minimalMode: false,
      betaFeatures: false,
    },
    vacationMode: false,
  }
};

export function Dashboard({ onLogout }: DashboardProps) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [statsMode, setStatsMode] = useState<'week' | 'month'>('week');
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(() => {
    const saved = localStorage.getItem('aura_notifications');
    return saved ? JSON.parse(saved) : [];
  });
  const [habits, setHabits] = useState<Habit[]>(() => {
    const saved = localStorage.getItem('aura_habits');
    return saved ? JSON.parse(saved) : INITIAL_HABITS;
  });
  const [user, setUser] = useState<User>(() => {
    const saved = localStorage.getItem('aura_user');
    if (!saved) return { ...INITIAL_USER, gender: undefined };
    const parsed = JSON.parse(saved);
    const settings = {
      ...INITIAL_USER.settings,
      ...(parsed.settings || {}),
      reminders: { ...INITIAL_USER.settings.reminders, ...(parsed.settings?.reminders || {}) },
      privacy: { ...INITIAL_USER.settings.privacy, ...(parsed.settings?.privacy || {}) },
      advanced: { ...INITIAL_USER.settings.advanced, ...(parsed.settings?.advanced || {}) },
      gamification: { ...INITIAL_USER.settings.gamification, ...(parsed.settings?.gamification || {}) },
      habits: { ...INITIAL_USER.settings.habits, ...(parsed.settings?.habits || {}) }
    };
    return { ...INITIAL_USER, ...parsed, settings };
  });
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [isSettingUp, setIsSettingUp] = useState(() => !user.gender);

  const [bgImage] = useState(() => BACKGROUND_IMAGES[Math.floor(Math.random() * BACKGROUND_IMAGES.length)]);
  
  const currentAvatars = user.gender === 'female' ? femaleAvatars : maleAvatars;

  const handleSetupComplete = (data?: any) => {
    setIsSettingUp(false);
  };

  const handleHardReset = () => {
    if (confirm("Are you sure? This will wipe ALL your habits and reset your level to 1.")) {
      localStorage.clear();
      window.location.reload();
    }
  };

  useEffect(() => {
    localStorage.setItem('aura_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    if (!user.settings.reminders.enabled) return;

    const checkReminders = () => {
      const now = new Date();
      const currentDay = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][now.getDay()];
      const currentTime = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

      // Only proceed if today is an active tracking day
      if (!user.settings.reminders.repeatDays.includes(currentDay)) return;

      // Check if current time is a scheduled reminder time
      if (user.settings.reminders.times.includes(currentTime)) {
        const reminderId = `reminder-${currentDay}-${currentTime}`;
        
        // Prevent duplicate notifications for the same time slot
        setNotifications(prev => {
          if (prev.some(n => n.id.startsWith(`reminder-${currentDay}-${currentTime}`))) return prev;

          const pendingCount = habits.filter(h => !h.completedToday).length;
          if (pendingCount === 0) return prev;

          return [{
            id: `${reminderId}-${Date.now()}`,
            type: 'reminder' as const,
            title: '✨ Aura Check-In',
            message: `Time for your scheduled check-in! You have ${pendingCount} habits pending.`,
            timestamp: 'Just now',
            read: false
          }, ...prev];
        });
      }
    };

    const interval = setInterval(checkReminders, 60000);
    checkReminders(); // Initial check

    return () => clearInterval(interval);
  }, [habits, user.settings.reminders]);

  useEffect(() => {
    if (!user.settings.reminders.enabled) return;

    const pendingHabits = habits.filter(h => !h.completedToday);
    setNotifications(prev => {
      const existingHabitIds = prev.filter(n => n.type === 'habit').map(n => n.habitId);
      const newNotifs = pendingHabits
        .filter(h => !existingHabitIds.includes(h.id))
        .map(h => ({
          id: `notif-${h.id}-${Date.now()}`,
          type: 'habit' as const,
          title: `${h.icon} ${h.name} Pending`,
          message: `Your momentum is at risk! Complete "${h.name}" to sustain your aura.`,
          timestamp: 'Just now',
          read: false,
          habitId: h.id
        }));
      
      const filteredPrev = prev.filter(n => {
        if (n.type === 'habit' && n.habitId) {
          const habit = habits.find(h => h.id === n.habitId);
          return habit && !habit.completedToday;
        }
        return true;
      });

      if (newNotifs.length === 0 && filteredPrev.length === prev.length) return prev;
      return [...newNotifs, ...filteredPrev];
    });
  }, [habits, user.settings.reminders.enabled]);

  useEffect(() => {
    localStorage.setItem('aura_habits', JSON.stringify(habits));
  }, [habits]);

  useEffect(() => {
    localStorage.setItem('aura_user', JSON.stringify(user));
    if (user.settings.accentColor) {
      document.documentElement.style.setProperty('--primary', user.settings.accentColor);
    }
  }, [user]);

  const triggerConfetti = () => {
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };
    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;
    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) return clearInterval(interval);
      const particleCount = 50 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);
  };

  const handleToggleHabit = (id: string) => {
    setHabits(prev => prev.map(h => {
      if (h.id === id) {
        const newState = !h.completedToday;
        if (newState) {
          const newXp = user.xp + 25;
          if (newXp >= user.xpToNextLevel) {
            setUser(u => ({ ...u, level: u.level + 1, xp: newXp - u.xpToNextLevel }));
            setShowLevelUp(true);
            triggerConfetti();
            setTimeout(() => setShowLevelUp(false), 5000);
          } else {
            setUser(u => ({ ...u, xp: newXp }));
          }
        }
        return { ...h, completedToday: newState, streak: newState ? h.streak + 1 : Math.max(0, h.streak - 1) };
      }
      return h;
    }));
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const dismissNotif = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handleSnooze = (id: string, mins: number) => {
    dismissNotif(id);
    alert(`Aura Reminder snoozed for ${mins} minutes.`);
  };

  const handleQuickDone = (habitId: string, notifId: string) => {
    handleToggleHabit(habitId);
    dismissNotif(notifId);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-transparent flex overflow-hidden relative z-0">
      {/* ── Original 3D Animated Nature Background (PRESERVED) ── */}
      <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none perspective-[1000px] bg-background">
        <motion.div
          className="absolute inset-[-10%] w-[120%] h-[120%] bg-cover bg-center opacity-60 brightness-110"
          style={{ backgroundImage: `url(${bgImage})`, willChange: 'transform' }}
          animate={{ rotateX: [2, -2, 2], rotateY: [-3, 3, -3], scale: [1, 1.1, 1], z: [0, 50, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
        />
        {/* Dark fantasy vignette on top of nature image */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/75 to-transparent" />
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, transparent 40%, rgba(6,4,9,0.5) 100%)' }} />
      </div>

      {/* ── Floating Ember Particles (D&D style, over background) ── */}
      <div className="fixed inset-0 z-[1] pointer-events-none overflow-hidden">
        {EMBER_PARTICLES.map((p, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: `${p.size}px`,
              height: `${p.size}px`,
              left: `${p.left}%`,
              bottom: '-10px',
              backgroundColor: p.color,
              boxShadow: `0 0 ${p.glow}px ${p.color}`,
              willChange: 'transform, opacity'
            }}
            animate={{
              y: [0, -940],
              x: [0, p.drift],
              opacity: [0, 0.9, 0.6, 0],
              scale: [0.6, 1.2, 0.8, 0],
            }}
            transition={{
              duration: p.duration,
              repeat: Infinity,
              delay: p.delay,
              ease: 'easeOut',
            }}
          />
        ))}
      </div>

      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} onLogout={onLogout} />

      <main className="flex-1 ml-64 p-10 space-y-10 relative z-10 w-full h-screen overflow-y-auto custom-scrollbar">
        <div className="absolute inset-0 bg-mesh opacity-30 pointer-events-none fixed" />

        {/* Top Navbar */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, type: 'spring', stiffness: 200 }}
          className="relative z-10 flex items-center justify-between"
        >
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              {/* Rotating gold diamond */}
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                className="w-2 h-2 rotate-45"
                style={{ backgroundColor: '#d4af37', boxShadow: '0 0 10px rgba(212,175,55,0.9)' }}
              />
              <h1
                className="text-2xl font-black uppercase tracking-[0.2em]"
                style={{ fontFamily: 'Cinzel, serif', color: '#d4af37', textShadow: '0 0 20px rgba(212,175,55,0.4)' }}
              >
                {activeTab}
              </h1>
            </div>
            <p className="text-[9px] font-bold uppercase tracking-[0.35em]" style={{ color: 'rgba(232,213,176,0.25)', fontFamily: 'Cinzel, serif' }}>
              Aura Sanctum · {activeTab}
            </p>
          </div>

          <div className="flex items-center gap-6">
            {/* Search */}
            <motion.div
              className="flex items-center gap-3 px-5 py-3 rounded-xl w-72 focus-within:shadow-[0_0_20px_rgba(212,175,55,0.2)] transition-all group"
              style={{
                background: 'rgba(10,6,15,0.6)',
                border: '1px solid rgba(212,175,55,0.15)',
              }}
            >
              <Search className="w-4 h-4 transition-colors" style={{ color: 'rgba(212,175,55,0.3)' }} />
              <input
                type="text"
                placeholder="Search quests..."
                className="bg-transparent border-none focus:outline-none text-xs font-medium w-full"
                style={{ color: 'rgba(232,213,176,0.8)', fontFamily: 'Cinzel, serif' }}
              />
            </motion.div>

            <div className="flex items-center gap-4">
              {/* Bell */}
              <div className="relative">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsNotifOpen(!isNotifOpen)}
                  className={cn(
                    'relative p-3 bg-foreground/[0.04] border border-card-border rounded-xl transition-all',
                    !user.settings.reminders.enabled ? 'text-foreground/10' : 'text-foreground/50 hover:text-foreground hover:border-primary/40 hover:shadow-[0_0_20px_rgba(139,92,246,0.2)]'
                  )}
                >
                  {user.settings.reminders.enabled ? (
                    <>
                      <motion.div
                        animate={unreadCount > 0 ? { rotate: [0, -15, 15, -10, 10, 0] } : {}}
                        transition={{ repeat: Infinity, duration: 2, repeatDelay: 2 }}
                      >
                        <Bell className="w-5 h-5" />
                      </motion.div>
                      {unreadCount > 0 && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: [1, 1.3, 1] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                          className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-background shadow-[0_0_10px_rgba(239,68,68,0.8)]"
                        />
                      )}
                    </>
                  ) : (
                    <BellOff className="w-5 h-5" />
                  )}
                </motion.button>
                <NotificationPanel
                  notifications={notifications}
                  isOpen={isNotifOpen}
                  onClose={() => setIsNotifOpen(false)}
                  onMarkAsRead={markAsRead}
                  onMarkAllAsRead={markAllAsRead}
                  onDismiss={dismissNotif}
                  onDone={handleQuickDone}
                  onSnooze={handleSnooze}
                />
              </div>

              {/* Avatar */}
              <div className="flex items-center gap-4 pl-5 border-l border-card-border">
                <div className="text-right">
                  <div className="text-xs font-black text-foreground uppercase tracking-tight">{user.name}</div>
                  <div className="text-[10px] font-bold text-primary-light uppercase tracking-widest">Elite Tier</div>
                </div>
                <motion.div
                  onClick={() => setActiveTab('profile')}
                  whileHover={{ scale: 1.08, rotate: 3 }}
                  whileTap={{ scale: 0.94 }}
                  className="relative cursor-pointer"
                >
                  <motion.div
                    className="absolute inset-[-3px] rounded-xl"
                    style={{ background: 'conic-gradient(from 0deg, #8b5cf6, #06b6d4, #10b981, #8b5cf6)' }}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                  />
                  <img src={user.avatar} alt="Avatar" className="relative w-11 h-11 rounded-xl border-2 border-background shadow-xl z-10 block" />
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 30, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -30, scale: 1.02 }}
            transition={{ duration: 0.4, type: 'spring', bounce: 0.2 }}
            className="space-y-10"
            style={{ willChange: 'transform, opacity' }}
          >
            {activeTab === 'dashboard' && (
              <>
                {/* Stunning Welcome & Level Banner */}
                {user.settings.gamification.showLevels && (
                  <GlassCard className="relative overflow-hidden p-8 lg:p-12 border-card-border/50 group" hover={false}>
                    {/* Animated Background Gradients */}
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-secondary/10 opacity-50 group-hover:opacity-100 transition-opacity duration-1000" />
                    <motion.div 
                      className="absolute -top-[50%] -left-[10%] w-[60%] h-[200%] bg-primary/20 blur-[120px] rounded-full pointer-events-none"
                      animate={{ 
                        rotate: [0, 90, 0],
                        scale: [1, 1.2, 1]
                      }}
                      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    />
                    <motion.div 
                      className="absolute -bottom-[50%] -right-[10%] w-[60%] h-[200%] bg-secondary/20 blur-[120px] rounded-full pointer-events-none"
                      animate={{ 
                        rotate: [0, -90, 0],
                        scale: [1, 1.5, 1]
                      }}
                      transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                    />
                    
                    {/* Floating Particles */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
                      {[...Array(5)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="absolute w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_10px_#fff]"
                          initial={{ 
                            x: Math.random() * 100 + "%", 
                            y: Math.random() * 100 + "%",
                            opacity: 0
                          }}
                          animate={{ 
                            y: [null, Math.random() * -100 - 50],
                            opacity: [0, 1, 0]
                          }}
                          transition={{ 
                            duration: Math.random() * 5 + 5,
                            repeat: Infinity,
                            delay: Math.random() * 5
                          }}
                        />
                      ))}
                    </div>

                    <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-10">
                      <div className="space-y-3">
                        <motion.h2 
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.2 }}
                          className="text-4xl lg:text-5xl font-black text-foreground uppercase tracking-tighter"
                        >
                          Ready to <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Conquer</span>?
                        </motion.h2>
                        <motion.p 
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.3 }}
                          className="text-xs font-bold text-foreground/40 uppercase tracking-[0.3em]"
                        >
                          Your journey continues, {user.name}.
                        </motion.p>
                      </div>

                      <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.4 }}
                        className="flex items-center gap-6 bg-background/40 backdrop-blur-xl p-5 rounded-3xl border border-white/5 shadow-2xl w-full lg:w-auto"
                      >
                        <div className="relative group/level cursor-pointer">
                          <div className="absolute inset-0 bg-primary/40 blur-xl group-hover/level:bg-primary/60 transition-colors duration-500 animate-pulse" />
                          <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-black text-3xl shadow-[0_0_40px_rgba(139,92,246,0.3)] border border-white/20 overflow-hidden">
                            <motion.div 
                              className="absolute inset-0 bg-white/20 translate-y-full group-hover/level:translate-y-0 transition-transform duration-500 ease-out" 
                            />
                            <span className="relative z-10">{user.level}</span>
                          </div>
                        </div>
                        <div className="flex-1 min-w-[200px] space-y-3">
                          <div className="flex justify-between items-end">
                            <div className="space-y-1">
                              <div className="text-[10px] font-black text-foreground/40 uppercase tracking-[0.2em]">Rank</div>
                              <div className="text-lg font-black text-foreground uppercase tracking-tight leading-none">Aura Master</div>
                            </div>
                            <div className="text-right">
                              <div className="text-xl font-black text-primary tracking-tighter leading-none">{user.xp}<span className="text-xs text-foreground/40 ml-1">/ {user.xpToNextLevel}</span></div>
                            </div>
                          </div>
                          <div className="relative h-3 w-full bg-foreground/10 rounded-full overflow-hidden shadow-inner">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${(user.xp / user.xpToNextLevel) * 100}%` }}
                              transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
                              className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary via-primary-light to-secondary rounded-full shadow-[0_0_15px_rgba(139,92,246,0.5)]"
                            />
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  </GlassCard>
                )}

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  <div className={cn(user.settings.advanced.minimalMode ? "lg:col-span-12" : "lg:col-span-8", "space-y-8")}>
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-black text-foreground/20 uppercase tracking-[0.3em]">Analytics Engine</h3>
                      <div className="flex bg-foreground/[0.03] border border-card-border p-1 rounded-xl">
                        <button 
                          onClick={() => setStatsMode('week')}
                          className={cn("px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all", statsMode === 'week' ? "bg-primary text-white" : "text-foreground/30 hover:text-foreground/50")}
                        >
                          Weekly
                        </button>
                        <button 
                          onClick={() => setStatsMode('month')}
                          className={cn("px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all", statsMode === 'month' ? "bg-primary text-white" : "text-foreground/30 hover:text-foreground/50")}
                        >
                          Monthly
                        </button>
                      </div>
                    </div>
                    <StatsGrid mode={statsMode} isEmpty={habits.length === 0} />
                    <HabitList 
                      habits={habits} 
                      onToggle={handleToggleHabit} 
                      onAdd={() => {
                        const template = HABIT_TEMPLATES[Math.floor(Math.random() * HABIT_TEMPLATES.length)];
                        const newHabit: Habit = {
                          id: Date.now().toString() + Math.random().toString(),
                          name: template.name,
                          icon: template.icon,
                          color: template.color,
                          streak: 0,
                          completedToday: false
                        };
                        setHabits(prev => [...prev, newHabit]);
                      }} 
                    />
                  </div>
                  <div className={cn(user.settings.advanced.minimalMode ? 'hidden' : 'lg:col-span-4 space-y-6')}>
                    {/* === MISSIONS CARD === */}
                    <GlassCard glow="green" className="p-7 border-card-border/50 space-y-6 overflow-hidden">
                      {/* Floating accent orb */}
                      <motion.div
                        className="absolute -top-8 -right-8 w-32 h-32 bg-accent/10 rounded-full blur-[40px] pointer-events-none"
                        animate={{ scale: [1, 1.4, 1], opacity: [0.4, 0.8, 0.4] }}
                        transition={{ duration: 5, repeat: Infinity }}
                      />
                      <div className="flex items-center justify-between relative z-10">
                        <div className="flex items-center gap-3">
                          <motion.div
                            animate={{ rotate: [0, 10, -10, 0] }}
                            transition={{ duration: 3, repeat: Infinity }}
                            className="p-2.5 bg-accent/15 rounded-xl border border-accent/20"
                          >
                            <Trophy className="w-5 h-5 text-accent" />
                          </motion.div>
                          <div>
                            <h3 className="text-sm font-black text-foreground tracking-tight uppercase">Active Missions</h3>
                            <p className="text-[9px] text-foreground/30 font-bold uppercase tracking-widest">Complete for XP</p>
                          </div>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          onClick={() => setActiveTab('stats')}
                          className="text-[9px] font-black text-primary uppercase tracking-widest hover:text-primary-light transition-colors px-3 py-1.5 rounded-lg border border-primary/20 hover:border-primary/50 hover:bg-primary/5"
                        >
                          View All
                        </motion.button>
                      </div>
                      <div className="space-y-3 relative z-10">
                        {MISSIONS.map((mission, i) => (
                          <motion.div
                            key={mission.id}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1, type: 'spring' }}
                            whileHover={{ x: -4, scale: 1.01 }}
                            className="group p-5 rounded-2xl bg-foreground/[0.02] border border-card-border hover:border-accent/30 hover:bg-accent/[0.02] transition-all space-y-3 cursor-default relative overflow-hidden"
                          >
                            {/* Sweep on hover */}
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                              <motion.div
                                className="absolute inset-0"
                                style={{ background: 'linear-gradient(90deg, transparent, rgba(16,185,129,0.06), transparent)' }}
                                animate={{ x: ['-100%', '200%'] }}
                                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                              />
                            </div>
                            <div className="flex items-start justify-between gap-4 relative z-10">
                              <p className="text-sm font-bold text-foreground/60 leading-relaxed group-hover:text-foreground/90 transition-colors">{mission.description}</p>
                              {mission.completed && (
                                <motion.div animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.3, 1] }} transition={{ duration: 2, repeat: Infinity }}>
                                  <Star className="w-5 h-5 text-accent fill-accent" />
                                </motion.div>
                              )}
                            </div>
                            <div className="flex items-center justify-between relative z-10">
                              <div className="flex items-center gap-1.5">
                                <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1.5, repeat: Infinity }}>
                                  <Zap className="w-3 h-3 text-accent fill-current" />
                                </motion.div>
                                <span className="text-[10px] font-black text-accent uppercase tracking-widest">+{mission.rewardXp} XP</span>
                              </div>
                              <div className={cn('px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-[0.15em]', mission.completed ? 'bg-accent/15 text-accent border border-accent/30' : 'bg-foreground/5 text-foreground/30 border border-card-border')}>
                                {mission.completed ? '✓ Claimed' : 'Active'}
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </GlassCard>

                    {/* === 3D ORBITAL DAILY GOAL === */}
                    <GlassCard glow="purple" className="p-8 border-card-border/50 text-center space-y-6 overflow-hidden relative">
                      <motion.div
                        className="absolute -bottom-12 -left-12 w-40 h-40 bg-primary/10 rounded-full blur-[50px] pointer-events-none"
                        animate={{ scale: [1, 1.5, 1] }}
                        transition={{ duration: 6, repeat: Infinity }}
                      />
                      <p className="text-[9px] font-black text-foreground/30 uppercase tracking-[0.3em] relative z-10">Daily Resonance</p>

                      {/* 3D Orbital rings */}
                      <div className="relative inline-flex items-center justify-center" style={{ perspective: '600px' }}>
                        {/* Outer orbit ring */}
                        <motion.div
                          className="absolute w-52 h-52 rounded-full border border-primary/10"
                          style={{ rotateX: '70deg' }}
                          animate={{ rotate: 360 }}
                          transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
                        >
                          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-primary/60 rounded-full shadow-[0_0_10px_rgba(139,92,246,0.8)]" />
                        </motion.div>
                        {/* Middle orbit ring */}
                        <motion.div
                          className="absolute w-44 h-44 rounded-full border border-secondary/10"
                          style={{ rotateX: '70deg', rotateZ: '45deg' }}
                          animate={{ rotate: -360 }}
                          transition={{ duration: 9, repeat: Infinity, ease: 'linear' }}
                        >
                          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-secondary/80 rounded-full shadow-[0_0_8px_rgba(6,182,212,0.9)]" />
                        </motion.div>

                        {/* Main SVG ring */}
                        <svg className="w-40 h-40 transform -rotate-90 relative z-10">
                          <circle cx="80" cy="80" r="66" stroke="rgba(255,255,255,0.04)" strokeWidth="10" fill="transparent" />
                          {/* Glow track */}
                          <circle cx="80" cy="80" r="66" stroke="rgba(139,92,246,0.08)" strokeWidth="16" fill="transparent" />
                          {/* Progress arc */}
                          <motion.circle
                            cx="80" cy="80" r="66"
                            stroke="url(#arcGrad)"
                            strokeWidth="10"
                            fill="transparent"
                            strokeDasharray={414}
                            initial={{ strokeDashoffset: 414 }}
                            animate={{ strokeDashoffset: 414 - (414 * 0.75) }}
                            transition={{ duration: 2.5, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
                            strokeLinecap="round"
                            style={{ filter: 'drop-shadow(0 0 8px rgba(139,92,246,0.6))' }}
                          />
                          <defs>
                            <linearGradient id="arcGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                              <stop offset="0%" stopColor="#8b5cf6" />
                              <stop offset="100%" stopColor="#06b6d4" />
                            </linearGradient>
                          </defs>
                        </svg>

                        {/* Center text */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center space-y-0.5 z-10">
                          <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 1.5, type: 'spring', stiffness: 300 }}
                            className="text-4xl font-black text-foreground tracking-tighter"
                          >
                            75%
                          </motion.span>
                          <span className="text-[9px] font-black text-foreground/20 uppercase tracking-[0.2em]">Goal</span>
                        </div>
                      </div>

                      <motion.button
                        onClick={() => { triggerConfetti(); }}
                        whileHover={{ scale: 1.03, boxShadow: '0 0 30px rgba(139,92,246,0.4)' }}
                        whileTap={{ scale: 0.96 }}
                        className="w-full py-4 bg-gradient-to-r from-primary/20 to-secondary/10 border border-primary/30 rounded-2xl text-[10px] font-black text-foreground uppercase tracking-[0.2em] hover:from-primary/30 transition-all relative z-10 overflow-hidden group"
                      >
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
                          animate={{ x: ['-100%', '200%'] }}
                          transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }}
                        />
                        ⚡ Boost Momentum
                      </motion.button>
                    </GlassCard>
                  </div>
                </div>

                {/* === NEW UI: RELICS & AURA LOG === */}
                <motion.div 
                  initial={{ opacity: 0, y: 30 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  transition={{ duration: 0.6, delay: 0.2, type: 'spring' }}
                  className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8"
                  style={{ willChange: 'transform, opacity' }}
                >
                  {/* Relics Panel */}
                  <GlassCard glow="gold" className="p-8 border-card-border/50 lg:col-span-2 space-y-6 overflow-hidden relative group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[80px] rounded-full pointer-events-none transition-opacity duration-1000 group-hover:bg-primary/10" />
                    
                    <div className="flex items-center justify-between relative z-10">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-primary/10 rounded-xl border border-primary/20">
                          <Shield className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="text-sm font-black text-foreground tracking-tight uppercase">Equipped Relics</h3>
                          <p className="text-[9px] text-foreground/30 font-bold uppercase tracking-widest">Active Aura Modifiers</p>
                        </div>
                      </div>
                      <button className="text-[9px] font-black text-primary uppercase tracking-widest hover:text-primary-light transition-colors px-3 py-1.5 rounded-lg border border-primary/20 hover:border-primary/50 hover:bg-primary/5">
                        Inventory
                      </button>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 relative z-10">
                      {[
                        { name: "Crown of Focus", desc: "+10% XP on completion", icon: "👑", color: "from-amber-500/20 to-orange-500/5", border: "border-amber-500/30" },
                        { name: "Amulet of Time", desc: "Allows 1 missed day", icon: "⏳", color: "from-blue-500/20 to-cyan-500/5", border: "border-blue-500/30" },
                        { name: "Ring of Vigor", desc: "Streak multiplier active", icon: "💍", color: "from-emerald-500/20 to-green-500/5", border: "border-emerald-500/30" },
                        { name: "Void Cloak", desc: "Hides negative stats", icon: "🦹", color: "from-purple-500/20 to-fuchsia-500/5", border: "border-purple-500/30" },
                      ].map((relic, i) => (
                        <motion.div 
                          key={i}
                          whileHover={{ y: -4, scale: 1.02 }}
                          className={cn("p-4 rounded-2xl border bg-gradient-to-br cursor-pointer transition-all", relic.color, relic.border, "hover:shadow-[0_0_20px_rgba(212,175,55,0.1)]")}
                          style={{ willChange: 'transform' }}
                        >
                          <div className="text-3xl mb-3">{relic.icon}</div>
                          <div className="text-xs font-black text-foreground uppercase tracking-tight">{relic.name}</div>
                          <div className="text-[8px] font-bold text-foreground/40 uppercase tracking-widest mt-1 leading-relaxed">{relic.desc}</div>
                        </motion.div>
                      ))}
                    </div>
                  </GlassCard>

                  {/* Aura Log */}
                  <GlassCard className="p-8 border-card-border/50 space-y-6 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/5 blur-[50px] rounded-full pointer-events-none transition-opacity duration-1000 group-hover:bg-secondary/10" />
                    
                    <div className="flex items-center gap-3 relative z-10">
                      <div className="p-2.5 bg-secondary/10 rounded-xl border border-secondary/20">
                        <Activity className="w-5 h-5 text-secondary" />
                      </div>
                      <div>
                        <h3 className="text-sm font-black text-foreground tracking-tight uppercase">Aura Log</h3>
                        <p className="text-[9px] text-foreground/30 font-bold uppercase tracking-widest">Recent Transmissions</p>
                      </div>
                    </div>

                    <div className="space-y-4 relative z-10">
                      {[
                        { text: "Reached Level 5", time: "2h ago", type: "level" },
                        { text: "Morning Yoga completed", time: "5h ago", type: "habit" },
                        { text: "7-Day Streak Achieved!", time: "1d ago", type: "milestone" },
                      ].map((log, i) => (
                        <div key={i} className="flex gap-4 items-start group/log cursor-default">
                          <div className="flex flex-col items-center mt-1">
                            <div className={cn("w-2 h-2 rounded-full", log.type === 'level' ? "bg-primary shadow-[0_0_8px_rgba(139,92,246,0.8)]" : log.type === 'milestone' ? "bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]" : "bg-secondary")} />
                            {i !== 2 && <div className="w-px h-8 bg-foreground/10 my-1" />}
                          </div>
                          <div>
                            <div className="text-xs font-bold text-foreground/80 group-hover/log:text-foreground transition-colors">{log.text}</div>
                            <div className="text-[9px] font-black text-foreground/30 uppercase tracking-widest mt-0.5">{log.time}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </GlassCard>
                </motion.div>
              </>
            )}

            {activeTab === 'habits' && (
              <div className="space-y-8">
                <HabitList 
                  habits={habits} 
                  onToggle={handleToggleHabit} 
                  onAdd={() => {
                        const template = HABIT_TEMPLATES[Math.floor(Math.random() * HABIT_TEMPLATES.length)];
                        const newHabit: Habit = {
                          id: Date.now().toString() + Math.random().toString(),
                          name: template.name,
                          icon: template.icon,
                          color: template.color,
                          streak: 0,
                          completedToday: false
                        };
                        setHabits(prev => [...prev, newHabit]);
                  }} 
                />
              </div>
            )}

            {activeTab === 'stats' && (
              <div className="space-y-8">
                <StatsGrid mode={statsMode} isEmpty={habits.length === 0} />
                <GlassCard className="p-10 border-card-border relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 blur-[100px] rounded-full pointer-events-none transition-opacity duration-700 group-hover:bg-primary/10" />
                  
                  <div className="flex items-center justify-between mb-10 relative z-10">
                    <div>
                      <h3 className="text-2xl font-black text-foreground uppercase italic tracking-tighter">Performance Matrix</h3>
                      <p className="text-[10px] text-foreground/40 font-bold uppercase tracking-[0.2em] mt-1">Deep dive into your behavioral patterns</p>
                    </div>
                    <div className="p-4 bg-primary/10 rounded-2xl border border-primary/20 shadow-[0_0_20px_rgba(139,92,246,0.2)]">
                      <Zap className="w-6 h-6 text-primary" />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 relative z-10">
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <h4 className="text-[10px] font-black text-foreground/30 uppercase tracking-[0.2em] ml-1">Consistency Distribution</h4>
                      </div>
                      
                      <div className="space-y-5">
                        {habits.length > 0 ? habits.map((h, i) => (
                          <div key={h.id} className="space-y-3 group/item">
                            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest transition-colors group-hover/item:text-foreground">
                              <span className="text-foreground/70 flex items-center gap-3">
                                <span className="text-lg">{h.icon}</span> {h.name}
                              </span>
                              <span className="text-primary group-hover/item:scale-110 transition-transform origin-right">
                                {Math.min(100, Math.max(15, h.streak * 15))}%
                              </span>
                            </div>
                            <div className="h-2 rounded-full bg-foreground/[0.05] overflow-hidden relative">
                              <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${Math.min(100, Math.max(15, h.streak * 15))}%` }}
                                transition={{ duration: 1, delay: i * 0.1, ease: "easeOut" }}
                                className={cn("absolute top-0 left-0 h-full rounded-full shadow-lg", "bg-gradient-to-r from-primary to-secondary")}
                              />
                            </div>
                          </div>
                        )) : (
                          <div className="py-8 text-center bg-foreground/[0.02] border border-card-border border-dashed rounded-2xl">
                            <p className="text-[10px] font-black text-foreground/20 uppercase tracking-[0.2em]">Initiate sequence to gather data</p>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="space-y-6">
                      <h4 className="text-[10px] font-black text-foreground/30 uppercase tracking-[0.2em] ml-1">AI Behavioral Insights</h4>
                      <div className="grid grid-cols-2 gap-5">
                        <div className="p-6 bg-foreground/[0.02] border border-card-border rounded-2xl hover:bg-foreground/[0.05] hover:border-foreground/20 transition-all group/card">
                          <div className="text-3xl font-black text-foreground group-hover/card:scale-105 transition-transform origin-left">Morning</div>
                          <div className="text-[9px] font-black text-foreground/40 uppercase tracking-widest mt-2">Peak Momentum Time</div>
                        </div>
                        <div className="p-6 bg-foreground/[0.02] border border-card-border rounded-2xl hover:bg-foreground/[0.05] hover:border-foreground/20 transition-all group/card">
                          <div className="text-3xl font-black text-foreground group-hover/card:scale-105 transition-transform origin-left">Tuesday</div>
                          <div className="text-[9px] font-black text-foreground/40 uppercase tracking-widest mt-2">Highest Completion Day</div>
                        </div>
                        <div className="p-6 bg-primary/10 border border-primary/30 rounded-2xl col-span-2 relative overflow-hidden group/insight hover:shadow-[0_0_30px_rgba(139,92,246,0.15)] transition-all cursor-pointer">
                           <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/20 to-transparent -translate-x-full group-hover/insight:translate-x-full transition-transform duration-[1500ms] ease-out" />
                           <div className="flex items-center gap-3 mb-3 relative z-10">
                             <div className="p-1.5 bg-primary/20 rounded-lg">
                               <Trophy className="w-4 h-4 text-primary" />
                             </div>
                             <span className="text-xs font-black text-primary uppercase tracking-[0.2em]">Neurological Pattern Detected</span>
                           </div>
                           <p className="text-sm text-foreground/70 font-medium leading-relaxed relative z-10 group-hover/insight:text-foreground/90 transition-colors">
                             Your streak remains 40% more resilient when you complete your first habit within 90 minutes of waking up. Leverage early momentum to anchor your day.
                           </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </GlassCard>
              </div>
            )}

            {activeTab === 'profile' && (
              <div className="max-w-2xl mx-auto space-y-8">
                <GlassCard className="p-10 border-white/[0.08] text-center space-y-6">
                  <div className="relative inline-block">
                    <div className="absolute -top-4 -right-4 w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-2xl shadow-glow-purple border border-white/20">
                      {user.emoji || '✨'}
                    </div>
                    <img src={user.avatar} className="w-32 h-32 rounded-3xl mx-auto border-4 border-primary shadow-2xl" alt="Profile" />
                  </div>
                  <div className="space-y-2">
                    <h2 className="text-4xl font-black text-white uppercase italic">{user.name}</h2>
                    <div className="flex items-center justify-center gap-3">
                      <span className="px-3 py-1 bg-white/5 rounded-lg text-[10px] font-black text-white/40 uppercase tracking-widest">{user.gender || 'Not Set'}</span>
                      <span className="px-3 py-1 bg-white/5 rounded-lg text-[10px] font-black text-white/40 uppercase tracking-widest">{user.age || '??'} Years Old</span>
                    </div>
                    <p className="text-primary font-black tracking-widest text-sm uppercase pt-2">Level {user.level} Elite Disciplinarian</p>
                  </div>
                  <div className="grid grid-cols-3 gap-4 pt-6 text-left">
                    <div className="p-4 bg-white/[0.03] rounded-2xl border border-white/[0.05]">
                      <div className="text-2xl font-black text-white underline underline-offset-8 decoration-primary/30">{habits.length}</div>
                      <div className="text-[8px] font-black text-white/30 uppercase tracking-[0.2em] mt-2">Active Habits</div>
                    </div>
                    <div className="p-4 bg-white/[0.03] rounded-2xl border border-white/[0.05]">
                      <div className="text-2xl font-black text-white underline underline-offset-8 decoration-primary/30">{user.xp}</div>
                      <div className="text-[8px] font-black text-white/30 uppercase tracking-[0.2em] mt-2">Current XP</div>
                    </div>
                    <div className="p-4 bg-white/[0.03] rounded-2xl border border-white/[0.05]">
                      <div className="text-2xl font-black text-white underline underline-offset-8 decoration-primary/30">{user.level}</div>
                      <div className="text-[8px] font-black text-white/30 uppercase tracking-[0.2em] mt-2">Power Level</div>
                    </div>
                  </div>

                  <div className="pt-8 space-y-4 text-left">
                    <h4 className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] ml-1">Notification Settings</h4>
                    <div className="p-6 bg-white/[0.03] border border-white/[0.08] rounded-2xl space-y-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-black text-white uppercase tracking-tight">Gmail Integration</p>
                          <p className="text-[10px] text-white/30 font-bold">Receive aura reports at your Gmail address</p>
                        </div>
                        <input 
                          type="checkbox" 
                          className="w-10 h-5 appearance-none bg-white/10 rounded-full checked:bg-primary transition-all cursor-pointer relative after:content-[''] after:absolute after:top-1 after:left-1 after:w-3 after:h-3 after:bg-white after:rounded-full checked:after:translate-x-5 after:transition-all"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[8px] font-black text-white/20 uppercase tracking-widest">Connected Email</label>
                        <input 
                          type="email" 
                          placeholder="yourname@gmail.com"
                          className="w-full bg-white/[0.05] border border-white/10 rounded-xl py-3 px-4 text-xs text-white focus:outline-none focus:border-primary/50"
                        />
                      </div>
                      <button 
                        onClick={() => alert("Notification test sent to your Gmail!")}
                        className="w-full py-3 bg-primary/20 border border-primary/40 text-primary text-[8px] font-black uppercase tracking-[0.2em] rounded-xl hover:bg-primary/30 transition-all"
                      >
                        Send Test Notification
                      </button>
                    </div>
                  </div>

                  <button 
                    onClick={() => setIsSettingUp(true)}
                    className="w-full py-4 bg-white/[0.03] border border-white/[0.08] text-white/40 hover:text-white text-[10px] font-black rounded-2xl transition-all uppercase tracking-widest"
                  >
                    Edit Character Profile
                  </button>
                  
                  <button 
                    onClick={handleHardReset}
                    className="w-full py-4 bg-red-500/10 border border-red-500/20 text-red-500 font-black rounded-2xl hover:bg-red-500/30 transition-all uppercase tracking-widest text-[8px]"
                  >
                    Danger Zone: Hard Reset All Data
                  </button>

                  <button 
                    onClick={onLogout} 
                    className="w-full py-4 bg-white/[0.03] border border-white/[0.08] text-white/60 font-black rounded-2xl hover:bg-white/[0.08] transition-all uppercase tracking-widest text-[10px]"
                  >
                    Sign Out of Aura
                  </button>
                </GlassCard>
              </div>
            )}

            {activeTab === 'settings' && (
              <SettingsView user={user} onUpdate={(updatedFields) => setUser(prev => ({ ...prev, ...updatedFields }))} />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Profile Setup Onboarding Overlay */}
      <AnimatePresence>
        {isSettingUp && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-2xl p-6"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="max-w-lg w-full"
            >
              <GlassCard className="p-10 space-y-8 border-primary/20 shadow-glow-purple/20">
                <div className="text-center space-y-2">
                  <h2 className="text-4xl font-black text-white tracking-tighter uppercase italic">Initialize Aura</h2>
                  <p className="text-white/30 text-xs font-bold uppercase tracking-[0.2em]">Tell us about yourself to begin your journey</p>
                </div>

                <div className="space-y-6">
                  {/* Gender Selection */}
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] ml-1">Gender Identity</label>
                    <div className="grid grid-cols-3 gap-3">
                      {['male', 'female', 'other'].map((g) => (
                        <button
                          key={g}
                          onClick={() => setUser(prev => ({ ...prev, gender: g as any, avatar: g === 'female' ? femaleAvatars[0] : maleAvatars[0] }))}
                          className={cn(
                            "py-4 rounded-2xl border font-black text-[10px] tracking-widest uppercase transition-all",
                            user.gender === g 
                              ? "bg-primary border-primary text-white shadow-glow-purple/50" 
                              : "bg-white/[0.03] border-white/[0.08] text-white/20 hover:border-white/20"
                          )}
                        >
                          {g}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Character Avatar Selection */}
                  {user.gender && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="space-y-3"
                    >
                      <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] ml-1">Select Character Appearance (15 Options)</label>
                      <div className="grid grid-cols-5 gap-3 max-h-40 overflow-y-auto p-2 glass-dark rounded-2xl border border-white/5 custom-scrollbar">
                        {currentAvatars.map((av, idx) => (
                          <button
                            key={av}
                            onClick={() => setUser(prev => ({ ...prev, avatar: av }))}
                            className={cn(
                              "relative rounded-xl overflow-hidden border-2 transition-all p-1",
                              user.avatar === av ? "border-primary bg-primary/10" : "border-transparent bg-white/5"
                            )}
                          >
                            <img src={av} alt={`Avatar ${idx}`} className="w-full h-auto" />
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* Age & Emoji */}
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] ml-1">Your Age</label>
                      <input 
                        type="number" 
                        placeholder="21"
                        onChange={(e) => setUser(prev => ({ ...prev, age: parseInt(e.target.value) }))}
                        className="w-full bg-white/[0.03] border border-white/[0.08] rounded-2xl py-4 px-6 text-white text-xl font-black focus:outline-none focus:border-primary/50 transition-all"
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] ml-1">Choose Aura Icon</label>
                      <div className="flex gap-2">
                        {['⚡', '🔥', '👑', '🌌'].map(e => (
                          <button
                            key={e}
                            onClick={() => setUser(prev => ({ ...prev, emoji: e }))}
                            className={cn(
                              "w-12 h-12 rounded-xl flex items-center justify-center text-xl transition-all",
                              user.emoji === e ? "bg-primary/20 border border-primary/50 scale-110" : "bg-white/[0.03] border border-white/[0.08]"
                            )}
                          >
                            {e}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <button 
                    disabled={!user.gender || !user.age || !user.emoji}
                    onClick={() => handleSetupComplete({})}
                    className="w-full py-5 bg-white text-black font-black rounded-2xl text-[10px] tracking-[0.3em] uppercase hover:scale-[1.02] active:scale-[0.98] disabled:opacity-20 disabled:scale-100 transition-all shadow-xl mt-4"
                  >
                    Enter the Void
                  </button>
                </div>
              </GlassCard>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Level Up Celebration - Enhanced Immersive UI */}
      <AnimatePresence>
        {showLevelUp && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center"
          >
            <div className="absolute inset-0 bg-black/80 backdrop-blur-xl" />
            
            {/* Particle Effects (Simplified with CSS) */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ y: '100vh', x: Math.random() * 100 + 'vw', opacity: 1 }}
                  animate={{ y: '-10vh', opacity: 0 }}
                  transition={{ duration: 2 + Math.random() * 2, repeat: Infinity, delay: Math.random() * 2 }}
                  className="absolute w-1 h-1 bg-primary rounded-full blur-[1px]"
                />
              ))}
            </div>

            <motion.div
              initial={{ scale: 0.5, y: 100, rotate: -10 }}
              animate={{ scale: 1, y: 0, rotate: 0 }}
              exit={{ scale: 1.2, opacity: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="relative z-10"
            >
              <GlassCard className="p-16 text-center space-y-10 border-primary/40 shadow-[0_0_100px_-20px_rgba(139,92,246,0.5)] max-w-lg" hover={false}>
                <div className="relative inline-block">
                  <div className="absolute inset-0 bg-primary blur-3xl opacity-30 animate-pulse" />
                  <Trophy className="w-32 h-32 text-primary mx-auto relative z-10 drop-shadow-[0_0_30px_rgba(139,92,246,0.8)]" />
                </div>
                
                <div className="space-y-4">
                  <h2 className="text-6xl font-black text-white tracking-tighter uppercase italic">Level Up</h2>
                  <div className="h-1 w-24 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto" />
                  <p className="text-2xl text-primary font-black tracking-widest uppercase">Rank: Aura Master</p>
                </div>
                
                <p className="text-white/40 font-medium text-lg">You've reached Level {user.level}. <br /> New rewards have been unlocked.</p>
                
                <button 
                  onClick={() => setShowLevelUp(false)}
                  className="px-12 py-4 bg-primary text-white font-black rounded-2xl shadow-glow-purple transition-all hover:scale-105 active:scale-95 uppercase tracking-widest text-sm"
                >
                  Claim Rewards
                </button>
              </GlassCard>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
