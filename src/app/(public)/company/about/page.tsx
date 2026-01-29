"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";

const values = [
  {
    title: "Lawyers first",
    description:
      "Every decision starts with understanding how legal professionals actually work. We build for them, not at them.",
  },
  {
    title: "Simplicity wins",
    description:
      "The best software is invisible. We obsess over removing complexity, not adding features.",
  },
  {
    title: "Trust is earned",
    description:
      "Handling sensitive data is a privilege. We treat security and privacy as non-negotiable foundations.",
  },
  {
    title: "Quality matters",
    description:
      "We'd rather do fewer things exceptionally well than many things adequately.",
  },
];

const team = [
  {
    name: "Sarah Chen",
    role: "CEO & Co-founder",
    bio: "Former litigation partner. 15 years practicing law.",
  },
  {
    name: "Michael Torres",
    role: "CTO & Co-founder",
    bio: "Built enterprise software at Scale and Stripe.",
  },
  {
    name: "Emily Williams",
    role: "VP Product",
    bio: "Product leader from Notion and Figma.",
  },
  {
    name: "David Park",
    role: "VP Engineering",
    bio: "Engineering leader from Linear and Vercel.",
  },
];

export default function About() {
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
              About
            </Badge>
            <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              We`re building the practice
              <br />
              management lawyers deserve
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
              Justio CRM was founded by a lawyer who was tired of software that
              wasn`t built for the way legal professionals actually work.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Story */}
      <div className="py-12 md:py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-semibold tracking-tight text-foreground text-center mb-12">
              Our story
            </h2>
            <div className="space-y-6 text-lg text-muted-foreground">
              <p>
                After 15 years as a litigation partner at a mid-size firm, our
                CEO Sarah Chen had tried every practice management tool on the
                market. None of them worked the way lawyers actually work.
              </p>
              <p>
                Generic CRMs didn`t understand matters, deadlines, or billing.
                Legal-specific tools felt like they were designed in the 1990s.
                Everything required too many clicks, too much training, and too
                much ongoing maintenance.
              </p>
              <p>
                So she left practice to build something better. Together with
                co-founder Michael Torres, who had built enterprise software at
                some of the best companies in tech, they set out to create the
                practice management platform they wished existed.
              </p>
              <p>
                Today, Justio CRM is used by thousands of legal
                professionals—from solo practitioners to enterprise legal
                departments. We`re just getting started.
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Values */}
      <div className="bg-muted/30 py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-semibold tracking-tight text-foreground text-center mb-12">
              What we believe
            </h2>
            <div className="grid gap-8 md:grid-cols-2">
              {values.map((value, index) => (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <h3 className="text-xl font-semibold text-foreground mb-3">
                    {value.title}
                  </h3>
                  <p className="text-muted-foreground">{value.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Team */}
      <div className="py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-semibold tracking-tight text-foreground text-center mb-12">
              Leadership team
            </h2>
            <div className="grid gap-8 md:grid-cols-2">
              {team.map((person, index) => (
                <motion.div
                  key={person.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex gap-4"
                >
                  <div className="h-16 w-16 rounded-full bg-muted shrink-0 flex items-center justify-center">
                    <span className="text-xs font-medium text-muted-foreground">
                      {person.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground text-lg">
                      {person.name}
                    </h3>
                    <p className="text-sm text-accent font-medium">
                      {person.role}
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {person.bio}
                    </p>
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
              Want to join us?
            </h2>
            <p className="mt-6 text-lg text-primary-foreground/80 max-w-2xl mx-auto">
              We`re always looking for talented people who want to transform
              legal technology.
            </p>
            <Button size="lg" variant="secondary" className="mt-10" asChild>
              <Link href="/company/careers">
                View open positions
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
