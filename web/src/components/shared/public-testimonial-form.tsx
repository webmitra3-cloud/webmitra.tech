import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { queryClient } from "@/lib/query-client";
import { publicApi } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const testimonialFeedbackSchema = z.object({
  name: z.string().min(2, "Name is required").max(80, "Name is too long"),
  roleCompany: z.string().max(120, "Role/company is too long").optional(),
  message: z.string().min(10, "Feedback must be at least 10 characters").max(1200, "Feedback is too long"),
  rating: z.coerce.number().int().min(1).max(5).optional(),
  honeypot: z.string().optional().default(""),
});

type TestimonialFeedbackValues = z.infer<typeof testimonialFeedbackSchema>;

const defaultValues: TestimonialFeedbackValues = {
  name: "",
  roleCompany: "",
  message: "",
  rating: 5,
  honeypot: "",
};

export function PublicTestimonialForm() {
  const form = useForm<TestimonialFeedbackValues>({
    resolver: zodResolver(testimonialFeedbackSchema),
    defaultValues,
  });

  const mutation = useMutation({
    mutationFn: (payload: TestimonialFeedbackValues) =>
      publicApi.submitTestimonial({
        name: payload.name,
        roleCompany: payload.roleCompany || "",
        message: payload.message,
        rating: payload.rating,
        honeypot: payload.honeypot || "",
      }),
    onSuccess: () => {
      toast.success("Thanks for your feedback.");
      form.reset(defaultValues);
      queryClient.invalidateQueries({ queryKey: ["homepage"] });
    },
    onError: (error: unknown) => {
      const apiError = error as AxiosError<{ message?: string }>;
      const message = apiError.response?.data?.message || "Failed to submit feedback";
      toast.error(message);
    },
  });

  const onSubmit = form.handleSubmit((values) => mutation.mutate(values));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Share your feedback</CardTitle>
        <p className="text-sm text-muted-foreground">No login required. Your testimonial helps other clients trust our delivery.</p>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={onSubmit}>
          <div>
            <Label htmlFor="testimonialName">Name</Label>
            <Input id="testimonialName" {...form.register("name")} aria-invalid={Boolean(form.formState.errors.name)} />
            {form.formState.errors.name ? <p className="mt-1 text-xs text-destructive">{form.formState.errors.name.message}</p> : null}
          </div>

          <div>
            <Label htmlFor="testimonialRoleCompany">Role / Company (optional)</Label>
            <Input id="testimonialRoleCompany" {...form.register("roleCompany")} />
            {form.formState.errors.roleCompany ? (
              <p className="mt-1 text-xs text-destructive">{form.formState.errors.roleCompany.message}</p>
            ) : null}
          </div>

          <div>
            <Label htmlFor="testimonialRating">Rating</Label>
            <Select id="testimonialRating" {...form.register("rating", { valueAsNumber: true })}>
              <option value={5}>5 - Excellent</option>
              <option value={4}>4 - Very Good</option>
              <option value={3}>3 - Good</option>
              <option value={2}>2 - Fair</option>
              <option value={1}>1 - Poor</option>
            </Select>
          </div>

          <div>
            <Label htmlFor="testimonialMessage">Feedback</Label>
            <Textarea
              id="testimonialMessage"
              className="min-h-[130px]"
              {...form.register("message")}
              aria-invalid={Boolean(form.formState.errors.message)}
            />
            {form.formState.errors.message ? (
              <p className="mt-1 text-xs text-destructive">{form.formState.errors.message.message}</p>
            ) : null}
          </div>

          <input type="text" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" {...form.register("honeypot")} />

          <Button type="submit" disabled={mutation.isPending} className="w-full sm:w-auto">
            {mutation.isPending ? "Submitting..." : "Submit Testimonial"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
