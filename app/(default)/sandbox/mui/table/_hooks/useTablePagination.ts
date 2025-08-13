"use client";

import { useCallback, useMemo, useState } from "react";

export const useTablePagination = <T>(data: T[]) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // ページネーション適用
  const paginatedData = useMemo(() => {
    const startIndex = page * rowsPerPage;
    return data.slice(startIndex, startIndex + rowsPerPage);
  }, [data, page, rowsPerPage]);

  // ページ変更
  const handleChangePage = useCallback((_event: unknown, newPage: number) => {
    setPage(newPage);
  }, []);

  // 行数変更
  const handleChangeRowsPerPage = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      setPage(0);
    },
    [],
  );

  // ページリセット（フィルター変更時など）
  const resetPage = useCallback(() => {
    setPage(0);
  }, []);

  return {
    page,
    rowsPerPage,
    paginatedData,
    totalCount: data.length,
    handleChangePage,
    handleChangeRowsPerPage,
    resetPage,
  };
};
