'use client';

import React from 'react';
import MediaRenderer from '@/lib/mediaRenderer';
import { StoryScene as StorySceneType } from '@/data/story';

interface StorySceneProps {
  story: StorySceneType;
}

function StoryScene({ story }: StorySceneProps) {
  return (
    <section
      id={`scene-${story.id}`}
      className="relative min-h-screen w-full overflow-hidden bg-black text-white"
    >
      {/* Background Media */}
      <div className="absolute inset-0">
        {story.video ? (
          <video
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

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Content */}
      <div className="relative z-10 flex min-h-screen items-end">
        <div className="w-full max-w-3xl p-6 md:p-12">
          <h2
            className="text-4xl md:text-6xl font-bold mb-4"
            style={{
              textShadow: '0 2px 20px rgba(0,0,0,0.7)',
            }}
          >
            {story.title}
          </h2>

          <p className="text-sm uppercase tracking-[0.3em] text-zinc-300 mb-4">
            {story.subtitle}
          </p>

          {story.description && (
            <p className="text-base md:text-lg text-zinc-200 leading-relaxed">
              {story.description}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

export default React.memo(StoryScene);