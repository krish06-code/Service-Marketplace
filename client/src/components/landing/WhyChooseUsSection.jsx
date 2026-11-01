import React from 'react';
import { ShieldCheck, BadgeIndianRupee, Lock, Star, Headphones, CalendarCheck, CheckCircle } from 'lucide-react';

const features = [
  { icon: ShieldCheck, title: 'Verified Professionals', description: 'Every provider goes through ID verification, background checks and skills assessment before joining.', color: 'text-accent', bg: 'bg-accent/10', border: 'border-accent/20' },
  { icon: BadgeIndianRupee, title: 'Transparent Pricing', description: 'See the full price before you book. No hidden charges or surprise bills at the end.', color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200' },
  { icon: Lock, title: 'Secure Bookings', description: 'Your data and payments are protected with bank-grade encryption and secure APIs.', color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' },
  { icon: Star, title: 'Real Customer Reviews', description: 'Read authentic reviews from verified customers who have used the service before you.', color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200' },
  { icon: Headphones, title: 'Fast Support', description: 'Our support team is available to resolve any issue quickly, so your experience is always smooth.', color: 'text-violet-600', bg: 'bg-violet-50', border: 'border-violet-200' },
  { icon: CalendarCheck, title: 'Easy Scheduling', description: 'Flexible time slots to fit your schedule. Book, reschedule or cancel with zero friction.', color: 'text-teal-600', bg: 'bg-teal-50', border: 'border-teal-200' },
];

const WhyChooseUsSection = () => (
  <section className="py-24 bg-bg-surface" id="why-choose-us">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <span className="section-badge mb-4">Why Us</span>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-text-primary mt-3 mb-4">
          Why Choose ServiConnect?
        </h2>
        <p className="text-text-muted max-w-xl mx-auto text-lg">
          We set the highest standards so you never have to worry.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((f, i) => {
          const Icon = f.icon;
          return (
            <div
              key={i}
              className="bg-white border border-border-color rounded-2xl p-7 flex flex-col gap-5 hover:shadow-card-hover hover:-translate-y-1 transition-all duration-200 group"
            >
              <div className={`h-14 w-14 rounded-2xl ${f.bg} border ${f.border} flex items-center justify-center`}>
                <Icon className={`h-7 w-7 ${f.color}`} />
              </div>
              <div>
                <h3 className="font-extrabold text-text-primary text-lg mb-2 group-hover:text-accent transition-colors">{f.title}</h3>
                <p className="text-text-muted text-sm leading-relaxed">{f.description}</p>
              </div>
              <div className={`flex items-center gap-2 ${f.color} text-xs font-bold`}>
                <CheckCircle className="h-4 w-4" />
                <span>Guaranteed</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  </section>
);

export default WhyChooseUsSection;
