import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, ArrowRight, Star, CheckCircle, Clock, Shield, Zap } from 'lucide-react';
import Button from '../../components/ui/Button';

const suggestions = ['AC Repair', 'Electrician', 'Cleaning', 'Plumbing', 'Carpenter', 'Painting'];

const mockCards = [
  { name: 'Rahul Sharma', role: 'AC Specialist', rating: 4.9, reviews: 127, available: true, price: '₹499', initials: 'RS', color: 'from-orange-400 to-red-400' },
  { name: 'Sunita Devi', role: 'Home Cleaning', rating: 4.8, reviews: 89, available: true, price: '₹299', initials: 'SD', color: 'from-emerald-400 to-teal-400' },
  { name: 'Pradeep Kumar', role: 'Electrician', rating: 4.7, reviews: 203, available: false, price: '₹399', initials: 'PK', color: 'from-blue-400 to-indigo-400' },
];

const floatingBadges = [
  { icon: Shield, label: 'Verified Pro', value: '2000+', color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-200' },
  { icon: Star, label: 'Avg Rating', value: '4.8★', color: 'text-amber-600', bg: 'bg-amber-50 border-amber-200' },
  { icon: CheckCircle, label: 'Jobs Done', value: '10k+', color: 'text-blue-600', bg: 'bg-blue-50 border-blue-200' },
];

const HeroSection = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [location, setLocation] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/professionals?q=${encodeURIComponent(query)}&location=${encodeURIComponent(location)}`);
  };

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-white pt-16">
      {/* Background decorations */}
      <div className="absolute inset-0 hero-pattern pointer-events-none" />
      <div className="absolute top-20 right-0 w-[600px] h-[600px] rounded-full bg-accent/6 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-orange-100 blur-[100px] pointer-events-none" />

      {/* Orange diagonal accent */}
      <div className="absolute right-0 top-0 bottom-0 w-[42%] bg-gradient-to-bl from-[#FFF5F2] to-white pointer-events-none hidden lg:block" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid lg:grid-cols-2 gap-16 items-center w-full">
        {/* Left Content */}
        <div className="flex flex-col gap-6 z-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 w-fit">
            <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
            <span className="text-xs font-bold text-accent tracking-widest uppercase">
              India's #1 Service Marketplace
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-text-primary leading-[1.1] tracking-tight">
            Get Your Job Done{' '}
            <span className="relative">
              <span className="gradient-text">By Experts</span>
              <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 320 12" fill="none">
                <path d="M2 10C60 4 160 2 318 10" stroke="#F45B35" strokeWidth="3" strokeLinecap="round" />
              </svg>
            </span>
            <br />
            <span className="text-text-secondary text-3xl sm:text-4xl lg:text-5xl font-bold">— Right At Your Doorstep</span>
          </h1>

          <p className="text-lg text-text-muted max-w-lg leading-relaxed">
            Explore our marketplace to find top-rated professionals in your area. Compare reviews, check availability, and book services with confidence — all in one place.
          </p>

          {/* Search Bar */}
          <form
            onSubmit={handleSearch}
            className="bg-white border border-border-color rounded-2xl p-2 flex flex-col sm:flex-row gap-2 shadow-[0_4px_30px_rgba(0,0,0,0.08)]"
          >
            <div className="flex items-center gap-2 flex-1 px-3 py-2">
              <Search className="h-4 w-4 text-text-muted shrink-0" />
              <input
                type="text"
                placeholder="Search for a service..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="bg-transparent text-text-primary placeholder-text-muted text-sm outline-none flex-1 min-w-0"
              />
            </div>
            <div className="hidden sm:flex items-center">
              <div className="h-6 w-px bg-border-color" />
            </div>
            <div className="flex items-center gap-2 flex-1 px-3 py-2">
              <MapPin className="h-4 w-4 text-accent shrink-0" />
              <input
                type="text"
                placeholder="Enter your location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="bg-transparent text-text-primary placeholder-text-muted text-sm outline-none flex-1 min-w-0"
              />
            </div>
            <button
              type="submit"
              className="shrink-0 px-6 py-2.5 bg-accent hover:bg-accent-dark text-white text-sm font-bold rounded-xl transition-all shadow-[0_4px_14px_rgba(244,91,53,0.35)] hover:shadow-[0_6px_20px_rgba(244,91,53,0.45)] hover:-translate-y-0.5 flex items-center gap-2"
            >
              <Search className="h-4 w-4" />
              <span>Search</span>
            </button>
          </form>

          {/* Quick suggestions */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-text-muted text-sm font-medium">Popular:</span>
            {suggestions.map((s) => (
              <button
                key={s}
                onClick={() => navigate(`/professionals?q=${encodeURIComponent(s)}`)}
                className="px-3 py-1.5 rounded-full border border-border-color bg-white text-text-muted text-xs font-medium hover:border-accent hover:text-accent hover:bg-accent/5 transition-all"
              >
                {s}
              </button>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Button variant="primary" size="lg" onClick={() => navigate('/professionals')}>
              Find a Professional <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button variant="outline" size="lg" onClick={() => navigate('/services')}>
              Explore Services
            </Button>
          </div>

          {/* Trust indicators */}
          <div className="flex items-center gap-6 pt-2">
            <div className="flex -space-x-2">
              {['RS', 'PK', 'SD', 'KR', 'MN'].map((init, i) => (
                <div
                  key={i}
                  className="h-8 w-8 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-bold"
                  style={{ background: `hsl(${i * 40 + 20}, 70%, 55%)` }}
                >
                  {init}
                </div>
              ))}
            </div>
            <div>
              <div className="flex items-center gap-1 mb-0.5">
                {[1,2,3,4,5].map(i => (
                  <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-text-muted text-xs"><span className="font-bold text-text-primary">2,000+</span> trusted professionals</p>
            </div>
          </div>
        </div>

        {/* Right — Floating Cards */}
        <div className="hidden lg:block relative h-[550px]">
          {/* Floating provider cards */}
          {mockCards.map((card, i) => (
            <div
              key={i}
              className="absolute bg-white border border-border-color rounded-2xl p-4 w-72 shadow-card"
              style={{
                top: `${8 + i * 26}%`,
                left: i % 2 === 0 ? '0%' : '15%',
                zIndex: 10 - i,
                animation: `float${i} ${4 + i}s ease-in-out infinite alternate`,
              }}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className={`h-11 w-11 rounded-full bg-gradient-to-br ${card.color} flex items-center justify-center text-white font-bold text-sm shrink-0`}>
                  {card.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-text-primary text-sm truncate">{card.name}</span>
                    <CheckCircle className="h-3.5 w-3.5 text-emerald-500 fill-emerald-500 shrink-0" />
                  </div>
                  <p className="text-text-muted text-xs">{card.role}</p>
                </div>
                <span className="text-accent font-bold text-sm shrink-0">{card.price}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1">
                  <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                  <span className="font-bold text-text-primary">{card.rating}</span>
                  <span className="text-text-muted">({card.reviews})</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className={`h-2 w-2 rounded-full ${card.available ? 'bg-emerald-400' : 'bg-text-muted'}`} />
                  <span className={`font-medium ${card.available ? 'text-emerald-600' : 'text-text-muted'}`}>
                    {card.available ? 'Available Now' : 'Busy'}
                  </span>
                </div>
              </div>
            </div>
          ))}

          {/* Booking confirmed badge */}
          <div
            className="absolute bottom-16 right-4 bg-white border border-emerald-200 rounded-2xl p-3.5 z-20 shadow-card"
            style={{ animation: 'float3 5s ease-in-out infinite alternate' }}
          >
            <div className="flex items-center gap-2 mb-1">
              <div className="h-6 w-6 rounded-full bg-emerald-100 flex items-center justify-center">
                <CheckCircle className="h-3.5 w-3.5 text-emerald-600" />
              </div>
              <span className="text-emerald-700 text-xs font-bold">Booking Confirmed!</span>
            </div>
            <p className="text-text-muted text-xs pl-8">AC Repair · Today, 2:00 PM</p>
          </div>

          {/* Next available badge */}
          <div
            className="absolute top-8 right-8 bg-white border border-border-color rounded-2xl p-3.5 z-20 shadow-card"
            style={{ animation: 'float4 6s ease-in-out infinite alternate' }}
          >
            <div className="flex items-center gap-2 mb-1">
              <div className="h-6 w-6 rounded-full bg-accent/10 flex items-center justify-center">
                <Clock className="h-3.5 w-3.5 text-accent" />
              </div>
              <span className="text-accent text-xs font-bold">Next Available</span>
            </div>
            <p className="text-text-primary text-xs font-semibold pl-8">Today · 10:00 AM</p>
          </div>

          {/* Floating stat badges */}
          <div className="absolute bottom-4 left-4 flex flex-col gap-2">
            {floatingBadges.map((badge, i) => {
              const Icon = badge.icon;
              return (
                <div
                  key={i}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl border ${badge.bg} shadow-sm`}
                  style={{ animation: `floatStat${i} ${3 + i}s ease-in-out infinite alternate` }}
                >
                  <Icon className={`h-4 w-4 ${badge.color}`} />
                  <div>
                    <p className={`text-xs font-bold ${badge.color}`}>{badge.value}</p>
                    <p className="text-[10px] text-text-muted">{badge.label}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Inline CSS for float animations */}
          <style>{`
            @keyframes float0 { 0%{transform:translateY(0px)} 100%{transform:translateY(-14px)} }
            @keyframes float1 { 0%{transform:translateY(-4px)} 100%{transform:translateY(-18px)} }
            @keyframes float2 { 0%{transform:translateY(0px)} 100%{transform:translateY(-10px)} }
            @keyframes float3 { 0%{transform:translateY(0px)} 100%{transform:translateY(-8px)} }
            @keyframes float4 { 0%{transform:translateY(0px)} 100%{transform:translateY(-12px)} }
            @keyframes floatStat0 { 0%{transform:translateY(0px)} 100%{transform:translateY(-6px)} }
            @keyframes floatStat1 { 0%{transform:translateY(-3px)} 100%{transform:translateY(-9px)} }
            @keyframes floatStat2 { 0%{transform:translateY(0px)} 100%{transform:translateY(-7px)} }
          `}</style>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
