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
import { Project } from "@/types";

const schema = z.object({
  title: z.string().min(2),
  slug: z.string().optional(),
  summary: z.string().min(10),
  content: z.string().min(20),
  thumbnailUrl: z.string().optional(),
  galleryCsv: z.string().optional(),
  tagsCsv: z.string().optional(),
  techStackCsv: z.string().optional(),
  viewLiveUrl: z.string().optional(),
  demoUrl: z.string().optional(),
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
  summary: string;
  content: string;
  thumbnailUrl?: string;
  gallery: string[];
  tags: string[];
  techStack: string[];
  viewLiveUrl?: string;
  demoUrl?: string;
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
  summary: "",
  content: "",
  thumbnailUrl: "",
  galleryCsv: "",
  tagsCsv: "",
  techStackCsv: "",
  viewLiveUrl: "",
  demoUrl: "",
  featured: false,
  order: 0,
  seoMetaTitle: "",
  seoMetaDescription: "",
  seoKeywordsCsv: "",
  seoCanonicalUrl: "",
  seoOgImageUrl: "",
};

function csvToArray(value: string | undefined) {
  return (value || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export function AdminProjectsPage() {
  const [editing, setEditing] = useState<Project | null>(null);
  const table = useAdminTable("createdAt");
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: emptyValues,
  });

  const query = useQuery({
    queryKey: ["admin-projects", table.query],
    queryFn: () => adminApi.getProjects(table.query),
  });

  useEffect(() => {
    if (editing) {
      form.reset({
        title: editing.title,
        slug: editing.slug,
        summary: editing.summary,
        content: editing.content,
        thumbnailUrl: editing.thumbnailUrl,
        galleryCsv: editing.gallery.join(", "),
        tagsCsv: editing.tags.join(", "),
        techStackCsv: editing.techStack.join(", "),
        viewLiveUrl: editing.viewLiveUrl || "",
        demoUrl: editing.demoUrl || "",
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
    mutationFn: (payload: SavePayload) => {
      const normalized = payload;
      return editing ? adminApi.updateProject(editing._id, normalized) : adminApi.createProject(normalized);
    },
    onSuccess: () => {
      toast.success(editing ? "Project updated" : "Project created");
      setEditing(null);
      queryClient.invalidateQueries({ queryKey: ["admin-projects"] });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["homepage"] });
    },
    onError: () => toast.error("Failed to save project"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => adminApi.deleteProject(id),
    onSuccess: () => {
      toast.success("Project deleted");
      queryClient.invalidateQueries({ queryKey: ["admin-projects"] });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["homepage"] });
    },
    onError: () => toast.error("Failed to delete project"),
  });

  const onSubmit = form.handleSubmit((values) =>
    saveMutation.mutate({
      title: values.title,
      slug: values.slug,
      summary: values.summary,
      content: values.content,
      thumbnailUrl: values.thumbnailUrl || "",
      gallery: csvToArray(values.galleryCsv),
      tags: csvToArray(values.tagsCsv),
      techStack: csvToArray(values.techStackCsv),
      viewLiveUrl: values.viewLiveUrl || "",
      demoUrl: values.demoUrl || "",
      featured: values.featured,
      order: values.order,
      seo: {
        metaTitle: values.seoMetaTitle || "",
        metaDescription: values.seoMetaDescription || "",
        metaKeywords: csvToArray(values.seoKeywordsCsv),
        canonicalUrl: values.seoCanonicalUrl || "",
        ogImageUrl: values.seoOgImageUrl || "",
      },
    }),
  );

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Projects</h1>

      <Card>
        <CardHeader>
          <CardTitle>{editing ? "Edit Project" : "Add Project"}</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={onSubmit}>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input id="title" {...form.register("title")} />
              </div>
              <div>
                <Label htmlFor="slug">Slug (optional)</Label>
                <Input id="slug" {...form.register("slug")} />
              </div>
            </div>
            <div>
              <Label htmlFor="summary">Summary</Label>
              <Textarea id="summary" {...form.register("summary")} />
            </div>
            <div>
              <Label htmlFor="content">Detailed Content</Label>
              <Textarea id="content" {...form.register("content")} className="min-h-[130px]" />
            </div>

            <ImageUploadField
              label="Thumbnail URL"
              value={form.watch("thumbnailUrl") || ""}
              onChange={(url) => form.setValue("thumbnailUrl", url)}
              folder="projects"
            />

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="galleryCsv">Gallery URLs (comma separated)</Label>
                <Textarea id="galleryCsv" {...form.register("galleryCsv")} />
              </div>
              <div>
                <Label htmlFor="techStackCsv">Tech Stack (comma separated)</Label>
                <Textarea id="techStackCsv" {...form.register("techStackCsv")} />
              </div>
            </div>
            <div>
              <Label htmlFor="tagsCsv">Tags (comma separated)</Label>
              <Input id="tagsCsv" {...form.register("tagsCsv")} />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="viewLiveUrl">Live URL (optional)</Label>
                <Input id="viewLiveUrl" {...form.register("viewLiveUrl")} />
              </div>
              <div>
                <Label htmlFor="demoUrl">Demo URL (optional)</Label>
                <Input id="demoUrl" {...form.register("demoUrl")} />
              </div>
            </div>
            <div className="md:grid-cols-2 grid gap-4">
              <div className="md:col-span-2">
                <Label htmlFor="seoMetaTitle">SEO Meta Title</Label>
                <Input id="seoMetaTitle" {...form.register("seoMetaTitle")} />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="seoMetaDescription">SEO Meta Description</Label>
                <Textarea id="seoMetaDescription" {...form.register("seoMetaDescription")} />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="seoKeywordsCsv">SEO Keywords (comma separated)</Label>
                <Input id="seoKeywordsCsv" {...form.register("seoKeywordsCsv")} />
              </div>
              <div>
                <Label htmlFor="seoCanonicalUrl">Canonical URL</Label>
                <Input id="seoCanonicalUrl" {...form.register("seoCanonicalUrl")} />
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
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <label className="inline-flex items-center gap-2 text-sm">
                <Checkbox checked={form.watch("featured")} onChange={(event) => form.setValue("featured", event.target.checked)} />
                Featured
              </label>
              <div className="w-24">
                <Label htmlFor="order">Order</Label>
                <Input id="order" type="number" {...form.register("order", { valueAsNumber: true })} />
              </div>
            </div>
            <div className="flex gap-2">
              <Button type="submit" disabled={saveMutation.isPending}>
                {saveMutation.isPending ? "Saving..." : editing ? "Update Project" : "Create Project"}
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
          <CardTitle>Manage Projects</CardTitle>
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
              { value: "createdAt", label: "Newest" },
              { value: "title", label: "Title" },
              { value: "order", label: "Order" },
            ]}
          />
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Featured</TableHead>
                  <TableHead>Tags</TableHead>
                  <TableHead>Order</TableHead>
                  <TableHead className="w-[180px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {query.data?.items.map((item) => (
                  <TableRow key={item._id}>
                    <TableCell>{item.title}</TableCell>
                    <TableCell>{item.featured ? "Yes" : "No"}</TableCell>
                    <TableCell>{(item.tags || []).slice(0, 2).join(", ")}</TableCell>
                    <TableCell>{item.order}</TableCell>
                    <TableCell className="space-x-2">
                      <Button variant="outline" size="sm" onClick={() => setEditing(item)}>
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => {
                          if (!window.confirm("Delete this project?")) return;
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
