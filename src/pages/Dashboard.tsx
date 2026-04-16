import { useState, useEffect } from 'react';
import { Sidebar } from '@/src/components/dashboard/Sidebar';
import { HabitList } from '@/src/components/dashboard/HabitList';
import { StatsGrid } from '@/src/components/dashboard/StatsGrid';
import { SettingsView } from '@/src/components/dashboard/SettingsView';
import { NotificationPanel } from '@/src/components/dashboard/NotificationPanel';
import { ProgressBar } from '@/src/components/ui/ProgressBar';
import { GlassCard } from '@/src/components/ui/GlassCard';
import { Habit, User, Mission, Notification } from '@/src/types';
import { Bell, Search, Trophy, Star, Zap, BellOff } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/src/lib/utils';
import confetti from 'canvas-confetti';

const INITIAL_HABITS: Habit[] = [];

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
    <div className="min-h-screen bg-background flex">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} onLogout={onLogout} />
      
      <main className="flex-1 ml-64 p-10 space-y-10 relative">
        <div className="absolute inset-0 bg-mesh opacity-30 pointer-events-none" />

        {/* Top Navbar */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-black tracking-tighter text-foreground uppercase italic">{activeTab}</h1>
            <p className="text-foreground/30 text-xs font-bold uppercase tracking-[0.2em]">Dashboard / {activeTab}</p>
          </div>

          <div className="flex items-center gap-8">
            <div className="flex items-center gap-4 bg-foreground/[0.03] border border-card-border px-5 py-2.5 rounded-2xl w-80 focus-within:border-primary/50 transition-all group">
              <Search className="w-4 h-4 text-foreground/20 group-focus-within:text-primary transition-colors" />
              <input 
                type="text" 
                placeholder="Search habits..." 
                className="bg-transparent border-none focus:outline-none text-foreground text-xs font-medium w-full"
              />
            </div>

            <div className="flex items-center gap-6">
              <div className="relative">
                <button 
                  onClick={() => setIsNotifOpen(!isNotifOpen)}
                  className={cn(
                    "relative p-2.5 bg-foreground/[0.03] border border-card-border rounded-xl transition-all",
                    !user.settings.reminders.enabled ? "text-foreground/10" : "text-foreground/40 hover:text-foreground hover:scale-110 active:scale-95"
                  )}
                >
                  {user.settings.reminders.enabled ? (
                    <>
                      <motion.div
                        animate={unreadCount > 0 ? { rotate: [0, -10, 10, -10, 10, 0] } : {}}
                        transition={{ repeat: Infinity, duration: 2, repeatDelay: 1 }}
                      >
                        <Bell className="w-5 h-5" />
                      </motion.div>
                      {unreadCount > 0 && (
                        <motion.div 
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-background shadow-lg shadow-red-500/20" 
                        />
                      )}
                    </>
                  ) : (
                    <BellOff className="w-5 h-5" />
                  )}
                </button>

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
              
              <div className="flex items-center gap-4 pl-6 border-l border-card-border">
                <div className="text-right">
                  <div className="text-xs font-black text-foreground uppercase tracking-tight">{user.name}</div>
                  <div className="text-[10px] font-bold text-primary-light uppercase tracking-widest">Elite Tier</div>
                </div>
                <div 
                  onClick={() => setActiveTab('profile')}
                  className="relative group cursor-pointer"
                >
                  <div className="absolute inset-0 bg-primary/20 rounded-xl blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
                  <img src={user.avatar} alt="Avatar" className="relative w-11 h-11 rounded-xl border border-card-border shadow-lg" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-10"
          >
            {activeTab === 'dashboard' && (
              <>
                {/* Level Progress Bar - Conditionally Rendered */}
                {user.settings.gamification.showLevels && (
                  <GlassCard className="p-6 border-card-border flex items-center gap-8 shadow-glow-purple/10" hover={false}>
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <div className="absolute inset-0 bg-primary/40 blur-xl animate-pulse" />
                        <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-black text-2xl shadow-2xl border border-white/20">
                          {user.level}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-[10px] font-black text-foreground/30 uppercase tracking-[0.2em]">Current Level</div>
                        <div className="text-lg font-black text-foreground uppercase tracking-tight">Aura Master</div>
                      </div>
                    </div>
                    {user.settings.gamification.showXp && (
                      <div className="flex-1 space-y-3">
                        <ProgressBar value={user.xp} max={user.xpToNextLevel} showLabel color="bg-gradient-to-r from-primary via-primary-light to-secondary" />
                      </div>
                    )}
                    <div className="text-right space-y-1">
                      <div className="text-[10px] font-black text-foreground/30 uppercase tracking-[0.2em]">Next Level</div>
                      <div className="text-xl font-black text-foreground tracking-tighter">{user.xpToNextLevel - user.xp} <span className="text-xs text-foreground/40">XP</span></div>
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
                        const names = ['Morning Yoga', 'Deep Work', 'Hydrate', 'Journaling'];
                        const icons = ['🧘', '💻', '🚰', '✍️'];
                        const colors = ['bg-emerald-500', 'bg-indigo-500', 'bg-sky-500', 'bg-amber-500'];
                        const idx = Math.floor(Math.random() * names.length);
                        const newHabit: Habit = {
                          id: Date.now().toString(),
                          name: names[idx],
                          icon: icons[idx],
                          color: colors[idx],
                          streak: 0,
                          completedToday: false
                        };
                        setHabits(prev => [...prev, newHabit]);
                      }} 
                    />
                  </div>
                  <div className={cn(user.settings.advanced.minimalMode ? "hidden" : "lg:col-span-4 space-y-8")}>
                    <GlassCard className="p-8 border-card-border space-y-8">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2.5 bg-accent/10 rounded-xl">
                            <Trophy className="w-5 h-5 text-accent" />
                          </div>
                          <h3 className="text-lg font-black text-foreground tracking-tight uppercase">Missions</h3>
                        </div>
                        <button onClick={() => setActiveTab('stats')} className="text-[10px] font-black text-primary uppercase tracking-widest hover:text-primary-light transition-colors">View All</button>
                      </div>
                      <div className="space-y-4">
                        {MISSIONS.map(mission => (
                          <div key={mission.id} className="group p-5 rounded-2xl bg-foreground/[0.02] border border-card-border hover:border-foreground/[0.1] transition-all space-y-4">
                            <div className="flex items-start justify-between gap-4">
                              <p className="text-sm font-bold text-foreground/70 leading-relaxed">{mission.description}</p>
                              {mission.completed && <Star className="w-5 h-5 text-accent fill-accent animate-pulse" />}
                            </div>
                            <div className="flex items-center justify-between pt-2">
                              <div className="flex items-center gap-2">
                                <Zap className="w-3 h-3 text-accent fill-current" />
                                <span className="text-[10px] font-black text-accent uppercase tracking-widest">+{mission.rewardXp} XP</span>
                              </div>
                              <div className={cn("px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-[0.15em]", mission.completed ? "bg-accent/10 text-accent border border-accent/20" : "bg-foreground/5 text-foreground/30 border border-card-border")}>{mission.completed ? 'Claimed' : 'Active'}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </GlassCard>
                    <GlassCard className="p-8 border-card-border text-center space-y-8 overflow-hidden relative">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-[60px] rounded-full" />
                      <div className="relative inline-flex items-center justify-center">
                        <svg className="w-40 h-40 transform -rotate-90">
                          <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-foreground/[0.03]" />
                          <motion.circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="12" fill="transparent" strokeDasharray={440} initial={{ strokeDashoffset: 440 }} animate={{ strokeDashoffset: 440 - (440 * 0.75) }} transition={{ duration: 2, ease: [0.22, 1, 0.36, 1] }} strokeLinecap="round" className="text-primary drop-shadow-[0_0_12px_rgba(139,92,246,0.2)]" />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center space-y-1">
                          <span className="text-4xl font-black text-foreground tracking-tighter">75%</span>
                          <span className="text-[10px] font-black text-foreground/20 uppercase tracking-[0.2em]">Daily Goal</span>
                        </div>
                      </div>
                      <button onClick={() => { triggerConfetti(); alert("Momentum Boosted!"); }} className="w-full py-4 bg-foreground/[0.03] border border-card-border rounded-2xl text-[10px] font-black text-foreground uppercase tracking-[0.2em] hover:bg-foreground/[0.08] transition-all">Boost Progress</button>
                    </GlassCard>
                  </div>
                </div>
              </>
            )}

            {activeTab === 'habits' && (
              <div className="space-y-8">
                <HabitList 
                  habits={habits} 
                  onToggle={handleToggleHabit} 
                  onAdd={() => {
                    const names = ['Deep Work', 'Hydrate', 'Journaling'];
                    const icons = ['💻', '🚰', '✍️'];
                    const idx = Math.floor(Math.random() * names.length);
                    setHabits(prev => [...prev, { id: Date.now().toString(), name: names[idx], icon: icons[idx], color: 'bg-primary', streak: 0, completedToday: false }]);
                  }} 
                />
              </div>
            )}

            {activeTab === 'stats' && (
              <div className="space-y-8">
                <StatsGrid mode={statsMode} isEmpty={habits.length === 0} />
                <GlassCard className="p-10 border-white/[0.08] h-[400px] flex items-center justify-center">
                  <p className="text-white/20 font-black italic uppercase tracking-widest text-2xl">Advanced Analytics Engine Loading...</p>
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
