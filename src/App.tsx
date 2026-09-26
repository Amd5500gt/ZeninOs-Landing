import React, { useState } from 'react';
import { Navbar } from './components/Navbar.tsx';
import { HeroSection } from './components/HeroSection.tsx';
import { WhyZeninSection } from './components/WhyZeninSection.tsx';
import { FeatureShowcaseSection } from './components/FeatureShowcaseSection.tsx';
import { InteractivePhoneShowcase } from './components/InteractivePhoneShowcase.tsx';
import { AiPlannerSection } from './components/AiPlannerSection.tsx';
import { DisciplineHabitsSection } from './components/DisciplineHabitsSection.tsx';
import { ProductPillarsSection } from './components/ProductPillarsSection.tsx';
import { PricingSection } from './components/PricingSection.tsx';
import { FaqSection } from './components/FaqSection.tsx';
import { DownloadSection } from './components/DownloadSection.tsx';
import { Footer } from './components/Footer.tsx';
import { LegalModals } from './components/LegalModals.tsx';
import { DownloadToast } from './components/DownloadToast.tsx';

export default function App() {
  const [activeModal, setActiveModal] = useState<'privacy' | 'terms' | 'refund' | 'about' | 'arch' | null>(null);
  const [downloadToastVisible, setDownloadToastVisible] = useState(false);

  const handleDownloadTrigger = () => {
    setDownloadToastVisible(true);
    // Auto-dismiss after 6 seconds
    setTimeout(() => {
      setDownloadToastVisible(false);
    }, 6000);
  };

  return (
    <div className="min-h-screen bg-[#07090C] text-[#F1F5F9] font-sans antialiased selection:bg-[#00E5A3]/25 selection:text-[#00E5A3] overflow-x-hidden">
      {/* 1. Modern Floating Glassmorphic Navbar */}
      <Navbar onDownloadClick={handleDownloadTrigger} />

      {/* Main Page Flow */}
      <main>
        {/* 2. Hero Section with 3D perspective & phone mockup */}
        <HeroSection onDownloadClick={handleDownloadTrigger} />

        {/* 3. "Why Zenin OS?" - System Philosophy (Plan, Focus, Build) */}
        <WhyZeninSection />

        {/* 4. Interactive Phone Showcase with Switchable Screens */}
        <InteractivePhoneShowcase />

        {/* 5. 7 Feature Showcase */}
        <FeatureShowcaseSection />

        {/* 6. AI Day Planner Section */}
        <AiPlannerSection />

        {/* 7. Discipline & Habits Compounding Section */}
        <DisciplineHabitsSection />

        {/* 8. Engineering & Architecture Pillars */}
        <ProductPillarsSection />

        {/* 9. Simple & Honest Pricing (Free vs ₹79 Pro) */}
        <PricingSection onDownloadClick={handleDownloadTrigger} />

        {/* 10. Frequently Asked Questions Accordion */}
        <FaqSection />

        {/* 11. Dedicated Download Section */}
        <DownloadSection onDownloadClick={handleDownloadTrigger} />
      </main>

      {/* 12. Premium Footer with Legal & Architecture Modals */}
      <Footer
        onOpenModal={(type) => setActiveModal(type)}
        onDownloadClick={handleDownloadTrigger}
      />

      {/* Dialog Modals: Privacy, Terms, Refund, About, Developer Architecture */}
      <LegalModals
        activeModal={activeModal}
        onClose={() => setActiveModal(null)}
      />

      {/* Download Feedback Toast */}
      <DownloadToast
        visible={downloadToastVisible}
        onClose={() => setDownloadToastVisible(false)}
      />
    </div>
  );
}
