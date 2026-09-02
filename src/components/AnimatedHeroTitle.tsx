import React, { useState, useEffect } from 'react';

interface AnimatedHeroTitleProps {
  primaryText: string;
  highlightText?: string;
  suffixText?: string;
  className?: string;
  primaryClass?: string;
  highlightClass?: string;
  gradientClass?: string;
  dark?: boolean;
  speed?: number;
  showCursor?: boolean;
}

export function AnimatedHeroTitle({
  primaryText,
  highlightText = '',
  suffixText = '',
  className = 'text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight',
  primaryClass = '',
  highlightClass = '',
  gradientClass = '',
  dark = false,
  speed = 40,
  showCursor = true,
}: AnimatedHeroTitleProps) {
  const [text1, setText1] = useState('');
  const [text2, setText2] = useState('');
  const [text3, setText3] = useState('');
  const [phase, setPhase] = useState<1 | 2 | 3 | 4>(1);

  useEffect(() => {
    setText1('');
    setText2('');
    setText3('');
    setPhase(1);

    let idx1 = 0;
    const interval1 = setInterval(() => {
      idx1++;
      setText1(primaryText.slice(0, idx1));
      if (idx1 >= primaryText.length) {
        clearInterval(interval1);
        if (highlightText) {
          setPhase(2);
          startPhase2();
        } else if (suffixText) {
          setPhase(3);
          startPhase3();
        } else {
          setPhase(4);
        }
      }
    }, speed);

    const startPhase2 = () => {
      let idx2 = 0;
      const interval2 = setInterval(() => {
        idx2++;
        setText2(highlightText.slice(0, idx2));
        if (idx2 >= highlightText.length) {
          clearInterval(interval2);
          if (suffixText) {
            setPhase(3);
            startPhase3();
          } else {
            setPhase(4);
          }
        }
      }, speed);
    };

    const startPhase3 = () => {
      let idx3 = 0;
      const interval3 = setInterval(() => {
        idx3++;
        setText3(suffixText.slice(0, idx3));
        if (idx3 >= suffixText.length) {
          clearInterval(interval3);
          setPhase(4);
        }
      }, speed);
    };

    return () => {
      clearInterval(interval1);
    };
  }, [primaryText, highlightText, suffixText, speed]);

  const defaultGradient = dark
    ? 'bg-gradient-to-r from-emerald-400 via-teal-300 to-indigo-400 bg-clip-text text-transparent'
    : 'bg-gradient-to-r from-emerald-600 via-teal-500 to-indigo-600 bg-clip-text text-transparent';

  const appliedGradient = gradientClass || defaultGradient;
  const cursorColor = dark ? 'bg-emerald-400' : 'bg-emerald-600';

  return (
    <h1 className={`${className} ${primaryClass}`}>
      <span>{text1}</span>
      {phase === 1 && showCursor && (
        <span className={`inline-block w-1 h-[0.85em] ml-1 ${cursorColor} animate-pulse align-middle`} />
      )}
      {highlightText && (
        <>
          {' '}
          <span className={`${appliedGradient} ${highlightClass}`}>
            {text2}
          </span>
          {phase === 2 && showCursor && (
            <span className={`inline-block w-1 h-[0.85em] ml-1 ${cursorColor} animate-pulse align-middle`} />
          )}
        </>
      )}
      {suffixText && (
        <>
          {' '}
          <span>{text3}</span>
          {phase === 3 && showCursor && (
            <span className={`inline-block w-1 h-[0.85em] ml-1 ${cursorColor} animate-pulse align-middle`} />
          )}
        </>
      )}
    </h1>
  );
}
