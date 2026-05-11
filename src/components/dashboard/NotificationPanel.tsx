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

  const colorMap: Record<NotificationType, string> = {
    habit: 'text-amber-500 bg-amber-500/10 shadow-[0_0_15px_rgba(245,158,11,0.2)]',
    reminder: 'text-primary bg-primary/10 shadow-[0_0_15px_rgba(139,92,246,0.2)]',
    achievement: 'text-accent bg-accent/10 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
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
            {/* Header */}
            <div className="p-6 border-b border-card-border bg-gradient-to-r from-primary/10 via-transparent to-transparent flex items-center justify-between relative overflow-hidden">
              <div className="absolute inset-0 bg-mesh opacity-30 pointer-events-none" />
              <div className="flex items-center gap-3 relative z-10">
                <Sparkles className="w-5 h-5 text-primary animate-pulse" />
                <h3 className="text-sm font-black text-gradient uppercase tracking-widest">Aura Intelligence</h3>
                {pendingCount > 0 && (
                  <span className="px-2 py-0.5 bg-primary text-white text-[9px] font-black rounded-full shadow-[0_0_15px_rgba(139,92,246,0.6)] animate-pulse">
                    {pendingCount} NEW
                  </span>
                )}
              </div>
              <button 
                onClick={onMarkAllAsRead}
                className="relative z-10 text-[9px] font-black text-foreground/40 hover:text-primary uppercase tracking-widest transition-colors flex items-center gap-2 hover:bg-primary/10 px-3 py-1.5 rounded-full"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                Mark All Read
              </button>
            </div>

            {/* List */}
            <div className="max-h-[500px] overflow-y-auto custom-scrollbar relative">
              {notifications.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-16 text-center space-y-6"
                >
                  <div className="w-24 h-24 bg-gradient-to-br from-primary/10 to-accent/10 rounded-full flex items-center justify-center mx-auto animate-float border border-primary/20 shadow-[0_0_40px_-5px_rgba(139,92,246,0.2)] relative">
                    <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping opacity-20" />
                    <History className="w-10 h-10 text-primary/60" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-base font-black text-foreground uppercase tracking-tight text-gradient">All caught up 🎉</p>
                    <p className="text-xs text-foreground/40 font-bold uppercase tracking-widest">Your aura is fully synchronized</p>
                  </div>
                </motion.div>
              ) : (
                <div className="p-2 space-y-1">
                  {notifications.map((notif, i) => {
                    const Icon = iconMap[notif.type];
                    return (
                      <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05, type: 'spring', stiffness: 300, damping: 25 }}
                        key={notif.id}
                        className={cn(
                          "p-4 rounded-2xl hover:bg-foreground/[0.04] transition-all duration-300 group relative border border-transparent hover:border-card-border hover:shadow-lg cursor-pointer overflow-hidden",
                          !notif.read && "bg-gradient-to-r from-primary/[0.08] to-transparent border-l-primary/40 border-l-2"
                        )}
                        onClick={() => onMarkAsRead(notif.id)}
                      >
                        {!notif.read && (
                          <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-primary shadow-[0_0_10px_rgba(139,92,246,0.8)]" />
                        )}
                        <div className="flex items-start gap-4 relative z-10">
                          <div className={cn("p-3 rounded-xl shrink-0 transition-transform duration-300 group-hover:scale-110", colorMap[notif.type])}>
                            <Icon className="w-4 h-4" />
                          </div>
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

                            {/* Actions */}
                            <div className="flex items-center gap-2 pt-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                              {notif.habitId && (
                                <button 
                                  onClick={(e) => { e.stopPropagation(); onDone(notif.habitId!, notif.id); }}
                                  className="px-4 py-2 bg-gradient-to-r from-accent to-emerald-400 text-white rounded-lg text-[9px] font-black uppercase tracking-widest flex items-center gap-2 hover:shadow-[0_0_15px_rgba(16,185,129,0.5)] hover:scale-105 transition-all"
                                >
                                  <Check className="w-3 h-3" />
                                  Done
                                </button>
                              )}
                              
                              <div className="relative group/snooze">
                                <button 
                                  className="px-3 py-2 bg-foreground/[0.05] text-foreground/70 rounded-lg text-[9px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-foreground/10 hover:text-foreground transition-all"
                                >
                                  <Clock className="w-3 h-3" />
                                  Snooze
                                </button>
                                <div className="absolute bottom-full left-0 mb-2 hidden group-hover/snooze:flex bg-background/90 backdrop-blur-xl border border-card-border rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.5)] p-1.5 gap-1 z-50">
                                  {[5, 10, 30].map(m => (
                                    <button 
                                      key={m}
                                      onClick={(e) => { e.stopPropagation(); onSnooze(notif.id, m); }}
                                      className="px-3 py-1.5 hover:bg-primary hover:text-white rounded-lg text-[10px] font-black transition-all hover:shadow-[0_0_10px_rgba(139,92,246,0.5)]"
                                    >
                                      {m}m
                                    </button>
                                  ))}
                                </div>
                              </div>

                              <button 
                                onClick={(e) => { e.stopPropagation(); onDismiss(notif.id); }}
                                className="px-3 py-2 bg-foreground/[0.05] text-foreground/50 rounded-lg text-[9px] font-black uppercase tracking-widest hover:text-red-400 hover:bg-red-500/20 ml-auto transition-all"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
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
              <div className="p-4 bg-gradient-to-t from-foreground/[0.03] to-transparent border-t border-card-border text-center">
                <p className="text-[8px] font-black text-foreground/20 uppercase tracking-[0.5em] flex items-center justify-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-primary animate-pulse" />
                  Aura Synchronization Protocol v3.0
                  <span className="w-1 h-1 rounded-full bg-primary animate-pulse" />
                </p>
              </div>
            )}
          </GlassCard>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
