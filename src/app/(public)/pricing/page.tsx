"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { Check, ArrowRight, X } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { cn } from "@/shared/lib/utils";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/shared/components/ui/toggle-group";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { plans } from "./plans";
import { featureComparison } from "./features-comparison";
import { faqs } from "./faq";

function FeatureValue({ value }: { value: boolean | string }) {
  if (value === true) {
    return <Check className="h-5 w-5 text-accent mx-auto" />;
  }
  if (value === false) {
    return <X className="h-5 w-5 text-muted-foreground/40 mx-auto" />;
  }
  return <span className="text-sm text-foreground">{value}</span>;
}

export default function Pricing() {
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">(
    "monthly",
  );

  return (
    <>
      {/* Hero */}
      <section className="py-16 sm:py-24 bg-linear-to-b from-muted/50 to-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Badge variant="outline" className="mb-6">
                Pricing
              </Badge>
              <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                Simple, transparent pricing
              </h1>
              <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
                No hidden fees. No surprise charges. Just straightforward
                pricing that scales with your practice.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="pb-16 sm:pb-20">
        {/* Billing Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="pb-10 flex items-center justify-center gap-4">
            <ToggleGroup
              type="single"
              value={billingPeriod}
              onValueChange={(value) =>
                value && setBillingPeriod(value as "monthly" | "yearly")
              }
              className="bg-muted p-1 rounded-lg"
            >
              <ToggleGroupItem
                value="monthly"
                className="px-6 py-2 rounded-md data-[state=on]:bg-background data-[state=on]:shadow-sm"
              >
                Monthly
              </ToggleGroupItem>
              <ToggleGroupItem
                value="yearly"
                className="px-6 py-2 rounded-md data-[state=on]:bg-background data-[state=on]:shadow-sm"
              >
                Yearly
                <Badge
                  variant="ghost"
                  className="ml-2 text-destructive text-xs"
                >
                  Save 20%
                </Badge>
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
        </motion.div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 lg:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={cn(
                  "relative rounded-2xl border bg-card p-6 lg:p-8 flex flex-col",
                  plan.popular
                    ? "border-accent shadow-lg lg:scale-105 z-10"
                    : "border-border",
                )}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <Badge className="bg-accent text-accent-foreground">
                      Most popular
                    </Badge>
                  </div>
                )}

                <div className="text-center">
                  <h3 className="text-xl font-semibold text-foreground">
                    {plan.name}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {plan.description}
                  </p>
                  <div className="mt-6">
                    <span className="text-4xl font-bold text-foreground">
                      {billingPeriod === "monthly"
                        ? plan.monthlyPrice
                        : plan.yearlyPrice}
                    </span>
                    <span className="text-muted-foreground">{plan.period}</span>
                    {billingPeriod === "yearly" &&
                      plan.monthlyPrice !== "$0" &&
                      plan.monthlyPrice !== "Custom" && (
                        <p className="text-xs text-muted-foreground mt-1">
                          billed annually
                        </p>
                      )}
                  </div>
                </div>

                <ul className="mt-8 space-y-4 grow">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3">
                      <Check className="h-5 w-5 text-accent shrink-0" />
                      <span className="text-sm text-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  className={cn(
                    "w-full mt-8",
                    plan.popular && "bg-accent hover:bg-accent/90",
                  )}
                  variant={plan.popular ? "default" : "outline"}
                  asChild
                >
                  <Link href={plan.href}>
                    {plan.cta}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Comparison Table */}
      <section className="pb-16 sm:pb-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <h2 className="text-3xl font-semibold tracking-tight text-foreground mb-4">
              Compare plans in detail
            </h2>
            <p className="text-lg text-muted-foreground">
              See exactly what`s included in each plan to find the right fit for
              your practice.
            </p>
          </div>

          {/* Responsive Table - Same design for all devices with horizontal scroll on mobile */}
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border">
                  <TableHead className="text-foreground font-semibold min-w-50">
                    Features
                  </TableHead>
                  <TableHead className="text-center text-foreground font-semibold min-w-30">
                    Free
                  </TableHead>
                  <TableHead className="text-center text-foreground font-semibold min-w-30">
                    Solo
                  </TableHead>
                  <TableHead className="text-center text-foreground font-semibold bg-accent/5 min-w-30">
                    Firm
                  </TableHead>
                  <TableHead className="text-center text-foreground font-semibold min-w-30">
                    Enterprise
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {featureComparison.flatMap((category) => [
                  <TableRow
                    key={`category-${category.category}`}
                    className="bg-muted/50 border-border"
                  >
                    <TableCell
                      colSpan={5}
                      className="font-semibold text-foreground py-3"
                    >
                      {category.category}
                    </TableCell>
                  </TableRow>,
                  ...category.features.map((feature) => (
                    <TableRow
                      key={`feature-${category.category}-${feature.name}`}
                      className="border-border"
                    >
                      <TableCell className="text-muted-foreground min-w-30">
                        {feature.name}
                      </TableCell>
                      <TableCell className="text-center min-w-30">
                        <FeatureValue value={feature.free} />
                      </TableCell>
                      <TableCell className="text-center min-w-30">
                        <FeatureValue value={feature.solo} />
                      </TableCell>
                      <TableCell className="text-center bg-accent/5 min-w-30">
                        <FeatureValue value={feature.firm} />
                      </TableCell>
                      <TableCell className="text-center min-w-30">
                        <FeatureValue value={feature.enterprise} />
                      </TableCell>
                    </TableRow>
                  )),
                ])}
              </TableBody>
            </Table>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="pb-16 sm:pb-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <h2 className="text-3xl font-semibold tracking-tight text-foreground mb-4">
              Frequently asked questions
            </h2>
            <p className="text-lg text-muted-foreground">
              Everything you need to know about our pricing and plans.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 max-w-4xl mx-auto">
            {faqs.map((faq) => (
              <div key={faq.question}>
                <h3 className="text-lg font-semibold text-foreground">
                  {faq.question}
                </h3>
                <p className="mt-2 text-muted-foreground">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Still have questions?
            </h2>
            <p className="mt-6 text-lg text-primary-foreground/80">
              Our team is happy to walk you through our plans and help you find
              the right fit.
            </p>
            <Button size="lg" variant="secondary" className="mt-10" asChild>
              <Link href="/demo">
                Talk to sales
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
