import { useState, useEffect } from "react";
import {
  Box,
  useTheme,
  Avatar,
  Tooltip,
  IconButton,
  Button,
} from "@mui/material";
import { Header } from "../../components";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import {
  DeleteOutline,
  Visibility,
  Edit,
  Add as AddIcon,
} from "@mui/icons-material";

import api from "../../../api/axios";
import AddPlayerModal from "./AddPlayerModal";
import ViewPlayerModal from "./ViewPlayerModal";
import EditPlayerModal from "./EditPlayerModal";

const Players = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [players, setPlayers] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [openViewModal, setOpenViewModal] = useState(false);

  const fetchPlayers = async () => {
    try {
      const response = await api.get("/admin/summary");
      const formattedPlayers = response.data.players.map((player, index) => ({
        id: player._id || index,
        name: player.name || "",
        position: player.position || "",
        biography: player.biography || "",
        image: player.imageUrl || "",
        team: player.team?.name || null,
        stats: {
          goals: player.stats?.goals || 0,
          assists: player.stats?.assists || 0,
          matchesPlayed: player.stats?.matchesPlayed || 0,
          minutesPlayed: player.stats?.minutesPlayed || 0,
          passingAccuracy: player.stats?.passingAccuracy || 0,
          duelsWon: player.stats?.duelsWon || 0,
          duelsLost: player.stats?.duelsLost || 0,
          aerialDuelsWon: player.stats?.aerialDuelsWon || 0,
          aerialDuelsLost: player.stats?.aerialDuelsLost || 0,
          recoveries: player.stats?.recoveries || 0,
        },
      }));
      setPlayers(formattedPlayers);
    } catch (error) {
      console.log(error.message);
    }
  };

  // Fetch full player details by ID
  const fetchPlayerById = async (id) => {
    try {
      const response = await api.get(`/players/get-player/${id}`);
      return response.data;
    } catch (error) {
      console.error("Failed to fetch player details:", error);
      return null;
    }
  };

  useEffect(() => {
    fetchPlayers();
  }, []);

  const handleAddPlayer = () => {
    setOpenAddModal(true);
  };

  const handleEditPlayer = async (row) => {
    const fullPlayer = await fetchPlayerById(row.id);
    if (fullPlayer) {
      setSelectedPlayer(fullPlayer);
      setOpenUpdateModal(true);
    }
  };

  const handleViewPlayer = async (row) => {
    const fullPlayer = await fetchPlayerById(row.id);
    if (fullPlayer) {
      setSelectedPlayer(fullPlayer);
      setOpenViewModal(true);
    }
  };

  const handleDeletePlayer = async (player) => {
    if (confirm(`Delete player ${player.name}?`)) {
      try {
        await api.delete(`/players/remove-player/${player.id}`);
        fetchPlayers();
      } catch (err) {
        console.error("Delete failed:", err);
      }
    }
  };

  const handleCloseAddModal = () => setOpenAddModal(false);
  const handleCloseUpdateModal = () => {
    setOpenUpdateModal(false);
    setSelectedPlayer(null);
  };
  const handleCloseViewModal = () => {
    setOpenViewModal(false);
    setSelectedPlayer(null);
  };

  const columns = [
    { field: "id", headerName: "ID", width: 120 },
    { field: "name", headerName: "Name", flex: 1 },
    { field: "position", headerName: "Position", flex: 1 },
    { field: "team", headerName: "Team", flex: 1 },
    {
      field: "goals",
      headerName: "Goals",
      type: "number",
      width: 100,
      valueGetter: (params) => params.row.stats?.goals ?? 0,
    },
    {
      field: "image",
      headerName: "Image",
      width: 90,
      sortable: false,
      renderCell: ({ value }) => (
        <Avatar src={value} alt="Player" sx={{ width: 40, height: 40 }} />
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
          <Tooltip title="View Player">
            <IconButton onClick={() => handleViewPlayer(row)} color="primary">
              <Visibility />
            </IconButton>
          </Tooltip>
          <Tooltip title="Edit Player">
            <IconButton onClick={() => handleEditPlayer(row)} color="info">
              <Edit />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete Player">
            <IconButton onClick={() => handleDeletePlayer(row)} color="error">
              <DeleteOutline />
            </IconButton>
          </Tooltip>
        </>
      ),
    },
  ];

  return (
    <Box m="20px">
      <Header title="Players" subtitle="List of All Players" />
      <Box>
        <Button
          variant="contained"
          color="success"
          startIcon={<AddIcon />}
          onClick={handleAddPlayer}
          sx={{ mb: 2 }}
        >
          Add Player
        </Button>
      </Box>

      <Box
        height="75vh"
        sx={{
          overflowX: "auto",
          "& .MuiDataGrid-root": { border: "none", minWidth: 900 },
          "& .MuiDataGrid-cell": { border: "none" },
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
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: `${colors.gray[100]} !important`,
          },
        }}
      >
        <DataGrid
          rows={players}
          columns={columns}
          slots={{ toolbar: GridToolbar }}
          pageSizeOptions={[10, 25, 50]}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 10,
              },
            },
          }}
        />
      </Box>

      {/* Add Player Modal */}
      {openAddModal && (
        <AddPlayerModal
          open={openAddModal}
          handleClose={handleCloseAddModal}
          onPlayerAdded={fetchPlayers}
        />
      )}

      {/* Update Player Modal */}
      {openUpdateModal && selectedPlayer && (
        <EditPlayerModal
          open={openUpdateModal}
          handleClose={handleCloseUpdateModal}
          playerId={selectedPlayer._id}
          onPlayerUpdated={fetchPlayers}
        />
      )}

      {/* View Player Modal */}
      {openViewModal && selectedPlayer && (
        <ViewPlayerModal
          open={openViewModal}
          handleClose={handleCloseViewModal}
          player={selectedPlayer}
        />
      )}
    </Box>
  );
};

export default Players;
