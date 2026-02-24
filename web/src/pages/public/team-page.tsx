import { useQuery } from "@tanstack/react-query";
import { ExternalLink, Facebook, Instagram, Linkedin, Users2 } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";
import { LoadingState } from "@/components/shared/loading";
import { PageHero } from "@/components/shared/page-hero";
import { Reveal } from "@/components/shared/reveal";
import { Seo } from "@/components/shared/seo";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSiteSettings } from "@/hooks/use-site-settings";
import { publicApi } from "@/lib/api";
import { cn } from "@/lib/utils";
import { TeamMember } from "@/types";

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || "")
    .join("");
}

function MemberSection({ title, subtitle, type }: { title: string; subtitle: string; type: "TEAM" | "BOARD" }) {
  const { data = [], isLoading } = useQuery({
    queryKey: ["members", type],
    queryFn: () => publicApi.getTeam(type),
  });

  return (
    <section className="mt-10">
      <Reveal className="mb-5 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">{type === "TEAM" ? "Core Team" : "Board"}</p>
          <h2 className="mt-2 text-2xl font-semibold sm:text-3xl">{title}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
        </div>
        <div className="surface inline-flex items-center gap-2 px-4 py-2 text-sm">
          <Users2 className="h-4 w-4 text-primary" />
          {data.length} members
        </div>
      </Reveal>

      {isLoading ? <LoadingState label="Loading team members..." /> : null}
      {!isLoading && data.length === 0 ? <EmptyState title={`No ${type === "TEAM" ? "team" : "board"} members available yet.`} /> : null}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {data.map((member, index) => (
          <Reveal key={member._id} delayMs={index * 45}>
            <MemberCard member={member} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function MemberCard({ member }: { member: TeamMember }) {
  return (
    <Card className="h-full border-border/70">
      <div className="relative">
        {member.photoUrl ? (
          <img src={member.photoUrl} alt={member.name} className="h-60 w-full object-cover" loading="lazy" />
        ) : (
          <div className="flex h-60 items-center justify-center bg-secondary">
            <span className="inline-flex h-16 w-16 items-center justify-center rounded-full border border-border/70 bg-card text-2xl font-semibold text-primary">
              {getInitials(member.name)}
            </span>
          </div>
        )}
        <div className="absolute left-3 top-3">
          <Badge className="border-white/35 bg-black/35 text-white">{member.type === "TEAM" ? "Team" : "Board"}</Badge>
        </div>
      </div>

      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{member.name}</CardTitle>
        <p className="text-sm text-muted-foreground">{member.roleTitle}</p>
      </CardHeader>

      <CardContent className="space-y-4">
        {member.bio ? <p className="text-sm leading-relaxed text-muted-foreground">{member.bio}</p> : null}

        <div className="flex flex-wrap gap-2">
          {member.portfolioUrl ? (
            <a href={member.portfolioUrl} target="_blank" rel="noreferrer" className={cn(buttonVariants({ variant: "outline", size: "sm" }))}>
              Portfolio <ExternalLink className="h-4 w-4" />
            </a>
          ) : null}
          {member.socials.linkedin ? (
            <a
              href={member.socials.linkedin}
              target="_blank"
              rel="noreferrer"
              className={cn(buttonVariants({ variant: "ghost", size: "icon" }))}
              aria-label={`${member.name} LinkedIn`}
            >
              <Linkedin className="h-4 w-4" />
            </a>
          ) : null}
          {member.socials.facebook ? (
            <a
              href={member.socials.facebook}
              target="_blank"
              rel="noreferrer"
              className={cn(buttonVariants({ variant: "ghost", size: "icon" }))}
              aria-label={`${member.name} Facebook`}
            >
              <Facebook className="h-4 w-4" />
            </a>
          ) : null}
          {member.socials.instagram ? (
            <a
              href={member.socials.instagram}
              target="_blank"
              rel="noreferrer"
              className={cn(buttonVariants({ variant: "ghost", size: "icon" }))}
              aria-label={`${member.name} Instagram`}
            >
              <Instagram className="h-4 w-4" />
            </a>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}

export function TeamPage() {
  const { data: settings } = useSiteSettings();

  return (
    <>
      <Seo title="Team" description="Meet the WebMitra.Tech team and board members." settings={settings} path="/team" />
      <PageHero title="People Behind WebMitra.Tech" subtitle="A professional team focused on quality delivery and long-term growth partnerships." />

      <section className="container py-10 md:py-12">
        <Reveal className="section-wrap bg-grid-soft p-5 sm:p-7 lg:p-9">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="surface p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-primary">Cross-functional</p>
              <p className="mt-2 text-sm text-muted-foreground">Strategy, design, engineering, and growth operations in one team.</p>
            </div>
            <div className="surface p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-primary">Execution Driven</p>
              <p className="mt-2 text-sm text-muted-foreground">Delivery standards with clear ownership, timelines, and quality checks.</p>
            </div>
            <div className="surface p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-primary">Client Focused</p>
              <p className="mt-2 text-sm text-muted-foreground">Collaborative communication and transparent progress through every phase.</p>
            </div>
          </div>
        </Reveal>

        <MemberSection
          title="Core Team"
          subtitle="Designers, developers, and strategists delivering project execution."
          type="TEAM"
        />
        <MemberSection
          title="Board Members"
          subtitle="Leadership support for governance, standards, and scaling direction."
          type="BOARD"
        />
      </section>
    </>
  );
}
