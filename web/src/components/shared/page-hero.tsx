import { Compass, Gauge, ShieldCheck } from "lucide-react";

type PageHeroProps = {
  title: string;
  subtitle?: string;
};

export function PageHero({ title, subtitle }: PageHeroProps) {
  return (
    <section className="border-b border-border/70 bg-background">
      <div className="container py-10 md:py-14">
        <div className="section-wrap bg-grid-soft p-5 sm:p-7 lg:p-10">
          <div className="grid gap-5 lg:grid-cols-[1.12fr_0.88fr] lg:gap-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">WebMitra.Tech</p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl">{title}</h1>
              {subtitle ? <p className="mt-3 max-w-2xl text-sm text-muted-foreground sm:text-base">{subtitle}</p> : null}
            </div>

            <div className="surface p-5 sm:p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-primary">Execution Standard</p>
              <div className="mt-3 space-y-2.5 text-sm text-muted-foreground">
                <p className="flex items-center gap-2">
                  <Compass className="h-4 w-4 text-primary" />
                  Strategy-led digital planning
                </p>
                <p className="flex items-center gap-2">
                  <Gauge className="h-4 w-4 text-primary" />
                  Performance-driven implementation
                </p>
                <p className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-primary" />
                  Secure and maintainable delivery
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
