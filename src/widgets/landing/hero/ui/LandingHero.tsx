import Link from "next/link";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { LANDING_CONTENT } from "@/shared/lib/config/landing";
import { Check } from "lucide-react";

export function LandingHero() {
  const { title, subtitle, primaryCta, secondaryCta, badges } =
    LANDING_CONTENT.hero;

  return (
    <section id="hero" className="w-full py-16 sm:py-24 md:py-32">
      <div className="container space-y-6">
        <div className="mx-auto max-w-4xl text-center space-y-4">
          {/* Заголовок */}
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold tracking-tight">
            {title}
          </h1>

          {/* Підзаголовок */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            {subtitle}
          </p>

          {/* CTA кнопки */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button size="lg" asChild>
              <Link href={primaryCta.href}>{primaryCta.label}</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href={secondaryCta.href}>{secondaryCta.label}</Link>
            </Button>
          </div>

          {/* Trust Badges */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-6">
            {badges.map((badge) => (
              <Badge
                key={badge}
                variant="secondary"
                className="flex items-center gap-1 py-1 px-2.5"
              >
                <Check className="h-3.5 w-3.5" />
                {badge}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
