import { lawFirmsContent } from "@/content/main/solutions/law-firms";
import { HeroSolutions } from "@/widgets/solutions/shared/hero-solutions/ui/HeroSolutions";
import { PainPoints } from "@/widgets/solutions/shared/pain-points/ui/PainPoints";
import { FeaturesSolutions } from "@/widgets/solutions/shared/features-solutions/ui/FeaturesSolutions";
import { CTAsection } from "@/widgets/cta-section/ui/CTAsection";

export default function LawFirms() {
  const { hero, painPoints, features, cta } = lawFirmsContent;

  return (
    <>
      <HeroSolutions content={hero} />
      <PainPoints content={painPoints} />
      <FeaturesSolutions content={features} />
      <CTAsection content={cta} />
    </>
  );
}
