import React, { useEffect, useRef, useState } from 'react';
import { ShieldCheck, BadgeIndianRupee, Lock, Star, Headphones, CalendarCheck } from 'lucide-react';
import useIntersectionObserver from '../../hooks/useIntersectionObserver';

const features = [
  { icon: ShieldCheck, title: 'Verified Professionals', description: 'Every provider goes through ID verification, background checks and skills assessment before joining.' },
  { icon: BadgeIndianRupee, title: 'Transparent Pricing', description: 'See the full price before you book. No hidden charges or surprise bills at the end.' },
  { icon: Lock, title: 'Secure Bookings', description: 'Your data and payments are protected with bank-grade encryption and secure APIs.' },
  { icon: Star, title: 'Real Customer Reviews', description: 'Read authentic reviews from verified customers who have used the service before you.' },
  { icon: Headphones, title: 'Fast Support', description: 'Our support team is available to resolve any issue quickly, so your experience is always smooth.' },
  { icon: CalendarCheck, title: 'Easy Scheduling', description: 'Flexible time slots to fit your schedule. Book, reschedule or cancel with zero friction.' },
];

const WhyChooseUsSection = () => (
  <section className="py-24 bg-bg-surface" id="why-choose-us">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-14">
        <span className="inline-block px-3 py-1 rounded-full border border-border-color bg-bg-surface-2 text-xs font-semibold text-accent mb-4 tracking-widest">WHY US</span>
        <h2 className="text-3xl sm:text-4xl font-bold text-text-primary mb-4">Why Choose ServiConnect?</h2>
        <p className="text-text-muted max-w-lg mx-auto">We set the highest standards so you never have to worry.</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((f, i) => {
          const Icon = f.icon;
          return (
            <div key={i} className="card p-6 group hover:border-accent/40 hover:shadow-[0_0_20px_rgba(79,124,255,0.08)] flex flex-col gap-4">
              <div className="h-12 w-12 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                <Icon className="h-6 w-6 text-accent" />
              </div>
              <div>
                <h3 className="font-semibold text-text-primary mb-1.5">{f.title}</h3>
                <p className="text-text-muted text-sm leading-relaxed">{f.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  </section>
);

export default WhyChooseUsSection;
