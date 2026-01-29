"use client";

import { motion } from "motion/react";
import { Badge } from "@/shared/components/ui/badge";

const sections = [
  {
    title: "1. Acceptance of Terms",
    content: `By accessing or using LegalCRM's services, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this service.`,
  },
  {
    title: "2. Description of Service",
    content: `LegalCRM provides a cloud-based legal practice management platform that includes case management, client relationship management, document management, billing, and team collaboration tools. We reserve the right to modify, suspend, or discontinue any aspect of the service at any time.`,
  },
  {
    title: "3. Account Registration",
    content: `To use our services, you must:

• Provide accurate and complete registration information
• Maintain the security of your account credentials
• Promptly update any changes to your information
• Accept responsibility for all activities under your account
• Notify us immediately of any unauthorized access`,
  },
  {
    title: "4. Subscription and Billing",
    content: `• Subscription fees are billed in advance on a monthly or annual basis
• All fees are non-refundable except as required by law
• We may change pricing with 30 days' notice
• Failure to pay may result in service suspension
• Taxes are additional where applicable`,
  },
  {
    title: "5. Acceptable Use",
    content: `You agree not to:

• Violate any applicable laws or regulations
• Infringe on intellectual property rights
• Transmit malicious code or interfere with the service
• Attempt to gain unauthorized access to systems
• Use the service for any illegal or unauthorized purpose
• Share account credentials with unauthorized users`,
  },
  {
    title: "6. Data Ownership",
    content: `• You retain all rights to your data entered into the platform
• You grant us a license to use your data solely to provide the service
• We do not claim ownership of your client information or case data
• Upon termination, you may export your data for 30 days`,
  },
  {
    title: "7. Confidentiality",
    content: `We understand the sensitive nature of legal data. We maintain strict confidentiality of all information stored in our platform and implement industry-standard security measures to protect your data. We will not access your data except as necessary to provide the service or as required by law.`,
  },
  {
    title: "8. Service Level Agreement",
    content: `• We target 99.9% uptime availability
• Scheduled maintenance will be announced in advance
• We provide 24/7 monitoring of our systems
• Support is available during business hours for all plans
• Enterprise plans include priority support and custom SLAs`,
  },
  {
    title: "9. Limitation of Liability",
    content: `To the maximum extent permitted by law, LegalCRM shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of profits, data, or business opportunities, arising from your use of the service.`,
  },
  {
    title: "10. Indemnification",
    content: `You agree to indemnify and hold harmless LegalCRM and its officers, directors, employees, and agents from any claims, damages, losses, or expenses arising from your use of the service or violation of these terms.`,
  },
  {
    title: "11. Termination",
    content: `• Either party may terminate with 30 days' written notice
• We may terminate immediately for terms violations
• Upon termination, your access will be revoked
• Data export is available for 30 days post-termination
• Certain provisions survive termination`,
  },
  {
    title: "12. Governing Law",
    content: `These Terms shall be governed by and construed in accordance with the laws of the State of California, without regard to its conflict of law provisions. Any disputes shall be resolved in the courts of San Francisco County, California.`,
  },
  {
    title: "13. Changes to Terms",
    content: `We reserve the right to modify these terms at any time. Material changes will be communicated via email or in-app notification at least 30 days before taking effect. Continued use of the service constitutes acceptance of modified terms.`,
  },
  {
    title: "14. Contact Information",
    content: `For questions about these Terms of Service, please contact us at:

Email: legal@legalcrm.com
Address: 123 Legal Street, Suite 400, San Francisco, CA 94102`,
  },
];

export default function Terms() {
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
              Terms of Service
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
            Welcome to LegalCRM. These Terms of Service govern your use of our
            legal practice management platform and constitute a binding
            agreement between you and LegalCRM, Inc.
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
