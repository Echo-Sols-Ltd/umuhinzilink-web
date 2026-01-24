'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle, 
  Check, 
  Sparkles, 
  Star,
  Heart,
  Trophy,
  Gift,
  Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';

export interface SuccessCelebrationProps {
  show: boolean;
  onComplete?: () => void;
  variant?: 'default' | 'confetti' | 'sparkles' | 'pulse' | 'bounce' | 'fireworks';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  icon?: 'check' | 'checkCircle' | 'star' | 'heart' | 'trophy' | 'gift' | 'zap' | 'sparkles';
  color?: 'green' | 'blue' | 'purple' | 'gold' | 'rainbow';
  message?: string;
  duration?: number;
  className?: string;
}

const getIconComponent = (icon: SuccessCelebrationProps['icon'] = 'checkCircle') => {
  switch (icon) {
    case 'check': return Check;
    case 'star': return Star;
    case 'heart': return Heart;
    case 'trophy': return Trophy;
    case 'gift': return Gift;
    case 'zap': return Zap;
    case 'sparkles': return Sparkles;
    case 'checkCircle':
    default: return CheckCircle;
  }
};

const getColorConfig = (color: SuccessCelebrationProps['color'] = 'green') => {
  switch (color) {
    case 'blue':
      return {
        primary: 'text-blue-500',
        secondary: 'text-blue-400',
        bg: 'bg-blue-500',
        glow: 'shadow-blue-500/50',
        gradient: 'from-blue-400 to-blue-600',
      };
    case 'purple':
      return {
        primary: 'text-purple-500',
        secondary: 'text-purple-400',
        bg: 'bg-purple-500',
        glow: 'shadow-purple-500/50',
        gradient: 'from-purple-400 to-purple-600',
      };
    case 'gold':
      return {
        primary: 'text-yellow-500',
        secondary: 'text-yellow-400',
        bg: 'bg-yellow-500',
        glow: 'shadow-yellow-500/50',
        gradient: 'from-yellow-400 to-yellow-600',
      };
    case 'rainbow':
      return {
        primary: 'text-pink-500',
        secondary: 'text-purple-400',
        bg: 'bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500',
        glow: 'shadow-pink-500/50',
        gradient: 'from-pink-400 via-purple-500 to-blue-600',
      };
    case 'green':
    default:
      return {
        primary: 'text-green-500',
        secondary: 'text-green-400',
        bg: 'bg-green-500',
        glow: 'shadow-green-500/50',
        gradient: 'from-green-400 to-green-600',
      };
  }
};

const getSizeConfig = (size: SuccessCelebrationProps['size'] = 'md') => {
  switch (size) {
    case 'sm':
      return {
        icon: 'w-8 h-8',
        container: 'w-16 h-16',
        text: 'text-sm',
        particle: 'w-1 h-1',
      };
    case 'lg':
      return {
        icon: 'w-16 h-16',
        container: 'w-32 h-32',
        text: 'text-lg',
        particle: 'w-3 h-3',
      };
    case 'xl':
      return {
        icon: 'w-24 h-24',
        container: 'w-48 h-48',
        text: 'text-xl',
        particle: 'w-4 h-4',
      };
    case 'md':
    default:
      return {
        icon: 'w-12 h-12',
        container: 'w-24 h-24',
        text: 'text-base',
        particle: 'w-2 h-2',
      };
  }
};

// Confetti Particle Component
const ConfettiParticle: React.FC<{ 
  delay: number; 
  color: string; 
  size: string;
  variant: 'square' | 'circle' | 'star';
}> = ({ delay, color, size, variant }) => {
  const shapes = {
    square: 'rounded-none',
    circle: 'rounded-full',
    star: 'rounded-sm rotate-45',
  };

  return (
    <motion.div
      className={cn(
        'absolute',
        color,
        size,
        shapes[variant]
      )}
      initial={{ 
        opacity: 0, 
        scale: 0, 
        x: 0, 
        y: 0,
        rotate: 0
      }}
      animate={{ 
        opacity: [0, 1, 1, 0], 
        scale: [0, 1, 1, 0.5], 
        x: Math.random() * 200 - 100,
        y: Math.random() * 200 - 100,
        rotate: Math.random() * 360
      }}
      transition={{ 
        duration: 2, 
        delay,
        ease: "easeOut"
      }}
    />
  );
};

// Sparkle Particle Component
const SparkleParticle: React.FC<{ 
  delay: number; 
  color: string; 
  size: string;
}> = ({ delay, color, size }) => {
  return (
    <motion.div
      className={cn('absolute', size)}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ 
        opacity: [0, 1, 0], 
        scale: [0, 1, 0],
        rotate: [0, 180, 360]
      }}
      transition={{ 
        duration: 1.5, 
        delay,
        repeat: 2,
        ease: "easeInOut"
      }}
    >
      <Sparkles className={cn('w-full h-full', color)} />
    </motion.div>
  );
};

// Firework Burst Component
const FireworkBurst: React.FC<{ 
  delay: number; 
  colorConfig: ReturnType<typeof getColorConfig>;
  size: string;
}> = ({ delay, colorConfig, size }) => {
  const particles = Array.from({ length: 12 }, (_, i) => i);

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay }}
    >
      {particles.map((i) => (
        <motion.div
          key={i}
          className={cn(
            'absolute w-1 h-1 rounded-full',
            colorConfig.bg
          )}
          initial={{ scale: 0, x: 0, y: 0 }}
          animate={{
            scale: [0, 1, 0],
            x: Math.cos((i * 30) * Math.PI / 180) * 60,
            y: Math.sin((i * 30) * Math.PI / 180) * 60,
          }}
          transition={{
            duration: 1,
            delay: delay + i * 0.05,
            ease: "easeOut"
          }}
        />
      ))}
    </motion.div>
  );
};

export const SuccessCelebration: React.FC<SuccessCelebrationProps> = ({
  show,
  onComplete,
  variant = 'default',
  size = 'md',
  icon = 'checkCircle',
  color = 'green',
  message,
  duration = 3000,
  className,
}) => {
  const [animationComplete, setAnimationComplete] = useState(false);
  
  const IconComponent = getIconComponent(icon);
  const colorConfig = getColorConfig(color);
  const sizeConfig = getSizeConfig(size);

  useEffect(() => {
    if (show && duration > 0) {
      const timer = setTimeout(() => {
        setAnimationComplete(true);
        onComplete?.();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [show, duration, onComplete]);

  const getVariantAnimation = () => {
    switch (variant) {
      case 'confetti':
        return {
          initial: { scale: 0, rotate: -180 },
          animate: { 
            scale: [0, 1.2, 1], 
            rotate: [0, 360, 720]
          },
          transition: { 
            duration: 0.8,
            times: [0, 0.6, 1]
          }
        };
      case 'sparkles':
        return {
          initial: { scale: 0, opacity: 0 },
          animate: { 
            scale: [0, 1.1, 1], 
            opacity: [0, 1, 1]
          },
          transition: { 
            duration: 0.6
          }
        };
      case 'pulse':
        return {
          initial: { scale: 0 },
          animate: {
            scale: [0, 1.3, 1, 1.1, 1]
          },
          transition: { 
            duration: 1.2
          }
        };
      case 'bounce':
        return {
          initial: { scale: 0, y: -50 },
          animate: { 
            scale: [0, 1.2, 0.9, 1.1, 1], 
            y: [-50, 0, -10, 0, -5, 0]
          },
          transition: { 
            duration: 1
          }
        };
      case 'fireworks':
        return {
          initial: { scale: 0, rotate: 0 },
          animate: { 
            scale: [0, 1.1, 1], 
            rotate: [0, 180, 360]
          },
          transition: { 
            duration: 0.8
          }
        };
      case 'default':
      default:
        return {
          initial: { scale: 0, opacity: 0 },
          animate: { 
            scale: [0, 1.1, 1], 
            opacity: [0, 1, 1]
          },
          transition: { 
            duration: 0.5
          }
        };
    }
  };

  const variantAnimation = getVariantAnimation();

  return (
    <AnimatePresence>
      {show && !animationComplete && (
        <motion.div
          className={cn(
            'fixed inset-0 z-50 flex items-center justify-center pointer-events-none',
            className
          )}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Background Overlay */}
          <motion.div
            className="absolute inset-0 bg-black/20 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Main Container */}
          <div className="relative flex flex-col items-center space-y-4">
            {/* Icon Container */}
            <div className={cn('relative flex items-center justify-center', sizeConfig.container)}>
              {/* Main Icon */}
              <motion.div
                className={cn(
                  'relative z-10 flex items-center justify-center rounded-full',
                  'bg-white dark:bg-gray-900 shadow-2xl',
                  colorConfig.glow,
                  sizeConfig.container
                )}
                {...variantAnimation}
              >
                <IconComponent 
                  className={cn(sizeConfig.icon, colorConfig.primary)} 
                />
              </motion.div>

              {/* Variant-specific Effects */}
              {variant === 'confetti' && (
                <>
                  {Array.from({ length: 20 }, (_, i) => (
                    <ConfettiParticle
                      key={i}
                      delay={0.3 + i * 0.05}
                      color={i % 3 === 0 ? colorConfig.bg : i % 3 === 1 ? 'bg-yellow-400' : 'bg-pink-400'}
                      size={sizeConfig.particle}
                      variant={i % 3 === 0 ? 'square' : i % 3 === 1 ? 'circle' : 'star'}
                    />
                  ))}
                </>
              )}

              {variant === 'sparkles' && (
                <>
                  {Array.from({ length: 8 }, (_, i) => (
                    <SparkleParticle
                      key={i}
                      delay={0.2 + i * 0.1}
                      color={colorConfig.primary}
                      size={sizeConfig.particle}
                    />
                  ))}
                </>
              )}

              {variant === 'pulse' && (
                <motion.div
                  className={cn(
                    'absolute inset-0 rounded-full',
                    colorConfig.bg,
                    'opacity-20'
                  )}
                  animate={{
                    scale: [1, 2, 3],
                    opacity: [0.2, 0.1, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeOut"
                  }}
                />
              )}

              {variant === 'fireworks' && (
                <>
                  <FireworkBurst delay={0.5} colorConfig={colorConfig} size={sizeConfig.particle} />
                  <FireworkBurst delay={0.8} colorConfig={colorConfig} size={sizeConfig.particle} />
                  <FireworkBurst delay={1.1} colorConfig={colorConfig} size={sizeConfig.particle} />
                </>
              )}

              {/* Glow Effect */}
              <motion.div
                className={cn(
                  'absolute inset-0 rounded-full blur-xl',
                  colorConfig.bg,
                  'opacity-30'
                )}
                animate={{
                  scale: [0.8, 1.2, 0.8],
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </div>

            {/* Success Message */}
            {message && (
              <motion.div
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                <p className={cn(
                  'font-semibold text-white drop-shadow-lg',
                  sizeConfig.text
                )}>
                  {message}
                </p>
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Hook for triggering success celebrations
export const useSuccessCelebration = () => {
  const [celebration, setCelebration] = useState<{
    show: boolean;
    props: Partial<SuccessCelebrationProps>;
  }>({ show: false, props: {} });

  const celebrate = (props: Partial<SuccessCelebrationProps> = {}) => {
    setCelebration({ show: true, props });
  };

  const hideCelebration = () => {
    setCelebration({ show: false, props: {} });
  };

  return {
    celebration: celebration.show,
    celebrationProps: celebration.props,
    celebrate,
    hideCelebration,
    SuccessCelebrationComponent: () => (
      <SuccessCelebration
        show={celebration.show}
        onComplete={hideCelebration}
        {...celebration.props}
      />
    ),
  };
};

// Quick celebration functions
export const celebrateSuccess = (message?: string, variant?: SuccessCelebrationProps['variant']) => {
  // This would typically be used with a global celebration context
  console.log('🎉 Success!', message);
};

export const celebrateAchievement = (message?: string) => {
  celebrateSuccess(message, 'fireworks');
};

export const celebrateCompletion = (message?: string) => {
  celebrateSuccess(message, 'confetti');
};