import { LANDING_CONTENT } from "@/shared/lib/config/landing";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/shared/components/ui/accordion";

export function FaqSection() {
  const { title, items } = LANDING_CONTENT.faq;

  return (
    <section id="faq" className="w-full py-16 md:py-24">
      <div className="container">
        <div className="mx-auto max-w-3xl space-y-12">
          {/* Заголовок */}
          <h2 className="text-3xl md:text-4xl font-bold text-center">
            {title}
          </h2>

          {/* Accordion FAQ */}
          <Accordion type="single" collapsible className="w-full">
            {items.map((item, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
