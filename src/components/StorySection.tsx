import React, { useEffect, useRef, useMemo } from 'react';
import MediaRenderer from '@/lib/mediaRenderer';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { StoryScene } from '@/data/story';
import { FiVolume2, FiVolumeX } from 'react-icons/fi';
import { useState } from 'react';

interface StorySectionProps {
  story: StoryScene;
  index: number;
}

function StorySection({ story, index }: StorySectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isMuted, setIsMuted] = useState(true);

  const toggleAudio = () => {
    if (!audioRef.current) return;

    if (isMuted) {
      audioRef.current.play().catch(() => { });
      setIsMuted(false);
    } else {
      audioRef.current.pause();
      setIsMuted(true);
    }
  };

  const isEven = index % 2 === 0;

  useEffect(() => {
    const section = sectionRef.current;
    const media = mediaRef.current;
    const content = contentRef.current;

    if (!section || !media || !content) return;

    gsap.fromTo(
      media,
      { yPercent: -20 },
      {
        yPercent: 20,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      }
    );

    gsap.fromTo(
      content,
      { opacity: 0, y: 100 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 60%',
          toggleActions: 'play none none reverse',
        },
      }
    );

    if (audioRef.current) {
      ScrollTrigger.create({
        trigger: section,
        start: 'top center',
        end: 'bottom center',
        onEnter: () => {
          if (!isMuted) audioRef.current?.play().catch(() => { });
        },
        onLeave: () => audioRef.current?.pause(),
        onEnterBack: () => {
          if (!isMuted) audioRef.current?.play().catch(() => { });
        },
        onLeaveBack: () => audioRef.current?.pause(),
      });
    }

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, [isMuted]);

  const titleWords = useMemo(() => story.title.split(' '), [story.title]);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen w-full flex items-center justify-center py-24 overflow-hidden bg-black text-white"
      id={`story-${story.id}`}
    >
      <div
        className={`container mx-auto px-6 md:px-12 flex flex-col ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'
          } items-center gap-16 md:gap-24 relative z-10`}
      >
        {/* Media Container */}
        <div className="w-full md:w-1/2 aspect-[4/5] relative overflow-hidden rounded-sm group">
          <div className="absolute inset-0 bg-zinc-900" />
          <div ref={mediaRef} className="absolute -inset-10 opacity-80">
            {story.video ? (
              <video
                src={story.video}
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
                poster={story.image}
              />
            ) : story.image ? (
              <MediaRenderer
                src={story.image}
                alt={story.title}
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            ) : null}
          </div>
          <div className="absolute inset-0 border border-white/10 transition-colors duration-500 group-hover:border-white/30" />
          {/* Audio Toggle Button */}
          {story.audio && (
            <button
              onClick={toggleAudio}
              className="absolute bottom-4 right-4 p-3 bg-black/50 backdrop-blur-md rounded-full text-white hover:bg-white hover:text-black transition-all"
              aria-label={isMuted ? 'Unmute scene audio' : 'Mute scene audio'}
            >
              {isMuted ? <FiVolumeX size={20} /> : <FiVolume2 size={20} />}
            </button>
          )}
        </div>

        {/* Content Container */}
        <div ref={contentRef} className="w-full md:w-1/2 flex flex-col justify-center">
          <div className="flex items-center gap-4 mb-6">
            <span className="text-zinc-500 font-mono text-sm tracking-widest">
              {String(story.id).padStart(2, '0')}
            </span>
            <div className="h-[1px] w-12 bg-zinc-700" />
            <span className="text-zinc-400 text-xs tracking-[0.2em] uppercase">
              {story.subtitle}
            </span>
          </div>

          <h2 className="text-4xl md:text-6xl font-semibold tracking-tight mb-8">
            {story.title}
          </h2>

          <p className="text-lg md:text-xl text-zinc-400 font-light leading-relaxed max-w-xl">
            {story.description}
          </p>

          {/* Hidden Audio Element */}
          {story.audio && <audio ref={audioRef} src={story.audio} loop preload="auto" />}
        </div>
      </div>
    </section>
  );
}

export default React.memo(StorySection);






