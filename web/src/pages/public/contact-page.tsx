import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Clock3, Mail, MapPin, MessageCircle, PhoneCall } from "lucide-react";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { PageHero } from "@/components/shared/page-hero";
import { Reveal } from "@/components/shared/reveal";
import { Seo } from "@/components/shared/seo";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useSiteSettings } from "@/hooks/use-site-settings";
import { publicApi } from "@/lib/api";
import { cn } from "@/lib/utils";

const contactSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email required"),
  phone: z.string().optional(),
  subject: z.string().min(3, "Subject is required"),
  message: z.string().min(10, "Message must be at least 10 characters"),
  company: z.string().optional().default(""),
});

const responseSteps = [
  "We review your inquiry and business goals.",
  "We send a practical scope and timeline suggestion.",
  "We align deliverables and start implementation.",
];

type ContactFormValues = z.infer<typeof contactSchema>;

export function ContactPage() {
  const { data: settings } = useSiteSettings();
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
      company: "",
    },
  });

  const whatsappLink = useMemo(() => {
    const raw = settings?.socials.whatsapp || "";
    const normalized = raw.replace(/[^\d]/g, "");
    if (!normalized) return "";
    return `https://wa.me/${normalized}`;
  }, [settings?.socials.whatsapp]);

  const mutation = useMutation({
    mutationFn: (payload: ContactFormValues) => publicApi.submitInquiry(payload as Record<string, string>),
    onSuccess: () => {
      toast.success("Message sent successfully.");
      form.reset();
    },
    onError: (error: unknown) => {
      const message = error instanceof Error ? error.message : "Failed to send message";
      toast.error(message);
    },
  });

  const onSubmit = form.handleSubmit((values) => mutation.mutate(values));

  return (
    <>
      <Seo title="Contact" description="Get in touch with WebMitra.Tech." settings={settings} path="/contact" />
      <PageHero title="Contact Us" subtitle="Share your goals and we will send a practical execution roadmap with scope and timeline." />

      <section className="container py-10 md:py-12">
        <div className="grid items-start gap-6 lg:grid-cols-[0.92fr_1.08fr]">
          <Reveal className="space-y-4">
            <div className="section-wrap bg-grid-soft p-5 sm:p-7">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Direct Communication</p>
              <h2 className="mt-2 text-2xl font-semibold sm:text-3xl">Reach WebMitra.Tech</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Choose the channel that works best for you. We typically respond quickly during office hours.
              </p>

              <div className="mt-5 space-y-3 text-sm">
                <div className="rounded-xl border border-border/70 bg-card/85 p-4">
                  <p className="inline-flex items-center gap-2 font-medium text-foreground">
                    <PhoneCall className="h-4 w-4 text-primary" /> Phone
                  </p>
                  <p className="mt-1 text-muted-foreground">{settings?.contact.phone}</p>
                </div>
                <div className="rounded-xl border border-border/70 bg-card/85 p-4">
                  <p className="inline-flex items-center gap-2 font-medium text-foreground">
                    <Mail className="h-4 w-4 text-primary" /> Email
                  </p>
                  <p className="mt-1 text-muted-foreground">{settings?.contact.email}</p>
                </div>
                <div className="rounded-xl border border-border/70 bg-card/85 p-4">
                  <p className="inline-flex items-center gap-2 font-medium text-foreground">
                    <MapPin className="h-4 w-4 text-primary" /> Address
                  </p>
                  <p className="mt-1 text-muted-foreground">{settings?.contact.address}</p>
                </div>
                <div className="rounded-xl border border-border/70 bg-card/85 p-4">
                  <p className="inline-flex items-center gap-2 font-medium text-foreground">
                    <Clock3 className="h-4 w-4 text-primary" /> Office Hours
                  </p>
                  <p className="mt-1 text-muted-foreground">{settings?.contact.officeHours || "Please contact for availability."}</p>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                {settings?.contact.phone ? (
                  <a href={`tel:${settings.contact.phone.replace(/\s+/g, "")}`} className={cn(buttonVariants({ variant: "outline", size: "sm" }))}>
                    Call Now
                  </a>
                ) : null}
                {settings?.contact.email ? (
                  <a href={`mailto:${settings.contact.email}`} className={cn(buttonVariants({ variant: "outline", size: "sm" }))}>
                    Email Us
                  </a>
                ) : null}
                {whatsappLink ? (
                  <a href={whatsappLink} target="_blank" rel="noreferrer" className={cn(buttonVariants({ variant: "default", size: "sm" }))}>
                    <MessageCircle className="h-4 w-4" />
                    WhatsApp
                  </a>
                ) : null}
              </div>
            </div>

            <Card className="border-border/70">
              <CardHeader>
                <CardTitle>What happens after submission?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                {responseSteps.map((step, index) => (
                  <p key={step} className="flex gap-2">
                    <span className="font-semibold text-primary">{String(index + 1).padStart(2, "0")}.</span>
                    {step}
                  </p>
                ))}
              </CardContent>
            </Card>
          </Reveal>

          <Reveal delayMs={40}>
            <Card className="border-border/70">
              <CardHeader>
                <CardTitle>Send Inquiry</CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-4" onSubmit={onSubmit}>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <Label htmlFor="name">Name</Label>
                      <Input id="name" {...form.register("name")} aria-invalid={Boolean(form.formState.errors.name)} />
                      {form.formState.errors.name ? <p className="mt-1 text-xs text-destructive">{form.formState.errors.name.message}</p> : null}
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" {...form.register("email")} aria-invalid={Boolean(form.formState.errors.email)} />
                      {form.formState.errors.email ? <p className="mt-1 text-xs text-destructive">{form.formState.errors.email.message}</p> : null}
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <Label htmlFor="phone">Phone (optional)</Label>
                      <Input id="phone" {...form.register("phone")} />
                    </div>
                    <div>
                      <Label htmlFor="subject">Subject</Label>
                      <Input id="subject" {...form.register("subject")} aria-invalid={Boolean(form.formState.errors.subject)} />
                      {form.formState.errors.subject ? <p className="mt-1 text-xs text-destructive">{form.formState.errors.subject.message}</p> : null}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="message">Message</Label>
                    <Textarea id="message" {...form.register("message")} aria-invalid={Boolean(form.formState.errors.message)} className="min-h-[160px]" />
                    {form.formState.errors.message ? <p className="mt-1 text-xs text-destructive">{form.formState.errors.message.message}</p> : null}
                  </div>

                  <input type="text" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" {...form.register("company")} />

                  <Button type="submit" disabled={mutation.isPending} className="w-full sm:w-auto">
                    {mutation.isPending ? "Sending..." : "Submit Inquiry"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </Reveal>
        </div>
      </section>
    </>
  );
}
