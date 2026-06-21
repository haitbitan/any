'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import Link from 'next/link';
import { FiMenu, FiX } from 'react-icons/fi';

export default function Navigation() {
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useMotionValueEvent(scrollY, 'change', (latest) => {
    const previous = scrollY.getPrevious() ?? 0;

    if (latest < 100) {
      setHidden(true);
      return;
    }

    if (latest > previous && latest > 150) {
      setHidden(true);
    } else {
      setHidden(false);
    }
  });

  // Close menu on Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMenuOpen) {
        setIsMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isMenuOpen]);

  // Lock body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isMenuOpen]);

  return null;
  <>
    <motion.nav
      variants={{
        visible: { y: 0, opacity: 1 },
        hidden: { y: '-100%', opacity: 0 },
      }}
      animate={hidden ? 'hidden' : 'visible'}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-0 inset-x-0 z-50 px-6 py-6 md:px-12 flex justify-between items-center mix-blend-difference text-white"
      aria-label="Main navigation"
    >
      <Link href="/" className="text-xl tracking-widest uppercase font-semibold" aria-current="page">
        Lumina
      </Link>

      {/* Open menu button – keyboard accessible */}
      <button
        ref={menuButtonRef}
        onClick={() => setIsMenuOpen(true)}
        className="text-white hover:text-gray-300 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        aria-label="Open menu"
        aria-haspopup="true"
        aria-controls="main-menu"
      >
        <FiMenu size={28} />
      </button>
    </motion.nav>

    {/* Full screen menu overlay */}
    <motion.div
      id="main-menu"
      initial={{ opacity: 0, clipPath: 'circle(0% at top right)' }}
      animate={{
        opacity: isMenuOpen ? 1 : 0,
        clipPath: isMenuOpen ? 'circle(150% at top right)' : 'circle(0% at top right)',
      }}
      transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
      className="fixed inset-0 z-[60] bg-zinc-950 flex flex-col items-center justify-center pointer-events-none data-[open=true]:pointer-events-auto"
      data-open={isMenuOpen}
      role="dialog"
      aria-modal="true"
      aria-label="Site menu"
    >
      <button
        ref={closeButtonRef}
        onClick={() => setIsMenuOpen(false)}
        className="absolute top-6 right-6 md:top-6 md:right-12 text-white hover:text-gray-400 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        aria-label="Close menu"
      >
        <FiX size={32} />
      </button>

      <div className="flex flex-col gap-8 text-center">
        {['Stories', 'Director', 'Journal', 'Contact'].map((item, i) => (
          <motion.div
            key={item}
            initial={{ y: 40, opacity: 0 }}
            animate={isMenuOpen ? { y: 0, opacity: 1 } : { y: 40, opacity: 0 }}
            transition={{ delay: isMenuOpen ? 0.3 + i * 0.1 : 0, duration: 0.5 }}
          >
            <Link
              href={`#${item.toLowerCase()}`}
              onClick={() => setIsMenuOpen(false)}
              className="text-4xl md:text-6xl font-light tracking-tight hover:text-gray-400 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              tabIndex={isMenuOpen ? 0 : -1}
            >
              {item}
            </Link>
          </motion.div>
        ))}
      </div>
    </motion.div>
  </>
    ;
}
