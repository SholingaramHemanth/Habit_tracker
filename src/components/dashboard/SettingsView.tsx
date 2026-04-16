import { useState } from 'react';
import { useTheme } from '@/src/context/ThemeContext';
import { GlassCard } from '../ui/GlassCard';
import { 
  Moon, Sun, Monitor, Bell, Shield, Palette, Zap, 
  User as UserIcon, Clock, Calendar, Hash, Ruler, 
  Gamepad2, Plane, Lock, Download, Sparkles, Languages,
  MoreHorizontal, ChevronRight, Check, Volume2, 
  Settings as SettingsIcon, EyeOff, RefreshCcw, FlaskConical,
  Snooze, VolumeX, BellRing, Smartphone, Ban
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { User, UserSettings } from '@/src/types';
import { motion, AnimatePresence } from 'motion/react';

interface SettingsViewProps {
  user: User;
  onUpdate: (fields: Partial<User>) => void;
}

type TabId = 'general' | 'notifications' | 'privacy' | 'advanced';

export function SettingsView({ user, onUpdate }: SettingsViewProps) {
  const { theme, setTheme } = useTheme();
  const [activeTab, setActiveTab] = useState<TabId>('general');

  const updateSettings = (updates: Partial<UserSettings>) => {
    onUpdate({ settings: { ...user.settings, ...updates } });
  };

  const updateReminders = (updates: Partial<UserSettings['reminders']>) => {
    updateSettings({ reminders: { ...user.settings.reminders, ...updates } });
  };

  const updatePrivacy = (updates: Partial<UserSettings['privacy']>) => {
    updateSettings({ privacy: { ...user.settings.privacy, ...updates } });
  };

  const updateAdv = (updates: Partial<UserSettings['advanced']>) => {
    updateSettings({ advanced: { ...user.settings.advanced, ...updates } });
  };

  const tabs = [
    { id: 'general', icon: SettingsIcon, label: 'General' },
    { id: 'notifications', icon: Bell, label: 'Notifications' },
    { id: 'privacy', icon: Shield, label: 'Privacy' },
    { id: 'advanced', icon: Zap, label: 'Advanced' },
  ] as const;

  const SettingRow = ({ children, icon: Icon, title, desc, danger }: { children?: React.ReactNode, icon: any, title: string, desc?: string, danger?: boolean }) => (
    <div className="flex items-center justify-between p-6 hover:bg-foreground/[0.01] transition-colors group">
      <div className="flex items-center gap-6">
        <div className={cn(
          "p-3 rounded-2xl transition-colors",
          danger ? "bg-red-500/10 text-red-500" : "bg-foreground/[0.03] group-hover:bg-primary/10 text-foreground/40 group-hover:text-primary"
        )}>
          <Icon className="w-5 h-5 transition-colors" />
        </div>
        <div>
          <h3 className={cn("text-sm font-black uppercase tracking-tight", danger ? "text-red-500" : "text-foreground")}>{title}</h3>
          {desc && <p className="text-[10px] text-foreground/30 font-bold uppercase tracking-widest mt-0.5">{desc}</p>}
        </div>
      </div>
      <div className="flex items-center gap-4">
        {children}
      </div>
    </div>
  );

  const Toggle = ({ active, onToggle }: { active: boolean, onToggle: () => void }) => (
    <button 
      onClick={onToggle}
      className={cn(
        "w-12 h-6 rounded-full relative transition-all duration-500",
        active ? "bg-primary shadow-glow-purple" : "bg-foreground/10"
      )}
    >
      <div className={cn(
        "absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-500",
        active ? "left-7" : "left-1"
      )} />
    </button>
  );

  return (
    <div className="max-w-6xl mx-auto flex gap-12 pb-32">
      {/* Category Sidebar */}
      <div className="w-64 space-y-2">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all font-black text-[10px] tracking-widest uppercase relative overflow-hidden",
              activeTab === tab.id 
                ? "bg-primary text-white shadow-glow-purple" 
                : "text-foreground/40 hover:text-foreground hover:bg-foreground/[0.03]"
            )}
          >
            <tab.icon className="w-5 h-5" />
            {tab.label}
            {activeTab === tab.id && (
              <motion.div layoutId="active-tab-bg" className="absolute inset-0 bg-primary -z-10" />
            )}
          </button>
        ))}
      </div>

      {/* Settings Content */}
      <div className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 'general' && (
              <div className="space-y-8">
                <GlassCard className="p-8 border-card-border space-y-10">
                  <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <label className="text-[10px] font-black text-foreground/30 uppercase tracking-[0.2em] ml-1">Profile Name</label>
                      <input 
                        type="text" 
                        value={user.name}
                        onChange={(e) => onUpdate({ name: e.target.value })}
                        className="w-full bg-foreground/[0.03] border border-card-border rounded-2xl py-4 px-6 text-foreground font-black focus:outline-none focus:border-primary/50 transition-all font-sans"
                      />
                    </div>
                    <div className="space-y-4">
                      <label className="text-[10px] font-black text-foreground/30 uppercase tracking-[0.2em] ml-1">Personal Goal</label>
                      <input 
                        type="text" 
                        value={user.goal || ''}
                        onChange={(e) => onUpdate({ goal: e.target.value })}
                        className="w-full bg-foreground/[0.03] border border-card-border rounded-2xl py-4 px-6 text-foreground font-black focus:outline-none focus:border-primary/50 transition-all font-sans"
                        placeholder="e.g. Unleash Full Potential"
                      />
                    </div>
                  </div>

                  <div className="space-y-6">
                    <h3 className="text-sm font-black text-foreground uppercase tracking-tight">App Experience</h3>
                    <div className="grid grid-cols-3 gap-4">
                      {[
                        { id: 'light', icon: Sun, label: 'Light' },
                        { id: 'dark', icon: Moon, label: 'Dark' },
                        { id: 'system', icon: Monitor, label: 'System' },
                      ].map(opt => (
                        <button
                          key={opt.id}
                          onClick={() => {
                            updateSettings({ theme: opt.id as any });
                            if (opt.id !== 'system') setTheme(opt.id as any);
                          }}
                          className={cn(
                            "flex items-center gap-4 p-5 rounded-2xl border-2 transition-all",
                            user.settings.theme === opt.id ? "bg-primary border-primary text-white" : "bg-foreground/[0.03] border-card-border text-foreground/40 hover:border-foreground/20"
                          )}
                        >
                          <opt.icon className="w-5 h-5" />
                          <span className="text-[10px] font-black uppercase tracking-widest">{opt.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <label className="text-[10px] font-black text-foreground/30 uppercase tracking-[0.2em] ml-1">Week Start</label>
                      <div className="flex gap-2">
                        {['monday', 'sunday'].map(day => (
                          <button
                            key={day}
                            onClick={() => updateSettings({ weekStart: day as any })}
                            className={cn(
                              "flex-1 py-4 rounded-2xl border-2 font-black text-[10px] uppercase tracking-widest transition-all",
                              user.settings.weekStart === day ? "border-primary text-primary bg-primary/5" : "border-card-border text-foreground/20"
                            )}
                          >
                            {day}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-4">
                      <label className="text-[10px] font-black text-foreground/30 uppercase tracking-[0.2em] ml-1">Language</label>
                      <div className="w-full bg-foreground/[0.03] border border-card-border rounded-2xl py-4 px-6 flex items-center justify-between cursor-pointer">
                        <span className="text-[10px] font-black uppercase text-foreground">{user.settings.language}</span>
                        <Languages className="w-4 h-4 text-foreground/20" />
                      </div>
                    </div>
                  </div>
                </GlassCard>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-8">
                <GlassCard className="p-0 border-card-border divide-y divide-card-border overflow-hidden">
                  <SettingRow icon={Clock} title="Reminder Time" desc="Set your daily check-in windows">
                    <div className="flex gap-2">
                      {user.settings.reminders.times.map((time, idx) => (
                        <input
                          key={idx}
                          type="time"
                          value={time}
                          onChange={(e) => {
                            const newTimes = [...user.settings.reminders.times];
                            newTimes[idx] = e.target.value;
                            updateReminders({ times: newTimes });
                          }}
                          className="bg-foreground/[0.05] rounded-xl text-[10px] font-black px-2 py-1 border-none focus:ring-1 focus:ring-primary outline-none"
                        />
                      ))}
                      <button 
                        onClick={() => updateReminders({ times: [...user.settings.reminders.times, "12:00"] })}
                        className="px-3 py-1.5 bg-primary/10 text-primary rounded-xl text-[10px] font-black hover:bg-primary/20 transition-all"
                      >
                        +
                      </button>
                    </div>
                  </SettingRow>
                  <SettingRow icon={Calendar} title="Repeat Days" desc="Select active tracking days">
                    <div className="flex gap-1">
                      {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => {
                        const isActive = user.settings.reminders.repeatDays.includes(day);
                        return (
                          <button
                            key={day}
                            onClick={() => {
                              const newDays = isActive 
                                ? user.settings.reminders.repeatDays.filter(d => d !== day)
                                : [...user.settings.reminders.repeatDays, day];
                              updateReminders({ repeatDays: newDays });
                            }}
                            className={cn(
                              "w-8 h-8 rounded-lg text-[8px] font-black uppercase transition-all border",
                              isActive 
                                ? "bg-primary border-primary text-white" 
                                : "bg-foreground/[0.03] border-card-border text-foreground/20 hover:border-foreground/40"
                            )}
                          >
                            {day.slice(0, 1)}
                          </button>
                        );
                      })}
                    </div>
                  </SettingRow>
                  <SettingRow icon={Sparkles} title="Smart Reminder" desc="Predictive alerts based on behavior">
                    <Toggle active={user.settings.reminders.smartReminders} onToggle={() => updateReminders({ smartReminders: !user.settings.reminders.smartReminders })} />
                  </SettingRow>
                  <SettingRow icon={Clock} title="Snooze" desc="Allow snoozing for 15/30 minutes">
                    <Toggle active={user.settings.reminders.snooze} onToggle={() => updateReminders({ snooze: !user.settings.reminders.snooze })} />
                  </SettingRow>
                  <SettingRow icon={VolumeX} title="Mute" desc="Temporarily disable all aura sounds">
                    <Toggle active={user.settings.reminders.mute} onToggle={() => updateReminders({ mute: !user.settings.reminders.mute })} />
                  </SettingRow>
                  <SettingRow icon={BellRing} title="Streak Alerts" desc="Notifications for approaching milestones">
                    <Toggle active={user.settings.reminders.streakAlerts} onToggle={() => updateReminders({ streakAlerts: !user.settings.reminders.streakAlerts })} />
                  </SettingRow>
                  <SettingRow icon={Volume2} title="Sound & Vibration" desc="Haptic feedback and custom tones">
                    <div className="flex gap-3">
                      <Toggle active={user.settings.reminders.sound} onToggle={() => updateReminders({ sound: !user.settings.reminders.sound })} />
                      <Toggle active={user.settings.reminders.vibration} onToggle={() => updateReminders({ vibration: !user.settings.reminders.vibration })} />
                    </div>
                  </SettingRow>
                  <SettingRow icon={Ban} title="Do Not Disturb" desc="Silence notifications during sleep">
                    <Toggle active={user.settings.reminders.dnd} onToggle={() => updateReminders({ dnd: !user.settings.reminders.dnd })} />
                  </SettingRow>
                  <SettingRow icon={Smartphone} title="Missed Alerts" desc="Show badges for incomplete habits">
                    <Toggle active={user.settings.reminders.missedAlerts} onToggle={() => updateReminders({ missedAlerts: !user.settings.reminders.missedAlerts })} />
                  </SettingRow>
                  <SettingRow icon={Zap} title="AI Timing" desc="Automatically optimize notification time">
                    <Toggle active={user.settings.reminders.aiTiming} onToggle={() => updateReminders({ aiTiming: !user.settings.reminders.aiTiming })} />
                  </SettingRow>
                </GlassCard>
              </div>
            )}

            {activeTab === 'privacy' && (
              <div className="space-y-8">
                <GlassCard className="p-0 border-card-border divide-y divide-card-border overflow-hidden">
                  <SettingRow icon={Lock} title="App Lock" desc="PIN, FaceID, or Fingerprint access">
                    <Toggle active={user.settings.privacy.biometrics} onToggle={() => updatePrivacy({ biometrics: !user.settings.privacy.biometrics })} />
                  </SettingRow>
                  <SettingRow icon={Download} title="Export Data" desc="Download your journey as CSV/PDF">
                    <button className="p-2 hover:bg-foreground/[0.05] rounded-xl transition-all">
                      <ChevronRight className="w-5 h-5 text-foreground/20" />
                    </button>
                  </SettingRow>
                  <SettingRow icon={RefreshCcw} title="Backup & Sync" desc="Synchronize aura data across devices">
                    <Toggle active={true} onToggle={() => {}} />
                  </SettingRow>
                  <SettingRow icon={EyeOff} title="Hide Habits" desc="Obfuscate habit names on dashboard">
                    <Toggle active={user.settings.privacy.privateMode} onToggle={() => updatePrivacy({ privateMode: !user.settings.privacy.privateMode })} />
                  </SettingRow>
                  <SettingRow icon={Monitor} title="Lock Screen Privacy" desc="Hide habit details in notifications">
                    <Toggle active={user.settings.privacy.lockScreenPrivacy} onToggle={() => updatePrivacy({ lockScreenPrivacy: !user.settings.privacy.lockScreenPrivacy })} />
                  </SettingRow>
                </GlassCard>
              </div>
            )}

            {activeTab === 'advanced' && (
              <div className="space-y-8">
                <GlassCard className="p-0 border-card-border divide-y divide-card-border overflow-hidden">
                  <SettingRow icon={Gamepad2} title="Gamification" desc="XP, Levels, and Aura Master ranks">
                    <Toggle active={user.settings.gamification.showLevels} onToggle={() => updateSettings({ gamification: { ...user.settings.gamification, showLevels: !user.settings.gamification.showLevels } })} />
                  </SettingRow>
                  <SettingRow icon={Monitor} title="Minimal Mode" desc="Remove distractions for deep focus">
                    <Toggle active={user.settings.advanced.minimalMode} onToggle={() => updateAdv({ minimalMode: !user.settings.advanced.minimalMode })} />
                  </SettingRow>
                  <SettingRow icon={Volume2} title="Sound Effects" desc="Gamified audio for task completion">
                    <Toggle active={user.settings.advanced.soundEffects} onToggle={() => updateAdv({ soundEffects: !user.settings.advanced.soundEffects })} />
                  </SettingRow>
                  <SettingRow icon={FlaskConical} title="Beta Features" desc="Test upcoming next-level aura tools">
                    <Toggle active={user.settings.advanced.betaFeatures} onToggle={() => updateAdv({ betaFeatures: !user.settings.advanced.betaFeatures })} />
                  </SettingRow>
                  <SettingRow icon={RefreshCcw} title="Data Reset" desc="Wipe all habits and character data" danger>
                    <button className="px-4 py-2 bg-red-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-red-500/20 active:scale-95 transition-all">Reset</button>
                  </SettingRow>
                </GlassCard>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
