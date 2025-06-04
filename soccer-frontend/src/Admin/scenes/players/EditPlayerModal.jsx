import React, { useState, useEffect } from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  MenuItem,
  Grid,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import api from "../../../api/axios";
import { tokens } from "../../theme";
import { useTheme } from "@mui/material/styles";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: "90%", sm: 400 },
  maxHeight: "90vh",
  overflowY: "auto",
  bgcolor: "background.paper",
  borderRadius: 2,
  boxShadow: 24,
  p: { xs: 2, sm: 4 },
};

const EditPlayerModal = ({ open, handleClose, playerId, onPlayerUpdated }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [form, setForm] = useState({
    name: "",
    position: "",
    biography: "",
    team: "",
    stats: {
      goals: 0,
      assists: 0,
      matchesPlayed: 0,
      minutesPlayed: 0,
      passingAccuracy: 0,
      duelsWon: 0,
      duelsLost: 0,
      aerialDuelsWon: 0,
      aerialDuelsLost: 0,
      recoveries: 0,
    },
  });
  const [teams, setTeams] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [currentImageUrl, setCurrentImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;
    (async () => {
      try {
        const [teamsRes, playerRes] = await Promise.all([
          api.get("/teams"),
          api.get(`/players/get-player/${playerId}`),
        ]);
        setTeams(teamsRes.data);
        const player = playerRes.data;
        setForm({
          name: player.name || "",
          position: player.position || "",
          biography: player.biography || "",
          team: player.team?._id || "",
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
        });
        setCurrentImageUrl(player.imageUrl || "");
        setImageFile(null);
      } catch (err) {
        console.error(err);
      }
    })();
  }, [open, playerId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name in form.stats) {
      setForm((prev) => ({
        ...prev,
        stats: { ...prev.stats, [name]: Number(value) },
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setImageFile(e.target.files[0]);
      setCurrentImageUrl("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("position", form.position);
      formData.append("biography", form.biography);
      formData.append("team", form.team);
      formData.append("stats", JSON.stringify(form.stats));
      if (imageFile) formData.append("image", imageFile);

      await api.patch(`/players/update-player/${playerId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      onPlayerUpdated();
      handleClose();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to update player");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={{ ...modalStyle, backgroundColor: colors.primary[400] }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6" color={colors.greenAccent[400]}>Edit Player</Typography>
          <IconButton onClick={handleClose} size="small">
            <CloseIcon sx={{ color: colors.redAccent[400] }} />
          </IconButton>
        </Box>
        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            name="name"
            label="Name"
            fullWidth
            variant="outlined"
            margin="normal"
            value={form.name}
            onChange={handleChange}
            required
          />
          <TextField
            name="position"
            label="Position"
            fullWidth
            variant="outlined"
            margin="normal"
            value={form.position}
            onChange={handleChange}
            required
          />
          <TextField
            name="biography"
            label="Biography"
            fullWidth
            variant="outlined"
            margin="normal"
            multiline
            rows={3}
            value={form.biography}
            onChange={handleChange}
          />

          {currentImageUrl && (
            <Box mb={2}>
              <Typography variant="subtitle2">Current Image:</Typography>
              <Box
                component="img"
                src={currentImageUrl}
                alt="Player"
                sx={{
                  width: '100%',
                  maxHeight: 150,
                  borderRadius: 1,
                  objectFit: 'cover',
                  mt: 1,
                }}
              />
            </Box>
          )}

          <Button
            variant="outlined"
            component="label"
            sx={{ mt: 2, mb: 2, borderColor: colors.blueAccent[300], color: colors.blueAccent[300] }}
          >
            Upload Image
            <input type="file" hidden accept="image/*" onChange={handleFileChange} />
          </Button>
          {imageFile && <Typography variant="body2" mb={2}>{imageFile.name}</Typography>}

          <TextField
            select
            name="team"
            label="Team"
            fullWidth
            variant="outlined"
            margin="normal"
            value={form.team}
            onChange={handleChange}
            required
          >
            {teams.map((team) => (
              <MenuItem key={team._id} value={team._id}>{team.name}</MenuItem>
            ))}
          </TextField>

          <Grid container spacing={2}>
            {Object.entries(form.stats).map(([key, val]) => (
              <Grid item xs={12} sm={6} md={4} key={key}>
                <TextField
                  fullWidth
                  type="number"
                  label={key.replace(/([A-Z])/g, ' $1')}
                  name={key}
                  value={val}
                  onChange={handleChange}
                  variant="outlined"
                  margin="normal"
                  InputProps={{ inputProps: { min: 0 } }}
                />
              </Grid>
            ))}
          
          </Grid>
          {error && <Typography color="error" variant="body2" mb={2}>{error}</Typography>}

          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={loading}
            sx={{ backgroundColor: colors.greenAccent[600], color: '#fff', '&:hover': { backgroundColor: colors.greenAccent[700] } }}
          >
            {loading ? 'Updating...' : 'Update Player'}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default EditPlayerModal;
