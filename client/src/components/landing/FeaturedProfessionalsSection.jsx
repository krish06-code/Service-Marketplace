import React from 'react';
import { Star, CheckCircle, MapPin, IndianRupee, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '../ui/Button';

const providers = [
  { id: 'seed-1', name: 'Rahul Sharma', role: 'AC Repair Specialist', rating: 4.9, reviews: 127, experience: '8 yrs', city: 'Mumbai', price: 499, skills: ['AC Service', 'Gas Refill', 'Repair'], initials: 'RS', color: 'from-orange-400 to-red-400' },
  { id: 'seed-2', name: 'Pradeep Kumar', role: 'Senior Electrician', rating: 4.7, reviews: 203, experience: '10 yrs', city: 'Delhi', price: 399, skills: ['Wiring', 'Fuse Box', 'Lighting'], initials: 'PK', color: 'from-blue-400 to-indigo-400' },
  { id: 'seed-3', name: 'Sunita Devi', role: 'Professional Cleaner', rating: 4.8, reviews: 89, experience: '5 yrs', city: 'Bangalore', price: 299, skills: ['Deep Clean', 'Kitchen', 'Bathroom'], initials: 'SD', color: 'from-emerald-400 to-teal-400' },
  { id: 'seed-4', name: 'Kavitha Reddy', role: 'Math & Physics Tutor', rating: 4.9, reviews: 156, experience: '7 yrs', city: 'Chennai', price: 349, skills: ['JEE Prep', 'Math', 'Physics'], initials: 'KR', color: 'from-violet-400 to-purple-400' },
];

const FeaturedProfessionalsSection = () => {
  const navigate = useNavigate();

  return (
    <section className="py-24 bg-white" id="professionals">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-14">
          <div>
            <span className="section-badge mb-3">Top Professionals</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-text-primary mt-3 mb-3">
              Featured Experts
            </h2>
            <p className="text-text-muted max-w-lg text-lg">
              Top-rated verified professionals ready to help you today.
            </p>
          </div>
          <button
            onClick={() => navigate('/providers')}
            className="inline-flex items-center gap-2 px-5 py-2.5 border border-border-color rounded-xl text-sm font-semibold text-text-secondary hover:border-accent hover:text-accent transition-all whitespace-nowrap shrink-0"
          >
            See All <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {providers.map((p) => (
            <div
              key={p.id}
              className="group bg-white border border-border-color rounded-2xl p-6 flex flex-col gap-4 hover:shadow-card-hover hover:-translate-y-1 transition-all duration-200 cursor-pointer"
              onClick={() => navigate('/providers')}
            >
              {/* Header */}
              <div className="flex items-start gap-3">
                <div className="relative shrink-0">
                  <div className={`h-14 w-14 rounded-full bg-gradient-to-br ${p.color} flex items-center justify-center text-white font-bold text-lg`}>
                    {p.initials}
                  </div>
                  <div className="absolute -bottom-1 -right-1 h-5 w-5 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center">
                    <CheckCircle className="h-3 w-3 text-white fill-current" />
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-bold text-text-primary text-sm truncate group-hover:text-accent transition-colors">{p.name}</h3>
                  <p className="text-text-muted text-xs truncate mt-0.5">{p.role}</p>
                  <div className="flex items-center gap-1 mt-1.5">
                    <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                    <span className="text-xs font-bold text-text-primary">{p.rating}</span>
                    <span className="text-text-muted text-xs">({p.reviews})</span>
                  </div>
                </div>
              </div>

              {/* Skills */}
              <div className="flex flex-wrap gap-1.5">
                {p.skills.map((s, i) => (
                  <span key={i} className="px-2.5 py-1 rounded-lg bg-bg-surface border border-border-color text-text-muted text-xs font-medium">
                    {s}
                  </span>
                ))}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between text-xs border-t border-border-color pt-4 mt-auto">
                <div className="flex items-center gap-1 text-text-muted">
                  <MapPin className="h-3.5 w-3.5 text-accent" /> {p.city}
                </div>
                <div className="flex items-center gap-0.5 text-emerald-600 font-bold">
                  <IndianRupee className="h-3.5 w-3.5" />{p.price}+
                </div>
              </div>

              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={(e) => { e.stopPropagation(); navigate('/providers'); }}
              >
                View Profile
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProfessionalsSection;
