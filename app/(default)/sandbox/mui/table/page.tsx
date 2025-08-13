"use client";

import { Delete, Edit, Visibility } from "@mui/icons-material";
import {
  Box,
  Button,
  Checkbox,
  Chip,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Paper,
  Radio,
  RadioGroup,
  Select,
  styled,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  TextField,
  Typography,
} from "@mui/material";
import { useMemo, useState } from "react";

// サンプルデータの型定義
interface User {
  id: number;
  name: string;
  email: string;
  age: number;
  department: string;
  status: "active" | "inactive" | "pending";
  role: "admin" | "user" | "manager";
}

// サンプルデータ
const createSampleData = (): User[] => {
  const departments = ["Engineering", "Marketing", "Sales", "HR", "Finance"];
  const statuses: User["status"][] = ["active", "inactive", "pending"];
  const roles: User["role"][] = ["admin", "user", "manager"];

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

// カスタムスタイル付きTableCell
const StyledTableCell = styled(TableCell)(({ theme }) => ({
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

// ソート方向の型
type Order = "asc" | "desc";

export default function TablePage() {
  const [data] = useState<User[]>(createSampleData());
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selected, setSelected] = useState<number[]>([]);
  const [radioSelected, setRadioSelected] = useState<number | null>(null);
  const [order, setOrder] = useState<Order>("asc");
  const [orderBy, setOrderBy] = useState<keyof User>("id");
  const [filters, setFilters] = useState({
    name: "",
    department: "",
    status: "",
  });

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

  // ページネーション適用
  const paginatedData = useMemo(() => {
    const startIndex = page * rowsPerPage;
    return sortedData.slice(startIndex, startIndex + rowsPerPage);
  }, [sortedData, page, rowsPerPage]);

  // チェックボックス選択処理
  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = paginatedData.map((user) => user.id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (id: number) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected: number[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    setSelected(newSelected);
  };

  // ソート処理
  const handleRequestSort = (property: keyof User) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  // ページネーション処理
  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // フィルター処理
  const handleFilterChange = (field: keyof typeof filters, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
    setPage(0); // フィルター変更時はページをリセット
  };

  // アクションボタン
  const ActionButtons = ({ userId }: { userId: number }) => (
    <Box sx={{ display: "flex", gap: 1 }}>
      <Button
        size="small"
        variant="outlined"
        startIcon={<Visibility />}
        onClick={() => alert(`View user ${userId}`)}
      >
        View
      </Button>
      <Button
        size="small"
        variant="outlined"
        startIcon={<Edit />}
        onClick={() => alert(`Edit user ${userId}`)}
      >
        Edit
      </Button>
      <Button
        size="small"
        variant="outlined"
        color="error"
        startIcon={<Delete />}
        onClick={() => alert(`Delete user ${userId}`)}
      >
        Delete
      </Button>
    </Box>
  );

  // ステータスチップ
  const StatusChip = ({ status }: { status: User["status"] }) => {
    const getColor = (status: User["status"]) => {
      switch (status) {
        case "active":
          return "success";
        case "inactive":
          return "error";
        case "pending":
          return "warning";
        default:
          return "default";
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

  const isSelected = (id: number) => selected.indexOf(id) !== -1;
  const numSelected = selected.length;
  const rowCount = paginatedData.length;

  return (
    <Box sx={{ width: "100%", p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Advanced MUI Table
      </Typography>

      {/* フィルターセクション */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="h6" gutterBottom>
          Filters
        </Typography>
        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
          <TextField
            label="Search Name"
            variant="outlined"
            size="small"
            value={filters.name}
            onChange={(e) => handleFilterChange("name", e.target.value)}
            sx={{ minWidth: 200 }}
          />
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Department</InputLabel>
            <Select
              value={filters.department}
              label="Department"
              onChange={(e) => handleFilterChange("department", e.target.value)}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="Engineering">Engineering</MenuItem>
              <MenuItem value="Marketing">Marketing</MenuItem>
              <MenuItem value="Sales">Sales</MenuItem>
              <MenuItem value="HR">HR</MenuItem>
              <MenuItem value="Finance">Finance</MenuItem>
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={filters.status}
              label="Status"
              onChange={(e) => handleFilterChange("status", e.target.value)}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="inactive">Inactive</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Paper>

      {/* 選択情報 */}
      {numSelected > 0 && (
        <Paper sx={{ p: 2, mb: 2, backgroundColor: "action.selected" }}>
          <Typography variant="subtitle1">
            {numSelected} row(s) selected
          </Typography>
          <Button
            variant="contained"
            color="error"
            size="small"
            sx={{ mt: 1 }}
            onClick={() => {
              alert(`Delete ${numSelected} selected items`);
              setSelected([]);
            }}
          >
            Delete Selected
          </Button>
        </Paper>
      )}

      {/* テーブル */}
      <TableContainer component={Paper} sx={{ maxHeight: 600 }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <StyledTableCell className="header" padding="checkbox">
                <Checkbox
                  color="default"
                  indeterminate={numSelected > 0 && numSelected < rowCount}
                  checked={rowCount > 0 && numSelected === rowCount}
                  onChange={handleSelectAllClick}
                />
              </StyledTableCell>
              <StyledTableCell className="header" padding="checkbox">
                Radio
              </StyledTableCell>
              <StyledTableCell className="header">
                <TableSortLabel
                  active={orderBy === "id"}
                  direction={orderBy === "id" ? order : "asc"}
                  onClick={() => handleRequestSort("id")}
                  sx={{ color: "inherit !important" }}
                >
                  ID
                </TableSortLabel>
              </StyledTableCell>
              <StyledTableCell className="header">
                <TableSortLabel
                  active={orderBy === "name"}
                  direction={orderBy === "name" ? order : "asc"}
                  onClick={() => handleRequestSort("name")}
                  sx={{ color: "inherit !important" }}
                >
                  Name
                </TableSortLabel>
              </StyledTableCell>
              <StyledTableCell className="header">Email</StyledTableCell>
              <StyledTableCell className="header">
                <TableSortLabel
                  active={orderBy === "age"}
                  direction={orderBy === "age" ? order : "asc"}
                  onClick={() => handleRequestSort("age")}
                  sx={{ color: "inherit !important" }}
                >
                  Age
                </TableSortLabel>
              </StyledTableCell>
              <StyledTableCell className="header">
                <TableSortLabel
                  active={orderBy === "department"}
                  direction={orderBy === "department" ? order : "asc"}
                  onClick={() => handleRequestSort("department")}
                  sx={{ color: "inherit !important" }}
                >
                  Department
                </TableSortLabel>
              </StyledTableCell>
              <StyledTableCell className="header">Status</StyledTableCell>
              <StyledTableCell className="header">Role</StyledTableCell>
              <StyledTableCell className="header">Actions</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData.map((user) => {
              const isItemSelected = isSelected(user.id);
              const isRadioSelected = radioSelected === user.id;

              return (
                <TableRow
                  hover
                  key={user.id}
                  selected={isItemSelected}
                  onClick={() => handleClick(user.id)}
                  sx={{ cursor: "pointer" }}
                >
                  <StyledTableCell
                    padding="checkbox"
                    className={isItemSelected ? "selected" : ""}
                  >
                    <Checkbox
                      color="primary"
                      checked={isItemSelected}
                      onClick={(e) => e.stopPropagation()}
                      onChange={() => handleClick(user.id)}
                    />
                  </StyledTableCell>
                  <StyledTableCell
                    padding="checkbox"
                    className={isItemSelected ? "selected" : ""}
                  >
                    <RadioGroup
                      value={radioSelected?.toString() || ""}
                      onChange={(e) => setRadioSelected(Number(e.target.value))}
                    >
                      <FormControlLabel
                        value={user.id.toString()}
                        control={<Radio size="small" />}
                        label=""
                        onClick={(e) => e.stopPropagation()}
                      />
                    </RadioGroup>
                  </StyledTableCell>
                  <StyledTableCell
                    className={`${isItemSelected ? "selected" : ""} ${`status-${user.status}`}`}
                  >
                    {user.id}
                  </StyledTableCell>
                  <StyledTableCell className={isItemSelected ? "selected" : ""}>
                    {user.name}
                  </StyledTableCell>
                  <StyledTableCell className={isItemSelected ? "selected" : ""}>
                    {user.email}
                  </StyledTableCell>
                  <StyledTableCell className={isItemSelected ? "selected" : ""}>
                    {user.age}
                  </StyledTableCell>
                  <StyledTableCell className={isItemSelected ? "selected" : ""}>
                    {user.department}
                  </StyledTableCell>
                  <StyledTableCell className={isItemSelected ? "selected" : ""}>
                    <StatusChip status={user.status} />
                  </StyledTableCell>
                  <StyledTableCell className={isItemSelected ? "selected" : ""}>
                    <Chip label={user.role} variant="outlined" size="small" />
                  </StyledTableCell>
                  <StyledTableCell
                    className={isItemSelected ? "selected" : ""}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <ActionButtons userId={user.id} />
                  </StyledTableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {/* ページネーション */}
      <TablePagination
        rowsPerPageOptions={[5, 10, 25, 50]}
        component="div"
        count={sortedData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      {/* 選択状態の表示 */}
      <Paper sx={{ p: 2, mt: 2 }}>
        <Typography variant="h6" gutterBottom>
          Selection Status
        </Typography>
        <Typography variant="body2">
          Checkbox Selected:{" "}
          {selected.length > 0 ? selected.join(", ") : "None"}
        </Typography>
        <Typography variant="body2">
          Radio Selected: {radioSelected || "None"}
        </Typography>
      </Paper>
    </Box>
  );
}
