import Link from "next/link";
import { Button } from "@/shared/components/ui/button";
import { LANDING_CONTENT } from "@/shared/lib/config/landing";

export function FinalCtaSection() {
  const { title, subtitle, cta } = LANDING_CONTENT.finalCta;

  return (
    <section id="cta" className="w-full py-16 md:py-24 bg-muted/50">
      <div className="container">
        <div className="mx-auto max-w-3xl text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold">{title}</h2>
          <p className="text-lg text-muted-foreground">{subtitle}</p>
          <Button size="lg" asChild>
            <Link href={cta.href}>{cta.label}</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
