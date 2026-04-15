import { motion } from 'motion/react';
import { cn } from '@/src/lib/utils';

interface ProgressBarProps {
  value: number;
  max: number;
  className?: string;
  color?: string;
  showLabel?: boolean;
}

export function ProgressBar({ value, max, className, color = "bg-primary", showLabel = false }: ProgressBarProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  return (
    <div className={cn("w-full space-y-2", className)}>
      {showLabel && (
        <div className="flex justify-between text-xs font-medium text-white/60 uppercase tracking-wider">
          <span>Progress</span>
          <span>{Math.round(percentage)}%</span>
        </div>
      )}
      <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className={cn("h-full rounded-full relative", color)}
        >
          <div className="absolute inset-0 bg-white/20 animate-pulse" />
        </motion.div>
      </div>
    </div>
  );
}
