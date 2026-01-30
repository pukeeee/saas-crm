"use client";

import { BlogHero } from "@/widgets/blog/ui/BlogHero";
import { BlogCategories } from "@/widgets/blog/ui/BlogCategories";
import { BlogFeaturedPost } from "@/widgets/blog/ui/BlogFeaturedPost";
import { BlogGrid } from "@/widgets/blog/ui/BlogGrid";
import { BlogNewsletter } from "@/widgets/blog/ui/BlogNewsletter";
import { blogContent } from "@/content/main/resources/blog";

/**
 * Сторінка блогу Justio CRM
 * Побудована за методологією FSD з локалізованим контентом та покращеною типографікою
 */
export default function BlogPage() {
  return (
    <main>
      <BlogHero content={blogContent.hero} />
      <BlogCategories categories={blogContent.categories} />
      <BlogFeaturedPost post={blogContent.featuredPost} />
      <BlogGrid posts={blogContent.posts} />
      <BlogNewsletter content={blogContent.newsletter} />
    </main>
  );
}