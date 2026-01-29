"use client";

import Link from "next/link";
import { motion } from "motion/react";
import {
  History,
  Search,
  Lock,
  ArrowRight,
  CheckCircle2,
  Folder,
  FileCheck,
  Sparkles,
} from "lucide-react";
import { FeatureGrid, FeatureCard } from "@/shared/components/FeatureCard";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";

const features = [
  {
    icon: Folder,
    title: "Matter-based organization",
    description:
      "Documents automatically organized by matter. No more hunting through folder hierarchies.",
  },
  {
    icon: Search,
    title: "Full-text search",
    description:
      "Search across all document contents, not just filenames. Find that clause in seconds.",
  },
  {
    icon: History,
    title: "Version control",
    description:
      "Track every revision. Compare versions side-by-side. Never lose work to overwritten files.",
  },
  {
    icon: Lock,
    title: "Access control",
    description:
      "Control who sees what at the document level. Audit trail for every access and edit.",
  },
  {
    icon: FileCheck,
    title: "Document automation",
    description:
      "Generate documents from templates with matter data. Reduce drafting time by 80%.",
  },
  {
    icon: Sparkles,
    title: "AI-powered review",
    description:
      "Extract key terms, identify risks, and summarize documents with built-in AI assistance.",
  },
];

const benefits = [
  "Enterprise-grade security for sensitive documents",
  "Full-text search across all document contents",
  "Automatic version control with audit trail",
  "Matter-based organization system",
];

export default function ProductDocuments() {
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
              Document Management
            </Badge>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-6">
              Documents, organized and secure
            </h1>
            <p className="text-lg text-muted-foreground mb-6">
              Store, organize, and collaborate on documents with
              enterprise-grade security and powerful search capabilities.
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
              Document Explorer Screenshot
            </p>
          </motion.div>
        </div>
      </div>

      {/* Problem/Solution */}
      <div className="py-16 md:py-20">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-semibold tracking-tight text-foreground text-center md:text-left">
            Lost documents cost cases
          </h2>
          <p className="mt-6 text-lg text-muted-foreground text-center md:text-left">
            Files scattered across desktops, shared drives, and email
            attachments. Three different `final` versions of the same contract.
            No one knows which is current.
          </p>
          <p className="mt-4 text-lg text-muted-foreground text-center md:text-left">
            Justio CRM gives you a single source of truth for every document,
            with version control that actually works and search that finds what
            you need.
          </p>
        </div>
      </div>

      {/* Features */}
      <div className="bg-muted/30 py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-0">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground">
              Document management that works
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              Purpose-built for legal documents with the features litigators and
              transactional lawyers actually need.
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
              Take control of your documents
            </h2>
            <p className="mt-6 text-lg text-primary-foreground/80">
              See how Justio CRM can organize your practice`s documents.
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
