import { PageHero } from "@/components/shared/page-hero";
import { Seo } from "@/components/shared/seo";
import { Card, CardContent } from "@/components/ui/card";
import { useSiteSettings } from "@/hooks/use-site-settings";

export function PrivacyPage() {
  const { data: settings } = useSiteSettings();
  return (
    <>
      <Seo title="Privacy Policy" description="Privacy policy for WebMitra.Tech website." settings={settings} path="/privacy" />
      <PageHero title="Privacy Policy" subtitle="How we collect and use submitted information." />
      <section className="container py-10">
        <Card>
          <CardContent className="space-y-4 pt-5 text-sm text-muted-foreground">
            <p>We collect contact details you submit through inquiry forms for communication and service delivery purposes.</p>
            <p>We do not sell personal information. Access is limited to authorized team members.</p>
            <p>We use basic security controls, validation, and monitoring to protect submitted data.</p>
            <p>If you want your inquiry data removed, contact us at {settings?.contact.email}.</p>
          </CardContent>
        </Card>
      </section>
    </>
  );
}
