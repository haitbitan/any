'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LoadingScreen() {
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Premium loading logic: artificial progress combined with actual load event
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) {
          clearInterval(interval);
          return 95;
        }
        return prev + Math.floor(Math.random() * 10) + 2;
      });
    }, 100);

    const handleLoad = () => {
      setProgress(100);
      setTimeout(() => {
        setIsLoading(false);
      }, 600); // Give it a brief moment at 100% before fading out
    };

    if (document.readyState === 'complete') {
      handleLoad();
    } else {
      window.addEventListener('load', handleLoad);
    }

    // Safety fallback
    const fallbackTimer = setTimeout(() => {
      handleLoad();
    }, 3500);

    return () => {
      clearInterval(interval);
      clearTimeout(fallbackTimer);
      window.removeEventListener('load', handleLoad);
    };
  }, []);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          key="loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black text-white"
        >
          {/* Logo / Title */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mb-12 text-3xl tracking-[0.5em] font-light uppercase"
          >
            Story
          </motion.div>

          <div className="flex flex-col items-center w-full max-w-[200px]">
            {/* Elegant thin loading line */}
            <div className="w-full h-[1px] bg-white/10 mb-6 overflow-hidden">
              <motion.div
                className="h-full bg-white origin-left"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: Math.min(100, progress) / 100 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              />
            </div>

            {/* Animated Loading Percentage */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-zinc-500 font-mono text-sm tracking-widest"
            >
              {Math.min(100, progress).toString().padStart(3, '0')}%
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
