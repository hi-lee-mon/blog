// テーブル関連の型定義を統合管理

export interface User {
  id: number;
  name: string;
  email: string;
  age: number;
  department: string;
  status: "active" | "inactive" | "pending";
  role: "admin" | "user" | "manager";
}

export interface TableFilters {
  name: string;
  department: string;
  status: string;
}

export type Order = "asc" | "desc";

export type SortableFields = keyof Pick<
  User,
  "id" | "name" | "age" | "department"
>;

// イベントハンドラーの型
export interface TableEventHandlers {
  onView?: (id: number) => void;
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
}

// テーブル設定の型
export interface TableConfig {
  rowsPerPageOptions: number[];
  defaultRowsPerPage: number;
  maxHeight: number;
  stickyHeader: boolean;
}

// パフォーマンス最適化のための定数
export const TABLE_CONSTANTS = {
  ROWS_PER_PAGE_OPTIONS: [5, 10, 25, 50] as const,
  DEFAULT_ROWS_PER_PAGE: 10,
  MAX_HEIGHT: 600,
  DEBOUNCE_DELAY: 300,
} as const;

// 部署とステータスの定数
export const DEPARTMENTS = [
  "Engineering",
  "Marketing",
  "Sales",
  "HR",
  "Finance",
] as const;

export const STATUSES = ["active", "inactive", "pending"] as const;
export const ROLES = ["admin", "user", "manager"] as const;

export type Department = (typeof DEPARTMENTS)[number];
export type Status = (typeof STATUSES)[number];
export type Role = (typeof ROLES)[number];
