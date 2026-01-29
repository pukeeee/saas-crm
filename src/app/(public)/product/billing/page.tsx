"use client";

import Link from "next/link";
import { motion } from "motion/react";
import {
  Clock,
  FileText,
  DollarSign,
  TrendingUp,
  ArrowRight,
  Wallet,
  Receipt,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { FeatureCard, FeatureGrid } from "@/shared/components/FeatureCard";
import { Badge } from "@/shared/components/ui/badge";

const features = [
  {
    icon: Clock,
    title: "Automatic time tracking",
    description:
      "Capture time spent on emails, documents, and calls automatically. Stop losing billable hours.",
  },
  {
    icon: Receipt,
    title: "Professional invoices",
    description:
      "Generate detailed, professional invoices with your branding. Send directly to clients.",
  },
  {
    icon: Wallet,
    title: "Trust accounting",
    description:
      "IOLTA-compliant trust accounting built in. Automatic reconciliation and reporting.",
  },
  {
    icon: TrendingUp,
    title: "Financial reporting",
    description:
      "Real-time visibility into firm finances. Track collections, utilization, and profitability.",
  },
  {
    icon: DollarSign,
    title: "Online payments",
    description:
      "Accept credit card and ACH payments. Clients pay faster when it's easy.",
  },
  {
    icon: FileText,
    title: "Expense tracking",
    description:
      "Track and bill costs to matters. Attach receipts and pass through to clients.",
  },
];

const benefits = [
  "Capture 100% of billable time automatically",
  "Generate professional invoices in seconds",
  "IOLTA-compliant trust accounting",
  "Real-time financial reporting and insights",
];

export default function ProductBilling() {
  return (
    <div className="px-4 sm:px-6 lg:px-8">
      {/* Hero */}
      <div className="py-12 md:py-20">
        <div className="max-w-7xl mx-auto grid gap-8 lg:grid-cols-2 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Badge variant="secondary" className="mb-4">
              Billing & Invoicing
            </Badge>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-6">
              Bill more, collect faster
            </h1>
            <p className="text-lg text-muted-foreground mb-6">
              From time entry to payment collection, streamline your entire
              billing workflow with tools designed for legal practices.
            </p>
            <ul className="space-y-3 mb-8">
              {benefits.map((benefit) => (
                <li key={benefit} className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-success shrink-0" />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" asChild>
                <Link href="/demo">Request demo</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/product">View all features</Link>
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="aspect-4/3 rounded-xl border bg-linear-to-br from-muted to-muted/50 flex items-center justify-center"
          >
            <p className="text-muted-foreground">
              Billing Dashboard Screenshot
            </p>
          </motion.div>
        </div>
      </div>

      {/* Problem/Solution */}
      <div className="py-16 md:py-20">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-semibold tracking-tight text-foreground text-center md:text-left">
            Stop leaving money on the table
          </h2>
          <p className="mt-6 text-lg text-muted-foreground text-center md:text-left">
            Lawyers lose an average of 10% of their billable time to poor
            tracking. That`s weeks of work every year—gone.
          </p>
          <p className="mt-4 text-lg text-muted-foreground text-center md:text-left">
            Justio CRM`s billing captures time automatically, generates
            professional invoices in seconds, and makes it easy for clients to
            pay.
          </p>
        </div>
      </div>

      {/* Features */}
      <div className="bg-muted/30 py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-0">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground">
              Complete billing solution
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              Everything you need to capture time, bill clients, and manage firm
              finances.
            </p>
          </div>

          <FeatureGrid columns={3}>
            {features.map((feature) => (
              <FeatureCard
                key={feature.title}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                variant="bordered"
              />
            ))}
          </FeatureGrid>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-primary text-primary-foreground py-16 md:py-24 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-0">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Capture every billable minute
            </h2>
            <p className="mt-6 text-lg text-primary-foreground/80">
              See how much revenue you`re leaving on the table.
            </p>
            <Button size="lg" variant="secondary" className="mt-10" asChild>
              <Link href="/demo">
                Request demo
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
