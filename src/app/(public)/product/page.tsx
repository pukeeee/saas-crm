"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { FeatureCard, FeatureGrid } from "@/shared/components/FeatureCard";
import { ProductMockup } from "@/shared/components/ProductMockup";
import { Badge } from "@/shared/components/ui/badge";
import { features } from "./features";
import { philosophyPoints } from "./philosophy-points";

export default function Product() {
  return (
    <>
      {/* Hero */}
      <section className="py-16 sm:py-24 bg-linear-to-b from-muted/50 to-background -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-0">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Badge variant="outline" className="mb-6">
                Product
              </Badge>
              <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                One platform for your
                <br />
                entire practice
              </h1>
              <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
                Justio CRM brings together everything you need to run a modern
                law practice. Purpose-built for legal workflows, not adapted
                from generic tools.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Philosophy */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-0">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <h2 className="text-3xl font-semibold tracking-tight text-foreground mb-4">
              Built with intention
            </h2>
            <p className="text-lg text-muted-foreground">
              We didn`t build another CRM and slap `legal` on it. Every decision
              we make starts with how lawyers actually work.
            </p>
          </div>

          <FeatureGrid columns={3}>
            {philosophyPoints.map((point) => (
              <FeatureCard
                key={point.title}
                icon={point.icon}
                title={point.title}
                description={point.description}
                variant="filled"
              />
            ))}
          </FeatureGrid>
        </div>
      </section>

      {/* Architecture Overview */}
      <section className="py-16 sm:py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-0">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <div>
              <Badge variant="outline" className="mb-6">
                Architecture
              </Badge>
              <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                Designed for the way legal teams work
              </h2>
              <p className="mt-6 text-lg text-muted-foreground">
                At the center of Justio CRM is the matter—the atomic unit of
                legal work. Everything else—clients, documents, time entries,
                communications—connects to matters.
              </p>
              <p className="mt-4 text-muted-foreground">
                This matter-centric architecture means you can always find what
                you need, understand the full picture of any case, and move
                between contexts without losing your place.
              </p>
              <Button className="mt-8" variant="outline" asChild>
                <Link href="/security">
                  Learn about our infrastructure
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            <ProductMockup />
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-0">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <h2 className="text-3xl font-semibold tracking-tight text-foreground mb-4">
              Core capabilities
            </h2>
            <p className="text-lg text-muted-foreground">
              Everything you need, thoughtfully integrated. Explore each area in
              depth.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <Link key={feature.href} href={feature.href} className="group">
                <div className="rounded-xl border border-border bg-card p-8 hover:border-primary hover:shadow-lg transition-all duration-300 h-full">
                  <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/30 text-primary">
                    <feature.icon className="h-6 w-6 " />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                    {feature.title}
                  </h3>
                  <p className="mt-3 text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                  <div className="mt-6 flex items-center text-sm font-medium text-accent group-hover:text-primary">
                    Learn more
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Product Screenshot */}
      <section className="py-16 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-semibold tracking-tight text-foreground mb-4">
              See it in action
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A clean, intuitive interface that puts the information you need
              front and center.
            </p>
          </div>
          <div className="aspect-video max-w-5xl mx-auto rounded-xl border bg-linear-to-br from-muted to-muted/50 shadow-xl flex items-center justify-center">
            <p className="text-muted-foreground">Product Screenshot</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              See Justio CRM in action
            </h2>
            <p className="mt-6 text-lg text-primary-foreground/80">
              Get a personalized demo tailored to your practice area and firm
              size.
            </p>
            <Button size="lg" variant="secondary" className="mt-10" asChild>
              <Link href="/demo">
                Request demo
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
