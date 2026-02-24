import { ArrowUpRight, CheckCircle2, Clock3, Mail, MapPin, Phone, type LucideIcon } from "lucide-react";
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaTiktok, FaWhatsapp } from "react-icons/fa6";
import type { IconType } from "react-icons";
import { Link } from "react-router-dom";
import { buttonVariants } from "@/components/ui/button";
import { useSiteSettings } from "@/hooks/use-site-settings";
import { getLogoDisplayUrl } from "@/lib/media";
import { cn } from "@/lib/utils";
import {
  footerOfficeItems,
  footerSocialItems,
  type OfficeItemKey,
  type SocialItemKey,
} from "./footer-data";

const officeIconMap: Record<OfficeItemKey, LucideIcon> = {
  address: MapPin,
  phone: Phone,
  email: Mail,
  hours: Clock3,
};

const socialIconMap: Record<SocialItemKey, IconType> = {
  facebook: FaFacebookF,
  instagram: FaInstagram,
  linkedin: FaLinkedinIn,
  whatsapp: FaWhatsapp,
  tiktok: FaTiktok,
};

export function PublicFooter() {
  const { data: settings } = useSiteSettings();

  const companyName = settings?.companyName || "WebMitra.Tech";
  const footer = settings?.footer;
  const tagline = footer?.tagline || settings?.tagline || "Digital growth partner for modern businesses";
  const locationLabel = footer?.locationLabel || "Butwal, Nepal";
  const projectCtaLabel = footer?.projectCtaLabel || "START A PROJECT";
  const projectCtaSubtext = footer?.projectCtaSubtext || "Share your scope and get a clear execution plan.";
  const quoteButtonLabel = footer?.quoteButtonLabel || "Get a Quote";
  const emailButtonLabel = footer?.emailButtonLabel || "Email";
  const callButtonLabel = footer?.callButtonLabel || "Call";
  const officeTitle = footer?.officeTitle || "Office";
  const capabilitiesTitle = footer?.capabilitiesTitle || "Capabilities";
  const capabilities = footer?.capabilities?.filter(Boolean) || [];
  const directContactTitle = footer?.directContactTitle || "Direct Contact";
  const connectTitle = footer?.connectTitle || "Connect";
  const connectText = footer?.connectText || "Follow us for updates, collaborations, and insights.";
  const discussLabel = footer?.discussLabel || "Discuss your project";
  const bottomNote = footer?.bottomNote || "Built for speed, accessibility, and long-term growth";

  const address = settings?.contact.address || "Traffic Chowk, Butwal, Nepal";
  const phone = settings?.contact.phone || "+977 9869672736";
  const email = settings?.contact.email || "webmitra3@gmail.com";
  const officeHours = settings?.contact.officeHours || "Sun-Fri, 9:00 AM - 6:00 PM";

  const phoneLink = phone.replace(/[^\d+]/g, "");
  const whatsappNumber = settings?.socials.whatsapp?.replace(/[^\d]/g, "") || "";
  const whatsappLink = whatsappNumber ? `https://wa.me/${whatsappNumber}` : "";
  const logoUrl = getLogoDisplayUrl(settings?.logoUrl || "");

  const officeValueMap: Record<OfficeItemKey, string> = {
    address,
    phone,
    email,
    hours: officeHours,
  };

  const officeHrefMap: Partial<Record<OfficeItemKey, string>> = {
    phone: `tel:${phoneLink}`,
    email: `mailto:${email}`,
  };

  const socialHrefMap: Record<SocialItemKey, string> = {
    facebook: settings?.socials.facebook || "",
    instagram: settings?.socials.instagram || "",
    linkedin: settings?.socials.linkedin || "",
    whatsapp: whatsappLink,
    tiktok: settings?.socials.tiktok || "",
  };

  return (
    <footer className="border-t border-border/70 bg-slate-50/90 dark:bg-slate-950/95">
      <div className="container py-10 md:py-12">
        <div className="rounded-3xl border border-border/70 bg-white/90 shadow-soft backdrop-blur-sm dark:bg-slate-900/85">
          <div className="grid gap-8 p-6 sm:p-8 md:grid-cols-2 xl:grid-cols-4">
            <section>
              <div className="flex items-start gap-3 sm:gap-4">
                {logoUrl ? (
                  <img
                    src={logoUrl}
                    alt={`${companyName} logo`}
                    className="h-11 w-auto max-w-[120px] shrink-0 object-contain sm:max-w-[185px]"
                    loading="lazy"
                    onError={(event) => {
                      event.currentTarget.onerror = null;
                      if (settings?.logoUrl) event.currentTarget.src = settings.logoUrl;
                    }}
                  />
                ) : (
                  <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-sm font-semibold text-primary-foreground">
                    WM
                  </div>
                )}
                <div className="flex-1">
                  <p className="break-words text-lg font-semibold leading-tight text-foreground">{companyName}</p>
                  <p className="mt-0.5 text-sm text-muted-foreground">{locationLabel}</p>
                </div>
              </div>

              <p className="mt-3 text-sm text-muted-foreground">{tagline}</p>

              <p className="mt-4 text-xs font-semibold uppercase tracking-[0.16em] text-primary">{projectCtaLabel}</p>
              <p className="mt-1.5 text-sm text-muted-foreground">{projectCtaSubtext}</p>

              <div className="mt-4 flex flex-wrap gap-2">
                <Link to="/contact" className={cn(buttonVariants({ variant: "brand", size: "sm" }), "rounded-full px-4") }>
                  <ArrowUpRight className="h-4 w-4" />
                  {quoteButtonLabel}
                </Link>
                <a
                  href={`mailto:${email}`}
                  className={cn(buttonVariants({ variant: "outline", size: "sm" }), "rounded-full px-4")}
                >
                  <Mail className="h-4 w-4" />
                  {emailButtonLabel}
                </a>
                <a
                  href={`tel:${phoneLink}`}
                  className={cn(buttonVariants({ variant: "outline", size: "sm" }), "rounded-full px-4")}
                >
                  <Phone className="h-4 w-4" />
                  {callButtonLabel}
                </a>
              </div>
            </section>

            <section>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">{officeTitle}</p>
              <ul className="mt-3 space-y-2.5">
                {footerOfficeItems.map((item) => {
                  const Icon = officeIconMap[item.key];
                  const value = officeValueMap[item.key];
                  const href = officeHrefMap[item.key];

                  return (
                    <li key={item.key} className="inline-flex items-start gap-2.5 text-sm text-muted-foreground">
                      <span className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-secondary text-primary">
                        <Icon className="h-4 w-4" />
                      </span>
                      {href ? (
                        <a href={href} className="leading-relaxed font-medium text-foreground transition hover:text-primary">
                          {value}
                        </a>
                      ) : (
                        <span className="leading-relaxed">{value}</span>
                      )}
                    </li>
                  );
                })}
              </ul>
            </section>

            <section>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">{capabilitiesTitle}</p>
              <ul className="mt-3 space-y-2">
                {capabilities.map((item) => (
                  <li key={item} className="inline-flex items-start gap-2 text-sm text-muted-foreground">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    {item}
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">{directContactTitle}</p>
              <div className="mt-3 space-y-2 text-sm">
                <a href={`mailto:${email}`} className="inline-flex items-center gap-2 text-muted-foreground transition hover:text-foreground">
                  <Mail className="h-4 w-4 text-primary" />
                  {email}
                </a>
                <a href={`tel:${phoneLink}`} className="inline-flex items-center gap-2 text-muted-foreground transition hover:text-foreground">
                  <Phone className="h-4 w-4 text-primary" />
                  {phone}
                </a>
              </div>

              <Link
                to="/contact"
                className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-primary transition hover:text-primary/80"
              >
                {discussLabel}
                <ArrowUpRight className="h-4 w-4" />
              </Link>

              <div className="mt-6">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">{connectTitle}</p>
                <p className="mt-2 text-sm text-muted-foreground">{connectText}</p>

                <div className="mt-3 flex flex-wrap gap-2">
                  {footerSocialItems.map((item) => {
                    const href = socialHrefMap[item.key];
                    if (!href) return null;
                    const Icon = socialIconMap[item.key];

                    return (
                      <a
                        key={item.key}
                        href={href}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={item.label}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border/70 text-muted-foreground transition hover:border-primary/40 hover:bg-secondary/55 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        <Icon className="h-4 w-4" />
                        <span className="sr-only">{item.label}</span>
                      </a>
                    );
                  })}
                </div>
              </div>
            </section>
          </div>

          <div className="border-t border-border/70 bg-slate-100/80 px-6 py-3 text-xs text-muted-foreground dark:bg-slate-900/95 sm:flex sm:items-center sm:justify-between sm:text-sm">
            <p>(c) {new Date().getFullYear()} {companyName}. All rights reserved.</p>
            <p>{bottomNote}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
