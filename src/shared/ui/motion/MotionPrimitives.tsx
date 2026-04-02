'use client';

import type { PropsWithChildren } from 'react';
import { useEffect, useState } from 'react';
import {
  AnimatePresence,
  motion,
  type Variants,
  useReducedMotion,
} from 'motion/react';

type AnimatedPageProps = PropsWithChildren<{
  className?: string;
}>;

type FadeInProps = PropsWithChildren<{
  className?: string;
  delay?: number;
}>;

type StaggerGroupProps = PropsWithChildren<{
  className?: string;
  delayChildren?: number;
  staggerChildren?: number;
}>;

const pageVariants: Variants = {
  initial: { opacity: 0, y: 18 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.42, ease: 'easeOut' },
  },
  exit: {
    opacity: 0,
    y: -12,
    transition: { duration: 0.22, ease: 'easeIn' },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.38, ease: 'easeOut' },
  },
};

function useMotionReady() {
  const prefersReducedMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return mounted && !prefersReducedMotion;
}

export function AnimatedPage({ children, className }: AnimatedPageProps) {
  const motionReady = useMotionReady();

  if (!motionReady) {
    return <div className={className}>{children}</div>;
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="animated-page"
        animate="animate"
        className={className}
        exit="exit"
        initial="initial"
        variants={pageVariants}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

export function FadeIn({ children, className, delay = 0 }: FadeInProps) {
  const motionReady = useMotionReady();

  if (!motionReady) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      className={className}
      initial={{ opacity: 0, y: 18 }}
      transition={{ duration: 0.38, ease: 'easeOut', delay }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerGroup({
  children,
  className,
  delayChildren = 0.06,
  staggerChildren = 0.08,
}: StaggerGroupProps) {
  const motionReady = useMotionReady();

  if (!motionReady) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      animate="show"
      className={className}
      initial="hidden"
      variants={{
        hidden: {},
        show: {
          transition: {
            delayChildren,
            staggerChildren,
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className }: AnimatedPageProps) {
  const motionReady = useMotionReady();

  if (!motionReady) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div className={className} variants={itemVariants}>
      {children}
    </motion.div>
  );
}
