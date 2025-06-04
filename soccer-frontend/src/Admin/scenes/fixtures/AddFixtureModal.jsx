import React, { useState, useEffect } from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  MenuItem,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import { tokens } from "../../theme";
import api from "../../../api/axios";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: "90%", sm: 500 },
  maxHeight: "90vh",
  overflowY: "auto",
  bgcolor: "background.paper",
  borderRadius: 2,
  boxShadow: 24,
  p: { xs: 2, sm: 4 },
};

const AddFixtureModal = ({ open, onClose, onSubmit, teams, leagues }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [roster, setRoster] = useState([]);
  const [formData, setFormData] = useState({
    date: "",
    time: "",
    teamHome: "",
    teamAway: "",
    location: "",
    leagueId: "",
    status: "Scheduled",
    reportText: "",
    starPlayer: "",
    extraInfo: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadRoster = async () => {
      const ids = [formData.teamHome, formData.teamAway].filter(Boolean);
      if (!ids.length) {
        setRoster([]);
        return;
      }
      try {
        const responses = await Promise.all(
          ids.map((id) => api.get(`/teams/get-single-team/${id}`))
        );

        const combined = responses.flatMap((res) =>
          res.data.players.map((p) => {
            // console.log("TEAM PLAYERS RAW:", res.data.players);
            const populated = p.playerId;
            // console.log("TEAM PLAYERS RAW:", res.data.players);
            return {
              id: populated._id?.toString() ?? "",
              name: populated.name ?? "Unnamed Player",
            };
          })
        );

        const unique = Array.from(
          new Map(combined.map((item) => [item.id, item])).values()
        );

        setRoster(unique);
      } catch (err) {
        console.error("Failed to load roster", err);
        setRoster([]);
      }
    };
    loadRoster();
  }, [formData.teamHome, formData.teamAway]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    // Validate required
    const { date, time, teamHome, teamAway, location, leagueId } = formData;
    if (!date || !time || !teamHome || !teamAway || !location || !leagueId) {
      setError("Date, time, teams, location, and league are required.");
      return;
    }
    if (formData.teamHome === formData.teamAway) {
      setError("Home and Away teams must be different.");
      return;
    }
    setLoading(true);
    try {
      // call parent submit
      await onSubmit({
        date: formData.date,
        time: formData.time,
        teamHome: formData.teamHome,
        teamAway: formData.teamAway,
        location: formData.location,
        league: formData.leagueId,
        status: formData.status,
        reportText: formData.reportText,
        starPlayer: formData.starPlayer,
        extraInfo: formData.extraInfo,
      });
      // reset
      setFormData({
        date: "",
        time: "",
        teamHome: "",
        teamAway: "",
        location: "",
        leagueId: "",
        status: "Scheduled",
        reportText: "",
        starPlayer: "",
        extraInfo: "",
      });
      onClose();
    } catch (err) {
      setError(
        "Error adding fixture: " + (err.response?.data?.message || err.message)
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{ ...modalStyle, backgroundColor: colors.primary[400] }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Typography variant="h6" color={colors.greenAccent[400]}>
            Add New Fixture
          </Typography>
          <CloseIcon
            onClick={onClose}
            sx={{ cursor: "pointer", color: colors.redAccent[400] }}
          />
        </Box>
        {error && (
          <Box mb={2}>
            <Typography sx={{ color: "red", fontWeight: 500 }}>
              {error}
            </Typography>
          </Box>
        )}
        <form onSubmit={handleSubmit}>
          <TextField
            label="Date"
            type="date"
            name="date"
            fullWidth
            margin="normal"
            value={formData.date}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
            required
          />
          <TextField
            label="Time"
            type="time"
            name="time"
            fullWidth
            margin="normal"
            value={formData.time}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
            required
          />
          <TextField
            select
            name="teamHome"
            label="Home Team"
            fullWidth
            margin="normal"
            value={formData.teamHome}
            onChange={handleChange}
            required
          >
            {teams.map((team) => (
              <MenuItem key={team._id} value={team._id} disabled={team._id === formData.teamAway}>
                {team.name}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            name="teamAway"
            label="Away Team"
            fullWidth
            margin="normal"
            value={formData.teamAway}
            onChange={handleChange}
            required
          >
            {teams.map((team) => (
              <MenuItem key={team._id} value={team._id} disabled={team._id === formData.teamHome}>
                {team.name}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            name="location"
            label="Location"
            fullWidth
            margin="normal"
            value={formData.location}
            onChange={handleChange}
            required
          />
          <TextField
            select
            name="leagueId"
            label="League"
            fullWidth
            margin="normal"
            value={formData.leagueId}
            onChange={handleChange}
            required
          >
            {leagues.map((league) => (
              <MenuItem key={league._id} value={league._id}>
                {league.name}
              </MenuItem>
            ))}
          </TextField>
          {/* Optional fields */}
          <TextField
            select
            name="status"
            label="Status"
            fullWidth
            margin="normal"
            value={formData.status}
            onChange={handleChange}
          >
            {["Scheduled", "Ongoing", "Completed"].map((s) => (
              <MenuItem key={s} value={s}>
                {s}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            name="reportText"
            label="Report Text"
            fullWidth
            margin="normal"
            multiline
            rows={3}
            value={formData.reportText}
            onChange={handleChange}
          />
          <TextField
            select
            name="starPlayer"
            label="Star Player (optional)"
            fullWidth
            value={formData.starPlayer}
            onChange={handleChange}
          >
            <MenuItem value="">None</MenuItem>
            {roster.map((p) => (
              <MenuItem key={p.id} value={p.id}>
                {p.name}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            name="extraInfo"
            label="Extra Info"
            fullWidth
            margin="normal"
            value={formData.extraInfo}
            onChange={handleChange}
          />
          {error && (
            <Typography color="error" variant="body2" mb={2}>
              {error}
            </Typography>
          )}
          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={loading}
            sx={{
              backgroundColor: colors.greenAccent[600],
              color: "#fff",
              "&:hover": { backgroundColor: colors.greenAccent[700] },
              mt: 2,
            }}
          >
            {loading ? "Adding..." : "Add Fixture"}
          </Button>
        </form>
      </Box>
    </Modal>
  );
};

export default AddFixtureModal;
