'use client';

import { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface SmoothScrollingProps {
  children: React.ReactNode;
}

export default function SmoothScrolling({ children }: SmoothScrollingProps) {
  useEffect(() => {
    // On touch-primary devices (phones/tablets) Lenis smooth scrolling
    // can feel unnatural and fight with native momentum. We skip it entirely
    // and let the browser handle native scroll — which is GPU-accelerated
    // and perfectly optimized on low-end Android.
    const isTouchPrimary = window.matchMedia('(pointer: coarse)').matches;

    if (isTouchPrimary) {
      // Still register ScrollTrigger so GSAP animations work on mobile
      ScrollTrigger.refresh();
      return;
    }

    // Desktop: full Lenis smooth scroll
    const lenis = new Lenis({
      lerp: 0.05,
      wheelMultiplier: 1.2,
      smoothWheel: true,
      syncTouch: true,
      touchMultiplier: 2,
      orientation: 'vertical',
      gestureOrientation: 'vertical',
    });

    // 1. Sync Lenis scroll with GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    // 2. Bind Lenis RAF to GSAP ticker for perfect sync
    const update = (time: number) => { lenis.raf(time * 1000); };
    gsap.ticker.add(update);

    // 3. Disable GSAP lag smoothing to prevent jitter with Lenis
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
      gsap.ticker.remove(update);
    };
  }, []);

  return <>{children}</>;
}
