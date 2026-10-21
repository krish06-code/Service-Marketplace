import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, ArrowRight, Star, CheckCircle, Clock } from 'lucide-react';
import DecryptText from '../../components/ui/DecryptText';
import Button from '../../components/ui/Button';

const suggestions = ['AC Repair', 'Electrician', 'Cleaning', 'Plumbing', 'Tutor', 'Carpenter'];

const mockCards = [
  { name: 'Rahul Sharma', role: 'AC Specialist', rating: 4.9, reviews: 127, available: true, price: '₹499', city: 'Mumbai' },
  { name: 'Sunita Devi', role: 'Home Cleaning', rating: 4.8, reviews: 89, available: true, price: '₹299', city: 'Bangalore' },
  { name: 'Pradeep Kumar', role: 'Electrician', rating: 4.7, reviews: 203, available: false, price: '₹399', city: 'Delhi' },
];

const HeroSection = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [location, setLocation] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/services?q=${encodeURIComponent(query)}&location=${encodeURIComponent(location)}`);
  };

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-bg-primary">
        <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-40" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-accent/5 blur-[120px] pointer-events-none" />
        <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full bg-accent-2/5 blur-[80px] pointer-events-none" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 grid lg:grid-cols-2 gap-16 items-center w-full">
        {/* Left */}
        <div className="flex flex-col gap-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-accent/30 bg-accent/5 w-fit">
            <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
            <span className="text-xs font-semibold text-accent tracking-widest">
              <DecryptText text="LOCAL EXPERTS. ON DEMAND." speed={30} revealDirection="start" encryptedClassName="text-accent/40" className="text-accent" />
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-text-primary leading-tight tracking-tight">
            <DecryptText text="Find trusted" speed={40} revealDirection="start" className="text-text-primary" encryptedClassName="text-text-muted" />
            {' '}
            <span className="gradient-text">
              <DecryptText text="professionals" speed={40} revealDirection="start" className="gradient-text" encryptedClassName="text-accent/40" />
            </span>
            <br />
            <DecryptText text="for anything you need." speed={35} revealDirection="start" className="text-text-primary" encryptedClassName="text-text-muted" />
          </h1>

          <p className="text-lg text-text-secondary max-w-lg leading-relaxed">
            From quick repairs to expert consultations, discover verified professionals near you and book services in minutes.
          </p>

          {/* Search */}
          <form onSubmit={handleSearch} className="bg-bg-surface border border-border-color rounded-2xl p-3 flex flex-col sm:flex-row gap-2 shadow-[0_0_40px_rgba(79,124,255,0.08)]">
            <div className="flex items-center gap-2 flex-1 bg-bg-surface-2 rounded-xl px-4 py-2.5">
              <Search className="h-4 w-4 text-text-muted shrink-0" />
              <input
                type="text"
                placeholder="What service do you need?"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="bg-transparent text-text-primary placeholder-text-muted text-sm outline-none flex-1"
              />
            </div>
            <div className="flex items-center gap-2 flex-1 bg-bg-surface-2 rounded-xl px-4 py-2.5">
              <MapPin className="h-4 w-4 text-text-muted shrink-0" />
              <input
                type="text"
                placeholder="Enter your location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="bg-transparent text-text-primary placeholder-text-muted text-sm outline-none flex-1"
              />
            </div>
            <Button type="submit" variant="primary" className="shrink-0 px-6">
              <Search className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Search</span>
            </Button>
          </form>

          {/* Quick suggestions */}
          <div className="flex flex-wrap gap-2">
            <span className="text-text-muted text-sm">Popular:</span>
            {suggestions.map((s) => (
              <button
                key={s}
                onClick={() => navigate(`/services?q=${encodeURIComponent(s)}`)}
                className="px-3 py-1 rounded-full border border-border-color bg-bg-surface-2 text-text-muted text-xs hover:border-accent hover:text-accent transition-colors"
              >
                {s}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-6 pt-2">
            <Button variant="primary" size="lg" onClick={() => navigate('/services')}>
              Find a Professional <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button variant="secondary" size="lg" onClick={() => navigate('/register?role=provider')}>
              Become a Provider
            </Button>
          </div>
        </div>

        {/* Right — mock floating cards */}
        <div className="hidden lg:block relative h-[500px]">
          <div className="absolute inset-0 flex items-center justify-center">
            {/* Background glow */}
            <div className="absolute w-80 h-80 rounded-full bg-accent/8 blur-3xl" />

            {/* Provider cards */}
            {mockCards.map((card, i) => (
              <div
                key={i}
                className="absolute card p-4 w-72 hover:shadow-[0_0_30px_rgba(79,124,255,0.15)] transition-all"
                style={{
                  top: `${10 + i * 28}%`,
                  left: i % 2 === 0 ? '5%' : '20%',
                  zIndex: 10 - i,
                  transform: `rotate(${i === 1 ? '-2deg' : i === 2 ? '1.5deg' : '0deg'})`,
                  animation: `float${i} 4s ease-in-out infinite alternate`,
                }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-accent to-accent-2 flex items-center justify-center text-white font-bold text-sm shrink-0">
                    {card.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1">
                      <span className="font-semibold text-text-primary text-sm truncate">{card.name}</span>
                      <CheckCircle className="h-3.5 w-3.5 text-success fill-success shrink-0" />
                    </div>
                    <p className="text-text-muted text-xs">{card.role}</p>
                  </div>
                  <span className="text-success font-semibold text-sm shrink-0">{card.price}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 fill-warning text-warning" />
                    <span className="text-text-primary font-medium">{card.rating}</span>
                    <span className="text-text-muted">({card.reviews})</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className={`h-1.5 w-1.5 rounded-full ${card.available ? 'bg-success' : 'bg-text-muted'}`} />
                    <span className={card.available ? 'text-success' : 'text-text-muted'}>
                      {card.available ? 'Available Today' : 'Busy'}
                    </span>
                  </div>
                </div>
              </div>
            ))}

            {/* Booking confirmation float */}
            <div className="absolute bottom-8 right-0 w-56 card p-3 border-success/30 bg-success/5 z-20" style={{ animation: 'float3 5s ease-in-out infinite alternate' }}>
              <div className="flex items-center gap-2 mb-1">
                <CheckCircle className="h-4 w-4 text-success" />
                <span className="text-success text-xs font-semibold">Booking Confirmed!</span>
              </div>
              <p className="text-text-muted text-xs">AC Repair · Today, 2:00 PM</p>
            </div>

            <div className="absolute top-4 right-4 w-44 card p-3 z-20" style={{ animation: 'float4 6s ease-in-out infinite alternate' }}>
              <div className="flex items-center gap-1 mb-1">
                <Clock className="h-3.5 w-3.5 text-accent" />
                <span className="text-accent text-xs font-semibold">Next Available</span>
              </div>
              <p className="text-text-primary text-xs font-medium">Today · 10:00 AM</p>
            </div>
          </div>

          {/* Inline CSS for float animations */}
          <style>{`
            @keyframes float0 { 0%{transform:translateY(0px) rotate(0deg)} 100%{transform:translateY(-12px) rotate(0deg)} }
            @keyframes float1 { 0%{transform:translateY(0px) rotate(-2deg)} 100%{transform:translateY(-8px) rotate(-2deg)} }
            @keyframes float2 { 0%{transform:translateY(0px) rotate(1.5deg)} 100%{transform:translateY(-10px) rotate(1.5deg)} }
            @keyframes float3 { 0%{transform:translateY(0px)} 100%{transform:translateY(-6px)} }
            @keyframes float4 { 0%{transform:translateY(0px)} 100%{transform:translateY(-8px)} }
          `}</style>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
