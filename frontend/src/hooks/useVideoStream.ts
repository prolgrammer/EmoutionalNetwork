import { useState, useRef, useCallback } from 'react';

export type StreamType = 'camera' | 'screen' | null;

export const useVideoStream = () => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [streamType, setStreamType] = useState<StreamType>(null);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const startCamera = useCallback(async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) videoRef.current.srcObject = mediaStream;
      setStream(mediaStream);
      setStreamType('camera');
      setError(null);
    } catch (err) {
      setError('Не удалось получить доступ к камере');
      console.error(err);
    }
  }, []);

  const startScreen = useCallback(async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
      if (videoRef.current) videoRef.current.srcObject = mediaStream;
      setStream(mediaStream);
      setStreamType('screen');
      setError(null);
      // Останавливаем поток, если пользователь закрыл окно выбора
      mediaStream.getVideoTracks()[0].onended = () => {
        stopStream();
      };
    } catch (err) {
      setError('Не удалось захватить экран');
      console.error(err);
    }
  }, []);

  const stopStream = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
      setStreamType(null);
      if (videoRef.current) videoRef.current.srcObject = null;
    }
  }, [stream]);

  return {
    videoRef,
    stream,
    streamType,
    error,
    startCamera,
    startScreen,
    stopStream,
  };
};