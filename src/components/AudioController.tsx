'use client';

import { useState, useEffect, useRef } from 'react';
import { FiVolume2, FiVolumeX } from 'react-icons/fi';
import { motion } from 'framer-motion';

export default function AudioController() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [isHovered, setIsHovered] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const fadeInterval = useRef<NodeJS.Timeout | null>(null);

  // Initialize audio volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isPlaying ? volume : 0;
    }
  }, []);

  const fadeAudio = (targetVolume: number, duration: number = 1000) => {
    if (!audioRef.current) return;

    if (fadeInterval.current) clearInterval(fadeInterval.current);

    const startVolume = audioRef.current.volume;
    const distance = targetVolume - startVolume;
    const steps = 20;
    const stepTime = duration / steps;
    const volumeStep = distance / steps;

    let currentStep = 0;

    if (targetVolume > 0 && audioRef.current.paused) {
      audioRef.current.play().catch(() => { });
    }

    fadeInterval.current = setInterval(() => {
      currentStep++;
      if (audioRef.current) {
        const newVol = Math.max(0, Math.min(1, startVolume + (volumeStep * currentStep)));
        audioRef.current.volume = newVol;
      }

      if (currentStep >= steps) {
        if (fadeInterval.current) clearInterval(fadeInterval.current);
        if (targetVolume === 0 && audioRef.current) {
          audioRef.current.pause();
        }
      }
    }, stepTime);
  };

  const togglePlay = () => {
    if (isPlaying) {
      setIsPlaying(false);
      fadeAudio(0);
    } else {
      setIsPlaying(true);
      fadeAudio(volume);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (isPlaying && audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  return (
    <div
      className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-50 flex items-center gap-3 bg-black/40 backdrop-blur-md p-2.5 md:p-3 rounded-full border border-white/10 safe-bottom"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <audio
        ref={audioRef}
        src="/audio/ambient-theme.mp3"
        loop
        preload="auto"
      />

      <motion.div
        initial={{ width: 0, opacity: 0 }}
        animate={{
          width: isHovered ? 80 : 0,
          opacity: isHovered ? 1 : 0
        }}
        className="overflow-hidden flex items-center"
      >
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={handleVolumeChange}
          className="w-full h-1 bg-white/30 rounded-lg appearance-none cursor-pointer accent-white"
        />
      </motion.div>

      <button
        onClick={togglePlay}
        className="text-white hover:text-zinc-300 transition-colors flex-shrink-0"
        aria-label={isPlaying ? "Pause music" : "Play music"}
      >
        {isPlaying && volume > 0 ? <FiVolume2 size={24} /> : <FiVolumeX size={24} />}
      </button>
    </div>
  );
}
