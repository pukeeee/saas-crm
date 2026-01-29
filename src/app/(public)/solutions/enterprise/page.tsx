"use client";

import Link from "next/link";
import { motion } from "motion/react";
import {
  Building,
  Shield,
  Plug,
  HeadphonesIcon,
  Server,
  ArrowRight,
  CheckCircle,
  Lock,
  FileCheck,
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { FeatureCard, FeatureGrid } from "@/shared/components/FeatureCard";
import { Badge } from "@/shared/components/ui/badge";

const requirements = [
  "SOC 2 Type II certification",
  "SSO/SAML integration",
  "Custom data retention policies",
  "Audit logging and compliance reporting",
  "API access for custom integrations",
  "Dedicated infrastructure options",
];

const features = [
  {
    icon: Shield,
    title: "Enterprise security",
    description:
      "SSO, MFA, and advanced access controls. Your security team will approve.",
  },
  {
    icon: Plug,
    title: "Custom integrations",
    description:
      "Connect to your existing systems. Full API access and pre-built integrations.",
  },
  {
    icon: HeadphonesIcon,
    title: "Dedicated support",
    description:
      "Named success manager and priority support. We're an extension of your team.",
  },
  {
    icon: Server,
    title: "Flexible deployment",
    description:
      "Cloud, private cloud, or on-premise. We adapt to your infrastructure requirements.",
  },
];

const complianceItems = [
  {
    icon: Lock,
    title: "SOC 2 Type II",
    description: "Annual audit certification",
  },
  {
    icon: FileCheck,
    title: "GDPR Compliant",
    description: "EU data protection",
  },
  {
    icon: Shield,
    title: "HIPAA Ready",
    description: "Healthcare data protection",
  },
];

export default function Enterprise() {
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
              <Building className="h-3 w-3 mr-1" />
              Enterprise
            </Badge>
            <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Enterprise-grade legal
              <br />
              practice management
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
              The security, compliance, and customization that enterprise legal
              departments and AmLaw 100 firms require.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-accent hover:bg-accent/90"
                asChild
              >
                <Link href="/demo">
                  Contact sales
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/security">Security overview</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Requirements */}
      <div className="py-16 md:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground">
              Built for enterprise requirements
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
              We understand what it takes to pass procurement and security
              reviews.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 px-4 sm:px-0">
            {requirements.map((req) => (
              <div
                key={req}
                className="flex items-center gap-3 rounded-lg border border-border bg-card p-4"
              >
                <CheckCircle className="h-5 w-5 text-accent shrink-0" />
                <span className="text-sm text-foreground">{req}</span>
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
              Enterprise capabilities
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
              The features large organizations need, without the legacy software
              complexity.
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

      {/* Compliance */}
      <div className="py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-0">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground">
              Compliance you can count on
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
              Certifications and frameworks we support.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {complianceItems.map((item) => (
              <div
                key={item.title}
                className="flex items-center gap-4 rounded-xl border border-border bg-card p-6"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-accent">
                  <item.icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">
                    {item.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-primary text-primary-foreground py-16 md:py-24 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto px-4 sm:px-0">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Let`s discuss your requirements
          </h2>
          <p className="mt-6 text-lg text-primary-foreground/80">
            Our enterprise team will work with you to ensure Justio CRM meets
            your security and compliance needs.
          </p>
          <Button size="lg" variant="secondary" className="mt-10" asChild>
            <Link href="/demo">
              Contact sales
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
