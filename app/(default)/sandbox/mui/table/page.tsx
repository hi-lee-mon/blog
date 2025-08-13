/**
 * MCP (Model Context Protocol) を活用してリファクタリングした
 * 最新のReact 19 + MUIテーブルコンポーネント実装
 *
 * 実装済み機能:
 * ✅ ページネーション機能
 * ✅ チェックボックス行選択機能
 * ✅ チェックボックス全選択機能
 * ✅ 行クリック選択機能
 * ✅ セルにコンポーネント埋め込み機能
 * ✅ スクロール機能
 * ✅ ラジオボタン選択機能
 * ✅ ソート機能
 * ✅ フィルター機能
 * ✅ セルスタイルカスタマイズ機能
 * ✅ アクセシビリティ対応
 * ✅ 型安全性とパフォーマンス最適化
 */

"use client";

import {
  Box,
  Paper,
  Table,
  TableBody,
  TableContainer,
  TablePagination,
  Typography,
} from "@mui/material";
import { useCallback, useEffect } from "react";
import { EnhancedTableHead } from "./_components/EnhancedTableHead";
import { EnhancedTableRow } from "./_components/EnhancedTableRow";
import { SelectionInfo } from "./_components/SelectionInfo";

// コンポーネント
import { TableFilters } from "./_components/TableFilters";
// カスタムフック
import { useTableData } from "./_hooks/useTableData";
import { useTablePagination } from "./_hooks/useTablePagination";
import { useTableSelection } from "./_hooks/useTableSelection";

export default function TablePage() {
  // カスタムフックで状態管理を分離
  const { data, filters, order, orderBy, updateFilter, handleSort } =
    useTableData();
  const {
    selected,
    radioSelected,
    handleSelectAll,
    toggleSelection,
    handleRadioSelect,
    isSelected,
    clearSelection,
  } = useTableSelection();
  const {
    page,
    rowsPerPage,
    paginatedData,
    totalCount,
    handleChangePage,
    handleChangeRowsPerPage,
    resetPage,
  } = useTablePagination(data);

  // フィルター変更時にページをリセット
  useEffect(() => {
    resetPage();
  }, [resetPage]);

  // イベントハンドラー
  const handleSelectAllClick = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const allIds = paginatedData.map((user) => user.id);
      handleSelectAll(event.target.checked, allIds);
    },
    [paginatedData, handleSelectAll],
  );

  const handleRowClick = useCallback(
    (id: number) => {
      toggleSelection(id);
    },
    [toggleSelection],
  );

  const handleDeleteSelected = useCallback(() => {
    alert(`Delete ${selected.length} selected items`);
    clearSelection();
  }, [selected.length, clearSelection]);

  // アクセシビリティとパフォーマンスの向上
  const tableId = "enhanced-data-table";
  const numSelected = selected.length;
  const rowCount = paginatedData.length;

  return (
    <Box component="main" sx={{ width: "100%", p: 3 }}>
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        id={`${tableId}-title`}
      >
        Advanced MUI Table (MCP Refactored)
      </Typography>

      {/* フィルターセクション */}
      <TableFilters filters={filters} onFilterChange={updateFilter} />

      {/* 選択情報 */}
      <SelectionInfo
        selectedCount={numSelected}
        radioSelected={radioSelected}
        onDeleteSelected={handleDeleteSelected}
        onClearSelection={clearSelection}
      />

      {/* テーブル */}
      <TableContainer
        component={Paper}
        sx={{ maxHeight: 600 }}
        aria-labelledby={`${tableId}-title`}
      >
        <Table stickyHeader aria-label="enhanced data table" id={tableId}>
          <EnhancedTableHead
            numSelected={numSelected}
            rowCount={rowCount}
            order={order}
            orderBy={orderBy}
            onSelectAllClick={handleSelectAllClick}
            onRequestSort={handleSort}
          />
          <TableBody>
            {paginatedData.map((user) => (
              <EnhancedTableRow
                key={user.id}
                user={user}
                isSelected={isSelected(user.id)}
                isRadioSelected={radioSelected === user.id}
                onRowClick={handleRowClick}
                onCheckboxChange={toggleSelection}
                onRadioChange={handleRadioSelect}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* ページネーション */}
      <TablePagination
        rowsPerPageOptions={[5, 10, 25, 50]}
        component="div"
        count={totalCount}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        aria-label="table pagination"
        showFirstButton
        showLastButton
      />
    </Box>
  );
}
