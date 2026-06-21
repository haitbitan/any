'use client';
import { useEffect, useRef, useMemo } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { motion, type Variants } from 'framer-motion';
import MediaRenderer from '@/lib/mediaRenderer';
import { StoryScene as StorySceneType } from '@/data/story';
import { DEFAULT_TRANSITION } from '@/constants/animation';
import React from 'react';

interface StorySceneProps {
  story: StorySceneType;
}

function StoryScene({ story }: StorySceneProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const media = mediaRef.current;

    if (!section || !media) return;

    // Skip blur filter on mobile — CSS filter is expensive on low-end GPUs
    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (isReducedMotion) {
      // Simply show the image without animation on reduced motion
      gsap.set(media, { opacity: 1 });
      return;
    }

    gsap.set(media, {
      opacity: 0,
      filter: isMobile ? 'none' : 'blur(20px)',
    });

    ScrollTrigger.create({
      trigger: section,
      start: "top 75%",
      end: "bottom 25%",
      onEnter: () => {
        gsap.to(media, {
          opacity: 1,
          filter: 'blur(0px)',
          duration: isMobile ? 0.5 : 0.8,
          ease: "power2.out",
        });
      },
      onLeave: () => {
        gsap.to(media, {
          opacity: 0,
          filter: isMobile ? 'none' : 'blur(20px)',
          duration: isMobile ? 0.4 : 0.8,
          ease: "power2.in",
        });
      },
      onEnterBack: () => {
        gsap.to(media, {
          opacity: 1,
          filter: 'blur(0px)',
          duration: isMobile ? 0.5 : 0.8,
          ease: "power2.out",
        });
      },
      onLeaveBack: () => {
        gsap.to(media, {
          opacity: 0,
          filter: isMobile ? 'none' : 'blur(20px)',
          duration: isMobile ? 0.4 : 0.8,
          ease: "power2.in",
        });
      }
    });

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  const titleWords = useMemo(() => story.title.split(' '), [story.title]);
  // Shorter delay on mobile so content doesn't feel sluggish
  const subtitleDelay = titleWords.length * 0.08 + 0.3;

  const containerVariants: Variants = {
    hidden: {
      opacity: 0,
    },
    visible: {
      opacity: 1,
    },
  };

  const wordVariants: Variants = {
    hidden: {
      opacity: 0,
      y: 20,
    },
    visible: {
      opacity: 1,
      y: 0,
    },
  };



  return (
    <section
      id={`scene-${story.id}`}
      ref={sectionRef}
      className="relative h-[100svh] w-full overflow-hidden bg-black text-white"
    >
      {/* Background Media */}
      <div
        ref={mediaRef}
        className="absolute inset-0 z-0 origin-center"
      >
        {story.video ? (
          <video
            src={story.video}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover animate-kenburns origin-center"
            poster={story.image}
          />
        ) : story.image ? (
          <MediaRenderer
            src={story.image}
            alt={story.title}
            className="object-cover animate-kenburns origin-center"
            sizes="100vw"
          />
        ) : null}
      </div>

      {/* Subtle dark vignette at top */}
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/40 via-transparent to-transparent pointer-events-none" />

      {/* Blur fadeout at the bottom */}
      <div
        className="absolute bottom-0 left-0 right-0 z-10 h-56 pointer-events-none"
        style={{
          backdropFilter: 'blur(18px)',
          WebkitBackdropFilter: 'blur(18px)',
          maskImage: 'linear-gradient(to top, black 20%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to top, black 20%, transparent 100%)',
        }}
      />
      <div className="absolute inset-0 z-15 feather-effect pointer-events-none"></div>
      {/* Content — anchored to bottom-left */}
      <div className="absolute bottom-10 left-20 right-0 z-20 flex flex-col items-start text-left px-8 pb-12 md:px-16 md:pb-16 max-w-2xl">

        {/* Title: Word by Word */}
        <motion.h2
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.4 }}
          className="text-fluid-scene font-bold tracking-tight leading-[0.95] mb-8 flex flex-wrap"
          style={{ textShadow: '0 2px 24px rgba(0,0,0,0.5)' }}
        >
          {titleWords.map((word, index) => (
            <motion.span
              key={index}
              variants={wordVariants}
              className="mr-[0.25em] last:mr-0 inline-block"
            >
              {word}
            </motion.span>
          ))}
        </motion.h2>

        {/* Thin accent line */}
        <motion.div
          initial={{ scaleX: 0, originX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: false, amount: 0.4 }}
          transition={{ duration: 0.5, delay: 0.15, ease: "easeOut" }}
          className="w-12 h-px bg-white/60 mb-6"
        />

        {/* Subtitle — below the title/accent for editorial feel */}
        <motion.span
          initial={{ opacity: 0, x: -12 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: false, amount: 0.4 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-white text-fluid-xs tracking-[0.35em] uppercase mb-8 font-medium"
        >
          {story.subtitle}
        </motion.span>

        {/* Description */}
        {story.description && (
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.1 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="mt-3 mb-8 text-sm md:text-base font-light tracking-wide text-zinc-300 leading-relaxed"
          >
            {story.description}
          </motion.p>
        )}
      </div>
    </section>
  );
}

export default React.memo(StoryScene);
