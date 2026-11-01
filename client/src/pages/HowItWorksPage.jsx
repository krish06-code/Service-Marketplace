import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, UserCheck, CalendarCheck, IndianRupee, ShieldCheck, 
  CheckCircle, ArrowRight, Star, Clock, HelpCircle, ChevronDown, 
  Briefcase, Zap, Smartphone, Sparkles, Award, Lock
} from 'lucide-react';
import PublicLayout from '../components/layout/PublicLayout';
import Button from '../components/ui/Button';

const customerSteps = [
  {
    step: '01',
    title: 'Choose a Service & Describe Your Need',
    desc: 'Browse our extensive catalog of verified home and personal services. Tell us what needs fixing or pick from pre-priced packages.',
    icon: Search,
    iconBg: 'bg-orange-500',
    details: ['Select from 10+ core home service categories', 'Transparent prices with zero hidden charges', 'Instant online availability in your pincode'],
  },
  {
    step: '02',
    title: 'Compare & Choose Your Specialist',
    desc: 'Review verified local professionals with genuine customer ratings, completed job counts, years of experience, and transparent hourly/fixed rates.',
    icon: UserCheck,
    iconBg: 'bg-blue-500',
    details: ['100% background-verified identities', 'Verified reviews from real completed bookings', 'Distance and neighborhood-specific matches'],
  },
  {
    step: '03',
    title: 'Pick a Convenient Live Slot',
    desc: 'Select your preferred date and time from the professional’s real-time schedule. Confirm your address and any special instructions.',
    icon: CalendarCheck,
    iconBg: 'bg-emerald-500',
    details: ['Real-time 1-hour service arrival windows', 'Same-day and next-day emergency booking', 'Instant SMS & in-app booking confirmation'],
  },
  {
    step: '04',
    title: 'Doorstep Service & Cash on Delivery',
    desc: 'Your professional arrives on time with all required tools. Inspect the completed work, and pay safely via Cash on Delivery or UPI after full satisfaction.',
    icon: IndianRupee,
    iconBg: 'bg-purple-500',
    details: ['Zero advance payment required', '7-day post-service quality warranty', 'Rate and review your specialist directly'],
  },
];

const providerSteps = [
  {
    step: '01',
    title: 'Create Your Partner Profile',
    desc: 'Sign up in under 3 minutes with your name, phone number, trade specialties, experience level, and service areas.',
    icon: Briefcase,
    iconBg: 'bg-accent',
    details: ['Free signup with zero registration charges', 'Select multiple trades and sub-skills', 'Upload your profile photo and business bio'],
  },
  {
    step: '02',
    title: 'Complete Quick Verification',
    desc: 'Our onboarding team reviews your identification and experience credentials to grant you the trusted ServiConnect Verified Badge.',
    icon: ShieldCheck,
    iconBg: 'bg-emerald-500',
    details: ['Official ID and background verification', 'Fast-track approval within 24-48 hours', 'Higher visibility on the marketplace'],
  },
  {
    step: '03',
    title: 'Set Your Rates & Schedule',
    desc: 'You are your own boss. Define your service menu, pricing, working hours, and days of availability directly from your provider dashboard.',
    icon: Clock,
    iconBg: 'bg-blue-500',
    details: ['Flexible working hours and days', 'Set your own starting and fixed prices', 'Update availability anytime in one tap'],
  },
  {
    step: '04',
    title: 'Receive Bookings & Grow Income',
    desc: 'Get notified instantly when customers book your services. Accept requests, chat directly with clients, and collect payments directly.',
    icon: Sparkles,
    iconBg: 'bg-amber-500',
    details: ['Direct customer bookings with zero middlemen', 'Built-in real-time customer messaging', 'Direct Cash on Delivery or UPI payments'],
  },
];

const trustFeatures = [
  {
    icon: ShieldCheck,
    title: 'Rigorous Background Checks',
    desc: 'Every service professional undergoes multi-step verification including government ID checks and trade credential review.',
  },
  {
    icon: IndianRupee,
    title: 'Zero Risk Cash on Delivery',
    desc: 'You never pay in advance. Only pay after the job is completed, inspected, and you are 100% satisfied.',
  },
  {
    icon: Award,
    title: '7-Day Service Assurance',
    desc: 'In the rare case something goes wrong, our dedicated support team will ensure a free re-visit or immediate resolution.',
  },
  {
    icon: Star,
    title: 'Verified Genuine Reviews',
    desc: 'Only customers who booked and completed a service can submit ratings, keeping all marketplace reviews 100% honest.',
  },
];

const faqs = [
  {
    q: 'How does payment work?',
    a: 'ServiConnect supports Cash on Delivery (COD) as well as direct UPI/digital payment to the professional upon completion. You never have to pay anything upfront before the service is done.',
  },
  {
    q: 'Can I reschedule or cancel a booking?',
    a: 'Yes! You can easily reschedule or cancel an appointment directly from your customer dashboard under "My Bookings" with no cancellation penalties before the professional arrives.',
  },
  {
    q: 'How are professionals verified on ServiConnect?',
    a: 'Every provider submits government ID documentation, trade experience details, and contact verification. Only approved providers with verified badges appear in search results.',
  },
  {
    q: 'What if I am unhappy with the service?',
    a: 'Our 7-Day Service Assurance policy protects you. If any issue arises from a completed service, contact our support team and we will arrange a complimentary inspection or rework.',
  },
  {
    q: 'How do service providers receive booking requests?',
    a: 'Providers receive instant sound notifications and dashboard alerts for new requests. They can review customer requirements, inspect the location, and accept bookings with one click.',
  },
];

const HowItWorksPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('customer'); // 'customer' | 'provider'
  const [openFaq, setOpenFaq] = useState(0);

  const currentSteps = activeTab === 'customer' ? customerSteps : providerSteps;

  return (
    <PublicLayout>
      {/* Header Banner */}
      <div className="bg-gradient-to-b from-[#FFF5F2] via-white to-white border-b border-border-color pt-12 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-bold mb-4 shadow-xs">
            <Zap className="h-4 w-4" />
            Simple, Transparent, Reliable
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-text-primary tracking-tight">
            How <span className="text-accent underline decoration-accent/30 underline-offset-8">ServiConnect</span> Works
          </h1>
          <p className="text-text-muted mt-4 text-lg max-w-2xl mx-auto leading-relaxed">
            Connecting homeowners with verified local service professionals in just a few clicks. Learn how our simple 4-step process works.
          </p>

          {/* Interactive Role Switcher Toggle */}
          <div className="inline-flex p-1.5 bg-bg-surface-2 border border-border-color rounded-2xl mt-8 shadow-inner">
            <button
              onClick={() => setActiveTab('customer')}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all ${
                activeTab === 'customer'
                  ? 'bg-white text-accent shadow-sm'
                  : 'text-text-muted hover:text-text-primary'
              }`}
            >
              <Smartphone className="h-4 w-4" />
              For Customers
            </button>
            <button
              onClick={() => setActiveTab('provider')}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all ${
                activeTab === 'provider'
                  ? 'bg-white text-accent shadow-sm'
                  : 'text-text-muted hover:text-text-primary'
              }`}
            >
              <Briefcase className="h-4 w-4" />
              For Service Partners
            </button>
          </div>
        </div>
      </div>

      {/* Step by Step Breakdown */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center max-w-xl mx-auto mb-14">
          <span className="section-badge mb-3">
            {activeTab === 'customer' ? 'Customer Journey' : 'Partner Workflow'}
          </span>
          <h2 className="text-3xl font-extrabold text-text-primary">
            {activeTab === 'customer' ? 'Book a Trusted Pro in 4 Simple Steps' : 'Start Earning with ServiConnect in 4 Steps'}
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {currentSteps.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-white border border-border-color rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-all hover:-translate-y-1.5 flex flex-col justify-between relative group"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className={`h-14 w-14 rounded-2xl ${item.iconBg} text-white flex items-center justify-center shadow-[0_6px_16px_rgba(0,0,0,0.12)] group-hover:scale-110 transition-transform`}>
                      <Icon className="h-7 w-7 text-white" />
                    </div>
                    <span className="text-3xl font-black text-border-color group-hover:text-accent/30 transition-colors">
                      {item.step}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-text-primary mb-2 leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-text-muted text-xs leading-relaxed mb-4">
                    {item.desc}
                  </p>
                </div>

                <div className="pt-4 border-t border-border-color/80 space-y-1.5">
                  {item.details.map((detail, dIdx) => (
                    <div key={dIdx} className="flex items-start gap-1.5 text-xs text-text-secondary">
                      <CheckCircle className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{detail}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA underneath the steps */}
        <div className="flex justify-center mt-12">
          {activeTab === 'customer' ? (
            <Button
              variant="primary"
              size="lg"
              onClick={() => navigate('/services')}
              className="shadow-[0_8px_24px_rgba(244,91,53,0.3)]"
            >
              Explore All Services <ArrowRight className="h-4 w-4 ml-1.5" />
            </Button>
          ) : (
            <Button
              variant="primary"
              size="lg"
              onClick={() => navigate('/register?role=provider')}
              className="shadow-[0_8px_24px_rgba(244,91,53,0.3)]"
            >
              Join as a Service Partner <ArrowRight className="h-4 w-4 ml-1.5" />
            </Button>
          )}
        </div>
      </div>

      {/* Trust & Safety Features */}
      <div className="bg-bg-surface py-16 border-y border-border-color">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="section-badge mb-3">Trust & Security</span>
            <h2 className="text-3xl font-extrabold text-text-primary">
              Built on Transparency and Trust
            </h2>
            <p className="text-text-muted text-sm mt-2">
              We hold every interaction on ServiConnect to the highest safety and quality standards.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {trustFeatures.map((feat, i) => {
              const Icon = feat.icon;
              return (
                <div key={i} className="bg-white border border-border-color rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-all">
                  <div className="h-12 w-12 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent mb-4">
                    <Icon className="h-6 w-6 text-accent" />
                  </div>
                  <h3 className="font-bold text-text-primary text-base mb-2">{feat.title}</h3>
                  <p className="text-text-muted text-xs leading-relaxed">{feat.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* FAQ Accordion */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-10">
          <span className="section-badge mb-3">Got Questions?</span>
          <h2 className="text-3xl font-extrabold text-text-primary">Frequently Asked Questions</h2>
          <p className="text-text-muted text-sm mt-1">Everything you need to know about booking and providing services.</p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div
                key={index}
                className="bg-white border border-border-color rounded-2xl overflow-hidden shadow-xs transition-all"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                  className="w-full flex items-center justify-between p-5 text-left transition-colors hover:bg-bg-surface-2"
                >
                  <span className="font-bold text-text-primary text-sm sm:text-base pr-4">
                    {faq.q}
                  </span>
                  <div className={`h-7 w-7 rounded-full flex items-center justify-center shrink-0 transition-transform ${isOpen ? 'rotate-180 bg-accent text-white' : 'bg-bg-surface text-text-muted'}`}>
                    <ChevronDown className="h-4 w-4" />
                  </div>
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-sm text-text-muted leading-relaxed border-t border-border-color/60 bg-bg-surface/50">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom CTA Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="bg-[#171717] rounded-3xl p-8 sm:p-12 text-white text-center relative overflow-hidden">
          <div className="relative z-10 max-w-2xl mx-auto">
            <h3 className="text-2xl sm:text-4xl font-black mb-4">
              Ready to Experience Better Home Services?
            </h3>
            <p className="text-white/70 text-sm sm:text-base mb-8">
              Book your first appointment in minutes or partner with India’s fastest-growing service marketplace.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button
                variant="primary"
                size="lg"
                onClick={() => navigate('/services')}
              >
                Explore All Services
              </Button>
              <Button
                variant="ghost"
                size="lg"
                className="text-white border border-white/20 hover:bg-white/10"
                onClick={() => navigate('/register?role=provider')}
              >
                Join as a Partner
              </Button>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
};

export default HowItWorksPage;
