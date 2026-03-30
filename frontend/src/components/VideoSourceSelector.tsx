import React from 'react';
import { motion } from 'framer-motion';
import { Camera, Monitor, StopCircle } from 'lucide-react';

interface Props {
  onStartCamera: () => void;
  onStartScreen: () => void;
  onStop: () => void;
  isActive: boolean;
}

export const VideoSourceSelector: React.FC<Props> = ({
  onStartCamera,
  onStartScreen,
  onStop,
  isActive,
}) => {
  return (
    <div className="flex flex-wrap gap-4 justify-center">
      {!isActive ? (
        <>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onStartCamera}
            className="px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold flex items-center gap-3 shadow-lg hover:shadow-xl transition-all"
          >
            <Camera size={24} />
            Камера
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onStartScreen}
            className="px-8 py-4 rounded-2xl bg-gradient-to-r from-green-500 to-teal-600 text-white font-semibold flex items-center gap-3 shadow-lg hover:shadow-xl transition-all"
          >
            <Monitor size={24} />
            Экран
          </motion.button>
        </>
      ) : (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onStop}
          className="px-8 py-4 rounded-2xl bg-gradient-to-r from-red-500 to-pink-600 text-white font-semibold flex items-center gap-3 shadow-lg hover:shadow-xl transition-all"
        >
          <StopCircle size={24} />
          Остановить
        </motion.button>
      )}
    </div>
  );
};