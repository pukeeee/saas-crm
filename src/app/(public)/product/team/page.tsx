"use client";

import Link from "next/link";
import { motion } from "motion/react";
import {
  CheckSquare,
  MessageSquare,
  Shield,
  BarChart3,
  ArrowRight,
  UserPlus,
  Eye,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { FeatureCard, FeatureGrid } from "@/shared/components/FeatureCard";
import { Badge } from "@/shared/components/ui/badge";

const features = [
  {
    icon: CheckSquare,
    title: "Task assignment",
    description:
      "Delegate tasks to team members with clear deadlines and priorities. Track progress in real-time.",
  },
  {
    icon: MessageSquare,
    title: "Internal messaging",
    description:
      "Collaborate on matters without leaving the platform. Threaded discussions tied to cases.",
  },
  {
    icon: Shield,
    title: "Role-based access",
    description:
      "Control what each team member can see and do. Partners, associates, and staff get appropriate access.",
  },
  {
    icon: BarChart3,
    title: "Workload visibility",
    description:
      "See how work is distributed across your team. Balance assignments and prevent burnout.",
  },
  {
    icon: UserPlus,
    title: "Matter sharing",
    description:
      "Bring team members onto matters with one click. Everyone has the context they need.",
  },
  {
    icon: Eye,
    title: "Activity feeds",
    description:
      "Stay informed about what's happening across your cases. Filter by matter, team member, or activity type.",
  },
];

const benefits = [
  "Improve team coordination and communication",
  "Assign tasks with clear deadlines and priorities",
  "Maintain security with role-based access controls",
  "Gain visibility into workload distribution",
];

export default function ProductTeam() {
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
              Team Collaboration
            </Badge>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-6">
              Work better together
            </h1>
            <p className="text-lg text-muted-foreground mb-6">
              Coordinate your team with shared calendars, task management, and
              internal communications—all within LexiCRM.
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
            <p className="text-muted-foreground">Team Dashboard Screenshot</p>
          </motion.div>
        </div>
      </div>

      {/* Problem/Solution */}
      <div className="py-16 md:py-20">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-semibold tracking-tight text-foreground text-center md:text-left">
            Collaboration without chaos
          </h2>
          <p className="mt-6 text-lg text-muted-foreground text-center md:text-left">
            Email threads that go nowhere. Tasks that fall through the cracks.
            Associates who don`t have the context they need to do great work.
          </p>
          <p className="mt-4 text-lg text-muted-foreground text-center md:text-left">
            Justio CRM gives everyone the visibility they need while keeping
            sensitive information protected with granular access controls.
          </p>
        </div>
      </div>

      {/* Features */}
      <div className="bg-muted/30 py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-0">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground">
              Team features
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              Everything your team needs to collaborate effectively on legal
              matters.
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
              Build a better-connected team
            </h2>
            <p className="mt-6 text-lg text-primary-foreground/80">
              See how Justio CRM can improve collaboration at your firm.
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
