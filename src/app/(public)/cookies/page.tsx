"use client";

import { motion } from "motion/react";
import { Badge } from "@/shared/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";

const cookieTypes = [
  {
    name: "Essential Cookies",
    purpose: "Required for basic site functionality",
    duration: "Session / 1 year",
    examples: "Authentication, security, preferences",
  },
  {
    name: "Analytics Cookies",
    purpose: "Help us understand how visitors use the site",
    duration: "Up to 2 years",
    examples: "Page views, traffic sources, user journeys",
  },
  {
    name: "Functional Cookies",
    purpose: "Enable enhanced features and personalization",
    duration: "Up to 1 year",
    examples: "Language preferences, saved settings",
  },
  {
    name: "Marketing Cookies",
    purpose: "Used to deliver relevant advertisements",
    duration: "Up to 2 years",
    examples: "Ad targeting, campaign measurement",
  },
];

const sections = [
  {
    title: "What Are Cookies?",
    content: `Cookies are small text files that are placed on your device when you visit a website. They are widely used to make websites work more efficiently and to provide information to website owners. Cookies help us remember your preferences, understand how you use our platform, and improve your experience.`,
  },
  {
    title: "How We Use Cookies",
    content: `We use cookies to:

• Keep you signed in to your account
• Remember your preferences and settings
• Understand how you navigate our platform
• Improve our services based on usage patterns
• Ensure the security of your account
• Measure the effectiveness of our communications`,
  },
  {
    title: "Managing Your Cookie Preferences",
    content: `You can control and manage cookies in several ways:

• Browser settings: Most browsers allow you to refuse or accept cookies
• Cookie preferences: Use our cookie consent banner to customize your preferences
• Third-party tools: Browser extensions can help manage cookies across websites

Note that disabling certain cookies may affect the functionality of our platform.`,
  },
  {
    title: "Third-Party Cookies",
    content: `Some cookies on our site are set by third-party services we use:

• Analytics providers (e.g., Google Analytics)
• Customer support tools
• Security and fraud prevention services

These third parties have their own privacy policies governing the use of cookies.`,
  },
  {
    title: "Updates to This Policy",
    content: `We may update this Cookie Policy from time to time to reflect changes in our practices or for operational, legal, or regulatory reasons. We encourage you to review this policy periodically.`,
  },
  {
    title: "Contact Us",
    content: `If you have questions about our use of cookies, please contact us at:

Email: privacy@legalcrm.com
Address: 123 Legal Street, Suite 400, San Francisco, CA 94102`,
  },
];

export default function Cookies() {
  return (
    <div>
      <div className="bg-linear-to-b from-muted/50 to-background -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 rounded-none">
        <div className="max-w-4xl mx-auto py-20 md:py-28">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <Badge variant="outline" className="mb-6">
              Legal
            </Badge>
            <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
              Cookie Policy
            </h1>
            <p className="mt-6 text-lg text-muted-foreground">
              Last updated: January 15, 2025
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto py-12 md:py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <p className="text-lg text-muted-foreground leading-relaxed mb-12">
            This Cookie Policy explains how LegalCRM uses cookies and similar
            technologies to recognize you when you visit our platform. It
            explains what these technologies are and why we use them, as well as
            your rights to control our use of them.
          </p>

          {/* Cookie Types Table */}
          <div className="mb-12">
            <h2 className="text-xl font-semibold text-foreground mb-6">
              Types of Cookies We Use
            </h2>
            <div className="rounded-lg border border-border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="font-semibold">Cookie Type</TableHead>
                    <TableHead className="font-semibold">Purpose</TableHead>
                    <TableHead className="font-semibold">Duration</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cookieTypes.map((cookie, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">
                        {cookie.name}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {cookie.purpose}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {cookie.duration}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-4 mb-12">
            {cookieTypes.map((cookie, index) => (
              <div key={index} className="rounded-lg border border-border p-4">
                <h3 className="font-semibold text-foreground mb-2">
                  {cookie.name}
                </h3>
                <p className="text-sm text-muted-foreground mb-2">
                  {cookie.purpose}
                </p>
                <p className="text-xs text-muted-foreground">
                  Duration: {cookie.duration}
                </p>
              </div>
            ))}
          </div>

          <div className="space-y-10">
            {sections.map((section, index) => (
              <div
                key={index}
                className="border-b border-border pb-8 last:border-0"
              >
                <h2 className="text-xl font-semibold text-foreground mb-4">
                  {section.title}
                </h2>
                <p className="text-muted-foreground whitespace-pre-line leading-relaxed">
                  {section.content}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
