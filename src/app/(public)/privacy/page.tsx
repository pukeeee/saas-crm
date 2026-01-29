"use client";

import { motion } from "motion/react";
import { Badge } from "@/shared/components/ui/badge";

const sections = [
  {
    title: "Information We Collect",
    content: `We collect information you provide directly to us, such as when you create an account, use our services, or contact us for support. This includes:

• Account information (name, email, company details)
• Case and client data you enter into the system
• Usage data and analytics
• Communication preferences`,
  },
  {
    title: "How We Use Your Information",
    content: `We use the information we collect to:

• Provide, maintain, and improve our services
• Process transactions and send related information
• Send technical notices and support messages
• Respond to your comments and questions
• Analyze usage patterns to improve user experience
• Protect against fraudulent or illegal activity`,
  },
  {
    title: "Data Storage and Security",
    content: `Your data is stored on secure servers with enterprise-grade encryption. We implement industry-standard security measures including:

• AES-256 encryption at rest
• TLS 1.3 encryption in transit
• Regular security audits and penetration testing
• SOC 2 Type II compliance
• Geographic data residency options`,
  },
  {
    title: "Data Sharing and Disclosure",
    content: `We do not sell your personal information. We may share your information only in the following circumstances:

• With your consent or at your direction
• With service providers who assist in our operations
• To comply with legal obligations
• To protect our rights and prevent fraud
• In connection with a merger or acquisition`,
  },
  {
    title: "Your Rights and Choices",
    content: `You have the right to:

• Access, correct, or delete your personal information
• Export your data in a portable format
• Opt out of marketing communications
• Request restriction of processing
• Lodge a complaint with a supervisory authority`,
  },
  {
    title: "Data Retention",
    content: `We retain your information for as long as your account is active or as needed to provide services. After account deletion, we retain certain information as required by law or for legitimate business purposes, typically for no longer than 7 years.`,
  },
  {
    title: "International Data Transfers",
    content: `Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place, including Standard Contractual Clauses approved by the European Commission.`,
  },
  {
    title: "Changes to This Policy",
    content: `We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new policy on this page and updating the "Last updated" date.`,
  },
  {
    title: "Contact Us",
    content: `If you have questions about this Privacy Policy or our data practices, please contact us at:

Email: privacy@legalcrm.com
Address: 123 Legal Street, Suite 400, San Francisco, CA 94102`,
  },
];

export default function Privacy() {
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
              Privacy Policy
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
            At LegalCRM, we take your privacy seriously. This Privacy Policy
            explains how we collect, use, disclose, and safeguard your
            information when you use our legal practice management platform.
          </p>

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
