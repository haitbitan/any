'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform, Variants } from 'framer-motion';
import MediaRenderer from '@/lib/mediaRenderer';


export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Parallax on scroll — applied only on desktop via reduced transform range
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]); // Reduced from 50% to avoid mobile overflow
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.3, delayChildren: 0.5 }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 }, // Reduced y from 50 to 30 for subtler mobile feel
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 1, ease: "easeOut" }
    }
  };

  return (
    <section
      ref={containerRef}
      className="relative h-[100svh] w-full flex items-center justify-center overflow-hidden bg-black text-white"
    /* 100svh = "small viewport height" — accounts for mobile browser chrome */
    >
      {/* Background Image with Ken Burns */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <MediaRenderer
          src="/images/3462169.jpg"
          alt="Lumina Hero Background"
          priority={true}
          className="object-cover animate-kenburns"
          sizes="100vw"
        />
      </div>

      {/* Dark Overlay */}
      <div className="absolute inset-0 z-10 bg-black/60 bg-gradient-to-t from-black via-transparent to-black/30" />

      {/* Content Container */}
      <motion.div
        style={{ y, opacity }}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-20 flex flex-col items-center text-center px-6 pt-12 safe-top"
      >
        {/* Fluid hero title — no abrupt size jump between breakpoints */}
        <motion.h1
          variants={itemVariants}
          className="text-fluid-hero font-bold tracking-tighter mb-4 md:mb-6"
        >
          A LOVE STORY
        </motion.h1>

        {/* Fluid subtitle */}
        <motion.p
          variants={itemVariants}
          className="text-fluid-lg md:text-fluid-xl font-light tracking-wide text-zinc-300 max-w-xs md:max-w-2xl mb-8 md:mb-12"
        >
          A cinematic journey through the hidden layers of our reality.
          Discover what lies beyond the twilight.
          <br />
          Please Scroll Down
        </motion.p>
      </motion.div>
    </section>
  );
}
