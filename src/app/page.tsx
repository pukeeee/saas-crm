import { ScrollToTop } from "@/shared/components/ScrollToTop";

import HeroSection from "@/widgets/main-page/hero-section/HeroSection";
import WhyWeSection from "@/widgets/main-page/why-section/WhyWeSection";
import SolutionsSection from "@/widgets/main-page/solutions-section/SolutionsSection";
import CapabilitiesSection from "@/widgets/main-page/capabilities-section/CapabilitiesSection";
import SecuritySection from "@/widgets/main-page/security-section/SecuritySection";
import FinalSection from "@/widgets/main-page/final-cta-section/FinalSection";

/**
 * Головна сторінка (Landing Page)
 * Структурована за методологією FSD з покращеною версткою та анімаціями
 */
export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Основний контент */}
      <main className="flex-1">
        <HeroSection />
        <WhyWeSection />
        <SolutionsSection />
        <CapabilitiesSection />
        <SecuritySection />
        <FinalSection />
      </main>

      {/* Scroll to top button */}
      <ScrollToTop />
    </div>
  );
}
