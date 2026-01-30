import { soloLawyersContent } from "@/content/main/solutions/solo-lawers";
import { HeroSolutions } from "@/widgets/solutions/shared/hero-solutions/ui/HeroSolutions";
import { PainPoints } from "@/widgets/solutions/shared/pain-points/ui/PainPoints";
import { FeaturesSolutions } from "@/widgets/solutions/shared/features-solutions/ui/FeaturesSolutions";
import { PricingTeaser } from "@/widgets/solutions/solo-lawyers/pricing-teaser/ui/PricingTeaser";
import { CTAsection } from "@/widgets/cta-section/ui/CTAsection"; // Використовуємо CTAsection

export default function SoloLawyers() {
  const { hero, painPoints, features, pricingTeaser, cta } = soloLawyersContent;

  return (
    <>
      <HeroSolutions content={hero} />
      <PainPoints content={painPoints} />
      <FeaturesSolutions content={features} />
      <PricingTeaser content={pricingTeaser} />
      <CTAsection content={cta} />
    </>
  );
}
