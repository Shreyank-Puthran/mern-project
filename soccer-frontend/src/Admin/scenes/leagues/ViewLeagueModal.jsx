import { Modal, Box, Typography, Avatar, Grid, Divider } from "@mui/material";
import { tokens } from "../../theme";
import { useTheme } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";

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

const ViewLeagueModal = ({ open, onClose, league }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  if (!league) return null;

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{ ...modalStyle, backgroundColor: colors.primary[400] }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6" color={colors.greenAccent[400]}>League Details</Typography>
          <IconButton onClick={onClose}>
            <CloseIcon sx={{ color: colors.redAccent[400] }} />
          </IconButton>
        </Box>

        <Box display="flex" alignItems="center" mb={2}>
          <Avatar src={league.logo?.url} sx={{ width: 60, height: 60, mr: 2 }} />
          <Box>
            <Typography variant="h5" color={colors.gray[100]}>
              {league.name}
            </Typography>
            <Typography variant="subtitle1" color={colors.gray[200]}>Country: {league.country}</Typography>
          </Box>
        </Box>

        {Array.isArray(league.teams) && league.teams.length > 0 && (
          <>
            <Divider sx={{ mb: 2 }} />
            <Typography variant="subtitle1" color={colors.greenAccent[300]} mb={1}>
              Teams & Stats
            </Typography>
            {league.teams.map((entry, idx) => (
              <Box key={idx} mb={2}>
                <Typography variant="subtitle2" color={colors.blueAccent[200]}>Team {idx + 1}: {entry.team.name || entry.team}</Typography>
                <Grid container spacing={1}>
                  {['home', 'away'].map(section => (
                    <Grid item xs={12} key={section}>
                      <Typography variant="body2" color={colors.gray[300]}>{section.toUpperCase()} - Matches: {entry[section].matchesPlayed}, Wins: {entry[section].wins}, Draws: {entry[section].draws}, Losses: {entry[section].losses}, GF: {entry[section].goalsFor}, GA: {entry[section].goalsAgainst}, Pts: {entry[section].points}</Typography>
                    </Grid>
                  ))}
                  <Grid item xs={12}>
                    <Typography variant="body2" color={colors.gray[300]}>OVERALL - Matches: {entry.overall.totalMatchesPlayed}, Wins: {entry.overall.totalWins}, Draws: {entry.overall.totalDraws}, Losses: {entry.overall.totalLosses}, Points: {entry.overall.totalPoints}</Typography>
                  </Grid>
                </Grid>
                <Divider sx={{ mt: 2 }} />
              </Box>
            ))}
          </>
        )}
      </Box>
    </Modal>
  );
};

export default ViewLeagueModal;
