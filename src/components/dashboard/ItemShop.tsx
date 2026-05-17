import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GlassCard } from '../ui/GlassCard';
import { User } from '@/src/types';
import { Coins, Image as ImageIcon, Sparkles, Plus, Gift, Check } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { playAchievement, playButtonClick, playError } from '@/src/lib/sounds';

interface ItemShopProps {
  user: User;
  onSpendGold: (amount: number, item: any) => void;
  onAddCustomReward: (reward: any) => void;
}

const STORE_ITEMS = [
  { id: 'avatar_dragon', type: 'avatar', name: 'Dragon Master', cost: 500, icon: '🐉', color: 'bg-red-500/20 text-red-500 border-red-500/50' },
  { id: 'avatar_void', type: 'avatar', name: 'Void Walker', cost: 1000, icon: '🌌', color: 'bg-purple-500/20 text-purple-500 border-purple-500/50' },
  { id: 'sigil_crown', type: 'sigil', name: 'Golden Crown', cost: 300, icon: '👑', color: 'bg-yellow-500/20 text-yellow-500 border-yellow-500/50' },
  { id: 'theme_elven', type: 'theme', name: 'Elven Forest Realm', cost: 2000, icon: '🌲', color: 'bg-emerald-500/20 text-emerald-500 border-emerald-500/50' },
];

export function ItemShop({ user, onSpendGold, onAddCustomReward }: ItemShopProps) {
  const [customRewards, setCustomRewards] = useState([
    { id: 'c1', name: 'Watch 1 Hour of Netflix', cost: 300 },
    { id: 'c2', name: 'Buy a Coffee', cost: 500 }
  ]);
  const [isAddingReward, setIsAddingReward] = useState(false);
  const [newRewardName, setNewRewardName] = useState('');
  const [newRewardCost, setNewRewardCost] = useState(100);

  const handlePurchase = (item: any) => {
    if (user.gold >= item.cost) {
      onSpendGold(item.cost, item);
      playAchievement();
    } else {
      playError();
    }
  };

  const handleAddCustom = () => {
    if (newRewardName.trim() && newRewardCost > 0) {
      const newReward = { id: `cr_${Date.now()}`, name: newRewardName, cost: newRewardCost };
      setCustomRewards(prev => [...prev, newReward]);
      onAddCustomReward(newReward);
      setIsAddingReward(false);
      setNewRewardName('');
      playButtonClick();
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black uppercase tracking-widest text-aura-gradient" style={{ fontFamily: 'Cinzel, serif' }}>
            Aura Treasury
          </h2>
          <p className="text-xs font-bold text-foreground/40 uppercase tracking-widest mt-1">Spend your hard-earned gold</p>
        </div>
        <div className="flex items-center gap-3 px-5 py-2.5 bg-yellow-500/10 border border-yellow-500/30 rounded-xl shadow-[0_0_20px_rgba(234,179,8,0.2)]">
          <Coins className="w-5 h-5 text-yellow-500 animate-pulse" />
          <div className="text-lg font-black text-yellow-500">
            {user.gold} <span className="text-yellow-500/50 uppercase text-[10px] tracking-widest">Gold</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Official Store Items */}
        <GlassCard className="p-6 border-card-border/50">
          <h3 className="text-sm font-black uppercase tracking-widest mb-6 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" /> Mystical Wares
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {STORE_ITEMS.map(item => {
              const canAfford = user.gold >= item.cost;
              return (
                <motion.div key={item.id} whileHover={{ scale: 1.02 }} className={cn("p-4 rounded-2xl border flex flex-col items-center text-center gap-3 relative overflow-hidden group", item.color)}>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />
                  <span className="text-4xl relative z-10 drop-shadow-lg">{item.icon}</span>
                  <div className="relative z-10 w-full">
                    <div className="text-[10px] font-black uppercase tracking-widest truncate">{item.name}</div>
                    <div className="text-[8px] uppercase tracking-widest opacity-70 mb-3">{item.type}</div>
                    <button
                      onClick={() => handlePurchase(item)}
                      className={cn("w-full py-2 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-1 transition-all",
                        canAfford ? "bg-white/20 hover:bg-white/30 text-white" : "bg-black/50 text-white/30 cursor-not-allowed"
                      )}
                    >
                      {canAfford ? <><Coins className="w-3 h-3" /> {item.cost}</> : 'Locked'}
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </GlassCard>

        {/* Custom Real-life Rewards */}
        <GlassCard className="p-6 border-card-border/50">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
              <Gift className="w-4 h-4 text-secondary" /> Real-Life Rewards
            </h3>
            <button onClick={() => setIsAddingReward(!isAddingReward)} className="p-1.5 bg-secondary/20 text-secondary rounded-lg hover:bg-secondary/30 transition-colors">
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <AnimatePresence>
            {isAddingReward && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mb-4 space-y-3 overflow-hidden">
                <input type="text" placeholder="Reward Name (e.g. Play Video Games)" value={newRewardName} onChange={e => setNewRewardName(e.target.value)}
                  className="w-full bg-black/40 border border-secondary/30 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-secondary" />
                <div className="flex gap-2">
                  <div className="flex-1 relative">
                    <Coins className="w-4 h-4 text-yellow-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input type="number" placeholder="Cost" value={newRewardCost || ''} onChange={e => setNewRewardCost(Number(e.target.value))}
                      className="w-full bg-black/40 border border-secondary/30 rounded-xl pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-secondary" />
                  </div>
                  <button onClick={handleAddCustom} className="px-4 bg-secondary text-black font-black rounded-xl text-xs uppercase tracking-widest hover:scale-105 transition-transform">
                    Add
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-3 max-h-[300px] overflow-y-auto custom-scrollbar">
            {customRewards.map(reward => {
              const canAfford = user.gold >= reward.cost;
              return (
                <div key={reward.id} className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors">
                  <div className="font-bold text-sm text-foreground/80">{reward.name}</div>
                  <button
                    onClick={() => handlePurchase(reward)}
                    className={cn("px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center gap-1 transition-all",
                      canAfford ? "bg-yellow-500/20 text-yellow-500 border border-yellow-500/30 hover:bg-yellow-500/30" : "bg-black/50 text-white/30 border border-white/5 cursor-not-allowed"
                    )}
                  >
                    <Coins className="w-3 h-3" /> {reward.cost}
                  </button>
                </div>
              );
            })}
          </div>
        </GlassCard>
      </div>
    </motion.div>
  );
}
