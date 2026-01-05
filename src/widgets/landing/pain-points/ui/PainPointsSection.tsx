import { LANDING_CONTENT } from "@/shared/lib/config/landing";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/shared/components/ui/card";

export function PainPointsSection() {
  const { title, points } = LANDING_CONTENT.painPoints;

  return (
    <section id="pain-points" className="w-full py-16 md:py-24 bg-muted/50">
      <div className="container">
        <div className="mx-auto max-w-5xl space-y-12">
          {/* Заголовок секції */}
          <h2 className="text-3xl md:text-4xl font-bold text-center">
            {title}
          </h2>

          {/* Сітка проблем */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {points.map((point) => (
              <Card key={point.title} className="border-2">
                <CardHeader className="space-y-3">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <point.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{point.title}</CardTitle>
                  <CardDescription>{point.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
