"use client";

import { motion } from "motion/react";
import { Mail, MessageSquare, Phone } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";
import { Label } from "@/shared/components/ui/label";
import { Badge } from "@/shared/components/ui/badge";

const contactMethods = [
  {
    icon: Mail,
    title: "Email",
    description: "Send us an email anytime",
    value: "hello@legalcrm.com",
  },
  {
    icon: MessageSquare,
    title: "Live chat",
    description: "Available Mon-Fri, 9am-6pm ET",
    value: "Start a conversation",
  },
  {
    icon: Phone,
    title: "Phone",
    description: "For sales inquiries",
    value: "+1 (555) 123-4567",
  },
];

export default function Contact() {
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
              Contact
            </Badge>
            <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Get in touch
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
              Have questions about Justio CRM? Want to schedule a demo? We`d
              love to hear from you.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Contact Methods */}
      <div className="py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="grid gap-6 md:grid-cols-3">
              {contactMethods.map((method, index) => (
                <motion.div
                  key={method.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="rounded-xl border border-border bg-card p-6 text-center"
                >
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-accent mx-auto">
                    <method.icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-semibold text-foreground">
                    {method.title}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {method.description}
                  </p>
                  <p className="mt-2 text-sm font-medium text-accent">
                    {method.value}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Contact Form */}
      <div className="py-12 md:py-16">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl font-semibold tracking-tight text-foreground inline-block">
                Send us a message
              </h2>
              <p className="mt-3 text-lg text-muted-foreground max-w-2xl mx-auto">
                Fill out the form below and we`ll get back to you within 24
                hours.
              </p>
            </div>

            <form className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
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
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="john@lawfirm.com" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="company">Firm / Company</Label>
                <Input id="company" placeholder="Doe & Associates" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  placeholder="Tell us how we can help..."
                  rows={6}
                />
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full bg-accent hover:bg-accent/90"
              >
                Send message
              </Button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
