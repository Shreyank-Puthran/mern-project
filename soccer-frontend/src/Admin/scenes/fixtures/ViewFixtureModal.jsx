import {
  Modal,
  Box,
  Typography,
  Grid,
  Divider,
  IconButton,
} from "@mui/material";
import { tokens } from "../../theme";
import { useTheme } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";

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

const ViewFixtureModal = ({ open, onClose, fixture }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  if (!fixture) return null;

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="fixture-details-title"
      aria-describedby="fixture-details-description"
    >
      <Box sx={{ ...modalStyle, backgroundColor: colors.primary[400] }}>
        {/* Header */}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Typography variant="h6" color={colors.greenAccent[400]}>
            Fixture Details
          </Typography>
          <IconButton onClick={onClose}>
            <CloseIcon sx={{ color: colors.redAccent[400] }} />
          </IconButton>
        </Box>

        {/* Fixture basic info */}
        <Box mb={2}>
          <Typography variant="h5" color={colors.gray[100]} mb={1}>
            {fixture.teamHome} vs {fixture.teamAway}
          </Typography>
          <Typography variant="subtitle1" color={colors.gray[200]}>
            League: {fixture.league || "N/A"}
          </Typography>
          <Typography variant="subtitle1" color={colors.gray[200]}>
            Date: {fixture.date || "N/A"} | Time: {fixture.time || "N/A"}
          </Typography>
          <Typography variant="subtitle1" color={colors.gray[200]}>
            Location: {fixture.location || "N/A"}
          </Typography>
          <Typography variant="subtitle1" color={colors.gray[200]}>
            Status: {fixture.status || "N/A"}
          </Typography>
        </Box>

        <Divider sx={{ mb: 2 }} />

        {/* Additional details */}
        <Grid container spacing={2}>
          {fixture.reportText && (
            <Grid item xs={12}>
              <Typography
                variant="subtitle2"
                color={colors.greenAccent[300]}
                mb={1}
              >
                Match Report
              </Typography>
              <Typography variant="body2" color={colors.gray[300]}>
                {fixture.reportText}
              </Typography>
            </Grid>
          )}

          {fixture.starPlayer && (
            <Grid item xs={12}>
              <Typography
                variant="subtitle2"
                color={colors.greenAccent[300]}
                mb={1}
              >
                Star Player
              </Typography>
              <Typography variant="body2" color={colors.gray[300]}>
                {fixture.starPlayer}
              </Typography>
            </Grid>
          )}

          {fixture.extraInfo && (
            <Grid item xs={12}>
              <Typography
                variant="subtitle2"
                color={colors.greenAccent[300]}
                mb={1}
              >
                Extra Information
              </Typography>
              <Typography variant="body2" color={colors.gray[300]}>
                {fixture.extraInfo}
              </Typography>
            </Grid>
          )}
        </Grid>
      </Box>
    </Modal>
  );
};

export default ViewFixtureModal;
