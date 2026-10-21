import React from 'react';
import { Star, Quote } from 'lucide-react';
import Avatar from '../ui/Avatar';

const testimonials = [
  {
    name: 'Meera Krishnan',
    city: 'Chennai',
    rating: 5,
    role: 'Customer',
    text: "Booked an AC repair at 9 AM and the technician arrived by 11 AM. Professional, clean work and fair pricing. I've already referred ServiConnect to 5 friends!",
    initials: 'MK',
  },
  {
    name: 'Vikas Shetty',
    city: 'Bangalore',
    rating: 5,
    role: 'Customer',
    text: 'I was skeptical at first but the home cleaning team was absolutely excellent. They did a deep clean in 3 hours for a reasonable price. Booking was super easy on the app.',
    initials: 'VS',
  },
  {
    name: 'Priyanka Nair',
    city: 'Mumbai',
    rating: 5,
    role: 'Customer',
    text: "My electrical issue was fixed the same day I booked. The electrician explained everything clearly and didn't overcharge. Will always use ServiConnect for home services.",
    initials: 'PN',
  },
];

const TestimonialsSection = () => (
  <section className="py-24 bg-bg-surface">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-14">
        <span className="inline-block px-3 py-1 rounded-full border border-border-color bg-bg-surface-2 text-xs font-semibold text-accent mb-4 tracking-widest">TESTIMONIALS</span>
        <h2 className="text-3xl sm:text-4xl font-bold text-text-primary mb-4">What Our Customers Say</h2>
        <p className="text-text-muted">Real experiences from real people across India.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {testimonials.map((t, i) => (
          <div key={i} className="card p-6 flex flex-col gap-4 hover:border-accent/30 transition-all">
            <Quote className="h-8 w-8 text-accent/30" />
            <p className="text-text-secondary text-sm leading-relaxed flex-1">"{t.text}"</p>
            <div className="flex items-center gap-3 pt-2 border-t border-border-color">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-accent to-accent-2 flex items-center justify-center text-white font-semibold text-sm shrink-0">
                {t.initials}
              </div>
              <div>
                <p className="font-semibold text-text-primary text-sm">{t.name}</p>
                <p className="text-text-muted text-xs">{t.city}</p>
              </div>
              <div className="ml-auto flex">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} className="h-3.5 w-3.5 fill-warning text-warning" />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default TestimonialsSection;
