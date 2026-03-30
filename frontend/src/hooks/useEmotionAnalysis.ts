import { useState, useEffect, useCallback, useRef } from 'react';

// Список всех возможных эмоций (порядок не важен, важен набор)
const ALL_EMOTIONS = ['neutral', 'happiness', 'sadness', 'anger', 'surprise', 'fear', 'disgust'];

// Функция нормализации: для отсутствующих эмоций подставляет 0
const normalizeEmotions = (emotions) => {
  if (!emotions) return null;
  const normalized = {};
  for (const emotion of ALL_EMOTIONS) {
    normalized[emotion] = emotions[emotion] ?? 0;
  }
  return normalized;
};

export const useEmotionAnalysis = (active, intervalMs, videoRef) => {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const intervalRef = useRef(null);
  const sessionIdRef = useRef(Date.now().toString());

  const captureFrame = useCallback(async () => {
    if (!videoRef.current || videoRef.current.readyState !== 4) return null;
    const canvas = document.createElement('canvas');
    const video = videoRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    return new Promise((resolve) => {
      canvas.toBlob((blob) => resolve(blob), 'image/jpeg', 0.9);
    });
  }, [videoRef]);

  const analyzeFrame = useCallback(async (blob) => {
    const formData = new FormData();
    formData.append('file', blob, 'frame.jpg');
    formData.append('session_id', sessionIdRef.current);
    formData.append('accumulate', 'true');

    try {
      const response = await fetch('http://localhost:8000/analyze', {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Server error: ${response.status} - ${errorText}`);
      }
      const data = await response.json();
      // Нормализуем эмоции перед сохранением
      if (data.emotions) {
        data.emotions = normalizeEmotions(data.emotions);
      }
      setResult(data);
      setHistory(prev => {
        const newHistory = [...prev, { timestamp: Date.now(), result: data }];
        return newHistory.length > 50 ? newHistory.slice(-50) : newHistory;
      });
    } catch (err) {
      console.error('Analysis error:', err);
      setResult(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearHistory = useCallback(async () => {
    setHistory([]);
    try {
      await fetch(`http://localhost:8000/clear_session/${sessionIdRef.current}`, {
        method: 'POST',
      });
    } catch (err) {
      console.error('Error clearing session:', err);
    }
  }, []);

  const exportToCSV = useCallback(() => {
    if (history.length === 0) return;
    const headers = ['timestamp', 'dominant', 'confidence', 'faces_count', ...ALL_EMOTIONS];
    const rows = history.map(({ timestamp, result }) => {
      const row = [new Date(timestamp).toLocaleString(), result.dominant, result.confidence || '', result.faces_count || ''];
      if (result.emotions) {
        for (const emotion of ALL_EMOTIONS) {
          row.push(result.emotions[emotion] ?? 0);
        }
      }
      return row.join(',');
    });
    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `emotion_analysis_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }, [history]);

  useEffect(() => {
    if (!active) {
      setResult(null);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    const analyze = async () => {
      if (loading) return;
      setLoading(true);
      const blob = await captureFrame();
      if (blob) {
        await analyzeFrame(blob);
      } else {
        setLoading(false);
      }
    };

    analyze();
    intervalRef.current = setInterval(analyze, intervalMs);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [active, intervalMs, captureFrame, analyzeFrame, loading]);

  return { result, loading, history, clearHistory, exportToCSV };
};