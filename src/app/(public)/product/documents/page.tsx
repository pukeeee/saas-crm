import { documentsContent } from "@/content/main/product/documents";
import { HeroSubpage } from "@/widgets/product/shared/hero-subpage/ui/HeroSubpage";
import { ProblemSolutionSubpage } from "@/widgets/product/shared/problem-solution-subpage/ui/ProblemSolutionSubpage";
import { FeaturesSubpage } from "@/widgets/product/shared/features-subpage/ui/FeaturesSubpage";
import { CTAsection } from "@/widgets/cta-section/ui/CTAsection";

export default function ProductDocuments() {
  const { hero, problemSolution, features, cta } = documentsContent;

  return (
    <>
      <HeroSubpage content={hero} />
      <ProblemSolutionSubpage content={problemSolution} />
      <FeaturesSubpage content={features} />
      <CTAsection content={cta} />
    </>
  );
}
