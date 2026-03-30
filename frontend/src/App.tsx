import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useVideoStream } from './hooks/useVideoStream';
import { useEmotionAnalysis } from './hooks/useEmotionAnalysis';
import { VideoSourceSelector } from './components/VideoSourceSelector';
import { VideoPlayer } from './components/VideoPlayer';
import { EmotionDisplay } from './components/EmotionDisplay';
import { Settings } from './components/Settings';
import { StatisticsPanel } from './components/StatisticsPanel';
import { EmotionInsight } from './components/EmotionInsight';
import { Settings as SettingsIcon, Moon, Sun, BarChart3, Info, Smile } from 'lucide-react';

function App() {
  const [showSettings, setShowSettings] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [analysisInterval, setAnalysisInterval] = useState(2000);
  const [activeTab, setActiveTab] = useState<'emotion' | 'stats' | 'insight'>('emotion');

  const {
    videoRef,
    stream,
    streamType,
    error,
    startCamera,
    startScreen,
    stopStream,
  } = useVideoStream();

  const {
    result,
    loading,
    history,
    clearHistory,
    exportToCSV,
  } = useEmotionAnalysis(!!stream, analysisInterval, videoRef);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <div className={`min-h-screen transition-all duration-500 ${darkMode ? 'dark' : ''}`}>
      <div className="fixed inset-0 bg-gradient-animate -z-10" />
      <div className="fixed inset-0 bg-black/30 dark:bg-black/60 -z-10" />

      <div className="relative z-10 min-h-screen p-4 md:p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <header className="flex flex-col md:flex-row justify-between items-center gap-4">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-5xl md:text-7xl font-bold text-white drop-shadow-lg">
                Анализ эмоций
              </h1>
              <p className="text-white/80 text-lg mt-2">
                Распознавание эмоций по видео с камеры или экрана
              </p>
            </motion.div>

            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleDarkMode}
                className="p-3 rounded-full bg-white/10 backdrop-blur-lg border border-white/20 text-white hover:bg-white/20 transition-all"
              >
                {darkMode ? <Sun size={24} /> : <Moon size={24} />}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowSettings(!showSettings)}
                className="p-3 rounded-full bg-white/10 backdrop-blur-lg border border-white/20 text-white hover:bg-white/20 transition-all"
              >
                <SettingsIcon size={24} />
              </motion.button>
            </div>
          </header>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="glass-card rounded-2xl p-4 text-red-200 border border-red-400/50"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {showSettings && (
              <Settings
                interval={analysisInterval}
                onIntervalChange={setAnalysisInterval}
                onClose={() => setShowSettings(false)}
              />
            )}
          </AnimatePresence>

          <VideoSourceSelector
            onStartCamera={startCamera}
            onStartScreen={startScreen}
            onStop={stopStream}
            isActive={!!stream}
          />

          {/* Табы */}
          <div className="flex gap-2 justify-center">
            {[
              { id: 'emotion', icon: <Smile size={18} />, label: 'Эмоции' },
              { id: 'stats', icon: <BarChart3 size={18} />, label: 'Статистика' },
              { id: 'insight', icon: <Info size={18} />, label: 'Советы' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-5 py-2 rounded-full transition-all flex items-center gap-2 ${
                  activeTab === tab.id
                    ? 'bg-white/20 backdrop-blur-lg text-white shadow-lg'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                {tab.icon}
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            <VideoPlayer
              videoRef={videoRef}
              streamActive={!!stream}
              streamType={streamType}
            />

            <AnimatePresence mode="wait">
              {activeTab === 'emotion' && (
                <motion.div
                  key="emotion"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.2 }}
                >
                  <EmotionDisplay
                    result={result}
                    loading={loading}
                    streamActive={!!stream}
                  />
                </motion.div>
              )}
              {activeTab === 'stats' && (
                <motion.div
                  key="stats"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <StatisticsPanel
                    history={history}
                    onClear={clearHistory}
                    onExport={exportToCSV}
                  />
                </motion.div>
              )}
              {activeTab === 'insight' && (
                <motion.div
                  key="insight"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  {result ? (
                    <EmotionInsight emotion={result.dominant} />
                  ) : (
                    <div className="glass-card rounded-3xl p-8 text-center text-white flex flex-col items-center justify-center h-full min-h-[400px]">
                      <Info size={48} className="text-white/40 mb-4" />
                      <p className="text-xl font-medium">Нет данных для совета</p>
                      <p className="text-white/60 mt-2">Запустите анализ эмоций, чтобы получить рекомендации</p>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <footer className="text-center text-white/60 text-sm py-8">
            <p>© 2025 Эмоциональный анализ.</p>
          </footer>
        </div>
      </div>
    </div>
  );
}

export default App;