import { Link } from "react-router-dom";
import { MessageCircleMore, Phone } from "lucide-react";
import { useSiteSettings } from "@/hooks/use-site-settings";

export function MobileQuickActions() {
  const { data: settings } = useSiteSettings();

  const whatsapp = settings?.socials.whatsapp;
  const phone = settings?.contact.phone;

  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-background/95 p-3 backdrop-blur md:hidden">
      <div className="mx-auto flex max-w-xl gap-2">
        <Link
          to="/contact"
          className="flex h-10 flex-1 items-center justify-center gap-2 rounded-md bg-primary text-sm font-semibold text-primary-foreground"
        >
          <MessageCircleMore className="h-4 w-4" />
          Contact
        </Link>
        {whatsapp ? (
          <a
            href={`https://wa.me/${whatsapp}`}
            target="_blank"
            rel="noreferrer"
            className="flex h-10 flex-1 items-center justify-center gap-2 rounded-md bg-brand-orange text-sm font-semibold text-white"
          >
            <MessageCircleMore className="h-4 w-4" />
            WhatsApp
          </a>
        ) : null}
        {phone ? (
          <a
            href={`tel:${phone.replace(/\s+/g, "")}`}
            className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-border bg-card"
            aria-label="Call now"
          >
            <Phone className="h-4 w-4 text-primary" />
          </a>
        ) : null}
      </div>
    </div>
  );
}
