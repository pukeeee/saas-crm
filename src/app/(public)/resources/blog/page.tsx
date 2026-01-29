"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { ArrowRight, Calendar, Clock, User } from "lucide-react";
import { Badge } from "@/shared/components/ui/badge";

const featuredPost = {
  title: "The Future of Legal Practice Management: AI and Automation",
  excerpt:
    "Explore how artificial intelligence is transforming the way law firms manage cases, clients, and documents. From predictive analytics to automated document review, discover what's next.",
  author: "Sarah Mitchell",
  date: "January 20, 2025",
  readTime: "8 min read",
  category: "Industry Trends",
  image: "/placeholder.svg",
};

const posts = [
  {
    title: "5 Ways to Improve Client Communication in Your Law Firm",
    excerpt:
      "Effective client communication is crucial for success. Learn strategies to keep clients informed and satisfied throughout their legal journey.",
    author: "Michael Chen",
    date: "January 18, 2025",
    readTime: "5 min read",
    category: "Best Practices",
  },
  {
    title: "Understanding GDPR Compliance for Legal Professionals",
    excerpt:
      "A comprehensive guide to ensuring your law practice meets GDPR requirements when handling client data.",
    author: "Emma Wilson",
    date: "January 15, 2025",
    readTime: "10 min read",
    category: "Compliance",
  },
  {
    title: "Streamlining Your Billing Process: Tips and Tricks",
    excerpt:
      "Reduce administrative burden and improve cash flow with these billing best practices for modern law firms.",
    author: "David Park",
    date: "January 12, 2025",
    readTime: "6 min read",
    category: "Productivity",
  },
  {
    title: "Remote Work Security: Protecting Client Confidentiality",
    excerpt:
      "Essential security measures for law firms embracing remote and hybrid work arrangements.",
    author: "Lisa Thompson",
    date: "January 10, 2025",
    readTime: "7 min read",
    category: "Security",
  },
  {
    title: "Case Study: How Morrison & Associates Increased Efficiency by 40%",
    excerpt:
      "Learn how a mid-sized law firm transformed their operations using modern practice management tools.",
    author: "Sarah Mitchell",
    date: "January 8, 2025",
    readTime: "12 min read",
    category: "Case Study",
  },
  {
    title: "The Essential Guide to Legal Document Management",
    excerpt:
      "From version control to secure sharing, master the fundamentals of effective document management.",
    author: "James Rodriguez",
    date: "January 5, 2025",
    readTime: "9 min read",
    category: "Guides",
  },
];

const categories = [
  "All Posts",
  "Industry Trends",
  "Best Practices",
  "Compliance",
  "Security",
  "Productivity",
  "Case Study",
  "Guides",
];

export default function Blog() {
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
              Blog
            </Badge>
            <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Insights for legal professionals
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
              Expert perspectives on legal technology, practice management, and
              industry trends to help your firm succeed.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Categories */}
      <div className="py-8 -mt-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-wrap gap-2 justify-center">
              {categories.map((category, index) => (
                <button
                  key={index}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    index === 0
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Featured Post */}
      <div className="py-12 md:py-16">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Link href="#" className="group block">
              <div className="rounded-2xl border border-border bg-card overflow-hidden card-hover">
                <div className="grid md:grid-cols-2 gap-0">
                  <div className="aspect-video md:aspect-auto bg-muted flex items-center justify-center">
                    <div className="text-6xl text-muted-foreground/30">📰</div>
                  </div>
                  <div className="p-8 lg:p-12 flex flex-col justify-center">
                    <Badge variant="secondary" className="w-fit mb-4">
                      {featuredPost.category}
                    </Badge>
                    <h2 className="text-2xl lg:text-3xl font-semibold text-foreground group-hover:text-accent transition-colors">
                      {featuredPost.title}
                    </h2>
                    <p className="mt-4 text-muted-foreground leading-relaxed">
                      {featuredPost.excerpt}
                    </p>
                    <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        {featuredPost.author}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {featuredPost.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {featuredPost.readTime}
                      </span>
                    </div>
                    <div className="mt-6 flex items-center text-sm font-medium text-accent">
                      Read article
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Post Grid */}
      <div className="pb-12 md:pb-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 + index * 0.05 }}
              >
                <Link href="#" className="group block h-full">
                  <div className="rounded-xl border border-border bg-card p-6 card-hover h-full flex flex-col">
                    <Badge variant="secondary" className="w-fit mb-4">
                      {post.category}
                    </Badge>
                    <h3 className="text-lg font-semibold text-foreground group-hover:text-accent transition-colors">
                      {post.title}
                    </h3>
                    <p className="mt-3 text-sm text-muted-foreground leading-relaxed flex-1">
                      {post.excerpt}
                    </p>
                    <div className="mt-6 flex items-center gap-4 text-xs text-muted-foreground">
                      <span>{post.author}</span>
                      <span>•</span>
                      <span>{post.readTime}</span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Newsletter */}
      <div className="bg-muted/30 py-16 md:py-20 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">
            Subscribe to our newsletter
          </h2>
          <p className="mt-4 text-muted-foreground">
            Get the latest insights and updates delivered to your inbox.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
            />
            <button className="px-6 py-3 rounded-lg bg-accent text-accent-foreground font-medium hover:bg-accent/90 transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
