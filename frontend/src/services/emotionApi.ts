import { Emotion, EmotionResult } from '../types/emotion';

// Заглушка API: возвращает случайные вероятности с доминирующей эмоцией
export const analyzeEmotion = async (): Promise<EmotionResult> => {
  // Имитация задержки сети
  await new Promise(resolve => setTimeout(resolve, 600));

  const emotionsList: Emotion[] = [
    'neutral', 'happiness', 'sadness', 'anger', 'surprise', 'fear', 'disgust'
  ];

  // Генерируем случайные вероятности так, чтобы сумма была примерно 1
  let raw: number[] = emotionsList.map(() => Math.random());
  const sum = raw.reduce((a, b) => a + b, 0);
  const emotions = raw.map(v => v / sum) as number[];

  // Искусственно усиливаем одну эмоцию (чтобы была явная доминанта)
  const dominantIndex = Math.floor(Math.random() * emotionsList.length);
  emotions[dominantIndex] += 0.3;
  // Нормируем снова
  const newSum = emotions.reduce((a, b) => a + b, 0);
  const normalized = emotions.map(v => v / newSum);

  const emotionRecord = emotionsList.reduce((acc, emotion, idx) => {
    acc[emotion] = normalized[idx];
    return acc;
  }, {} as Record<Emotion, number>);

  const dominant = emotionsList[dominantIndex];

  return { emotions: emotionRecord, dominant };
};