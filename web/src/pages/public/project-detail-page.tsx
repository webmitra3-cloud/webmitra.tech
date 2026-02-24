import { useQuery } from "@tanstack/react-query";
import { ExternalLink } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useSiteSettings } from "@/hooks/use-site-settings";
import { LoadingState } from "@/components/shared/loading";
import { Seo } from "@/components/shared/seo";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { publicApi } from "@/lib/api";
import { cn } from "@/lib/utils";

export function ProjectDetailPage() {
  const { slug } = useParams();
  const { data: settings } = useSiteSettings();

  const { data, isLoading } = useQuery({
    queryKey: ["project", slug],
    queryFn: () => publicApi.getProjectBySlug(slug || ""),
    enabled: Boolean(slug),
  });

  if (isLoading || !data) {
    return <LoadingState />;
  }

  return (
    <>
      <Seo
        title={data.seo?.metaTitle || data.title}
        description={data.seo?.metaDescription || data.summary}
        keywords={data.seo?.metaKeywords || []}
        image={data.seo?.ogImageUrl || data.thumbnailUrl || undefined}
        canonical={data.seo?.canonicalUrl || undefined}
        settings={settings}
        path={`/projects/${data.slug}`}
      />
      <section className="container py-12">
        <Link to="/projects" className="text-sm text-muted-foreground hover:text-foreground">
          {"<-"} Back to projects
        </Link>
        <h1 className="mt-4 text-3xl font-semibold">{data.title}</h1>
        <p className="mt-3 max-w-3xl text-muted-foreground">{data.summary}</p>

        {data.thumbnailUrl ? (
          <img src={data.thumbnailUrl} alt={data.title} className="mt-6 h-72 w-full rounded-lg object-cover md:h-[420px]" />
        ) : null}

        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Project Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm leading-relaxed text-muted-foreground">{data.content}</p>
            <div className="flex flex-wrap gap-3">
              {data.viewLiveUrl ? (
                <a href={data.viewLiveUrl} target="_blank" rel="noreferrer" className={cn(buttonVariants({ variant: "default" }))}>
                  View Live
                  <ExternalLink className="h-4 w-4" />
                </a>
              ) : null}
              {data.demoUrl ? (
                <a href={data.demoUrl} target="_blank" rel="noreferrer" className={cn(buttonVariants({ variant: "outline" }))}>
                  Demo
                  <ExternalLink className="h-4 w-4" />
                </a>
              ) : null}
            </div>
          </CardContent>
        </Card>

        {(data.gallery || []).length > 0 ? (
          <div className="mt-8 grid gap-3 md:grid-cols-3">
            {(data.gallery || []).map((image, index) => (
              <img key={image + index} src={image} alt={`${data.title} screenshot ${index + 1}`} className="h-44 w-full rounded-lg object-cover" loading="lazy" />
            ))}
          </div>
        ) : null}
      </section>
    </>
  );
}
