import { ScrollToTop } from "@/shared/components/ScrollToTop";
import HeroSection from "@/widgets/main/hero-section/HeroSection";
import WhyWeSection from "@/widgets/main/why-section/WhyWeSection";
import SolutionsSection from "@/widgets/main/solutions-section/SolutionsSection";
import ProductsSection from "@/widgets/main/products-section/ProductsSection";
import SecuritySection from "@/widgets/main/security-section/SecuritySection";
import FinalSection from "@/widgets/main/final-cta-section/FinalSection";
import { mainPageContent } from "@/content/main";

/**
 * Головна сторінка (Landing Page)
 * Структурована за методологією FSD з покращеною версткою та анімаціями
 */
export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Основний контент */}
      <main className="flex-1">
        <HeroSection content={mainPageContent.hero} />
        <WhyWeSection content={mainPageContent.whyWe} />
        <SolutionsSection content={mainPageContent.solutions} />
        <ProductsSection content={mainPageContent.products} />
        <SecuritySection content={mainPageContent.security} />
        <FinalSection content={mainPageContent.finalCta} />
      </main>

      {/* Scroll to top button */}
      <ScrollToTop />
    </div>
  );
}
