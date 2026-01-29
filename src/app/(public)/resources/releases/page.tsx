"use client";

import { motion } from "motion/react";
import { CheckCircle2, Sparkles, Bug, Zap } from "lucide-react";
import { Badge } from "@/shared/components/ui/badge";

const releases = [
  {
    version: "2.8.0",
    date: "January 25, 2025",
    type: "major",
    highlights: [
      "Introduced AI-powered document summarization",
      "New dashboard with customizable widgets",
      "Enhanced mobile app with offline support",
    ],
    features: [
      "AI document summarization for case files",
      "Customizable dashboard layouts",
      "Drag-and-drop widget arrangement",
      "Mobile offline mode for case access",
      "Bulk document upload improvements",
    ],
    improvements: [
      "50% faster search performance",
      "Improved PDF rendering quality",
      "Better keyboard navigation throughout app",
      "Enhanced accessibility for screen readers",
    ],
    fixes: [
      "Fixed calendar sync issues with Outlook",
      "Resolved duplicate notification bug",
      "Fixed file preview on Safari browser",
    ],
  },
  {
    version: "2.7.2",
    date: "January 15, 2025",
    type: "patch",
    highlights: ["Critical security update", "Performance improvements"],
    features: [],
    improvements: [
      "Improved session handling security",
      "Better error messages for failed operations",
      "Optimized database queries",
    ],
    fixes: [
      "Fixed authentication timeout issue",
      "Resolved data export formatting problems",
      "Fixed timezone handling in reports",
    ],
  },
  {
    version: "2.7.0",
    date: "January 8, 2025",
    type: "minor",
    highlights: ["New client portal features", "Enhanced billing automation"],
    features: [
      "Client self-service document uploads",
      "Automated payment reminders",
      "Recurring invoice templates",
      "Client satisfaction surveys",
    ],
    improvements: [
      "Streamlined onboarding flow",
      "Better invoice customization options",
      "Improved report generation speed",
    ],
    fixes: [
      "Fixed invoice PDF generation on mobile",
      "Resolved calendar event duplication",
      "Fixed search filter persistence",
    ],
  },
  {
    version: "2.6.0",
    date: "December 20, 2024",
    type: "minor",
    highlights: ["Team collaboration features", "Advanced permissions system"],
    features: [
      "Real-time document collaboration",
      "Granular permission controls",
      "Team activity feed",
      "Mention notifications (@username)",
    ],
    improvements: [
      "Faster document loading times",
      "Better conflict resolution for edits",
      "Improved notification preferences",
    ],
    fixes: [
      "Fixed permission inheritance issues",
      "Resolved notification delivery delays",
      "Fixed team member removal workflow",
    ],
  },
  {
    version: "2.5.0",
    date: "December 5, 2024",
    type: "major",
    highlights: ["Complete UI refresh", "Dark mode support"],
    features: [
      "New modern interface design",
      "System and manual dark mode toggle",
      "Redesigned navigation sidebar",
      "New quick actions menu",
    ],
    improvements: [
      "Improved color contrast for accessibility",
      "Better responsive behavior on tablets",
      "Smoother animations and transitions",
    ],
    fixes: [
      "Fixed layout issues on smaller screens",
      "Resolved theme switching glitches",
      "Fixed icon alignment inconsistencies",
    ],
  },
];

const getTypeColor = (type: string) => {
  switch (type) {
    case "major":
      return "bg-accent text-accent-foreground";
    case "minor":
      return "bg-primary text-primary-foreground";
    case "patch":
      return "bg-muted text-muted-foreground";
    default:
      return "bg-muted text-muted-foreground";
  }
};

export default function Releases() {
  return (
    <div>
      <div className="bg-linear-to-b from-muted/50 to-background -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 rounded-none">
        <div className="max-w-4xl mx-auto py-20 md:py-28">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Badge variant="outline" className="mb-6">
              Release Notes
            </Badge>
            <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              What`s new in Justio CRM
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
              Stay up to date with the latest features, improvements, and bug
              fixes. We ship updates regularly to make your experience better.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="py-12 md:py-16">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-16">
            {releases.map((release, index) => (
              <motion.div
                key={release.version}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative"
              >
                {/* Timeline connector */}
                {index < releases.length - 1 && (
                  <div className="absolute left-2.75 top-12 bottom-0 w-0.5 bg-border -mb-16 hidden md:block" />
                )}

                <div className="flex gap-8">
                  {/* Timeline dot */}
                  <div className="hidden md:flex flex-col items-center">
                    <div className="h-6 w-6 rounded-full bg-accent flex items-center justify-center">
                      <div className="h-2 w-2 rounded-full bg-accent-foreground" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3 mb-4">
                      <h2 className="text-2xl font-semibold text-foreground">
                        Version {release.version}
                      </h2>
                      <Badge className={getTypeColor(release.type)}>
                        {release.type}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {release.date}
                      </span>
                    </div>

                    {/* Highlights */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      {release.highlights.map((highlight, i) => (
                        <span
                          key={i}
                          className="px-3 py-1 rounded-full bg-muted text-sm text-foreground"
                        >
                          {highlight}
                        </span>
                      ))}
                    </div>

                    <div className="rounded-xl border border-border bg-card p-6 space-y-6">
                      {/* Features */}
                      {release.features.length > 0 && (
                        <div>
                          <div className="flex items-center gap-2 mb-3">
                            <Sparkles className="h-5 w-5 text-accent" />
                            <h3 className="font-semibold text-foreground">
                              New Features
                            </h3>
                          </div>
                          <ul className="space-y-2">
                            {release.features.map((feature, i) => (
                              <li
                                key={i}
                                className="flex items-start gap-2 text-sm text-muted-foreground"
                              >
                                <CheckCircle2 className="h-4 w-4 text-accent mt-0.5 shrink-0" />
                                {feature}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Improvements */}
                      {release.improvements.length > 0 && (
                        <div>
                          <div className="flex items-center gap-2 mb-3">
                            <Zap className="h-5 w-5 text-yellow-500" />
                            <h3 className="font-semibold text-foreground">
                              Improvements
                            </h3>
                          </div>
                          <ul className="space-y-2">
                            {release.improvements.map((improvement, i) => (
                              <li
                                key={i}
                                className="flex items-start gap-2 text-sm text-muted-foreground"
                              >
                                <CheckCircle2 className="h-4 w-4 text-yellow-500 mt-0.5 shrink-0" />
                                {improvement}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Bug Fixes */}
                      {release.fixes.length > 0 && (
                        <div>
                          <div className="flex items-center gap-2 mb-3">
                            <Bug className="h-5 w-5 text-red-500" />
                            <h3 className="font-semibold text-foreground">
                              Bug Fixes
                            </h3>
                          </div>
                          <ul className="space-y-2">
                            {release.fixes.map((fix, i) => (
                              <li
                                key={i}
                                className="flex items-start gap-2 text-sm text-muted-foreground"
                              >
                                <CheckCircle2 className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
                                {fix}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
