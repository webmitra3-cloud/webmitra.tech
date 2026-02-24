import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Search, X } from "lucide-react";
import { useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { EmptyState } from "@/components/shared/empty-state";
import { LoadingState } from "@/components/shared/loading";
import { PageHero } from "@/components/shared/page-hero";
import { PaginationControls } from "@/components/shared/pagination-controls";
import { Reveal } from "@/components/shared/reveal";
import { Seo } from "@/components/shared/seo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useSiteSettings } from "@/hooks/use-site-settings";
import { publicApi } from "@/lib/api";

export function ProjectsPage() {
  const { data: settings } = useSiteSettings();
  const [searchParams, setSearchParams] = useSearchParams();

  const page = Number(searchParams.get("page") || "1");
  const search = searchParams.get("search") || "";
  const tag = searchParams.get("tag") || "";

  const queryParams = useMemo(
    () => ({
      page,
      limit: 9,
      ...(search ? { search } : {}),
      ...(tag ? { tag } : {}),
    }),
    [page, search, tag],
  );

  const { data, isLoading } = useQuery({
    queryKey: ["projects", queryParams],
    queryFn: () => publicApi.getProjects(queryParams),
  });

  const pageSeo = data?.items.find(
    (item) =>
      Boolean(item.seo?.metaTitle) ||
      Boolean(item.seo?.metaDescription) ||
      Boolean(item.seo?.metaKeywords?.length) ||
      Boolean(item.seo?.canonicalUrl),
  )?.seo;

  const setParam = (key: string, value: string) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    if (key !== "page") next.set("page", "1");
    setSearchParams(next);
  };

  const clearFilters = () => {
    const next = new URLSearchParams();
    next.set("page", "1");
    setSearchParams(next);
  };

  const tags = Array.from(new Set(data?.items.flatMap((item) => item.tags || []) || []));
  const featuredTotal = data?.items.filter((item) => item.featured).length || 0;

  return (
    <>
      <Seo
        title={pageSeo?.metaTitle || "Projects"}
        description={pageSeo?.metaDescription || "Selected digital projects from WebMitra.Tech."}
        keywords={pageSeo?.metaKeywords || []}
        image={pageSeo?.ogImageUrl || undefined}
        canonical={pageSeo?.canonicalUrl || undefined}
        settings={settings}
        path="/projects"
      />

      <PageHero title="Projects" subtitle="Case studies built around outcomes, performance, and long-term maintainability." />

      <section className="container py-10 md:py-12">
        <Reveal className="section-wrap bg-grid-soft p-5 sm:p-7 lg:p-9">
          <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Project Library</p>
              <h2 className="mt-2 text-2xl font-semibold sm:text-3xl">Browse by category and business context</h2>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                Every case study includes the problem context, implementation direction, and final digital output.
              </p>

              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                <div className="surface p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Total Results</p>
                  <p className="mt-1 text-2xl font-semibold">{data?.total || 0}</p>
                </div>
                <div className="surface p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Featured in View</p>
                  <p className="mt-1 text-2xl font-semibold">{featuredTotal}</p>
                </div>
                <div className="surface p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Page</p>
                  <p className="mt-1 text-2xl font-semibold">{data?.page || 1}</p>
                </div>
              </div>
            </div>

            <div className="surface space-y-3 p-5 sm:p-6">
              <label className="text-sm font-semibold" htmlFor="project-search">
                Search Projects
              </label>
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="project-search"
                  className="pl-9"
                  placeholder="Search by title or summary..."
                  value={search}
                  onChange={(event) => setParam("search", event.target.value)}
                  aria-label="Search projects"
                />
              </div>

              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Categories</p>
                <div className="flex flex-wrap gap-2">
                  <Button variant={tag === "" ? "default" : "outline"} size="sm" onClick={() => setParam("tag", "")}>
                    All
                  </Button>
                  {tags.map((item) => (
                    <Button key={item} variant={tag === item ? "default" : "outline"} size="sm" onClick={() => setParam("tag", item)}>
                      {item}
                    </Button>
                  ))}
                </div>
              </div>

              {search || tag ? (
                <Button variant="ghost" size="sm" onClick={clearFilters} className="justify-start px-0 text-muted-foreground">
                  <X className="h-4 w-4" />
                  Clear filters
                </Button>
              ) : null}
            </div>
          </div>
        </Reveal>
      </section>

      <section className="container pb-12 md:pb-14">
        {isLoading ? <LoadingState /> : null}
        {!isLoading && data?.items.length === 0 ? <EmptyState title="No projects found." description="Try another search or category." /> : null}

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data?.items.map((project, index) => (
            <Reveal key={project._id} delayMs={index * 40}>
              <Card className="group h-full border-border/70">
                <div className="relative">
                  {project.thumbnailUrl ? (
                    <img src={project.thumbnailUrl} alt={project.title} className="h-52 w-full object-cover" loading="lazy" />
                  ) : (
                    <div className="flex h-52 items-center justify-center bg-secondary text-sm text-muted-foreground">No thumbnail uploaded</div>
                  )}
                  <div className="absolute left-3 top-3 flex items-center gap-2">
                    <Badge className="border-white/35 bg-black/35 text-white">
                      Case Study
                    </Badge>
                    {project.featured ? (
                      <Badge className="bg-brand-orange text-white hover:bg-brand-orange/90">Featured</Badge>
                    ) : null}
                  </div>
                </div>

                <CardHeader>
                  <CardTitle className="text-lg leading-tight">{project.title}</CardTitle>
                  <CardDescription className="leading-relaxed">{project.summary}</CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {(project.tags || []).slice(0, 3).map((item) => (
                      <Badge key={item} className="border-border/80 bg-secondary/70 text-secondary-foreground">
                        {item}
                      </Badge>
                    ))}
                  </div>

                  <Link to={`/projects/${project.slug}`} className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline">
                    View details <ArrowRight className="h-4 w-4" />
                  </Link>
                </CardContent>
              </Card>
            </Reveal>
          ))}
        </div>

        {data ? (
          <div className="mt-7">
            <PaginationControls
              page={data.page}
              totalPages={data.totalPages}
              onPageChange={(nextPage) => {
                const next = new URLSearchParams(searchParams);
                next.set("page", String(nextPage));
                setSearchParams(next);
              }}
            />
          </div>
        ) : null}
      </section>
    </>
  );
}
