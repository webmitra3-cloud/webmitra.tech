import { BriefcaseBusiness, Menu, PhoneCall, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { buttonVariants } from "@/components/ui/button";
import { useSiteSettings } from "@/hooks/use-site-settings";
import { publicNavItems } from "@/lib/constants";
import { getLogoDisplayUrl } from "@/lib/media";
import { cn } from "@/lib/utils";

export function PublicHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { data: settings } = useSiteSettings();
  const companyName = settings?.companyName || "WebMitra.Tech";
  const locationLabel = settings?.footer.locationLabel || "Butwal, Nepal";

  const headerTopNotice = settings?.header.topNotice?.trim() || `${companyName} | ${locationLabel}`;
  const headerBadges = settings?.header.badges?.filter(Boolean).slice(0, 4) || ["Web Development", "Social Growth", "SEO Support"];
  const headerLogoSubtext = settings?.header.logoSubtext?.trim() || "Build | Market | Scale";
  const primaryCtaLabel = settings?.header.primaryCtaLabel?.trim() || "Get a Quote";
  const secondaryCtaLabel = settings?.header.secondaryCtaLabel?.trim() || "Case Studies";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 6);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  const supportText = useMemo(() => {
    const email = settings?.contact.email?.trim();
    const phone = settings?.contact.phone?.trim();

    if (email && phone) return `${email} | ${phone}`;
    if (email) return email;
    if (phone) return phone;
    return "webmitra3@gmail.com";
  }, [settings?.contact.email, settings?.contact.phone]);

  const logoUrl = getLogoDisplayUrl(settings?.logoUrl || "");

  return (
    <header className={cn("sticky top-0 z-40 bg-background/90 backdrop-blur-xl", scrolled ? "border-b border-border/70 shadow-soft" : "")}>
      <div className="hidden border-b border-border/60 bg-secondary/45 lg:block">
        <div className="container flex h-9 items-center justify-between text-xs text-muted-foreground">
          <div className="inline-flex items-center gap-3">
            <span className="inline-block h-2 w-2 rounded-full bg-brand-orange" />
            <span className="font-medium text-foreground/85">{headerTopNotice}</span>
            {headerBadges.length ? <span className="hidden h-3.5 w-px bg-border/80 xl:inline-block" /> : null}
            {headerBadges.map((badge) => (
              <span key={badge} className="hidden rounded-full border border-border/70 bg-card/80 px-2 py-0.5 xl:inline-block">
                {badge}
              </span>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <p className="max-w-[280px] truncate font-medium xl:max-w-[360px]">{supportText}</p>
            <div className="flex items-center gap-1" aria-hidden="true">
              <span className="h-1 w-5 rounded-full bg-primary/70" />
              <span className="h-1 w-3 rounded-full bg-brand-orange/80" />
              <span className="h-1 w-2 rounded-full bg-primary/35" />
            </div>
          </div>
        </div>
      </div>

      <div className="container py-2.5">
        <div
          className={cn(
            "flex items-center justify-between gap-4 rounded-2xl border border-border/70 bg-card/90 px-3 transition-all sm:px-4",
            scrolled ? "h-14 shadow-soft" : "h-16",
          )}
        >
          <Link to="/" className="flex items-center gap-3" aria-label="Go to homepage">
            {logoUrl ? (
              <div className="flex h-10 items-center rounded-lg border border-border/80 bg-card px-2 shadow-soft">
                <img
                  src={logoUrl}
                  alt={`${companyName} logo`}
                  className="h-7 w-auto max-w-[120px] object-contain mix-blend-multiply dark:mix-blend-screen"
                  loading="lazy"
                  onError={(event) => {
                    event.currentTarget.onerror = null;
                    if (settings?.logoUrl) event.currentTarget.src = settings.logoUrl;
                  }}
                />
              </div>
            ) : (
              <div className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-border/80 bg-card font-bold shadow-soft">
                <span className="text-brand-blue">W</span>
                <span className="text-brand-orange">M</span>
              </div>
            )}
            <div className="leading-tight">
              <p className="text-sm font-semibold">{companyName}</p>
              <p className="hidden text-xs text-muted-foreground sm:block">{headerLogoSubtext}</p>
            </div>
          </Link>

          <nav className="hidden items-center gap-1 rounded-xl border border-border/70 bg-background/90 p-1 lg:flex">
            {publicNavItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    "relative rounded-lg px-3 py-1.5 text-sm font-medium text-muted-foreground transition hover:bg-secondary hover:text-foreground",
                    isActive && "bg-secondary text-foreground shadow-soft before:absolute before:inset-x-3 before:-bottom-1 before:h-0.5 before:rounded-full before:bg-primary",
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="hidden items-center gap-2 lg:flex">
            <Link to="/projects" className={cn(buttonVariants({ variant: "outline", size: "sm" }))}>
              <BriefcaseBusiness className="h-4 w-4" />
              {secondaryCtaLabel}
            </Link>
            <ThemeToggle />
            <Link to="/contact" className={cn(buttonVariants({ variant: "brand", size: "sm" }))}>
              {primaryCtaLabel}
            </Link>
          </div>

          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border/70 bg-card lg:hidden"
            onClick={() => setOpen((value) => !value)}
            aria-label={open ? "Close menu" : "Open menu"}
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {open ? (
        <div className="border-t border-border/70 bg-background lg:hidden">
          <div className="container space-y-3 py-4">
            <div className="rounded-2xl border border-border/70 bg-card/85 p-3 text-xs text-muted-foreground">
              <p className="inline-flex items-center gap-2">
                <PhoneCall className="h-3.5 w-3.5 text-primary" />
                {settings?.contact.phone || "+977 9869672736"}
              </p>
            </div>
            <nav className="grid gap-2 rounded-2xl border border-border/70 bg-card/85 p-3 sm:grid-cols-2">
              {publicNavItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    cn(
                      "rounded-lg px-3 py-2 text-sm text-muted-foreground transition hover:bg-secondary",
                      isActive && "bg-secondary font-medium text-foreground",
                    )
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <Link to="/contact" className={cn(buttonVariants({ variant: "brand" }), "flex-1")}>
                {primaryCtaLabel}
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
