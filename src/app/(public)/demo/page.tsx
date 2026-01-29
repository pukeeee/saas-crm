"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight, Calendar } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Badge } from "@/shared/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";

export default function Demo() {
  return (
    <div className="container py-12 md:py-8">
      <div className="grid gap-12 lg:grid-cols-2 items-center min-h-[calc(100vh-8rem)]">
        {/* Left - Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Badge variant="outline" className="mb-6">
            <Calendar className="h-3 w-3 mr-1" />
            Request Demo
          </Badge>
          <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            See LegalCRM
            <br />
            in action
          </h1>
          <p className="mt-6 text-lg text-muted-foreground">
            Get a personalized demo tailored to your practice area and firm
            size. Our team will show you exactly how Justio CRM can streamline
            your workflow.
          </p>

          <div className="mt-10 space-y-6">
            <div className="flex items-start gap-4">
              <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center text-accent font-semibold">
                1
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Book a time</h3>
                <p className="text-sm text-muted-foreground">
                  Choose a 30-minute slot that works for you
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center text-accent font-semibold">
                2
              </div>
              <div>
                <h3 className="font-semibold text-foreground">
                  See the product
                </h3>
                <p className="text-sm text-muted-foreground">
                  Personalized walkthrough of key features
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center text-accent font-semibold">
                3
              </div>
              <div>
                <h3 className="font-semibold text-foreground">
                  Start your trial
                </h3>
                <p className="text-sm text-muted-foreground">
                  14 days free, no credit card required
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right - Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="rounded-2xl border border-border bg-card p-8 shadow-lg">
            <h2 className="text-2xl font-semibold text-foreground mb-6">
              Request your demo
            </h2>

            <form className="space-y-5">
              <div className="grid gap-5 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First name</Label>
                  <Input id="firstName" placeholder="John" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last name</Label>
                  <Input id="lastName" placeholder="Doe" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Work email</Label>
                <Input id="email" type="email" placeholder="john@lawfirm.com" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="company">Firm / Company</Label>
                <Input id="company" placeholder="Doe & Associates" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="size">Firm size</Label>
                <Select name="size">
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select firm size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Solo practitioner</SelectItem>
                    <SelectItem value="2-10">2-10 attorneys</SelectItem>
                    <SelectItem value="11-50">11-50 attorneys</SelectItem>
                    <SelectItem value="51-200">51-200 attorneys</SelectItem>
                    <SelectItem value="200+">200+ attorneys</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full bg-accent hover:bg-accent/90"
              >
                Request demo
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>

              <p className="text-xs text-center text-muted-foreground">
                By submitting, you agree to our{" "}
                <Link href="/terms" className="underline hover:text-foreground">
                  Terms
                </Link>{" "}
                and{" "}
                <Link
                  href="/privacy"
                  className="underline hover:text-foreground"
                >
                  Privacy Policy
                </Link>
              </p>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
