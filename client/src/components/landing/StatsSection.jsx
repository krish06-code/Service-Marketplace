import React, { useEffect, useRef, useState } from 'react';

const stats = [
  { value: 10000, suffix: '+', label: 'Services Completed' },
  { value: 2000, suffix: '+', label: 'Verified Professionals' },
  { value: 4.8, suffix: '', label: 'Average Rating', isDecimal: true },
  { value: 25, suffix: '+', label: 'Service Categories' },
];

const useCounter = (target, duration = 2000, isDecimal = false) => {
  const [count, setCount] = useState(0);
  const started = useRef(false);

  const start = () => {
    if (started.current) return;
    started.current = true;
    const startTime = performance.now();
    const step = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(isDecimal ? parseFloat((eased * target).toFixed(1)) : Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
      else setCount(target);
    };
    requestAnimationFrame(step);
  };

  return { count, start };
};

const StatItem = ({ value, suffix, label, isDecimal }) => {
  const ref = useRef(null);
  const { count, start } = useCounter(value, 2000, isDecimal);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) start(); },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="text-center">
      <div className="text-4xl sm:text-5xl font-extrabold gradient-text mb-2">
        {isDecimal ? count.toFixed(1) : count.toLocaleString('en-IN')}{suffix}
      </div>
      <p className="text-text-muted text-sm">{label}</p>
    </div>
  );
};

const StatsSection = () => (
  <section className="py-20 bg-bg-primary border-y border-border-color">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-12">
        {stats.map((s, i) => <StatItem key={i} {...s} />)}
      </div>
    </div>
  </section>
);

export default StatsSection;
