import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { EmotionResult, emotionLabels, emotionColors } from '../types/emotion';
import { Copy, Check, AlertCircle } from 'lucide-react';
import {
  Smile, Frown, Angry, Meh, AlertCircle as AlertCircleIcon, Skull, Heart,
} from 'lucide-react';
import { useState } from 'react';

const emotionIcons = {
  neutral: Meh,
  happiness: Smile,
  sadness: Frown,
  anger: Angry,
  surprise: AlertCircleIcon,
  fear: Skull,
  disgust: Heart,
};

interface Props {
  result: EmotionResult | null;
  loading: boolean;
  streamActive: boolean;
}

// Компонент кругового прогресса (без изменений)
const CircularProgress = ({ emotion, value, color }: { emotion: string; value: number; color: string }) => {
  const percent = value * 100;
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;

  return (
    <div className="flex items-center gap-4">
      <div className="relative w-20 h-20">
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="40"
            cy="40"
            r={radius}
            stroke="rgba(255,255,255,0.2)"
            strokeWidth="6"
            fill="none"
          />
          <motion.circle
            cx="40"
            cy="40"
            r={radius}
            stroke={color}
            strokeWidth="6"
            fill="none"
            strokeLinecap="round"
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 0.8 }}
            style={{
              strokeDasharray: circumference,
              strokeDashoffset: offset,
            }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center text-sm font-bold text-white">
          {Math.round(percent)}%
        </div>
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          {React.createElement(emotionIcons[emotion as keyof typeof emotionIcons] || Meh, {
            size: 20,
            color: color,
          })}
          <span className="text-white font-medium">{emotionLabels[emotion as keyof typeof emotionLabels]}</span>
        </div>
        <div className="w-full h-1.5 bg-white/20 rounded-full mt-1 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percent}%` }}
            transition={{ duration: 0.5 }}
            className="h-full rounded-full"
            style={{ backgroundColor: color }}
          />
        </div>
      </div>
    </div>
  );
};

export const EmotionDisplay: React.FC<Props> = ({ result, loading, streamActive }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!result) return;
    const text = `Доминирующая эмоция: ${emotionLabels[result.dominant]}\n` +
      Object.entries(result.emotions)
        .map(([e, v]) => `${emotionLabels[e as keyof typeof emotionLabels]}: ${(v * 100).toFixed(0)}%`)
        .join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!streamActive) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-3xl p-8 text-center text-white flex flex-col items-center justify-center h-full min-h-[400px]"
      >
        <div className="p-4 rounded-full bg-white/10 mb-4">
          <Meh size={64} className="text-white/60" />
        </div>
        <p className="text-xl font-medium">Ожидание видеопотока</p>
        <p className="text-white/60 mt-2">Выберите камеру или экран для начала анализа</p>
      </motion.div>
    );
  }

  if (loading && !result) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="glass-card rounded-3xl p-8"
      >
        <div className="animate-pulse space-y-6">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-full bg-white/20" />
            <div className="flex-1 h-10 bg-white/20 rounded" />
          </div>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-white/20" />
                <div className="flex-1 h-4 bg-white/20 rounded" />
                <div className="w-12 h-4 bg-white/20 rounded" />
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    );
  }

  if (!result) return null;

  // === НОВЫЙ БЛОК: обработка случаев, когда эмоции не распознаны ===
  if (!result.emotions) {
    let message = '';
    if (result.dominant === 'No face detected') {
      message = 'Лицо не обнаружено на кадре. Убедитесь, что вы находитесь в кадре и освещение достаточное.';
    } else if (result.dominant === 'No emotion detected') {
      message = 'Не удалось определить эмоцию. Возможно, выражение лица нечеткое или кадр низкого качества.';
    } else {
      message = 'Не удалось распознать эмоции.';
    }
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-3xl p-8 text-center text-white flex flex-col items-center justify-center h-full min-h-[400px]"
      >
        <div className="p-4 rounded-full bg-white/10 mb-4">
          <AlertCircle size={64} className="text-white/60" />
        </div>
        <p className="text-xl font-medium">{message}</p>
      </motion.div>
    );
  }
  // === КОНЕЦ НОВОГО БЛОКА ===

  const dominant = result.dominant;
  const DominantIcon = emotionIcons[dominant as keyof typeof emotionIcons] || Meh;
  const dominantColor = emotionColors[dominant as keyof typeof emotionColors];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass-card rounded-3xl p-6 text-white"
    >
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            className="p-4 rounded-full"
            style={{ backgroundColor: dominantColor + '40' }}
          >
            <DominantIcon size={56} color={dominantColor} />
          </motion.div>
          <div>
            <p className="text-sm uppercase tracking-wider opacity-80">Доминирующая эмоция</p>
            <p className="text-5xl font-bold" style={{ color: dominantColor }}>
              {emotionLabels[dominant]}
            </p>
          </div>
        </div>
        <button
          onClick={handleCopy}
          className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition flex items-center gap-1 text-sm"
        >
          {copied ? <Check size={16} /> : <Copy size={16} />}
          {copied ? 'Скопировано' : 'Копировать'}
        </button>
      </div>

      <div className="space-y-5">
        {Object.entries(result.emotions).map(([emotion, value]) => (
          <CircularProgress
            key={emotion}
            emotion={emotion}
            value={value}
            color={emotionColors[emotion as keyof typeof emotionColors]}
          />
        ))}
      </div>
    </motion.div>
  );
};