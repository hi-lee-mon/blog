"use client";

import { Checkbox, TableHead, TableRow, TableSortLabel } from "@mui/material";
import type { Order, User } from "../_types";
import { StyledTableCell } from "./StyledTableCell";

interface EnhancedTableHeadProps {
  numSelected: number;
  rowCount: number;
  order: Order;
  orderBy: keyof User;
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onRequestSort: (property: keyof User) => void;
}

export const EnhancedTableHead: React.FC<EnhancedTableHeadProps> = ({
  numSelected,
  rowCount,
  order,
  orderBy,
  onSelectAllClick,
  onRequestSort,
}) => {
  const createSortHandler = (property: keyof User) => () => {
    onRequestSort(property);
  };

  const headCells: Array<{
    id: keyof User;
    label: string;
    sortable: boolean;
  }> = [
    { id: "id", label: "ID", sortable: true },
    { id: "name", label: "Name", sortable: true },
    { id: "email", label: "Email", sortable: false },
    { id: "age", label: "Age", sortable: true },
    { id: "department", label: "Department", sortable: true },
    { id: "status", label: "Status", sortable: false },
    { id: "role", label: "Role", sortable: false },
  ];

  return (
    <TableHead>
      <TableRow>
        <StyledTableCell className="header" padding="checkbox">
          <Checkbox
            color="default"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              "aria-label": "select all users",
            }}
          />
        </StyledTableCell>
        <StyledTableCell className="header" padding="checkbox">
          Radio
        </StyledTableCell>
        {headCells.map((headCell) => (
          <StyledTableCell key={headCell.id} className="header">
            {headCell.sortable ? (
              <TableSortLabel
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : "asc"}
                onClick={createSortHandler(headCell.id)}
                sx={{ color: "inherit !important" }}
              >
                {headCell.label}
              </TableSortLabel>
            ) : (
              headCell.label
            )}
          </StyledTableCell>
        ))}
        <StyledTableCell className="header">Actions</StyledTableCell>
      </TableRow>
    </TableHead>
  );
};
