"use client";

import {
  Checkbox,
  Chip,
  FormControlLabel,
  Radio,
  RadioGroup,
  TableRow,
} from "@mui/material";
import type { User } from "../_types";
import { ActionButtons } from "./ActionButtons";
import { StatusChip } from "./StatusChip";
import { StyledTableCell } from "./StyledTableCell";

interface EnhancedTableRowProps {
  user: User;
  isSelected: boolean;
  isRadioSelected: boolean;
  onRowClick: (id: number) => void;
  onCheckboxChange: (id: number) => void;
  onRadioChange: (id: number) => void;
}

export const EnhancedTableRow: React.FC<EnhancedTableRowProps> = ({
  user,
  isSelected,
  isRadioSelected,
  onRowClick,
  onCheckboxChange,
  onRadioChange,
}) => {
  const handleRowClick = () => {
    onRowClick(user.id);
  };

  const handleCheckboxClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    onCheckboxChange(user.id);
  };

  const handleRadioClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    onRadioChange(user.id);
  };

  return (
    <TableRow
      hover
      selected={isSelected}
      onClick={handleRowClick}
      sx={{ cursor: "pointer" }}
      aria-checked={isSelected}
      tabIndex={-1}
    >
      <StyledTableCell
        padding="checkbox"
        className={isSelected ? "selected" : ""}
      >
        <Checkbox
          color="primary"
          checked={isSelected}
          onClick={handleCheckboxClick}
          inputProps={{
            "aria-labelledby": `enhanced-table-checkbox-${user.id}`,
          }}
        />
      </StyledTableCell>
      <StyledTableCell
        padding="checkbox"
        className={isSelected ? "selected" : ""}
      >
        <RadioGroup
          value={isRadioSelected ? user.id.toString() : ""}
          onChange={() => onRadioChange(user.id)}
        >
          <FormControlLabel
            value={user.id.toString()}
            control={<Radio size="small" />}
            label=""
            onClick={handleRadioClick}
          />
        </RadioGroup>
      </StyledTableCell>
      <StyledTableCell
        className={`${isSelected ? "selected" : ""} ${`status-${user.status}`}`}
        component="th"
        id={`enhanced-table-checkbox-${user.id}`}
        scope="row"
      >
        {user.id}
      </StyledTableCell>
      <StyledTableCell className={isSelected ? "selected" : ""}>
        {user.name}
      </StyledTableCell>
      <StyledTableCell className={isSelected ? "selected" : ""}>
        {user.email}
      </StyledTableCell>
      <StyledTableCell className={isSelected ? "selected" : ""}>
        {user.age}
      </StyledTableCell>
      <StyledTableCell className={isSelected ? "selected" : ""}>
        {user.department}
      </StyledTableCell>
      <StyledTableCell className={isSelected ? "selected" : ""}>
        <StatusChip status={user.status} />
      </StyledTableCell>
      <StyledTableCell className={isSelected ? "selected" : ""}>
        <Chip label={user.role} variant="outlined" size="small" />
      </StyledTableCell>
      <StyledTableCell
        className={isSelected ? "selected" : ""}
        onClick={(e) => e.stopPropagation()}
      >
        <ActionButtons userId={user.id} />
      </StyledTableCell>
    </TableRow>
  );
};
