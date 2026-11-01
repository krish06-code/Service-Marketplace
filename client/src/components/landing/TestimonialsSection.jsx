import React from 'react';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'Meera Krishnan',
    city: 'Chennai',
    rating: 5,
    role: 'Homeowner',
    text: "Booked an AC repair at 9 AM and the technician arrived by 11 AM. Professional, clean work and fair pricing. I've already referred ServiConnect to 5 friends!",
    initials: 'MK',
    color: 'from-orange-400 to-red-400',
  },
  {
    name: 'Vikas Shetty',
    city: 'Bangalore',
    rating: 5,
    role: 'Business Owner',
    text: 'I was skeptical at first but the home cleaning team was absolutely excellent. They did a deep clean in 3 hours for a reasonable price. Booking was super easy on the app.',
    initials: 'VS',
    color: 'from-blue-400 to-indigo-400',
  },
  {
    name: 'Priyanka Nair',
    city: 'Mumbai',
    rating: 5,
    role: 'Homeowner',
    text: "My electrical issue was fixed the same day I booked. The electrician explained everything clearly and didn't overcharge. Will always use ServiConnect for home services.",
    initials: 'PN',
    color: 'from-violet-400 to-purple-400',
  },
];

const TestimonialsSection = () => (
  <section className="py-24 bg-white">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <span className="section-badge mb-4">Testimonials</span>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-text-primary mt-3 mb-4">
          What Our Customers Say
        </h2>
        <p className="text-text-muted text-lg">
          Real experiences from real people across India.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {testimonials.map((t, i) => (
          <div
            key={i}
            className="bg-white border border-border-color rounded-2xl p-7 flex flex-col gap-5 hover:shadow-card-hover hover:-translate-y-1 transition-all duration-200"
          >
            {/* Stars */}
            <div className="flex">
              {Array.from({ length: t.rating }).map((_, j) => (
                <Star key={j} className="h-4 w-4 fill-amber-400 text-amber-400" />
              ))}
            </div>

            {/* Quote icon */}
            <Quote className="h-8 w-8 text-accent/20" />

            {/* Text */}
            <p className="text-text-secondary text-sm leading-relaxed flex-1">"{t.text}"</p>

            {/* Author */}
            <div className="flex items-center gap-3 pt-4 border-t border-border-color">
              <div className={`h-11 w-11 rounded-full bg-gradient-to-br ${t.color} flex items-center justify-center text-white font-bold text-sm shrink-0`}>
                {t.initials}
              </div>
              <div>
                <p className="font-bold text-text-primary text-sm">{t.name}</p>
                <p className="text-text-muted text-xs">{t.role} · {t.city}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default TestimonialsSection;
