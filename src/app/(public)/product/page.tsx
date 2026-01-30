import { productContent } from "@/content/main/product";
import { ProductHero } from "@/widgets/product/page/hero-section/ui/ProductHero";
import { ProductPhilosophy } from "@/widgets/product/page/philosophy-section/ui/ProductPhilosophy";
import { ProductArchitecture } from "@/widgets/product/shared/architecture-section/ui/ProductArchitecture";
import { ProductFeatures } from "@/widgets/product/page/features-section/ui/ProductFeatures";
import { ProductScreenshot } from "@/widgets/product/page/screenshot-section/ui/ProductScreenshot";
import { CTAsection } from "@/widgets/cta-section/ui/CTAsection";

export default function Product() {
  const { hero, philosophy, architecture, capabilities, screenshot, cta } =
    productContent;

  return (
    <>
      <ProductHero content={hero} />
      <ProductPhilosophy content={philosophy} />
      <ProductArchitecture content={architecture} />
      <ProductFeatures content={capabilities} />
      <ProductScreenshot content={screenshot} />
      <CTAsection content={cta} />
    </>
  );
}
