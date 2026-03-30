import React, { RefObject } from 'react';
import { motion } from 'framer-motion';
import { Camera, Monitor, Loader2 } from 'lucide-react';

interface Props {
  videoRef: RefObject<HTMLVideoElement>;
  streamActive: boolean;
  streamType: 'camera' | 'screen' | null;
}

export const VideoPlayer: React.FC<Props> = ({ videoRef, streamActive, streamType }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="relative rounded-3xl overflow-hidden shadow-2xl group bg-black/40 backdrop-blur-sm"
    >
      <div className="relative aspect-video">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover transform scale-x-[-1]" // зеркалирование
        />

        {!streamActive && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm gap-4">
            <div className="p-4 rounded-full bg-white/10 animate-pulse">
              <Camera size={48} className="text-white/60" />
            </div>
            <p className="text-white text-xl font-medium">Нет активного потока</p>
            <p className="text-white/60 text-sm">Выберите источник видео выше</p>
          </div>
        )}

        {streamActive && streamType && (
          <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-md text-white text-sm">
            {streamType === 'camera' ? <Camera size={16} /> : <Monitor size={16} />}
            <span>{streamType === 'camera' ? 'Камера' : 'Экран'}</span>
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          </div>
        )}
      </div>
    </motion.div>
  );
};