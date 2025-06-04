import React, { useState, useEffect } from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  MenuItem,
  Grid,
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

const AddPlayerModal = ({ open, handleClose, onPlayerAdded }) => {
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
  const [imageFile, setImageFile] = useState(null);
  const [teams, setTeams] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const res = await api.get("/teams");
        setTeams(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    if (open) fetchTeams();
  }, [open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name in form.stats) {
      setForm((prev) => ({
        ...prev,
        stats: {
          ...prev.stats,
          [name]: Number(value),
        },
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    if (!imageFile) {
      setError("Please select an image file.");
      setLoading(false);
      return;
    }
    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("position", form.position);
      formData.append("biography", form.biography);
      formData.append("team", form.team);
      Object.entries(form.stats).forEach(([key, val]) => {
        formData.append(`stats[${key}]`, val);
      });
      formData.append("image", imageFile);

      const token = localStorage.getItem("token");
      await api.post("/players/add-player", formData, {
        headers: {
          Authorization: token ? `Bearer ${token}` : undefined,
          "Content-Type": "multipart/form-data",
        },
      });

      onPlayerAdded();
      handleClose();
      setForm({
        name: "",
        position: "",
        biography: "",
        team: "",
        stats: Object.fromEntries(
          Object.keys(form.stats).map((k) => [k, 0])
        ),
      });
      setImageFile(null);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to add player");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={{ ...modalStyle, backgroundColor: colors.primary[400] }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6" color={colors.greenAccent[400]}>
            Add New Player
          </Typography>
          <CloseIcon onClick={handleClose} sx={{ cursor: "pointer", color: colors.redAccent[400] }} />
        </Box>

        <form onSubmit={handleSubmit}>
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

          <Button
            variant="outlined"
            component="label"
            sx={{
              mt: { xs: 1, sm: 2 },
              mb: { xs: 1, sm: 2 },
              borderColor: colors.blueAccent[300],
              color: colors.blueAccent[300],
            }}
          >
            Upload Image
            <input type="file" name="image" hidden accept="image/*" onChange={handleFileChange} required />
          </Button>
          {imageFile && (
            <Typography variant="body2" mt={1}>
              {imageFile.name}
            </Typography>
          )}

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
              <MenuItem key={team._id} value={team._id}>
                {team.name}
              </MenuItem>
            ))}
          </TextField>

          <Grid container spacing={2}>
            {Object.entries(form.stats).map(([key, val]) => (
              <Grid item xs={12} sm={4} key={key}>
                <TextField
                  fullWidth
                  type="number"
                  label={key.replace(/([A-Z])/g, " $1")}
                  name={key}
                  value={val}
                  InputProps={{ inputProps: { min: 0} }}
                  onChange={handleChange}
                  variant="outlined"
                  margin="normal"
                />
              </Grid>
            ))}
          </Grid>

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
              "&:hover": {
                backgroundColor: colors.greenAccent[700],
              },
            }}
          >
            {loading ? "Adding..." : "Add Player"}
          </Button>
        </form>
      </Box>
    </Modal>
  );
};

export default AddPlayerModal;
