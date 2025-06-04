import React, { useState } from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  MenuItem,
} from "@mui/material";
import { tokens } from "../../theme";
import { useTheme } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import api from "../../../api/axios";

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
const AddTeamModal = ({ open, onClose, leagues, refreshTeams }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [formData, setFormData] = useState({
    name: "",
    country: "",
    leagueId: "",
    logo: null,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "logo") {
      setFormData({ ...formData, logo: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("country", formData.country);
      data.append("league", formData.leagueId);
      data.append("logo", formData.logo);

      const token = localStorage.getItem("token");
      await api.post("/teams/add-team", data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (!formData.logo) {
        setError("Please upload a logo");
        setLoading(false);
        return;
      }

      refreshTeams(); // reload team data
      onClose(); 
      setFormData({ name: "", country: "", leagueId: "", logo: null });
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
      console.error(
        "Team creation failed:",
        err.response?.data?.message || err.message
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
            Add New Team
          </Typography>
          <CloseIcon
            onClick={onClose}
            sx={{ cursor: "pointer", color: colors.redAccent[400] }}
          />
        </Box>

        <form onSubmit={handleSubmit}>
          <TextField
            name="name"
            label="Team Name"
            fullWidth
            variant="outlined"
            margin="normal"
            value={formData.name}
            onChange={handleInputChange}
            required
          />

          <TextField
            name="country"
            label="Country"
            fullWidth
            variant="outlined"
            margin="normal"
            value={formData.country}
            onChange={handleInputChange}
            required
          />

          <TextField
            select
            name="leagueId"
            label="League"
            fullWidth
            variant="outlined"
            margin="normal"
            value={formData.leagueId}
            onChange={handleInputChange}
            required
          >
            {leagues.map((league) => (
              <MenuItem key={league._id} value={league._id}>
                {league.name}
              </MenuItem>
            ))}
          </TextField>

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
            Upload Logo
            <input
              type="file"
              name="logo"
              hidden
              accept="image/*"
              onChange={handleInputChange}
              required
            />
          </Button>
          {formData.logo && (
            <Typography variant="body2" mt={1}>
              {formData.logo.name}
            </Typography>
          )}
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
            {loading ? "Adding..." : "Add Team"}
          </Button>
        </form>
      </Box>
    </Modal>
  );
};

export default AddTeamModal;
