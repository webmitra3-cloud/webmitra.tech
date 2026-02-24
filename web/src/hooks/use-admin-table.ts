import { useState } from "react";

export function useAdminTable(defaultSortBy = "createdAt") {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState(defaultSortBy);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  return {
    page,
    setPage,
    search,
    setSearch,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    query: {
      page,
      limit: 10,
      search,
      sortBy,
      sortOrder,
    },
  };
}
