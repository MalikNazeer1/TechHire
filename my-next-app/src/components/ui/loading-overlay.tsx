'use client';

import { motion } from 'framer-motion';
import { FaBriefcase } from 'react-icons/fa6';

export default function LoadingOverlay() {
  const techLetters = 'TECH'.split('');
  const hireLetters = 'HIRE'.split('');

  const containerVariants = {
    animate: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const letterVariants = {
    initial: {
      y: 50,
      opacity: 0,
    },
    animate: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 500,
        damping: 30,
      },
    },
  };

  const dotVariants = {
    animate: {
      scale: [1, 1.5, 1],
      opacity: [0.3, 1, 0.3],
      transition: {
        repeat: Infinity,
        duration: 1.5,
        ease: 'easeInOut',
      },
    },
  };

  // Gradient pulse animation for text
  const gradientStyle = {
    background: 'linear-gradient(270deg, #3b82f6, #06b6d4, #8b5cf6)',
    backgroundSize: '600% 600%',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    animation: 'gradientPulse 4s ease infinite',
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm z-50 flex items-center justify-center"
    >
      <style>
        {`
        @keyframes gradientPulse {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}
      </style>

      <div className="flex flex-col items-center space-y-8">
        {/* TECH + briefcase + HIRE → TechHire */}
        <motion.div
          className="flex text-4xl md:text-6xl font-extrabold gap-1"
          variants={containerVariants}
          initial="initial"
          animate="animate"
        >
          {techLetters.map((letter, i) => (
            <motion.span key={`t-${i}`} variants={letterVariants} style={gradientStyle}>
              {letter}
            </motion.span>
          ))}

          <motion.span
            variants={letterVariants}
            className="mx-1 text-blue-500 dark:text-blue-400"
            animate={{
              rotate: [0, -20, 20, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <FaBriefcase className="text-2xl md:text-3xl" />
          </motion.span>

          {hireLetters.map((letter, i) => (
            <motion.span key={`h-${i}`} variants={letterVariants} style={gradientStyle}>
              {letter}
            </motion.span>
          ))}
        </motion.div>

        {/* Animated connecting dots */}
        <div className="flex gap-2">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="w-3 h-3 bg-blue-600 dark:bg-blue-400 rounded-full"
              variants={dotVariants}
              animate="animate"
              style={{ animationDelay: `${i * 0.3}s` }}
            />
          ))}
        </div>

        {/* Loading message */}
        <motion.p
          className="text-sm text-gray-600 dark:text-gray-300"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          Hiring Faster, Smarter, Better...
        </motion.p>
      </div>
    </motion.div>
  );
} 