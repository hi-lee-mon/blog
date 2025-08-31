"use client";

import { Chip } from "@mui/material";
import type { User } from "../_types";

interface StatusChipProps {
  status: User["status"];
}

export const StatusChip: React.FC<StatusChipProps> = ({ status }) => {
  const getColor = (status: User["status"]) => {
    switch (status) {
      case "active":
        return "success" as const;
      case "inactive":
        return "error" as const;
      case "pending":
        return "warning" as const;
      default:
        return "default" as const;
    }
  };

  return (
    <Chip
      label={status.charAt(0).toUpperCase() + status.slice(1)}
      color={getColor(status)}
      size="small"
    />
  );
};
