import { useQuery } from "@tanstack/react-query";
import { ArrowRight, FolderKanban, MailOpen, ShieldCheck, Users, Wrench } from "lucide-react";
import { Link } from "react-router-dom";
import { adminApi } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { cn, formatDate } from "@/lib/utils";

const statCards = [
  { key: "services", label: "Services", icon: Wrench },
  { key: "projects", label: "Projects", icon: FolderKanban },
  { key: "inquiries", label: "Inquiries", icon: MailOpen },
  { key: "users", label: "Users", icon: Users },
] as const;

export function AdminDashboardPage() {
  const { data } = useQuery({
    queryKey: ["admin-dashboard"],
    queryFn: adminApi.getDashboard,
  });

  const totals = data?.totals;

  return (
    <div className="space-y-6">
      <section className="section-wrap bg-grid-soft p-5 sm:p-7">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Overview</p>
        <h1 className="mt-2 text-2xl font-semibold sm:text-3xl">Admin Dashboard</h1>
        <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
          Monitor content status, recent inquiries, and publishing activity from one place.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {statCards.map((item) => (
          <Card key={item.key} className="border-border/70 bg-card/80">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">{item.label}</CardTitle>
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border/70 bg-secondary/65 text-primary">
                  <item.icon className="h-4 w-4" />
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold">{totals?.[item.key] ?? 0}</p>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="border-border/70 bg-card/80">
          <CardHeader>
            <div className="flex items-center justify-between gap-3">
              <CardTitle>Recent Inquiries</CardTitle>
              <Link to="/admin/inquiries" className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground">
                View all <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data?.latestInquiries.map((item) => (
                <div key={item._id} className="rounded-xl border border-border/70 bg-background/65 p-3 text-sm">
                  <p className="font-medium">{item.subject}</p>
                  <p className="mt-0.5 text-muted-foreground">
                    {item.name} ({item.email}) • {formatDate(item.createdAt)}
                  </p>
                </div>
              ))}
              {!data?.latestInquiries.length ? <p className="text-sm text-muted-foreground">No inquiries yet.</p> : null}
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/70 bg-card/80">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link to="/admin/settings" className={cn(buttonVariants({ variant: "outline" }), "w-full justify-start")}>
              Update company profile
            </Link>
            <Link to="/admin/projects" className={cn(buttonVariants({ variant: "outline" }), "w-full justify-start")}>
              Add a new project
            </Link>
            <Link to="/admin/services" className={cn(buttonVariants({ variant: "outline" }), "w-full justify-start")}>
              Manage services
            </Link>
            <Link to="/admin/pricing" className={cn(buttonVariants({ variant: "outline" }), "w-full justify-start")}>
              Update pricing plans
            </Link>
            <div className="mt-4 rounded-xl border border-border/70 bg-secondary/45 p-3 text-sm text-muted-foreground">
              <p className="inline-flex items-center gap-2 font-medium text-foreground">
                <ShieldCheck className="h-4 w-4 text-primary" />
                Security Note
              </p>
              <p className="mt-1">Only authenticated admins/editors can access CMS routes. Sensitive writes require CSRF token validation.</p>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
