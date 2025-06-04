import { useState, useEffect } from "react";
import { Box, Typography, useTheme, IconButton, Tooltip } from "@mui/material";
import { Header } from "../../components";
import { DataGrid } from "@mui/x-data-grid";
// import { mockDataTeam } from "../../data/mockData";
import { tokens } from "../../theme";
import {
  AdminPanelSettingsOutlined,
  LockOpenOutlined,
  SecurityOutlined,
  DeleteOutline,
} from "@mui/icons-material";

import api from "../../../api/axios";

const Users = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get("/admin/summary");
        const formattedUsers = response.data.users.map((user, index) => ({
          id: user._id || index, // DataGrid needs an 'id' field
          name: user.name,
          email: user.email,
          access: user.role || "user",
        }));
        setUsers(formattedUsers);
      } catch (error) {
        if (error.response) {
          console.error("Error status:", error.response.status);
          console.error("Error data:", error.response.data);
        } else {
          console.error("Network or config error:", error.message);
        }
      }
    };
    fetchUsers();
  }, []);

  const columns = [
    { field: "id", headerName: "ID", width: 250 },
    {
      field: "name",
      headerName: "Name",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    // {
    //   field: "age",
    //   headerName: "Age",
    //   type: "number",
    //   headerAlign: "left",
    //   align: "left",
    // },
    // { field: "phone", headerName: "Phone Number", flex: 1 },
    { field: "email", headerName: "Email", flex: 1 },
    {
      field: "access",
      headerName: "Access Level",
      flex: 1,
      renderCell: ({ row: { access } }) => {
        return (
          <Box
            width="120px"
            p={1}
            display="flex"
            alignItems="center"
            justifyContent="center"
            gap={1}
            bgcolor={
              access === "admin"
                ? colors.greenAccent[600]
                : colors.greenAccent[700]
            }
            borderRadius={1}
          >
            {access === "admin" && <AdminPanelSettingsOutlined />}
            {access === "manager" && <SecurityOutlined />}
            {access === "user" && <LockOpenOutlined />}
            <Typography textTransform="capitalize">{access}</Typography>
          </Box>
        );
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 0.5,
      sortable: false,
      renderCell: ({ row }) => (
        <Tooltip title="Delete User">
          <IconButton
            onClick={async () => {
              if (confirm(`Are you sure you want to delete ${row.name}?`)) {
                try {
                  await api.delete(`/auth/delete-user/${row.id}`);
                  setUsers((prev) => prev.filter((u) => u.id !== row.id));
                } catch (err) {
                  console.error("Failed to delete user:", err);
                  alert("Error deleting user.");
                }
              }
            }}
            color="error"
          >
            <DeleteOutline />
          </IconButton>
        </Tooltip>
      ),
    },
  ];
  return (
    <Box m="20px">
      <Header title="Users" subtitle="Manage Users" />
      <Box
        mt="40px"
        height="75vh"
        flex={1}
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            border: "none",
          },
          "& .name-column--cell": {
            color: colors.greenAccent[300],
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.blueAccent[700],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.blueAccent[700],
          },
          "& .MuiCheckbox-root": {
            color: `${colors.greenAccent[200]} !important`,
          },
          "& .MuiDataGrid-iconSeparator": {
            color: colors.primary[100],
          },
        }}
      >
        <DataGrid
          rows={users}
          columns={columns}
          pageSizeOptions={[10, 25, 50]}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 10,
              },
            },
          }}
          checkboxSelection
        />
      </Box>
    </Box>
  );
};

export default Users;
