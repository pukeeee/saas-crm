"use client";

import { Scale, Shield, Clock, FileText } from "lucide-react";
import {
  FeatureCard,
  FeatureGrid,
} from "../../../shared/components/FeatureCard";

export default function WhyWeSection() {
  return (
    <section className="py-16 sm:py-20 lg:py-30 bg-popover">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header section */}
        <div className="text-center mb-12 sm:mb-16 max-w-3xl mx-auto">
          <span className="inline-block px-4 py-1.5 text-xs sm:text-sm font-medium bg-primary/10 text-primary rounded-full mb-4">
            Why Justio CRM
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
            Built different, for a reason
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground">
            Generic CRMs weren`t designed for the complexity of legal work. We
            built something that actually understands how you practice.
          </p>
        </div>

        {/* Feature cards grid */}
        <FeatureGrid columns={4}>
          <FeatureCard
            icon={Scale}
            title="Legal-first design"
            description="Every feature built specifically for case workflows, court deadlines, and legal document management."
            variant="bordered"
          />
          <FeatureCard
            icon={Shield}
            title="Client confidentiality"
            description="Attorney-client privilege protection built into every layer. SOC 2 Type II certified."
            variant="bordered"
          />
          <FeatureCard
            icon={Clock}
            title="Time that tracks itself"
            description="Automatic time capture across emails, calls, and document work. Never miss a billable minute."
            variant="bordered"
          />
          <FeatureCard
            icon={FileText}
            title="Smart documents"
            description="Auto-generate legal documents with matter data. Version control built for litigation teams."
            variant="bordered"
          />
        </FeatureGrid>
      </div>
    </section>
  );
}
