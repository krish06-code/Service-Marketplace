import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    q: 'How are professionals verified?',
    a: 'Every professional on ServiConnect goes through a multi-step verification process: government ID check, address verification, skill assessment, and reference checks. Only those who pass all stages receive the Verified badge.',
  },
  {
    q: 'How does payment work?',
    a: 'We currently support Cash on Delivery (COD). You pay the professional directly after the service is completed. No advance payment is required to book.',
  },
  {
    q: 'Can I cancel a booking?',
    a: 'Yes. You can cancel a booking as long as its status is Pending or Accepted. Once a provider marks the job as In Progress, cancellation is no longer available. Simply go to My Bookings and click Cancel.',
  },
  {
    q: "What happens if a professional doesn't arrive?",
    a: "If your professional does not show up at the scheduled time, please contact our support team immediately. We will reschedule at no extra cost or arrange an alternative professional for you.",
  },
  {
    q: 'How do I become a service provider?',
    a: "Click 'Become a Provider' on the homepage and register with the Provider role. Complete your profile, set your availability, add your services, and submit for verification. Our team typically reviews applications within 24 hours.",
  },
  {
    q: 'Is my personal data safe?',
    a: 'Absolutely. Your data is encrypted in transit and at rest. We never share your personal details with third parties. You can delete your account and all associated data at any time.',
  },
];

const FAQItem = ({ q, a }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border-color rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-bg-surface-2 transition-colors"
      >
        <span className="font-medium text-text-primary pr-4">{q}</span>
        <ChevronDown className={`h-5 w-5 text-text-muted shrink-0 transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
      </button>
      <div className={`overflow-hidden transition-all duration-300 ${open ? 'max-h-96' : 'max-h-0'}`}>
        <p className="px-6 pb-5 text-text-muted text-sm leading-relaxed border-t border-border-color pt-4">{a}</p>
      </div>
    </div>
  );
};

const FAQSection = () => (
  <section className="py-24 bg-bg-primary" id="faq">
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-14">
        <span className="inline-block px-3 py-1 rounded-full border border-border-color bg-bg-surface-2 text-xs font-semibold text-accent mb-4 tracking-widest">FAQ</span>
        <h2 className="text-3xl sm:text-4xl font-bold text-text-primary mb-4">Frequently Asked Questions</h2>
        <p className="text-text-muted">Everything you need to know about ServiConnect.</p>
      </div>
      <div className="flex flex-col gap-3">
        {faqs.map((faq, i) => <FAQItem key={i} {...faq} />)}
      </div>
    </div>
  </section>
);

export default FAQSection;
