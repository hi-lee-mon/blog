"use client";

import { useCallback, useMemo, useState } from "react";
import type { Order, TableFilters, User } from "../_types";

// サンプルデータ生成
const createSampleData = (): User[] => {
  const departments = [
    "Engineering",
    "Marketing",
    "Sales",
    "HR",
    "Finance",
  ] as const;
  const statuses = ["active", "inactive", "pending"] as const;
  const roles = ["admin", "user", "manager"] as const;

  return Array.from({ length: 100 }, (_, index) => ({
    id: index + 1,
    name: `User ${index + 1}`,
    email: `user${index + 1}@example.com`,
    age: Math.floor(Math.random() * 40) + 20,
    department: departments[Math.floor(Math.random() * departments.length)],
    status: statuses[Math.floor(Math.random() * statuses.length)],
    role: roles[Math.floor(Math.random() * roles.length)],
  }));
};

export const useTableData = () => {
  const [data] = useState<User[]>(() => createSampleData());
  const [filters, setFilters] = useState<TableFilters>({
    name: "",
    department: "",
    status: "",
  });
  const [order, setOrder] = useState<Order>("asc");
  const [orderBy, setOrderBy] = useState<keyof User>("id");

  // フィルタリング
  const filteredData = useMemo(() => {
    return data.filter((user) => {
      return (
        user.name.toLowerCase().includes(filters.name.toLowerCase()) &&
        (filters.department === "" || user.department === filters.department) &&
        (filters.status === "" || user.status === filters.status)
      );
    });
  }, [data, filters]);

  // ソート
  const sortedData = useMemo(() => {
    return [...filteredData].sort((a, b) => {
      const aValue = a[orderBy];
      const bValue = b[orderBy];

      if (aValue < bValue) {
        return order === "asc" ? -1 : 1;
      }
      if (aValue > bValue) {
        return order === "asc" ? 1 : -1;
      }
      return 0;
    });
  }, [filteredData, order, orderBy]);

  // フィルター更新
  const updateFilter = useCallback(
    (field: keyof TableFilters, value: string) => {
      setFilters((prev) => ({ ...prev, [field]: value }));
    },
    [],
  );

  // ソート処理
  const handleSort = useCallback(
    (property: keyof User) => {
      const isAsc = orderBy === property && order === "asc";
      setOrder(isAsc ? "desc" : "asc");
      setOrderBy(property);
    },
    [order, orderBy],
  );

  return {
    data: sortedData,
    filters,
    order,
    orderBy,
    updateFilter,
    handleSort,
  };
};
