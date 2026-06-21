import { useState, useCallback, useEffect } from 'react';

/**
 * Hook to manage mute/unmute state for a given HTMLAudioElement reference.
 * Persists the muted state in localStorage so playback preference survives page reloads.
 */
export function useAudioToggle(audioRef: React.RefObject<HTMLAudioElement>) {
  const [isMuted, setIsMuted] = useState<boolean>(true);

  // Load persisted state on mount
  useEffect(() => {
    const stored = localStorage.getItem('luminaAudioMuted');
    if (stored !== null) {
      setIsMuted(stored === 'true');
    }
  }, []);

  // Keep localStorage in sync
  useEffect(() => {
    localStorage.setItem('luminaAudioMuted', String(isMuted));
  }, [isMuted]);

  const toggleAudio = useCallback(() => {
    if (!audioRef.current) return;
    if (isMuted) {
      audioRef.current.play().catch(() => { });
      setIsMuted(false);
    } else {
      audioRef.current.pause();
      setIsMuted(true);
    }
  }, [audioRef, isMuted]);

  return { isMuted, toggleAudio };
}
