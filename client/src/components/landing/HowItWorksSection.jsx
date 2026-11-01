import React from 'react';
import { Search, UserCheck, CalendarCheck, ArrowRight } from 'lucide-react';

const steps = [
  {
    number: '01',
    icon: Search,
    title: 'Search & Discover',
    description: "Tell us what you need — describe your problem or pick from our service categories. We'll find the best matches near you.",
    color: 'text-accent',
    iconBg: 'bg-accent',
    numberColor: 'text-accent',
    lineBg: 'from-accent to-orange-300',
  },
  {
    number: '02',
    icon: UserCheck,
    title: 'Choose Your Expert',
    description: 'Browse verified professional profiles. Compare ratings, reviews, experience, pricing and availability to pick the best fit.',
    color: 'text-blue-600',
    iconBg: 'bg-blue-500',
    numberColor: 'text-blue-500',
    lineBg: 'from-orange-300 to-emerald-400',
  },
  {
    number: '03',
    icon: CalendarCheck,
    title: 'Book & Relax',
    description: 'Select a convenient time slot, confirm your address, and book instantly. Pay with cash on delivery — no hassle.',
    color: 'text-emerald-600',
    iconBg: 'bg-emerald-500',
    numberColor: 'text-emerald-500',
    lineBg: '',
  },
];

const HowItWorksSection = () => (
  <section className="py-24 bg-bg-surface" id="how-it-works">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <span className="section-badge mb-4">How It Works</span>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-text-primary mt-3 mb-4">
          Book a Service in 3 Easy Steps
        </h2>
        <p className="text-text-muted max-w-xl mx-auto text-lg">
          Get a verified professional in under 2 minutes, right from your phone or laptop.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 lg:gap-10 relative">
        {/* Connecting dashes (desktop) */}
        <div className="hidden md:block absolute top-16 left-[38%] right-[38%] h-0.5 bg-gradient-to-r from-accent via-blue-400 to-emerald-500 opacity-30" />

        {steps.map((step, i) => {
          const Icon = step.icon;
          return (
            <div key={i} className="relative">
              <div className="bg-white border border-border-color rounded-2xl p-8 text-center flex flex-col items-center gap-5 shadow-card hover:shadow-card-hover transition-all hover:-translate-y-1">
                {/* Step number */}
                <div className="relative">
                  <div className={`h-16 w-16 rounded-2xl ${step.iconBg} flex items-center justify-center shadow-[0_8px_20px_rgba(0,0,0,0.15)]`}>
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <span className={`absolute -top-3 -right-3 h-7 w-7 rounded-full bg-white border-2 border-border-color flex items-center justify-center text-xs font-extrabold ${step.numberColor} shadow-sm`}>
                    {step.number}
                  </span>
                </div>
                <div>
                  <h3 className="text-xl font-extrabold text-text-primary mb-3">{step.title}</h3>
                  <p className="text-text-muted text-sm leading-relaxed">{step.description}</p>
                </div>
              </div>

              {/* Mobile arrow */}
              {i < steps.length - 1 && (
                <div className="md:hidden flex justify-center mt-4 mb-2">
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
