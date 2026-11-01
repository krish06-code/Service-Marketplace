import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, ArrowRight, Users, TrendingUp, Clock, Shield } from 'lucide-react';
import Button from '../ui/Button';

const benefits = [
  'Set your own schedule & rates',
  'No commissions on first 10 bookings',
  'Verified badge builds customer trust',
  'Secure Cash on Delivery payments',
  'Grow your customer base effortlessly',
];

const stats = [
  { icon: TrendingUp, value: '₹45K+', label: 'Avg. monthly earnings', color: 'text-accent' },
  { icon: Users, value: '98%', label: 'Satisfaction rate', color: 'text-emerald-600' },
  { icon: Clock, value: '< 2 min', label: 'Booking response', color: 'text-blue-600' },
  { icon: Shield, value: '24/7', label: 'Platform support', color: 'text-violet-600' },
];

const ProviderCTASection = () => {
  const navigate = useNavigate();
  return (
    <section className="py-24 bg-bg-surface">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-[#171717] text-white p-10 sm:p-16">
          {/* Background glow decorations */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-accent/20 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-orange-500/10 rounded-full blur-[80px] pointer-events-none" />

          {/* Dot pattern */}
          <div className="absolute inset-0 opacity-5 pointer-events-none"
            style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '30px 30px' }}
          />

          <div className="relative flex flex-col lg:flex-row gap-12 items-center">
            {/* Left */}
            <div className="flex-1">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/20 border border-accent/30 text-accent text-xs font-bold tracking-widest uppercase mb-5">
                For Service Providers
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold mb-4 leading-tight">
                Your Skills Deserve{' '}
                <span className="text-accent">More Customers.</span>
              </h2>
              <p className="text-white/60 text-lg mb-8 max-w-lg leading-relaxed">
                Join thousands of professionals already growing their business on ServiConnect. Set your availability, receive bookings and get paid — all in one place.
              </p>
              <ul className="space-y-3 mb-8">
                {benefits.map((b, i) => (
                  <li key={i} className="flex items-center gap-3 text-white/80 text-sm">
                    <div className="h-5 w-5 rounded-full bg-accent/20 border border-accent/30 flex items-center justify-center shrink-0">
                      <CheckCircle className="h-3.5 w-3.5 text-accent" />
                    </div>
                    {b}
                  </li>
                ))}
              </ul>
              <div className="flex gap-3 flex-wrap">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => navigate('/register?role=provider')}
                >
                  Become a Provider <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <button
                  onClick={() => navigate('/#how-it-works')}
                  className="px-6 py-3 border border-white/20 hover:border-white/40 text-white text-base font-semibold rounded-xl transition-all hover:bg-white/5"
                >
                  Learn More
                </button>
              </div>
            </div>

            {/* Right — Stats Grid */}
            <div className="lg:w-80 grid grid-cols-2 gap-4">
              {stats.map(({ icon: Icon, value, label, color }) => (
                <div key={label} className="bg-white/5 border border-white/10 rounded-2xl p-5 text-center hover:bg-white/10 transition-colors">
                  <Icon className={`h-6 w-6 ${color} mx-auto mb-2`} />
                  <div className="text-2xl font-extrabold text-white mb-1">{value}</div>
                  <p className="text-white/50 text-xs">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProviderCTASection;
