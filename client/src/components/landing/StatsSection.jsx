import React, { useEffect, useRef, useState } from 'react';
import { TrendingUp, Users, Star, Grid } from 'lucide-react';

const stats = [
  { value: 10000, suffix: '+', label: 'Services Completed', icon: TrendingUp, color: 'text-accent', bg: 'bg-accent/10' },
  { value: 2000, suffix: '+', label: 'Verified Professionals', icon: Users, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  { value: 4.8, suffix: '', label: 'Average Rating', isDecimal: true, icon: Star, color: 'text-amber-600', bg: 'bg-amber-50' },
  { value: 25, suffix: '+', label: 'Service Categories', icon: Grid, color: 'text-blue-600', bg: 'bg-blue-50' },
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

const StatItem = ({ value, suffix, label, isDecimal, icon: Icon, color, bg }) => {
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
    <div ref={ref} className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
      <div className={`h-14 w-14 rounded-2xl ${bg} flex items-center justify-center shrink-0`}>
        <Icon className={`h-7 w-7 ${color}`} />
      </div>
      <div>
        <div className={`text-3xl sm:text-4xl font-extrabold mb-0.5 ${color}`}>
          {isDecimal ? count.toFixed(1) : count.toLocaleString('en-IN')}{suffix}
        </div>
        <p className="text-text-muted text-sm font-medium">{label}</p>
      </div>
    </div>
  );
};

const StatsSection = () => (
  <section className="py-16 bg-bg-surface border-y border-border-color">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
        {stats.map((s, i) => <StatItem key={i} {...s} />)}
      </div>
    </div>
  </section>
);

export default StatsSection;
