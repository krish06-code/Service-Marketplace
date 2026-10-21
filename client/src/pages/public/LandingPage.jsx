import React from 'react';
import PublicLayout from '../../components/layout/PublicLayout';
import HeroSection from '../../components/landing/HeroSection';
import PopularServicesSection from '../../components/landing/PopularServicesSection';
import HowItWorksSection from '../../components/landing/HowItWorksSection';
import FeaturedProfessionalsSection from '../../components/landing/FeaturedProfessionalsSection';
import WhyChooseUsSection from '../../components/landing/WhyChooseUsSection';
import StatsSection from '../../components/landing/StatsSection';
import ProviderCTASection from '../../components/landing/ProviderCTASection';
import TestimonialsSection from '../../components/landing/TestimonialsSection';
import FAQSection from '../../components/landing/FAQSection';

const LandingPage = () => (
  <PublicLayout>
    <HeroSection />
    <StatsSection />
    <PopularServicesSection />
    <HowItWorksSection />
    <FeaturedProfessionalsSection />
    <WhyChooseUsSection />
    <ProviderCTASection />
    <TestimonialsSection />
    <FAQSection />
  </PublicLayout>
);

export default LandingPage;
