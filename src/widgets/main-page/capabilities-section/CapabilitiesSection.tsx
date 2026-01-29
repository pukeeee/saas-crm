import CapabilityCard from "./CapabilityCard";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function CapabilitiesSection() {
  return (
    <section className="py-16 sm:py-20 bg-popover">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header section */}
        <div className="text-center mb-12 sm:mb-16 max-w-3xl mx-auto">
          <span className="inline-block px-4 py-1.5 text-xs sm:text-sm font-medium bg-primary/10 text-primary rounded-full mb-4">
            Product
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
            Everything you need, nothing you don`t
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground">
            A focused set of tools designed for how legal professionals actually
            work.
          </p>
        </div>

        <div className="grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
          <CapabilityCard
            title="Case Management"
            description="Track every matter from intake to resolution. Deadlines, tasks, and court dates in one view."
            href="/product/case-management"
          />
          <CapabilityCard
            title="Client Portal"
            description="Secure communication with clients. Share documents, collect signatures, and keep everyone informed."
            href="/product/clients"
          />
          <CapabilityCard
            title="Document Management"
            description="Store, organize, and version control all your legal documents. Full-text search across everything."
            href="/product/documents"
          />
          <CapabilityCard
            title="Billing & Invoicing"
            description="Time tracking, trust accounting, and professional invoices. Get paid faster."
            href="/product/billing"
          />
          <CapabilityCard
            title="Team Collaboration"
            description="Assign tasks, share matters, and keep your entire team aligned on every case."
            href="/product/team"
          />
          <Link
            href="/product"
            className="flex items-center justify-center rounded-xl border border-dashed border-border p-6 sm:p-8 text-primary font-medium hover:underline hover:bg-primary/5 transition-colors"
          >
            <span className="flex items-center gap-2">
              Explore all features
              <ArrowRight className="h-4 w-4" />
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
