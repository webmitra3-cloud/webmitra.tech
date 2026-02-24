import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { PaginationControls } from "@/components/shared/pagination-controls";
import { TableToolbar } from "@/components/shared/table-toolbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { useAdminTable } from "@/hooks/use-admin-table";
import { adminApi } from "@/lib/api";
import { queryClient } from "@/lib/query-client";
import { PricingPlan } from "@/types";

const schema = z.object({
  name: z.enum(["SILVER", "GOLD", "DIAMOND"]),
  price: z.coerce.number().min(0),
  startingFrom: z.boolean().default(false),
  note: z.string().optional(),
  featuresCsv: z.string().optional(),
  highlighted: z.boolean().default(false),
  ctaLabel: z.string().min(2),
  ctaLink: z.string().min(1),
  order: z.coerce.number().default(0),
});

type FormValues = z.infer<typeof schema>;

const emptyValues: FormValues = {
  name: "SILVER",
  price: 0,
  startingFrom: false,
  note: "",
  featuresCsv: "",
  highlighted: false,
  ctaLabel: "Get Started",
  ctaLink: "/contact",
  order: 1,
};

export function AdminPricingPage() {
  const [editing, setEditing] = useState<PricingPlan | null>(null);
  const table = useAdminTable("order");
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: emptyValues,
  });

  const query = useQuery({
    queryKey: ["admin-pricing", table.query],
    queryFn: () => adminApi.getPricing(table.query),
  });

  useEffect(() => {
    if (editing) {
      form.reset({
        name: editing.name,
        price: editing.price,
        startingFrom: editing.startingFrom,
        note: editing.note,
        featuresCsv: editing.features.join(", "),
        highlighted: editing.highlighted,
        ctaLabel: editing.ctaLabel,
        ctaLink: editing.ctaLink,
        order: editing.order,
      });
    } else {
      form.reset(emptyValues);
    }
  }, [editing]);

  const saveMutation = useMutation({
    mutationFn: (payload: FormValues) => {
      const normalized = {
        ...payload,
        features: (payload.featuresCsv || "")
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
      };
      return editing ? adminApi.updatePricing(editing._id, normalized) : adminApi.upsertPricing(normalized);
    },
    onSuccess: () => {
      toast.success(editing ? "Pricing plan updated" : "Pricing plan saved");
      setEditing(null);
      queryClient.invalidateQueries({ queryKey: ["admin-pricing"] });
      queryClient.invalidateQueries({ queryKey: ["pricing-page"] });
      queryClient.invalidateQueries({ queryKey: ["homepage"] });
    },
    onError: () => toast.error("Failed to save pricing plan"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => adminApi.deletePricing(id),
    onSuccess: () => {
      toast.success("Pricing plan deleted");
      queryClient.invalidateQueries({ queryKey: ["admin-pricing"] });
      queryClient.invalidateQueries({ queryKey: ["pricing-page"] });
      queryClient.invalidateQueries({ queryKey: ["homepage"] });
    },
    onError: () => toast.error("Failed to delete plan"),
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Pricing Plans</h1>
      <Card>
        <CardHeader>
          <CardTitle>{editing ? "Edit Plan" : "Create / Upsert Plan"}</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={form.handleSubmit((values) => saveMutation.mutate(values))}>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="name">Plan Name</Label>
                <Select id="name" {...form.register("name")}>
                  <option value="SILVER">SILVER</option>
                  <option value="GOLD">GOLD</option>
                  <option value="DIAMOND">DIAMOND</option>
                </Select>
              </div>
              <div>
                <Label htmlFor="price">Price (NPR)</Label>
                <Input id="price" type="number" {...form.register("price", { valueAsNumber: true })} />
              </div>
            </div>
            <div>
              <Label htmlFor="note">Billing Note</Label>
              <Input id="note" {...form.register("note")} />
            </div>
            <div>
              <Label htmlFor="featuresCsv">Features (comma separated)</Label>
              <Textarea id="featuresCsv" {...form.register("featuresCsv")} />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="ctaLabel">CTA Label</Label>
                <Input id="ctaLabel" {...form.register("ctaLabel")} />
              </div>
              <div>
                <Label htmlFor="ctaLink">CTA Link</Label>
                <Input id="ctaLink" {...form.register("ctaLink")} />
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <label className="inline-flex items-center gap-2 text-sm">
                <Checkbox checked={form.watch("startingFrom")} onChange={(event) => form.setValue("startingFrom", event.target.checked)} />
                Starting from
              </label>
              <label className="inline-flex items-center gap-2 text-sm">
                <Checkbox checked={form.watch("highlighted")} onChange={(event) => form.setValue("highlighted", event.target.checked)} />
                Highlighted
              </label>
              <div>
                <Label htmlFor="order">Order</Label>
                <Input id="order" type="number" {...form.register("order", { valueAsNumber: true })} />
              </div>
            </div>
            <div className="flex gap-2">
              <Button type="submit" disabled={saveMutation.isPending}>
                {saveMutation.isPending ? "Saving..." : editing ? "Update Plan" : "Save Plan"}
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
          <CardTitle>Manage Plans</CardTitle>
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
              { value: "name", label: "Name" },
              { value: "price", label: "Price" },
            ]}
          />
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Highlighted</TableHead>
                  <TableHead>Order</TableHead>
                  <TableHead className="w-[180px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {query.data?.items.map((item) => (
                  <TableRow key={item._id}>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>NPR {item.price.toLocaleString()}</TableCell>
                    <TableCell>{item.highlighted ? "Yes" : "No"}</TableCell>
                    <TableCell>{item.order}</TableCell>
                    <TableCell className="space-x-2">
                      <Button variant="outline" size="sm" onClick={() => setEditing(item)}>
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => {
                          if (!window.confirm("Delete this plan?")) return;
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
