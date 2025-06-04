import React, { useState, useEffect } from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  MenuItem,
  IconButton,
  Grid,
  Divider,
} from "@mui/material";
import { tokens } from "../../theme";
import { useTheme } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import api from "../../../api/axios";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: "90%", sm: 600 },
  maxHeight: "90vh",
  overflowY: "auto",
  bgcolor: "background.paper",
  borderRadius: 2,
  boxShadow: 24,
  p: { xs: 2, sm: 4 },
};

const defaultStats = {
  matchesPlayed: "",
  wins: "",
  draws: "",
  losses: "",
  goalsFor: "",
  goalsAgainst: "",
  points: "",
};

const AddLeagueModal = ({ open, onClose, refreshLeagues }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [formData, setFormData] = useState({
    name: "",
    country: "",
    logo: null,
    teams: [],
  });
  const [allTeams, setAllTeams] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [logoError, setLogoError] = useState(false);

  useEffect(() => {
    // fetch existing teams for selection
    const fetchTeams = async () => {
      try {
        const res = await api.get("/admin/summary");
        setAllTeams(res.data.teams || []);
      } catch (err) {
        console.error("Failed to load teams for league:", err);
      }
    };
    fetchTeams();
  }, []);

  const handleBasicChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "logo") {
      setFormData((prev) => ({ ...prev, logo: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleTeamChange = (index, field, key) => (e) => {
    const value = e.target.value;
    setFormData((prev) => {
      const teams = [...prev.teams];
      if (!teams[index][field]) teams[index][field] = { ...defaultStats };
      teams[index][field][key] = value;
      return { ...prev, teams };
    });
  };

  const handleSelectTeam = (index) => (e) => {
    const teamId = e.target.value;
    setFormData((prev) => {
      const teams = [...prev.teams];
      teams[index].team = teamId;
      return { ...prev, teams };
    });
  };

  const addTeamEntry = () => {
    setFormData((prev) => ({
      ...prev,
      teams: [
        ...prev.teams,
        {
          team: "",
          home: { ...defaultStats },
          away: { ...defaultStats },
          overall: { ...defaultStats },
        },
      ],
    }));
  };

  const removeTeamEntry = (idx) => () => {
    setFormData((prev) => ({
      ...prev,
      teams: prev.teams.filter((_, i) => i !== idx),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!formData.logo) {
      setLogoError(true);
      setLoading(false);
      return;
    }

    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("country", formData.country);
      data.append("logo", formData.logo);
      data.append("teams", JSON.stringify(formData.teams));

      const token = localStorage.getItem("token");
      await api.post("/league/add-league", data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      refreshLeagues();
      onClose();
      setFormData({ name: "", country: "", logo: null, teams: [] });
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
      console.error("League creation failed:", err);
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
            Add New League
          </Typography>
          <IconButton onClick={onClose}>
            <CloseIcon sx={{ color: colors.redAccent[400] }} />
          </IconButton>
        </Box>

        <form onSubmit={handleSubmit}>
          <TextField
            name="name"
            label="League Name"
            fullWidth
            variant="outlined"
            margin="normal"
            value={formData.name}
            onChange={handleBasicChange}
            required
          />

          <TextField
            name="country"
            label="Country"
            fullWidth
            variant="outlined"
            margin="normal"
            value={formData.country}
            onChange={handleBasicChange}
            required
          />

          <Box sx={{ mt: 2, mb: 2 }}>
            <Button
              variant="outlined"
              component="label"
              sx={{
                borderColor: colors.blueAccent[300],
                color: colors.blueAccent[300],
              }}
            >
              Upload Logo*
              <input
                type="file"
                name="logo"
                hidden
                accept="image/*"
                onChange={(e) => {
                  handleBasicChange(e);
                  setLogoError(false); // clear error on new file
                }}
              />
            </Button>
            {formData.logo && (
              <Typography variant="body2" mt={1}>
                {formData.logo.name}
              </Typography>
            )}
            {logoError && (
              <Typography color="error" variant="body2" mt={1}>
                Please upload a logo
              </Typography>
            )}
          </Box>

          <Divider sx={{ my: 2 }} />
          <Typography
            variant="subtitle1"
            color={colors.greenAccent[300]}
            mb={1}
          >
            Optional Teams & Stats
          </Typography>
          {formData.teams.map((entry, idx) => (
            <Box
              key={idx}
              mb={2}
              p={2}
              sx={{
                border: `1px solid ${colors.blueAccent[200]}`,
                borderRadius: 1,
              }}
            >
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={10}>
                  <TextField
                    select
                    label="Select Team"
                    fullWidth
                    value={entry.team}
                    onChange={handleSelectTeam(idx)}
                    required
                  >
                    {allTeams.map((team) => (
                      <MenuItem key={team._id} value={team._id}>
                        {team.name}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={2}>
                  <IconButton onClick={removeTeamEntry(idx)} color="error">
                    <RemoveCircleOutlineIcon />
                  </IconButton>
                </Grid>

                {["home", "away"].map((section) => (
                  <React.Fragment key={section}>
                    <Grid item xs={12}>
                      <Typography
                        variant="subtitle2"
                        color={colors.blueAccent[200]}
                      >
                        {section.toUpperCase()}
                      </Typography>
                    </Grid>
                    {Object.keys(defaultStats).map((key) => (
                      <Grid item xs={4} key={key + section}>
                        <TextField
                          label={key}
                          type="number"
                          fullWidth
                          InputProps={{ inputProps: { min: 0 } }}
                          name={key}
                          value={entry[section]?.[key] || ""}
                          onChange={handleTeamChange(idx, section, key)}
                        />
                      </Grid>
                    ))}
                  </React.Fragment>
                ))}

                {/* <Grid item xs={12}>
                  <Typography
                    variant="subtitle2"
                    color={colors.blueAccent[200]}
                  >
                    OVERALL
                  </Typography>
                </Grid>
                {Object.keys(entry.overall).map((key) => (
                  <Grid item xs={4} key={key}>
                    <TextField
                      label={key}
                      type="number"
                      fullWidth
                      name={key}
                      InputProps={{ inputProps: { min: 0} }}
                      value={entry.overall[key]}
                      onChange={handleTeamChange(idx, "overall", key)}
                    />
                  </Grid>
                ))} */}
              </Grid>
            </Box>
          ))}

          <Button
            startIcon={<AddCircleOutlineIcon />}
            onClick={addTeamEntry}
            sx={{ mb: 2, color: colors.blueAccent[300] }}
          >
            Add Team Stats
          </Button>

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
            }}
          >
            {loading ? "Adding..." : "Add League"}
          </Button>
        </form>
      </Box>
    </Modal>
  );
};

export default AddLeagueModal;