import { LANDING_CONTENT } from "@/shared/lib/config/landing";

export function DifferentiatorsSection() {
  const { title, subtitle, list } = LANDING_CONTENT.differentiators;

  return (
    <section id="differentiators" className="w-full py-16 md:py-24">
      <div className="container">
        <div className="mx-auto max-w-5xl space-y-12">
          {/* Заголовки */}
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold">{title}</h2>
            <p className="text-lg text-muted-foreground">{subtitle}</p>
          </div>

          {/* Список переваг */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {list.map((item) => (
              <div key={item.title} className="space-y-3 text-center">
                <div className="mx-auto h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center">
                  <item.icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-lg font-semibold">{item.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
