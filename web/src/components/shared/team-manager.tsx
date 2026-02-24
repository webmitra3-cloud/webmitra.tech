import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { PaginationControls } from "@/components/shared/pagination-controls";
import { TableToolbar } from "@/components/shared/table-toolbar";
import { ImageUploadField } from "@/components/shared/image-upload-field";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { useAdminTable } from "@/hooks/use-admin-table";
import { adminApi } from "@/lib/api";
import { queryClient } from "@/lib/query-client";
import { TeamMember, TeamType } from "@/types";

const schema = z.object({
  name: z.string().min(2),
  roleTitle: z.string().min(2),
  type: z.enum(["TEAM", "BOARD"]),
  bio: z.string().optional(),
  photoUrl: z.string().optional(),
  portfolioUrl: z.string().optional(),
  order: z.coerce.number().default(0),
  socialsFacebook: z.string().optional(),
  socialsInstagram: z.string().optional(),
  socialsLinkedin: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

const initialValues = (type: TeamType): FormValues => ({
  name: "",
  roleTitle: "",
  type,
  bio: "",
  photoUrl: "",
  portfolioUrl: "",
  order: 0,
  socialsFacebook: "",
  socialsInstagram: "",
  socialsLinkedin: "",
});

export function TeamManager({ type, title }: { type: TeamType; title: string }) {
  const [editing, setEditing] = useState<TeamMember | null>(null);
  const table = useAdminTable("order");
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: initialValues(type),
  });

  const query = useQuery({
    queryKey: ["admin-team", type, table.query],
    queryFn: () => adminApi.getTeamMembers({ ...table.query, type }),
  });

  useEffect(() => {
    if (editing) {
      form.reset({
        name: editing.name,
        roleTitle: editing.roleTitle,
        type: editing.type,
        bio: editing.bio,
        photoUrl: editing.photoUrl,
        portfolioUrl: editing.portfolioUrl,
        order: editing.order,
        socialsFacebook: editing.socials.facebook,
        socialsInstagram: editing.socials.instagram,
        socialsLinkedin: editing.socials.linkedin,
      });
    } else {
      form.reset(initialValues(type));
    }
  }, [editing, type]);

  const saveMutation = useMutation({
    mutationFn: (payload: FormValues) => {
      const normalized = {
        name: payload.name,
        roleTitle: payload.roleTitle,
        type,
        bio: payload.bio || "",
        photoUrl: payload.photoUrl || "",
        portfolioUrl: payload.portfolioUrl || "",
        order: payload.order,
        socials: {
          facebook: payload.socialsFacebook || "",
          instagram: payload.socialsInstagram || "",
          linkedin: payload.socialsLinkedin || "",
        },
      };
      return editing ? adminApi.updateTeamMember(editing._id, normalized) : adminApi.createTeamMember(normalized);
    },
    onSuccess: () => {
      toast.success(editing ? "Member updated" : "Member created");
      setEditing(null);
      queryClient.invalidateQueries({ queryKey: ["admin-team"] });
      queryClient.invalidateQueries({ queryKey: ["members"] });
      queryClient.invalidateQueries({ queryKey: ["team-preview"] });
      queryClient.invalidateQueries({ queryKey: ["homepage"] });
    },
    onError: () => toast.error("Failed to save member"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => adminApi.deleteTeamMember(id),
    onSuccess: () => {
      toast.success("Member deleted");
      queryClient.invalidateQueries({ queryKey: ["admin-team"] });
      queryClient.invalidateQueries({ queryKey: ["members"] });
      queryClient.invalidateQueries({ queryKey: ["team-preview"] });
      queryClient.invalidateQueries({ queryKey: ["homepage"] });
    },
    onError: () => toast.error("Failed to delete member"),
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">{title}</h1>
      <Card>
        <CardHeader>
          <CardTitle>{editing ? "Edit Member" : "Add Member"}</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            className="space-y-4"
            onSubmit={form.handleSubmit((values) => {
              saveMutation.mutate(values);
            })}
          >
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor={`${type}-name`}>Name</Label>
                <Input id={`${type}-name`} {...form.register("name")} />
              </div>
              <div>
                <Label htmlFor={`${type}-role`}>Role Title</Label>
                <Input id={`${type}-role`} {...form.register("roleTitle")} />
              </div>
            </div>
            <div>
              <Label htmlFor={`${type}-bio`}>Bio</Label>
              <Textarea id={`${type}-bio`} {...form.register("bio")} />
            </div>
            <div>
              <Label htmlFor={`${type}-portfolio`}>Portfolio / Personal Site URL</Label>
              <Input id={`${type}-portfolio`} {...form.register("portfolioUrl")} />
            </div>
            <ImageUploadField
              label="Photo URL"
              value={form.watch("photoUrl") || ""}
              onChange={(url) => form.setValue("photoUrl", url)}
              folder="team"
            />
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <Label htmlFor={`${type}-facebook`}>Facebook URL</Label>
                <Input id={`${type}-facebook`} {...form.register("socialsFacebook")} />
              </div>
              <div>
                <Label htmlFor={`${type}-instagram`}>Instagram URL</Label>
                <Input id={`${type}-instagram`} {...form.register("socialsInstagram")} />
              </div>
              <div>
                <Label htmlFor={`${type}-linkedin`}>LinkedIn URL</Label>
                <Input id={`${type}-linkedin`} {...form.register("socialsLinkedin")} />
              </div>
            </div>
            <div className="w-24">
              <Label htmlFor={`${type}-order`}>Order</Label>
              <Input id={`${type}-order`} type="number" {...form.register("order", { valueAsNumber: true })} />
            </div>
            <div className="flex gap-2">
              <Button type="submit" disabled={saveMutation.isPending}>
                {saveMutation.isPending ? "Saving..." : editing ? "Update Member" : "Create Member"}
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
          <CardTitle>Manage Members</CardTitle>
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
                  <TableHead>Role</TableHead>
                  <TableHead>Order</TableHead>
                  <TableHead className="w-[180px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {query.data?.items.map((item) => (
                  <TableRow key={item._id}>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.roleTitle}</TableCell>
                    <TableCell>{item.order}</TableCell>
                    <TableCell className="space-x-2">
                      <Button variant="outline" size="sm" onClick={() => setEditing(item)}>
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => {
                          if (!window.confirm("Delete this member?")) return;
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
