import { LayoutDashboard, CheckSquare, BarChart2, User, Settings, LogOut, Zap } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { motion } from 'motion/react';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onLogout: () => void;
}

export function Sidebar({ activeTab, onTabChange, onLogout }: SidebarProps) {
  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'DASHBOARD' },
    { id: 'habits', icon: CheckSquare, label: 'HABITS' },
    { id: 'stats', icon: BarChart2, label: 'ANALYTICS' },
    { id: 'profile', icon: User, label: 'PROFILE' },
    { id: 'settings', icon: Settings, label: 'SETTINGS' },
  ];

  return (
    <div className="w-64 h-screen glass-dark border-r border-card-border flex flex-col p-8 fixed left-0 top-0 z-40 transition-colors duration-500">
      <div className="flex items-center gap-4 mb-16 px-2">
        <div className="relative group">
          <div className="absolute inset-0 bg-primary/40 rounded-xl blur-lg opacity-50 group-hover:opacity-100 transition-opacity" />
          <div className="relative w-12 h-12 bg-white text-black rounded-xl flex items-center justify-center shadow-2xl">
            <Zap className="w-7 h-7 fill-current" />
          </div>
        </div>
        <span className="text-3xl font-black tracking-tighter text-foreground italic transition-colors">AURA</span>
      </div>

      <nav className="flex-1 space-y-3">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={cn(
              "w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-500 group relative overflow-hidden",
              activeTab === item.id 
                ? "text-foreground" 
                : "text-foreground/30 hover:text-foreground/60 hover:bg-foreground/[0.02]"
            )}
          >
            {activeTab === item.id && (
              <motion.div 
                layoutId="active-tab"
                className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent border-l-2 border-primary"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
            <item.icon className={cn(
              "w-5 h-5 transition-all duration-500 relative z-10",
              activeTab === item.id ? "text-primary scale-110" : "group-hover:scale-110"
            )} />
            <span className="font-black text-[10px] tracking-[0.2em] relative z-10">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="pt-8 border-t border-card-border space-y-3">
        <button 
          onClick={onLogout}
          className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-red-500/40 hover:text-red-500 hover:bg-red-500/5 transition-all group"
        >
          <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-black text-[10px] tracking-[0.2em]">LOGOUT</span>
        </button>
      </div>
    </div>
  );
}
