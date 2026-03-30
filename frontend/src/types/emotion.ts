export type Emotion = 'neutral' | 'happiness' | 'sadness' | 'anger' | 'surprise' | 'fear' | 'disgust';

export interface EmotionResult {
  dominant: Emotion | 'No face detected' | 'No emotion detected';
  emotions: Record<Emotion, number> | null;
  faces_count?: number;
  confidence?: number;
}

export const emotionLabels: Record<Emotion, string> = {
  neutral: 'Нейтральная',
  happiness: 'Радость',
  sadness: 'Грусть',
  anger: 'Гнев',
  surprise: 'Удивление',
  fear: 'Страх',
  disgust: 'Отвращение',
};

export const emotionColors: Record<Emotion, string> = {
  neutral: '#9CA3AF',
  happiness: '#FBBF24',
  sadness: '#60A5FA',
  anger: '#EF4444',
  surprise: '#8B5CF6',
  fear: '#A78BFA',
  disgust: '#10B981',
};