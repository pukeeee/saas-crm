import { LANDING_CONTENT } from "@/shared/lib/config/landing";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/shared/components/ui/card";

export function FeaturesSection() {
  const { title, subtitle, list } = LANDING_CONTENT.features;

  return (
    <section id="features" className="w-full py-16 md:py-24 bg-muted/50">
      <div className="container">
        <div className="mx-auto max-w-6xl space-y-12">
          {/* Заголовки */}
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold">{title}</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {subtitle}
            </p>
          </div>

          {/* Сітка можливостей */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {list.map((feature) => (
              <Card key={feature.title}>
                <CardHeader className="space-y-3">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
