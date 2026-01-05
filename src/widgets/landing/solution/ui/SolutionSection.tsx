import { LANDING_CONTENT } from "@/shared/lib/config/landing";

export function SolutionSection() {
  const { title, steps } = LANDING_CONTENT.solution;

  return (
    <section id="solution" className="w-full py-16 md:py-24">
      <div className="container">
        <div className="mx-auto max-w-5xl space-y-12">
          {/* Заголовок */}
          <h2 className="text-3xl md:text-4xl font-bold text-center">
            {title}
          </h2>

          {/* Кроки */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step) => (
              <div key={step.number} className="space-y-4 text-center">
                <div className="mx-auto h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-2xl font-bold text-primary">
                    {step.number}
                  </span>
                </div>
                <h3 className="text-xl font-semibold">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
