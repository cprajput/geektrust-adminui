import {
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  Checkbox,
  TableBody,
  IconButton,
  Box,
  Button,
  Pagination,
  Typography,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import React, { useCallback, useState } from "react";
import { IUsers, IUsersMap } from "../types/dashboard.types";
import EditUserDetails from "./EditUserDetails";

interface IProps {
  usersData: IUsersMap;
  handleDeleteUser: (id: string) => void;
  handleDeleteSelectedUsers: () => void;
  handleUpdateUserDetails: (id: string, updatedData: IUsers) => void;
  toggleAllUsersSelection: () => void;
  toggleUserSelection: (user: IUsers) => void;
  getIsAllRowSelectedOnPage: () => boolean;
  paginationDetails: {
    page: number;
    rowsPerPage: number;
    handlePageChange: (
      event: React.ChangeEvent<unknown>,
      value: number
    ) => void;
  };
}

const tableHeaderColumns = [
  { id: "name", label: "Name" },
  { id: "email", label: "Email" },
  { id: "role", label: "Role" },
  { id: "actions", label: "Actions" },
];

const Users: React.FC<IProps> = (props) => {
  const {
    usersData,
    handleDeleteUser,
    handleDeleteSelectedUsers,
    handleUpdateUserDetails,
    paginationDetails,
    toggleAllUsersSelection,
    toggleUserSelection,
    getIsAllRowSelectedOnPage,
  } = props;
  const { page, rowsPerPage, handlePageChange } = paginationDetails;

  const [open, setOpen] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<IUsers | null>(null);

  const handleClickOpen = (user: IUsers) => {
    setOpen(true);
    setCurrentUser(user);
  };

  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);

  return (
    <Paper sx={{ width: "100%" }}>
      <TableContainer>
        <Table aria-labelledby="users table" size="medium" stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  color="primary"
                  inputProps={{
                    "aria-label": "select all users",
                  }}
                  checked={getIsAllRowSelectedOnPage()}
                  onChange={toggleAllUsersSelection}
                />
              </TableCell>
              {tableHeaderColumns.map((col) => (
                <TableCell
                  padding="checkbox"
                  key={col.id}
                  sx={{ fontWeight: "fontWeightBold" }}
                >
                  {col.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.values(usersData)
              .slice(
                (page - 1) * rowsPerPage,
                (page - 1) * rowsPerPage + rowsPerPage
              )
              .map((user) => (
                <TableRow
                  key={user.id}
                  sx={{
                    ...(user.isSelected && { backgroundColor: "grey.100" }),
                  }}
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      color="primary"
                      inputProps={{
                        "aria-label": "select all users",
                      }}
                      checked={user.isSelected}
                      onChange={() => toggleUserSelection(user)}
                    />
                  </TableCell>
                  {tableHeaderColumns.map((col) => (
                    <TableCell padding="checkbox" key={col.id}>
                      {col.id === "actions" ? (
                        <>
                          <IconButton
                            sx={{ color: "grey.500" }}
                            onClick={() => handleClickOpen(user)}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            sx={{ color: "error.main" }}
                            onClick={() => handleDeleteUser(user.id)}
                          >
                            <DeleteOutlineIcon />
                          </IconButton>
                        </>
                      ) : (
                        user[col.id as keyof IUsers]
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      {Object.values(usersData).length ? (
        <Box
          sx={{
            width: "100%",
            height: "10%",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
          component="footer"
        >
          <Button
            variant="contained"
            size="small"
            sx={{ mx: 1, textTransform: "none", backgroundColor: "error.main" }}
            onClick={handleDeleteSelectedUsers}
          >
            Delete Selected
          </Button>
          <Pagination
            count={Math.ceil(Object.keys(usersData).length / rowsPerPage)}
            variant="outlined"
            color="primary"
            showLastButton
            showFirstButton
            size="small"
            sx={{ p: 1 }}
            page={page || 1}
            onChange={handlePageChange}
          />
        </Box>
      ) : (
        <Box
          sx={{
            width: "100%",
            height: "10%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Typography sx={{ color: "error.main" }}>No record found</Typography>
        </Box>
      )}

      {open && currentUser && (
        <EditUserDetails
          open={open}
          handleUpdateUserDetails={handleUpdateUserDetails}
          handleClose={handleClose}
          data={currentUser}
        />
      )}
    </Paper>
  );
};

export default Users;
