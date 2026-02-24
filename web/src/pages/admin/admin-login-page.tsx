import { zodResolver } from "@hookform/resolvers/zod";
import { LockKeyhole, ShieldCheck, Sparkles } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { useNavigate, useLocation } from "react-router-dom";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

type FormValues = z.infer<typeof schema>;

export function AdminLoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname || "/admin";

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      await login(values.email, values.password);
      toast.success("Login successful");
      navigate(from, { replace: true });
    } catch {
      toast.error("Invalid email or password");
    }
  });

  return (
    <div className="relative min-h-screen bg-background bg-grid-soft p-4 md:p-6">
      <div className="absolute right-4 top-4 z-10">
        <ThemeToggle />
      </div>

      <div className="mx-auto grid min-h-[calc(100vh-2rem)] max-w-5xl items-center gap-4 lg:grid-cols-[1.05fr_0.95fr]">
        <section className="section-wrap bg-grid-soft hidden p-8 lg:block">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">WebMitra.Tech</p>
          <h1 className="mt-2 text-4xl font-semibold leading-tight">Admin Control Panel</h1>
          <p className="mt-3 max-w-xl text-muted-foreground">
            Manage services, projects, team members, pricing, testimonials, and inquiries from a single secure workspace.
          </p>

          <div className="mt-8 grid gap-3">
            <div className="surface p-4 text-sm text-muted-foreground">
              <p className="inline-flex items-center gap-2 font-medium text-foreground">
                <ShieldCheck className="h-4 w-4 text-primary" />
                Protected Access
              </p>
              <p className="mt-1">JWT + refresh cookies, CSRF validation, and role-based permissions.</p>
            </div>
            <div className="surface p-4 text-sm text-muted-foreground">
              <p className="inline-flex items-center gap-2 font-medium text-foreground">
                <Sparkles className="h-4 w-4 text-primary" />
                Fast Content Workflow
              </p>
              <p className="mt-1">Update public content instantly and keep your website synchronized.</p>
            </div>
          </div>
        </section>

        <Card className="w-full border-border/70 bg-card/88">
          <CardHeader>
            <CardTitle className="inline-flex items-center gap-2">
              <LockKeyhole className="h-5 w-5 text-primary" />
              Admin Login
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={onSubmit} className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" {...form.register("email")} />
                {form.formState.errors.email ? <p className="mt-1 text-xs text-destructive">{form.formState.errors.email.message}</p> : null}
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" {...form.register("password")} />
                {form.formState.errors.password ? <p className="mt-1 text-xs text-destructive">{form.formState.errors.password.message}</p> : null}
              </div>
              <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Signing in..." : "Sign In"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
