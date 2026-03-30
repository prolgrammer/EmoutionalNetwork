export type Emotion = 'neutral' | 'happiness' | 'sadness' | 'anger' | 'surprise' | 'fear' | 'disgust';

export interface EmotionResult {
  dominant: Emotion | 'No face detected' | 'No emotion detected';
  emotions: Record<Emotion, number> | null;
  faces_count?: number;
  confidence?: number;
}

const emotionsList: Emotion[] = [
  'neutral', 'happiness', 'sadness', 'anger', 'surprise', 'fear', 'disgust',
];

// Храним предыдущие значения для плавности
let prevEmotions: Record<Emotion, number> | null = null;

function generateRandom(): Record<Emotion, number> {
  let raw = emotionsList.map(() => Math.random());
  const sum = raw.reduce((a, b) => a + b, 0);
  const normalized = raw.map(v => v / sum);
  const result = {} as Record<Emotion, number>;
  emotionsList.forEach((emotion, i) => {
    result[emotion] = normalized[i];
  });
  return result;
}

export const analyzeEmotion = async (): Promise<EmotionResult> => {
  // Имитация задержки сети
  await new Promise(resolve => setTimeout(resolve, 600));

  if (!prevEmotions) {
    prevEmotions = generateRandom();
  } else {
    const newEmotions = { ...prevEmotions };
    // Плавно меняем значения с небольшим случайным шагом
    for (const e of emotionsList) {
      let delta = (Math.random() - 0.5) * 0.12;
      let newVal = newEmotions[e] + delta;
      newVal = Math.min(0.85, Math.max(0.02, newVal));
      newEmotions[e] = newVal;
    }
    // Нормируем
    const sum = Object.values(newEmotions).reduce((a, b) => a + b, 0);
    for (const e of emotionsList) {
      newEmotions[e] /= sum;
    }
    prevEmotions = newEmotions;
  }

  const dominant = Object.entries(prevEmotions).reduce((a, b) => (a[1] > b[1] ? a : b))[0] as Emotion;

  return { emotions: prevEmotions, dominant };
};