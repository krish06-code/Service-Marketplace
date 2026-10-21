import React from 'react';
import { Search, UserCheck, CalendarCheck, ArrowRight } from 'lucide-react';

const steps = [
  {
    number: '01',
    icon: Search,
    title: 'Search',
    description: "Tell us what you need — describe your problem or pick from our service categories. We'll find the best matches near you.",
    color: 'text-accent',
    bg: 'bg-accent/10 border-accent/20',
  },
  {
    number: '02',
    icon: UserCheck,
    title: 'Choose',
    description: 'Browse verified professional profiles. Compare ratings, reviews, experience, pricing and availability to pick the best fit.',
    color: 'text-accent-2',
    bg: 'bg-accent-2/10 border-accent-2/20',
  },
  {
    number: '03',
    icon: CalendarCheck,
    title: 'Book',
    description: 'Select a convenient time slot, confirm your address, and book instantly. Pay with cash on delivery — no hassle.',
    color: 'text-success',
    bg: 'bg-success/10 border-success/20',
  },
];

const HowItWorksSection = () => (
  <section className="py-24 bg-bg-surface" id="how-it-works">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-14">
        <span className="inline-block px-3 py-1 rounded-full border border-border-color bg-bg-surface-2 text-xs font-semibold text-accent mb-4 tracking-widest">HOW IT WORKS</span>
        <h2 className="text-3xl sm:text-4xl font-bold text-text-primary mb-4">Simple. Fast. Reliable.</h2>
        <p className="text-text-muted max-w-lg mx-auto">Book a verified professional in under 2 minutes, right from your phone or laptop.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 relative">
        {/* Connecting line */}
        <div className="hidden md:block absolute top-16 left-1/3 right-1/3 h-px bg-gradient-to-r from-accent/30 via-accent-2/30 to-success/30" />

        {steps.map((step, i) => {
          const Icon = step.icon;
          return (
            <div key={i} className="relative flex flex-col items-center text-center gap-5">
              <div className="relative">
                <div className={`h-16 w-16 rounded-2xl bg-bg-surface-2 border ${step.bg} flex items-center justify-center shadow-lg`}>
                  <Icon className={`h-7 w-7 ${step.color}`} />
                </div>
                <span className={`absolute -top-3 -right-3 h-7 w-7 rounded-full bg-bg-primary border border-border-color flex items-center justify-center text-xs font-bold ${step.color}`}>
                  {step.number}
                </span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-text-primary mb-2">{step.title}</h3>
                <p className="text-text-muted text-sm leading-relaxed max-w-xs mx-auto">{step.description}</p>
              </div>
              {i < steps.length - 1 && (
                <div className="md:hidden flex justify-center mt-2">
                  <ArrowRight className="h-5 w-5 text-text-muted rotate-90" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  </section>
);

export default HowItWorksSection;
