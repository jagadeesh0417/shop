'use client';

import { useRef, ReactNode } from 'react';
import { motion, useInView } from 'framer-motion';

interface Props {
  children: ReactNode[];
  className?: string;
  staggerDelay?: number;
}

export default function StaggerGrid({ children, className = '', staggerDelay = 0.08 }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <div ref={ref} className={className}>
      {children.map((child, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.5, delay: i * staggerDelay, ease: [0.25, 0.1, 0.25, 1] }}
        >
          {child}
        </motion.div>
      ))}
    </div>
  );
}
