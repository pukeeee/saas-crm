import { LANDING_CONTENT } from "@/shared/lib/config/landing";
import { PricingCard } from "./PricingCard";

export function PricingSection() {
  const { title, subtitle, plans } = LANDING_CONTENT.pricing;

  return (
    <section id="pricing" className="w-full py-16 md:py-24 bg-muted/50">
      <div className="container">
        <div className="mx-auto max-w-6xl space-y-12">
          {/* Заголовки */}
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold">{title}</h2>
            <p className="text-lg text-muted-foreground">{subtitle}</p>
          </div>

          {/* Сітка тарифів */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {plans.map((plan) => (
              <PricingCard key={plan.id} {...plan} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
