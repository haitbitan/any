import Image from 'next/image';
import { BLUR_DATA_URL } from '@/lib/imageUtils';
import React from 'react';

interface MediaRendererProps {
  src: string;
  alt: string;
  isVideo?: boolean;
  priority?: boolean;
  className?: string;
  sizes?: string;
}

/**
 * Renders either an image (using Next.js Image) or a video element.
 * Handles blur placeholder, responsive sizes, and optional priority loading.
 */
const MediaRenderer: React.FC<MediaRendererProps> = ({
  src,
  alt,
  isVideo = false,
  priority = false,
  className = '',
  sizes = '100vw',
}) => {
  if (isVideo) {
    return (
      <video
        src={src}
        autoPlay
        loop
        muted
        playsInline
        className={className}
        poster={src} // fallback poster same as src; could be replaced if needed
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      priority={priority}
      sizes={sizes}
      quality={85}
      placeholder="blur"
      blurDataURL={BLUR_DATA_URL}
      className={className}
    />
  );
};

export default MediaRenderer;
