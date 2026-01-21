import { LandingHeader } from "@/widgets/landing/header/ui/LandingHeader";
import { LandingHero } from "@/widgets/landing/hero/ui/LandingHero";
import { PainPointsSection } from "@/widgets/landing/pain-points/ui/PainPointsSection";
import { SolutionSection } from "@/widgets/landing/solution/ui/SolutionSection";
import { FeaturesSection } from "@/widgets/landing/features/ui/FeaturesSection";
import { DifferentiatorsSection } from "@/widgets/landing/differentiators/ui/DifferentiatorsSection";
import { PricingSection } from "@/widgets/landing/pricing/ui/PricingSection";
import { FaqSection } from "@/widgets/landing/faq/ui/FaqSection";
import { FinalCtaSection } from "@/widgets/landing/cta/ui/FinalCtaSection";
import { LandingFooter } from "@/widgets/landing/footer/ui/LandingFooter";
import { ScrollToTop } from "@/shared/components/ScrollToTop";
import { Suspense } from "react";

/**
 * Головна сторінка (Landing Page)
 * Структурована за методологією FSD з покращеною версткою та анімаціями
 */
export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header с навигацией - SSR с Suspense */}
      <Suspense fallback={<HeaderSkeleton />}>
        <LandingHeader />
      </Suspense>

      {/* Основний контент */}
      <main className="flex-1">
        {/* Hero секція з головним value-proposition */}
        <LandingHero />

        {/* Проблеми цільової аудиторії */}
        <PainPointsSection />

        {/* Як працює система (3 кроки) */}
        <SolutionSection />

        {/* Детальний функціонал */}
        <FeaturesSection />

        {/* Чому саме ми (диференціатори) */}
        <DifferentiatorsSection />

        {/* Тарифні плани */}
        <PricingSection />

        {/* Часті запитання */}
        <FaqSection />

        {/* Фінальний CTA */}
        <FinalCtaSection />
      </main>

      {/* Footer */}
      <LandingFooter />

      {/* Scroll to top button */}
      <ScrollToTop />
    </div>
  );
}

/**
 * Skeleton для Header во время загрузки
 */
function HeaderSkeleton() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur-md">
      <div className="container">
        <div className="flex h-16 items-center justify-between">
          {/* Logo skeleton */}
          <div className="h-6 w-32 bg-muted animate-pulse rounded" />

          {/* Nav skeleton */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="h-4 w-20 bg-muted animate-pulse rounded" />
            <div className="h-4 w-20 bg-muted animate-pulse rounded" />
            <div className="h-4 w-20 bg-muted animate-pulse rounded" />
          </div>

          {/* Auth skeleton */}
          <div className="h-8 w-20 bg-muted animate-pulse rounded" />
        </div>
      </div>
    </header>
  );
}
