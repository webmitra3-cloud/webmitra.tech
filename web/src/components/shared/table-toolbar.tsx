import { ChangeEvent } from "react";
import { ArrowDownAZ, ArrowUpAZ, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

type TableToolbarProps = {
  search: string;
  onSearchChange: (value: string) => void;
  sortBy: string;
  sortOrder: "asc" | "desc";
  onSortByChange: (value: string) => void;
  onSortOrderChange: (value: "asc" | "desc") => void;
  sortOptions: Array<{ value: string; label: string }>;
};

export function TableToolbar({
  search,
  onSearchChange,
  sortBy,
  sortOrder,
  onSortByChange,
  onSortOrderChange,
  sortOptions,
}: TableToolbarProps) {
  return (
    <div className="grid gap-3 rounded-2xl border border-border/70 bg-card/70 p-3 md:grid-cols-[1fr_220px_180px]">
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search records..."
          value={search}
          onChange={(event: ChangeEvent<HTMLInputElement>) => onSearchChange(event.target.value)}
          className="pl-9"
          aria-label="Search table records"
        />
      </div>

      <div className="space-y-1">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">Sort By</p>
        <Select value={sortBy} onChange={(event) => onSortByChange(event.target.value)}>
          {sortOptions.map((option) => (
            <option value={option.value} key={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
      </div>

      <div className="space-y-1">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">Order</p>
        <Select value={sortOrder} onChange={(event) => onSortOrderChange(event.target.value as "asc" | "desc")}>
          <option value="desc">
            Descending
          </option>
          <option value="asc">
            Ascending
          </option>
        </Select>
      </div>

      <div className="md:col-span-3 flex items-center gap-2 text-xs text-muted-foreground">
        {sortOrder === "asc" ? <ArrowUpAZ className="h-3.5 w-3.5 text-primary" /> : <ArrowDownAZ className="h-3.5 w-3.5 text-primary" />}
        Sorted by <span className="font-semibold text-foreground">{sortOptions.find((item) => item.value === sortBy)?.label || sortBy}</span>
      </div>
    </div>
  );
}
