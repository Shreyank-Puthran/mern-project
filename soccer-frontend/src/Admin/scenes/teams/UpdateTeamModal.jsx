import React, { useState, useEffect } from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  MenuItem,
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

const UpdateTeamModal = ({ open, onClose, onSubmit, team, leagues }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    country: "",
    league: "",
    logo: null,
  });

  useEffect(() => {
    if (team) {
      setFormData({
        name: team.name || "",
        country: team.country || "",
        league: team.leagueId || "",
        logo: null,
      });
    }

  }, [team]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setFormData((prev) => ({ ...prev, logo: e.target.files[0] }));
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

    if (!formData.name || !formData.country || !formData.league) {
      setError("Name, Country and League are all required.");
      return;
    }

    if (!formData.logo) {
      setError("Please upload a logo for the team.");
      return;
    }

    const data = new FormData();
    data.append("name", formData.name);
    data.append("country", formData.country);
    data.append("league", formData.league);
    if (formData.logo) data.append("logo", formData.logo);
    onSubmit(team.id, data);
  };
  // console.log(formData.league);
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
            Update Team
          </Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon sx={{ color: colors.redAccent[400] }} />
          </IconButton>
        </Box>

        <Box
          component="form"
          onSubmit={handleFormSubmit}
          display="flex"
          flexDirection="column"
          gap={2}
        >
          <TextField
            name="name"
            label="Team Name"
            fullWidth
            variant="outlined"
            margin="normal"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <TextField
            name="country"
            label="Country"
            fullWidth
            variant="outlined"
            margin="normal"
            value={formData.country}
            onChange={handleChange}
            required
          />

          <TextField
            select
            name="league"
            label="League"
            fullWidth
            variant="outlined"
            margin="normal"
            value={formData.league}
            onChange={handleChange}
            required
          >
            {leagues.map((lg) => (
              <MenuItem key={lg._id} value={lg._id}>
                {lg.name}
              </MenuItem>
            ))}
          </TextField>

          <Button
            variant="outlined"
            component="label"
            sx={{
              borderColor: colors.blueAccent[300],
              color: colors.blueAccent[300],
            }}
          >
            Upload New Logo
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={handleFileChange}
            />
          </Button>
          {formData.logo && (
            <Typography variant="body2">{formData.logo.name}</Typography>
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
            sx={{
              backgroundColor: colors.greenAccent[600],
              color: "#fff",
              "&:hover": { backgroundColor: colors.greenAccent[700] },
            }}
          >
            Update Team
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default UpdateTeamModal;
