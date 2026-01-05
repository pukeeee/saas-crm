import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Check } from "lucide-react";
import { cn } from "@/shared/lib/utils/utils";

type PricingCardProps = {
  name: string;
  price: string;
  period: string;
  description: string;
  features: readonly string[];
  cta: string;
  href: string;
  highlighted: boolean;
};

export function PricingCard({
  name,
  price,
  period,
  description,
  features,
  cta,
  href,
  highlighted,
}: PricingCardProps) {
  return (
    <Card
      className={cn(
        "relative flex flex-col",
        highlighted && "border-primary shadow-lg",
      )}
    >
      {highlighted && (
        <Badge className="absolute top-3 left-1/2 -translate-x-1/2">
          Популярний
        </Badge>
      )}

      <CardHeader>
        <CardTitle className="text-2xl">{name}</CardTitle>
        <CardDescription>{description}</CardDescription>
        <div className="pt-4">
          <span className="text-4xl font-bold">{price}</span>
          {period && <span className="text-muted-foreground"> ₴/{period}</span>}
        </div>
      </CardHeader>

      <CardContent className="flex-1 space-y-3">
        {features.map((feature) => (
          <div key={feature} className="flex items-start gap-2">
            <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            <span className="text-sm">{feature}</span>
          </div>
        ))}
      </CardContent>

      <CardFooter>
        <Button
          className="w-full"
          variant={highlighted ? "default" : "outline"}
          asChild
        >
          <Link href={href}>{cta}</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
