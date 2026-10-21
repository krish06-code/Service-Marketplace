import React, { useEffect, useState } from 'react';
import { Zap, Droplets, Wind, Sparkles, Wrench, Paintbrush, Hammer, GraduationCap, Dumbbell, Camera, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const services = [
  { name: 'Electrician', slug: 'electrician', icon: Zap, description: 'Wiring, repairs & installations', price: 299, color: 'from-yellow-500/20 to-orange-500/10', iconColor: 'text-yellow-400' },
  { name: 'Plumbing', slug: 'plumbing', icon: Droplets, description: 'Leaks, pipes & installations', price: 349, color: 'from-blue-500/20 to-cyan-500/10', iconColor: 'text-blue-400' },
  { name: 'AC Repair', slug: 'ac-repair', icon: Wind, description: 'Service, gas refill & repair', price: 499, color: 'from-cyan-500/20 to-teal-500/10', iconColor: 'text-cyan-400' },
  { name: 'Home Cleaning', slug: 'home-cleaning', icon: Sparkles, description: 'Deep clean & regular upkeep', price: 299, color: 'from-green-500/20 to-emerald-500/10', iconColor: 'text-green-400' },
  { name: 'Appliance Repair', slug: 'appliance-repair', icon: Wrench, description: 'Washing machines, fridges & more', price: 399, color: 'from-orange-500/20 to-red-500/10', iconColor: 'text-orange-400' },
  { name: 'Painting', slug: 'painting', icon: Paintbrush, description: 'Interior & exterior painting', price: 799, color: 'from-pink-500/20 to-rose-500/10', iconColor: 'text-pink-400' },
  { name: 'Carpentry', slug: 'carpentry', icon: Hammer, description: 'Furniture & woodwork', price: 499, color: 'from-amber-500/20 to-yellow-500/10', iconColor: 'text-amber-400' },
  { name: 'Tutor', slug: 'tutor', icon: GraduationCap, description: 'Math, science & more subjects', price: 299, color: 'from-violet-500/20 to-purple-500/10', iconColor: 'text-violet-400' },
  { name: 'Personal Trainer', slug: 'personal-trainer', icon: Dumbbell, description: 'Fitness, yoga & nutrition', price: 499, color: 'from-red-500/20 to-orange-500/10', iconColor: 'text-red-400' },
  { name: 'Photography', slug: 'photography', icon: Camera, description: 'Portraits, events & products', price: 999, color: 'from-indigo-500/20 to-blue-500/10', iconColor: 'text-indigo-400' },
];

const PopularServicesSection = () => {
  const navigate = useNavigate();

  return (
    <section className="py-24 bg-bg-primary" id="services">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="inline-block px-3 py-1 rounded-full border border-border-color bg-bg-surface-2 text-xs font-semibold text-accent mb-4 tracking-widest">SERVICES</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-text-primary mb-4">Popular Services</h2>
          <p className="text-text-muted max-w-lg mx-auto">Everything you need, right at your fingertips. Browse our most booked categories.</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <div
                key={service.slug}
                onClick={() => navigate(`/services?category=${service.slug}`)}
                className="card p-5 cursor-pointer group hover:border-accent/40 hover:shadow-[0_0_20px_rgba(79,124,255,0.1)] flex flex-col gap-3"
              >
                <div className={`h-11 w-11 rounded-xl bg-gradient-to-br ${service.color} flex items-center justify-center border border-border-color`}>
                  <Icon className={`h-5 w-5 ${service.iconColor}`} />
                </div>
                <div>
                  <h3 className="font-semibold text-text-primary text-sm group-hover:text-accent transition-colors">{service.name}</h3>
                  <p className="text-text-muted text-xs mt-0.5 line-clamp-2">{service.description}</p>
                </div>
                <div className="flex items-center justify-between mt-auto">
                  <span className="text-success text-xs font-medium">From ₹{service.price}</span>
                  <ArrowRight className="h-3.5 w-3.5 text-text-muted group-hover:text-accent group-hover:translate-x-0.5 transition-all" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default PopularServicesSection;
