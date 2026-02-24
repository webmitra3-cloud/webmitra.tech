import { FilterQuery } from "mongoose";
import { getPagination } from "../utils/pagination";

type ListParams<T> = {
  query: Record<string, unknown>;
  searchFields?: (keyof T)[];
  defaultSort?: Record<string, 1 | -1>;
};

export function buildListQuery<T>(params: ListParams<T>) {
  const { page, limit, skip } = getPagination(params.query);
  const search = typeof params.query.search === "string" ? params.query.search.trim() : "";
  const sortBy = typeof params.query.sortBy === "string" ? params.query.sortBy : "";
  const sortOrder = params.query.sortOrder === "asc" ? 1 : -1;

  const filter: FilterQuery<T> = {};
  if (search && params.searchFields?.length) {
    filter.$or = params.searchFields.map((field) => ({
      [field]: { $regex: search, $options: "i" },
    })) as FilterQuery<T>["$or"];
  }

  const sort =
    sortBy.length > 0
      ? ({
          [sortBy]: sortOrder,
        } as Record<string, 1 | -1>)
      : params.defaultSort || { createdAt: -1 };

  return { page, limit, skip, filter, sort };
}
