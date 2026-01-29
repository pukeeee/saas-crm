"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Bell,
  Shield,
  CheckCircle2,
  MessageSquare,
  FileUp,
  PenLine,
  Eye,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { FeatureGrid, FeatureCard } from "@/shared/components/FeatureCard";

const features = [
  {
    icon: MessageSquare,
    title: "Secure messaging",
    description:
      "Encrypted communication that replaces scattered emails. Full conversation history tied to matters.",
  },
  {
    icon: FileUp,
    title: "Document sharing",
    description:
      "Clients can upload documents directly to their matters. No more email attachments to organize.",
  },
  {
    icon: PenLine,
    title: "E-signatures",
    description:
      "Collect legally binding signatures on engagement letters, settlements, and any document.",
  },
  {
    icon: Eye,
    title: "Matter visibility",
    description:
      "Give clients real-time visibility into case progress. Reduce status update calls.",
  },
  {
    icon: Bell,
    title: "Automated updates",
    description:
      "Keep clients informed automatically. Configurable notifications for case milestones.",
  },
  {
    icon: Shield,
    title: "Controlled access",
    description:
      "Clients only see what you choose to share. Granular permissions at every level.",
  },
];

const benefits = [
  "360° view of every client",
  "Instant access to communication history",
  "Automated conflict checking",
  "Streamlined intake process",
];

export default function ProductClients() {
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
              Client Management
            </Badge>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-6">
              Know your clients completely
            </h1>
            <p className="text-lg text-muted-foreground mb-6">
              Build stronger client relationships with a complete view of every
              interaction, document, and matter in one centralized profile.
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
            <p className="text-muted-foreground">Client Profile Screenshot</p>
          </motion.div>
        </div>
      </div>

      {/* Problem/Solution */}
      <div className="py-16 md:py-20">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-semibold tracking-tight text-foreground text-center md:text-left">
            Clients deserve better than email
          </h2>
          <p className="mt-6 text-lg text-muted-foreground text-center md:text-left">
            Your clients are anxious about their cases. They send emails asking
            for updates. You spend hours responding to questions that could
            answer themselves.
          </p>
          <p className="mt-4 text-lg text-muted-foreground text-center md:text-left">
            The client portal gives them visibility into their matters, a secure
            way to communicate, and the confidence that their case is
            progressing.
          </p>
        </div>
      </div>

      {/* Features */}
      <div className="bg-muted/30 py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-0">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground">
              Everything clients need
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              A professional, branded experience that makes working with you
              easy.
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

      {/* Benefits */}
      <div className="py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-0">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-foreground">
              Benefits for your practice
            </h2>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-foreground">
                  Fewer interruptions
                </h3>
                <p className="mt-2 text-muted-foreground">
                  Clients can check case status themselves. You respond when
                  it`s convenient, not when the phone rings.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">
                  Better documentation
                </h3>
                <p className="mt-2 text-muted-foreground">
                  Every client communication is logged and searchable. No more
                  digging through email threads.
                </p>
              </div>
            </div>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-foreground">
                  Professional experience
                </h3>
                <p className="mt-2 text-muted-foreground">
                  A branded portal that shows clients you`re running a modern,
                  professional practice.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">
                  Happier clients
                </h3>
                <p className="mt-2 text-muted-foreground">
                  Informed clients are satisfied clients. Reduce anxiety with
                  transparency.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-primary text-primary-foreground py-16 md:py-24 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-0">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Transform your client relationships
            </h2>
            <p className="mt-6 text-lg text-primary-foreground/80">
              See how the client portal can reduce calls and improve
              satisfaction.
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
