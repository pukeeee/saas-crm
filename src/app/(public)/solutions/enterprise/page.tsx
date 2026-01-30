import { enterpriseContent } from "@/content/main/solutions/enterprise";
import { HeroSolutions } from "@/widgets/solutions/shared/hero-solutions/ui/HeroSolutions";
import { PainPoints } from "@/widgets/solutions/shared/pain-points/ui/PainPoints";
import { FeaturesSolutions } from "@/widgets/solutions/shared/features-solutions/ui/FeaturesSolutions";
import { ComplianceSection } from "@/widgets/solutions/enterprise/compliance-section/ui/ComplianceSection";
import { CTAsection } from "@/widgets/cta-section/ui/CTAsection";

export default function Enterprise() {
  const { hero, requirements, features, compliance, cta } = enterpriseContent;

  return (
    <>
      <HeroSolutions content={hero} />
      <PainPoints content={requirements} />
      <FeaturesSolutions content={features} />
      <ComplianceSection content={compliance} />
      <CTAsection content={cta} />
    </>
  );
}
