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
import { Service } from "@/types";

const schema = z.object({
  title: z.string().min(2),
  slug: z.string().optional(),
  description: z.string().min(10),
  icon: z.string().min(1),
  featured: z.boolean().default(false),
  order: z.coerce.number().default(0),
  seoMetaTitle: z.string().optional(),
  seoMetaDescription: z.string().optional(),
  seoKeywordsCsv: z.string().optional(),
  seoCanonicalUrl: z.string().optional(),
  seoOgImageUrl: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;
type SavePayload = {
  title: string;
  slug?: string;
  description: string;
  icon: string;
  featured: boolean;
  order: number;
  seo: {
    metaTitle: string;
    metaDescription: string;
    metaKeywords: string[];
    canonicalUrl: string;
    ogImageUrl: string;
  };
};

const emptyValues: FormValues = {
  title: "",
  slug: "",
  description: "",
  icon: "Wrench",
  featured: false,
  order: 0,
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

export function AdminServicesPage() {
  const [editing, setEditing] = useState<Service | null>(null);
  const table = useAdminTable("order");
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: emptyValues,
  });

  const query = useQuery({
    queryKey: ["admin-services", table.query],
    queryFn: () => adminApi.getServices(table.query),
  });

  useEffect(() => {
    if (editing) {
      form.reset({
        title: editing.title,
        slug: editing.slug,
        description: editing.description,
        icon: editing.icon,
        featured: editing.featured,
        order: editing.order,
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
      (editing ? adminApi.updateService(editing._id, payload) : adminApi.createService(payload)),
    onSuccess: () => {
      toast.success(editing ? "Service updated" : "Service created");
      setEditing(null);
      queryClient.invalidateQueries({ queryKey: ["admin-services"] });
      queryClient.invalidateQueries({ queryKey: ["services"] });
      queryClient.invalidateQueries({ queryKey: ["homepage"] });
    },
    onError: () => toast.error("Failed to save service"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => adminApi.deleteService(id),
    onSuccess: () => {
      toast.success("Service deleted");
      queryClient.invalidateQueries({ queryKey: ["admin-services"] });
      queryClient.invalidateQueries({ queryKey: ["services"] });
      queryClient.invalidateQueries({ queryKey: ["homepage"] });
    },
    onError: () => toast.error("Failed to delete service"),
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Services</h1>

      <Card>
        <CardHeader>
          <CardTitle>{editing ? "Edit Service" : "Add Service"}</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            className="grid gap-4 md:grid-cols-2"
            onSubmit={form.handleSubmit((values) => {
              saveMutation.mutate({
                title: values.title,
                slug: values.slug,
                description: values.description,
                icon: values.icon,
                featured: values.featured,
                order: values.order,
                seo: {
                  metaTitle: values.seoMetaTitle || "",
                  metaDescription: values.seoMetaDescription || "",
                  metaKeywords: csvToArray(values.seoKeywordsCsv),
                  canonicalUrl: values.seoCanonicalUrl || "",
                  ogImageUrl: values.seoOgImageUrl || "",
                },
              });
            })}
          >
            <div>
              <Label htmlFor="title">Title</Label>
              <Input id="title" {...form.register("title")} />
            </div>
            <div>
              <Label htmlFor="slug">Slug (optional)</Label>
              <Input id="slug" {...form.register("slug")} />
            </div>
            <div>
              <Label htmlFor="icon">Lucide Icon Name</Label>
              <Input id="icon" {...form.register("icon")} />
            </div>
            <div>
              <Label htmlFor="order">Order</Label>
              <Input id="order" type="number" {...form.register("order", { valueAsNumber: true })} />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" {...form.register("description")} />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="seoMetaTitle">SEO Meta Title</Label>
              <Input id="seoMetaTitle" {...form.register("seoMetaTitle")} placeholder="Optional page title for SEO" />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="seoMetaDescription">SEO Meta Description</Label>
              <Textarea id="seoMetaDescription" {...form.register("seoMetaDescription")} placeholder="Optional SEO description" />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="seoKeywordsCsv">SEO Keywords (comma separated)</Label>
              <Input id="seoKeywordsCsv" {...form.register("seoKeywordsCsv")} />
            </div>
            <div>
              <Label htmlFor="seoCanonicalUrl">Canonical URL</Label>
              <Input id="seoCanonicalUrl" {...form.register("seoCanonicalUrl")} placeholder="https://webmitra.tech/services" />
            </div>
            <div>
              <Label htmlFor="seoOgImageUrl">OG Image URL</Label>
              <Input id="seoOgImageUrl" {...form.register("seoOgImageUrl")} />
            </div>
            <div className="md:col-span-2">
              <ImageUploadField
                label="SEO OG Image Upload"
                value={form.watch("seoOgImageUrl") || ""}
                onChange={(url) => form.setValue("seoOgImageUrl", url)}
                folder="seo"
              />
            </div>
            <label className="inline-flex items-center gap-2 text-sm">
              <Checkbox checked={form.watch("featured")} onChange={(event) => form.setValue("featured", event.target.checked)} />
              Featured
            </label>
            <div className="flex gap-2 md:col-span-2">
              <Button type="submit" disabled={saveMutation.isPending}>
                {saveMutation.isPending ? "Saving..." : editing ? "Update Service" : "Create Service"}
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
          <CardTitle>Manage Services</CardTitle>
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
              { value: "title", label: "Title" },
            ]}
          />
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Icon</TableHead>
                  <TableHead>Featured</TableHead>
                  <TableHead>Order</TableHead>
                  <TableHead className="w-[180px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {query.data?.items.map((item) => (
                  <TableRow key={item._id}>
                    <TableCell>{item.title}</TableCell>
                    <TableCell>{item.icon}</TableCell>
                    <TableCell>{item.featured ? "Yes" : "No"}</TableCell>
                    <TableCell>{item.order}</TableCell>
                    <TableCell className="space-x-2">
                      <Button variant="outline" size="sm" onClick={() => setEditing(item)}>
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => {
                          if (!window.confirm("Delete this service?")) return;
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
