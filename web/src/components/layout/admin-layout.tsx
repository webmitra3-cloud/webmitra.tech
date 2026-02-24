import {
  ArrowUpRight,
  BriefcaseBusiness,
  ClipboardList,
  FolderKanban,
  Handshake,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquareQuote,
  Settings,
  ShieldCheck,
  UserCog,
  Users,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useMemo, useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { useSiteSettings } from "@/hooks/use-site-settings";
import { Button, buttonVariants } from "@/components/ui/button";
import { adminNavItems } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/auth-context";

const navIconMap: Record<string, LucideIcon> = {
  "/admin": LayoutDashboard,
  "/admin/settings": Settings,
  "/admin/services": BriefcaseBusiness,
  "/admin/projects": FolderKanban,
  "/admin/team": Users,
  "/admin/board": ShieldCheck,
  "/admin/collaborations": Handshake,
  "/admin/pricing": ClipboardList,
  "/admin/testimonials": MessageSquareQuote,
  "/admin/inquiries": ClipboardList,
  "/admin/users": UserCog,
};

type AdminNavItem = {
  to: string;
  label: string;
};

function useAdminNavItems(isAdmin: boolean) {
  return useMemo(() => {
    const items: AdminNavItem[] = [...adminNavItems];
    if (isAdmin) items.push({ to: "/admin/users", label: "Users" });
    return items;
  }, [isAdmin]);
}

export function AdminLayout() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();
  const { data: settings } = useSiteSettings();

  const navItems = useAdminNavItems(user?.role === "ADMIN");
  const activeRoute =
    navItems.find((item) => location.pathname === item.to || location.pathname.startsWith(`${item.to}/`)) || navItems[0];

  const navContent = (
    <div className="space-y-4">
      <div className="rounded-2xl border border-border/70 bg-card/80 p-4 shadow-soft">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">CMS Panel</p>
        <p className="mt-1 text-sm font-semibold">{settings?.companyName || "WebMitra.Tech"}</p>
        <p className="mt-1 text-xs text-muted-foreground">Secure content management and publishing workflow</p>
      </div>

      <nav className="space-y-1.5">
        {navItems.map((item) => {
          const Icon = navIconMap[item.to] || LayoutDashboard;

          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/admin"}
              className={({ isActive }) =>
                cn(
                  "group flex items-center justify-between rounded-xl border border-transparent px-3 py-2.5 text-sm text-muted-foreground transition",
                  "hover:border-border/70 hover:bg-secondary/55 hover:text-foreground",
                  isActive && "border-primary/35 bg-primary/10 text-foreground shadow-soft",
                )
              }
              onClick={() => setOpen(false)}
            >
              <span className="inline-flex items-center gap-2.5">
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-border/70 bg-card/70 text-primary transition group-hover:border-primary/30">
                  <Icon className="h-4 w-4" />
                </span>
                {item.label}
              </span>
            </NavLink>
          );
        })}
      </nav>

      <div className="rounded-2xl border border-border/70 bg-card/80 p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Quick Access</p>
        <div className="mt-3 grid gap-2">
          <Link to="/" className={cn(buttonVariants({ variant: "outline", size: "sm" }), "justify-start")} onClick={() => setOpen(false)}>
            View Website <ArrowUpRight className="h-4 w-4" />
          </Link>
          <Link
            to="/contact"
            className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "justify-start")}
            onClick={() => setOpen(false)}
          >
            Open Contact Page
          </Link>
        </div>
      </div>
    </div>
  );

  return (
    <div className="admin-shell min-h-screen bg-background bg-grid-soft">
      <header className="sticky top-0 z-40 border-b border-border/70 bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card lg:hidden"
              aria-label="Toggle sidebar"
              onClick={() => setOpen((value) => !value)}
            >
              {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
            <Link to="/" className="hidden rounded-lg border border-border/70 bg-card px-2.5 py-1.5 text-xs font-semibold md:inline-block">
              WebMitra.Tech
            </Link>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">Admin</p>
              <p className="text-sm font-semibold">{activeRoute?.label || "Dashboard"}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <span className="hidden rounded-lg border border-border/70 bg-card px-2.5 py-1.5 text-xs text-muted-foreground sm:inline">
              {user?.name} ({user?.role})
            </span>
            <Button variant="outline" size="sm" onClick={logout}>
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="container grid gap-6 py-6 lg:grid-cols-[280px_minmax(0,1fr)]">
        <aside className="surface hidden h-fit p-4 lg:sticky lg:top-[88px] lg:block">{navContent}</aside>
        <section className="admin-content min-w-0 space-y-5">
          <Outlet />
        </section>
      </div>

      {open ? (
        <div className="fixed inset-0 z-50 bg-black/60 p-4 lg:hidden" onClick={() => setOpen(false)}>
          <aside className="surface h-[calc(100vh-2rem)] max-w-[320px] overflow-y-auto p-4 page-enter" onClick={(event) => event.stopPropagation()}>
            {navContent}
          </aside>
        </div>
      ) : null}
    </div>
  );
}
