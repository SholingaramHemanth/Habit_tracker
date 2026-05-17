import { useState, useEffect, useMemo } from 'react';
import { Sidebar } from '@/src/components/dashboard/Sidebar';
import { HabitList } from '@/src/components/dashboard/HabitList';
import { StatsGrid } from '@/src/components/dashboard/StatsGrid';
import { SettingsView } from '@/src/components/dashboard/SettingsView';
import { NotificationPanel } from '@/src/components/dashboard/NotificationPanel';
import { AchievementBadges } from '@/src/components/dashboard/AchievementBadges';
import { WeeklyReport } from '@/src/components/dashboard/WeeklyReport';
import { SkillTree } from '@/src/components/dashboard/SkillTree';
import { ItemShop } from '@/src/components/dashboard/ItemShop';
import { BossBattle } from '@/src/components/dashboard/BossBattle';
import { DailyBounties } from '@/src/components/dashboard/DailyBounties';
import { CompanionSystem } from '@/src/components/dashboard/CompanionSystem';
import { MoodScrolls } from '@/src/components/dashboard/MoodScrolls';
import { CursesTracker } from '@/src/components/dashboard/CursesTracker';
import { Grimoire } from '@/src/components/dashboard/Grimoire';
import { ProgressBar } from '@/src/components/ui/ProgressBar';
import { GlassCard } from '@/src/components/ui/GlassCard';
import { Habit, User, Mission, Notification, Curse } from '@/src/types';
import { Bell, Search, Trophy, Star, Zap, BellOff, Shield, BookOpen, Clock, Activity, Hexagon } from 'lucide-react';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'motion/react';
import { cn } from '@/src/lib/utils';
import { useTheme } from '@/src/context/ThemeContext';
import { playLevelUp, playButtonClick, playToggle } from '@/src/lib/sounds';
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

const REALM_BACKGROUNDS = {
  light: 'https://images.unsplash.com/photo-1542224566-6e85f2e6772f?q=80&w=2500&auto=format&fit=crop',
  dark: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=2500&auto=format&fit=crop',
  void: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=2500&auto=format&fit=crop', // Dark starry/galaxy
  forest: 'https://images.unsplash.com/photo-1448375240586-882707db888b?q=80&w=2500&auto=format&fit=crop', // Elven forest
  forge: 'https://images.unsplash.com/photo-1536640712-4d4c36ef0e47?q=80&w=2500&auto=format&fit=crop' // Molten lava/forge
};

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
  gold: 0,
  skillPoints: 0,
  unlockedPerks: [],
  rpgClass: 'warrior',
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
  const { theme } = useTheme();
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

  const [missions, setMissions] = useState<Mission[]>(() => {
    const saved = localStorage.getItem('aura_missions');
    if (saved) return JSON.parse(saved);
    return [
      { id: 'b1', type: 'bounty', description: 'Drink 2L of water', rewardXp: 50, completed: false },
      { id: 'b2', type: 'bounty', description: 'Meditate for 10 minutes', rewardXp: 75, completed: false },
      { id: 'boss1', type: 'boss', description: 'Sloth Demon', rewardXp: 500, completed: false, bossHp: 500, bossMaxHp: 500 }
    ];
  });

  const [curses, setCurses] = useState<Curse[]>(() => {
    const saved = localStorage.getItem('aura_curses');
    return saved ? JSON.parse(saved) : [];
  });

  const bgImage = REALM_BACKGROUNDS[user.settings.realm as keyof typeof REALM_BACKGROUNDS] || REALM_BACKGROUNDS[theme as 'dark' | 'light'] || REALM_BACKGROUNDS.dark;
  
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
    localStorage.setItem('aura_missions', JSON.stringify(missions));
  }, [missions]);

  useEffect(() => {
    localStorage.setItem('aura_curses', JSON.stringify(curses));
  }, [curses]);

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

  const handleRestoreCompanion = () => {
    setUser(u => {
      if (!u.companion) return u;
      return {
        ...u,
        companion: {
          ...u.companion,
          hunger: 100
        }
      };
    });
  };

  const handleToggleHabit = (id: string) => {
    setHabits(prev => prev.map(h => {
      if (h.id === id) {
        const newState = !h.completedToday;
        if (newState) {
          // RPG Mechanics
          let baseXp = 25;
          if (user.unlockedPerks.includes('m1')) baseXp += 2; // Mystic: Astral Link
          if (user.unlockedPerks.includes('w1') && h.streak > 0) baseXp = Math.floor(baseXp * 1.1); // Warrior: Iron Resolve
          if (user.unlockedPerks.includes('s1') && new Date().getHours() < 9) baseXp += 5; // Sorceress: Arcane Focus

          let goldEarned = 10;
          if (user.unlockedPerks.includes('m3')) goldEarned = Math.floor(goldEarned * 1.2); // Mystic: Aura Bloom
          if (user.companion && user.companion.type === 'wolf') goldEarned = Math.floor(goldEarned * 1.1); // Companion Cosmic Path

          const newXp = user.xp + baseXp;
          let levelUp = false;
          let newLevel = user.level;
          let finalXp = newXp;

          if (newXp >= user.xpToNextLevel) {
            newLevel++;
            finalXp = newXp - user.xpToNextLevel;
            levelUp = true;
          }

          // Companion feeding/XP logic
          let updatedCompanion = user.companion;
          if (updatedCompanion) {
            let petXp = updatedCompanion.xp + 10;
            let petLevel = updatedCompanion.level;
            if (petXp >= updatedCompanion.xpToNextLevel) {
              petLevel++;
              petXp = petXp - updatedCompanion.xpToNextLevel;
            }
            updatedCompanion = {
              ...updatedCompanion,
              level: petLevel,
              xp: petXp,
              hunger: Math.min(100, updatedCompanion.hunger + 5)
            };
          }

          setUser(u => ({ 
            ...u, 
            level: newLevel, 
            xp: finalXp, 
            gold: u.gold + goldEarned, 
            skillPoints: levelUp ? u.skillPoints + 1 : u.skillPoints,
            companion: updatedCompanion
          }));

          if (levelUp) {
            setShowLevelUp(true);
            triggerConfetti();
            playLevelUp();
            setTimeout(() => setShowLevelUp(false), 5000);
          }

          // Deal Boss Damage
          setMissions(prevMissions => prevMissions.map(m => {
            if (m.type === 'boss' && m.bossHp && m.bossHp > 0 && !m.completed) {
              let damage = user.unlockedPerks.includes('w3') ? 20 : 10; // Warrior: Berserker
              if (user.companion && user.companion.type === 'dragon') damage = Math.floor(damage * 1.05); // Companion Dwarven Might
              const newHp = Math.max(0, m.bossHp - damage);
              if (newHp === 0) {
                // Boss Defeated!
                setUser(u => ({ ...u, xp: u.xp + m.rewardXp, gold: u.gold + 100 }));
                return { ...m, bossHp: newHp, completed: true };
              }
              return { ...m, bossHp: newHp };
            }
            return m;
          }));

          // Cleanse linked active curses
          setCurses(prevCurses => prevCurses.map(c => {
            if (c.cleansingHabitId === id && c.active) {
              return { ...c, active: false };
            }
            return c;
          }));

        } else {
          // Un-toggling habit (taking damage from boss)
          setMissions(prevMissions => prevMissions.map(m => {
            if (m.type === 'boss' && m.bossHp && !m.completed) {
              const damage = 15; // Boss counter-attack
              // In a real app we might subtract user HP here, but we will heal the boss for simplicity
              return { ...m, bossHp: Math.min(m.bossMaxHp || 500, m.bossHp + damage) };
            }
            return m;
          }));

          // Reactivate linked curses
          setCurses(prevCurses => prevCurses.map(c => {
            if (c.cleansingHabitId === id && !c.active) {
              return { ...c, active: true };
            }
            return c;
          }));
        }
        return { ...h, completedToday: newState, streak: newState ? h.streak + 1 : Math.max(0, h.streak - 1) };
      }
      return h;
    }));
  };

  const handleCompleteBounty = (id: string) => {
    setMissions(prev => prev.map(m => {
      if (m.id === id && !m.completed) {
        setUser(u => ({ ...u, xp: u.xp + m.rewardXp, gold: u.gold + 25 }));
        return { ...m, completed: true };
      }
      return m;
    }));
  };

  const handleUnlockPerk = (perkId: string) => {
    setUser(u => ({
      ...u,
      unlockedPerks: [...u.unlockedPerks, perkId],
      skillPoints: u.skillPoints - 1 // Simple cost assumption for now
    }));
  };

  const handleSpendGold = (amount: number, item?: any) => {
    setUser(u => {
      let updatedUser = { ...u, gold: Math.max(0, u.gold - amount) };
      
      if (item) {
        if (item.id === 'avatar_dragon') {
          updatedUser.avatar = 'https://api.dicebear.com/7.x/pixel-art/svg?seed=dragon&scale=120';
        } else if (item.id === 'avatar_void') {
          updatedUser.avatar = 'https://api.dicebear.com/7.x/identicon/svg?seed=void&scale=120';
        } else if (item.id === 'sigil_crown') {
          // Prepend crown to user name if not already crowned
          if (!updatedUser.name.startsWith('👑')) {
            updatedUser.name = `👑 ${updatedUser.name}`;
          }
        } else if (item.id === 'theme_elven') {
          updatedUser.settings = {
            ...updatedUser.settings,
            realm: 'forest'
          };
        }
      }
      
      return updatedUser;
    });
  };

  const handleAddCustomReward = (reward: any) => {
    // Already handled locally in ItemShop, but can sync to User if needed
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
          className={cn("absolute inset-[-10%] w-[120%] h-[120%] bg-cover bg-center", theme === 'dark' ? "opacity-60 brightness-110" : "opacity-30 brightness-100 saturate-75")}
          style={{ backgroundImage: `url(${bgImage})`, willChange: 'transform' }}
          animate={{ rotateX: [2, -2, 2], rotateY: [-3, 3, -3], scale: [1, 1.1, 1], z: [0, 50, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
        />
        {/* Vignette overlay — theme-aware */}
        <div className={cn("absolute inset-0", theme === 'dark' ? "bg-gradient-to-t from-background via-background/75 to-transparent" : "bg-gradient-to-t from-background via-background/85 to-background/40")} />
        <div className="absolute inset-0" style={{ background: theme === 'dark' ? 'radial-gradient(ellipse at center, transparent 40%, rgba(6,4,9,0.5) 100%)' : 'radial-gradient(ellipse at center, transparent 50%, rgba(200,180,150,0.15) 100%)' }} />
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
          <div className="space-y-1 relative">
            <motion.div className="absolute -left-10 -top-10 w-32 h-32 bg-primary/20 blur-[40px] rounded-full pointer-events-none" animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.6, 0.3] }} transition={{ duration: 4, repeat: Infinity }} />
            <div className="flex items-center gap-4 relative z-10">
              {/* Rotating gold diamond */}
              <div className="relative w-3 h-3 flex items-center justify-center">
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                  className="absolute inset-0 border border-primary/50"
                  style={{ boxShadow: '0 0 10px rgba(139,92,246,0.6)' }}
                />
                <motion.div
                  animate={{ rotate: [0, -360] }}
                  transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
                  className="w-2 h-2 bg-secondary"
                  style={{ boxShadow: '0 0 10px rgba(6,182,212,0.9)' }}
                />
              </div>
              <h1
                className="text-3xl font-black uppercase tracking-[0.25em] text-aura-gradient"
                style={{ fontFamily: 'Cinzel, serif', filter: theme === 'dark' ? 'drop-shadow(0 0 20px rgba(212,175,55,0.3))' : 'none' }}
              >
                {activeTab}
              </h1>
            </div>
            <p className={cn("text-[10px] font-black uppercase tracking-[0.4em] drop-shadow-md relative z-10", theme === 'dark' ? 'text-foreground/40' : 'text-foreground/50')} style={{ fontFamily: 'Cinzel, serif' }}>
              Aura Sanctum <span className="mx-2 text-primary/50">✦</span> {activeTab}
            </p>
          </div>

          <div className="flex items-center gap-6 relative z-10">
            {/* Search */}
            <motion.div
              className={cn("flex items-center gap-3 px-6 py-3.5 rounded-2xl w-80 focus-within:shadow-[0_0_30px_rgba(212,175,55,0.25)] transition-all group relative overflow-hidden",
                theme === 'dark' ? '' : 'shadow-sm')}
              style={{
                background: theme === 'dark' ? 'linear-gradient(135deg, rgba(10,6,15,0.8), rgba(20,10,30,0.9))' : 'linear-gradient(135deg, rgba(255,252,245,0.9), rgba(250,245,235,0.95))',
                border: theme === 'dark' ? '1px solid rgba(212,175,55,0.3)' : '1px solid rgba(184,134,11,0.25)',
              }}
            >
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10 pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary to-transparent scale-x-0 group-focus-within:scale-x-100 transition-transform duration-500 origin-center" />
              <Search className={cn("w-4 h-4 transition-colors relative z-10 group-focus-within:text-primary", theme === 'dark' ? '' : 'text-secondary/60')} style={theme === 'dark' ? { color: 'rgba(212,175,55,0.5)' } : undefined} />
              <input
                type="text"
                placeholder="Search quests & lore..."
                className={cn("bg-transparent border-none focus:outline-none text-[11px] font-bold w-full relative z-10 tracking-widest", theme === 'dark' ? 'placeholder:text-foreground/30' : 'placeholder:text-foreground/40 text-foreground')}
                style={theme === 'dark' ? { color: 'rgba(232,213,176,0.9)', fontFamily: 'Cinzel, serif' } : { fontFamily: 'Cinzel, serif' }}
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
                          Ready to <span className="text-aura-gradient">Conquer</span>?
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
                          <div className="absolute inset-0 bg-primary/40 blur-[30px] group-hover/level:bg-secondary/50 transition-colors duration-700 animate-pulse" />
                          <div className="relative w-24 h-24 flex items-center justify-center drop-shadow-[0_0_20px_rgba(139,92,246,0.4)]">
                            <motion.svg 
                              className="absolute inset-0 w-full h-full text-primary/30" 
                              viewBox="0 0 100 100" 
                              animate={{ rotate: 360 }} 
                              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                            >
                              <polygon points="50 3 93 25 93 75 50 97 7 75 7 25" fill="none" stroke="currentColor" strokeWidth="2" />
                              <polygon points="50 10 85 30 85 70 50 90 15 70 15 30" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" />
                            </motion.svg>
                            <motion.svg 
                              className="absolute inset-0 w-full h-full text-secondary/40" 
                              viewBox="0 0 100 100" 
                              animate={{ rotate: -360 }} 
                              transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
                            >
                              <polygon points="50 15 80 32 80 68 50 85 20 68 20 32" fill="none" stroke="currentColor" strokeWidth="1" />
                            </motion.svg>
                            <div className="relative w-16 h-16 bg-gradient-to-br from-primary via-secondary to-accent flex items-center justify-center shadow-[inset_0_0_20px_rgba(255,255,255,0.4)] overflow-hidden" style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}>
                              <motion.div 
                                className="absolute inset-0 bg-gradient-to-t from-transparent via-white/40 to-transparent translate-y-full group-hover/level:-translate-y-full transition-transform duration-700 ease-out" 
                              />
                              <span className="relative z-10 text-white font-black text-3xl drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]" style={{ fontFamily: 'Cinzel, serif' }}>{user.level}</span>
                            </div>
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
                      onDelete={(id) => setHabits(prev => prev.filter(h => h.id !== id))}
                      onEdit={(id, newName) => setHabits(prev => prev.map(h => h.id === id ? { ...h, name: newName } : h))}
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
                      <button 
                        onClick={() => alert("Opening Inventory...")}
                        className="text-[9px] font-black text-primary uppercase tracking-widest hover:text-primary-light transition-colors px-3 py-1.5 rounded-lg border border-primary/20 hover:border-primary/50 hover:bg-primary/5"
                      >
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
                          onClick={() => alert(`Inspecting ${relic.name}: ${relic.desc}`)}
                          whileHover={{ y: -4, scale: 1.02 }}
                          whileTap={{ scale: 0.95 }}
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

                {/* === ACHIEVEMENT BADGES === */}
                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3, type: 'spring' }} className="mt-8"
                  style={{ willChange: 'transform, opacity' }}>
                  <AchievementBadges />
                </motion.div>

                {/* === WEEKLY REPORT === */}
                <div className="mt-8">
                  <WeeklyReport habits={habits} />
                </div>

                {/* === MOOD ATTUNEMENT SCROLLS === */}
                <div className="mt-8">
                  <MoodScrolls onReward={(xp, gold) => {
                    setUser(u => {
                      let newXp = u.xp + xp;
                      let newLevel = u.level;
                      let finalXp = newXp;
                      let levelUp = false;
                      if (newXp >= u.xpToNextLevel) {
                        newLevel++;
                        finalXp = newXp - u.xpToNextLevel;
                        levelUp = true;
                      }
                      return {
                        ...u,
                        level: newLevel,
                        xp: finalXp,
                        gold: u.gold + gold,
                        skillPoints: levelUp ? u.skillPoints + 1 : u.skillPoints
                      };
                    });
                  }} />
                </div>

                {/* === CURSES & DOOM TRACKER === */}
                <div className="mt-8">
                  <CursesTracker
                    curses={curses}
                    habits={habits}
                    gold={user.gold}
                    onUpdateCurses={setCurses}
                    onSpendGold={(amount) => setUser(u => ({ ...u, gold: Math.max(0, u.gold - amount) }))}
                    onReward={(xp, gold) => {
                      setUser(u => {
                        let newXp = u.xp + xp;
                        let newLevel = u.level;
                        let finalXp = newXp;
                        let levelUp = false;
                        if (newXp >= u.xpToNextLevel) {
                          newLevel++;
                          finalXp = newXp - u.xpToNextLevel;
                          levelUp = true;
                        }
                        return {
                          ...u,
                          level: newLevel,
                          xp: finalXp,
                          gold: u.gold + gold,
                          skillPoints: levelUp ? u.skillPoints + 1 : u.skillPoints
                        };
                      });
                    }}
                  />
                </div>
              </>
            )}

            {activeTab === 'habits' && (
              <div className="space-y-8">
                <HabitList 
                  habits={habits} 
                  onToggle={handleToggleHabit}
                  onDelete={(id) => setHabits(prev => prev.filter(h => h.id !== id))}
                  onEdit={(id, newName) => setHabits(prev => prev.map(h => h.id === id ? { ...h, name: newName } : h))}
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
                
                <DailyBounties bounties={missions} onCompleteBounty={handleCompleteBounty} />
                
                {missions.find(m => m.type === 'boss') && (
                  <BossBattle boss={missions.find(m => m.type === 'boss')!} />
                )}
              </div>
            )}

            {activeTab === 'treasury' && (
              <div className="space-y-12">
                <SkillTree user={user} onUnlockPerk={handleUnlockPerk} />
                <ItemShop user={user} onSpendGold={handleSpendGold} onAddCustomReward={handleAddCustomReward} />
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

                {/* === THE ARCHMAGE'S GRIMOIRE === */}
                <div className="mt-8">
                  <Grimoire
                    gold={user.gold}
                    onReward={(xp, gold) => {
                      setUser(u => {
                        let newXp = u.xp + xp;
                        let newLevel = u.level;
                        let finalXp = newXp;
                        let levelUp = false;
                        if (newXp >= u.xpToNextLevel) {
                          newLevel++;
                          finalXp = newXp - u.xpToNextLevel;
                          levelUp = true;
                        }
                        return {
                          ...u,
                          level: newLevel,
                          xp: finalXp,
                          gold: u.gold + gold,
                          skillPoints: levelUp ? u.skillPoints + 1 : u.skillPoints
                        };
                      });
                    }}
                    onRestoreCompanion={handleRestoreCompanion}
                  />
                </div>
              </div>
            )}

            {activeTab === 'profile' && (
              <div className="max-w-3xl mx-auto space-y-8">
                {/* Hero Profile Card */}
                <GlassCard className="p-0 border-card-border overflow-hidden relative group">
                  {/* Banner gradient */}
                  <div className="h-36 bg-gradient-to-br from-primary/30 via-accent/20 to-secondary/30 relative overflow-hidden">
                    <motion.div className="absolute inset-0" style={{ background: 'linear-gradient(45deg, transparent 30%, rgba(212,175,55,0.1) 50%, transparent 70%)', backgroundSize: '200% 200%' }}
                      animate={{ backgroundPosition: ['0% 0%', '200% 200%'] }}
                      transition={{ duration: 6, repeat: Infinity, ease: 'linear' }} />
                    {/* Floating particles in banner */}
                    {[...Array(6)].map((_, i) => (
                      <motion.div key={i} className="absolute w-1 h-1 bg-white/40 rounded-full"
                        style={{ left: `${15 + i * 15}%`, top: '50%' }}
                        animate={{ y: [-20, 20, -20], opacity: [0.2, 0.8, 0.2] }}
                        transition={{ duration: 3 + i, repeat: Infinity }} />
                    ))}
                  </div>

                  <div className="px-10 pb-10 -mt-16 relative z-10">
                    {/* Avatar with conic ring */}
                    <div className="flex flex-col items-center gap-6">
                      <motion.div className="relative" whileHover={{ scale: 1.05 }} transition={{ type: 'spring' }}>
                        <motion.div className="absolute -inset-[4px] rounded-3xl"
                          style={{ background: 'conic-gradient(from 0deg, #c8102e, #d4af37, #7c3aed, #c8102e)' }}
                          animate={{ rotate: 360 }}
                          transition={{ duration: 6, repeat: Infinity, ease: 'linear' }} />
                        <img src={user.avatar} className="relative w-28 h-28 rounded-3xl border-4 border-background shadow-2xl z-10 block" alt="Profile" />
                        <motion.div className="absolute -bottom-2 -right-2 w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center text-lg shadow-lg z-20 border-2 border-background"
                          animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity }}>
                          {user.emoji || '✨'}
                        </motion.div>
                      </motion.div>

                      <div className="text-center space-y-2">
                        <motion.h2 className="text-4xl font-black text-foreground uppercase italic tracking-tighter"
                          style={{ fontFamily: 'Cinzel, serif' }}
                          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                          {user.name}
                        </motion.h2>
                        <div className="flex items-center justify-center gap-3">
                          <span className="px-3 py-1.5 bg-primary/10 border border-primary/20 rounded-lg text-[10px] font-black text-primary uppercase tracking-widest">{user.gender || 'Unknown'}</span>
                          <span className="px-3 py-1.5 bg-secondary/10 border border-secondary/20 rounded-lg text-[10px] font-black text-secondary uppercase tracking-widest">{user.age || '??'} yrs</span>
                        </div>
                        <motion.p className="text-xs font-black text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-accent uppercase tracking-[0.3em] pt-1"
                          animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
                          style={{ backgroundSize: '200% 200%' }}
                          transition={{ duration: 5, repeat: Infinity }}>
                          Level {user.level} • Elite Disciplinarian
                        </motion.p>
                      </div>
                    </div>

                    {/* XP Progress */}
                    <div className="mt-8 space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-black text-foreground/40 uppercase tracking-[0.2em]">Experience Points</span>
                        <span className="text-sm font-black text-primary">{user.xp} <span className="text-foreground/30">/ {user.xpToNextLevel} XP</span></span>
                      </div>
                      <div className="relative h-3 w-full bg-foreground/10 rounded-full overflow-hidden">
                        <motion.div className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary via-accent to-secondary rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${(user.xp / user.xpToNextLevel) * 100}%` }}
                          transition={{ duration: 1.5, ease: 'easeOut', delay: 0.3 }}>
                          <motion.div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white shadow-[0_0_15px_rgba(255,255,255,0.8)]"
                            animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 1.5, repeat: Infinity }} />
                        </motion.div>
                      </div>
                    </div>

                    {/* Stat Cards */}
                    <div className="grid grid-cols-4 gap-4 mt-8">
                      {[
                        { label: 'Quests', value: habits.length, icon: '⚔️', color: 'from-primary/20 to-primary/5' },
                        { label: 'XP', value: user.xp, icon: '⚡', color: 'from-accent/20 to-accent/5' },
                        { label: 'Level', value: user.level, icon: '🏆', color: 'from-secondary/20 to-secondary/5' },
                        { label: 'Streak', value: Math.max(...habits.map(h => h.streak), 0), icon: '🔥', color: 'from-orange-500/20 to-orange-500/5' },
                      ].map((stat, i) => (
                        <motion.div key={i} className={`p-5 rounded-2xl border border-card-border bg-gradient-to-br ${stat.color} text-center relative overflow-hidden group/stat`}
                          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 + i * 0.1 }} whileHover={{ y: -4, scale: 1.02 }}>
                          <motion.div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/5 opacity-0 group-hover/stat:opacity-100 transition-opacity duration-500" />
                          <div className="text-2xl mb-2">{stat.icon}</div>
                          <motion.div className="text-2xl font-black text-foreground" initial={{ scale: 0 }}
                            animate={{ scale: 1 }} transition={{ delay: 0.5 + i * 0.1, type: 'spring' }}>
                            {stat.value}
                          </motion.div>
                          <div className="text-[8px] font-black text-foreground/40 uppercase tracking-[0.2em] mt-1">{stat.label}</div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </GlassCard>

                {/* Actions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <motion.button onClick={() => setIsSettingUp(true)} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    className="py-5 bg-foreground/[0.03] border border-card-border text-foreground/50 hover:text-foreground hover:border-primary/30 text-[10px] font-black rounded-2xl transition-all uppercase tracking-widest flex items-center justify-center gap-3 group">
                    <motion.span className="group-hover:rotate-12 transition-transform">⚙️</motion.span> Edit Character
                  </motion.button>
                  <motion.button onClick={onLogout} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    className="py-5 bg-foreground/[0.03] border border-card-border text-foreground/50 hover:text-foreground hover:border-foreground/20 text-[10px] font-black rounded-2xl transition-all uppercase tracking-widest flex items-center justify-center gap-3">
                    🚪 Sign Out
                  </motion.button>
                </div>

                {/* === MYTHICAL SOUL COMPANIONS === */}
                <CompanionSystem 
                  user={user} 
                  onUpdateCompanion={(companion) => setUser(prev => ({ ...prev, companion }))}
                  onSpendGold={handleSpendGold}
                />

                <motion.button onClick={handleHardReset} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
                  className="w-full py-4 bg-red-500/5 border border-red-500/10 text-red-500/50 hover:text-red-400 hover:bg-red-500/10 hover:border-red-500/30 font-black rounded-2xl transition-all uppercase tracking-widest text-[8px]">
                  ⚠️ Hard Reset All Data
                </motion.button>
              </div>
            )}

            {activeTab === 'settings' && (
              <SettingsView user={user} onUpdate={(updatedFields) => setUser(prev => ({ ...prev, ...updatedFields }))} />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Profile Setup Onboarding Overlay - PREMIUM */}
      <AnimatePresence>
        {isSettingUp && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-2xl p-6"
          >
            {/* Background energy beams */}
            <motion.div className="absolute inset-0 pointer-events-none overflow-hidden">
              {[...Array(6)].map((_, i) => (
                <motion.div key={i} className="absolute left-1/2 top-1/2 h-px origin-left"
                  style={{ width: '50vw', transform: `rotate(${i * 60}deg)`,
                    background: 'linear-gradient(90deg, rgba(212,175,55,0.15), transparent)' }}
                  animate={{ opacity: [0.1, 0.4, 0.1] }}
                  transition={{ duration: 3, delay: i * 0.3, repeat: Infinity }} />
              ))}
            </motion.div>

            {/* Rising embers */}
            {[...Array(8)].map((_, i) => (
              <motion.div key={`ob-${i}`} className="absolute w-1 h-1 bg-secondary/60 rounded-full pointer-events-none"
                style={{ left: `${10 + i * 12}%`, bottom: 0, boxShadow: '0 0 6px rgba(212,175,55,0.6)' }}
                animate={{ y: [0, -window.innerHeight * 0.8], opacity: [0, 0.7, 0] }}
                transition={{ duration: 4 + i, repeat: Infinity, delay: i * 0.5 }} />
            ))}

            <motion.div
              initial={{ scale: 0.8, y: 30, rotateX: 10 }}
              animate={{ scale: 1, y: 0, rotateX: 0 }}
              exit={{ scale: 0.9, y: -20, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
              className="max-w-lg w-full relative"
              style={{ perspective: '1000px' }}
            >
              <GlassCard className="p-10 space-y-8 border-secondary/30 shadow-[0_0_60px_-10px_rgba(212,175,55,0.3)] relative overflow-hidden" hover={false}>
                {/* Animated conic border glow */}
                <motion.div className="absolute top-0 left-0 right-0 h-[2px]"
                  style={{ background: 'linear-gradient(90deg, transparent, #d4af37, #c8102e, #7c3aed, #d4af37, transparent)', backgroundSize: '300% 100%' }}
                  animate={{ backgroundPosition: ['0% 0%', '300% 0%'] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'linear' }} />
                <motion.div className="absolute bottom-0 left-0 right-0 h-[2px]"
                  style={{ background: 'linear-gradient(90deg, transparent, #7c3aed, #d4af37, #c8102e, transparent)', backgroundSize: '300% 100%' }}
                  animate={{ backgroundPosition: ['300% 0%', '0% 0%'] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'linear' }} />

                {/* Header with icon */}
                <div className="text-center space-y-4">
                  <motion.div className="relative inline-block"
                    animate={{ y: [0, -5, 0] }} transition={{ duration: 3, repeat: Infinity }}>
                    <motion.div className="w-16 h-16 mx-auto rounded-2xl flex items-center justify-center text-3xl relative"
                      style={{ background: 'linear-gradient(135deg, rgba(212,175,55,0.2), rgba(200,16,46,0.2))', border: '1px solid rgba(212,175,55,0.4)' }}>
                      <motion.div className="absolute inset-0 rounded-2xl"
                        style={{ background: 'conic-gradient(from 0deg, rgba(200,16,46,0.3), rgba(212,175,55,0.3), rgba(124,58,237,0.3), rgba(200,16,46,0.3))' }}
                        animate={{ rotate: 360 }} transition={{ duration: 6, repeat: Infinity, ease: 'linear' }} />
                      <span className="relative z-10">⚔️</span>
                    </motion.div>
                  </motion.div>
                  <motion.h2 className="text-3xl font-black tracking-tighter uppercase text-aura-gradient"
                    style={{ fontFamily: 'Cinzel, serif' }}
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                    Forge Your Legend
                  </motion.h2>
                  <p className="text-white/30 text-[10px] font-bold uppercase tracking-[0.3em]">Complete the ritual to begin</p>
                  
                  {/* Step indicators */}
                  <div className="flex items-center justify-center gap-2 pt-2">
                    {['Class', 'Avatar', 'Identity'].map((step, i) => (
                      <div key={step} className="flex items-center gap-2">
                        <motion.div className={cn("w-6 h-6 rounded-full flex items-center justify-center text-[8px] font-black border transition-all",
                          (i === 0 && user.gender) || (i === 1 && user.avatar) || (i === 2 && user.age && user.emoji)
                            ? "bg-secondary/20 border-secondary/50 text-secondary" : "bg-white/5 border-white/10 text-white/20"
                        )}>
                          {(i === 0 && user.gender) || (i === 1 && user.avatar) || (i === 2 && user.age && user.emoji) ? '✓' : i + 1}
                        </motion.div>
                        {i < 2 && <div className="w-8 h-px bg-white/10" />}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Gender Selection */}
                  <motion.div className="space-y-3" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
                    <label className="text-[10px] font-black text-secondary/60 uppercase tracking-[0.2em] ml-1 flex items-center gap-2">
                      <span className="text-secondary">⚔</span> Choose Your Class
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { id: 'male', icon: '🛡️', label: 'Warrior' },
                        { id: 'female', icon: '🧙‍♀️', label: 'Sorceress' },
                        { id: 'other', icon: '🌟', label: 'Mystic' },
                      ].map((g) => (
                        <motion.button
                          key={g.id}
                          onClick={() => { setUser(prev => ({ ...prev, gender: g.id as any, avatar: g.id === 'female' ? femaleAvatars[0] : maleAvatars[0] })); playButtonClick(); }}
                          whileHover={{ scale: 1.03, y: -2 }} whileTap={{ scale: 0.97 }}
                          className={cn(
                            "py-5 rounded-2xl border font-black text-[10px] tracking-widest uppercase transition-all relative overflow-hidden flex flex-col items-center gap-2",
                            user.gender === g.id 
                              ? "border-secondary/50 text-secondary shadow-[0_0_25px_rgba(212,175,55,0.3)]" 
                              : "bg-white/[0.03] border-white/[0.08] text-white/30 hover:border-white/20"
                          )}
                        >
                          {user.gender === g.id && (
                            <motion.div className="absolute inset-0" layoutId="genderBg"
                              style={{ background: 'linear-gradient(135deg, rgba(212,175,55,0.15), rgba(200,16,46,0.1))' }} />
                          )}
                          <span className="text-xl relative z-10">{g.icon}</span>
                          <span className="relative z-10">{g.label}</span>
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>

                  {/* Character Avatar Selection */}
                  {user.gender && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="space-y-3"
                    >
                      <label className="text-[10px] font-black text-secondary/60 uppercase tracking-[0.2em] ml-1 flex items-center gap-2">
                        <span className="text-secondary">👤</span> Select Appearance
                      </label>
                      <div className="grid grid-cols-5 gap-3 max-h-40 overflow-y-auto p-2 rounded-2xl border border-white/5 custom-scrollbar" style={{ background: 'rgba(255,255,255,0.02)' }}>
                        {currentAvatars.map((av, idx) => (
                          <motion.button
                            key={av}
                            onClick={() => { setUser(prev => ({ ...prev, avatar: av })); playButtonClick(); }}
                            whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }}
                            className={cn(
                              "relative rounded-xl overflow-hidden border-2 transition-all p-1",
                              user.avatar === av ? "border-secondary bg-secondary/10 shadow-[0_0_15px_rgba(212,175,55,0.3)]" : "border-transparent bg-white/5 hover:border-white/20"
                            )}
                          >
                            <img src={av} alt={`Avatar ${idx}`} className="w-full h-auto rounded-lg" />
                            {user.avatar === av && (
                              <motion.div className="absolute inset-0 bg-secondary/10" initial={{ opacity: 0 }} animate={{ opacity: 1 }} />
                            )}
                          </motion.button>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* Age & Emoji */}
                  <motion.div className="grid grid-cols-2 gap-6" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-secondary/60 uppercase tracking-[0.2em] ml-1 flex items-center gap-2">
                        <span className="text-secondary">📅</span> Your Age
                      </label>
                      <div className="relative group/age">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-secondary/30 to-primary/30 rounded-2xl blur opacity-0 group-hover/age:opacity-50 group-focus-within/age:opacity-70 transition-opacity" />
                        <input 
                          type="number" 
                          placeholder="21"
                          onChange={(e) => setUser(prev => ({ ...prev, age: parseInt(e.target.value) }))}
                          className="relative w-full bg-white/[0.03] border border-white/[0.08] rounded-2xl py-4 px-6 text-white text-xl font-black focus:outline-none focus:border-secondary/50 transition-all"
                        />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-secondary/60 uppercase tracking-[0.2em] ml-1 flex items-center gap-2">
                        <span className="text-secondary">✨</span> Aura Sigil
                      </label>
                      <div className="flex gap-2">
                        {['⚡', '🔥', '👑', '🌌', '💎', '🗡️'].map(e => (
                          <motion.button
                            key={e}
                            onClick={() => { setUser(prev => ({ ...prev, emoji: e })); playButtonClick(); }}
                            whileHover={{ scale: 1.15, y: -3 }} whileTap={{ scale: 0.9 }}
                            className={cn(
                              "w-11 h-11 rounded-xl flex items-center justify-center text-lg transition-all",
                              user.emoji === e ? "bg-secondary/20 border border-secondary/50 shadow-[0_0_15px_rgba(212,175,55,0.3)]" : "bg-white/[0.03] border border-white/[0.08] hover:border-white/20"
                            )}
                          >
                            {e}
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  </motion.div>

                  <motion.button 
                    disabled={!user.gender || !user.age || !user.emoji}
                    onClick={() => handleSetupComplete({})}
                    whileHover={{ scale: 1.02, boxShadow: '0 0 40px rgba(212,175,55,0.3)' }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-5 rounded-2xl text-[10px] tracking-[0.3em] uppercase font-black disabled:opacity-20 disabled:scale-100 transition-all mt-4 relative overflow-hidden"
                    style={{ background: 'linear-gradient(135deg, #d4af37, #b8960c)', color: '#000', boxShadow: '0 0 30px rgba(212,175,55,0.3)' }}
                  >
                    <motion.div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                      animate={{ x: ['-200%', '200%'] }}
                      transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }} />
                    <span className="relative z-10">⚔️ Enter the Realm</span>
                  </motion.button>
                </div>
              </GlassCard>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Level Up Celebration - Cinematic */}
      <AnimatePresence>
        {showLevelUp && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center"
          >
            <div className="absolute inset-0 bg-black/90 backdrop-blur-2xl" />
            
            {/* Explosive particle ring */}
            {[...Array(30)].map((_, i) => {
              const angle = (i * 12) * Math.PI / 180;
              return (
                <motion.div key={i}
                  className="absolute w-1.5 h-1.5 rounded-full"
                  style={{ left: '50%', top: '50%',
                    backgroundColor: ['#d4af37', '#c8102e', '#7c3aed', '#ffd700', '#ff6b35'][i % 5],
                    boxShadow: `0 0 10px ${['#d4af37', '#c8102e', '#7c3aed', '#ffd700', '#ff6b35'][i % 5]}` }}
                  initial={{ x: 0, y: 0, scale: 0, opacity: 1 }}
                  animate={{ x: Math.cos(angle) * (200 + Math.random() * 100), y: Math.sin(angle) * (200 + Math.random() * 100), scale: [0, 1.5, 0], opacity: [1, 0.8, 0] }}
                  transition={{ duration: 2, delay: 0.5 + Math.random() * 0.3, ease: 'easeOut' }} />
              );
            })}

            {/* Rising embers */}
            {[...Array(20)].map((_, i) => (
              <motion.div key={`ember-${i}`}
                initial={{ y: '100vh', x: `${Math.random() * 100}vw`, opacity: 1 }}
                animate={{ y: '-10vh', opacity: 0 }}
                transition={{ duration: 2.5 + Math.random() * 2, repeat: Infinity, delay: Math.random() * 2 }}
                className="absolute w-1 h-1 bg-secondary rounded-full blur-[1px]"
                style={{ boxShadow: '0 0 6px #d4af37' }} />
            ))}

            <motion.div
              initial={{ scale: 0, rotateY: 90 }}
              animate={{ scale: 1, rotateY: 0 }}
              exit={{ scale: 1.5, opacity: 0 }}
              transition={{ type: "spring", stiffness: 150, damping: 12, delay: 0.3 }}
              className="relative z-10"
            >
              <GlassCard className="p-16 text-center space-y-8 border-secondary/40 shadow-[0_0_100px_-20px_rgba(212,175,55,0.5)] max-w-lg relative overflow-hidden" hover={false}>
                {/* Animated border glow */}
                <motion.div className="absolute top-0 left-0 right-0 h-[3px]"
                  style={{ background: 'linear-gradient(90deg, transparent, #d4af37, #c8102e, #d4af37, transparent)', backgroundSize: '200% 100%' }}
                  animate={{ backgroundPosition: ['0% 0%', '200% 0%'] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }} />

                {/* Trophy with glow */}
                <div className="relative inline-block">
                  <motion.div className="absolute inset-0 bg-secondary/30 blur-[50px] rounded-full"
                    animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.8, 0.3] }}
                    transition={{ duration: 2, repeat: Infinity }} />
                  <motion.div initial={{ rotateY: 180, scale: 0 }}
                    animate={{ rotateY: 0, scale: 1 }}
                    transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}>
                    <Trophy className="w-28 h-28 text-secondary mx-auto relative z-10 drop-shadow-[0_0_40px_rgba(212,175,55,0.8)]" />
                  </motion.div>
                </div>
                
                <div className="space-y-4">
                  <motion.h2 className="text-6xl font-black uppercase italic tracking-tighter"
                    style={{ fontFamily: 'Cinzel, serif', backgroundImage: 'linear-gradient(to right, #b8960c, #ffd700, #fff8b0, #ffd700, #b8960c)',
                      backgroundSize: '200% auto', backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                      animation: 'shine-gold 3s linear infinite' }}
                    initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.7 }}>
                    Level Up!
                  </motion.h2>
                  <motion.div className="h-1 w-32 bg-gradient-to-r from-transparent via-secondary to-transparent mx-auto"
                    initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
                    transition={{ delay: 0.9, duration: 0.5 }} />
                  <motion.p className="text-xl text-secondary font-black tracking-[0.3em] uppercase"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}>
                    Rank: Aura Master
                  </motion.p>
                </div>
                
                <motion.p className="text-white/40 font-medium text-lg"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1 }}>
                  You've reached Level {user.level}. <br /> New rewards unlocked.
                </motion.p>
                
                <motion.button 
                  onClick={() => setShowLevelUp(false)}
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.3 }}
                  whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(212,175,55,0.4)' }}
                  whileTap={{ scale: 0.95 }}
                  className="px-12 py-4 bg-gradient-to-r from-secondary to-primary text-white font-black rounded-2xl shadow-xl transition-all uppercase tracking-[0.3em] text-sm relative overflow-hidden"
                >
                  <motion.div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    animate={{ x: ['-200%', '200%'] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }} />
                  <span className="relative z-10">⚡ Claim Rewards</span>
                </motion.button>
              </GlassCard>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
