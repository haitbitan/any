'use client';

import React, { useEffect, useMemo, useRef } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { motion, type Variants } from 'framer-motion';
import MediaRenderer from '@/lib/mediaRenderer';
import { StoryScene as StorySceneType } from '@/data/story';

gsap.registerPlugin(ScrollTrigger);

interface StorySceneProps {
  story: StorySceneType;
}

function StoryScene({ story }: StorySceneProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const initialized = useRef(false);

  const titleWords = useMemo(() => story.title.split(' '), [story.title]);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const wordVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  useEffect(() => {
    const section = sectionRef.current;
    const media = mediaRef.current;

    if (!section || !media) return;

    // Prevent React Strict Mode double-init issues (Next dev)
    if (initialized.current) return;
    initialized.current = true;

    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    // Skip heavy effects on constrained environments
    if (isMobile || prefersReducedMotion) {
      gsap.set(media, { opacity: 1, filter: 'none' });
      return;
    }

    const ctx = gsap.context(() => {
      // Initial state (cheap GPU state)
      gsap.set(media, {
        opacity: 0,
        filter: 'blur(20px)',
        willChange: 'opacity, transform',
      });

      let trigger: ScrollTrigger;

      // Delay measurement until layout stabilizes
      const init = () => {
        trigger = ScrollTrigger.create({
          trigger: section,
          start: 'top 75%',
          end: 'bottom 25%',

          onEnter: () => {
            gsap.to(media, {
              opacity: 1,
              filter: 'blur(0px)',
              duration: 0.7,
              ease: 'power2.out',
              overwrite: 'auto',
            });
          },

          onLeave: () => {
            gsap.to(media, {
              opacity: 0,
              filter: 'blur(20px)',
              duration: 0.7,
              ease: 'power2.in',
              overwrite: 'auto',
            });
          },

          onEnterBack: () => {
            gsap.to(media, {
              opacity: 1,
              filter: 'blur(0px)',
              duration: 0.7,
              ease: 'power2.out',
              overwrite: 'auto',
            });
          },

          onLeaveBack: () => {
            gsap.to(media, {
              opacity: 0,
              filter: 'blur(20px)',
              duration: 0.7,
              ease: 'power2.in',
              overwrite: 'auto',
            });
          },
        });

        ScrollTrigger.refresh();
      };

      // wait for layout + media decode
      const raf = requestAnimationFrame(init);

      return () => {
        cancelAnimationFrame(raf);
        trigger?.kill();
      };
    }, section);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <section
      id={`scene-${story.id}`}
      ref={sectionRef}
      className="relative h-[100svh] w-full overflow-hidden bg-black text-white"
    >
      {/* Background Media */}
      <div ref={mediaRef} className="absolute inset-0 z-0 origin-center">
        {story.video ? (
          <video
            ref={videoRef}
            src={story.video}
            muted
            loop
            playsInline
            preload="metadata"
            className="w-full h-full object-cover"
            poster={story.image}
          />
        ) : story.image ? (
          <MediaRenderer
            src={story.image}
            alt={story.title}
            className="object-cover"
            sizes="100vw"
          />
        ) : null}
      </div>

      {/* overlays */}
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/40 via-transparent to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 z-10 h-56 bg-gradient-to-t from-black/90 to-transparent pointer-events-none" />

      {/* content */}
      <div className="absolute bottom-10 left-20 right-0 z-20 flex flex-col items-start text-left px-8 pb-12 md:px-16 md:pb-16 max-w-2xl">
        <motion.h2
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.4 }}
          className="text-fluid-scene font-bold tracking-tight leading-[0.95] mb-8 flex flex-wrap"
        >
          {titleWords.map((word, i) => (
            <motion.span
              key={i}
              variants={wordVariants}
              className="mr-[0.25em] inline-block"
            >
              {word}
            </motion.span>
          ))}
        </motion.h2>

        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="w-12 h-px bg-white/60 mb-6 origin-left"
        />

        <motion.span
          initial={{ opacity: 0, x: -12 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="text-white text-fluid-xs uppercase tracking-[0.35em] mb-8"
        >
          {story.subtitle}
        </motion.span>

        {story.description && (
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-sm md:text-base text-zinc-300 leading-relaxed"
          >
            {story.description}
          </motion.p>
        )}
      </div>
    </section>
  );
}

export default React.memo(StoryScene);