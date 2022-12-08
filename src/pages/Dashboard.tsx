import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Box, Paper, Typography, CircularProgress } from "@mui/material";

import { IUsers, IUsersMap } from "../types/dashboard.types";
import { useFetchData } from "../hooks/useFetchData";
import Users from "../components/Users";
import SearchBar from "../components/SearchBar";

const rowsPerPage = 10;

const Dashboard = () => {
  const { fetchStatus, data } = useFetchData(
    "https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json"
  );

  const [users, setUsers] = useState<IUsersMap>({});
  const [page, setPage] = useState<number>(1);

  const handleSearch = useCallback(
    (searchValue: string) => {
      let dataCopy: IUsersMap = {};
      if (searchValue) {
        const filteredValues = Object.values(data).filter(
          (item) =>
            item.name.toLowerCase().includes(searchValue.toLowerCase()) ||
            item.email.toLowerCase().includes(searchValue.toLowerCase()) ||
            item.role.toLowerCase().includes(searchValue.toLowerCase())
        );

        filteredValues.forEach((ele) => {
          dataCopy[ele.id] = ele;
        });
        setUsers(dataCopy);
      } else {
        setUsers(data);
      }
    },
    [data]
  );

  const handleDeleteUser = useCallback(
    (id: string) => {
      const usersCopy = { ...users };
      delete usersCopy[id];
      setUsers(usersCopy);
    },
    [users]
  );

  const handleDeleteSelectedUsers = useCallback(() => {
    const usersCopy = { ...users };

    Object.values(usersCopy).forEach((user) => {
      if (user.isSelected) {
        delete usersCopy[user.id];
      }
    });

    setUsers(usersCopy);
  }, [users]);

  const handleUpdateUserDetails = useCallback(
    (id: string, updatedData: IUsers) => {
      const usersCopy = { ...users };
      usersCopy[id] = { ...usersCopy[id], ...updatedData };
      setUsers(usersCopy);
    },
    [users]
  );

  const getPaginatedData = useMemo(() => {
    return Object.values(users).slice(
      (page - 1) * rowsPerPage,
      (page - 1) * rowsPerPage + rowsPerPage
    );
  }, [page, users]);

  const getIsAllRowsSelectedOnPage = useCallback(() => {
    let count = 0;
    getPaginatedData.forEach((user) => {
      if (user.isSelected) {
        count += 1;
      }
    });

    if (count === getPaginatedData.length) {
      return true;
    }

    return false;
  }, [getPaginatedData]);

  const toggleAllUsersSelection = useCallback(() => {
    const paginatedData = getPaginatedData;
    const usersCopy = { ...users };

    if (getIsAllRowsSelectedOnPage()) {
      paginatedData.forEach((user) => {
        usersCopy[user.id].isSelected = false;
      });
    } else {
      paginatedData.forEach((user) => {
        usersCopy[user.id].isSelected = true;
      });
    }
    setUsers(usersCopy);
  }, [getIsAllRowsSelectedOnPage, getPaginatedData, users]);

  const toggleUserSelection = useCallback(
    (user: IUsers) => {
      const usersCopy = { ...users };
      usersCopy[user.id].isSelected = !usersCopy[user.id].isSelected;
      setUsers(usersCopy);
    },
    [users]
  );

  const handlePageChange = useCallback(
    (event: React.ChangeEvent<unknown>, value: number) => {
      setPage(value);
    },
    []
  );

  useEffect(() => {
    if (fetchStatus === "fulfilled") {
      setUsers(data);
    }
  }, [data, fetchStatus]);

  // Loading State
  if (fetchStatus === "pending") {
    return (
      <Box
        sx={{
          width: "100%",
          height: "90vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // Error State
  if (fetchStatus === "rejected") {
    return (
      <Typography sx={{ color: "error.main" }}>
        Something went wrong. Failed to fetch users data.
      </Typography>
    );
  }

  return (
    <Box component="section" id="usersList" sx={{ p: 4 }}>
      <Paper
        component="form"
        sx={{
          py: 0.5,
          mb: 2,
        }}
      >
        <SearchBar handleSearch={handleSearch} />
      </Paper>
      <Users
        usersData={users}
        handleDeleteUser={handleDeleteUser}
        handleDeleteSelectedUsers={handleDeleteSelectedUsers}
        handleUpdateUserDetails={handleUpdateUserDetails}
        toggleAllUsersSelection={toggleAllUsersSelection}
        toggleUserSelection={toggleUserSelection}
        getIsAllRowSelectedOnPage={getIsAllRowsSelectedOnPage}
        paginationDetails={{
          page,
          rowsPerPage,
          handlePageChange,
        }}
      />
    </Box>
  );
};

export default Dashboard;
