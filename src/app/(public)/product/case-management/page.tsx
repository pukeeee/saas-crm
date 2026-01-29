"use client";

import Link from "next/link";
import { motion } from "motion/react";
import {
  Calendar,
  Clock,
  ArrowRight,
  CheckCircle2,
  Tag,
  Bell,
  CheckSquare,
  FileSearch,
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { FeatureCard, FeatureGrid } from "@/shared/components/FeatureCard";

const features = [
  {
    icon: Calendar,
    title: "Court date tracking",
    description:
      "Never miss a deadline. Automatic reminders for filing deadlines, court appearances, and statute limitations.",
  },
  {
    icon: CheckSquare,
    title: "Task management",
    description:
      "Break down matters into actionable tasks. Assign to team members with due dates and priorities.",
  },
  {
    icon: Bell,
    title: "Smart notifications",
    description:
      "Get notified about what matters. Critical deadlines, client messages, and case updates.",
  },
  {
    icon: FileSearch,
    title: "Matter search",
    description:
      "Find any matter instantly. Search across case names, clients, notes, and document contents.",
  },
  {
    icon: Clock,
    title: "Timeline view",
    description:
      "See the complete history of any matter. Every action, document, and communication in context.",
  },
  {
    icon: Tag,
    title: "Custom fields",
    description:
      "Track the data that matters to your practice. Create custom fields for any practice area.",
  },
];

const useCases = [
  {
    title: "Personal Injury",
    description:
      "Track treatment dates, settlement negotiations, and statute of limitations with purpose-built workflows.",
  },
  {
    title: "Family Law",
    description:
      "Manage custody schedules, support calculations, and court filings with integrated calendaring.",
  },
  {
    title: "Corporate Law",
    description:
      "Handle deal flow, due diligence checklists, and closing conditions with collaborative workspaces.",
  },
];

const benefits = [
  "Reduce administrative time by 40%",
  "Zero missed deadlines guaranteed",
  "Complete audit trail for every matter",
  "Instant access to case history",
];

export default function ProductCaseManagement() {
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
              Case Management
            </Badge>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-6">
              Manage matters with confidence
            </h1>
            <p className="text-lg text-muted-foreground mb-6">
              From intake to resolution, track every aspect of your cases in one
              centralized system. Built for the way lawyers actually work.
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
            <p className="text-muted-foreground">Case Dashboard Screenshot</p>
          </motion.div>
        </div>
      </div>

      {/* Problem/Solution */}
      <div className="py-16 md:py-20">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-semibold tracking-tight text-foreground text-center md:text-left">
            The problem with generic tools
          </h2>
          <p className="mt-6 text-lg text-muted-foreground text-center md:text-left">
            Spreadsheets lose track of deadlines. Generic project management
            tools don`t understand legal workflows. Post-it notes don`t send
            reminders before statute of limitations expires.
          </p>
          <p className="mt-4 text-lg text-muted-foreground text-center md:text-left">
            Justio CRM`s case management is built for how lawyers actually
            work—with court dates, filing deadlines, and the complexity of real
            legal matters.
          </p>
        </div>
      </div>

      {/* Features */}
      <div className="bg-muted/30 py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-0">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground">
              Built for legal workflows
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              Every feature designed with practicing attorneys in mind.
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

      {/* Use Case 1 */}
      <div className="py-16 md:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-0">
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-16 items-center">
            <div className="aspect-4/3 rounded-xl border bg-linear-to-br from-muted to-muted/50 flex items-center justify-center">
              <p className="text-muted-foreground text-center">
                Workflow Diagram
              </p>
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-4">From chaos to clarity</h2>
              <p className="text-lg text-muted-foreground mb-6">
                See how a mid-size litigation firm transformed their operations
                with Justio CRM`s case management system.
              </p>
              <blockquote className="border-l-4 border-primary pl-6 italic text-muted-foreground mb-6">
                `We went from spreadsheets and sticky notes to a system where
                nothing falls through the cracks. The peace of mind is
                invaluable.`
              </blockquote>
              <p className="font-medium">
                — Sarah Chen, Managing Partner at Chen & Associates
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Use Cases 2 */}
      <div className="py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-0">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground">
              Works for every practice area
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
              Whether you`re handling personal injury, family law, or corporate
              transactions—Justio CRM adapts to your workflows.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {useCases.map((useCase) => (
              <div
                key={useCase.title}
                className="rounded-xl border border-border bg-card p-6"
              >
                <h3 className="text-lg font-semibold text-foreground">
                  {useCase.title}
                </h3>
                <p className="mt-2 text-sm sm:text-base text-muted-foreground">
                  {useCase.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-primary text-primary-foreground py-16 md:py-24 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-0">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Never miss another deadline
            </h2>
            <p className="mt-6 text-lg text-primary-foreground/80">
              See how Justio CRM can transform your case management workflow.
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
