import Link from "next/link";
import { Separator } from "@/shared/components/ui/separator";
import { LANDING_CONTENT } from "@/shared/lib/config/landing";

export function LandingFooter() {
  const { copyright, columns } = LANDING_CONTENT.footer;

  return (
    <footer className="border-t">
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo Column */}
          <div className="space-y-3">
            <h3 className="text-lg font-bold">{LANDING_CONTENT.header.logo}</h3>
            <p className="text-sm text-muted-foreground">
              CRM для малого бізнесу в Україні
            </p>
          </div>

          {/* Link Columns */}
          {columns.map((column) => (
            <div key={column.title} className="space-y-3">
              <h4 className="font-semibold">{column.title}</h4>
              <ul className="space-y-2">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <Separator className="my-8" />

        {/* Copyright */}
        <div className="text-center text-sm text-muted-foreground">
          {copyright}
        </div>
      </div>
    </footer>
  );
}
