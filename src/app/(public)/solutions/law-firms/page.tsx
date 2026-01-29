"use client";

import Link from "next/link";
import { motion } from "motion/react";
import {
  Building2,
  Users,
  BarChart3,
  GitBranch,
  Shield,
  ArrowRight,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { FeatureCard, FeatureGrid } from "@/shared/components/FeatureCard";
import { Badge } from "@/shared/components/ui/badge";

const challenges = [
  "Partners can't see what associates are working on",
  "Matters fall through the cracks when people are out",
  "No visibility into firm-wide performance",
  "Inconsistent client communication",
  "Time tracking compliance issues",
  "Knowledge silos between practice groups",
];

const features = [
  {
    icon: Users,
    title: "Team workspaces",
    description:
      "Collaborate on matters in real-time. Everyone sees the same information, always up to date.",
  },
  {
    icon: BarChart3,
    title: "Firm analytics",
    description:
      "Understand your firm's performance. Utilization, realization, and matter profitability at a glance.",
  },
  {
    icon: GitBranch,
    title: "Workflow automation",
    description:
      "Standardize processes across practice groups. Reduce errors and ensure consistency.",
  },
  {
    icon: Shield,
    title: "Granular permissions",
    description:
      "Control access at every level. Partners, associates, and staff see exactly what they need.",
  },
];

export default function LawFirms() {
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
              <Building2 className="h-3 w-3 mr-1" />
              Law Firms
            </Badge>
            <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Scale your firm
              <br />
              without the chaos
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
              Growing a law firm is hard. Managing a team across matters is
              harder. Justio CRM gives you visibility and control without adding
              complexity.
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

      {/* Challenges */}
      <div className="py-16 md:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground">
              Growing pains we solve
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
              Every firm hits these walls. Justio CRM helps you break through.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 px-4 sm:px-0">
            {challenges.map((challenge) => (
              <div
                key={challenge}
                className="flex items-center gap-3 rounded-lg border border-border bg-card p-4"
              >
                <CheckCircle className="h-5 w-5 text-accent shrink-0" />
                <span className="text-sm text-foreground">{challenge}</span>
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
              Built for growing firms
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
              Tools that scale with your team and keep everyone aligned.
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

      {/* CTA */}
      <div className="bg-primary text-primary-foreground py-16 md:py-24 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto px-4 sm:px-0">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Ready to unify your firm?
          </h2>
          <p className="mt-6 text-lg text-primary-foreground/80">
            See how Justio CRM can bring your team together.
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
