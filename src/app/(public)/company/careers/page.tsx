"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight, MapPin } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";

const openings = [
  {
    title: "Senior Frontend Engineer",
    team: "Engineering",
    location: "Remote (US)",
    type: "Full-time",
  },
  {
    title: "Senior Backend Engineer",
    team: "Engineering",
    location: "Remote (US)",
    type: "Full-time",
  },
  {
    title: "Product Designer",
    team: "Design",
    location: "Remote (US)",
    type: "Full-time",
  },
  {
    title: "Customer Success Manager",
    team: "Customer Success",
    location: "Remote (US)",
    type: "Full-time",
  },
  {
    title: "Account Executive",
    team: "Sales",
    location: "Remote (US)",
    type: "Full-time",
  },
];

const benefits = [
  "Competitive salary and equity",
  "Unlimited PTO",
  "Remote-first culture",
  "Health, dental, and vision insurance",
  "401(k) with matching",
  "Home office stipend",
  "Learning and development budget",
  "Quarterly team offsites",
];

export default function Careers() {
  return (
    <div>
      {/* Hero */}
      <div className="bg-linear-to-b from-muted/50 to-background -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 rounded-none">
        <div className="max-w-4xl mx-auto py-20 md:py-28">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <Badge variant="outline" className="mb-6">
              Careers
            </Badge>
            <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Help us transform
              <br />
              legal technology
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
              We`re building the practice management platform that legal
              professionals have been waiting for. Join us.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Why Join */}
      <div className="py-12 md:py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-semibold tracking-tight text-foreground text-center mb-12">
              Why join Justio CRM
            </h2>
            <div className="space-y-6 text-lg text-muted-foreground">
              <p>
                We`re a small, focused team building software that genuinely
                helps people do important work. Legal professionals protect
                rights, resolve disputes, and help families and businesses
                navigate complex situations. Better tools mean they can help
                more people.
              </p>
              <p>
                We work remotely, communicate thoughtfully, and respect each
                other`s time. We believe great work comes from trust and
                autonomy, not micromanagement and endless meetings.
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Benefits */}
      <div className="bg-muted/30 py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl font-semibold tracking-tight text-foreground inline-block">
                Benefits
              </h2>
              <p className="mt-3 text-lg text-muted-foreground max-w-2xl mx-auto">
                We take care of our team so they can do their best work.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={benefit}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="rounded-lg border border-border bg-card p-4 text-center"
                >
                  <span className="text-sm text-foreground">{benefit}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Open Positions */}
      <div className="py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl font-semibold tracking-tight text-foreground inline-block">
                Open positions
              </h2>
              <p className="mt-3 text-lg text-muted-foreground max-w-2xl mx-auto">
                We`re always looking for talented people.
              </p>
            </div>

            <div className="max-w-3xl mx-auto space-y-4">
              {openings.map((job, index) => (
                <motion.div
                  key={job.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group rounded-xl border border-border bg-card p-6 card-hover cursor-pointer"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-semibold text-foreground group-hover:text-accent transition-colors">
                        {job.title}
                      </h3>
                      <div className="mt-2 flex flex-wrap gap-3 text-sm text-muted-foreground">
                        <span>{job.team}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {job.location}
                        </span>
                        <span>•</span>
                        <span>{job.type}</span>
                      </div>
                    </div>
                    <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-accent transition-colors" />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-primary text-primary-foreground py-16 md:py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Don`t see a perfect fit?
            </h2>
            <p className="mt-6 text-lg text-primary-foreground/80 max-w-2xl mx-auto">
              We`re always interested in hearing from talented people. Send us a
              note and tell us about yourself.
            </p>
            <Button size="lg" variant="secondary" className="mt-10" asChild>
              <Link href="/company/contact">
                Get in touch
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
