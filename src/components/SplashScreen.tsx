import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Logo from './Logo';
import { Sparkles, ShieldCheck, Zap } from 'lucide-react';

interface SplashScreenProps {
  onComplete?: () => void;
  minDisplayTimeMs?: number;
}

export default function SplashScreen({ onComplete, minDisplayTimeMs = 1600 }: SplashScreenProps) {
  const [progress, setProgress] = useState(0);
  const [statusIndex, setStatusIndex] = useState(0);
  const [isDone, setIsDone] = useState(false);

  const statusMessages = [
    'Initializing Secure Core...',
    'Loading AI Growth Engine...',
    'Syncing Academy & Talent Network...',
    'Welcome to Pulzitive'
  ];

  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, Math.floor((elapsed / minDisplayTimeMs) * 100));
      setProgress(pct);

      if (pct < 30) {
        setStatusIndex(0);
      } else if (pct < 65) {
        setStatusIndex(1);
      } else if (pct < 90) {
        setStatusIndex(2);
      } else {
        setStatusIndex(3);
      }

      if (pct >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setIsDone(true);
          if (onComplete) {
            onComplete();
          }
        }, 300);
      }
    }, 30);

    return () => clearInterval(interval);
  }, [minDisplayTimeMs, onComplete]);

  return (
    <AnimatePresence>
      {!isDone && (
        <motion.div
          id="pulzitive-splash-screen"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          className="fixed inset-0 z-[9999] bg-slate-950 flex flex-col items-center justify-center p-6 select-none overflow-hidden"
        >
          {/* Subtle Ambient Background Lighting */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />

          {/* Central Logo & Brand Content */}
          <div className="relative z-10 flex flex-col items-center text-center space-y-6 max-w-sm w-full">
            {/* Animated Logo Container with Pulse Ring */}
            <div className="relative">
              <motion.div
                animate={{
                  scale: [1, 1.06, 1],
                  opacity: [0.3, 0.7, 0.3]
                }}
                transition={{
                  repeat: Infinity,
                  duration: 2,
                  ease: 'easeInOut'
                }}
                className="absolute -inset-3 bg-emerald-500/20 rounded-full blur-md"
              />
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="relative bg-slate-900 border border-slate-800 p-4 rounded-3xl shadow-2xl"
              >
                <Logo size="lg" showText={false} />
              </motion.div>
            </div>

            {/* Brand Title and Tagline */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="space-y-1.5"
            >
              <div className="flex items-center justify-center gap-1.5">
                <span className="text-2xl sm:text-3xl font-black tracking-wider text-white font-mono">
                  PULZITIVE
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <p className="text-xs text-slate-400 font-medium tracking-wide">
                Intelligent Marketing & Tech Academy Ecosystem
              </p>
            </motion.div>

            {/* Progress Bar & Percentage */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              className="w-full space-y-2 pt-2"
            >
              <div className="h-1.5 w-full bg-slate-900 border border-slate-800 rounded-full overflow-hidden p-0.5">
                <motion.div
                  className="h-full bg-emerald-500 rounded-full transition-all duration-75 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 px-1">
                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                  <Zap className="w-3 h-3 text-emerald-400 inline" />
                  {statusMessages[statusIndex]}
                </span>
                <span className="font-bold text-slate-300">{progress}%</span>
              </div>
            </motion.div>

            {/* Trust Micro-Badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.4 }}
              className="flex items-center justify-center gap-4 text-[10px] text-slate-500 font-mono pt-2"
            >
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-500" /> ISO-Grade Security
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-blue-400" /> AI Autopilot
              </span>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
