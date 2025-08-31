"use client";

import { styled, TableCell } from "@mui/material";

export const StyledTableCell = styled(TableCell)(({ theme }) => ({
  "&.header": {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    fontWeight: "bold",
  },
  "&.selected": {
    backgroundColor: theme.palette.action.selected,
  },
  "&.status-active": {
    backgroundColor: "#e8f5e8",
  },
  "&.status-inactive": {
    backgroundColor: "#ffeaea",
  },
  "&.status-pending": {
    backgroundColor: "#fff3cd",
  },
}));
