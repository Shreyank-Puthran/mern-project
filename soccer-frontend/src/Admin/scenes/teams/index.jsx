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
  Visibility,
  Edit,
  Add as AddIcon,
} from "@mui/icons-material";
import api from "../../../api/axios";
import AddTeamModal from "./AddTeamModal"; // Make sure this path is correct
import UpdateTeamModal from "./UpdateTeamModal";

const Teams = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [error, setError] = useState("");
  const [teams, setTeams] = useState([]);
  const [leagues, setLeagues] = useState([]);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState(null);
  // Fetch teams for the table
  const fetchTeams = async () => {
    try {
      const response = await api.get("/admin/summary");
      const formattedTeams = response.data.teams.map((team, index) => ({
        id: team._id || index,
        name: team.name,
        country: team.country,
        image: team.logoUrl,
        league: team.league?.name,
        leagueId: team.league?._id,
      }));
      setTeams(formattedTeams);
    } catch (error) {
      console.log(error.message, "Failed to load teams");
      setError(error.message)
    }
  };

  const handleEditTeam = (team) => {
    setSelectedTeam(team);
    setOpenUpdateModal(true);
  };

  const handleDeleteTeam = async (team) => {
    if (confirm(`Delete team ${team.name}?`)) {
      try {
        await api.delete(`/teams/remove-team/${team.id}`);
        fetchTeams();
      } catch (err) {
        console.error("Delete failed:", err);
      }
    }
  };

  // Fetch leagues for AddTeamModal dropdown
  const fetchLeagues = async () => {
    try {
      const res = await api.get("/league");
      setLeagues(res.data);
    } catch (error) {
      console.error("Failed to load leagues:", error);
    }
  };

  useEffect(() => {
    fetchTeams();
    fetchLeagues();
  }, []);

  // Handle add team form submit from AddTeamModal
  const handleAddTeam = async (formData) => {
    try {
      const res = await api.post("/teams/add-team", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      // Refresh teams list after adding
      fetchTeams();
      setOpenAddModal(false);
    } catch (error) {
      console.error("Error adding team:", error);
    }
  };

  const handleUpdateTeam = async (teamId, formData) => {
    try {
      await api.patch(`/teams/update-team/${teamId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      fetchTeams(); // Refresh the table
      setOpenUpdateModal(false);
    } catch (error) {
      console.error("Error updating team:", error);
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
      field: "league",
      headerName: "League",
      flex: 1,
    },
    {
      field: "image",
      headerName: "Logo",
      width: 90,
      sortable: false,
      renderCell: ({ value }) => (
        <Avatar src={value} alt="Team Logo" sx={{ width: 40, height: 40 }} />
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      minWidth: 80,
      flex: 0,
      sortable: false,
      renderCell: ({ row }) => (
        <>
          {/* <Tooltip title="View Player">
            <IconButton onClick={() => handleViewPlayer(row)} color="primary">
              <Visibility />
            </IconButton>
          </Tooltip> */}
          <Tooltip title="Edit Team">
            <IconButton onClick={() => handleEditTeam(row)} color="info">
              <Edit />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete Player">
            <IconButton onClick={() => handleDeleteTeam(row)} color="error">
              <DeleteOutline />
            </IconButton>
          </Tooltip>
        </>
      ),
    },
  ];

  return (
    <Box m="20px">
      <Header title="Teams" subtitle="List of Soccer Teams" />
      <Button
        variant="contained"
        color="success"
        sx={{ mb: 2 }}
        startIcon={<AddIcon />}
        onClick={() => setOpenAddModal(true)}
      >
        Add New Team
      </Button>

      <AddTeamModal
        open={openAddModal}
        onClose={() => setOpenAddModal(false)}
        onSubmit={handleAddTeam}
        leagues={leagues}
        refreshTeams={fetchTeams}
      />

      <UpdateTeamModal
        open={openUpdateModal}
        onClose={() => setOpenUpdateModal(false)}
        onSubmit={handleUpdateTeam}
        team={selectedTeam}
        leagues={leagues}
      />
      
      <Box
        mt="40px"
        height="75vh"
        maxWidth="100%"
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
          rows={teams}
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

export default Teams;
