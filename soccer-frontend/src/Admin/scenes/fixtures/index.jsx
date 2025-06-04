import { useState, useEffect } from "react";
import {
  Box,
  Button,
  useTheme,
  Tooltip,
  IconButton,
  Avatar,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { Add as AddIcon, Edit, DeleteOutline } from "@mui/icons-material";
import { Header } from "../../components";
import { tokens } from "../../theme";
import api from "../../../api/axios";
import AddFixtureModal from "./AddFixtureModal";
import UpdateFixtureModal from "./UpdateFixtureModal";
import ViewFixtureModal from "./ViewFixtureModal";
import VisibilityIcon from "@mui/icons-material/Visibility";

const Fixtures = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [fixtures, setFixtures] = useState([]);
  const [players, setPlayers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [leagues, setLeagues] = useState([]);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [selectedFixture, setSelectedFixture] = useState(null);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [selectedFixtureForView, setSelectedFixtureForView] = useState(null);

  const fetchFixtures = async () => {
    try {
      const res = await api.get("/fixtures");
      const formatted = res.data.map((f) => ({
        id: f._id,
        date: new Date(f.date).toLocaleDateString(),
        time: f.time,
        location: f.location,
        teamHome: f.teamHome?.name,
        teamAway: f.teamAway?.name,
        teamHomeId: f.teamHome?._id,
        teamAwayId: f.teamAway?._id,
        leagueId: f.league?._id,
        league: f.league?.name,
        status: f.status,
        reportText: f.reportText,
        starPlayerId: f.starPlayer?._id,
        starPlayer: f.starPlayer?.name,
      }));
      console.log(formatted);
      setFixtures(formatted);
    } catch (err) {
      console.error("Failed to load fixtures", err);
    }
  };

  const fetchPlayers = async () => {
    try {
      const res = await api.get("/players");
      setPlayers(res.data);
    } catch (err) {
      console.error("Failed to load players", err);
    }
  };

  const fetchTeams = async () => {
    try {
      const res = await api.get("/teams");
      setTeams(res.data);
    } catch (err) {
      console.error("Failed to load teams", err);
    }
  };

  const fetchLeagues = async () => {
    try {
      const res = await api.get("/league");
      setLeagues(res.data);
    } catch (err) {
      console.error("Failed to load leagues", err);
    }
  };

  useEffect(() => {
    fetchFixtures();
    fetchPlayers();
    fetchTeams();
    fetchLeagues();
  }, []);

  const handleAddFixture = async (formData) => {
    try {
      await api.post("/fixtures/add-fixture", formData);
      fetchFixtures();
      setOpenAddModal(false);
    } catch (err) {
      console.error(
        "Error adding fixture",
        err.response?.data?.message || err.message
      );
    }
  };

  const handleViewFixture = (fixture) => {
    setSelectedFixtureForView(fixture);
    setOpenViewModal(true);
  };

  const handleEditFixture = (fixture) => {
      console.log("Editing fixture:", fixture);
    setSelectedFixture(fixture);
    setOpenUpdateModal(true);
  };

  const handleUpdateFixture = async (fixtureId, formData) => {
    try {
      await api.patch(`/fixtures/update-fixture/${fixtureId}`, formData);
      fetchFixtures();
      setOpenUpdateModal(false);
    } catch (err) {
      console.error(
        "Error adding fixture",
        err.response?.data?.message || err.message
      );
    }
  };

  const handleDeleteFixture = async (fixture) => {
    if (confirm(`Delete fixture on ${fixture.date} ${fixture.time}?`)) {
      try {
        await api.delete(`/fixtures/delete-fixture/${fixture.id}`);
        fetchFixtures();
      } catch (err) {
        console.error(
          "Error adding fixture",
          err.response?.data?.message || err.message
        );
      }
    }
  };

  const columns = [
    { field: "id", headerName: "ID", width: 120 },
    { field: "date", headerName: "Date", flex: 1 },
    { field: "time", headerName: "Time", flex: 1 },
    { field: "location", headerName: "Location", flex: 1 },
    { field: "teamHome", headerName: "Home Team", flex: 1 },
    { field: "teamAway", headerName: "Away Team", flex: 1 },
    { field: "league", headerName: "League", flex: 1 },
    { field: "status", headerName: "Status", flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      width: 120,
      sortable: false,
      renderCell: ({ row }) => (
        <>
          <Tooltip title="View Fixture">
            <IconButton onClick={() => handleViewFixture(row)} color="primary">
              <VisibilityIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Edit Fixture">
            <IconButton onClick={() => handleEditFixture(row)} color="info">
              <Edit />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete Fixture">
            <IconButton onClick={() => handleDeleteFixture(row)} color="error">
              <DeleteOutline />
            </IconButton>
          </Tooltip>
        </>
      ),
    },
  ];
  return (
    <Box m="20px">
      <Header title="Fixtures" subtitle="List of Match Fixtures" />
      <Button
        variant="contained"
        color="success"
        sx={{ mb: 2 }}
        startIcon={<AddIcon />}
        onClick={() => setOpenAddModal(true)}
      >
        Add New Fixture
      </Button>

      <AddFixtureModal
        open={openAddModal}
        onClose={() => setOpenAddModal(false)}
        onSubmit={handleAddFixture}
        players={players}
        teams={teams}
        leagues={leagues}
      />

      <UpdateFixtureModal
        open={openUpdateModal}
        onClose={() => setOpenUpdateModal(false)}
        onSubmit={handleUpdateFixture}
        fixture={selectedFixture}
        players={players}
        teams={teams}
        leagues={leagues}
      />

      <ViewFixtureModal
        open={openViewModal}
        onClose={() => setOpenViewModal(false)}
        fixture={selectedFixtureForView}
      />

      <Box
        mt="40px"
        height="75vh"
        sx={{
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
        }}
      >
        <DataGrid
          rows={fixtures}
          columns={columns}
          pageSizeOptions={[10, 25, 50]}
          initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
          checkboxSelection
        />
      </Box>
    </Box>
  );
};

export default Fixtures;
