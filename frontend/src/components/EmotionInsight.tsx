import React from 'react';
import { motion } from 'framer-motion';
import { Emotion } from '../types/emotion';
import { Lightbulb } from 'lucide-react';

interface Props {
  emotion: Emotion; // Если тип Emotion не включает 'No face detected' и 'No emotion detected', временно можно использовать string
}

const insights: Record<Emotion, { title: string; advice: string }> = {
  neutral: {
    title: 'Нейтральное состояние',
    advice: 'Спокойствие – это нормально. Попробуйте сделать глубокий вдох и сосредоточиться на текущем моменте.',
  },
  happiness: {
    title: 'Радость',
    advice: 'Отличное настроение! Поделитесь позитивом с окружающими или запишите, что вас порадовало.',
  },
  sadness: {
    title: 'Грусть',
    advice: 'Позвольте себе почувствовать грусть. Поговорите с близким человеком или послушайте любимую музыку.',
  },
  anger: {
    title: 'Гнев',
    advice: 'Сделайте паузу, глубоко подышите. Попробуйте физическую активность, чтобы снять напряжение.',
  },
  surprise: {
    title: 'Удивление',
    advice: 'Используйте это состояние для изучения нового. Запишите, что вас удивило.',
  },
  fear: {
    title: 'Страх',
    advice: 'Назовите свой страх вслух. Напомните себе, что вы в безопасности.',
  },
  disgust: {
    title: 'Отвращение',
    advice: 'Попробуйте переключить внимание на приятные вещи. Создайте комфортное окружение.',
  },
};

export const EmotionInsight: React.FC<Props> = ({ emotion }) => {
  // === НОВЫЕ ПРОВЕРКИ ===
  if (emotion === 'No face detected') {
    return (
      <div className="glass-card rounded-3xl p-6 text-center text-white">
        <p className="text-lg">Лицо не обнаружено на кадре. Убедитесь, что вы находитесь в кадре и освещение достаточное.</p>
      </div>
    );
  }
  if (emotion === 'No emotion detected') {
    return (
      <div className="glass-card rounded-3xl p-6 text-center text-white">
        <p className="text-lg">Не удалось определить эмоцию. Возможно, выражение лица нечеткое или кадр низкого качества.</p>
      </div>
    );
  }
  // === КОНЕЦ НОВЫХ ПРОВЕРОК ===

  const insight = insights[emotion];
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.3 }}
      className="glass-card rounded-3xl p-6 flex flex-col gap-4"
    >
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-full bg-yellow-500/20">
          <Lightbulb className="text-yellow-400" size={28} />
        </div>
        <h3 className="text-2xl font-bold text-white">{insight.title}</h3>
      </div>
      <p className="text-white/80 text-lg leading-relaxed">{insight.advice}</p>
    </motion.div>
  );
};