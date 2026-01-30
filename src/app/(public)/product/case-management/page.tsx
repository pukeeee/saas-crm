import { caseManagementContent } from "@/content/main/product/case-management";
import { HeroSubpage } from "@/widgets/product/shared/hero-subpage/ui/HeroSubpage";
import { ProblemSolutionSubpage } from "@/widgets/product/shared/problem-solution-subpage/ui/ProblemSolutionSubpage";
import { FeaturesSubpage } from "@/widgets/product/shared/features-subpage/ui/FeaturesSubpage";
import { CaseManagementWorkflow } from "@/widgets/product/case-management/workflow/ui/CaseManagementWorkflow";
import { CaseManagementUseCases } from "@/widgets/product/case-management/use-cases/ui/CaseManagementUseCases";
import { CTAsection } from "@/widgets/cta-section/ui/CTAsection";

export default function ProductCaseManagement() {
  const { hero, problemSolution, features, workflow, useCases, cta } =
    caseManagementContent;

  return (
    <>
      <HeroSubpage content={hero} />
      <ProblemSolutionSubpage content={problemSolution} />
      <FeaturesSubpage content={features} />
      <CaseManagementWorkflow content={workflow} />
      <CaseManagementUseCases content={useCases} />
      <CTAsection content={cta} />
    </>
  );
}
