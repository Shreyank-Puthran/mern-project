import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  TextField,
  MenuItem,
  Button,
  Typography, // Import Typography for error display
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import { tokens } from "../../theme";
import api from "../../../api/axios"; // Assuming you need this for fetching team data

const UpdateFixtureModal = ({
  open,
  onClose,
  onSubmit,
  fixture,
  players,
  teams,
  leagues,
}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
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
  const [roster, setRoster] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!fixture) return;
    setFormData({
      date: fixture.date
        ? new Date(fixture.date).toISOString().slice(0, 10)
        : "",
      time: fixture.time || "",
      teamHome: fixture.teamHomeId || "",
      teamAway: fixture.teamAwayId || "",
      location: fixture.location || "",
      leagueId: fixture.leagueId || "",
      status: fixture.status || "Scheduled",
      reportText: fixture.reportText || "",
      starPlayer: fixture.starPlayerId || "",
      extraInfo: fixture.extraInfo || "",
    });
  }, [fixture]);

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
          res.data.players.map((p) => ({
            // id: p.playerId._id,
            id: String(p.playerId._id),
            name: p.playerId.name,
          }))
        );

        // Remove duplicate players if they exist in both teams
        const uniqueRoster = Array.from(
          new Map(combined.map((player) => [player.id, player])).values()
        );
        setRoster(uniqueRoster);
      } catch (err) {
        console.error("Failed to load roster", err);
        setRoster([]);
      }
    };

    loadRoster();
  }, [formData.teamHome, formData.teamAway]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const { date, time, teamHome, teamAway, location, leagueId } = formData;
    if (!date || !time || !teamHome || !teamAway || !location || !leagueId) {
      setError("Date, time, teams, location, and league are required.");
      return;
    }
    if (teamHome === teamAway) {
      setError("Home and Away teams must be different.");
      return;
    }
    setLoading(true);
    try {
      await onSubmit(fixture.id, {
        date: formData.date,
        time: formData.time,
        teamHome: formData.teamHome,
        teamAway: formData.teamAway,
        location: formData.location,
        league: formData.leagueId,
        status: formData.status,
        reportText: formData.reportText,
        starPlayer: formData.starPlayer || null,
        extraInfo: formData.extraInfo,
      });
      setLoading(false);
      onClose();
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || "Error updating fixture"
      );
      setLoading(false);
    }
  };

  // useEffect(() => {
  //   console.log("FormData initialized:", formData);
  // }, [formData]);

  useEffect(() => {
    if (!open) {
      setError("");
      setLoading(false);
    }
  }, [open]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ bgcolor: colors.primary[400] }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          Update Fixture
          <CloseIcon
            onClick={onClose}
            sx={{ cursor: "pointer", color: colors.redAccent[400] }}
          />
        </Box>
      </DialogTitle>
      <DialogContent sx={{ bgcolor: colors.primary[400] }}>
        <Box
          component="form"
          display="flex"
          flexDirection="column"
          gap={2}
          mt={1}
          onSubmit={handleSubmit}
        >
          <TextField
            label="Date"
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
            required
          />
          <TextField
            label="Time"
            type="time"
            name="time"
            value={formData.time}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
            required
          />
          <TextField
            select
            name="teamHome"
            label="Home Team"
            value={formData.teamHome}
            onChange={handleChange}
            required
          >
            {teams.map((team) => (
              <MenuItem
                key={team._id}
                value={team._id}
                disabled={team._id === formData.teamAway}
              >
                {team.name}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            name="teamAway"
            label="Away Team"
            value={formData.teamAway}
            onChange={handleChange}
            required
          >
            {teams.map((team) => (
              <MenuItem
                key={team._id}
                value={team._id}
                disabled={team._id === formData.teamHome}
              >
                {team.name}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
          />
          <TextField
            select
            name="leagueId"
            label="League"
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
          <TextField
            select
            name="status"
            label="Status"
            value={formData.status}
            onChange={handleChange}
          >
            {["Scheduled", "Ongoing", "Completed"].map((status) => (
              <MenuItem key={status} value={status}>
                {status}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            multiline
            rows={3}
            label="Report Text"
            name="reportText"
            value={formData.reportText}
            onChange={handleChange}
          />
          <TextField
            select
            name="starPlayer"
            label="Star Player"
            value={formData.starPlayer}
            onChange={handleChange}
            helperText="Select star player from participating teams"
          >
            <MenuItem value="">None</MenuItem>
            {formData.starPlayer &&
              !roster.find((p) => p.id === formData.starPlayer) && (
                <MenuItem value={formData.starPlayer}>
                  {/* show the old name */}
                  {fixture.starPlayer}
                </MenuItem>
              )}

            {roster
              .sort((a, b) => a.name.localeCompare(b.name))
              .map((player) => (
                <MenuItem key={player.id} value={player.id}>
                  {player.name}
                </MenuItem>
              ))}
          </TextField>
          <TextField
            label="Extra Info"
            name="extraInfo"
            value={formData.extraInfo}
            onChange={handleChange}
          />
          {error && (
            <Typography color="error" variant="body2">
              {error}
            </Typography>
          )}
        </Box>
      </DialogContent>
      <DialogActions sx={{ bgcolor: colors.primary[400], px: 3, pb: 2 }}>
        {/* <Button onClick={onClose} color="secondary" disabled={loading}>
          Cancel
        </Button> */}
        <Button
          onClick={handleSubmit}
          // type="submit"
          variant="contained"
          color="secondary"
          disabled={loading}
        >
          {loading ? "Updating..." : "Update Fixture"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UpdateFixtureModal;
