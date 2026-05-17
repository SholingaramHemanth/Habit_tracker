import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Check, X, Clock, Trophy, Bell, 
  MoreHorizontal, CheckCircle2, 
  AlertCircle, History, Sparkles
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { Notification, NotificationType } from '@/src/types';
import { GlassCard } from '../ui/GlassCard';
import { playButtonClick } from '@/src/lib/sounds';

interface NotificationPanelProps {
  notifications: Notification[];
  isOpen: boolean;
  onClose: () => void;
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onDismiss: (id: string) => void;
  onDone: (habitId: string, notificationId: string) => void;
  onSnooze: (id: string, minutes: number) => void;
}

export function NotificationPanel({ 
  notifications, 
  isOpen, 
  onMarkAsRead, 
  onMarkAllAsRead, 
  onDismiss, 
  onDone,
  onSnooze 
}: NotificationPanelProps) {
  
  const pendingCount = notifications.filter(n => !n.read).length;

  const iconMap: Record<NotificationType, any> = {
    habit: AlertCircle,
    reminder: Clock,
    achievement: Trophy
  };

  const colorMap: Record<NotificationType, { icon: string; pulse: string; accent: string }> = {
    habit: { 
      icon: 'text-amber-500 bg-amber-500/10 shadow-[0_0_15px_rgba(245,158,11,0.2)]',
      pulse: 'rgba(245,158,11,0.6)',
      accent: 'border-l-amber-500'
    },
    reminder: { 
      icon: 'text-primary bg-primary/10 shadow-[0_0_15px_rgba(139,92,246,0.2)]',
      pulse: 'rgba(139,92,246,0.6)',
      accent: 'border-l-primary'
    },
    achievement: { 
      icon: 'text-accent bg-accent/10 shadow-[0_0_15px_rgba(16,185,129,0.2)]',
      pulse: 'rgba(16,185,129,0.6)',
      accent: 'border-l-accent'
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 15, scale: 0.95, filter: 'blur(10px)' }}
          animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
          exit={{ opacity: 0, y: 15, scale: 0.95, filter: 'blur(10px)' }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="absolute top-16 right-0 w-[420px] z-[100]"
        >
          <GlassCard className="p-0 border-primary/20 shadow-[0_0_40px_-10px_rgba(139,92,246,0.25)] overflow-hidden backdrop-blur-3xl bg-background/80" hover={false}>
            {/* Animated top border */}
            <motion.div className="h-[2px] w-full"
              style={{ background: 'linear-gradient(90deg, transparent, #d4af37, #c8102e, #7c3aed, transparent)', backgroundSize: '200% 100%' }}
              animate={{ backgroundPosition: ['0% 0%', '200% 0%'] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }} />

            {/* Header */}
            <div className="p-6 border-b border-card-border bg-gradient-to-r from-primary/10 via-transparent to-secondary/5 flex items-center justify-between relative overflow-hidden">
              <div className="absolute inset-0 bg-mesh opacity-30 pointer-events-none" />
              {/* Floating particles */}
              {[...Array(3)].map((_, i) => (
                <motion.div key={i} className="absolute w-1 h-1 bg-primary/40 rounded-full"
                  style={{ left: `${20 + i * 30}%`, top: '50%' }}
                  animate={{ y: [-10, 10, -10], opacity: [0.3, 0.7, 0.3] }}
                  transition={{ duration: 2 + i, repeat: Infinity }} />
              ))}
              <div className="flex items-center gap-3 relative z-10">
                <motion.div animate={{ rotate: [0, 360] }} transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}>
                  <Sparkles className="w-5 h-5 text-primary" />
                </motion.div>
                <h3 className="text-sm font-black text-gradient uppercase tracking-widest" style={{ fontFamily: 'Cinzel, serif' }}>Aura Intelligence</h3>
                {pendingCount > 0 && (
                  <motion.span className="px-2.5 py-1 bg-gradient-to-r from-primary to-accent text-white text-[9px] font-black rounded-full"
                    initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 400 }}
                    style={{ boxShadow: '0 0 20px rgba(139,92,246,0.5)' }}>
                    {pendingCount} NEW
                  </motion.span>
                )}
              </div>
              <motion.button 
                onClick={() => { onMarkAllAsRead(); playButtonClick(); }}
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                className="relative z-10 text-[9px] font-black text-foreground/40 hover:text-primary uppercase tracking-widest transition-colors flex items-center gap-2 hover:bg-primary/10 px-3 py-1.5 rounded-full border border-transparent hover:border-primary/20"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                Clear All
              </motion.button>
            </div>

            {/* List */}
            <div className="max-h-[500px] overflow-y-auto custom-scrollbar relative">
              {notifications.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-16 text-center space-y-6"
                >
                  <div className="w-24 h-24 bg-gradient-to-br from-primary/10 to-accent/10 rounded-full flex items-center justify-center mx-auto border border-primary/20 shadow-[0_0_40px_-5px_rgba(139,92,246,0.2)] relative">
                    <motion.div className="absolute inset-0 rounded-full" 
                      style={{ border: '1px solid rgba(212,175,55,0.3)' }}
                      animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                      transition={{ duration: 3, repeat: Infinity }} />
                    <motion.div animate={{ y: [0, -5, 0] }} transition={{ duration: 2, repeat: Infinity }}>
                      <History className="w-10 h-10 text-primary/60" />
                    </motion.div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-base font-black text-foreground uppercase tracking-tight" style={{ fontFamily: 'Cinzel, serif' }}>All Caught Up ✨</p>
                    <p className="text-xs text-foreground/40 font-bold uppercase tracking-widest">Your aura is fully synchronized</p>
                  </div>
                </motion.div>
              ) : (
                <div className="p-2 space-y-1">
                  {notifications.map((notif, i) => {
                    const Icon = iconMap[notif.type];
                    const colors = colorMap[notif.type];
                    return (
                      <motion.div 
                        initial={{ opacity: 0, x: 30, scale: 0.95 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: -30, scale: 0.95 }}
                        transition={{ delay: i * 0.06, type: 'spring', stiffness: 300, damping: 25 }}
                        key={notif.id}
                        className={cn(
                          "p-4 rounded-2xl hover:bg-foreground/[0.04] transition-all duration-300 group relative border border-transparent hover:border-card-border hover:shadow-lg cursor-pointer overflow-hidden",
                          !notif.read && `bg-gradient-to-r from-primary/[0.06] to-transparent border-l-2 ${colors.accent}`
                        )}
                        onClick={() => onMarkAsRead(notif.id)}
                      >
                        {/* Unread glow indicator */}
                        {!notif.read && (
                          <motion.div className="absolute left-0 top-0 bottom-0 w-[2px]"
                            style={{ background: `linear-gradient(to bottom, transparent, ${colors.pulse}, transparent)` }}
                            animate={{ opacity: [0.5, 1, 0.5] }}
                            transition={{ duration: 2, repeat: Infinity }} />
                        )}

                        {/* Hover sweep */}
                        <motion.div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
                          style={{ transform: 'translateX(-100%)' }} />

                        <div className="flex items-start gap-4 relative z-10">
                          <motion.div className={cn("p-3 rounded-xl shrink-0 transition-all duration-300 group-hover:scale-110", colors.icon)}
                            whileHover={{ rotate: [0, 10, -10, 0] }}
                            transition={{ duration: 0.5 }}>
                            <Icon className="w-4 h-4" />
                          </motion.div>
                          <div className="flex-1 min-w-0 space-y-1.5">
                            <div className="flex items-center justify-between gap-4">
                              <h4 className="text-xs font-black text-foreground uppercase tracking-tight truncate group-hover:text-primary transition-colors">
                                {notif.title}
                              </h4>
                              <span className="text-[10px] font-bold text-foreground/30 uppercase whitespace-nowrap">
                                {notif.timestamp}
                              </span>
                            </div>
                            <p className="text-[11px] text-foreground/60 font-medium leading-relaxed">
                              {notif.message}
                            </p>

                            {/* Actions - slide up on hover */}
                            <motion.div className="flex items-center gap-2 pt-3 opacity-0 group-hover:opacity-100 transition-all duration-300"
                              initial={false}>
                              {notif.habitId && (
                                <motion.button 
                                  onClick={(e) => { e.stopPropagation(); onDone(notif.habitId!, notif.id); playButtonClick(); }}
                                  whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.9 }}
                                  className="px-4 py-2 bg-gradient-to-r from-accent to-emerald-400 text-white rounded-lg text-[9px] font-black uppercase tracking-widest flex items-center gap-2 shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all"
                                >
                                  <Check className="w-3 h-3" />
                                  Complete
                                </motion.button>
                              )}
                              
                              <div className="relative group/snooze">
                                <motion.button whileHover={{ scale: 1.05 }}
                                  className="px-3 py-2 bg-foreground/[0.05] text-foreground/70 rounded-lg text-[9px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-foreground/10 hover:text-foreground transition-all"
                                >
                                  <Clock className="w-3 h-3" />
                                  Snooze
                                </motion.button>
                                <div className="absolute bottom-full left-0 mb-2 hidden group-hover/snooze:flex bg-background/95 backdrop-blur-xl border border-card-border rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.5)] p-1.5 gap-1 z-50">
                                  {[5, 10, 30].map(m => (
                                    <motion.button 
                                      key={m}
                                      onClick={(e) => { e.stopPropagation(); onSnooze(notif.id, m); playButtonClick(); }}
                                      whileHover={{ scale: 1.1 }}
                                      className="px-3 py-1.5 hover:bg-primary hover:text-white rounded-lg text-[10px] font-black transition-all"
                                    >
                                      {m}m
                                    </motion.button>
                                  ))}
                                </div>
                              </div>

                              <motion.button 
                                onClick={(e) => { e.stopPropagation(); onDismiss(notif.id); }}
                                whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                                className="px-3 py-2 bg-foreground/[0.05] text-foreground/50 rounded-lg text-[9px] font-black uppercase tracking-widest hover:text-red-400 hover:bg-red-500/20 ml-auto transition-all"
                              >
                                <X className="w-3 h-3" />
                              </motion.button>
                            </motion.div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="p-4 bg-gradient-to-t from-foreground/[0.03] to-transparent border-t border-card-border text-center relative overflow-hidden">
                <motion.div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent"
                  animate={{ x: ['-100%', '100%'] }} transition={{ duration: 4, repeat: Infinity, ease: 'linear' }} />
                <p className="text-[8px] font-black text-foreground/20 uppercase tracking-[0.5em] flex items-center justify-center gap-2 relative z-10">
                  <motion.span className="w-1.5 h-1.5 rounded-full bg-primary"
                    animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }} />
                  Aura Sync Protocol v3.1
                  <motion.span className="w-1.5 h-1.5 rounded-full bg-secondary"
                    animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity, delay: 0.5 }} />
                </p>
              </div>
            )}
          </GlassCard>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
