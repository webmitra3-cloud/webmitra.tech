import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { ImageUploadField } from "@/components/shared/image-upload-field";
import { PaginationControls } from "@/components/shared/pagination-controls";
import { TableToolbar } from "@/components/shared/table-toolbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { useAdminTable } from "@/hooks/use-admin-table";
import { adminApi } from "@/lib/api";
import { queryClient } from "@/lib/query-client";
import { Testimonial } from "@/types";

const schema = z.object({
  name: z.string().min(2),
  roleCompany: z.string().optional(),
  message: z.string().min(5),
  rating: z.coerce.number().min(1).max(5).optional(),
  order: z.coerce.number().default(0),
  visible: z.boolean().default(true),
  seoMetaTitle: z.string().optional(),
  seoMetaDescription: z.string().optional(),
  seoKeywordsCsv: z.string().optional(),
  seoCanonicalUrl: z.string().optional(),
  seoOgImageUrl: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;
type SavePayload = {
  name: string;
  roleCompany?: string;
  message: string;
  rating?: number;
  order: number;
  visible: boolean;
  seo: {
    metaTitle: string;
    metaDescription: string;
    metaKeywords: string[];
    canonicalUrl: string;
    ogImageUrl: string;
  };
};

const emptyValues: FormValues = {
  name: "",
  roleCompany: "",
  message: "",
  rating: 5,
  order: 0,
  visible: true,
  seoMetaTitle: "",
  seoMetaDescription: "",
  seoKeywordsCsv: "",
  seoCanonicalUrl: "",
  seoOgImageUrl: "",
};

function csvToArray(value?: string) {
  return (value || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export function AdminTestimonialsPage() {
  const [editing, setEditing] = useState<Testimonial | null>(null);
  const table = useAdminTable("order");
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: emptyValues,
  });

  const query = useQuery({
    queryKey: ["admin-testimonials", table.query],
    queryFn: () => adminApi.getTestimonials(table.query),
  });

  useEffect(() => {
    if (editing) {
      form.reset({
        name: editing.name,
        roleCompany: editing.roleCompany,
        message: editing.message,
        rating: editing.rating || 5,
        order: editing.order,
        visible: editing.visible,
        seoMetaTitle: editing.seo?.metaTitle || "",
        seoMetaDescription: editing.seo?.metaDescription || "",
        seoKeywordsCsv: (editing.seo?.metaKeywords || []).join(", "),
        seoCanonicalUrl: editing.seo?.canonicalUrl || "",
        seoOgImageUrl: editing.seo?.ogImageUrl || "",
      });
    } else {
      form.reset(emptyValues);
    }
  }, [editing]);

  const saveMutation = useMutation({
    mutationFn: (payload: SavePayload) =>
      (editing ? adminApi.updateTestimonial(editing._id, payload) : adminApi.createTestimonial(payload)),
    onSuccess: () => {
      toast.success(editing ? "Testimonial updated" : "Testimonial created");
      setEditing(null);
      queryClient.invalidateQueries({ queryKey: ["admin-testimonials"] });
      queryClient.invalidateQueries({ queryKey: ["homepage"] });
    },
    onError: () => toast.error("Failed to save testimonial"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => adminApi.deleteTestimonial(id),
    onSuccess: () => {
      toast.success("Testimonial deleted");
      queryClient.invalidateQueries({ queryKey: ["admin-testimonials"] });
      queryClient.invalidateQueries({ queryKey: ["homepage"] });
    },
    onError: () => toast.error("Failed to delete testimonial"),
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Testimonials</h1>
      <Card>
        <CardHeader>
          <CardTitle>{editing ? "Edit Testimonial" : "Add Testimonial"}</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            className="space-y-4"
            onSubmit={form.handleSubmit((values) =>
              saveMutation.mutate({
                name: values.name,
                roleCompany: values.roleCompany || "",
                message: values.message,
                rating: values.rating,
                order: values.order,
                visible: values.visible,
                seo: {
                  metaTitle: values.seoMetaTitle || "",
                  metaDescription: values.seoMetaDescription || "",
                  metaKeywords: csvToArray(values.seoKeywordsCsv),
                  canonicalUrl: values.seoCanonicalUrl || "",
                  ogImageUrl: values.seoOgImageUrl || "",
                },
              }),
            )}
          >
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input id="name" {...form.register("name")} />
              </div>
              <div>
                <Label htmlFor="roleCompany">Role/Company</Label>
                <Input id="roleCompany" {...form.register("roleCompany")} />
              </div>
            </div>
            <div>
              <Label htmlFor="message">Message</Label>
              <Textarea id="message" {...form.register("message")} />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="rating">Rating (1-5)</Label>
                <Input id="rating" type="number" min={1} max={5} {...form.register("rating", { valueAsNumber: true })} />
              </div>
              <div>
                <Label htmlFor="order">Order</Label>
                <Input id="order" type="number" {...form.register("order", { valueAsNumber: true })} />
              </div>
            </div>
            <div>
              <Label htmlFor="seoMetaTitle">SEO Meta Title</Label>
              <Input id="seoMetaTitle" {...form.register("seoMetaTitle")} />
            </div>
            <div>
              <Label htmlFor="seoMetaDescription">SEO Meta Description</Label>
              <Textarea id="seoMetaDescription" {...form.register("seoMetaDescription")} />
            </div>
            <div>
              <Label htmlFor="seoKeywordsCsv">SEO Keywords (comma separated)</Label>
              <Input id="seoKeywordsCsv" {...form.register("seoKeywordsCsv")} />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="seoCanonicalUrl">Canonical URL</Label>
                <Input id="seoCanonicalUrl" {...form.register("seoCanonicalUrl")} />
              </div>
              <div>
                <Label htmlFor="seoOgImageUrl">OG Image URL</Label>
                <Input id="seoOgImageUrl" {...form.register("seoOgImageUrl")} />
              </div>
            </div>
            <ImageUploadField
              label="SEO OG Image Upload"
              value={form.watch("seoOgImageUrl") || ""}
              onChange={(url) => form.setValue("seoOgImageUrl", url)}
              folder="seo"
            />
            <label className="inline-flex items-center gap-2 text-sm">
              <Checkbox checked={form.watch("visible")} onChange={(event) => form.setValue("visible", event.target.checked)} />
              Visible on website
            </label>
            <div className="flex gap-2">
              <Button type="submit" disabled={saveMutation.isPending}>
                {saveMutation.isPending ? "Saving..." : editing ? "Update Testimonial" : "Create Testimonial"}
              </Button>
              {editing ? (
                <Button type="button" variant="outline" onClick={() => setEditing(null)}>
                  Cancel
                </Button>
              ) : null}
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Manage Testimonials</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <TableToolbar
            search={table.search}
            onSearchChange={table.setSearch}
            sortBy={table.sortBy}
            sortOrder={table.sortOrder}
            onSortByChange={table.setSortBy}
            onSortOrderChange={table.setSortOrder}
            sortOptions={[
              { value: "order", label: "Order" },
              { value: "createdAt", label: "Created At" },
              { value: "name", label: "Name" },
            ]}
          />
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Role/Company</TableHead>
                  <TableHead>Visible</TableHead>
                  <TableHead className="w-[180px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {query.data?.items.map((item) => (
                  <TableRow key={item._id}>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.roleCompany}</TableCell>
                    <TableCell>{item.visible ? "Yes" : "No"}</TableCell>
                    <TableCell className="space-x-2">
                      <Button variant="outline" size="sm" onClick={() => setEditing(item)}>
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => {
                          if (!window.confirm("Delete this testimonial?")) return;
                          deleteMutation.mutate(item._id);
                        }}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {query.data ? <PaginationControls page={query.data.page} totalPages={query.data.totalPages} onPageChange={table.setPage} /> : null}
        </CardContent>
      </Card>
    </div>
  );
}
