import { teamContent } from "@/content/main/product/team";
import { HeroSubpage } from "@/widgets/product/shared/hero-subpage/ui/HeroSubpage";
import { ProblemSolutionSubpage } from "@/widgets/product/shared/problem-solution-subpage/ui/ProblemSolutionSubpage";
import { FeaturesSubpage } from "@/widgets/product/shared/features-subpage/ui/FeaturesSubpage";
import { CTAsection } from "@/widgets/cta-section/ui/CTAsection";

export default function ProductTeam() {
  const { hero, problemSolution, features, cta } = teamContent;

  return (
    <>
      <HeroSubpage content={hero} />
      <ProblemSolutionSubpage content={problemSolution} />
      <FeaturesSubpage content={features} />
      <CTAsection content={cta} />
    </>
  );
}
