import { useQuery } from "@tanstack/react-query";
import {
  ArrowRight,
  ArrowUpRight,
  Building2,
  CheckCircle2,
  Clock3,
  Gauge,
  Globe,
  Layers,
  Mail,
  MapPin,
  PhoneCall,
  ShieldCheck,
  Sparkles,
  SquareTerminal,
  Workflow,
} from "lucide-react";
import { Link } from "react-router-dom";
import { CountUp } from "@/components/shared/count-up";
import { EmptyState } from "@/components/shared/empty-state";
import { LoadingState } from "@/components/shared/loading";
import { PublicTestimonialForm } from "@/components/shared/public-testimonial-form";
import { Reveal } from "@/components/shared/reveal";
import { Seo } from "@/components/shared/seo";
import { ServiceIcon } from "@/components/shared/service-icon";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { publicApi } from "@/lib/api";
import { defaultSettings } from "@/lib/constants";
import { cn } from "@/lib/utils";

const executionSteps = [
  {
    id: "01",
    title: "Discovery & Audit",
    text: "Business goals, audience, channels, and technical baseline.",
  },
  {
    id: "02",
    title: "Design & Build",
    text: "Modern interface system, secure backend, and CMS workflow.",
  },
  {
    id: "03",
    title: "Launch & Scale",
    text: "Performance checks, SEO setup, analytics, and iteration plan.",
  },
];

const executionSignals = [
  { icon: ShieldCheck, text: "Secure delivery" },
  { icon: Clock3, text: "On-time milestones" },
  { icon: SquareTerminal, text: "Modern stack" },
  { icon: Workflow, text: "Long-term support" },
];

const whyPoints = [
  {
    icon: Layers,
    title: "Practical Strategy",
    text: "Clear execution plans aligned to business targets.",
  },
  {
    icon: Building2,
    title: "Strong Engineering",
    text: "Scalable architecture with security-first decisions.",
  },
  {
    icon: Gauge,
    title: "Performance Focus",
    text: "Fast load times, accessibility, and conversion readiness.",
  },
  {
    icon: Sparkles,
    title: "Growth Partnership",
    text: "Post-launch support with measurable optimization cycles.",
  },
];

export function HomePage() {
  const { data, isLoading } = useQuery({
    queryKey: ["homepage"],
    queryFn: publicApi.getHomepage,
  });

  if (isLoading || !data) {
    return <LoadingState label="Loading website..." />;
  }

  const services = Array.isArray(data.services) ? data.services : [];
  const projects = Array.isArray(data.projects) ? data.projects : [];
  const collaborations = Array.isArray(data.collaborations) ? data.collaborations : [];
  const pricingPlans = Array.isArray(data.pricing) ? data.pricing : [];
  const testimonials = Array.isArray(data.testimonials) ? data.testimonials : [];

  const mergedSettings = {
    ...defaultSettings,
    ...(data.settings || {}),
    stats: {
      ...defaultSettings.stats,
      ...(data.settings?.stats || {}),
    },
    contact: {
      ...defaultSettings.contact,
      ...(data.settings?.contact || {}),
    },
    socials: {
      ...defaultSettings.socials,
      ...(data.settings?.socials || {}),
    },
    values: data.settings?.values || defaultSettings.values,
  };

  const featuredServices = services.slice(0, 6);
  const featuredProjects = projects.slice(0, 5);
  const highlightedProject = featuredProjects[0];
  const otherProjects = featuredProjects.slice(1, 5);

  return (
    <>
      <Seo settings={mergedSettings} />

      <section id="home" className="border-b border-border/70 bg-background">
        <Reveal className="container py-10 md:py-14">
          <div className="section-wrap bg-grid-soft grid gap-6 p-5 sm:p-7 lg:grid-cols-[1.05fr_0.95fr] lg:p-9">
            <div className="space-y-5">
              <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-card px-3 py-1.5 text-xs font-semibold shadow-soft">
                <MapPin className="h-3.5 w-3.5 text-primary" />
                Butwal, Nepal
              </div>

              <h1 className="text-3xl font-semibold leading-tight sm:text-4xl lg:text-6xl">
                {mergedSettings.tagline || "Digital products designed for real business growth"}
              </h1>

              <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-[1.02rem]">{mergedSettings.shortIntro}</p>

              <div className="flex flex-wrap gap-3">
                <Link to="/projects" className={cn(buttonVariants({ variant: "default", size: "lg" }))}>
                  View Projects
                </Link>
                <Link to="/contact" className={cn(buttonVariants({ variant: "brand", size: "lg" }))}>
                  Get a Quote
                </Link>
                {mergedSettings.contact.phone ? (
                  <a
                    href={`tel:${mergedSettings.contact.phone.replace(/\s+/g, "")}`}
                    className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
                  >
                    <PhoneCall className="h-4 w-4" />
                    Call
                  </a>
                ) : null}
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <div className="surface p-4">
                  <p className="text-2xl font-semibold tracking-tight">
                    <CountUp end={mergedSettings.stats.projectsDelivered ?? 0} suffix="+" />
                  </p>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">Projects Delivered</p>
                </div>
                <div className="surface p-4">
                  <p className="text-2xl font-semibold tracking-tight">
                    <CountUp end={mergedSettings.stats.clients ?? 0} suffix="+" />
                  </p>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">Clients Served</p>
                </div>
                <div className="surface p-4">
                  <p className="text-2xl font-semibold tracking-tight">
                    <CountUp end={mergedSettings.stats.years ?? 0} suffix="+" />
                  </p>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">Years Experience</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="relative overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
                <div className="aspect-[16/11] w-full">
                  {mergedSettings.homepageBannerUrl ? (
                    <img
                      src={mergedSettings.homepageBannerUrl}
                      alt={`${mergedSettings.companyName} banner`}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-secondary px-6 text-center text-sm text-muted-foreground">
                      Upload homepage banner from admin settings.
                    </div>
                  )}
                </div>
                <div className="absolute inset-0 bg-slate-950/45" />
                <div className="absolute left-4 top-4 rounded-md border border-white/30 bg-black/35 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white">
                  Featured Banner
                </div>
                <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                  <h2 className="text-2xl font-semibold sm:text-3xl">{mergedSettings.companyName}</h2>
                  <p className="mt-1 text-sm text-white/90">{mergedSettings.tagline}</p>
                </div>
              </div>

              <div className="grid gap-3 rounded-xl border border-border bg-card p-4 sm:grid-cols-2">
                <p className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4 text-primary" />
                  {mergedSettings.contact.address}
                </p>
                <p className="flex items-center gap-2 text-sm text-muted-foreground">
                  <PhoneCall className="h-4 w-4 text-primary" />
                  {mergedSettings.contact.phone}
                </p>
                <p className="flex items-center gap-2 text-sm text-muted-foreground sm:col-span-2">
                  <Mail className="h-4 w-4 text-primary" />
                  {mergedSettings.contact.email}
                </p>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      <section id="services" className="container py-12 md:py-16">
        <Reveal className="mb-7 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-primary">Capabilities</p>
            <h2 className="text-2xl font-semibold sm:text-3xl">Services</h2>
          </div>
          <Link to="/services" className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground">
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </Reveal>

        <div className="no-scrollbar -mx-4 flex snap-x gap-3 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-4 sm:overflow-visible sm:px-0 lg:grid-cols-3">
          {featuredServices.length === 0 ? (
            <div className="w-full sm:col-span-2 lg:col-span-3">
              <EmptyState title="No services yet" />
            </div>
          ) : null}

          {featuredServices.map((service, index) => (
            <Reveal key={service._id} delayMs={index * 45} className="min-w-[82%] snap-start sm:min-w-0">
              <Card className="h-full">
                <CardHeader>
                  <div className="mb-3 flex items-center justify-between">
                    <div className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-border bg-secondary">
                      <ServiceIcon name={service.icon} className="h-5 w-5 text-primary" />
                    </div>
                    <span className="text-xs font-semibold text-muted-foreground">0{index + 1}</span>
                  </div>
                  <CardTitle className="text-lg">{service.title}</CardTitle>
                  <CardDescription>{service.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex items-center justify-between text-sm">
                  <span className="inline-flex items-center gap-1 font-medium text-primary">
                    Learn more <ArrowUpRight className="h-4 w-4" />
                  </span>
                  {service.featured ? <Badge>Featured</Badge> : null}
                </CardContent>
              </Card>
            </Reveal>
          ))}
        </div>
      </section>

      <section id="projects" className="border-y border-border/70 bg-background">
        <div className="container py-12 md:py-14">
          <Reveal className="mb-7 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-primary">Work</p>
              <h2 className="text-2xl font-semibold sm:text-3xl">Featured Projects</h2>
            </div>
            <Link to="/projects" className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground">
              Browse all <ArrowRight className="h-4 w-4" />
            </Link>
          </Reveal>

          {featuredProjects.length === 0 ? <EmptyState title="No projects yet" /> : null}

          {highlightedProject ? (
            <div className="grid gap-4 lg:grid-cols-[1.35fr_0.95fr]">
              <Reveal>
                <Card className="h-full overflow-hidden">
                  {highlightedProject.thumbnailUrl ? (
                    <img
                      src={highlightedProject.thumbnailUrl}
                      alt={highlightedProject.title}
                      className="h-64 w-full object-cover lg:h-[360px]"
                      loading="lazy"
                    />
                  ) : null}
                  <CardHeader>
                    <div className="mb-2 flex flex-wrap gap-2">
                      <Badge>Featured Case</Badge>
                    </div>
                    <CardTitle className="text-xl">{highlightedProject.title}</CardTitle>
                    <CardDescription>{highlightedProject.summary}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                      <Link to={`/projects/${highlightedProject.slug}`} className={cn(buttonVariants({ variant: "outline", size: "sm" }))}>
                        View Details
                      </Link>
                      {highlightedProject.viewLiveUrl ? (
                        <a
                          href={highlightedProject.viewLiveUrl}
                          target="_blank"
                          rel="noreferrer"
                          className={cn(buttonVariants({ variant: "default", size: "sm" }))}
                        >
                          Visit Live <ArrowUpRight className="h-4 w-4" />
                        </a>
                      ) : null}
                    </div>
                  </CardContent>
                </Card>
              </Reveal>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
                {otherProjects.map((project, index) => (
                  <Reveal key={project._id} delayMs={index * 60}>
                    <Card className="h-full">
                      <CardHeader>
                        <CardTitle className="text-base">{project.title}</CardTitle>
                        <CardDescription>{project.summary}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <Link to={`/projects/${project.slug}`} className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline">
                          View details <ArrowUpRight className="h-4 w-4" />
                        </Link>
                      </CardContent>
                    </Card>
                  </Reveal>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </section>

      <section id="framework" className="container py-12 md:py-16">
        <Reveal className="section-wrap bg-grid-soft p-5 sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-wider text-primary">Delivery Method</p>
          <h2 className="mt-2 text-2xl font-semibold sm:text-3xl">Execution Framework</h2>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground sm:text-base">Clear process from strategy to measurable outcomes.</p>

          <div className="mt-6 space-y-3">
            {executionSteps.map((item) => (
              <div key={item.id} className="rounded-lg border border-border bg-secondary/45 p-4 sm:p-5">
                <p className="text-lg font-semibold">
                  {item.id}. {item.title}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">{item.text}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {executionSignals.map((item) => (
              <div key={item.text} className="flex items-center gap-2 text-sm text-muted-foreground">
                <item.icon className="h-4 w-4 text-primary" />
                {item.text}
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      <section className="container py-12 md:py-16">
        <Reveal className="mb-7">
          <p className="text-xs font-semibold uppercase tracking-wider text-primary">Why WebMitra.Tech</p>
          <h2 className="text-2xl font-semibold sm:text-3xl">Built for clarity, speed, and long-term value</h2>
        </Reveal>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {whyPoints.map((item, index) => (
            <Reveal key={item.title} delayMs={index * 45}>
              <Card className="h-full">
                <CardHeader>
                  <item.icon className="h-5 w-5 text-primary" />
                  <CardTitle className="text-lg">{item.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">{item.text}</CardContent>
              </Card>
            </Reveal>
          ))}
        </div>
      </section>

      <section id="collaborations" className="border-y border-border/70 bg-background">
        <div className="container py-12 md:py-14">
          <Reveal className="mb-7 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-primary">Collaborations</p>
              <h2 className="text-2xl font-semibold sm:text-3xl">Partners and Client Network</h2>
            </div>
            <Link to="/contact" className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground">
              Collaborate with us <ArrowRight className="h-4 w-4" />
            </Link>
          </Reveal>

          {collaborations.length === 0 ? <EmptyState title="No collaborations available" /> : null}

          {collaborations.length > 0 ? (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {collaborations.map((item, index) => (
                <Reveal key={item._id} delayMs={index * 35}>
                  {item.websiteUrl ? (
                    <a
                      href={item.websiteUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex h-full min-h-[96px] items-center justify-center rounded-lg border border-border bg-card p-4 transition hover:shadow-soft"
                      aria-label={`Open ${item.name} website`}
                    >
                      {item.logoUrl ? (
                        <img src={item.logoUrl} alt={item.name} className="h-10 w-auto object-contain" loading="lazy" />
                      ) : (
                        <p className="text-sm font-medium">{item.name}</p>
                      )}
                    </a>
                  ) : (
                    <div className="flex h-full min-h-[96px] items-center justify-center rounded-lg border border-border bg-card p-4">
                      {item.logoUrl ? (
                        <img src={item.logoUrl} alt={item.name} className="h-10 w-auto object-contain" loading="lazy" />
                      ) : (
                        <p className="text-sm font-medium">{item.name}</p>
                      )}
                    </div>
                  )}
                </Reveal>
              ))}
            </div>
          ) : null}
        </div>
      </section>

      <section id="pricing" className="container py-12 md:py-16">
        <Reveal>
          <p className="text-xs font-semibold uppercase tracking-wider text-primary">Packages</p>
          <h2 className="text-2xl font-semibold sm:text-3xl">Pricing Preview</h2>
        </Reveal>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {pricingPlans.map((plan, index) => (
            <Reveal key={plan._id} delayMs={index * 50}>
              <Card className={cn("h-full", plan.highlighted ? "border-primary" : "")}>
                <CardHeader>
                  <div className="mb-2 flex items-center justify-between">
                    <CardTitle>{plan.name}</CardTitle>
                    {plan.highlighted ? <Badge className="border-primary bg-primary text-primary-foreground">Recommended</Badge> : null}
                  </div>
                  <CardDescription>{plan.note}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-semibold">
                    {plan.startingFrom ? "From " : ""}NPR {plan.price.toLocaleString()}
                  </p>
                  <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                    {(plan.features || []).map((feature) => (
                      <li key={feature} className="flex gap-2">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 text-primary" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <a
                    href={plan.ctaLink}
                    className={cn(buttonVariants({ variant: plan.highlighted ? "default" : "outline" }), "mt-5 w-full")}
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

      <section id="testimonials" className="border-y border-border/70 bg-background">
        <div className="container py-12 md:py-14">
          <Reveal className="mb-7 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-primary">Client Feedback</p>
              <h2 className="text-2xl font-semibold sm:text-3xl">Testimonials</h2>
            </div>
            <p className="text-sm text-muted-foreground">Share your experience in the form.</p>
          </Reveal>

          <div className="grid items-start gap-5 lg:grid-cols-[1.3fr_0.7fr]">
            <div className="no-scrollbar -mx-4 flex snap-x gap-3 overflow-x-auto px-4 pb-1 sm:mx-0 sm:grid sm:grid-cols-2 sm:content-start sm:gap-4 sm:overflow-visible sm:px-0">
              {testimonials.length === 0 ? (
                <div className="w-full sm:col-span-2">
                  <EmptyState title="No testimonials yet" />
                </div>
              ) : null}

              {testimonials.map((item, index) => (
                <Reveal key={item._id} delayMs={index * 45} className="min-w-[82%] snap-start sm:min-w-0">
                  <Card>
                    <CardContent className="pt-4">
                      <p className="text-sm leading-relaxed text-muted-foreground">"{item.message}"</p>
                      <p className="mt-4 text-sm font-medium">{item.name}</p>
                      <p className="text-xs text-muted-foreground">{item.roleCompany}</p>
                    </CardContent>
                  </Card>
                </Reveal>
              ))}
            </div>
            <Reveal delayMs={60}>
              <PublicTestimonialForm />
            </Reveal>
          </div>
        </div>
      </section>

      <section className="container py-12 md:py-16">
        <Reveal className="section-wrap bg-grid-soft p-6 text-center sm:p-10">
          <h2 className="text-2xl font-semibold sm:text-3xl">Ready to plan your next digital project?</h2>
          <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
            Share your goals and we will prepare a clear roadmap with timeline, scope, and pricing.
          </p>

          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link to="/contact" className={cn(buttonVariants({ variant: "brand", size: "lg" }))}>
              Start a Project
            </Link>
            {mergedSettings.socials.whatsapp ? (
              <a
                href={`https://wa.me/${mergedSettings.socials.whatsapp}`}
                target="_blank"
                rel="noreferrer"
                className={cn(buttonVariants({ variant: "default", size: "lg" }))}
              >
                WhatsApp
              </a>
            ) : null}
          </div>

          <div className="mt-6 grid gap-3 text-left sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-lg border border-border bg-secondary/45 p-3 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-2 font-medium text-foreground">
                <Globe className="h-4 w-4 text-primary" />
                Web-first strategy
              </span>
            </div>
            <div className="rounded-lg border border-border bg-secondary/45 p-3 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-2 font-medium text-foreground">
                <ShieldCheck className="h-4 w-4 text-primary" />
                Secure delivery pipeline
              </span>
            </div>
            <div className="rounded-lg border border-border bg-secondary/45 p-3 text-sm text-muted-foreground sm:col-span-2 lg:col-span-1">
              <span className="inline-flex items-center gap-2 font-medium text-foreground">
                <Workflow className="h-4 w-4 text-primary" />
                Long-term support
              </span>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
