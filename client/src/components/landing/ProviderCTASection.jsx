import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, ArrowRight } from 'lucide-react';
import Button from '../ui/Button';

const benefits = ['Set your own schedule', 'No commissions on first 10 bookings', 'Verified badge builds trust', 'Secure COD payments', 'Grow your customer base'];

const ProviderCTASection = () => {
  const navigate = useNavigate();
  return (
    <section className="py-24 bg-bg-surface">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl border border-accent/20 bg-gradient-to-br from-accent/10 via-bg-surface-2 to-accent-2/5 p-10 sm:p-16 overflow-hidden">
          {/* Glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-accent-2/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative flex flex-col lg:flex-row gap-10 items-center">
            <div className="flex-1 text-center lg:text-left">
              <span className="inline-block px-3 py-1 rounded-full border border-accent/30 bg-accent/5 text-xs font-semibold text-accent mb-4 tracking-widest">FOR PROVIDERS</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-text-primary mb-4 leading-tight">
                Your skills deserve<br /><span className="gradient-text">more customers.</span>
              </h2>
              <p className="text-text-muted text-lg mb-8 max-w-lg">
                Join thousands of professionals already growing their business on ServiConnect. Set your availability, receive bookings and get paid — all in one place.
              </p>
              <ul className="space-y-2 mb-8">
                {benefits.map((b, i) => (
                  <li key={i} className="flex items-center gap-2.5 text-text-secondary text-sm">
                    <CheckCircle className="h-4 w-4 text-success shrink-0" /> {b}
                  </li>
                ))}
              </ul>
              <Button variant="primary" size="lg" onClick={() => navigate('/register?role=provider')}>
                Become a Provider <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>

            <div className="lg:w-72 grid grid-cols-2 gap-3">
              {[['₹45K+', 'Avg. monthly earnings'], ['98%', 'Satisfaction rate'], ['< 2 min', 'Booking response'], ['24/7', 'Platform support']].map(([val, lab]) => (
                <div key={lab} className="card p-4 text-center">
                  <div className="text-2xl font-bold gradient-text mb-1">{val}</div>
                  <p className="text-text-muted text-xs">{lab}</p>
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
