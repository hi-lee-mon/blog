"use client";

import { Delete, Edit, Visibility } from "@mui/icons-material";
import { Box, Button } from "@mui/material";

interface ActionButtonsProps {
  userId: number;
  onView?: (id: number) => void;
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  userId,
  onView,
  onEdit,
  onDelete,
}) => {
  const handleView = () => {
    if (onView) {
      onView(userId);
    } else {
      alert(`View user ${userId}`);
    }
  };

  const handleEdit = () => {
    if (onEdit) {
      onEdit(userId);
    } else {
      alert(`Edit user ${userId}`);
    }
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(userId);
    } else {
      alert(`Delete user ${userId}`);
    }
  };

  return (
    <Box sx={{ display: "flex", gap: 1 }}>
      <Button
        size="small"
        variant="outlined"
        startIcon={<Visibility />}
        onClick={handleView}
      >
        View
      </Button>
      <Button
        size="small"
        variant="outlined"
        startIcon={<Edit />}
        onClick={handleEdit}
      >
        Edit
      </Button>
      <Button
        size="small"
        variant="outlined"
        color="error"
        startIcon={<Delete />}
        onClick={handleDelete}
      >
        Delete
      </Button>
    </Box>
  );
};
