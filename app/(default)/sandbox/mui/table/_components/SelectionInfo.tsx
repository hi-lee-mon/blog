"use client";

import { Button, Paper, Typography } from "@mui/material";

interface SelectionInfoProps {
  selectedCount: number;
  radioSelected: number | null;
  onDeleteSelected: () => void;
  onClearSelection: () => void;
}

export const SelectionInfo: React.FC<SelectionInfoProps> = ({
  selectedCount,
  radioSelected,
  onDeleteSelected,
  onClearSelection,
}) => {
  if (selectedCount === 0 && radioSelected === null) {
    return null;
  }

  return (
    <>
      {/* 選択されたアイテムのアクションバー */}
      {selectedCount > 0 && (
        <Paper sx={{ p: 2, mb: 2, backgroundColor: "action.selected" }}>
          <Typography variant="subtitle1">
            {selectedCount} row(s) selected
          </Typography>
          <Button
            variant="contained"
            color="error"
            size="small"
            sx={{ mt: 1, mr: 1 }}
            onClick={onDeleteSelected}
          >
            Delete Selected
          </Button>
          <Button
            variant="outlined"
            size="small"
            sx={{ mt: 1 }}
            onClick={onClearSelection}
          >
            Clear Selection
          </Button>
        </Paper>
      )}

      {/* 選択状態の表示 */}
      <Paper sx={{ p: 2, mt: 2 }}>
        <Typography variant="h6" gutterBottom>
          Selection Status
        </Typography>
        <Typography variant="body2">
          Checkbox Selected:{" "}
          {selectedCount > 0 ? `${selectedCount} items` : "None"}
        </Typography>
        <Typography variant="body2">
          Radio Selected: {radioSelected || "None"}
        </Typography>
      </Paper>
    </>
  );
};
