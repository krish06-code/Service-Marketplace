import React from 'react';
import { Star, CheckCircle, MapPin, IndianRupee } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '../ui/Button';

const providers = [
  { id: 'seed-1', name: 'Rahul Sharma', role: 'AC Repair Specialist', rating: 4.9, reviews: 127, experience: '8 yrs', city: 'Mumbai', price: 499, skills: ['AC Service', 'Gas Refill', 'Repair'] },
  { id: 'seed-2', name: 'Pradeep Kumar', role: 'Senior Electrician', rating: 4.7, reviews: 203, experience: '10 yrs', city: 'Delhi', price: 399, skills: ['Wiring', 'Fuse Box', 'Lighting'] },
  { id: 'seed-3', name: 'Sunita Devi', role: 'Professional Cleaner', rating: 4.8, reviews: 89, experience: '5 yrs', city: 'Bangalore', price: 299, skills: ['Deep Clean', 'Kitchen', 'Bathroom'] },
  { id: 'seed-4', name: 'Kavitha Reddy', role: 'Math & Physics Tutor', rating: 4.9, reviews: 156, experience: '7 yrs', city: 'Chennai', price: 349, skills: ['JEE Prep', 'Math', 'Physics'] },
];

const FeaturedProfessionalsSection = () => {
  const navigate = useNavigate();

  return (
    <section className="py-24 bg-bg-primary" id="professionals">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="inline-block px-3 py-1 rounded-full border border-border-color bg-bg-surface-2 text-xs font-semibold text-accent mb-4 tracking-widest">PROFESSIONALS</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-text-primary mb-4">Featured Experts</h2>
          <p className="text-text-muted max-w-lg mx-auto">Top-rated verified professionals ready to help you today.</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {providers.map((p) => (
            <div key={p.id} className="card p-5 flex flex-col gap-4 group hover:border-accent/40 hover:shadow-[0_0_20px_rgba(79,124,255,0.1)]">
              <div className="flex items-start gap-3">
                <div className="relative shrink-0">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-accent to-accent-2 flex items-center justify-center text-white font-bold">
                    {p.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="absolute -bottom-1 -right-1 bg-success rounded-full p-0.5">
                    <CheckCircle className="h-3 w-3 text-white fill-current" />
                  </div>
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold text-text-primary text-sm truncate group-hover:text-accent transition-colors">{p.name}</h3>
                  <p className="text-text-muted text-xs truncate">{p.role}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Star className="h-3 w-3 fill-warning text-warning" />
                    <span className="text-xs font-medium text-text-primary">{p.rating}</span>
                    <span className="text-text-muted text-xs">({p.reviews})</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-1">
                {p.skills.map((s, i) => (
                  <span key={i} className="px-2 py-0.5 rounded bg-bg-surface-2 border border-border-color text-text-muted text-xs">{s}</span>
                ))}
              </div>

              <div className="flex items-center justify-between text-xs border-t border-border-color pt-3">
                <div className="flex items-center gap-1 text-text-muted">
                  <MapPin className="h-3 w-3" /> {p.city}
                </div>
                <div className="flex items-center gap-0.5 text-success font-semibold">
                  <IndianRupee className="h-3 w-3" />{p.price}+
                </div>
              </div>

              <Button variant="secondary" size="sm" className="w-full" onClick={() => navigate('/providers')}>
                View Profile
              </Button>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Button variant="ghost" className="border border-border-color" onClick={() => navigate('/providers')}>
            See All Professionals →
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProfessionalsSection;
