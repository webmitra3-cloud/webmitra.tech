import { useQuery } from "@tanstack/react-query";
import { ArrowRight, CheckCircle2, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { PageHero } from "@/components/shared/page-hero";
import { Reveal } from "@/components/shared/reveal";
import { Seo } from "@/components/shared/seo";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { publicApi } from "@/lib/api";
import { cn } from "@/lib/utils";
import { useSiteSettings } from "@/hooks/use-site-settings";

export function PricingPage() {
  const { data: settings } = useSiteSettings();
  const { data } = useQuery({
    queryKey: ["pricing-page"],
    queryFn: publicApi.getPricing,
  });

  return (
    <>
      <Seo title="Pricing" description="Flexible service packages for your goals." settings={settings} path="/pricing" />
      <PageHero title="Pricing Packages" subtitle="Transparent plans built for startup, growth-stage, and scale-ready businesses." />

      <section className="container py-10 md:py-12">
        <Reveal className="section-wrap bg-grid-soft p-6 sm:p-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Plan Structure</p>
              <h2 className="mt-2 text-2xl font-semibold sm:text-3xl">Three clear plans with real delivery scope</h2>
              <p className="mt-2 max-w-2xl text-sm text-muted-foreground sm:text-base">
                Pick a package and we align it to your exact business goals, timeline, and technical requirements.
              </p>
            </div>
            <Link to="/contact" className={cn(buttonVariants({ variant: "brand", size: "lg" }))}>
              Talk to Sales <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </Reveal>
      </section>

      <section className="container pb-12 md:pb-14">
        <div className="grid gap-4 md:grid-cols-3">
          {data?.map((plan, index) => (
            <Reveal key={plan._id} delayMs={index * 50}>
              <Card className={cn("h-full", plan.highlighted ? "border-primary" : "")}> 
                <CardHeader>
                  <div className="mb-3 flex items-center justify-between">
                    <CardTitle>{plan.name}</CardTitle>
                    {plan.highlighted ? (
                      <span className="inline-flex items-center gap-1 rounded-full border border-primary/40 bg-primary/10 px-2.5 py-1 text-[11px] font-semibold text-primary">
                        <ShieldCheck className="h-3.5 w-3.5" /> Recommended
                      </span>
                    ) : null}
                  </div>
                  <CardDescription>{plan.note}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-semibold tracking-tight">
                    {plan.startingFrom ? "From " : ""}NPR {plan.price.toLocaleString()}
                  </p>
                  <ul className="mt-5 space-y-2 text-sm text-muted-foreground">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex gap-2">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 text-primary" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <a
                    href={plan.ctaLink}
                    className={cn(buttonVariants({ variant: plan.highlighted ? "default" : "outline" }), "mt-6 w-full")}
                    target={plan.ctaLink.startsWith("http") ? "_blank" : undefined}
                    rel="noreferrer"
                  >
                    {plan.ctaLabel}
                  </a>
                </CardContent>
              </Card>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
