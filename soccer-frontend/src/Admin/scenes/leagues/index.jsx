import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Avatar,
  useTheme,
  Tooltip,
  IconButton,
} from "@mui/material";
import { Header } from "../../components";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import {
  DeleteOutline,
  Edit,
  Add as AddIcon,
  Visibility,
} from "@mui/icons-material";
import api from "../../../api/axios";
import AddLeagueModal from "./AddLeagueModal";
import UpdateLeagueModal from "./UpdateLeagueModal";
import ViewLeagueModal from "./ViewLeagueModal";

const Leagues = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [leagues, setLeagues] = useState([]);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [selectedLeague, setSelectedLeague] = useState(null);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [selectedViewLeague, setSelectedViewLeague] = useState(null);

  // Fetch leagues
  const fetchLeagues = async () => {
    try {
      const response = await api.get("/league"); // Your leagues route
      const formattedLeagues = response.data.map((league, index) => ({
        id: league._id || index,
        name: league.name,
        country: league.country,
        logo: league.logo?.url || "",
      }));
      setLeagues(formattedLeagues);
    } catch (error) {
      console.error(error.message, "Failed to load leagues");
    }
  };

  const handleViewLeague = async (row) => {
    try {
      const res = await api.get(`/league/get-league/${row.id}`);
      setSelectedViewLeague(res.data);
      setOpenViewModal(true);
    } catch (err) {
      console.error("Failed to load league details:", err);
    }
  };

  const handleEditLeague = (league) => {
    setSelectedLeague(league);
    setOpenUpdateModal(true);
  };

  const handleDeleteLeague = async (league) => {
    if (confirm(`Delete league ${league.name}?`)) {
      try {
        await api.delete(`/league/remove-league/${league.id}`);
        fetchLeagues();
      } catch (err) {
        console.error("Delete failed:", err);
      }
    }
  };

  // Add League
  const handleAddLeague = async (formData) => {
    try {
      await api.post("/league/add-league", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      fetchLeagues();
      setOpenAddModal(false);
    } catch (error) {
      console.error("Error adding league:", error);
    }
  };

  // Update League
  const handleUpdateLeague = async (leagueId, formData) => {
    try {
      await api.patch(`/league/update-league/${leagueId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      fetchLeagues();
      setOpenUpdateModal(false);
      setSelectedLeague(null);
    } catch (error) {
      console.error("Error updating league:", error);
    }
  };

  const columns = [
    { field: "id", headerName: "ID", width: 200 },
    {
      field: "name",
      headerName: "Name",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "country",
      headerName: "Country",
      flex: 1,
    },
    {
      field: "logo",
      headerName: "Logo",
      width: 90,
      sortable: false,
      renderCell: ({ value }) => (
        <Avatar src={value} alt="League Logo" sx={{ width: 40, height: 40 }} />
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      minWidth: 120,
      flex: 0,
      sortable: false,
      renderCell: ({ row }) => (
        <>
          <Tooltip title="View League">
            <IconButton onClick={() => handleViewLeague(row)} color="primary">
              <Visibility />
            </IconButton>
          </Tooltip>
          <Tooltip title="Edit League">
            <IconButton onClick={() => handleEditLeague(row)} color="info">
              <Edit />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete League">
            <IconButton onClick={() => handleDeleteLeague(row)} color="error">
              <DeleteOutline />
            </IconButton>
          </Tooltip>
        </>
      ),
    },
  ];

  useEffect(() => {
    fetchLeagues();
  }, []);

  return (
    <Box m="20px">
      <Header title="Leagues" subtitle="List of Soccer Leagues" />
      <Button
        variant="contained"
        color="success"
        sx={{ mb: 2 }}
        startIcon={<AddIcon />}
        onClick={() => setOpenAddModal(true)}
      >
        Add New League
      </Button>

      <AddLeagueModal
        open={openAddModal}
        onClose={() => setOpenAddModal(false)}
        refreshLeagues={fetchLeagues}
        onSubmit={handleAddLeague}
      />

      <UpdateLeagueModal
        open={openUpdateModal}
        onClose={() => setOpenUpdateModal(false)}
        league={selectedLeague}
        onSubmit={handleUpdateLeague}
      />

      <ViewLeagueModal
        open={openViewModal}
        onClose={() => setOpenViewModal(false)}
        league={selectedViewLeague}
      />

      <Box
        mt="40px"
        height="75vh"
        maxWidth="100%"
        sx={{
          "& .MuiDataGrid-root": { border: "none", minWidth: 900 },
          "& .MuiDataGrid-cell": { border: "none" },
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
          rows={leagues}
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

export default Leagues;
