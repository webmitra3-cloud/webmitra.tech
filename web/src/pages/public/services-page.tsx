import { useQuery } from "@tanstack/react-query";
import { ArrowRight, CheckCircle2, Layers3, ShieldCheck, TimerReset, Workflow } from "lucide-react";
import { Link } from "react-router-dom";
import { EmptyState } from "@/components/shared/empty-state";
import { LoadingState } from "@/components/shared/loading";
import { PageHero } from "@/components/shared/page-hero";
import { Reveal } from "@/components/shared/reveal";
import { Seo } from "@/components/shared/seo";
import { ServiceIcon } from "@/components/shared/service-icon";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useSiteSettings } from "@/hooks/use-site-settings";
import { publicApi } from "@/lib/api";
import { cn } from "@/lib/utils";

const serviceSignals = [
  { icon: ShieldCheck, text: "Security-focused implementation" },
  { icon: Workflow, text: "Structured weekly delivery cycle" },
  { icon: TimerReset, text: "Clear milestones and turnaround" },
];

const deliveryModes = [
  {
    id: "01",
    title: "Discovery and Goal Mapping",
    text: "We align technical direction with business objectives, audience behavior, and timeline expectations.",
  },
  {
    id: "02",
    title: "Design, Build, and QA",
    text: "From UI system to backend architecture, each layer is implemented with quality checks and documentation.",
  },
  {
    id: "03",
    title: "Launch, Support, Optimize",
    text: "After release, we track outcomes, refine weak points, and keep your digital systems reliable.",
  },
];

export function ServicesPage() {
  const { data: settings } = useSiteSettings();
  const { data, isLoading } = useQuery({ queryKey: ["services"], queryFn: publicApi.getServices });
  const pageSeo = data?.find(
    (item) =>
      Boolean(item.seo?.metaTitle) ||
      Boolean(item.seo?.metaDescription) ||
      Boolean(item.seo?.metaKeywords?.length) ||
      Boolean(item.seo?.canonicalUrl),
  )?.seo;

  const featuredCount = data?.filter((item) => item.featured).length || 0;

  return (
    <>
      <Seo
        title={pageSeo?.metaTitle || "Services"}
        description={pageSeo?.metaDescription || "Professional digital services from WebMitra.Tech."}
        keywords={pageSeo?.metaKeywords || []}
        image={pageSeo?.ogImageUrl || undefined}
        canonical={pageSeo?.canonicalUrl || undefined}
        settings={settings}
        path="/services"
      />

      <PageHero title="Services" subtitle="Technology and growth services designed to produce clear business outcomes." />

      <section className="container py-10 md:py-12">
        <Reveal className="section-wrap bg-grid-soft p-5 sm:p-7 lg:p-9">
          <div className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Service Framework</p>
              <h2 className="mt-2 text-2xl font-semibold sm:text-3xl">Practical execution for every engagement</h2>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                We focus on measurable delivery quality, not just output volume. Each service line follows the same planning,
                implementation, and optimization standard.
              </p>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <div className="surface p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Active Services</p>
                  <p className="mt-1 text-2xl font-semibold">{data?.length || 0}</p>
                </div>
                <div className="surface p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Featured Services</p>
                  <p className="mt-1 text-2xl font-semibold">{featuredCount}</p>
                </div>
              </div>

              <div className="mt-5">
                <Link to="/contact" className={cn(buttonVariants({ variant: "brand", size: "lg" }))}>
                  Plan Your Service Scope <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            <div className="space-y-3">
              {deliveryModes.map((item) => (
                <div key={item.id} className="rounded-2xl border border-border/70 bg-card/85 p-4 sm:p-5">
                  <p className="text-sm font-semibold text-primary">{item.id}</p>
                  <h3 className="mt-1 text-base font-semibold sm:text-lg">{item.title}</h3>
                  <p className="mt-1.5 text-sm text-muted-foreground">{item.text}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {serviceSignals.map((item) => (
              <div key={item.text} className="rounded-xl border border-border/70 bg-card/85 p-4 text-sm text-muted-foreground">
                <p className="inline-flex items-center gap-2 font-medium text-foreground">
                  <item.icon className="h-4 w-4 text-primary" />
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      <section className="container pb-12 md:pb-14">
        <Reveal className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Capabilities</p>
            <h2 className="mt-2 text-2xl font-semibold sm:text-3xl">Service Lines</h2>
          </div>
          <p className="text-sm text-muted-foreground">Choose the services aligned to your current growth stage.</p>
        </Reveal>

        {isLoading ? <LoadingState /> : null}
        {!isLoading && data && data.length === 0 ? <EmptyState title="No services available right now." /> : null}

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {data?.map((service, index) => (
            <Reveal key={service._id} delayMs={index * 35}>
              <Card className="h-full border-border/70">
                <CardHeader>
                  <div className="mb-3 flex items-start justify-between">
                    <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-border/70 bg-secondary/70">
                      <ServiceIcon name={service.icon} className="h-5 w-5 text-primary" />
                    </div>
                    <span className="text-xs font-semibold tracking-[0.08em] text-muted-foreground">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <div className="mb-2 flex items-center gap-2">
                    <Badge
                      className={
                        service.featured
                          ? "border-brand-orange/25 bg-brand-orange/15 text-brand-orange"
                          : "border-border/80 bg-secondary/75 text-secondary-foreground"
                      }
                    >
                      {service.featured ? "Featured" : "Service"}
                    </Badge>
                    <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                      <Layers3 className="h-3.5 w-3.5" />
                      {service.slug}
                    </span>
                  </div>
                  <CardTitle className="text-lg">{service.title}</CardTitle>
                  <CardDescription className="leading-relaxed">{service.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1 text-sm font-medium text-primary">
                    Delivery-ready <CheckCircle2 className="h-4 w-4" />
                  </span>
                  <Link to="/contact" className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground">
                    Discuss <ArrowRight className="h-4 w-4" />
                  </Link>
                </CardContent>
              </Card>
            </Reveal>
          ))}
        </div>

        <Reveal delayMs={100} className="mt-8 section-wrap p-6 sm:p-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Need a custom mix?</p>
              <h3 className="mt-2 text-xl font-semibold sm:text-2xl">Combine services based on your business phase</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                We can structure custom packages for startup launch, operational scaling, or social growth campaigns.
              </p>
            </div>
            <Link to="/contact" className={cn(buttonVariants({ variant: "default", size: "lg" }))}>
              Request Consultation
            </Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}
