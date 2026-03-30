import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
  Cell,
} from 'recharts';
import { Download, Trash2, TrendingUp } from 'lucide-react';
import { EmotionResult, emotionLabels, emotionColors } from '../types/emotion';

interface Props {
  history: Array<{ timestamp: number; result: EmotionResult }>;
  onClear: () => void;
  onExport: () => void;
}

export const StatisticsPanel: React.FC<Props> = ({ history, onClear, onExport }) => {
  // Отфильтруем историю, оставляя только записи с emotions (не null)
  const validHistory = useMemo(() => history.filter(item => item.result.emotions !== null), [history]);

  // Подсчёт частоты доминирующих эмоций (используем всю историю, но для barData учитываем только dominant)
  const barData = useMemo(() => {
    const counts: Record<string, number> = {};
    history.forEach(({ result }) => {
      const e = result.dominant;
      counts[e] = (counts[e] || 0) + 1;
    });
    return Object.entries(counts).map(([emotion, count]) => ({
      emotion: emotionLabels[emotion as keyof typeof emotionLabels] || emotion,
      count,
      color: emotionColors[emotion as keyof typeof emotionColors] || '#888',
    }));
  }, [history]);

  // Данные для графика (последние 20 точек) – используем только валидные записи
  const lineData = useMemo(() => {
    return validHistory.slice(-20).map((item, idx) => ({
      index: idx + 1,
      ...item.result.emotions!,
    }));
  }, [validHistory]);

  // Средние значения эмоций за сессию – только по валидным записям
  const averages = useMemo(() => {
    if (validHistory.length === 0) return null;
    const sum: Record<string, number> = {};
    Object.keys(emotionLabels).forEach(e => (sum[e] = 0));
    validHistory.forEach(({ result }) => {
      if (result.emotions) {
        Object.entries(result.emotions).forEach(([e, v]) => {
          sum[e] += v;
        });
      }
    });
    const avg: Record<string, number> = {};
    Object.keys(emotionLabels).forEach(e => {
      avg[e] = sum[e] / validHistory.length;
    });
    return avg;
  }, [validHistory]);

  if (history.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-3xl p-8 text-center text-white flex flex-col items-center justify-center h-full min-h-[400px]"
      >
        <TrendingUp size={48} className="text-white/40 mb-4" />
        <p className="text-xl font-medium">Нет данных для статистики</p>
        <p className="text-white/60 mt-2">Запустите анализ эмоций, чтобы увидеть статистику</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card rounded-3xl p-6 text-white space-y-8"
    >
      <div className="flex justify-between items-center flex-wrap gap-3">
        <h2 className="text-2xl font-bold">Статистика сессии</h2>
        <div className="flex gap-2">
          <button
            onClick={onExport}
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition flex items-center gap-2 text-sm"
            title="Экспорт в CSV"
          >
            <Download size={18} />
            <span className="hidden sm:inline">Экспорт</span>
          </button>
          <button
            onClick={onClear}
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition flex items-center gap-2 text-sm"
            title="Очистить историю"
          >
            <Trash2 size={18} />
            <span className="hidden sm:inline">Очистить</span>
          </button>
        </div>
      </div>

      {/* Краткая сводка (средние) */}
      {averages && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-7 gap-3">
          {Object.entries(averages).map(([emotion, avg]) => (
            <div
              key={emotion}
              className="bg-white/5 rounded-xl p-2 text-center"
              style={{ borderLeft: `3px solid ${emotionColors[emotion as keyof typeof emotionColors]}` }}
            >
              <p className="text-xs opacity-80">{emotionLabels[emotion as keyof typeof emotionLabels]}</p>
              <p className="text-lg font-bold">{(avg * 100).toFixed(0)}%</p>
            </div>
          ))}
        </div>
      )}

      {/* Гистограмма */}
      <div>
        <h3 className="text-lg font-semibold mb-3">Распределение доминирующих эмоций</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={barData} layout="vertical" margin={{ left: 40 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff30" />
            <XAxis type="number" stroke="#fff" />
            <YAxis type="category" dataKey="emotion" stroke="#fff" width={100} />
            <Tooltip
              contentStyle={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '12px' }}
              labelStyle={{ color: '#fff' }}
            />
            <Bar dataKey="count" radius={[0, 8, 8, 0]}>
              {barData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Линейный график */}
      {validHistory.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-3">Динамика эмоций (последние {lineData.length} замеров)</h3>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={lineData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff30" />
              <XAxis dataKey="index" stroke="#fff" />
              <YAxis stroke="#fff" domain={[0, 1]} />
              <Tooltip
                contentStyle={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '12px' }}
                labelStyle={{ color: '#fff' }}
                formatter={(value: number) => `${(value * 100).toFixed(0)}%`}
              />
              <Legend wrapperStyle={{ color: '#fff' }} />
              {Object.keys(emotionLabels).map((emotion) => (
                <Line
                  key={emotion}
                  type="monotone"
                  dataKey={emotion}
                  stroke={emotionColors[emotion as keyof typeof emotionColors]}
                  strokeWidth={2}
                  dot={false}
                  isAnimationActive={false}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </motion.div>
  );
};