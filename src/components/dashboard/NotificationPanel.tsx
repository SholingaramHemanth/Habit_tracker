import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Check, X, Clock, Trophy, Bell, 
  MoreHorizontal, CheckCircle2, 
  AlertCircle, History
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
    habit: 'text-amber-500 bg-amber-500/10',
    reminder: 'text-primary bg-primary/10',
    achievement: 'text-accent bg-accent/10'
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.95 }}
          className="absolute top-16 right-0 w-[420px] z-[100]"
        >
          <GlassCard className="p-0 border-card-border shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] overflow-hidden" hover={false}>
            {/* Header */}
            <div className="p-6 border-b border-card-border bg-foreground/[0.02] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <h3 className="text-sm font-black text-foreground uppercase tracking-widest">Aura Intelligence</h3>
                {pendingCount > 0 && (
                  <span className="px-2 py-0.5 bg-primary text-white text-[9px] font-black rounded-full animate-bounce">
                    {pendingCount} NEW
                  </span>
                )}
              </div>
              <button 
                onClick={onMarkAllAsRead}
                className="text-[9px] font-black text-foreground/30 hover:text-primary uppercase tracking-widest transition-colors flex items-center gap-2"
              >
                <CheckCircle2 className="w-3 h-3" />
                Mark All Read
              </button>
            </div>

            {/* List */}
            <div className="max-h-[500px] overflow-y-auto custom-scrollbar">
              {notifications.length === 0 ? (
                <div className="p-12 text-center space-y-4">
                  <div className="w-16 h-16 bg-foreground/[0.03] rounded-full flex items-center justify-center mx-auto">
                    <History className="w-8 h-8 text-foreground/10" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-black text-foreground uppercase tracking-tight">All caught up 🎉</p>
                    <p className="text-[10px] text-foreground/30 font-bold uppercase tracking-widest">Your aura is fully synchronized</p>
                  </div>
                </div>
              ) : (
                <div className="divide-y divide-card-border">
                  {notifications.map((notif) => {
                    const Icon = iconMap[notif.type];
                    return (
                      <div 
                        key={notif.id}
                        className={cn(
                          "p-6 hover:bg-foreground/[0.01] transition-all group relative",
                          !notif.read && "bg-primary/[0.02]"
                        )}
                        onClick={() => onMarkAsRead(notif.id)}
                      >
                        {!notif.read && (
                          <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary" />
                        )}
                        <div className="flex items-start gap-4">
                          <div className={cn("p-2.5 rounded-xl shrink-0", colorMap[notif.type])}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <div className="flex-1 min-w-0 space-y-1">
                            <div className="flex items-center justify-between gap-4">
                              <h4 className="text-xs font-black text-foreground uppercase tracking-tight truncate">
                                {notif.title}
                              </h4>
                              <span className="text-[9px] font-bold text-foreground/20 uppercase whitespace-nowrap">
                                {notif.timestamp}
                              </span>
                            </div>
                            <p className="text-[11px] text-foreground/50 font-medium leading-relaxed">
                              {notif.message}
                            </p>

                            {/* Actions */}
                            <div className="flex items-center gap-2 pt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                              {notif.habitId && (
                                <button 
                                  onClick={(e) => { e.stopPropagation(); onDone(notif.habitId!, notif.id); }}
                                  className="px-3 py-1.5 bg-accent text-white rounded-lg text-[9px] font-black uppercase tracking-widest flex items-center gap-2 hover:scale-105 transition-all"
                                >
                                  <Check className="w-3 h-3" />
                                  Done
                                </button>
                              )}
                              
                              <div className="relative group/snooze">
                                <button 
                                  className="px-3 py-1.5 bg-foreground/[0.05] text-foreground/60 rounded-lg text-[9px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-foreground/10"
                                >
                                  <Clock className="w-3 h-3" />
                                  Snooze
                                </button>
                                <div className="absolute bottom-full left-0 mb-2 hidden group-hover/snooze:flex bg-background border border-card-border rounded-xl shadow-2xl p-1 gap-1">
                                  {[5, 10, 30].map(m => (
                                    <button 
                                      key={m}
                                      onClick={(e) => { e.stopPropagation(); onSnooze(notif.id, m); }}
                                      className="px-2 py-1 hover:bg-primary hover:text-white rounded-lg text-[8px] font-black transition-colors"
                                    >
                                      {m}m
                                    </button>
                                  ))}
                                </div>
                              </div>

                              <button 
                                onClick={(e) => { e.stopPropagation(); onDismiss(notif.id); }}
                                className="px-3 py-1.5 bg-foreground/[0.05] text-foreground/40 rounded-lg text-[9px] font-black uppercase tracking-widest hover:text-red-500 hover:bg-red-500/10 ml-auto"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="p-4 bg-foreground/[0.02] border-t border-card-border text-center">
                <p className="text-[8px] font-black text-foreground/10 uppercase tracking-[0.4em]">Aura Synchronization Protocol v2.4</p>
              </div>
            )}
          </GlassCard>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
