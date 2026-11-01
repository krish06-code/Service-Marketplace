import React from 'react';
import { Zap, Droplets, Wind, Sparkles, Wrench, Paintbrush, Hammer, GraduationCap, Dumbbell, Camera, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const services = [
  { name: 'Electrician', slug: 'electrician', icon: Zap, description: 'Wiring, repairs & installations', price: 299, iconBg: 'bg-amber-50', iconColor: 'text-amber-500', border: 'hover:border-amber-200' },
  { name: 'Plumbing', slug: 'plumbing', icon: Droplets, description: 'Leaks, pipes & installations', price: 349, iconBg: 'bg-blue-50', iconColor: 'text-blue-500', border: 'hover:border-blue-200' },
  { name: 'AC Repair', slug: 'ac-repair', icon: Wind, description: 'Service, gas refill & repair', price: 499, iconBg: 'bg-cyan-50', iconColor: 'text-cyan-500', border: 'hover:border-cyan-200' },
  { name: 'Home Cleaning', slug: 'home-cleaning', icon: Sparkles, description: 'Deep clean & regular upkeep', price: 299, iconBg: 'bg-emerald-50', iconColor: 'text-emerald-500', border: 'hover:border-emerald-200' },
  { name: 'Appliance Repair', slug: 'appliance-repair', icon: Wrench, description: 'Washing machines, fridges & more', price: 399, iconBg: 'bg-orange-50', iconColor: 'text-orange-500', border: 'hover:border-orange-200' },
  { name: 'Painting', slug: 'painting', icon: Paintbrush, description: 'Interior & exterior painting', price: 799, iconBg: 'bg-pink-50', iconColor: 'text-pink-500', border: 'hover:border-pink-200' },
  { name: 'Carpentry', slug: 'carpentry', icon: Hammer, description: 'Furniture & woodwork', price: 499, iconBg: 'bg-amber-50', iconColor: 'text-amber-600', border: 'hover:border-amber-200' },
  { name: 'Tutor', slug: 'tutor', icon: GraduationCap, description: 'Math, science & more subjects', price: 299, iconBg: 'bg-violet-50', iconColor: 'text-violet-500', border: 'hover:border-violet-200' },
  { name: 'Personal Trainer', slug: 'personal-trainer', icon: Dumbbell, description: 'Fitness, yoga & nutrition', price: 499, iconBg: 'bg-red-50', iconColor: 'text-red-500', border: 'hover:border-red-200' },
  { name: 'Photography', slug: 'photography', icon: Camera, description: 'Portraits, events & products', price: 999, iconBg: 'bg-indigo-50', iconColor: 'text-indigo-500', border: 'hover:border-indigo-200' },
];

const PopularServicesSection = () => {
  const navigate = useNavigate();

  return (
    <section className="py-20 bg-white" id="services">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="section-badge mb-4">
            <Zap className="h-3 w-3" /> Services
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-text-primary mt-3 mb-4">
            Popular Services
          </h2>
          <p className="text-text-muted max-w-xl mx-auto text-lg leading-relaxed">
            Everything you need, right at your fingertips. Browse our most booked categories.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <div
                key={service.slug}
                onClick={() => navigate(`/professionals?category=${service.slug}`)}
                className={`group bg-white border border-border-color rounded-2xl p-5 cursor-pointer transition-all duration-200 hover:shadow-card-hover ${service.border} hover:-translate-y-1`}
              >
                <div className={`h-12 w-12 rounded-2xl ${service.iconBg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200`}>
                  <Icon className={`h-6 w-6 ${service.iconColor}`} />
                </div>
                <h3 className="font-bold text-text-primary text-sm mb-1 group-hover:text-accent transition-colors">{service.name}</h3>
                <p className="text-text-muted text-xs leading-relaxed line-clamp-2 mb-3">{service.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-emerald-600 text-xs font-bold">From ₹{service.price}</span>
                  <ArrowRight className="h-3.5 w-3.5 text-text-muted group-hover:text-accent group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-10">
          <button
            onClick={() => navigate('/services')}
            className="inline-flex items-center gap-2 px-6 py-3 border border-border-color rounded-xl text-sm font-semibold text-text-secondary hover:border-accent hover:text-accent transition-all"
          >
            View All Services <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default PopularServicesSection;
