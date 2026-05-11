import React, { useState } from 'react';
import { useTheme } from '@/src/context/ThemeContext';
import { GlassCard } from '../ui/GlassCard';
import { 
  Moon, Sun, Monitor, Bell, Shield, Palette, Zap, 
  User as UserIcon, Clock, Calendar, Hash, Ruler, 
  Gamepad2, Plane, Lock, Download, Sparkles, Languages,
  MoreHorizontal, ChevronRight, Check, Volume2, 
  Settings as SettingsIcon, EyeOff, RefreshCcw, FlaskConical,
  VolumeX, BellRing, Smartphone, Ban, Waves, Cpu
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { User, UserSettings } from '@/src/types';
import { motion, AnimatePresence } from 'motion/react';
import { StatsGrid } from './StatsGrid';

interface SettingsViewProps {
  user: User;
  onUpdate: (fields: Partial<User>) => void;
}

type TabId = 'general' | 'notifications' | 'privacy' | 'advanced';

const tabs = [
  { id: 'general', icon: SettingsIcon, label: 'General', desc: 'Core preferences' },
  { id: 'notifications', icon: Bell, label: 'Alerts', desc: 'Timing & channels' },
  { id: 'privacy', icon: Shield, label: 'Privacy', desc: 'Security & data' },
  { id: 'advanced', icon: Zap, label: 'Advanced', desc: 'Gamification & beta' },
] as const;

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  },
  exit: { opacity: 0, transition: { duration: 0.2 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 350, damping: 25 } }
};

export function SettingsView({ user, onUpdate }: SettingsViewProps) {
  const { theme, setTheme } = useTheme();
  const [activeTab, setActiveTab] = useState<TabId>('general');

  const updateSettings = (updates: Partial<UserSettings>) => onUpdate({ settings: { ...user.settings, ...updates } });
  const updateReminders = (updates: Partial<UserSettings['reminders']>) => updateSettings({ reminders: { ...user.settings.reminders, ...updates } });
  const updatePrivacy = (updates: Partial<UserSettings['privacy']>) => updateSettings({ privacy: { ...user.settings.privacy, ...updates } });
  const updateAdv = (updates: Partial<UserSettings['advanced']>) => updateSettings({ advanced: { ...user.settings.advanced, ...updates } });

  const handleExportJSON = () => {
    const habits = JSON.parse(localStorage.getItem('aura_habits') || '[]');
    const exportData = { user, habits };
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportData, null, 2));
    const node = document.createElement('a');
    node.setAttribute("href", dataStr);
    node.setAttribute("download", "aura_journey.json");
    document.body.appendChild(node);
    node.click();
    node.remove();
  };

  const handleExportPDF = () => {
    Promise.all([
      import('jspdf'),
      import('html2canvas')
    ]).then(([{ jsPDF }, { default: html2canvas }]) => {
      const doc = new jsPDF();
      const habits = JSON.parse(localStorage.getItem('aura_habits') || '[]');
      
      doc.setFont("helvetica", "bold");
      doc.setFontSize(24);
      doc.setTextColor(139, 92, 246);
      doc.text("AURA JOURNEY EXPORT", 20, 30);
      
      doc.setFontSize(14);
      doc.setTextColor(100, 100, 100);
      doc.text(`Player: ${user.name}`, 20, 50);
      doc.text(`Level: ${user.level} (XP: ${user.xp})`, 20, 60);
      doc.text(`Goal: ${user.goal || 'Unleash Full Potential'}`, 20, 70);
      
      doc.setFont("helvetica", "bold");
      doc.text("CURRENT HABITS", 20, 100);
      
      doc.setFont("helvetica", "normal");
      doc.setFontSize(12);
      doc.setTextColor(50, 50, 50);
      let y = 110;
      if (habits.length === 0) {
        doc.text("- No active habits found.", 20, y);
      } else {
        habits.forEach((h: any) => {
          doc.text(`- ${h.name} (Streak: ${h.streak})`, 20, y);
          y += 10;
        });
      }

      const chartElement = document.getElementById('pdf-export-hidden-container');
      if (chartElement) {
        html2canvas(chartElement, { backgroundColor: '#0a0a0a', scale: 2 }).then(canvas => {
          const imgData = canvas.toDataURL('image/png');
          if (y + 100 > 280) {
            doc.addPage();
            y = 20;
          }
          y += 10;
          doc.setFont("helvetica", "bold");
          doc.setFontSize(14);
          doc.setTextColor(139, 92, 246);
          doc.text("PERFORMANCE GRAPH", 20, y);
          
          doc.addImage(imgData, 'PNG', 20, y + 10, 170, (canvas.height * 170) / canvas.width);
          doc.save("aura_journey_with_stats.pdf");
        }).catch((err) => {
          console.error('Canvas capture failed:', err);
          doc.save("aura_journey_fallback.pdf");
        });
      } else {
        doc.save("aura_journey_with_stats.pdf");
      }
    });
  };

  const SettingRow = ({ children, icon: Icon, title, desc, danger }: { children?: React.ReactNode, icon: any, title: string, desc?: string, danger?: boolean }) => (
    <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center justify-between p-6 gap-6 hover:bg-foreground/[0.03] transition-all duration-300 group relative overflow-hidden rounded-2xl border border-transparent hover:border-card-border/50">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/[0.05] to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-[1500ms] ease-in-out" />
      
      <div className="flex items-center gap-5 relative z-10 w-full sm:w-auto">
        <div className={cn(
          "p-3.5 rounded-2xl transition-all duration-500 flex-shrink-0 relative overflow-hidden",
          danger 
            ? "bg-red-500/10 text-red-500 group-hover:bg-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0)] group-hover:shadow-[0_0_20px_rgba(239,68,68,0.3)] group-hover:scale-110" 
            : "bg-foreground/[0.03] text-foreground/40 group-hover:bg-primary/20 group-hover:text-primary-light group-hover:scale-110 group-hover:rotate-6 shadow-[0_0_15px_rgba(139,92,246,0)] group-hover:shadow-[0_0_25px_rgba(139,92,246,0.4)]"
        )}>
          {/* Inner pulse effect on hover */}
          <div className="absolute inset-0 bg-white/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <Icon className="w-5 h-5 transition-colors relative z-10" />
        </div>
        <div>
          <h3 className={cn("text-[13px] font-black uppercase tracking-tight transition-colors duration-300", 
            danger ? "text-red-500" : "text-foreground group-hover:text-primary-light"
          )}>{title}</h3>
          {desc && <p className="text-[10px] text-foreground/40 font-bold uppercase tracking-[0.15em] mt-1.5 line-clamp-1 sm:line-clamp-none group-hover:text-foreground/50 transition-colors">{desc}</p>}
        </div>
      </div>
      <div className="flex items-center gap-4 relative z-10 sm:ml-auto w-full sm:w-auto justify-end">
        {children}
      </div>
    </motion.div>
  );

  const Toggle = ({ active, onToggle }: { active: boolean, onToggle: () => void }) => (
    <button 
      onClick={onToggle}
      className={cn(
        "w-14 h-7 rounded-full relative transition-all duration-500 flex items-center p-1 border cursor-pointer overflow-hidden",
        active ? "bg-primary/20 shadow-[0_0_20px_rgba(139,92,246,0.4)] border-primary/50" : "bg-foreground/5 border-foreground/10 hover:border-foreground/30 hover:bg-foreground/10"
      )}
    >
      {/* Active background glow */}
      <AnimatePresence>
        {active && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-gradient-to-r from-primary to-primary-light opacity-80" 
          />
        )}
      </AnimatePresence>
      <motion.div 
        layout
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        className={cn(
          "h-full aspect-square rounded-full shadow-lg relative z-10",
          active ? "bg-white" : "bg-foreground/30"
        )}
        style={{ marginLeft: active ? 'auto' : '0' }}
      >
        {active && <div className="absolute inset-0 rounded-full shadow-[0_0_10px_rgba(255,255,255,0.8)]" />}
      </motion.div>
    </button>
  );

  return (
    <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-12 pb-32">
      {/* Category Sidebar */}
      <div className="w-full lg:w-72 space-y-8 lg:sticky lg:top-10 self-start shrink-0">
        <div className="space-y-3 px-2">
          <h2 className="text-3xl font-black text-foreground tracking-tighter uppercase italic">Config</h2>
          <p className="text-[10px] text-foreground/40 font-bold uppercase tracking-[0.2em]">Shape your reality</p>
        </div>

        <div className="space-y-3 relative z-0">
          {tabs.map(tab => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabId)}
                className={cn(
                  "w-full flex items-center gap-5 p-4 rounded-3xl transition-all relative overflow-hidden group text-left",
                  isActive ? "text-white" : "text-foreground/40 hover:text-foreground hover:bg-foreground/[0.02]"
                )}
              >
                {isActive && (
                  <motion.div 
                    layoutId="activeTabBadge" 
                    className="absolute inset-0 bg-gradient-to-r from-primary via-primary-light to-secondary rounded-3xl -z-10 shadow-[0_0_30px_rgba(139,92,246,0.1)] border border-white/10" 
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <div className={cn(
                  "p-3 rounded-2xl transition-all duration-300", 
                  isActive ? "bg-white/20 text-white shadow-inner" : "bg-foreground/5 text-foreground/50 group-hover:bg-foreground/10 group-hover:scale-110"
                )}>
                  <tab.icon className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-black text-xs tracking-widest uppercase">{tab.label}</div>
                  <div className={cn("font-bold text-[9px] uppercase tracking-wider mt-1 transition-colors", isActive ? "text-white/70" : "text-foreground/30")}>{tab.desc}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Settings Content */}
      <div className="flex-1 min-w-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            variants={containerVariants}
            initial="hidden"
            animate="show"
            exit="exit"
            className="space-y-8"
          >
            {activeTab === 'general' && (
              <>
                <motion.div variants={itemVariants}>
                  <GlassCard className="p-8 border-card-border overflow-hidden relative group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[80px] rounded-full pointer-events-none transition-opacity duration-700 group-hover:bg-primary/10" />
                    <div className="absolute bottom-0 left-0 w-40 h-40 bg-secondary/5 blur-[60px] rounded-full pointer-events-none transition-opacity duration-700 group-hover:bg-secondary/10" />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                      <div className="space-y-4">
                        <label className="text-[10px] font-black text-primary uppercase tracking-[0.2em] ml-1 flex items-center gap-2">
                          <UserIcon className="w-3 h-3" /> Profile Name
                        </label>
                        <div className="relative group/input">
                          <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-secondary rounded-2xl blur opacity-0 group-hover/input:opacity-20 transition duration-1000 group-focus-within/input:opacity-50" />
                          <input 
                            type="text" 
                            value={user.name}
                            onChange={(e) => onUpdate({ name: e.target.value })}
                            className="w-full relative bg-card border border-card-border focus:border-primary/50 focus:bg-foreground/[0.05] rounded-2xl py-4 px-6 text-foreground font-black focus:outline-none focus:ring-4 focus:ring-primary/20 transition-all font-sans shadow-inner placeholder:text-foreground/20"
                            placeholder="Your Name"
                          />
                        </div>
                      </div>
                      <div className="space-y-4">
                        <label className="text-[10px] font-black text-primary uppercase tracking-[0.2em] ml-1 flex items-center gap-2">
                          <Sparkles className="w-3 h-3" /> Personal Goal
                        </label>
                        <div className="relative group/input">
                          <div className="absolute -inset-0.5 bg-gradient-to-r from-secondary to-primary rounded-2xl blur opacity-0 group-hover/input:opacity-20 transition duration-1000 group-focus-within/input:opacity-50" />
                          <input 
                            type="text" 
                            value={user.goal || ''}
                            onChange={(e) => onUpdate({ goal: e.target.value })}
                            className="w-full relative bg-card border border-card-border focus:border-primary/50 focus:bg-foreground/[0.05] rounded-2xl py-4 px-6 text-foreground font-black focus:outline-none focus:ring-4 focus:ring-primary/20 transition-all font-sans shadow-inner placeholder:text-foreground/20"
                            placeholder="e.g. Unleash Full Potential"
                          />
                        </div>
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <GlassCard className="p-8 border-card-border space-y-6">
                    <h3 className="text-[10px] font-black text-foreground/30 uppercase tracking-[0.2em] ml-1">Interface Appearance</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {[
                        { id: 'light', icon: Sun, label: 'Light Mode' },
                        { id: 'dark', icon: Moon, label: 'Dark Mode' },
                        { id: 'system', icon: Monitor, label: 'System Match' },
                      ].map(opt => (
                        <button
                          key={opt.id}
                          onClick={() => {
                            updateSettings({ theme: opt.id as any });
                            if (opt.id !== 'system') setTheme(opt.id as any);
                          }}
                          className={cn(
                            "flex flex-col items-center gap-5 p-6 rounded-3xl border-2 transition-all relative overflow-hidden group",
                            user.settings.theme === opt.id 
                              ? "bg-primary/5 border-primary shadow-[0_0_25px_rgba(139,92,246,0.1)]" 
                              : "bg-foreground/[0.02] border-transparent hover:border-card-border hover:bg-foreground/[0.05]"
                          )}
                        >
                          {user.settings.theme === opt.id && (
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-100" />
                          )}
                          <opt.icon className={cn(
                            "w-8 h-8 transition-all duration-300", 
                            user.settings.theme === opt.id ? "text-primary scale-110 drop-shadow-[0_0_8px_rgba(139,92,246,0.3)]" : "text-foreground/20 group-hover:text-foreground/60 group-hover:-translate-y-1"
                          )} />
                          <span className={cn(
                            "text-[10px] font-black uppercase tracking-widest relative z-10", 
                            user.settings.theme === opt.id ? "text-primary" : "text-foreground/40 group-hover:text-foreground/80"
                          )}>{opt.label}</span>
                        </button>
                      ))}
                    </div>
                  </GlassCard>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <GlassCard className="p-8 border-card-border flex flex-col md:flex-row gap-8">
                    <div className="flex-1 space-y-4">
                      <label className="text-[10px] font-black text-foreground/30 uppercase tracking-[0.2em] ml-1">First Day of Week</label>
                      <div className="flex gap-2 p-1.5 bg-foreground/[0.02] border border-card-border rounded-2xl relative z-0">
                        {['monday', 'sunday'].map(day => {
                          const isActive = user.settings.weekStart === day;
                          return (
                            <button
                              key={day}
                              onClick={() => updateSettings({ weekStart: day as any })}
                              className={cn(
                                "flex-1 py-4 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] transition-all relative overflow-hidden",
                                isActive ? "text-white shadow-lg" : "text-foreground/30 hover:text-foreground/80 hover:bg-foreground/5"
                              )}
                            >
                              {isActive && <motion.div layoutId="weekDayBadge" className="absolute inset-0 bg-gradient-to-r from-primary to-primary-light border border-primary rounded-xl -z-10 shadow-glow-purple/20" />}
                              <span className="relative z-10">{day}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                    <div className="flex-1 space-y-4">
                      <label className="text-[10px] font-black text-foreground/30 uppercase tracking-[0.2em] ml-1">Region Language</label>
                      <div className="w-full bg-foreground/[0.02] hover:bg-foreground/[0.05] border border-card-border rounded-2xl py-5 px-6 flex items-center justify-between cursor-pointer transition-colors group">
                        <span className="text-xs font-black uppercase tracking-widest text-foreground/80 group-hover:text-primary transition-colors">{user.settings.language}</span>
                        <div className="p-2 bg-foreground/5 rounded-lg group-hover:bg-primary/10 transition-colors">
                          <Languages className="w-4 h-4 text-foreground/40 group-hover:text-primary transition-colors" />
                        </div>
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              </>
            )}

            {activeTab === 'notifications' && (
              <>
                <div className="space-y-4">
                  <h3 className="text-[10px] font-black text-foreground/30 uppercase tracking-[0.2em] ml-4">Timing & Delivery</h3>
                  <GlassCard className="p-0 border-card-border divide-y divide-card-border/50 overflow-hidden shadow-2xl">
                    <SettingRow icon={Clock} title="Check-in Schedule" desc="Configure your primary daily reminder windows">
                      <div className="flex flex-wrap items-center gap-3">
                        {user.settings.reminders.times.map((time, idx) => (
                          <div key={idx} className="relative group/time">
                            <input
                              type="time"
                              value={time}
                              onChange={(e) => {
                                const newTimes = [...user.settings.reminders.times];
                                newTimes[idx] = e.target.value;
                                updateReminders({ times: newTimes });
                              }}
                              className="bg-foreground/[0.05] hover:bg-primary/10 hover:text-primary transition-colors rounded-xl text-[10px] font-black px-3 py-2 border border-card-border focus:border-primary outline-none text-foreground/80 cursor-pointer"
                            />
                            {user.settings.reminders.times.length > 1 && (
                              <button 
                                onClick={() => {
                                  const newTimes = user.settings.reminders.times.filter((_, i) => i !== idx);
                                  updateReminders({ times: newTimes });
                                }}
                                className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 rounded-full text-white text-[8px] flex items-center justify-center opacity-0 group-hover/time:opacity-100 transition-opacity"
                              >
                                ×
                              </button>
                            )}
                          </div>
                        ))}
                        <button 
                          onClick={() => updateReminders({ times: [...user.settings.reminders.times, "12:00"] })}
                          className="p-1.5 border border-dashed border-primary/40 text-primary rounded-xl text-sm font-black hover:bg-primary/10 transition-all flex items-center justify-center aspect-square h-8"
                        >
                          +
                        </button>
                      </div>
                    </SettingRow>
                    <SettingRow icon={Calendar} title="Active Days" desc="Select days the system monitors you">
                      <div className="flex flex-wrap gap-2">
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
                                "w-9 h-9 rounded-xl text-[9px] font-black uppercase transition-all border flex items-center justify-center",
                                isActive 
                                  ? "bg-primary border-primary text-white shadow-[0_4px_10px_rgba(139,92,246,0.3)]" 
                                  : "bg-foreground/[0.03] border-card-border text-foreground/30 hover:border-foreground/50 hover:bg-foreground/5"
                              )}
                            >
                              {day.slice(0, 1)}
                            </button>
                          );
                        })}
                      </div>
                    </SettingRow>
                    <SettingRow icon={Ban} title="Do Not Disturb" desc="Silence notifications during sleep hours">
                      <Toggle active={user.settings.reminders.dnd} onToggle={() => updateReminders({ dnd: !user.settings.reminders.dnd })} />
                    </SettingRow>
                  </GlassCard>
                </div>

                <div className="space-y-4">
                  <h3 className="text-[10px] font-black text-foreground/30 uppercase tracking-[0.2em] ml-4">Behavior Algorithms</h3>
                  <GlassCard className="p-0 border-card-border divide-y divide-card-border/50 overflow-hidden shadow-2xl">
                    <SettingRow icon={Cpu} title="Smart Delivery" desc="Predictive alerts based on your completion history">
                      <Toggle active={user.settings.reminders.smartReminders} onToggle={() => updateReminders({ smartReminders: !user.settings.reminders.smartReminders })} />
                    </SettingRow>
                    <SettingRow icon={Waves} title="Streak Preservation" desc="Urgent warnings when momentum is about to break">
                      <Toggle active={user.settings.reminders.streakAlerts} onToggle={() => updateReminders({ streakAlerts: !user.settings.reminders.streakAlerts })} />
                    </SettingRow>
                    <SettingRow icon={Zap} title="AI Timing" desc="Automatically optimize notification times">
                      <Toggle active={user.settings.reminders.aiTiming} onToggle={() => updateReminders({ aiTiming: !user.settings.reminders.aiTiming })} />
                    </SettingRow>
                  </GlassCard>
                </div>

                <div className="space-y-4">
                  <h3 className="text-[10px] font-black text-foreground/30 uppercase tracking-[0.2em] ml-4">Feedback Modes</h3>
                  <GlassCard className="p-0 border-card-border divide-y divide-card-border/50 overflow-hidden shadow-2xl">
                    <SettingRow icon={BellRing} title="Audio Feedback" desc="Play cinematic sounds upon receiving notifications">
                      <Toggle active={user.settings.reminders.sound} onToggle={() => updateReminders({ sound: !user.settings.reminders.sound })} />
                    </SettingRow>
                    <SettingRow icon={Smartphone} title="Haptic Engine" desc="Vibrate device for critical alerts (mobile)">
                      <Toggle active={user.settings.reminders.vibration} onToggle={() => updateReminders({ vibration: !user.settings.reminders.vibration })} />
                    </SettingRow>
                    <SettingRow icon={VolumeX} title="Master Mute" desc="Temporarily suppress all non-critical notifications">
                      <Toggle active={user.settings.reminders.mute} onToggle={() => updateReminders({ mute: !user.settings.reminders.mute })} />
                    </SettingRow>
                  </GlassCard>
                </div>
              </>
            )}

            {activeTab === 'privacy' && (
              <>
                <div className="space-y-4">
                  <h3 className="text-[10px] font-black text-foreground/30 uppercase tracking-[0.2em] ml-4">Security</h3>
                  <GlassCard className="p-0 border-card-border divide-y divide-card-border/50 overflow-hidden shadow-2xl">
                    <SettingRow icon={Lock} title="Biometric Lock" desc="Require FaceID / Fingerprint to open Aura">
                      <Toggle active={user.settings.privacy.biometrics} onToggle={() => updatePrivacy({ biometrics: !user.settings.privacy.biometrics })} />
                    </SettingRow>
                    <SettingRow icon={EyeOff} title="Incognito Mode" desc="Obfuscate habit names on the primary dashboard">
                      <Toggle active={user.settings.privacy.privateMode} onToggle={() => updatePrivacy({ privateMode: !user.settings.privacy.privateMode })} />
                    </SettingRow>
                    <SettingRow icon={Monitor} title="Lock Screen Integrity" desc="Hide habit achievements and content in push alerts">
                      <Toggle active={user.settings.privacy.lockScreenPrivacy} onToggle={() => updatePrivacy({ lockScreenPrivacy: !user.settings.privacy.lockScreenPrivacy })} />
                    </SettingRow>
                  </GlassCard>
                </div>

                <div className="space-y-4">
                  <h3 className="text-[10px] font-black text-foreground/30 uppercase tracking-[0.2em] ml-4">Data Management</h3>
                  <GlassCard className="p-0 border-card-border divide-y divide-card-border/50 overflow-hidden shadow-2xl">
                    <SettingRow icon={RefreshCcw} title="Aura Cloud Sync" desc="Synchronize state across your authorized devices">
                      <Toggle active={true} onToggle={() => {}} />
                    </SettingRow>
                    <SettingRow icon={Download} title="Export Journey" desc="Download your profile data as JSON or PDF format">
                      <div className="flex gap-3">
                        <button onClick={handleExportJSON} className="px-6 py-2.5 bg-foreground/5 hover:bg-foreground/10 hover:text-primary border border-transparent hover:border-primary/30 text-[10px] font-black uppercase tracking-[0.2em] rounded-xl transition-all font-sans">
                          JSON
                        </button>
                        <button onClick={handleExportPDF} className="px-6 py-2.5 bg-primary hover:bg-primary-light text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-xl transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(139,92,246,0.3)]">
                          PDF
                          <Download className="w-3 h-3" />
                        </button>
                      </div>
                    </SettingRow>
                  </GlassCard>
                </div>
              </>
            )}

            {activeTab === 'advanced' && (
              <>
                <div className="space-y-4">
                  <h3 className="text-[10px] font-black text-foreground/30 uppercase tracking-[0.2em] ml-4">Experience Alteration</h3>
                  <GlassCard className="p-0 border-card-border divide-y divide-card-border/50 overflow-hidden shadow-2xl">
                    <SettingRow icon={Gamepad2} title="Aura Gamification" desc="Show XP, progression levels, and master rank flair">
                      <Toggle active={user.settings.gamification.showLevels} onToggle={() => updateSettings({ gamification: { ...user.settings.gamification, showLevels: !user.settings.gamification.showLevels } })} />
                    </SettingRow>
                    <SettingRow icon={Monitor} title="Zen Mode" desc="Remove missions, numbers, and focus purely on completion">
                      <Toggle active={user.settings.advanced.minimalMode} onToggle={() => updateAdv({ minimalMode: !user.settings.advanced.minimalMode })} />
                    </SettingRow>
                    <SettingRow icon={Volume2} title="Immersive Audio" desc="Enable background ambiance and interaction UI sounds">
                      <Toggle active={user.settings.advanced.soundEffects} onToggle={() => updateAdv({ soundEffects: !user.settings.advanced.soundEffects })} />
                    </SettingRow>
                  </GlassCard>
                </div>

                <div className="space-y-4">
                  <h3 className="text-[10px] font-black text-foreground/30 uppercase tracking-[0.2em] ml-4">System Operations</h3>
                  <GlassCard className="p-0 border-card-border divide-y divide-card-border/50 overflow-hidden shadow-2xl">
                    <SettingRow icon={FlaskConical} title="Experimental Lab" desc="Gain early access to unstable UI paradigms">
                      <Toggle active={user.settings.advanced.betaFeatures} onToggle={() => updateAdv({ betaFeatures: !user.settings.advanced.betaFeatures })} />
                    </SettingRow>
                    <SettingRow icon={RefreshCcw} title="Total Obliteration" desc="Irreversibly wipe all habits, history, and levels" danger>
                      <button className="px-6 py-3 bg-red-500/10 hover:bg-red-500 border border-red-500/30 text-red-500 hover:text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-red-500/20 active:scale-95 transition-all">
                        Execute Reset
                      </button>
                    </SettingRow>
                  </GlassCard>
                </div>
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Hidden Chart strictly for high-quality PDF rendering */}
      <div 
        className="fixed pointer-events-none" 
        style={{ zIndex: -9999, opacity: 0.01, top: 0, left: 0, width: '800px', height: '600px', background: '#0a0a0a', padding: '30px', border: '1px solid #333' }}
      >
        <div id="pdf-export-hidden-container" style={{ width: '100%', height: '100%' }}>
          <StatsGrid mode="week" isEmpty={false} />
        </div>
      </div>
    </div>
  );
}
