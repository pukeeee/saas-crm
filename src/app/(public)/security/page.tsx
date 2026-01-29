"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Shield,
  Lock,
  Eye,
  Server,
  FileCheck,
  ArrowRight,
  CheckCircle,
  Key,
  UserCheck,
  History,
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { FeatureCard, FeatureGrid } from "@/shared/components/FeatureCard";
import { Badge } from "@/shared/components/ui/badge";

const securityFeatures = [
  {
    icon: Lock,
    title: "End-to-end encryption",
    description:
      "All data encrypted at rest (AES-256) and in transit (TLS 1.3). Your clients' information is protected at every layer.",
  },
  {
    icon: Key,
    title: "Access control",
    description:
      "Role-based permissions, SSO/SAML integration, and MFA. Control exactly who can see and do what.",
  },
  {
    icon: History,
    title: "Audit logging",
    description:
      "Complete audit trail of every action. Know who accessed what, when, for compliance and accountability.",
  },
  {
    icon: UserCheck,
    title: "Authentication",
    description:
      "Enterprise SSO, multi-factor authentication, and session management. Secure access from any device.",
  },
  {
    icon: Eye,
    title: "Data privacy",
    description:
      "GDPR and CCPA compliant. Data residency options. You control your data, always.",
  },
  {
    icon: Server,
    title: "Infrastructure",
    description:
      "SOC 2 Type II certified data centers. 99.9% uptime SLA. Enterprise-grade reliability.",
  },
];

const certifications = [
  { name: "SOC 2 Type II", description: "Annually audited security controls" },
  { name: "GDPR", description: "EU data protection compliance" },
  { name: "CCPA", description: "California privacy compliance" },
  { name: "HIPAA", description: "Healthcare data protection ready" },
];

const practices = [
  "Penetration testing conducted quarterly by third-party security firms",
  "Security awareness training for all employees",
  "Incident response plan tested and updated annually",
  "Vulnerability scanning and patching within 24-48 hours",
  "Background checks for all employees with data access",
  "Secure software development lifecycle (SSDLC)",
];

export default function Security() {
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
                <Shield className="h-3 w-3 mr-1" />
                Security
              </Badge>
              <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                Security built for
                <br />
                attorney-client privilege
              </h1>
              <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
                Your clients trust you with their most sensitive information. We
                take that responsibility seriously with enterprise-grade
                security at every layer.
              </p>
              <div className="mt-10">
                <Button size="lg" variant="outline" asChild>
                  <Link href="/demo">
                    Request security review
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trust Statement */}
      <section className="py-16 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-semibold tracking-tight text-foreground">
              Your trust is our foundation
            </h2>
            <p className="mt-6 text-lg text-muted-foreground">
              We built LegalCRM with security as a core requirement, not an
              afterthought. Every feature, every line of code, every operational
              process is designed with the protection of your data in mind.
            </p>
          </div>
        </div>
      </section>

      {/* Security Features */}
      <section className="py-16 sm:py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <h2 className="text-3xl font-semibold tracking-tight text-foreground mb-4">
              How we protect your data
            </h2>
            <p className="text-lg text-muted-foreground">
              Comprehensive security controls at every layer of the platform.
            </p>
          </div>

          <FeatureGrid columns={3}>
            {securityFeatures.map((feature) => (
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
      </section>

      {/* Certifications */}
      <section className="py-16 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <h2 className="text-3xl font-semibold tracking-tight text-foreground mb-4">
              Compliance & certifications
            </h2>
            <p className="text-lg text-muted-foreground">
              Third-party validated security you can trust.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {certifications.map((cert) => (
              <div
                key={cert.name}
                className="rounded-xl border border-border bg-card p-6 text-center"
              >
                <FileCheck className="h-8 w-8 text-accent mx-auto mb-4" />
                <h3 className="font-semibold text-foreground">{cert.name}</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {cert.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Security Practices */}
      <section className="py-16 sm:py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-16 max-w-3xl mx-auto">
            <h2 className="text-3xl font-semibold tracking-tight text-foreground mb-4">
              Security practices
            </h2>
            <p className="text-lg text-muted-foreground">
              Our ongoing commitment to protecting your data.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {practices.map((practice) => (
              <div
                key={practice}
                className="flex items-center gap-3 rounded-lg border border-border bg-card p-4"
              >
                <CheckCircle className="h-5 w-5 text-accent shrink-0" />
                <span className="text-sm text-foreground">{practice}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Infrastructure */}
      <section className="py-16 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <div>
              <Badge variant="outline" className="mb-6">
                Infrastructure
              </Badge>
              <h2 className="text-3xl font-semibold tracking-tight text-foreground">
                Enterprise-grade infrastructure
              </h2>
              <p className="mt-6 text-lg text-muted-foreground">
                LegalCRM runs on world-class cloud infrastructure with multiple
                layers of redundancy and security controls.
              </p>
              <ul className="mt-8 space-y-4">
                {[
                  "Hosted in SOC 2 Type II certified data centers",
                  "Geographic redundancy across multiple regions",
                  "Real-time replication and automated backups",
                  "DDoS protection and WAF",
                  "99.9% uptime SLA for enterprise customers",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-3 text-muted-foreground"
                  >
                    <CheckCircle className="h-5 w-5 text-accent shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl border border-border bg-muted/50 p-8">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Uptime (30 days)
                  </span>
                  <span className="font-semibold text-foreground">99.98%</span>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div className="h-full w-[99.98%] rounded-full bg-accent" />
                </div>
                <div className="flex items-center justify-between pt-4">
                  <span className="text-sm text-muted-foreground">
                    Security incidents
                  </span>
                  <span className="font-semibold text-foreground">0</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Data breaches
                  </span>
                  <span className="font-semibold text-foreground">0</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Need more details?
            </h2>
            <p className="mt-6 text-lg text-primary-foreground/80">
              Request our security documentation or schedule a call with our
              security team.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" asChild>
                <Link href="/demo">
                  Request security review
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
