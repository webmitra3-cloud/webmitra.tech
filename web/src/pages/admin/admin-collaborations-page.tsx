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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { useAdminTable } from "@/hooks/use-admin-table";
import { adminApi } from "@/lib/api";
import { queryClient } from "@/lib/query-client";
import { Collaboration } from "@/types";

const schema = z.object({
  name: z.string().min(2),
  logoUrl: z.string().optional(),
  websiteUrl: z.string().optional(),
  note: z.string().optional(),
  order: z.coerce.number().default(0),
});

type FormValues = z.infer<typeof schema>;

const emptyValues: FormValues = {
  name: "",
  logoUrl: "",
  websiteUrl: "",
  note: "",
  order: 0,
};

export function AdminCollaborationsPage() {
  const [editing, setEditing] = useState<Collaboration | null>(null);
  const table = useAdminTable("order");
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: emptyValues,
  });

  const query = useQuery({
    queryKey: ["admin-collaborations", table.query],
    queryFn: () => adminApi.getCollaborations(table.query),
  });

  useEffect(() => {
    if (editing) {
      form.reset({
        name: editing.name,
        logoUrl: editing.logoUrl,
        websiteUrl: editing.websiteUrl,
        note: editing.note,
        order: editing.order,
      });
    } else {
      form.reset(emptyValues);
    }
  }, [editing]);

  const saveMutation = useMutation({
    mutationFn: (payload: FormValues) => (editing ? adminApi.updateCollaboration(editing._id, payload) : adminApi.createCollaboration(payload)),
    onSuccess: () => {
      toast.success(editing ? "Collaboration updated" : "Collaboration created");
      setEditing(null);
      queryClient.invalidateQueries({ queryKey: ["admin-collaborations"] });
      queryClient.invalidateQueries({ queryKey: ["homepage"] });
    },
    onError: () => toast.error("Failed to save collaboration"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => adminApi.deleteCollaboration(id),
    onSuccess: () => {
      toast.success("Collaboration deleted");
      queryClient.invalidateQueries({ queryKey: ["admin-collaborations"] });
      queryClient.invalidateQueries({ queryKey: ["homepage"] });
    },
    onError: () => toast.error("Failed to delete collaboration"),
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Collaborations</h1>

      <Card>
        <CardHeader>
          <CardTitle>{editing ? "Edit Collaboration" : "Add Collaboration"}</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={form.handleSubmit((values) => saveMutation.mutate(values))}>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input id="name" {...form.register("name")} />
              </div>
              <div>
                <Label htmlFor="websiteUrl">Website URL</Label>
                <Input id="websiteUrl" {...form.register("websiteUrl")} />
              </div>
            </div>
            <ImageUploadField
              label="Logo URL"
              value={form.watch("logoUrl") || ""}
              onChange={(url) => form.setValue("logoUrl", url)}
              folder="collaborations"
            />
            <div>
              <Label htmlFor="note">Short Note</Label>
              <Textarea id="note" {...form.register("note")} />
            </div>
            <div className="w-24">
              <Label htmlFor="order">Order</Label>
              <Input id="order" type="number" {...form.register("order", { valueAsNumber: true })} />
            </div>
            <div className="flex gap-2">
              <Button type="submit" disabled={saveMutation.isPending}>
                {saveMutation.isPending ? "Saving..." : editing ? "Update Collaboration" : "Create Collaboration"}
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
          <CardTitle>Manage Collaborations</CardTitle>
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
                  <TableHead>Website</TableHead>
                  <TableHead>Order</TableHead>
                  <TableHead className="w-[180px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {query.data?.items.map((item) => (
                  <TableRow key={item._id}>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.websiteUrl || "-"}</TableCell>
                    <TableCell>{item.order}</TableCell>
                    <TableCell className="space-x-2">
                      <Button variant="outline" size="sm" onClick={() => setEditing(item)}>
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => {
                          if (!window.confirm("Delete this collaboration?")) return;
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
