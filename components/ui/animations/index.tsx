'use client';

import React from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { cn } from '@/lib/utils';

// ===== ANIMATION VARIANTS =====

export const fadeInUp: Variants = {
  initial: { 
    opacity: 0, 
    y: 20,
    scale: 0.95
  },
  animate: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: {
      duration: 0.3,
      ease: [0.4, 0, 0.2, 1]
    }
  },
  exit: { 
    opacity: 0, 
    y: -20,
    scale: 0.95,
    transition: {
      duration: 0.2,
      ease: [0.4, 0, 1, 1]
    }
  }
};

export const fadeInDown: Variants = {
  initial: { 
    opacity: 0, 
    y: -20,
    scale: 0.95
  },
  animate: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: {
      duration: 0.3,
      ease: [0.4, 0, 0.2, 1]
    }
  },
  exit: { 
    opacity: 0, 
    y: 20,
    scale: 0.95,
    transition: {
      duration: 0.2,
      ease: [0.4, 0, 1, 1]
    }
  }
};

export const slideInLeft: Variants = {
  initial: { 
    opacity: 0, 
    x: -100,
    scale: 0.95
  },
  animate: { 
    opacity: 1, 
    x: 0,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: [0.4, 0, 0.2, 1]
    }
  },
  exit: { 
    opacity: 0, 
    x: 100,
    scale: 0.95,
    transition: {
      duration: 0.3,
      ease: [0.4, 0, 1, 1]
    }
  }
};

export const slideInRight: Variants = {
  initial: { 
    opacity: 0, 
    x: 100,
    scale: 0.95
  },
  animate: { 
    opacity: 1, 
    x: 0,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: [0.4, 0, 0.2, 1]
    }
  },
  exit: { 
    opacity: 0, 
    x: -100,
    scale: 0.95,
    transition: {
      duration: 0.3,
      ease: [0.4, 0, 1, 1]
    }
  }
};

export const scaleIn: Variants = {
  initial: { 
    opacity: 0, 
    scale: 0.8,
    rotate: -5
  },
  animate: { 
    opacity: 1, 
    scale: 1,
    rotate: 0,
    transition: {
      duration: 0.4,
      ease: [0.175, 0.885, 0.32, 1.275]
    }
  },
  exit: { 
    opacity: 0, 
    scale: 0.8,
    rotate: 5,
    transition: {
      duration: 0.2,
      ease: [0.4, 0, 1, 1]
    }
  }
};

export const modalVariants: Variants = {
  initial: { 
    opacity: 0, 
    scale: 0.9,
    y: 20
  },
  animate: { 
    opacity: 1, 
    scale: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: [0.4, 0, 0.2, 1]
    }
  },
  exit: { 
    opacity: 0, 
    scale: 0.9,
    y: 20,
    transition: {
      duration: 0.2,
      ease: [0.4, 0, 1, 1]
    }
  }
};

export const overlayVariants: Variants = {
  initial: { opacity: 0 },
  animate: { 
    opacity: 1,
    transition: {
      duration: 0.2,
      ease: 'easeOut'
    }
  },
  exit: { 
    opacity: 0,
    transition: {
      duration: 0.2,
      ease: 'easeIn'
    }
  }
};

export const expandCollapse: Variants = {
  initial: { 
    height: 0,
    opacity: 0,
    scale: 0.95
  },
  animate: { 
    height: 'auto',
    opacity: 1,
    scale: 1,
    transition: {
      height: {
        duration: 0.3,
        ease: [0.4, 0, 0.2, 1]
      },
      opacity: {
        duration: 0.2,
        delay: 0.1,
        ease: 'easeOut'
      },
      scale: {
        duration: 0.2,
        delay: 0.1,
        ease: 'easeOut'
      }
    }
  },
  exit: { 
    height: 0,
    opacity: 0,
    scale: 0.95,
    transition: {
      height: {
        duration: 0.3,
        delay: 0.1,
        ease: [0.4, 0, 1, 1]
      },
      opacity: {
        duration: 0.2,
        ease: 'easeIn'
      },
      scale: {
        duration: 0.2,
        ease: 'easeIn'
      }
    }
  }
};

export const staggerContainer: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  },
  exit: {
    transition: {
      staggerChildren: 0.05,
      staggerDirection: -1
    }
  }
};

export const staggerItem: Variants = {
  initial: { 
    opacity: 0, 
    y: 20,
    scale: 0.95
  },
  animate: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: {
      duration: 0.3,
      ease: [0.4, 0, 0.2, 1]
    }
  },
  exit: { 
    opacity: 0, 
    y: -10,
    scale: 0.95,
    transition: {
      duration: 0.2,
      ease: [0.4, 0, 1, 1]
    }
  }
};

// ===== ANIMATION COMPONENTS =====

interface AnimatedContainerProps {
  children: React.ReactNode;
  variant?: 'fadeInUp' | 'fadeInDown' | 'slideInLeft' | 'slideInRight' | 'scaleIn';
  delay?: number;
  className?: string;
  stagger?: boolean;
}

export const AnimatedContainer: React.FC<AnimatedContainerProps> = ({
  children,
  variant = 'fadeInUp',
  delay = 0,
  className,
  stagger = false
}) => {
  const variants = {
    fadeInUp,
    fadeInDown,
    slideInLeft,
    slideInRight,
    scaleIn
  };

  const containerVariants = stagger ? staggerContainer : variants[variant];
  const itemVariants = stagger ? staggerItem : undefined;

  return (
    <motion.div
      variants={containerVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className={className}
      style={{ animationDelay: `${delay}s` }}
    >
      {stagger ? (
        React.Children.map(children, (child, index) => (
          <motion.div key={index} variants={itemVariants}>
            {child}
          </motion.div>
        ))
      ) : (
        children
      )}
    </motion.div>
  );
};

interface FadeInProps {
  children: React.ReactNode;
  direction?: 'up' | 'down' | 'left' | 'right';
  delay?: number;
  duration?: number;
  className?: string;
}

export const FadeIn: React.FC<FadeInProps> = ({
  children,
  direction = 'up',
  delay = 0,
  duration = 0.3,
  className
}) => {
  const getInitialPosition = () => {
    switch (direction) {
      case 'up': return { y: 20 };
      case 'down': return { y: -20 };
      case 'left': return { x: -20 };
      case 'right': return { x: 20 };
      default: return { y: 20 };
    }
  };

  return (
    <motion.div
      initial={{ 
        opacity: 0, 
        ...getInitialPosition(),
        scale: 0.95
      }}
      animate={{ 
        opacity: 1, 
        x: 0, 
        y: 0,
        scale: 1
      }}
      exit={{ 
        opacity: 0, 
        ...getInitialPosition(),
        scale: 0.95
      }}
      transition={{
        duration,
        delay,
        ease: [0.4, 0, 0.2, 1]
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

interface ScaleInProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
  bounce?: boolean;
}

export const ScaleIn: React.FC<ScaleInProps> = ({
  children,
  delay = 0,
  duration = 0.4,
  className,
  bounce = false
}) => {
  return (
    <motion.div
      initial={{ 
        opacity: 0, 
        scale: 0.8,
        rotate: bounce ? -5 : 0
      }}
      animate={{ 
        opacity: 1, 
        scale: 1,
        rotate: 0
      }}
      exit={{ 
        opacity: 0, 
        scale: 0.8,
        rotate: bounce ? 5 : 0
      }}
      transition={{
        duration,
        delay,
        ease: bounce ? [0.175, 0.885, 0.32, 1.275] : [0.4, 0, 0.2, 1]
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

interface SlideInProps {
  children: React.ReactNode;
  direction?: 'left' | 'right' | 'up' | 'down';
  delay?: number;
  duration?: number;
  className?: string;
}

export const SlideIn: React.FC<SlideInProps> = ({
  children,
  direction = 'left',
  delay = 0,
  duration = 0.4,
  className
}) => {
  const getInitialPosition = () => {
    switch (direction) {
      case 'left': return { x: -100 };
      case 'right': return { x: 100 };
      case 'up': return { y: -100 };
      case 'down': return { y: 100 };
      default: return { x: -100 };
    }
  };

  const getExitPosition = () => {
    switch (direction) {
      case 'left': return { x: 100 };
      case 'right': return { x: -100 };
      case 'up': return { y: 100 };
      case 'down': return { y: -100 };
      default: return { x: 100 };
    }
  };

  return (
    <motion.div
      initial={{ 
        opacity: 0, 
        ...getInitialPosition(),
        scale: 0.95
      }}
      animate={{ 
        opacity: 1, 
        x: 0, 
        y: 0,
        scale: 1
      }}
      exit={{ 
        opacity: 0, 
        ...getExitPosition(),
        scale: 0.95
      }}
      transition={{
        duration,
        delay,
        ease: [0.4, 0, 0.2, 1]
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

interface ExpandCollapseProps {
  children: React.ReactNode;
  isOpen: boolean;
  className?: string;
}

export const ExpandCollapse: React.FC<ExpandCollapseProps> = ({
  children,
  isOpen,
  className
}) => {
  return (
    <AnimatePresence initial={false}>
      {isOpen && (
        <motion.div
          variants={expandCollapse}
          initial="initial"
          animate="animate"
          exit="exit"
          className={cn('overflow-hidden', className)}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

interface StaggeredListProps {
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number;
}

export const StaggeredList: React.FC<StaggeredListProps> = ({
  children,
  className,
  staggerDelay = 0.1
}) => {
  const containerVariants: Variants = {
    initial: {},
    animate: {
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants: Variants = {
    initial: { 
      opacity: 0, 
      y: 20,
      scale: 0.95
    },
    animate: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: 0.3,
        ease: [0.4, 0, 0.2, 1]
      }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="initial"
      animate="animate"
      className={className}
    >
      {React.Children.map(children, (child, index) => (
        <motion.div key={index} variants={itemVariants}>
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
};

// ===== LOADING ANIMATIONS =====

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  color = 'var(--primary-green)',
  className
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  return (
    <motion.div
      className={cn('inline-block', sizeClasses[size], className)}
      animate={{ rotate: 360 }}
      transition={{
        duration: 1,
        repeat: Infinity,
        ease: 'linear'
      }}
    >
      <svg
        className="w-full h-full"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="31.416"
          strokeDashoffset="31.416"
          opacity="0.3"
        />
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="31.416"
          strokeDashoffset="23.562"
        />
      </svg>
    </motion.div>
  );
};

interface PulseProps {
  children: React.ReactNode;
  scale?: number;
  duration?: number;
  className?: string;
}

export const Pulse: React.FC<PulseProps> = ({
  children,
  scale = 1.05,
  duration = 2,
  className
}) => {
  return (
    <motion.div
      animate={{ scale: [1, scale, 1] }}
      transition={{
        duration,
        repeat: Infinity,
        ease: 'easeInOut'
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// ===== HOVER ANIMATIONS =====

interface HoverLiftProps {
  children: React.ReactNode;
  lift?: number;
  scale?: number;
  className?: string;
}

export const HoverLift: React.FC<HoverLiftProps> = ({
  children,
  lift = -2,
  scale = 1,
  className
}) => {
  return (
    <motion.div
      whileHover={{ 
        y: lift,
        scale,
        transition: {
          duration: 0.2,
          ease: 'easeOut'
        }
      }}
      whileTap={{ 
        scale: 0.98,
        transition: {
          duration: 0.1,
          ease: 'easeInOut'
        }
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

interface HoverGlowProps {
  children: React.ReactNode;
  glowColor?: string;
  className?: string;
}

export const HoverGlow: React.FC<HoverGlowProps> = ({
  children,
  glowColor = 'rgba(0, 166, 62, 0.3)',
  className
}) => {
  return (
    <motion.div
      whileHover={{
        boxShadow: `0 0 20px ${glowColor}`,
        transition: {
          duration: 0.3,
          ease: 'easeOut'
        }
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// ===== NOTIFICATION ANIMATIONS =====

export const notificationSlideIn: Variants = {
  initial: { 
    opacity: 0, 
    x: 100,
    scale: 0.95
  },
  animate: { 
    opacity: 1, 
    x: 0,
    scale: 1,
    transition: {
      duration: 0.3,
      ease: [0.4, 0, 0.2, 1]
    }
  },
  exit: { 
    opacity: 0, 
    x: 100,
    scale: 0.95,
    transition: {
      duration: 0.2,
      ease: [0.4, 0, 1, 1]
    }
  }
};

export const progressBarVariants: Variants = {
  initial: { width: '0%' },
  animate: { 
    width: '100%',
    transition: {
      duration: 0.3,
      ease: 'easeOut'
    }
  }
};

// ===== PAGE TRANSITION ANIMATIONS =====

export const pageTransition: Variants = {
  initial: { 
    opacity: 0,
    y: 20,
    scale: 0.98
  },
  animate: { 
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: [0.4, 0, 0.2, 1]
    }
  },
  exit: { 
    opacity: 0,
    y: -20,
    scale: 0.98,
    transition: {
      duration: 0.3,
      ease: [0.4, 0, 1, 1]
    }
  }
};

export default {
  AnimatedContainer,
  FadeIn,
  ScaleIn,
  SlideIn,
  ExpandCollapse,
  StaggeredList,
  LoadingSpinner,
  Pulse,
  HoverLift,
  HoverGlow,
  // Variants
  fadeInUp,
  fadeInDown,
  slideInLeft,
  slideInRight,
  scaleIn,
  modalVariants,
  overlayVariants,
  expandCollapse,
  staggerContainer,
  staggerItem,
  notificationSlideIn,
  progressBarVariants,
  pageTransition
};