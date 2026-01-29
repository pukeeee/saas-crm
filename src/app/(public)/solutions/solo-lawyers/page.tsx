"use client";

import Link from "next/link";
import { motion } from "motion/react";
import {
  Briefcase,
  Clock,
  CreditCard,
  Smartphone,
  Calendar,
  ArrowRight,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { FeatureCard, FeatureGrid } from "@/shared/components/FeatureCard";
import { Badge } from "@/shared/components/ui/badge";

const painPoints = [
  "Tracking billable hours across multiple clients",
  "Managing your own calendar and deadlines",
  "Getting paid on time",
  "Looking professional to clients",
  "Finding documents when you need them",
  "Staying organized without staff support",
];

const features = [
  {
    icon: Calendar,
    title: "All-in-one dashboard",
    description:
      "See your day at a glance. Cases, deadlines, tasks, and client messages in one view.",
  },
  {
    icon: Clock,
    title: "Effortless time tracking",
    description:
      "Track time as you work. Timer runs in the background while you focus on clients.",
  },
  {
    icon: CreditCard,
    title: "Get paid faster",
    description:
      "Professional invoices and online payments. Clients pay with one click.",
  },
  {
    icon: Smartphone,
    title: "Work from anywhere",
    description:
      "Full functionality on your phone. Access case files from court or client meetings.",
  },
];

export default function SoloLawyers() {
  return (
    <div>
      {/* Hero */}
      <div className="bg-linear-to-b from-muted/50 to-background -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto py-20 md:py-28 px-4 sm:px-0">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <Badge variant="outline" className="mb-6">
              <Briefcase className="h-3 w-3 mr-1" />
              Solo Lawyers
            </Badge>
            <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Run your practice
              <br />
              like a pro
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
              You didn`t go to law school to become an IT administrator. Justio
              CRM gives you everything you need to run a modern practice—without
              the complexity.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-accent hover:bg-accent/90"
                asChild
              >
                <Link href="/demo">
                  Request demo
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/pricing">View pricing</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Pain Points */}
      <div className="py-16 md:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground">
              We understand solo practice
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
              Running a practice alone means wearing every hat. LegalCRM takes
              some of that weight off your shoulders.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 px-4 sm:px-0">
            {painPoints.map((point) => (
              <div
                key={point}
                className="flex items-center gap-3 rounded-lg border border-border bg-card p-4"
              >
                <CheckCircle className="h-5 w-5 text-accent shrink-0" />
                <span className="text-sm text-foreground">{point}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="bg-muted/30 py-20 md:py-28">
        <div className="max-w-6xl mx-auto px-4 sm:px-0">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground">
              Built for the way you work
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
              Simple, powerful tools that let you focus on practicing law.
            </p>
          </div>

          <FeatureGrid columns={4}>
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

      {/* Pricing Teaser */}
      <div className="py-16 md:py-20">
        <div className="text-center max-w-3xl mx-auto px-4 sm:px-0">
          <Badge variant="outline" className="mb-6">
            Solo Plan
          </Badge>
          <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            One price, everything included
          </h2>
          <p className="mt-6 text-lg text-muted-foreground">
            No per-user fees. No hidden costs. Just one straightforward price
            that includes every feature you need to run your practice.
          </p>
          <Button size="lg" variant="outline" className="mt-10" asChild>
            <Link href="/pricing">
              See pricing
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-primary text-primary-foreground py-16 md:py-24 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto px-4 sm:px-0">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Ready to simplify your practice?
          </h2>
          <p className="mt-6 text-lg text-primary-foreground/80">
            See how Justio CRM can give you back hours every week.
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
  );
}
