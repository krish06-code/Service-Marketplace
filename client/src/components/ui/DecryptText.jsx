import React, { useState, useEffect, useRef } from 'react';

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&';

/**
 * DecryptText - animates text by randomizing characters before revealing the real ones.
 * Converted from TypeScript to JavaScript/JSX.
 * Respects prefers-reduced-motion.
 */
const DecryptText = ({
  text = '',
  className = '',
  speed = 50,
  revealDirection = 'start',
  sequential = true,
  characters = CHARS,
  parentClassName = '',
  encryptedClassName = 'text-accent',
  onAnimationComplete,
}) => {
  const [displayText, setDisplayText] = useState(text.split('').map(() => ''));
  const [revealed, setRevealed] = useState([]);
  const animRef = useRef(null);
  const prefersReduced = useRef(
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );

  useEffect(() => {
    if (prefersReduced.current) {
      setDisplayText(text.split(''));
      setRevealed(text.split('').map((_, i) => i));
      if (onAnimationComplete) onAnimationComplete();
      return;
    }

    const chars = text.split('');
    let revealedSet = new Set();
    let frameCount = 0;

    const getNextIndex = () => {
      const unrevealed = chars.map((_, i) => i).filter(i => !revealedSet.has(i));
      if (!unrevealed.length) return -1;
      if (revealDirection === 'start') return unrevealed[0];
      if (revealDirection === 'end') return unrevealed[unrevealed.length - 1];
      if (revealDirection === 'center') {
        const mid = Math.floor(unrevealed.length / 2);
        return unrevealed[mid];
      }
      return unrevealed[Math.floor(Math.random() * unrevealed.length)];
    };

    const animate = () => {
      frameCount++;
      const scrambled = chars.map((ch, i) => {
        if (revealedSet.has(i) || ch === ' ') return ch;
        return characters[Math.floor(Math.random() * characters.length)];
      });
      setDisplayText([...scrambled]);

      if (sequential && frameCount % Math.ceil(speed / 16) === 0) {
        const next = getNextIndex();
        if (next !== -1) {
          revealedSet.add(next);
          setRevealed([...revealedSet]);
        }
      }

      if (revealedSet.size < chars.filter(c => c !== ' ').length) {
        animRef.current = requestAnimationFrame(animate);
      } else {
        setDisplayText(chars);
        if (onAnimationComplete) onAnimationComplete();
      }
    };

    animRef.current = requestAnimationFrame(animate);
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, [text, speed, revealDirection, sequential, characters, onAnimationComplete]);

  return (
    <span className={parentClassName}>
      {displayText.map((char, i) => (
        <span
          key={i}
          className={revealed.includes(i) || char === ' ' ? className : encryptedClassName}
        >
          {char || '\u00A0'}
        </span>
      ))}
    </span>
  );
};

export default DecryptText;
