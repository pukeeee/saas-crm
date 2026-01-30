"use client";

import { ContactHero } from "@/widgets/contact/ui/ContactHero";
import { ContactMethods } from "@/widgets/contact/ui/ContactMethods";
import { ContactForm } from "@/widgets/contact/ui/ContactForm";
import { contactContent } from "@/content/main/company/contact";

/**
 * Сторінка контактів Justio CRM
 * Побудована за методологією FSD з локалізованим контентом та покращеною формою
 */
export default function ContactPage() {
  return (
    <main>
      <ContactHero content={contactContent.hero} />
      <ContactMethods content={contactContent.methods} />
      <ContactForm content={contactContent.form} />
    </main>
  );
}