import { useQuery } from "@tanstack/react-query";
import { ArrowRight, BarChart3, ExternalLink, Globe, Megaphone, ShieldCheck, Users2 } from "lucide-react";
import { Link } from "react-router-dom";
import { CountUp } from "@/components/shared/count-up";
import { PageHero } from "@/components/shared/page-hero";
import { Reveal } from "@/components/shared/reveal";
import { Seo } from "@/components/shared/seo";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSiteSettings } from "@/hooks/use-site-settings";
import { publicApi } from "@/lib/api";
import { cn } from "@/lib/utils";

const growthPillars = [
  {
    icon: Megaphone,
    title: "Social Media Growth",
    text: "Campaign structure, audience targeting, and content systems focused on measurable traction.",
  },
  {
    icon: Globe,
    title: "Modern Web Presence",
    text: "Professional websites and web applications that align design quality with business conversion goals.",
  },
  {
    icon: BarChart3,
    title: "Performance Tracking",
    text: "Clear KPI reporting for engagement, lead quality, and ongoing optimization opportunities.",
  },
];

export function AboutPage() {
  const { data: settings } = useSiteSettings();
  const { data: team = [] } = useQuery({
    queryKey: ["team-preview"],
    queryFn: () => publicApi.getTeam("TEAM"),
  });

  return (
    <>
      <Seo title="About" description="WebMitra.Tech is your digital growth and technology partner." settings={settings} path="/about" />
      <PageHero title="About WebMitra.Tech" subtitle={settings?.tagline} />

      <section className="container py-10 md:py-12">
        <Reveal className="section-wrap bg-grid-soft p-5 sm:p-7 lg:p-9">
          <div className="grid gap-5 lg:grid-cols-[1.08fr_0.92fr]">
            <div className="surface p-5 sm:p-7">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Company Profile</p>
              <h2 className="mt-2 text-2xl font-semibold sm:text-3xl">A practical IT and digital growth partner</h2>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">{settings?.longDescription}</p>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-border/70 bg-secondary/50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-primary">Mission</p>
                  <p className="mt-1.5 text-sm text-muted-foreground">{settings?.mission}</p>
                </div>
                <div className="rounded-xl border border-border/70 bg-secondary/50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-primary">Vision</p>
                  <p className="mt-1.5 text-sm text-muted-foreground">{settings?.vision}</p>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                {(settings?.values || []).map((value) => (
                  <Badge key={value} className="border-border/80 bg-card text-foreground">
                    {value}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <div className="surface p-5 sm:p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Business Snapshot</p>
                <div className="mt-4 grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
                  <div className="rounded-xl border border-border/70 bg-secondary/45 p-4">
                    <p className="text-3xl font-semibold">
                      <CountUp end={settings?.stats.projectsDelivered || 0} suffix="+" />
                    </p>
                    <p className="text-sm text-muted-foreground">Projects Delivered</p>
                  </div>
                  <div className="rounded-xl border border-border/70 bg-secondary/45 p-4">
                    <p className="text-3xl font-semibold">
                      <CountUp end={settings?.stats.clients || 0} suffix="+" />
                    </p>
                    <p className="text-sm text-muted-foreground">Clients Served</p>
                  </div>
                  <div className="rounded-xl border border-border/70 bg-secondary/45 p-4">
                    <p className="text-3xl font-semibold">
                      <CountUp end={settings?.stats.years || 0} suffix="+" />
                    </p>
                    <p className="text-sm text-muted-foreground">Years of Experience</p>
                  </div>
                </div>
              </div>

              <div className="surface p-5 sm:p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Positioning</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  We combine technical product execution and growth operations so businesses can launch faster and scale with confidence.
                </p>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      <section className="border-y border-border/70 bg-background">
        <div className="container py-10 md:py-12">
          <Reveal className="mb-7 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Growth Focus</p>
              <h2 className="mt-2 text-2xl font-semibold sm:text-3xl">How WebMitra.Tech delivers outcomes</h2>
            </div>
            <Link to="/services" className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground">
              Explore services <ArrowRight className="h-4 w-4" />
            </Link>
          </Reveal>

          <div className="grid gap-4 md:grid-cols-3">
            {growthPillars.map((item, index) => (
              <Reveal key={item.title} delayMs={index * 55}>
                <Card className="h-full border-border/70">
                  <CardHeader>
                    <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border/70 bg-secondary/65">
                      <item.icon className="h-5 w-5 text-primary" />
                    </div>
                    <CardTitle className="text-lg">{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground">{item.text}</CardContent>
                </Card>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="container py-10 md:py-12">
        <Reveal className="mb-7 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Team Portfolio</p>
            <h2 className="mt-2 text-2xl font-semibold sm:text-3xl">People powering client delivery</h2>
          </div>
          <Link to="/team" className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground">
            View full team <ArrowRight className="h-4 w-4" />
          </Link>
        </Reveal>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {team.slice(0, 3).map((member, index) => (
            <Reveal key={member._id} delayMs={index * 45}>
              <Card className="h-full border-border/70">
                {member.photoUrl ? <img src={member.photoUrl} alt={member.name} className="h-52 w-full object-cover" loading="lazy" /> : null}
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{member.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{member.roleTitle}</p>
                </CardHeader>
                <CardContent className="space-y-3">
                  {member.bio ? <p className="text-sm text-muted-foreground">{member.bio}</p> : null}
                  <div className="flex flex-wrap gap-2">
                    {member.portfolioUrl ? (
                      <a href={member.portfolioUrl} target="_blank" rel="noreferrer" className={cn(buttonVariants({ variant: "outline", size: "sm" }))}>
                        Portfolio <ExternalLink className="h-4 w-4" />
                      </a>
                    ) : null}
                    {member.socials.linkedin ? (
                      <a href={member.socials.linkedin} target="_blank" rel="noreferrer" className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}>
                        LinkedIn
                      </a>
                    ) : null}
                  </div>
                </CardContent>
              </Card>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="container pb-12 md:pb-14">
        <Reveal className="section-wrap p-6 text-center sm:p-8">
          <div className="mx-auto mb-3 inline-flex h-10 w-10 items-center justify-center rounded-md border border-border bg-secondary">
            <ShieldCheck className="h-5 w-5 text-primary" />
          </div>
          <h2 className="text-2xl font-semibold">Need a reliable digital growth partner?</h2>
          <p className="mx-auto mt-2 max-w-2xl text-sm text-muted-foreground sm:text-base">
            We combine engineering quality, social media growth strategy, and performance tracking into one clear delivery system.
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-3">
            <Link to="/contact" className={cn(buttonVariants({ variant: "brand", size: "lg" }))}>
              Talk with WebMitra.Tech
            </Link>
            <Link to="/services" className={cn(buttonVariants({ variant: "outline", size: "lg" }))}>
              Our Services
            </Link>
            <Link to="/team" className={cn(buttonVariants({ variant: "secondary", size: "lg" }))}>
              <Users2 className="h-4 w-4" />
              Meet Our Team
            </Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}
