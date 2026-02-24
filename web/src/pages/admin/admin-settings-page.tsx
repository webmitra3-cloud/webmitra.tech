import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { ImageUploadField } from "@/components/shared/image-upload-field";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { adminApi } from "@/lib/api";
import { defaultSettings } from "@/lib/constants";
import { queryClient } from "@/lib/query-client";
import { SiteSettings } from "@/types";

type SettingsForm = SiteSettings & {
  valuesCsv: string;
  headerBadgesCsv: string;
  footerCapabilitiesCsv: string;
};

export function AdminSettingsPage() {
  const form = useForm<SettingsForm>({
    defaultValues: {
      ...defaultSettings,
      valuesCsv: defaultSettings.values.join(", "),
      headerBadgesCsv: defaultSettings.header.badges.join(", "),
      footerCapabilitiesCsv: defaultSettings.footer.capabilities.join(", "),
    },
  });

  const settingsQuery = useQuery({
    queryKey: ["admin-settings"],
    queryFn: adminApi.getSettings,
  });

  useEffect(() => {
    if (settingsQuery.data) {
      const data = settingsQuery.data;
      form.reset({
        ...defaultSettings,
        ...data,
        valuesCsv: (data.values || []).join(", "),
        headerBadgesCsv: (data.header?.badges || defaultSettings.header.badges).join(", "),
        footerCapabilitiesCsv: (data.footer?.capabilities || defaultSettings.footer.capabilities).join(", "),
      });
    }
  }, [settingsQuery.data]);

  const mutation = useMutation({
    mutationFn: (payload: SettingsForm) =>
      adminApi.updateSettings({
        ...payload,
        values: payload.valuesCsv
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
        header: {
          ...payload.header,
          badges: payload.headerBadgesCsv
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean),
        },
        footer: {
          ...payload.footer,
          capabilities: payload.footerCapabilitiesCsv
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean),
        },
      }),
    onSuccess: () => {
      toast.success("Settings updated");
      queryClient.invalidateQueries({ queryKey: ["site-settings"] });
      queryClient.invalidateQueries({ queryKey: ["homepage"] });
      queryClient.invalidateQueries({ queryKey: ["admin-settings"] });
    },
    onError: () => toast.error("Failed to update settings"),
  });

  const onSubmit = form.handleSubmit((values) => mutation.mutate(values));

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Site Settings</h1>

      <Card>
        <CardHeader>
          <CardTitle>Company Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={onSubmit}>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="companyName">Company Name</Label>
                <Input id="companyName" {...form.register("companyName")} />
              </div>
              <div>
                <Label htmlFor="tagline">Tagline</Label>
                <Input id="tagline" {...form.register("tagline")} />
              </div>
            </div>

            <div>
              <Label htmlFor="shortIntro">Short Intro</Label>
              <Textarea id="shortIntro" {...form.register("shortIntro")} />
            </div>

            <div>
              <Label htmlFor="longDescription">Long Description</Label>
              <Textarea id="longDescription" {...form.register("longDescription")} />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="mission">Mission</Label>
                <Textarea id="mission" {...form.register("mission")} />
              </div>
              <div>
                <Label htmlFor="vision">Vision</Label>
                <Textarea id="vision" {...form.register("vision")} />
              </div>
            </div>

            <div>
              <Label htmlFor="valuesCsv">Values (comma separated)</Label>
              <Input id="valuesCsv" {...form.register("valuesCsv")} />
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <Label htmlFor="projectsDelivered">Projects Delivered</Label>
                <Input id="projectsDelivered" type="number" {...form.register("stats.projectsDelivered", { valueAsNumber: true })} />
              </div>
              <div>
                <Label htmlFor="clients">Clients</Label>
                <Input id="clients" type="number" {...form.register("stats.clients", { valueAsNumber: true })} />
              </div>
              <div>
                <Label htmlFor="years">Years</Label>
                <Input id="years" type="number" {...form.register("stats.years", { valueAsNumber: true })} />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="contactPhone">Phone</Label>
                <Input id="contactPhone" {...form.register("contact.phone")} />
              </div>
              <div>
                <Label htmlFor="contactEmail">Email</Label>
                <Input id="contactEmail" {...form.register("contact.email")} />
              </div>
            </div>
            <div>
              <Label htmlFor="contactAddress">Address</Label>
              <Input id="contactAddress" {...form.register("contact.address")} />
            </div>
            <div>
              <Label htmlFor="officeHours">Office Hours</Label>
              <Input id="officeHours" {...form.register("contact.officeHours")} />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="socialFacebook">Facebook URL</Label>
                <Input id="socialFacebook" {...form.register("socials.facebook")} />
              </div>
              <div>
                <Label htmlFor="socialInstagram">Instagram URL</Label>
                <Input id="socialInstagram" {...form.register("socials.instagram")} />
              </div>
              <div>
                <Label htmlFor="socialTiktok">TikTok URL</Label>
                <Input id="socialTiktok" {...form.register("socials.tiktok")} />
              </div>
              <div>
                <Label htmlFor="socialLinkedin">LinkedIn URL</Label>
                <Input id="socialLinkedin" {...form.register("socials.linkedin")} />
              </div>
              <div>
                <Label htmlFor="socialWhatsapp">WhatsApp Number</Label>
                <Input id="socialWhatsapp" {...form.register("socials.whatsapp")} />
              </div>
              <div>
                <Label htmlFor="socialEmail">Social Email</Label>
                <Input id="socialEmail" {...form.register("socials.email")} />
              </div>
            </div>

            <div className="space-y-4 rounded-xl border border-border/70 p-4">
              <div>
                <h3 className="text-base font-semibold">Header Content</h3>
                <p className="text-sm text-muted-foreground">These values control the top strip and primary navbar CTAs.</p>
              </div>

              <div>
                <Label htmlFor="headerTopNotice">Top Notice Text</Label>
                <Input id="headerTopNotice" {...form.register("header.topNotice")} />
              </div>

              <div>
                <Label htmlFor="headerBadgesCsv">Top Badges (comma separated)</Label>
                <Input id="headerBadgesCsv" {...form.register("headerBadgesCsv")} />
              </div>

              <div>
                <Label htmlFor="headerLogoSubtext">Logo Subtext</Label>
                <Input id="headerLogoSubtext" {...form.register("header.logoSubtext")} />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="headerSecondaryCtaLabel">Secondary CTA Label</Label>
                  <Input id="headerSecondaryCtaLabel" {...form.register("header.secondaryCtaLabel")} />
                </div>
                <div>
                  <Label htmlFor="headerPrimaryCtaLabel">Primary CTA Label</Label>
                  <Input id="headerPrimaryCtaLabel" {...form.register("header.primaryCtaLabel")} />
                </div>
              </div>
            </div>

            <div className="space-y-4 rounded-xl border border-border/70 p-4">
              <div>
                <h3 className="text-base font-semibold">Footer Content</h3>
                <p className="text-sm text-muted-foreground">Edit all footer headings, texts, labels, and capability list from here.</p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="footerLocationLabel">Location Label</Label>
                  <Input id="footerLocationLabel" {...form.register("footer.locationLabel")} />
                </div>
                <div>
                  <Label htmlFor="footerTagline">Footer Tagline</Label>
                  <Input id="footerTagline" {...form.register("footer.tagline")} />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="footerProjectCtaLabel">Project CTA Label</Label>
                  <Input id="footerProjectCtaLabel" {...form.register("footer.projectCtaLabel")} />
                </div>
                <div>
                  <Label htmlFor="footerProjectCtaSubtext">Project CTA Subtext</Label>
                  <Input id="footerProjectCtaSubtext" {...form.register("footer.projectCtaSubtext")} />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <Label htmlFor="footerQuoteButtonLabel">Quote Button Label</Label>
                  <Input id="footerQuoteButtonLabel" {...form.register("footer.quoteButtonLabel")} />
                </div>
                <div>
                  <Label htmlFor="footerEmailButtonLabel">Email Button Label</Label>
                  <Input id="footerEmailButtonLabel" {...form.register("footer.emailButtonLabel")} />
                </div>
                <div>
                  <Label htmlFor="footerCallButtonLabel">Call Button Label</Label>
                  <Input id="footerCallButtonLabel" {...form.register("footer.callButtonLabel")} />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="footerOfficeTitle">Office Section Title</Label>
                  <Input id="footerOfficeTitle" {...form.register("footer.officeTitle")} />
                </div>
                <div>
                  <Label htmlFor="footerCapabilitiesTitle">Capabilities Section Title</Label>
                  <Input id="footerCapabilitiesTitle" {...form.register("footer.capabilitiesTitle")} />
                </div>
              </div>

              <div>
                <Label htmlFor="footerCapabilitiesCsv">Capabilities (comma separated)</Label>
                <Input id="footerCapabilitiesCsv" {...form.register("footerCapabilitiesCsv")} />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="footerDirectContactTitle">Direct Contact Section Title</Label>
                  <Input id="footerDirectContactTitle" {...form.register("footer.directContactTitle")} />
                </div>
                <div>
                  <Label htmlFor="footerConnectTitle">Connect Section Title</Label>
                  <Input id="footerConnectTitle" {...form.register("footer.connectTitle")} />
                </div>
              </div>

              <div>
                <Label htmlFor="footerConnectText">Connect Description</Label>
                <Input id="footerConnectText" {...form.register("footer.connectText")} />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="footerDiscussLabel">Discuss Link Label</Label>
                  <Input id="footerDiscussLabel" {...form.register("footer.discussLabel")} />
                </div>
                <div>
                  <Label htmlFor="footerBottomNote">Bottom Note</Label>
                  <Input id="footerBottomNote" {...form.register("footer.bottomNote")} />
                </div>
              </div>
            </div>

            <ImageUploadField label="Logo URL" value={form.watch("logoUrl") || ""} onChange={(url) => form.setValue("logoUrl", url)} folder="logo" />
            <ImageUploadField
              label="Homepage Banner URL"
              value={form.watch("homepageBannerUrl") || ""}
              onChange={(url) => form.setValue("homepageBannerUrl", url)}
              folder="banner"
            />
            <p className="text-xs text-muted-foreground">
              Tip: Upload a high-quality landscape image. Use the <strong>Remove</strong> button anytime to clear banner and add another later.
            </p>

            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? "Saving..." : "Save Settings"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
