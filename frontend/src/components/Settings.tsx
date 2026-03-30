import React from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';

interface Props {
  interval: number;
  onIntervalChange: (interval: number) => void;
  onClose: () => void;
}

export const Settings: React.FC<Props> = ({ interval, onIntervalChange, onClose }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="glass-card rounded-2xl p-6 mb-4 relative"
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white/60 hover:text-white transition"
      >
        <X size={24} />
      </button>
      <h3 className="text-2xl font-bold text-white mb-4">Настройки</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-white/80 mb-2">Интервал анализа (мс)</label>
          <input
            type="range"
            min="500"
            max="5000"
            step="100"
            value={interval}
            onChange={(e) => onIntervalChange(Number(e.target.value))}
            className="w-full accent-purple-500"
          />
          <div className="flex justify-between text-white/60 text-sm">
            <span>0.5 сек</span>
            <span>{interval} мс</span>
            <span>5 сек</span>
          </div>
        </div>
        <p className="text-white/60 text-sm">
          Частота анализа влияет на производительность. Рекомендуется 2000 мс.
        </p>
      </div>
    </motion.div>
  );
};