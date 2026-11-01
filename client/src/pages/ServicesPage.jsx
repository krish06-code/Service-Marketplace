import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Zap, Droplets, Wind, Sparkles, Wrench, Paintbrush, Hammer, 
  GraduationCap, Dumbbell, Camera, Search, ArrowRight, ShieldCheck, 
  CheckCircle, Clock, IndianRupee, Star, HelpCircle 
} from 'lucide-react';
import PublicLayout from '../components/layout/PublicLayout';
import { categoryAPI } from '../services/api';
import Button from '../components/ui/Button';

// Default enriched category metadata with common included tasks and starting prices
const enrichedCategoryData = {
  electrician: {
    icon: Zap,
    color: 'text-amber-500',
    bg: 'bg-amber-50',
    border: 'hover:border-amber-300',
    price: 299,
    tasks: ['Wiring & Rewiring', 'Switchboard Repair', 'Fan & Light Install', 'MCB & Fuse Trips'],
    time: '30-45 mins',
  },
  plumbing: {
    icon: Droplets,
    color: 'text-blue-500',
    bg: 'bg-blue-50',
    border: 'hover:border-blue-300',
    price: 349,
    tasks: ['Tap & Pipe Leakage', 'Water Heater Repair', 'Drain Cleaning', 'Toilet & Basin Fix'],
    time: '30-60 mins',
  },
  'ac-repair': {
    icon: Wind,
    color: 'text-cyan-500',
    bg: 'bg-cyan-50',
    border: 'hover:border-cyan-300',
    price: 499,
    tasks: ['Cooling Problem', 'Gas Refill & Leak Fix', 'Deep Jet Cleaning', 'Filter Replacement'],
    time: '45-60 mins',
  },
  'home-cleaning': {
    icon: Sparkles,
    color: 'text-emerald-500',
    bg: 'bg-emerald-50',
    border: 'hover:border-emerald-300',
    price: 299,
    tasks: ['Kitchen Deep Clean', 'Bathroom Sanitization', 'Sofa & Carpet Shampoing', 'Full Home Move-in'],
    time: '2-4 hours',
  },
  'appliance-repair': {
    icon: Wrench,
    color: 'text-orange-500',
    bg: 'bg-orange-50',
    border: 'hover:border-orange-300',
    price: 399,
    tasks: ['Washing Machine', 'Refrigerator Check', 'Microwave Repair', 'Water Purifier RO'],
    time: '45 mins',
  },
  painting: {
    icon: Paintbrush,
    color: 'text-pink-500',
    bg: 'bg-pink-50',
    border: 'hover:border-pink-300',
    price: 799,
    tasks: ['Interior Wall Painting', 'Waterproofing', 'Accent Wall & Texture', 'Wood Polish'],
    time: '1-3 days',
  },
  carpentry: {
    icon: Hammer,
    color: 'text-amber-600',
    bg: 'bg-amber-50',
    border: 'hover:border-amber-300',
    price: 499,
    tasks: ['Door Lock & Hinge', 'Furniture Assembly', 'Custom Shelving', 'Cupboard Repair'],
    time: '1-2 hours',
  },
  tutor: {
    icon: GraduationCap,
    color: 'text-violet-500',
    bg: 'bg-violet-50',
    border: 'hover:border-violet-300',
    price: 299,
    tasks: ['Maths & Sciences', 'English & Languages', 'Board Exam Prep', 'Primary & Secondary'],
    time: 'Per hour',
  },
  'personal-trainer': {
    icon: Dumbbell,
    color: 'text-rose-500',
    bg: 'bg-rose-50',
    border: 'hover:border-rose-300',
    price: 499,
    tasks: ['Weight Loss & Muscle', 'Yoga & Flexibility', 'Personalized Diet', 'Home Workouts'],
    time: '60 mins',
  },
  photography: {
    icon: Camera,
    color: 'text-indigo-500',
    bg: 'bg-indigo-50',
    border: 'hover:border-indigo-300',
    price: 999,
    tasks: ['Portraits & Headshots', 'Family & Birthdays', 'Product Shoots', 'Event Coverage'],
    time: 'Per session',
  },
};

const popularPackages = [
  {
    title: 'Complete AC Super Service',
    category: 'AC Repair',
    price: 599,
    originalPrice: 899,
    duration: '60 mins',
    features: ['Foam-jet indoor unit cleaning', 'Outdoor condenser power wash', 'Gas pressure & leak check', '10-day cooling warranty'],
    tag: 'Bestseller',
    slug: 'ac-repair',
  },
  {
    title: 'Full Home Deep Cleaning',
    category: 'Home Cleaning',
    price: 1499,
    originalPrice: 2199,
    duration: '3-4 hours',
    features: ['Floor scrubbing with machine', 'Complete bathroom acid-free scrub', 'Kitchen oil degreasing', 'Window panes & balconies'],
    tag: 'Popular',
    slug: 'home-cleaning',
  },
  {
    title: 'Complete Electrical Health Check',
    category: 'Electrician',
    price: 399,
    originalPrice: 650,
    duration: '45 mins',
    features: ['Full house wiring diagnostic', 'Switchboard earth-leakage check', 'MCB load assessment', 'Minor switch fixes included'],
    tag: 'Safety Assured',
    slug: 'electrician',
  },
];

const ServicesPage = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    categoryAPI.getAll()
      .then(res => setCategories(res.data.data || []))
      .catch(() => setCategories([]))
      .finally(() => setIsLoading(false));
  }, []);

  // Merge backend categories with visual enrichment
  const displayedCategories = (categories.length > 0 ? categories : [
    { name: 'Electrician', slug: 'electrician', description: 'Certified electrical repairs, wiring, and appliance fittings' },
    { name: 'Plumbing', slug: 'plumbing', description: 'Expert leak repairs, fixture installations, and pipe fixing' },
    { name: 'AC Repair', slug: 'ac-repair', description: 'Cooling diagnostics, gas refills, and deep jet cleaning' },
    { name: 'Home Cleaning', slug: 'home-cleaning', description: 'Thorough, spotless deep cleaning and sanitized spaces' },
    { name: 'Appliance Repair', slug: 'appliance-repair', description: 'Fast diagnostics for refrigerators, washers, and ovens' },
    { name: 'Painting', slug: 'painting', description: 'Premium wall paints, waterproofing, and finish coatings' },
    { name: 'Carpentry', slug: 'carpentry', description: 'Custom furniture repair, woodwork, and lock fitting' },
    { name: 'Tutor', slug: 'tutor', description: 'Personalized private tutoring in academic and skill subjects' },
    { name: 'Personal Trainer', slug: 'personal-trainer', description: 'One-on-one fitness coaching, weight loss, and diet plans' },
    { name: 'Photography', slug: 'photography', description: 'Professional shoots for events, portraits, and branding' },
  ]).filter(cat => {
    const matchesSearch = 
      cat.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      (cat.description && cat.description.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesSearch;
  });

  return (
    <PublicLayout>
      {/* Hero Header */}
      <div className="bg-gradient-to-b from-[#FFF5F2] via-white to-white border-b border-border-color pt-12 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-bold mb-4 shadow-xs">
            <ShieldCheck className="h-4 w-4" />
            100% Verified Local Professionals
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-text-primary tracking-tight">
            Browse All <span className="text-accent underline decoration-accent/30 underline-offset-8">Services</span>
          </h1>
          <p className="text-text-muted mt-4 text-lg max-w-2xl mx-auto leading-relaxed">
            Transparent upfront pricing, background-checked specialists, and hassle-free Cash on Delivery. Select a service to find available experts.
          </p>

          {/* Search bar inside header */}
          <div className="max-w-xl mx-auto mt-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-text-muted" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search services (e.g. AC repair, plumbing, electrician, cleaning)..."
                className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-border-color bg-white text-text-primary text-sm shadow-[0_4px_20px_rgba(0,0,0,0.06)] focus:outline-hidden focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-text-muted hover:text-text-primary"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Services Catalog Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-bold text-text-primary">Service Categories</h2>
            <p className="text-text-muted text-sm mt-0.5">Showing {displayedCategories.length} categories available for instant booking</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/professionals')}
            className="self-start sm:self-auto"
          >
            View All Professionals <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        </div>

        {/* Categories Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedCategories.map((cat) => {
            const meta = enrichedCategoryData[cat.slug] || {
              icon: Wrench,
              color: 'text-accent',
              bg: 'bg-accent/10',
              border: 'hover:border-accent/40',
              price: 299,
              tasks: ['General Diagnostics', 'Quick Repair', 'Doorstep Consultation'],
              time: '30-45 mins',
            };
            const Icon = meta.icon;

            return (
              <div
                key={cat.slug}
                className={`bg-white border border-border-color rounded-2xl p-6 flex flex-col justify-between transition-all duration-300 shadow-card hover:shadow-card-hover ${meta.border} hover:-translate-y-1 group`}
              >
                <div>
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className={`h-14 w-14 rounded-2xl ${meta.bg} flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-xs`}>
                      <Icon className={`h-7 w-7 ${meta.color}`} />
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-text-muted uppercase tracking-wider font-semibold block">Starts at</span>
                      <span className="text-lg font-bold text-accent">₹{meta.price}</span>
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-text-primary group-hover:text-accent transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-text-muted text-sm mt-1.5 leading-relaxed line-clamp-2">
                    {cat.description || `Professional ${cat.name.toLowerCase()} services at your doorstep with verified experts.`}
                  </p>

                  {/* Included Tasks tags */}
                  <div className="mt-4 pt-4 border-t border-border-color/80">
                    <span className="text-xs font-semibold text-text-secondary block mb-2">Common Services:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {meta.tasks.map((task, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 rounded-lg bg-bg-surface text-text-secondary text-xs font-medium border border-border-color/60"
                        >
                          {task}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Bottom Card Actions */}
                <div className="mt-6 pt-4 border-t border-border-color flex items-center justify-between gap-3">
                  <div className="flex items-center gap-1.5 text-xs text-text-muted">
                    <Clock className="h-3.5 w-3.5 text-accent" />
                    <span>Avg. {meta.time}</span>
                  </div>
                  <button
                    onClick={() => navigate(`/professionals?category=${cat.slug}`)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-accent/10 hover:bg-accent text-accent hover:text-white text-xs font-bold transition-all"
                  >
                    Find Specialists
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Featured Service Packages */}
      <div className="bg-bg-surface py-16 border-y border-border-color">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="section-badge mb-3">Instant Booking</span>
            <h2 className="text-3xl font-extrabold text-text-primary">Popular Service Packages</h2>
            <p className="text-text-muted text-sm mt-2">
              Fixed upfront prices with zero hidden charges. Inspected, serviced, and guaranteed.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {popularPackages.map((pkg, i) => (
              <div key={i} className="bg-white border border-border-color rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2.5 py-0.5 rounded-full bg-accent/10 text-accent text-xs font-bold uppercase tracking-wider">
                      {pkg.tag}
                    </span>
                    <span className="text-xs text-text-muted flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" /> {pkg.duration}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-text-primary">{pkg.title}</h3>
                  <div className="flex items-baseline gap-2 mt-2 mb-4">
                    <span className="text-2xl font-black text-text-primary">₹{pkg.price}</span>
                    <span className="text-sm text-text-muted line-through">₹{pkg.originalPrice}</span>
                    <span className="text-xs font-bold text-emerald-600">Save ₹{pkg.originalPrice - pkg.price}</span>
                  </div>

                  <ul className="space-y-2 mb-6">
                    {pkg.features.map((feat, fidx) => (
                      <li key={fidx} className="flex items-center gap-2 text-xs text-text-secondary">
                        <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Button
                  variant="primary"
                  className="w-full"
                  onClick={() => navigate(`/professionals?category=${pkg.slug}`)}
                >
                  Book Specialist for ₹{pkg.price}
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Trust & Guarantee Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-[#171717] rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden">
          <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-accent/20 to-transparent pointer-events-none" />
          <div className="relative z-10 max-w-2xl">
            <span className="px-3 py-1 rounded-full bg-white/10 text-white/90 text-xs font-semibold uppercase tracking-wider mb-4 inline-block">
              The ServiConnect Promise
            </span>
            <h3 className="text-2xl sm:text-3xl font-black mb-3">
              Guaranteed Satisfaction on Every Service
            </h3>
            <p className="text-white/70 text-sm leading-relaxed mb-6">
              Every job booked through ServiConnect comes with our 7-day service warranty, verified background-checked experts, and complete Cash on Delivery peace of mind.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button
                variant="primary"
                onClick={() => navigate('/professionals')}
              >
                Find a Professional Now
              </Button>
              <Button
                variant="ghost"
                className="text-white border border-white/20 hover:bg-white/10"
                onClick={() => navigate('/how-it-works')}
              >
                Learn How It Works
              </Button>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
};

export default ServicesPage;
